// ===== Musica: stacchetti di 3-4 secondi, tutti generati dal sintetizzatore (nessun file, nessun diritto) =====
// Tre fasce d'età (A = 1ª-3ª elementare, B = 4ª-5ª, C = medie) x carattere della materia.
// Le melodie "classiche" (Beethoven, Mozart) sono di pubblico dominio e qui sono suonate dal sintetizzatore.
const Music = (() => {
  let ctx = null, master = null, enabledFn = () => true;
  let busyUntil = 0, endTimer = null, waiters = [], live = [];

  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const band = c => (c == null || c <= 2) ? "A" : c <= 4 ? "B" : "C";

  function boot() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      const comp = ctx.createDynamicsCompressor();
      master = ctx.createGain(); master.gain.value = 0.55;
      master.connect(comp); comp.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
  }

  // ---------- strumenti ----------
  function track(node) { live.push(node); return node; }

  function tone(type, f, t, dur, vol, o = {}) {
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(f, t);
    if (o.glide) osc.frequency.exponentialRampToValueAtTime(o.glide, t + dur);
    const a = o.attack || 0.006;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + a);
    if (o.sustain) { g.gain.setValueAtTime(vol, t + dur * 0.7); }
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let out = osc;
    if (o.lp) { const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = o.lp; osc.connect(lp); out = lp; }
    if (o.vib) { const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = 5.5; lg.gain.value = f * 0.012; l.connect(lg); lg.connect(osc.frequency); l.start(t); l.stop(t + dur + 0.05); }
    out.connect(g); g.connect(master);
    osc.start(t); osc.stop(t + dur + 0.05);
    track(osc);
  }
  const bell = (m, t, dur, vol) => { tone("sine", mtof(m), t, dur, vol); tone("sine", mtof(m) * 2.76, t, dur * 0.4, vol * 0.18); tone("triangle", mtof(m) * 2, t, dur * 0.6, vol * 0.25); };
  const pluck = (m, t, dur, vol) => { tone("triangle", mtof(m), t, dur, vol, { lp: 3200 }); tone("sine", mtof(m) * 2, t, dur * 0.5, vol * 0.3); };
  const chip = (m, t, dur, vol) => tone("square", mtof(m), t, dur, vol * 0.55, { lp: 5000 });
  const bass = (m, t, dur, vol) => tone("sawtooth", mtof(m), t, dur, vol, { lp: 420 });
  const flute = (m, t, dur, vol) => tone("sine", mtof(m), t, dur, vol, { attack: 0.04, vib: true, sustain: true });
  const organ = (m, t, dur, vol) => { tone("sawtooth", mtof(m), t, dur, vol * 0.5, { lp: 900, attack: 0.05, sustain: true }); tone("sine", mtof(m) * 2, t, dur, vol * 0.4, { attack: 0.05, sustain: true }); };
  const horn = (m, t, dur, vol) => tone("sawtooth", mtof(m), t, dur, vol * 0.6, { lp: 1700, attack: 0.025, sustain: true });
  const lead = (m, t, dur, vol) => { tone("sawtooth", mtof(m), t, dur, vol * 0.45, { lp: 2600 }); tone("square", mtof(m) * 1.006, t, dur, vol * 0.25, { lp: 2600 }); };
  const power = (m, t, dur, vol) => { tone("sawtooth", mtof(m), t, dur, vol * 0.5, { lp: 1100 }); tone("sawtooth", mtof(m + 7), t, dur, vol * 0.4, { lp: 1100 }); tone("sawtooth", mtof(m + 12), t, dur, vol * 0.3, { lp: 1100 }); };

  let nbuf = null;
  function noise(t, dur, vol, o = {}) {
    if (!nbuf) { nbuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const d = nbuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = nbuf; src.loop = true;
    f.type = o.type || "bandpass"; f.Q.value = o.q || 1;
    f.frequency.setValueAtTime(o.f1 || 1000, t);
    if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + dur * (o.peak || 0.5));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t); src.stop(t + dur + 0.05);
    track(src);
  }
  const kick = (t, v = 0.5) => tone("sine", 150, t, 0.16, v, { glide: 45 });
  const snare = (t, v = 0.3) => { noise(t, 0.13, v, { type: "highpass", f1: 1400 }); tone("triangle", 210, t, 0.09, v * 0.5); };
  const hat = (t, v = 0.12) => noise(t, 0.04, v, { type: "highpass", f1: 7000, peak: 0.2 });
  const tom = (t, v = 0.4) => tone("sine", 120, t, 0.22, v, { glide: 70 });
  const chirp = (t, f0, f1, dur, vol) => tone("sine", f0, t, dur, vol, { glide: f1, attack: 0.01 });

  // suona una melodia [[nota, inizio(battiti), durata(battiti)], ...]
  function melody(notes, beat, inst, vol, tr, t0) {
    notes.forEach(([n, s, d]) => { if (n != null && s * beat < 3.5) inst(n + tr, t0 + s * beat, Math.max(0.12, d * beat), vol); });
  }

  // ---------- gli stacchetti ----------
  // restituiscono la durata (secondi)
  const STYLE = {
    // carattere "allegro" di base: cambia con l'età
    pop(b, tr, t0) {
      if (b === "A") { // carillon + chiptune, stile videogioco per bambini
        const beat = 0.4;
        melody([[72, 0, .5], [76, .5, .5], [79, 1, .5], [84, 1.5, .5], [83, 2, .5], [79, 2.5, .5], [81, 3, .5], [84, 3.5, .5], [79, 4, .5], [81, 4.5, .5], [83, 5, .5], [86, 5.5, .5], [84, 6, 1.6]], beat, (m, t, d, v) => { chip(m, t, d, v); bell(m + 12, t, d, v * 0.5); }, 0.24, tr, t0);
        [60, 64, 67].forEach(m => pluck(m + tr, t0 + 6 * beat, 1.6 * beat, 0.12));
        return 3.2;
      }
      if (b === "B") { // pop: giri di accordi, basso, cassa e charleston
        const beat = 0.42, prog = [[55, 59, 62], [50, 54, 57], [52, 55, 59], [48, 52, 55]];
        prog.forEach((ch, i) => { const s = t0 + i * 2 * beat * 0.85; ch.forEach(m => pluck(m + 12 + tr, s, 0.7, 0.1)); bass(ch[0] - 12 + tr, s, 0.7, 0.3); kick(s, 0.4); hat(s + 0.18); hat(s + 0.36); snare(s + 0.36, 0.2); });
        melody([[79, 0, .5], [83, .5, .5], [86, 1, .75], [83, 1.75, .25], [81, 2, .5], [78, 2.5, .5], [74, 3, 1], [79, 4, .5], [83, 4.5, .5], [86, 5, 1.2]], beat * 0.85, (m, t, d, v) => pluck(m, t, d, v), 0.22, tr, t0);
        return 3.4;
      }
      // C: rock - riff di chitarra sintetica, cassa e rullante
      const beat = 0.23;
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach(i => { const s = t0 + i * beat; power(i % 4 === 3 ? 43 + tr : 40 + tr, s, beat * 0.9, 0.12); if (i % 2 === 0) kick(s, 0.38); if (i % 4 === 2) snare(s, 0.3); hat(s, 0.1); });
      melody([[76, 6, .8], [79, 7, .8], [81, 8, .8], [79, 9, .8], [76, 10, 2.2]], beat, lead, 0.14, tr, t0);
      noise(t0 + 12 * beat, 1.0, 0.16, { type: "highpass", f1: 3000, peak: 0.05 }); power(40 + tr, t0 + 12 * beat, 1, 0.14); kick(t0 + 12 * beat, 0.4);
      return 3.8;
    },
    robot(b, tr, t0) { // matematica: bip e boop da calcolatrice, tondi e giocosi, non secchi
      const sc = b === "C" ? [60, 63, 67, 70, 72, 75] : [60, 62, 64, 67, 69, 72];
      const beat = b === "A" ? 0.14 : b === "B" ? 0.12 : 0.1;
      const pat = [0, 2, 4, 2, 1, 3, 5, 3, 0, 4, 2, 5, 3, 1, 4, 5, 5, 4, 5, 5];
      pat.forEach((k, i) => { const s = t0 + i * beat; chip(sc[k] + 12 + tr, s, beat * 0.85, b === "C" ? 0.2 : 0.4); if (i % 4 === 0 && b !== "A") hat(s, 0.1); if (b === "C" && i % 4 === 0) kick(s, 0.35); });
      const e = t0 + pat.length * beat;
      tone("square", mtof(72 + tr), e, 0.35, 0.1, { glide: mtof(96 + tr), lp: 4000 });
      bell(84 + tr, e + 0.3, 0.8, 0.15);
      return pat.length * beat + 1.2;
    },
    tech(b, tr, t0) { // tecnologia: sintetizzatore elettronico e "power-up"
      const beat = b === "A" ? 0.22 : 0.18;
      for (let i = 0; i < 12; i++) { const s = t0 + i * beat; bass([36, 36, 39, 43][i % 4] + tr, s, beat * 0.9, b === "A" ? 0.18 : 0.26); if (i % 2) hat(s, 0.1); if (b !== "A" && i % 4 === 0) kick(s, 0.4); }
      [72, 75, 79, 82, 84, 87].forEach((m, i) => chip(m + tr, t0 + 0.9 + i * beat * 0.5, beat * 0.45, 0.2));
      tone("square", 300, t0 + 12 * beat, 0.5, 0.1, { glide: 1400, lp: 4000 });
      return 12 * beat + 0.8;
    },
    sea(b, tr, t0) { // geografia: onde del mare, vento e gabbiani
      noise(t0, 1.7, 0.5, { f1: 300, f2: 1100, q: 0.7, peak: 0.6 });
      noise(t0 + 1.6, 1.9, 0.55, { f1: 350, f2: 1300, q: 0.7, peak: 0.6 });
      noise(t0 + 0.3, 2.4, 0.12, { f1: 500, f2: 1800, q: 4, peak: 0.5 });
      chirp(t0 + 1.0, 2200, 1500, 0.22, 0.12); chirp(t0 + 1.3, 2000, 1400, 0.2, 0.1);
      if (b !== "A") chirp(t0 + 2.3, 2300, 1600, 0.2, 0.1);
      [72, 76, 79].forEach((m, i) => bell(m + 12 + tr, t0 + 2.6 + i * 0.22, 0.9, 0.15));
      if (b === "C") [40, 47, 52].forEach(m => organ(m + tr, t0, 3.4, 0.07));
      return 3.6;
    },
    animals(b, tr, t0) { // scienze: grilli, uccellini e una goccia d'acqua
      for (let g = 0; g < 5; g++) for (let k = 0; k < 3; k++) tone("sine", 4300, t0 + g * 0.55 + k * 0.07, 0.04, 0.14);
      [[0.3, 3000, 4200], [0.6, 3500, 2600], [0.85, 2800, 3900], [1.8, 3300, 4400], [2.05, 4000, 3000], [2.8, 3000, 4100]].forEach(([s, a, c]) => chirp(t0 + s, a, c, 0.12, 0.2));
      tone("sine", 1500, t0 + 1.3, 0.18, 0.2, { glide: 450 });
      [67, 72, 76].forEach((m, i) => pluck(m + 12 + tr, t0 + 2.9 + i * 0.15, 0.6, 0.12));
      return 3.6;
    },
    harp(b, tr, t0) { // arte: arpeggio d'arpa, dolce
      const up = b === "C" ? [60, 64, 67, 71, 74, 79, 83, 86] : [60, 64, 67, 72, 76, 79, 84, 88];
      const seq = up.concat(up.slice(0, -1).reverse());
      seq.forEach((m, i) => bell(m + tr, t0 + i * 0.2, 1.1, 0.18));
      [48, 55, 60].forEach(m => organ(m + tr, t0, 3.4, 0.05));
      return 3.4;
    },
    fanfare(b, tr, t0) { // educazione civica: fanfara solenne
      const beat = 0.24;
      [[60, 0, .8], [64, 1, .8], [67, 2, .8], [72, 3, 3]].forEach(([m, s, d]) => horn(m + tr, t0 + s * beat, d * beat, 0.26));
      [[48, 0], [52, 1], [55, 2], [60, 3]].forEach(([m, s]) => horn(m + tr, t0 + s * beat, 0.5, 0.15));
      [60, 64, 67, 72].forEach(m => organ(m + tr, t0 + 4 * beat, 1.7, 0.1));
      tom(t0, 0.35); tom(t0 + 2 * beat, 0.35); tom(t0 + 3 * beat, 0.4);
      return 3.2;
    },
    medieval(b, tr, t0) { // storia: flauto, bordone e tamburo
      const beat = b === "A" ? 0.34 : 0.3;
      melody([[74, 0, .8], [77, 1, .6], [76, 1.75, .5], [74, 2.25, .75], [69, 3, .8], [72, 4, .6], [74, 5, 1.6], [77, 6.8, .5], [81, 7.3, 1.5]], beat, flute, 0.28, tr, t0);
      tone("sawtooth", mtof(38 + tr), t0, 3.4, 0.1, { lp: 500, attack: 0.1, sustain: true });
      for (let i = 0; i < 8; i++) { tom(t0 + i * beat * 1.5, 0.3); noise(t0 + i * beat * 1.5 + beat * 0.75, 0.05, 0.08, { type: "highpass", f1: 6000, peak: 0.2 }); }
      return 3.6;
    },
    classic(b, tr, t0) { // musica: melodie classiche di pubblico dominio
      if (b === "A") { // Beethoven, "Inno alla gioia"
        const beat = 0.29;
        melody([[64, 0, .9], [64, 1, .9], [65, 2, .9], [67, 3, .9], [67, 4, .9], [65, 5, .9], [64, 6, .9], [62, 7, .9], [60, 8, .9], [60, 9, .9], [62, 10, .9], [64, 11, .9], [64, 12, 1.4], [62, 13.5, .5], [62, 14, 1.8]], beat, (m, t, d, v) => { pluck(m + 12, t, d, v); bell(m + 12, t, d, v * 0.4); }, 0.3, tr, t0);
        return 3.6;
      }
      if (b === "B") { // Mozart, "Piccola serenata notturna"
        const beat = 0.2;
        melody([[67, 0, 1.2], [62, 1.5, .5], [67, 2, 1.2], [62, 3.5, .5], [67, 4, .6], [62, 4.75, .5], [67, 5.5, .6], [71, 6.25, .6], [74, 7, 1.5], [72, 9.5, 1.2], [69, 11, .5], [72, 11.5, 1.2], [69, 13, .5], [72, 13.5, .6], [69, 14.25, .5], [66, 15, .6], [69, 15.75, .6], [62, 16.5, 2]], beat, (m, t, d, v) => pluck(m + 12, t, d, v), 0.3, tr, t0);
        return 3.5;
      }
      // C: Beethoven, "Per Elisa"
      const beat = 0.19;
      melody([[76, 0, 1], [75, 1, 1], [76, 2, 1], [75, 3, 1], [76, 4, 1], [71, 5, 1], [74, 6, 1], [72, 7, 1], [69, 8, 2.5], [60, 10.5, .5], [64, 11, .5], [69, 12, .5], [71, 13, 2], [64, 15, .5], [68, 16, .5], [71, 17, .5], [72, 18, 2.5]], beat, (m, t, d, v) => { pluck(m, t, d * 1.4, v); bell(m, t, d * 1.2, v * 0.3); }, 0.3, tr, t0);
      return 3.6;
    },
    organo(b, tr, t0) { // latino: organo modale, coro di accordi
      const ch = [[50, 53, 57], [48, 52, 55], [46, 50, 53], [50, 53, 57]];
      ch.forEach((c, i) => c.forEach(m => organ(m + 12 + tr, t0 + i * 0.85, 1.0, 0.12)));
      tone("sawtooth", mtof(38 + tr), t0, 3.6, 0.1, { lp: 400, attack: 0.1, sustain: true });
      [69, 67, 65, 62].forEach((m, i) => organ(m + 12 + tr, t0 + i * 0.85 + 0.1, 0.8, 0.12));
      tom(t0, 0.3); tom(t0 + 1.7, 0.3);
      return 3.5;
    }
  };

  // quale carattere per ogni materia, e trasposizione
  const MAP = {
    matematica: ["robot", 0], tecnologia: ["tech", 0], geografia: ["sea", 0], scienze: ["animals", 0], arte: ["harp", 0],
    civica: ["fanfare", 0], storia: ["medieval", 0], musica: ["classic", 0], latino: ["organo", 0],
    italiano: ["pop", 0], inglese: ["pop", 2], lingua2: ["pop", -2]
  };

  function finish(dur) {
    const now = ctx.currentTime;
    busyUntil = now + dur;
    clearTimeout(endTimer);
    endTimer = setTimeout(() => { busyUntil = 0; const w = waiters; waiters = []; w.forEach(f => { try { f(); } catch (e) {} }); }, dur * 1000 + 60);
  }

  function play(subjectId, classId) {
    if (!enabledFn()) return false;
    try {
      boot(); stop();
      const [style, tr] = MAP[subjectId] || MAP.italiano;
      const t0 = ctx.currentTime + 0.05;
      const dur = STYLE[style](band(classId), tr, t0);
      finish(dur + 0.1);
      return true;
    } catch (e) { return false; }
  }

  // stop(true): ferma e fa partire chi aspettava la fine; stop(): ferma e scarta chi aspettava
  function stop(fire) {
    live.forEach(n => { try { n.stop(); } catch (e) {} }); live = [];
    clearTimeout(endTimer); busyUntil = 0;
    const w = waiters; waiters = [];
    if (fire === true) w.forEach(f => { try { f(); } catch (e) {} });
  }

  // solo per le prove: rende lo stacchetto offline e misura picco e durata del suono
  async function render(subjectId, classId) {
    const saveCtx = ctx, saveMaster = master, saveBuf = nbuf, saveLive = live;
    try {
      const off = new OfflineAudioContext(1, 44100 * 6, 44100);
      ctx = off; nbuf = null; live = [];
      const comp = off.createDynamicsCompressor();
      master = off.createGain(); master.gain.value = 0.55; master.connect(comp); comp.connect(off.destination);
      const [style, tr] = MAP[subjectId] || MAP.italiano;
      const dur = STYLE[style](band(classId), tr, 0.05);
      const buf = await off.startRendering();
      const d = buf.getChannelData(0); let peak = 0, sum = 0, last = 0;
      for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a > peak) peak = a; sum += d[i] * d[i]; if (a > 0.003) last = i; }
      return { style, dur, peak, rms: Math.sqrt(sum / d.length), soundEnd: last / 44100 };
    } finally { ctx = saveCtx; master = saveMaster; nbuf = saveBuf; live = saveLive; }
  }

  return {
    render,
    init: fn => { enabledFn = fn; },
    play, stop,
    busy: () => !!ctx && busyUntil > ctx.currentTime,
    whenDone: cb => { if (ctx && busyUntil > ctx.currentTime) waiters.push(cb); else cb(); },
    STYLES: Object.keys(STYLE), MAP
  };
})();
