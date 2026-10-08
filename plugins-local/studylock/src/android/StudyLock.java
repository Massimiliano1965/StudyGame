package it.massi.studylock;

import android.app.admin.DevicePolicyManager;
import android.Manifest;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class StudyLock extends CordovaPlugin {

  @Override
  public boolean execute(String action, JSONArray args, CallbackContext cb) throws JSONException {
    Context c = cordova.getActivity().getApplicationContext();
    SharedPreferences p = LockService.prefs(c);
    LockService.rollDay(p);
    try {
      if (action.equals("status")) {
        ensure(c);
        cb.success(status(c));
        return true;
      }
      if (action.equals("setEnabled")) {
        boolean on = args.getBoolean(0);
        p.edit().putBoolean("enabled", on).apply();
        if (on) ensure(c); else c.stopService(new Intent(c, LockService.class));
        cb.success(status(c));
        return true;
      }
      if (action.equals("unlock")) {
        int min = args.getInt(0);
        if (min > 0) p.edit().putLong("left", p.getLong("left", 0) + min * 60000L).apply();
        ensure(c);
        cb.success(status(c));
        return true;
      }
      if (action.equals("emergency")) {
        LockService.startEmergency(c);
        cb.success(status(c));
        return true;
      }
      if (action.equals("lockNow")) {
        p.edit().putLong("left", 0).putLong("emergencyUntil", 0).apply();
        cb.success(status(c));
        return true;
      }
      if (action.equals("setContacts")) {
        // tre numeri di emergenza [{n: nome, t: numero}]: li chiama la schermata di blocco anche senza minuti
        JSONArray l = args.getJSONArray(0);
        SharedPreferences.Editor e = p.edit();
        boolean any = false;
        for (int i = 0; i < 3; i++) {
          JSONObject o = i < l.length() ? l.optJSONObject(i) : null;
          String n = o == null ? "" : o.optString("n", "").trim();
          String t = o == null ? "" : o.optString("t", "").replaceAll("[^0-9+*#]", "");
          if (n.length() > 20) n = n.substring(0, 20);
          if (t.length() > 0) any = true;
          e.putString("em" + i + "n", n).putString("em" + i + "t", t);
        }
        e.apply();
        if (any && Build.VERSION.SDK_INT >= 23 && !cordova.hasPermission(Manifest.permission.CALL_PHONE)) {
          cordova.requestPermission(this, 7001, Manifest.permission.CALL_PHONE);
        }
        cb.success(status(c));
        return true;
      }
      if (action.equals("setPin")) {
        // impronta del PIN dei genitori (la stessa di hashPin() in app.js): serve a chiedere il PIN davanti a Impostazioni e disinstallazione
        p.edit().putString("pinHash", args.isNull(0) ? "" : args.getString(0)).putInt("guardFails", 0).apply();
        cb.success(status(c));
        return true;
      }
      if (action.equals("requestAdmin")) {
        Intent i = new Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN);
        i.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, adminComp(c));
        i.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, "Protegge Gioca e Impara: finche' e' attivo, l'app non si puo' disinstallare. Non da' nessun controllo sul telefono.");
        openSettings(c, p, i);
        cb.success(status(c));
        return true;
      }
      if (action.equals("releaseAdmin")) {
        // chiamata dalla parte web solo dopo il PIN dei genitori
        DevicePolicyManager dpm = (DevicePolicyManager) c.getSystemService(Context.DEVICE_POLICY_SERVICE);
        if (dpm != null && dpm.isAdminActive(adminComp(c))) dpm.removeActiveAdmin(adminComp(c));
        cb.success(status(c));
        return true;
      }
      if (action.equals("openOverlaySettings")) {
        openSettings(c, p, new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + c.getPackageName())));
        cb.success(status(c));
        return true;
      }
      if (action.equals("openAppInfo")) {
        openSettings(c, p, new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + c.getPackageName())));
        cb.success(status(c));
        return true;
      }
      if (action.equals("openUsageSettings")) {
        openSettings(c, p, new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS));
        cb.success(status(c));
        return true;
      }
    } catch (Throwable t) {
      cb.error(String.valueOf(t));
      return true;
    }
    return false;
  }


  /**
   * Apre una schermata delle Impostazioni di Android DENTRO il task dell'app (con l'Activity, senza NEW_TASK):
   * cosi' la freccia indietro riporta qui. Per 5 minuti il blocco non copre le Impostazioni, altrimenti
   * i genitori ci finirebbero davanti la schermata «Telefono in pausa» e non riuscirebbero a tornare.
   */
  private void openSettings(final Context c, SharedPreferences p, final Intent i) {
    p.edit().putLong("settingsUntil", System.currentTimeMillis() + 5 * 60 * 1000L).apply();
    final android.app.Activity a = cordova.getActivity();
    if (a != null) {
      a.runOnUiThread(new Runnable() {
        @Override public void run() {
          try { a.startActivity(i); } catch (Throwable t) { /* nessuna schermata disponibile */ }
        }
      });
    } else {
      i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      c.startActivity(i);
    }
  }

  private static ComponentName adminComp(Context c) {
    return new ComponentName(c, StudyAdmin.class);
  }

  static boolean adminActive(Context c) {
    try {
      DevicePolicyManager dpm = (DevicePolicyManager) c.getSystemService(Context.DEVICE_POLICY_SERVICE);
      return dpm != null && dpm.isAdminActive(adminComp(c));
    } catch (Throwable t) {
      return false;
    }
  }

  /** Se il blocco e' attivo e i permessi ci sono, il servizio deve girare. Altrimenti non fa niente. */
  private void ensure(Context c) {
    SharedPreferences p = LockService.prefs(c);
    if (p.getBoolean("enabled", false) && LockService.canOverlay(c) && LockService.hasUsage(c) && !LockService.running) {
      Intent s = new Intent(c, LockService.class);
      if (Build.VERSION.SDK_INT >= 26) c.startForegroundService(s); else c.startService(s);
    }
  }

  private JSONObject status(Context c) throws JSONException {
    SharedPreferences p = LockService.prefs(c);
    long now = System.currentTimeMillis();
    JSONObject o = new JSONObject();
    o.put("overlay", LockService.canOverlay(c));
    o.put("usage", LockService.hasUsage(c));
    o.put("enabled", p.getBoolean("enabled", false));
    o.put("running", LockService.running);
    o.put("leftMin", (int) Math.ceil(p.getLong("left", 0) / 60000.0));
    o.put("emergencyLeftMin", (int) Math.max(0, Math.ceil((p.getLong("emergencyUntil", 0) - now) / 60000.0)));
    o.put("emergencyToday", p.getInt("emergencyCount", 0));
    o.put("admin", adminActive(c));
    JSONArray cs = new JSONArray();
    for (int i = 0; i < 3; i++) cs.put(new JSONObject().put("n", LockService.contactName(p, i)).put("t", LockService.contactNum(p, i)));
    o.put("contacts", cs);
    o.put("guard", p.getBoolean("enabled", false) && p.getString("pinHash", "").length() > 0);
    return o;
  }
}
