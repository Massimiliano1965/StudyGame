package it.massi.studylock;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;

/** Dopo il riavvio o l'aggiornamento dell'app riavvia il blocco, solo se era attivo e i permessi ci sono ancora. */
public class BootReceiver extends BroadcastReceiver {
  @Override
  public void onReceive(Context c, Intent i) {
    try {
      SharedPreferences p = LockService.prefs(c);
      if (p.getBoolean("enabled", false) && LockService.canOverlay(c) && LockService.hasUsage(c)) {
        Intent s = new Intent(c, LockService.class);
        if (Build.VERSION.SDK_INT >= 26) c.startForegroundService(s); else c.startService(s);
      }
    } catch (Throwable t) { /* mai far cadere il telefono per questo */ }
  }
}
