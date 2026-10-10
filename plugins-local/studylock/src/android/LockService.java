package it.massi.studylock;

import android.Manifest;
import android.app.AppOpsManager;
import android.app.KeyguardManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.app.usage.UsageEvents;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.provider.Settings;
import android.telecom.TelecomManager;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

/**
 * Blocco morbido: ogni secondo guarda quale app e' davanti. Se non e' una delle app sempre permesse
 * (questa, telefono, sveglia, installazione) e non ci sono minuti sbloccati, copre lo schermo con una
 * schermata che rimanda a Gioca e Impara. I minuti si consumano solo mentre si usano le ALTRE app.
 * Protezione dalla disinstallazione: amministratore del dispositivo (StudyAdmin) + Impostazioni e conferma di
 * disinstallazione coperte da un tastierino PIN (il PIN dei genitori arriva dalla parte web con setPin).
 * Il pulsante di emergenza e' qui, nativo: funziona anche se la parte web si blocca.
 */
public class LockService extends Service {

  static final String PREFS = "studylock";
  static final long EMERGENCY_MS = 10 * 60 * 1000L;
  static volatile boolean running = false;

  private final Handler h = new Handler(Looper.getMainLooper());
  private WindowManager wm;
  private View overlay;
  private View guardView;
  private TextView guardDots, guardMsg;
  private final StringBuilder guardPin = new StringBuilder();
  private boolean padUnlock = false;   // true = tastierino PIN aperto dalla schermata di blocco (sblocca 10 minuti), false = davanti alle Impostazioni
  private String fg = null;
  private long lastQuery = 0;
  private long lastTick = 0;
  private boolean warned = false;
  private final Set<String> allowed = new HashSet<String>();

  private final Runnable loop = new Runnable() {
    @Override public void run() {
      try { tick(); } catch (Throwable t) { /* un errore non deve fermare il ciclo */ }
      h.postDelayed(this, 1000);
    }
  };

  // ---------- funzioni condivise con il plugin ----------

  static SharedPreferences prefs(Context c) {
    return c.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
  }

  static boolean canOverlay(Context c) {
    return Build.VERSION.SDK_INT < 23 || Settings.canDrawOverlays(c);
  }

