package it.massi.studylock;

import android.app.admin.DeviceAdminReceiver;
import android.content.Context;
import android.content.Intent;

/**
 * Amministratore del dispositivo: finche' e' attivo Android NON permette di disinstallare Gioca e Impara
 * (il pulsante «Disinstalla» non funziona). Non usa nessun potere sul telefono: serve solo a proteggere l'app.
 * I genitori lo tolgono da dentro l'app con il PIN («Togli la protezione»).
 */
public class StudyAdmin extends DeviceAdminReceiver {
  @Override
  public CharSequence onDisableRequested(Context context, Intent intent) {
    return "Senza questa protezione Gioca e Impara si puo' disinstallare. Dovrebbero farlo solo i genitori (con il PIN, da dentro l'app).";
  }
}
