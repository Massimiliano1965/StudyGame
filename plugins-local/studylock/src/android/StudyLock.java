package it.massi.studylock;

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
      if (action.equals("openOverlaySettings")) {
        Intent i = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + c.getPackageName()));
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        c.startActivity(i);
        cb.success(status(c));
        return true;
      }
      if (action.equals("openUsageSettings")) {
        Intent i = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        c.startActivity(i);
        cb.success(status(c));
        return true;
      }
    } catch (Throwable t) {
      cb.error(String.valueOf(t));
      return true;
    }
    return false;
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
    return o;
  }
}