  @SuppressWarnings("deprecation")
  static boolean hasUsage(Context c) {
    try {
      AppOpsManager ops = (AppOpsManager) c.getSystemService(Context.APP_OPS_SERVICE);
      int mode = ops.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, android.os.Process.myUid(), c.getPackageName());
      if (mode == AppOpsManager.MODE_DEFAULT) {
        return c.checkCallingOrSelfPermission(Manifest.permission.PACKAGE_USAGE_STATS) == PackageManager.PERMISSION_GRANTED;
      }
      return mode == AppOpsManager.MODE_ALLOWED;
    } catch (Throwable t) {
      return false;
    }
  }

  /** Stessa impronta del PIN di hashPin() in app.js (JavaScript): "p1" + (hash senza segno in base 36). */
  static String hashPin(String v) {
    int h = 5381;
    String t = "gei|" + v + "|2026";
    for (int i = 0; i < t.length(); i++) h = ((h << 5) + h + t.charAt(i));
    return "p1" + Long.toString(h & 0xFFFFFFFFL, 36);
  }

  /** Schermate che i bambini non devono poter aprire senza il PIN: Impostazioni di Android e conferma di disinstallazione. */
  static boolean isDanger(String pkg) {
    if (pkg == null) return false;
    return pkg.contains(".settings") || pkg.contains("packageinstaller");
  }

  /** Nuovo giorno: minuti sbloccati e conteggio emergenze ripartono da zero. */
  static void rollDay(SharedPreferences p) {
    String d = new SimpleDateFormat("yyyyMMdd", Locale.US).format(new Date());
    if (!d.equals(p.getString("day", ""))) {
      p.edit().putString("day", d).putLong("left", 0).putInt("emergencyCount", 0).apply();
    }
  }

  /** Numeri di emergenza (mamma, papa', altro): nome e numero scelti da loro, salvati dalla parte web. */
  static String contactName(SharedPreferences p, int i) { return p.getString("em" + i + "n", ""); }
  static String contactNum(SharedPreferences p, int i) { return p.getString("em" + i + "t", ""); }

  static void startEmergency(Context c) {
    SharedPreferences p = prefs(c);
    p.edit()
      .putLong("emergencyUntil", System.currentTimeMillis() + EMERGENCY_MS)
      .putInt("emergencyCount", p.getInt("emergencyCount", 0) + 1)
      .apply();
  }

  // ---------- servizio ----------

  @Override public IBinder onBind(Intent i) { return null; }

  @Override
  public int onStartCommand(Intent i, int flags, int startId) {
    startAsForeground();
    if (!running) {
      running = true;
      wm = (WindowManager) getSystemService(Context.WINDOW_SERVICE);
      buildAllowed();
      lastTick = System.currentTimeMillis();
      lastQuery = 0;
      h.post(loop);
    }
    return START_STICKY;
  }

  @Override
  public void onDestroy() {
    running = false;
    h.removeCallbacksAndMessages(null);
    hideOverlay();
    hideGuard();
    super.onDestroy();
  }

  private void startAsForeground() {
    String ch = "studylock";
    NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
    if (Build.VERSION.SDK_INT >= 26 && nm != null) {
      nm.createNotificationChannel(new NotificationChannel(ch, "Blocco telefono", NotificationManager.IMPORTANCE_MIN));
    }
    Notification.Builder b = Build.VERSION.SDK_INT >= 26 ? new Notification.Builder(this, ch) : new Notification.Builder(this);
    b.setContentTitle("Gioca e Impara")
      .setContentText("Blocco telefono attivo")
      .setSmallIcon(android.R.drawable.ic_lock_idle_lock)
      .setOngoing(true);
    Notification n = b.build();
    if (Build.VERSION.SDK_INT >= 34) {
      startForeground(1, n, 0x40000000); // FOREGROUND_SERVICE_TYPE_SPECIAL_USE
    } else {
      startForeground(1, n);
    }
  }

  /** App che non vengono mai coperte: questa, chiamate (anche di emergenza), sveglia, installazione/disinstallazione. */
  private void buildAllowed() {
    allowed.add(getPackageName());
    String[] fixed = {
      "android", "com.android.systemui",
      "com.android.phone", "com.android.server.telecom", "com.android.incallui", "com.android.dialer",
      "com.google.android.dialer", "com.samsung.android.incallui", "com.samsung.android.dialer",
      "com.android.emergency",
      "com.android.deskclock", "com.google.android.deskclock", "com.sec.android.app.clockpackage",
      "com.huawei.deskclock", "com.oneplus.deskclock",
      "com.android.packageinstaller", "com.google.android.packageinstaller",
      "com.android.permissioncontroller", "com.google.android.permissioncontroller"
    };
    for (String s : fixed) allowed.add(s);
    try {
      TelecomManager tm = (TelecomManager) getSystemService(Context.TELECOM_SERVICE);
      String d = tm == null ? null : tm.getDefaultDialerPackage();
      if (d != null) allowed.add(d);
    } catch (Throwable t) { /* ignora */ }
  }

  @SuppressWarnings("deprecation")
  private void refreshForeground(long now) {
    UsageStatsManager usm = (UsageStatsManager) getSystemService(Context.USAGE_STATS_SERVICE);
    if (usm == null) return;
    long from = lastQuery == 0 ? now - 30L * 60L * 1000L : lastQuery - 1500;   // finestra corta: il servizio gira sul thread principale
    UsageEvents ev = usm.queryEvents(from, now);
    UsageEvents.Event e = new UsageEvents.Event();
    while (ev.hasNextEvent()) {
      ev.getNextEvent(e);
      int t = e.getEventType();
      String pkg = e.getPackageName();
      if (t == UsageEvents.Event.MOVE_TO_FOREGROUND) {
        fg = pkg;
      } else if (t == UsageEvents.Event.MOVE_TO_BACKGROUND && pkg != null && pkg.equals(fg)) {
        fg = null;
      }
    }
    lastQuery = now;
  }

  private void tick() {
    SharedPreferences p = prefs(this);
    long now = System.currentTimeMillis();
    rollDay(p);

    if (!p.getBoolean("enabled", false)) { hideOverlay(); hideGuard(); stopSelf(); return; }
    // senza i due permessi non si blocca mai niente
    if (!canOverlay(this) || !hasUsage(this)) { hideOverlay(); hideGuard(); lastTick = now; return; }

    PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
    KeyguardManager km = (KeyguardManager) getSystemService(Context.KEYGUARD_SERVICE);
    if ((pm != null && !pm.isInteractive()) || (km != null && km.isKeyguardLocked())) {
      hideOverlay(); hideGuard(); lastTick = now; return;
    }

    refreshForeground(now);
    long elapsed = Math.min(Math.max(0, now - lastTick), 5000);
    lastTick = now;

    // Protezione: Impostazioni di Android e conferma di disinstallazione si aprono solo con il PIN dei genitori.
    // Vale anche durante lo sblocco di emergenza. Esenzione: 5 minuti dopo un PIN giusto, oppure subito dopo
    // che e' stata l'app stessa ad aprire le Impostazioni (procedura guidata dei genitori).
    if (p.getString("pinHash", "").length() > 0 && isDanger(fg)
        && now >= p.getLong("guardUntil", 0) && now >= p.getLong("settingsUntil", 0)) {
      hideOverlay();
      showGuard(p);
      return;
    }
    if (!padUnlock) hideGuard();

    // appena toccato un numero di emergenza: per qualche secondo non si copre niente, poi il telefono si riblocca da solo
    if (now < p.getLong("callUntil", 0)) { hideOverlay(); return; }
    if (now < p.getLong("emergencyUntil", 0)) { hideOverlay(); hideGuard(); return; }
    // i genitori sono nelle Impostazioni di Android aperte da qui: non coprirle.
    // Ma appena tornano in Gioca e Impara la pausa finisce subito (prima durava 5 minuti pieni
    // e dopo aver dato i permessi il blocco sembrava non funzionare). Per i primi 4 secondi non si
    // azzera: Android ci mette un attimo a portare davanti le Impostazioni.
    long sUntil = p.getLong("settingsUntil", 0);
    if (now < sUntil) {
      boolean justOpened = now > sUntil - 5 * 60 * 1000L && now < sUntil - 5 * 60 * 1000L + 4000L;
      if (getPackageName().equals(fg) && !justOpened) {
        p.edit().putLong("settingsUntil", 0).apply();
      } else {
        hideOverlay(); return;
      }
    }

    boolean ok = fg == null || allowed.contains(fg);
    boolean need = false;
    if (!ok) {
      long left = p.getLong("left", 0);
      if (left > 0) {
        left = Math.max(0, left - elapsed);
        p.edit().putLong("left", left).apply();
        if (left > 60000) warned = false;
        if (left > 0 && left <= 60000 && !warned) {
          warned = true;
          Toast.makeText(this, "Ti resta 1 minuto di telefono", Toast.LENGTH_LONG).show();
        }
        if (left == 0) need = true;
      } else {
        need = true;
      }
    }
    if (need) showOverlay(); else { hideOverlay(); if (padUnlock) hideGuard(); }
  }

  // ---------- schermata di blocco ----------

  private int dp(int v) {
    return (int) (v * getResources().getDisplayMetrics().density + 0.5f);
  }

  private TextView label(String t, int sp, int color, boolean bold) {
    TextView v = new TextView(this);
    v.setText(t);
    v.setTextSize(sp);
    v.setTextColor(color);
    v.setGravity(Gravity.CENTER);
    if (bold) v.setTypeface(null, Typeface.BOLD);
    LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
    lp.bottomMargin = dp(12);
    v.setLayoutParams(lp);
    return v;
  }

  private Button pill(String t, int bg, int fg, int sp) {
    Button b = new Button(this);
    b.setText(t);
    b.setAllCaps(false);
    b.setTextSize(sp);
    b.setTextColor(fg);
    GradientDrawable g = new GradientDrawable();
    g.setColor(bg);
    g.setCornerRadius(dp(28));
    b.setBackground(g);
    LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(64));
    lp.topMargin = dp(12);
    b.setLayoutParams(lp);
    return b;
  }

  private void showOverlay() {
    if (overlay != null || wm == null) return;
    LinearLayout root = new LinearLayout(this) {
      // la freccia indietro sulla schermata di blocco riporta a Gioca e Impara (prima non faceva niente)
      @Override public boolean dispatchKeyEvent(KeyEvent ev) {
        if (ev.getKeyCode() == KeyEvent.KEYCODE_BACK) {
          if (ev.getAction() == KeyEvent.ACTION_UP) { launchApp(); hideOverlay(); }
          return true;
        }
        return super.dispatchKeyEvent(ev);
      }
    };
    root.setOrientation(LinearLayout.VERTICAL);
    root.setGravity(Gravity.CENTER);
    root.setBackgroundColor(Color.parseColor("#1E1B4B"));
    root.setPadding(dp(24), dp(48), dp(24), dp(24));

    root.addView(label("🔒", 64, Color.WHITE, false));
    root.addView(label("Telefono in pausa", 28, Color.WHITE, true));
    root.addView(label("Gioca e impara per guadagnare i minuti del telefono!", 18, Color.parseColor("#E0E7FF"), false));

    Button open = pill("▶  Apri Gioca e Impara", Color.parseColor("#FFD23F"), Color.parseColor("#1E1B4B"), 20);
    open.setOnClickListener(new View.OnClickListener() {
      @Override public void onClick(View v) { launchApp(); hideOverlay(); }
    });
    root.addView(open);

    final SharedPreferences sp = prefs(this);

    // numeri di emergenza: chiamano mamma, papa' o l'altro numero scelto; dopo la chiamata il telefono si riblocca
    boolean anyNum = false;
    for (int i = 0; i < 3; i++) if (contactNum(sp, i).length() > 0) anyNum = true;
    if (anyNum) {
      TextView hint = label("Se hai bisogno, chiama:", 15, Color.parseColor("#E0E7FF"), false);
      ((LinearLayout.LayoutParams) hint.getLayoutParams()).topMargin = dp(14);
      root.addView(hint);
      for (int i = 0; i < 3; i++) {
        final String num = contactNum(sp, i);
        if (num.length() == 0) continue;
        String nm = contactName(sp, i);
        if (nm.length() == 0) nm = i == 0 ? "Mamma" : i == 1 ? "Papà" : "Altro";
        Button call = pill("📞  " + nm, Color.parseColor("#16A34A"), Color.WHITE, 18);
        ((LinearLayout.LayoutParams) call.getLayoutParams()).height = dp(54);
        ((LinearLayout.LayoutParams) call.getLayoutParams()).topMargin = dp(8);
        call.setOnClickListener(new View.OnClickListener() {
          @Override public void onClick(View v) { callNumber(num); }
        });
        root.addView(call);
      }
    }

    if (sp.getString("pinHash", "").length() > 0) {
      // sblocco dei genitori: tastierino PIN (sblocca 10 minuti)
      Button pin = pill("🔐  PIN dei genitori", Color.parseColor("#3730A3"), Color.WHITE, 15);
      pin.setOnClickListener(new View.OnClickListener() {
        @Override public void onClick(View v) { showGuard(prefs(LockService.this), true); }
      });
      root.addView(pin);
    } else {
      // nessun PIN impostato (non dovrebbe succedere): per non restare chiusi fuori resta lo sblocco col tocco lungo
      final String emLabel = "🆘  Adulti: tieni premuto 3 secondi";
      final Button em = pill(emLabel, Color.parseColor("#3730A3"), Color.WHITE, 15);
      final Runnable fire = new Runnable() {
        @Override public void run() {
          startEmergency(LockService.this);
          hideOverlay();
          Toast.makeText(LockService.this, "Telefono sbloccato per 10 minuti", Toast.LENGTH_LONG).show();
        }
      };
      em.setOnTouchListener(new View.OnTouchListener() {
        @Override public boolean onTouch(View v, MotionEvent ev) {
          int a = ev.getAction();
          if (a == MotionEvent.ACTION_DOWN) {
            em.setText("Continua a tenere premuto…");
            h.postDelayed(fire, 3000);
          } else if (a == MotionEvent.ACTION_UP || a == MotionEvent.ACTION_CANCEL) {
            h.removeCallbacks(fire);
            em.setText(emLabel);
          }
          return true;
        }
      });
      root.addView(em);
    }

    int type = Build.VERSION.SDK_INT >= 26 ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY : WindowManager.LayoutParams.TYPE_PHONE;
    WindowManager.LayoutParams lp = new WindowManager.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT, type,
      WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN, PixelFormat.OPAQUE);
    try {
      wm.addView(root, lp);
      overlay = root;
    } catch (Throwable t) {
      overlay = null; // permesso tolto nel frattempo: niente blocco
    }
  }

  // ---------- schermata PIN davanti a Impostazioni / disinstallazione ----------

  private Button key(String t) {
    Button b = new Button(this);
    b.setText(t);
    b.setAllCaps(false);
    b.setTextSize(24);
    b.setTextColor(Color.WHITE);
    GradientDrawable g = new GradientDrawable();
    g.setColor(Color.parseColor("#3730A3"));
    g.setCornerRadius(dp(18));
    b.setBackground(g);
    LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(0, dp(62), 1f);
    lp.setMargins(dp(6), dp(6), dp(6), dp(6));
    b.setLayoutParams(lp);
    return b;
  }

  private void goHome() {
    try {
      Intent i = new Intent(Intent.ACTION_MAIN);
      i.addCategory(Intent.CATEGORY_HOME);
      i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      startActivity(i);
    } catch (Throwable t) { /* ignora */ }
  }

  private void guardRefresh(SharedPreferences p) {
    if (guardDots == null) return;
    StringBuilder d = new StringBuilder();
    for (int i = 0; i < 4; i++) d.append(i < guardPin.length() ? "●" : "○").append(i < 3 ? "  " : "");
    guardDots.setText(d.toString());
    long lock = p.getLong("guardLockUntil", 0);
    long now = System.currentTimeMillis();
    if (guardMsg != null) {
      guardMsg.setText(now < lock ? "Troppi tentativi sbagliati. Riprova tra " + (int) Math.ceil((lock - now) / 60000.0) + " minuti." : padUnlock ? "Con il PIN dei genitori il telefono si sblocca per 10 minuti." : "Per aprire le Impostazioni serve il PIN dei genitori.");
    }
  }

  private void guardDigit(String dgt) {
    SharedPreferences p = prefs(this);
    long now = System.currentTimeMillis();
    if (now < p.getLong("guardLockUntil", 0)) { guardPin.setLength(0); guardRefresh(p); return; }
    if (guardPin.length() >= 4) return;
    guardPin.append(dgt);
    guardRefresh(p);
    if (guardPin.length() == 4) {
      String typed = guardPin.toString();
      guardPin.setLength(0);
      if (hashPin(typed).equals(p.getString("pinHash", ""))) {
        p.edit().putLong("guardUntil", now + 5 * 60 * 1000L).putInt("guardFails", 0).apply();
        if (padUnlock) {
          startEmergency(this);
          hideGuard();
          hideOverlay();
          Toast.makeText(this, "Telefono sbloccato per 10 minuti", Toast.LENGTH_LONG).show();
        } else {
          hideGuard();
        }
      } else {
        int f = p.getInt("guardFails", 0) + 1;
        SharedPreferences.Editor e = p.edit();
        if (f >= 5) { e.putLong("guardLockUntil", now + 5 * 60 * 1000L).putInt("guardFails", 0); }
        else e.putInt("guardFails", f);
        e.apply();
        guardRefresh(p);
        Toast.makeText(this, "PIN sbagliato", Toast.LENGTH_SHORT).show();
      }
    }
  }

  private void showGuard(SharedPreferences p) { showGuard(p, false); }

  private void showGuard(SharedPreferences p, final boolean unlock) {
    if (guardView != null || wm == null) { if (guardView != null) guardRefresh(p); return; }
    padUnlock = unlock;
    LinearLayout root = new LinearLayout(this) {
      @Override public boolean dispatchKeyEvent(KeyEvent ev) {
        if (ev.getKeyCode() == KeyEvent.KEYCODE_BACK) {
          if (ev.getAction() == KeyEvent.ACTION_UP) { hideGuard(); if (!unlock) goHome(); }
          return true;
        }
        return super.dispatchKeyEvent(ev);
      }
    };
    root.setOrientation(LinearLayout.VERTICAL);
    root.setGravity(Gravity.CENTER);
    root.setBackgroundColor(Color.parseColor("#1E1B4B"));
    root.setPadding(dp(20), dp(32), dp(20), dp(20));

    root.addView(label("🔐", 48, Color.WHITE, false));
    root.addView(label(unlock ? "PIN dei genitori" : "Solo per i genitori", 26, Color.WHITE, true));
    guardMsg = label("", 16, Color.parseColor("#E0E7FF"), false);
    root.addView(guardMsg);
    guardDots = label("", 30, Color.WHITE, true);
    root.addView(guardDots);

    String[][] rows = { { "1", "2", "3" }, { "4", "5", "6" }, { "7", "8", "9" }, { unlock ? "Indietro" : "Esci", "0", "⌫" } };
    for (String[] r : rows) {
      LinearLayout row = new LinearLayout(this);
      row.setOrientation(LinearLayout.HORIZONTAL);
      row.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
      for (final String t : r) {
        Button b = key(t);
        b.setOnClickListener(new View.OnClickListener() {
          @Override public void onClick(View v) {
            if (t.equals("Esci") || t.equals("Indietro")) { hideGuard(); if (!unlock) goHome(); }
            else if (t.equals("⌫")) { if (guardPin.length() > 0) guardPin.setLength(guardPin.length() - 1); guardRefresh(prefs(LockService.this)); }
            else guardDigit(t);
          }
        });
        row.addView(b);
      }
      root.addView(row);
    }

    int type = Build.VERSION.SDK_INT >= 26 ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY : WindowManager.LayoutParams.TYPE_PHONE;
    WindowManager.LayoutParams lp = new WindowManager.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT, type,
      WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN, PixelFormat.OPAQUE);
    try {
      guardPin.setLength(0);
      wm.addView(root, lp);
      guardView = root;
      guardRefresh(p);
    } catch (Throwable t) {
      guardView = null; guardDots = null; guardMsg = null; padUnlock = false;
    }
  }

  private void hideGuard() {
    if (guardView == null) return;
    try { if (wm != null) wm.removeView(guardView); } catch (Throwable t) { /* gia' tolta */ }
    guardView = null; guardDots = null; guardMsg = null; padUnlock = false;
    guardPin.setLength(0);
  }

  private void callNumber(String num) {
    prefs(this).edit().putLong("callUntil", System.currentTimeMillis() + 12000L).apply();
    hideOverlay();
    try {
      boolean can = Build.VERSION.SDK_INT < 23 || checkSelfPermission(Manifest.permission.CALL_PHONE) == PackageManager.PERMISSION_GRANTED;
      Intent i = new Intent(can ? Intent.ACTION_CALL : Intent.ACTION_DIAL, Uri.fromParts("tel", num, null));
      i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      startActivity(i);
    } catch (Throwable t) { /* nessuna app telefono: ignora */ }
  }

  private void hideOverlay() {
    if (overlay == null) return;
    try { if (wm != null) wm.removeView(overlay); } catch (Throwable t) { /* gia' tolta */ }
    overlay = null;
  }

  private void launchApp() {
    try {
      Intent i = getPackageManager().getLaunchIntentForPackage(getPackageName());
      if (i != null) {
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
        startActivity(i);
      }
    } catch (Throwable t) { /* ignora */ }
  }
}
