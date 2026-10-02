// ===== Voce: lettura ad alta voce e risposta con il microfono =====
// Funziona con i plugin Cordova (se presenti) oppure con le funzioni del telefono/browser.
// Se nulla è disponibile, i pulsanti si nascondono e il gioco funziona lo stesso.
const Voice = (() => {
  const LANG = "it-IT";

  // ---------- numeri a parole -> cifre ----------
  const U = { zero: 0, uno: 1, un: 1, una: 1, due: 2, tre: 3, quattro: 4, cinque: 5, sei: 6, sette: 7, otto: 8, nove: 9,
    dieci: 10, undici: 11, dodici: 12, tredici: 13, quattordici: 14, quindici: 15, sedici: 16,
    diciassette: 17, diciotto: 18, diciannove: 19 };
  const T = { venti: 20, trenta: 30, quaranta: 40, cinquanta: 50, sessanta: 60, settanta: 70, ottanta: 80, novanta: 90 };

  function norm(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9,\.\s]/g, " ").replace(/\s+/g, " ").trim();
  }

  function parseWord(w) {
    if (/^\d+$/.test(w)) return +w;
    if (w === "mille") return 1000;
    let rest = w, total = 0, found = false;
    const m = rest.match(/^(due|tre|quattro|cinque|sei|sette|otto|nove)?cento/);
    if (m) { total += (m[1] ? U[m[1]] : 1) * 100; rest = rest.slice(m[0].length); found = true; }
    for (const t of Object.keys(T)) {
      const stem = t.slice(0, -1);
      if (rest.startsWith(t)) { total += T[t]; rest = rest.slice(t.length); found = true; break; }
      if (rest.startsWith(stem) && U[rest.slice(stem.length)] !== undefined) {
        total += T[t]; rest = rest.slice(stem.length); found = true; break;
      }
    }
    if (rest === "") return found ? total : NaN;
    if (U[rest] === undefined) return NaN;
    return total + U[rest];
  }

  // sostituisce le parole-numero con cifre ("venti due" e "ventidue" -> 22)
  function numerify(text) {
    const toks = norm(text).split(" ");
    const out = [];
    for (let i = 0; i < toks.length; i++) {
      let v = parseWord(toks[i]);
      if (isNaN(v)) { out.push(toks[i]); continue; }
      // unisce numeri spezzati: "venti" "due" / "cento" "venti"
      while (i + 1 < toks.length) {
        const nx = parseWord(toks[i + 1]);
        if (isNaN(nx) || /^\d+$/.test(toks[i + 1])) break;
        const joined = parseWord(toks[i] + toks[i + 1]);
        if (isNaN(joined) || /^\d+$/.test(toks[i])) break;
        toks[i] = toks[i] + toks[i + 1]; v = joined; i++;
      }
      out.push(String(v));
    }
    return out.join(" ");
  }

  const ORD = { prima: 0, primo: 0, seconda: 1, secondo: 1, terza: 2, terzo: 2, quarta: 3, quarto: 3 };

  // Trova quale opzione ha detto il bambino. Ritorna l'indice, oppure -1.
  function matchOption(spokenList, options) {
    const list = Array.isArray(spokenList) ? spokenList : [spokenList];
    const opts = options.map(o => numerify(String(o)));
    for (const sp of list) {
      const text = numerify(sp);
      const hits = [];
      opts.forEach((o, i) => {
        if (!o) return;
        const re = new RegExp("(^| )" + o.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "( |$)");
        if (text === o || re.test(text)) hits.push(i);
      });
      if (hits.length === 1) return hits[0];
      if (hits.length > 1) {
        // più opzioni dette: vale la più lunga contenuta per intero
        const exact = hits.filter(i => text === opts[i]);
        if (exact.length === 1) return exact[0];
        continue;
      }
      for (const t of text.split(" ")) if (ORD[t] !== undefined && ORD[t] < options.length) return ORD[t];
    }
    return -1;
  }

  // ---------- lettura ad alta voce ----------
  const hasSynth = () => !!(window.TTS || window.speechSynthesis);
  const canSpeak = hasSynth;

  let speaking = false, token = 0;
  const stateFns = [];
  const setSpeaking = on => { if (speaking !== on) { speaking = on; stateFns.forEach(f => { try { f(on); } catch (e) {} }); } };
  const isSpeaking = () => speaking;
  const onState = fn => stateFns.push(fn);

  // Il testo può essere una stringa (tutta in italiano) oppure una lista di pezzi
  // { t: "testo", l: "en" } — i pezzi con l:"en" vengono letti nella lingua straniera della
  // materia (inglese, oppure francese/spagnolo/tedesco per la seconda lingua): vedi setForeign.
  let LANG_EN = "en-US";
  const FOREIGN_NAMES = { en: "l'inglese", fr: "il francese", es: "lo spagnolo", de: "il tedesco" };
  const setForeign = loc => { LANG_EN = loc || "en-US"; };
  const hasWord = s => /[A-Za-z0-9À-ÿ]/.test(s);

  // Il plugin sceglie da solo la prima voce della lingua, anche se è una voce "network"
  // che offline dà errore. Qui scelgo io una voce locale (se c'è) per ogni lingua.
  // Stile della voce: tono (pitch), velocità e genere (f/m), scelti dal personaggio e dalle Impostazioni.
  let STYLE = { pitch: 1, rate: 0.95, g: "f" };
  const setStyle = s => { STYLE = { ...STYLE, ...s }; };
  // Voci italiane di Google: ita/itd/ite sono femminili, itb/itc maschili (se non ci sono si usa la prima locale)
  const GENDER_IDS = { f: ["-ita-", "-itd-", "-ite-"], m: ["-itb-", "-itc-"] };
  let voicesP = null;
  const voiceCache = {};
  function pickVoice(loc, g) {
    const ck = loc + "|" + (g || "");
    if (voiceCache[ck] !== undefined) return Promise.resolve(voiceCache[ck]);
    if (!voicesP) voicesP = window.TTS && window.TTS.getVoices ? window.TTS.getVoices().catch(() => []) : Promise.resolve([]);
    return voicesP.then(list => {
      const key = loc.toLowerCase();
      const names = (list || []).map(v => String(v && (v.identifier || v.name) || "")).filter(n => n.toLowerCase().includes(key));
      const pref = g && loc.slice(0, 2) === "it" ? GENDER_IDS[g] : null;
      const byGender = pref && (names.find(n => /local/i.test(n) && pref.some(k => n.toLowerCase().includes(k))) || names.find(n => pref.some(k => n.toLowerCase().includes(k)) && !/network/i.test(n)));
      const best = byGender || names.find(n => /local/i.test(n)) || names.find(n => !/network/i.test(n)) || "";
      voiceCache[ck] = best;
      return best;
    });
  }

  function toSegments(input) {
    const raw = Array.isArray(input) ? input : [{ t: String(input) }];
    const out = [];
    raw.forEach(s => {
      if (!s || !String(s.t).length) return;
      const seg = { t: String(s.t).replace(/_{2,}/g, ", "), l: s.l === "en" ? "en" : "" };
      const prev = out[out.length - 1];
      if (!hasWord(seg.t) && prev) { prev.t += seg.t; return; }   // solo punteggiatura: la attacco al pezzo prima
      if (prev && prev.l === seg.l) { prev.t += seg.t; return; }  // stessa lingua: un pezzo solo
      out.push(seg);
    });
    return out.filter(s => hasWord(s.t));
  }

  // onFail(messaggio) viene chiamata se la voce non parte, così l'app può avvisare
  function speak(input, onFail) {
    const my = ++token;
    setSpeaking(true);
    const segs = toSegments(input);
    const fail = why => {
      if (!onFail || my !== token) return;
      const detail = why ? " (" + String(why && why.message || why).slice(0, 80) + ")" : "";
      const needEn = segs.some(s => s.l === "en");
      onFail("La voce non parte: controlla che il telefono abbia la sintesi vocale con l'italiano" + (needEn ? " e " + (FOREIGN_NAMES[LANG_EN.slice(0, 2)] || "la lingua straniera") : "") + "." + detail);
    };
    return new Promise(resolve => {
      const done = () => { if (my === token) setSpeaking(false); resolve(); };
      if (!segs.length) { done(); return; }
      try {
        if (window.TTS) {
          // Ogni pezzo parte con la sua voce. Se un pezzo dà errore (succede quando si
          // cambia lingua di colpo) riprovo dopo una breve pausa, senza fermare tutto.
          const wait = ms => new Promise(r => setTimeout(r, ms));
          let failed = null;
          const say = async (s, i) => {
            const en = s.l === "en", loc = en ? LANG_EN : LANG;
            const vid = await pickVoice(loc, en ? "" : STYLE.g);
            const opts = { text: s.t, locale: loc, rate: (en ? 1.15 : 0.95) * (STYLE.rate / 0.95), pitch: STYLE.pitch };
            if (vid) opts.identifier = vid;
            for (let k = 0; k < 3; k++) {
              if (my !== token) return;
              try { await window.TTS.speak(opts); return; }
              catch (err) {
                failed = err;
                if (k === 1) { delete opts.identifier; }   // seconda volta senza voce scelta da me
                await wait(250 + k * 250);
              }
            }
          };
          (async () => {
            for (let i = 0; i < segs.length && my === token; i++) {
              if (i > 0) await wait(150);
              await say(segs[i], i);
            }
            if (failed && my === token) fail(failed);
            done();
          })();
          return;
        }
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const voices = window.speechSynthesis.getVoices() || [];
          segs.forEach((s, i) => {
            const en = s.l === "en";
            const u = new SpeechSynthesisUtterance(s.t);
            u.lang = en ? LANG_EN : LANG; u.rate = (en ? 1.1 : 0.92) * (STYLE.rate / 0.95); u.pitch = STYLE.pitch;
            const vc = en
              ? (voices.find(x => x.lang.replace("_", "-").toLowerCase() === LANG_EN.toLowerCase()) || voices.find(x => x.lang.toLowerCase().startsWith(LANG_EN.slice(0, 2).toLowerCase())))
              : voices.find(x => /^it/i.test(x.lang));
            if (vc) u.voice = vc;
            u.onerror = e => { fail(e && e.error); done(); };
            if (i === segs.length - 1) u.onend = () => done();
            window.speechSynthesis.speak(u);
          });
          return;
        }
      } catch (e) { fail(e); }
      done();
    });
  }

  function stopSpeaking() {
    token++;
    setSpeaking(false);
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
    try { if (window.TTS && window.TTS.stop) { const r = window.TTS.stop(); if (r && r.catch) r.catch(() => {}); } } catch (e) {}
  }

  // ---------- microfono ----------
  const SR = () => window.SpeechRecognition || window.webkitSpeechRecognition;
  const plugin = () => (window.plugins && window.plugins.speechRecognition) || null;
  const canListen = () => !!(plugin() || SR());

  // Ritorna una Promise con la lista delle frasi riconosciute
  function listen() {
    return new Promise((resolve, reject) => {
      const p = plugin();
      if (p) {
        p.isRecognitionAvailable(ok => {
          if (!ok) return reject(new Error("non disponibile"));
          p.hasPermission(has => {
            const start = () => p.startListening(
              matches => resolve(matches || []),
              err => reject(new Error(String(err))),
              { language: LANG, matches: 5, showPopup: false, showPartial: false });
            if (has) start();
            else p.requestPermission(start, () => reject(new Error("permesso negato")));
          }, () => reject(new Error("permesso")));
        }, () => reject(new Error("non disponibile")));
        return;
      }
      const R = SR();
      if (!R) return reject(new Error("non disponibile"));
      const rec = new R();
      rec.lang = LANG; rec.maxAlternatives = 5; rec.interimResults = false;
      rec.onresult = e => {
        const out = [];
        for (const r of e.results) for (let i = 0; i < r.length; i++) out.push(r[i].transcript);
        resolve(out);
      };
      rec.onerror = e => reject(new Error(e.error || "errore"));
      rec.onnomatch = () => resolve([]);
      try { rec.start(); } catch (e) { reject(e); }
    });
  }

  return { speak, stopSpeaking, isSpeaking, onState, listen, canSpeak, canListen, matchOption, numerify, setForeign, setStyle };
})();
