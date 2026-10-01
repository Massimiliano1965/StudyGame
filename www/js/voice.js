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

  // onFail(messaggio) viene chiamata se la voce non parte, così l'app può avvisare
  function speak(text, onFail) {
    const fail = (why) => {
      if (!onFail) return;
      const detail = why ? " (" + String(why && why.message || why).slice(0, 80) + ")" : "";
      onFail("La voce non parte: controlla che il telefono abbia la sintesi vocale con l'italiano." + detail);
    };
    return new Promise(resolve => {
      try {
        if (window.TTS) {
          const r = window.TTS.speak({ text, locale: LANG, rate: 0.95 });
          if (r && r.then) r.then(() => resolve(), err => { fail(err); resolve(); }); else resolve();
          return;
        }
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(text);
          u.lang = LANG; u.rate = 0.92; u.pitch = 1.1;
          const v = (window.speechSynthesis.getVoices() || []).find(x => /^it/i.test(x.lang));
          if (v) u.voice = v;
          u.onend = () => resolve();
          u.onerror = e => { fail(e && e.error); resolve(); };
          window.speechSynthesis.speak(u);
          return;
        }
      } catch (e) { fail(e); }
      resolve();
    });
  }

  function stopSpeaking() {
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

  return { speak, stopSpeaking, listen, canSpeak, canListen, matchOption, numerify };
})();
