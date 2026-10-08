// ===== Personaggi originali disegnati in SVG =====
// Tre famiglie: creatura fantasy, robot, hip hop (volpe).
// Ogni personaggio cresce con la classe: stage = 0..7 (1ª elementare ... 3ª media).
// Nessun personaggio esistente è usato come modello.
const Characters = (() => {
  const NAVY = "#2B2D52";

  const COLORS = [
    { id: "arancio", name: "Arancio", hex: "#FF8A3D" },
    { id: "lampone", name: "Lampone", hex: "#FF5C8A" },
    { id: "cielo",   name: "Cielo",   hex: "#4DB8FF" },
    { id: "menta",   name: "Menta",   hex: "#3DDC97" },
    { id: "viola",   name: "Viola",   hex: "#9B6BFF" },
    { id: "sole",    name: "Sole",    hex: "#FFC93C" }
  ];

  const FAMILIES = [
    { id: "creatura",    name: "Creature fantasy",  pet: "Pufo", hi: "Ciao! Sono Pufo. Giochiamo insieme?" },
    { id: "robot",       name: "Robot e spazio",    pet: "Bip",  hi: "Bip bip! Sono Bip. Sono pronto a giocare!" },
    { id: "esploratore", name: "Hip hop",           pet: "Rudy", hi: "Hey Bro! Sono Rudy. Facciamo il botto!" }
  ];
  // personaggi delle medie (dalla 1ª media in su)
  const TEEN_FAMILIES = [
    { id: "visiera",    name: "Cyber",    pet: "Zero", hi: "Yo! Sono Zero. Sistema pronto, si gioca?" },
    { id: "cappellino", name: "Street",   pet: "Kai",  hi: "Ehi! Sono Kai. Facciamo il punteggio?" },
    { id: "beanie",     name: "Chill",    pet: "Sky",  hi: "Ciao! Sono Sky. Tranquillo, ci penso io!" },
    { id: "casco",      name: "Racer",    pet: "Rex",  hi: "Ehi! Sono Rex. Ti sfido, ci stai?" },
    { id: "cuffie",     name: "Music",    pet: "Nia",  hi: "Ciao! Sono Nia. Metti le cuffie e partiamo!" }
  ];
  const familiesFor = stage => (stage >= 5 ? TEEN_FAMILIES : stage >= 3 ? MID_FAMILIES : FAMILIES);
  const allFamilies = () => FAMILIES.concat(MID_FAMILIES, TEEN_FAMILIES);

  // ---------- utilità colore ----------
  function toRgb(h) {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function shade(hex, p) {            // p > 0 schiarisce, p < 0 scurisce
    const [r, g, b] = toRgb(hex);
    const t = p < 0 ? 0 : 255, a = Math.abs(p);
    const m = v => Math.round(v + (t - v) * a);
    return "#" + [m(r), m(g), m(b)].map(v => v.toString(16).padStart(2, "0")).join("");
  }

  // ---------- parti comuni ----------
  // sty: "kawaii" (1ª-2ª el.), "cool" (3ª-5ª el.), "teen" (medie)
  function eyes(x1, x2, y, r, mood, sty) {
    const hard = sty && sty !== "kawaii";
    if (mood === "cheer") {
      const arc = x => `<path d="M${x - r} ${y + 3} Q${x} ${y - r * 1.5} ${x + r} ${y + 3}" fill="none" stroke="${NAVY}" stroke-width="4.5" stroke-linecap="round"/>`;
      return arc(x1) + arc(x2);
    }
    if (hard) {
      // occhi "a mezza palpebra": sicuri di sé, leggermente inclinati
      const half = (x, tilt) =>
        `<g transform="rotate(${tilt} ${x} ${y})">` +
        `<path d="M${x - r} ${y} A${r} ${r} 0 0 0 ${x + r} ${y} Z" fill="#fff"/>` +
        `<path d="M${x - r * 0.52} ${y} A${r * 0.52} ${r * 0.52} 0 0 0 ${x + r * 0.52} ${y} Z" transform="translate(1.5 0)" fill="${NAVY}"/>` +
        `<circle cx="${x + 3}" cy="${y + r * 0.35}" r="${(r * 0.14).toFixed(1)}" fill="#fff"/>` +
        `<path d="M${x - r - 1.5} ${y} L${x + r + 1.5} ${y}" stroke="${NAVY}" stroke-width="4.5" stroke-linecap="round"/></g>`;
      if (mood === "sad") return half(x1, -16) + half(x2, 16);
      return half(x1, 6) + half(x2, -6);
    }
    const open = x =>
      `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>` +
      `<circle cx="${x + 1}" cy="${y + 1.5}" r="${(r * 0.56).toFixed(1)}" fill="${NAVY}"/>` +
      `<circle cx="${(x + r * 0.28).toFixed(1)}" cy="${(y - r * 0.12).toFixed(1)}" r="${(r * 0.2).toFixed(1)}" fill="#fff"/>`;
    if (mood === "sad") {
      return open(x1) + open(x2) +
        `<path d="M${x1 - r} ${y - r + 1} L${x1 + r} ${y - r - 4}" stroke="${NAVY}" stroke-width="3.5" stroke-linecap="round"/>` +
        `<path d="M${x2 + r} ${y - r + 1} L${x2 - r} ${y - r - 4}" stroke="${NAVY}" stroke-width="3.5" stroke-linecap="round"/>`;
    }
    return open(x1) + open(x2);
  }

  function mouth(cx, y, mood, w, sty) {
    w = w || 10;
    const hard = sty && sty !== "kawaii";
    if (hard) {
      if (mood === "cheer") {
        return `<path d="M${cx - w} ${y - 3} Q${cx} ${y + w * 1.4} ${cx + w} ${y - 3} Z" fill="#7A2E4A" stroke="${NAVY}" stroke-width="3" stroke-linejoin="round"/>`;
      }
      if (mood === "sad") {
        return `<path d="M${cx - w * 0.7} ${y + 4} L${cx + w * 0.7} ${y + 4}" stroke="${NAVY}" stroke-width="4" stroke-linecap="round"/>`;
      }
      // sorrisetto da furbo
      return `<path d="M${cx - w} ${y} Q${cx} ${y + w * 0.7} ${cx + w * 1.1} ${y - 5}" fill="none" stroke="${NAVY}" stroke-width="4" stroke-linecap="round"/>`;
    }
    if (mood === "cheer") {
      return `<path d="M${cx - w} ${y - 2} Q${cx} ${y + w * 1.9} ${cx + w} ${y - 2} Z" fill="#7A2E4A" stroke="${NAVY}" stroke-width="3" stroke-linejoin="round"/>` +
             `<path d="M${cx - w * 0.5} ${y + w * 0.9} Q${cx} ${y + w * 0.4} ${cx + w * 0.5} ${y + w * 0.9} Q${cx} ${y + w * 1.4} ${cx - w * 0.5} ${y + w * 0.9} Z" fill="#FF8FA8"/>`;
    }
    if (mood === "sad") {
      return `<path d="M${cx - w * 0.8} ${y + 5} Q${cx} ${y - 5} ${cx + w * 0.8} ${y + 5}" fill="none" stroke="${NAVY}" stroke-width="4" stroke-linecap="round"/>`;
    }
    return `<path d="M${cx - w} ${y - 2} Q${cx} ${y + w} ${cx + w} ${y - 2}" fill="none" stroke="${NAVY}" stroke-width="4" stroke-linecap="round"/>`;
  }

  function star(x, y, s, fill) {
    return `<path d="M${x} ${y - s} Q${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y} Q${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s} Q${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y} Q${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s} Z" fill="${fill}"/>`;
  }

  const shadow = `<ellipse cx="100" cy="186" rx="54" ry="8" fill="${NAVY}" opacity=".16"/>`;
  const cheeks = (x1, x2, y, r, sty) => (sty && sty !== "kawaii") ? "" :
    `<circle cx="${x1}" cy="${y}" r="${r}" fill="#FF7FA0" opacity=".45"/><circle cx="${x2}" cy="${y}" r="${r}" fill="#FF7FA0" opacity=".45"/>`;

  // ---------- accessori "da grandi" (cuffie, felpa, scarpe da ginnastica) ----------
  const LIME = "#C6F432", HOOD = "#3A2E8F", HOOD2 = "#5646C9";
  const cupColor = c => (c === "#4DB8FF" ? "#FF3D81" : "#2EE6FF");

  function headphones(c, cy, rx, topY, cupY) {
    const cup = cupColor(c);
    return `<path d="M${100 - rx} ${cupY} C${100 - rx - 4} ${topY} ${100 + rx + 4} ${topY} ${100 + rx} ${cupY}" fill="none" stroke="${NAVY}" stroke-width="8" stroke-linecap="round"/>` +
           `<rect x="${100 - rx - 10}" y="${cupY - 14}" width="18" height="32" rx="8" fill="${cup}" stroke="${NAVY}" stroke-width="3"/>` +
           `<rect x="${100 + rx - 8}" y="${cupY - 14}" width="18" height="32" rx="8" fill="${cup}" stroke="${NAVY}" stroke-width="3"/>`;
  }
  function sneaker(x, y, c) {
    return `<g transform="translate(${x} ${y})">` +
      `<path d="M-21 2 Q-21 -10 -8 -10 L8 -7 Q23 -3 23 6 L23 9 L-21 9 Z" fill="#fff" stroke="${NAVY}" stroke-width="3" stroke-linejoin="round"/>` +
      `<rect x="-22" y="6" width="46" height="6" rx="3" fill="${LIME}" stroke="${NAVY}" stroke-width="2.5"/>` +
      `<path d="M-8 -2 L6 -1" stroke="${cupColor(c)}" stroke-width="4" stroke-linecap="round"/></g>`;
  }

  // ---------- 1) Creatura fantasy: Pufo ----------
  function creatura(c, st, mood, sty) {
    const hard = sty !== "kawaii", teen = sty === "teen";
    const d = shade(c, -0.2), l = shade(c, 0.5);
    const scarf = c === "#4DB8FF" ? "#FF5C8A" : "#3D7BFF";
    let s = "";
    // coda
    s += `<path d="M146 152 C184 158 198 128 184 106 C178 126 162 136 144 136 Z" fill="${d}"/>` +
         `<circle cx="184" cy="106" r="8" fill="${shade(c, 0.35)}"/>`;
    // ali (dalla 4ª classe in poi, crescono)
    if (st >= 3) {
      const k = 0.55 + (st - 3) * 0.14;
      const wing = `<path d="M0 0 C-34 -26 -54 -2 -44 26 C-32 14 -20 12 -6 16 Z" fill="${shade(c, 0.38)}" stroke="${d}" stroke-width="3" stroke-linejoin="round"/>`;
      s += `<g transform="translate(54 116) scale(${k.toFixed(2)})">${wing}</g>`;
      s += `<g transform="translate(146 116) scale(${(-k).toFixed(2)} ${k.toFixed(2)})">${wing}</g>`;
    }
    // piedi e corpo
    s += `<ellipse cx="76" cy="174" rx="19" ry="10" fill="${d}"/><ellipse cx="124" cy="174" rx="19" ry="10" fill="${d}"/>`;
    s += `<ellipse cx="100" cy="122" rx="60" ry="55" fill="${c}"/>`;
    s += `<ellipse cx="100" cy="138" rx="35" ry="32" fill="${l}"/>`;
    // felpa (medie)
    if (teen) {
      s += `<path d="M46 152 Q100 126 154 152 L150 172 Q100 184 50 172 Z" fill="${HOOD}"/>` +
           `<path d="M62 158 Q100 142 138 158" fill="none" stroke="${HOOD2}" stroke-width="4"/>` +
           `<path d="M92 146 L90 166 M108 146 L110 166" stroke="${LIME}" stroke-width="3.5" stroke-linecap="round"/>` +
           `<rect x="78" y="162" width="44" height="12" rx="6" fill="${HOOD2}"/>`;
    }
    // braccia
    const arm = teen ? HOOD : d;
    s += `<ellipse cx="42" cy="134" rx="9" ry="17" transform="rotate(22 42 134)" fill="${arm}"/>` +
         `<ellipse cx="158" cy="134" rx="9" ry="17" transform="rotate(-22 158 134)" fill="${arm}"/>`;
    if (hard) s += sneaker(76, 172, c) + sneaker(124, 172, c);
    // macchioline
    if (st >= 2) {
      s += `<circle cx="64" cy="104" r="5" fill="${d}" opacity=".45"/><circle cx="138" cy="100" r="4" fill="${d}" opacity=".45"/>` +
           `<circle cx="150" cy="118" r="3.5" fill="${d}" opacity=".45"/>`;
    }
    // orecchie
    s += `<circle cx="54" cy="78" r="14" fill="${c}"/><circle cx="54" cy="79" r="7.5" fill="${l}"/>` +
         `<circle cx="146" cy="78" r="14" fill="${c}"/><circle cx="146" cy="79" r="7.5" fill="${l}"/>`;
    // ciuffo o corna
    if (st < 2) {
      s += `<path d="M100 68 Q96 52 88 47 M100 68 Q100 50 100 41 M100 68 Q104 52 112 47" stroke="${d}" stroke-width="5.5" stroke-linecap="round" fill="none"/>`;
    } else {
      const horn = `<path d="M70 76 Q60 48 76 38 Q82 58 88 72 Z" fill="#FFE08A" stroke="#E5B94A" stroke-width="2.5" stroke-linejoin="round"/>`;
      s += horn + `<g transform="translate(200 0) scale(-1 1)">${horn}</g>`;
    }
    // sciarpa
    if (st >= 4 && !hard) {
      s += `<path d="M62 158 Q100 176 138 158 L136 146 Q100 164 64 146 Z" fill="${scarf}"/>` +
           `<path d="M126 158 L134 184 L148 180 L140 154 Z" fill="${scarf}"/>`;
    }
    // faccia
    s += eyes(80, 120, 110, 11.5, mood, sty) + cheeks(62, 138, 128, 8, sty) + mouth(100, 130, mood, 10, sty);
    if (hard) s += headphones(c, 0, 46, 28, 82);
    // corona e scintille
    if (st >= 6 && !hard) {
      s += `<path d="M84 60 L87 42 L95 52 L100 36 L105 52 L113 42 L116 60 Z" fill="#FFD23F" stroke="#E0A800" stroke-width="2.5" stroke-linejoin="round"/>` +
           `<circle cx="100" cy="56" r="3" fill="#FF5C8A"/>`;
    }
    if (st >= 7) s += star(26, 52, 9, "#FFD23F") + star(176, 60, 7, "#FFD23F") + star(18, 118, 6, "#FFD23F");
    return s;
  }

  // ---------- 2) Robot: Bip ----------
  function robot(c, st, mood, sty) {
    const hard = sty !== "kawaii", teen = sty === "teen";
    const d = shade(c, -0.22), l = shade(c, 0.5);
    const screen = "#2B3A7A", glow = "#7CF3FF";
    let s = "";
    // ali di luce (ultimo stadio)
    if (st >= 7) {
      const w = `<path d="M60 100 C20 70 6 96 14 128 C30 110 46 112 62 124 Z" fill="#FFF3B0" stroke="#FFD23F" stroke-width="3" stroke-linejoin="round"/>`;
      s += w + `<g transform="translate(200 0) scale(-1 1)">${w}</g>`;
    }
    // mantello
    if (st >= 6) s += `<path d="M64 118 L40 176 Q100 190 160 176 L136 118 Z" fill="#FF5C8A"/>`;
    // jetpack
    if (st >= 4) {
      s += `<rect x="50" y="116" width="16" height="40" rx="7" fill="${d}"/><rect x="134" y="116" width="16" height="40" rx="7" fill="${d}"/>` +
           `<path d="M52 158 Q58 176 64 158 Z" fill="#FF8A3D"/><path d="M136 158 Q142 176 148 158 Z" fill="#FF8A3D"/>`;
    }
    // piedi
    s += `<rect x="68" y="166" width="26" height="14" rx="7" fill="${d}"/><rect x="106" y="166" width="26" height="14" rx="7" fill="${d}"/>`;
    // braccia
    if (st >= 1) {
      s += `<rect x="40" y="118" width="14" height="36" rx="7" fill="${d}"/><circle cx="47" cy="158" r="8" fill="${l}"/>` +
           `<rect x="146" y="118" width="14" height="36" rx="7" fill="${d}"/><circle cx="153" cy="158" r="8" fill="${l}"/>`;
    }
    // corpo
    s += `<rect x="58" y="114" width="84" height="58" rx="20" fill="${c}"/>`;
    s += `<rect x="72" y="126" width="56" height="30" rx="10" fill="${l}"/>`;
    if (teen) {
      s += `<path d="M58 136 Q58 114 80 114 L86 172 L78 172 Q58 172 58 152 Z" fill="${HOOD}"/>` +
           `<path d="M142 136 Q142 114 120 114 L114 172 L122 172 Q142 172 142 152 Z" fill="${HOOD}"/>` +
           `<path d="M62 150 L82 150 M138 150 L118 150" stroke="${LIME}" stroke-width="3.5" stroke-linecap="round"/>` +
           `<path d="M84 112 L100 128 L116 112" fill="none" stroke="${LIME}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`;
    }
    if (hard) s += sneaker(81, 172, c) + sneaker(119, 172, c);
    if (st >= 3) {
      s += `<circle cx="86" cy="141" r="5" fill="#FF5C8A"/><circle cx="100" cy="141" r="5" fill="#FFD23F"/><circle cx="114" cy="141" r="5" fill="#34a847"/>`;
    } else {
      s += `<circle cx="100" cy="141" r="6" fill="#FFD23F"/>`;
    }
    // collo e antenna
    s += `<rect x="92" y="108" width="16" height="10" rx="3" fill="${d}"/>`;
    s += `<rect x="97" y="22" width="6" height="22" rx="3" fill="${d}"/><circle cx="100" cy="20" r="${st >= 2 ? 8 : 6}" fill="${st >= 2 ? "#FF5C8A" : "#FFD23F"}"/>`;
    // orecchie e testa
    s += `<circle cx="50" cy="78" r="11" fill="${d}"/><circle cx="150" cy="78" r="11" fill="${d}"/>`;
    s += `<rect x="52" y="40" width="96" height="76" rx="26" fill="${c}"/>`;
    if (st >= 7) s += `<rect x="52" y="40" width="96" height="76" rx="26" fill="none" stroke="#FFD23F" stroke-width="4"/>`;
    s += `<rect x="63" y="51" width="74" height="54" rx="16" fill="${screen}"/>`;
    // occhi sullo schermo
    const gx1 = 82, gx2 = 118, gy = 76;
    if (mood === "cheer") {
      const arc = x => `<path d="M${x - 9} ${gy + 4} Q${x} ${gy - 14} ${x + 9} ${gy + 4}" fill="none" stroke="${glow}" stroke-width="5" stroke-linecap="round"/>`;
      s += arc(gx1) + arc(gx2);
    } else if (mood === "sad") {
      s += `<ellipse cx="${gx1}" cy="${gy + 3}" rx="8" ry="9" fill="${glow}"/><ellipse cx="${gx2}" cy="${gy + 3}" rx="8" ry="9" fill="${glow}"/>` +
           `<path d="M${gx1 - 10} ${gy - 7} L${gx1 + 8} ${gy - 12}" stroke="${glow}" stroke-width="4" stroke-linecap="round"/>` +
           `<path d="M${gx2 + 10} ${gy - 7} L${gx2 - 8} ${gy - 12}" stroke="${glow}" stroke-width="4" stroke-linecap="round"/>`;
    } else if (hard) {
      s += `<rect x="${gx1 - 11}" y="${gy - 5}" width="22" height="11" rx="4" fill="${glow}" transform="rotate(-9 ${gx1} ${gy})"/>` +
           `<rect x="${gx2 - 11}" y="${gy - 5}" width="22" height="11" rx="4" fill="${glow}" transform="rotate(9 ${gx2} ${gy})"/>`;
    } else {
      s += `<ellipse cx="${gx1}" cy="${gy}" rx="8" ry="10" fill="${glow}"/><ellipse cx="${gx2}" cy="${gy}" rx="8" ry="10" fill="${glow}"/>` +
           `<circle cx="${gx1 + 2}" cy="${gy - 3}" r="2.6" fill="#fff"/><circle cx="${gx2 + 2}" cy="${gy - 3}" r="2.6" fill="#fff"/>`;
    }
    const my = 94;
    if (mood === "cheer") s += `<path d="M90 ${my - 3} Q100 ${my + 12} 110 ${my - 3} Z" fill="${glow}"/>`;
    else if (mood === "sad") s += `<path d="M91 ${my + 3} Q100 ${my - 5} 109 ${my + 3}" fill="none" stroke="${glow}" stroke-width="3.5" stroke-linecap="round"/>`;
    else s += `<path d="M91 ${my - 2} Q100 ${my + 7} 109 ${my - 2}" fill="none" stroke="${glow}" stroke-width="3.5" stroke-linecap="round"/>`;
    if (!hard) s += `<circle cx="70" cy="92" r="5" fill="#FF7FA0" opacity=".55"/><circle cx="130" cy="92" r="5" fill="#FF7FA0" opacity=".55"/>`;
    if (hard) s += headphones(c, 0, 50, 14, 80);
    // visiera trasparente
    if (st >= 5 && !hard) s += `<ellipse cx="100" cy="76" rx="62" ry="56" fill="#BDEBFF" opacity=".22" stroke="#fff" stroke-width="3" stroke-opacity=".6"/>`;
    if (st >= 7) s += star(24, 44, 8, "#FFD23F") + star(178, 40, 7, "#FFD23F");
    return s;
  }

  // ---------- 3) Hip hop: la volpe Rudy (cuffie, cappellino di traverso, jeans larghissimi) ----------
  function esploratore(c, st, mood, sty) {
    const hard = sty !== "kawaii";
    const d = shade(c, -0.22);
    let s = "";
    // coda
    s += `<path d="M138 164 C186 168 200 120 176 100 C176 128 154 142 134 146 Z" fill="${c}"/>` +
         `<path d="M176 100 C170 108 170 116 176 124 C190 116 190 106 176 100 Z" fill="#fff"/>`;
    // maglia larga gialla + catena d'oro
    s += `<path d="M54 124 Q100 108 146 124 L152 160 Q100 170 48 160 Z" fill="#FFD23F" stroke="${NAVY}" stroke-width="3" stroke-linejoin="round"/>`;
    s += `<path d="M80 122 Q100 146 120 122" fill="none" stroke="#E0A800" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="142" r="7" fill="#FFD23F" stroke="#E0A800" stroke-width="2.5"/>`;
    // braccio sinistro giù, destro che saluta
    s += `<ellipse cx="54" cy="146" rx="9" ry="17" transform="rotate(16 54 146)" fill="${d}"/>`;
    s += `<path d="M144 130 Q172 126 176 96" fill="none" stroke="${d}" stroke-width="16" stroke-linecap="round"/><circle cx="176" cy="90" r="10" fill="${c}"/>`;
    // boxer in vista + jeans larghissimi a vita bassa, orlo sulle scarpe
    s += `<rect x="50" y="152" width="100" height="10" rx="4" fill="#FF5C8A" stroke="${NAVY}" stroke-width="2.5"/>`;
    s += `<path d="M48 160 Q32 172 22 184 L98 184 L100 172 Z" fill="#3D7BFF" stroke="${NAVY}" stroke-width="3" stroke-linejoin="round"/>` +
         `<path d="M152 160 Q168 172 178 184 L102 184 L100 172 Z" fill="#3D7BFF" stroke="${NAVY}" stroke-width="3" stroke-linejoin="round"/>` +
         `<path d="M44 174 Q62 182 86 174" fill="none" stroke="#2F62CC" stroke-width="3"/><path d="M114 174 Q138 182 156 174" fill="none" stroke="#2F62CC" stroke-width="3"/>`;
    s += `<g transform="translate(-14 0)">` + sneaker(80, 180, c) + `</g><g transform="translate(14 0)">` + sneaker(120, 180, c) + `</g>`;
    // orecchie
    s += `<path d="M58 70 L56 28 L86 52 Z" fill="${c}"/><path d="M64 62 L63 40 L78 54 Z" fill="${NAVY}" opacity=".85"/>` +
         `<path d="M142 70 L144 28 L114 52 Z" fill="${c}"/><path d="M136 62 L137 40 L122 54 Z" fill="${NAVY}" opacity=".85"/>`;
    // testa con musetto piccolo
    s += `<ellipse cx="100" cy="88" rx="52" ry="44" fill="${c}"/>`;
    s += `<ellipse cx="100" cy="110" rx="22" ry="14" fill="#FFF3DD"/>`;
    s += eyes(80, 120, 88, 10.5, mood, sty);
    if (!hard) s += cheeks(66, 134, 108, 7, sty);
    s += `<ellipse cx="100" cy="102" rx="7" ry="5" fill="${NAVY}"/>`;
    s += mouth(100, 114, mood, 8, sty);
    // cuffie stereo
    s += headphones(c, 0, 52, 4, 88);
    // cappellino di traverso
    s += `<g transform="rotate(-24 100 52)"><path d="M62 62 Q62 24 100 22 Q138 24 138 62 Z" fill="#FF5C8A" stroke="${NAVY}" stroke-width="3" stroke-linejoin="round"/>` +
         `<path d="M126 56 Q166 50 178 64 Q150 74 126 68 Z" fill="#C93F6C" stroke="${NAVY}" stroke-width="3" stroke-linejoin="round"/>` +
         `<circle cx="100" cy="24" r="4" fill="#FFD23F"/></g>`;
    if (st >= 7) s += star(22, 60, 8, "#FFD23F") + star(180, 50, 7, "#FFD23F");
    return s;
  }


  // ---------- Look per le medie: personaggi da gamer, con faccia e carattere ----------
  const SKIN = ["#F2C4A0", "#C98B62", "#8D5A3B", "#F6D5BD", "#E0A97F", "#B67A52"];
  const INK = "#14162a";
  const skinOf = c => SKIN[Math.max(0, COLORS.findIndex(x => x.hex === c)) % SKIN.length];
  function body(c, dark) {   // spalle con felpa, cappuccio, catenina
    return `<path d="M14 200 Q16 148 62 140 L138 140 Q184 148 186 200Z" fill="${dark}"/>
      <path d="M62 140 Q100 164 138 140 L134 150 Q100 176 66 150Z" fill="${shade(dark, .12)}"/>
      <path d="M78 150 L82 186 M122 150 L118 186" stroke="${c}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="82" cy="188" r="3.5" fill="${c}"/><circle cx="118" cy="188" r="3.5" fill="${c}"/>
      <path d="M62 170 L72 170 M128 170 L138 170" stroke="${shade(dark, .25)}" stroke-width="3" stroke-linecap="round"/>`;
  }
  function mouth(mood, x, y, w, col) {
    if (mood === "cheer") return `<path d="M${x - w} ${y} Q${x} ${y + w * 1.1} ${x + w} ${y}Z" fill="#fff" stroke="${col}" stroke-width="3" stroke-linejoin="round"/>`;
    if (mood === "sad") return `<path d="M${x - w * .7} ${y + 4} Q${x} ${y - 5} ${x + w * .7} ${y + 4}" fill="none" stroke="${col}" stroke-width="3.2" stroke-linecap="round"/>`;
    return `<path d="M${x - w} ${y} Q${x - w * .1} ${y + 7} ${x + w} ${y - 3}" fill="none" stroke="${col}" stroke-width="3.2" stroke-linecap="round"/>`;
  }
  function eyeRow(mood, x1, x2, y, col, wide) {   // occhi con sopracciglio
    const brow = mood === "sad" ? [[-1, -5], [1, -5]] : mood === "cheer" ? [[-1, 0], [1, 0]] : [[-1, 3], [1, -2]];
    const one = (x, i) => {
      const bw = wide || 12, b = brow[i];
      const lid = `<path d="M${x - bw} ${y - 12 + b[1] * (i ? 1 : 0)} L${x + bw} ${y - 12 + b[1] * (i ? 0 : 1)}" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
      if (mood === "cheer") return `<path d="M${x - 8} ${y + 3} Q${x} ${y - 9} ${x + 8} ${y + 3}" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>` + lid;
      return `<ellipse cx="${x}" cy="${y}" rx="7" ry="${mood === "sad" ? 6 : 8}" fill="#fff"/><circle cx="${x + 1}" cy="${y + 1}" r="4.2" fill="${INK}"/><circle cx="${x + 2.5}" cy="${y - .5}" r="1.4" fill="#fff"/>` + lid;
    };
    return one(x1, 0) + one(x2, 1);
  }
  const DARK = "#1b1f33";
  const TEEN = {
    // Zero: cappuccio e visiera luminosa con due occhi digitali
    visiera(c, st, mood) {
      const e = mood === "cheer" ? `<path d="M72 98 Q80 88 88 98 M112 98 Q120 88 128 98" fill="none" stroke="#06101a" stroke-width="5" stroke-linecap="round"/>`
        : mood === "sad" ? `<path d="M72 96 L88 102 M128 96 L112 102" stroke="#06101a" stroke-width="5" stroke-linecap="round"/><circle cx="80" cy="102" r="4" fill="#06101a"/><circle cx="120" cy="102" r="4" fill="#06101a"/>`
        : `<rect x="72" y="90" width="16" height="14" rx="5" fill="#06101a"/><rect x="112" y="90" width="16" height="14" rx="5" fill="#06101a"/>`;
      return body(c, DARK) + `<path d="M46 108 Q44 36 100 34 Q156 36 154 108 L152 134 Q146 152 100 152 Q54 152 48 134Z" fill="#2a3050"/>
        <path d="M50 70 Q100 20 150 70" fill="none" stroke="${shade(c, .1)}" stroke-width="3" opacity=".7"/>
        <path d="M58 84 Q100 70 142 84 L138 118 Q100 130 62 118Z" fill="${c}"/><path d="M58 84 Q100 70 142 84" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2.5"/>
        <path d="M66 112 Q100 122 134 112" stroke="#fff" stroke-opacity=".25" stroke-width="2" fill="none"/>${e}
        ${mouth(mood, 100, 140, 11, shade(c, .5))}
        <rect x="150" y="82" width="9" height="30" rx="4" fill="${c}"/><path d="M155 82 L155 62" stroke="${c}" stroke-width="3"/><circle cx="155" cy="60" r="4" fill="${shade(c, .5)}"/>
        <path d="M60 52 L70 56 M64 44 L76 50" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>`;
    },
    // Kai: cappellino girato, cuffie, orecchino, sorriso furbo
    cappellino(c, st, mood) {
      const sk = skinOf(c);
      return body(c, DARK) + `<rect x="87" y="120" width="26" height="28" rx="9" fill="${shade(sk, -.1)}"/>
        <ellipse cx="62" cy="102" rx="6" ry="9" fill="${sk}"/><ellipse cx="138" cy="102" rx="6" ry="9" fill="${sk}"/>
        <path d="M100 56 Q142 56 140 100 Q138 140 100 142 Q62 140 60 100 Q58 56 100 56Z" fill="${sk}"/>
        <circle cx="138" cy="116" r="3.2" fill="#FFD23F"/>
        ${eyeRow(mood, 84, 116, 100, INK)}
        <path d="M100 104 L97 114 L103 114" fill="none" stroke="${shade(sk, -.25)}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        ${mouth(mood, 100, 126, 12, INK)}
        <path d="M56 92 Q58 46 100 44 Q142 46 144 92 Q122 70 100 72 Q76 70 56 92Z" fill="${c}"/>
        <path d="M60 90 Q100 60 140 90" fill="none" stroke="${shade(c, -.25)}" stroke-width="3"/>
        <path d="M64 72 Q40 78 36 90 L72 86Z" fill="${shade(c, -.2)}"/>
        <circle cx="100" cy="47" r="4" fill="${shade(c, .4)}"/>
        <path d="M52 100 Q48 40 100 36 Q152 40 148 100" fill="none" stroke="#2c3250" stroke-width="6" stroke-linecap="round"/>
        <rect x="42" y="92" width="18" height="30" rx="9" fill="${c}"/><rect x="140" y="92" width="18" height="30" rx="9" fill="${c}"/>
        <rect x="46" y="98" width="6" height="18" rx="3" fill="${shade(c, .5)}" opacity=".7"/><rect x="148" y="98" width="6" height="18" rx="3" fill="${shade(c, .5)}" opacity=".7"/>`;
    },
    // Sky: berretto di lana, occhiali a specchio, cuffie al collo, sorriso sicuro
    beanie(c, st, mood) {
      const sk = skinOf(c);
      const glass = mood === "sad" ? 4 : 0;
      return body(c, DARK) + `<path d="M64 140 Q100 168 136 140" fill="none" stroke="#2c3250" stroke-width="6" stroke-linecap="round"/>
        <rect x="48" y="138" width="16" height="22" rx="8" fill="${c}"/><rect x="136" y="138" width="16" height="22" rx="8" fill="${c}"/>
        <rect x="87" y="120" width="26" height="28" rx="9" fill="${shade(sk, -.1)}"/>
        <ellipse cx="62" cy="104" rx="6" ry="9" fill="${sk}"/><ellipse cx="138" cy="104" rx="6" ry="9" fill="${sk}"/>
        <path d="M100 58 Q142 58 140 102 Q138 142 100 144 Q62 142 60 102 Q58 58 100 58Z" fill="${sk}"/>
        <path d="M100 106 L96 118 L104 118" fill="none" stroke="${shade(sk, -.25)}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M66 ${96 + glass} L134 ${96 + glass} L132 ${110 + glass} Q122 120 110 ${112 + glass} L100 ${106 + glass} L90 ${112 + glass} Q78 120 68 ${110 + glass}Z" fill="#0c0e1c"/>
        <path d="M70 ${100 + glass} L86 ${100 + glass} L80 ${108 + glass}Z M114 ${100 + glass} L130 ${100 + glass} L124 ${108 + glass}Z" fill="${c}" opacity=".85"/>
        <path d="M60 98 L68 98 M132 98 L140 98" stroke="#0c0e1c" stroke-width="4" stroke-linecap="round"/>
        ${mouth(mood, 100, 130, 13, INK)}
        <path d="M54 82 Q54 34 100 32 Q146 34 146 82 L146 92 Q100 82 54 92Z" fill="${c}"/>
        <path d="M54 82 L146 82 L146 94 Q100 84 54 94Z" fill="${shade(c, -.2)}"/>
        <path d="M70 40 L70 80 M86 36 L86 80 M102 34 L102 80 M118 36 L118 80 M134 40 L134 80" stroke="${shade(c, -.25)}" stroke-width="2" opacity=".55"/>
        <circle cx="100" cy="28" r="9" fill="${shade(c, .35)}"/>
        `;
    },
    // Rex: casco con visiera alzata, sticker e sorriso da sfida
    casco(c, st, mood) {
      const sk = skinOf(c);
      return body(c, DARK) + `<rect x="88" y="124" width="24" height="26" rx="8" fill="${shade(sk, -.1)}"/>
        <path d="M66 100 Q66 76 100 76 Q134 76 134 100 L134 124 Q134 142 100 144 Q66 142 66 124Z" fill="${sk}"/>
        ${eyeRow(mood, 86, 114, 108, INK, 10)}
        ${mouth(mood, 100, 130, 11, INK)}
        <path d="M44 106 Q40 34 100 32 Q160 34 156 106 L152 124 Q146 140 128 138 L128 96 Q100 84 72 96 L72 138 Q54 140 48 124Z" fill="#323a60"/>
        <path d="M72 84 Q100 70 128 84 L130 96 Q100 84 70 96Z" fill="${c}"/>
        <path d="M100 32 L100 58" stroke="${c}" stroke-width="7" stroke-linecap="round"/>
        <path d="M58 70 Q62 50 80 44" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="4" stroke-linecap="round"/>
        <path d="M134 56 L146 52 L142 66Z M140 74 L152 72" fill="${c}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>
        <rect x="42" y="92" width="14" height="34" rx="7" fill="${c}"/><rect x="144" y="92" width="14" height="34" rx="7" fill="${c}"/>`;
    },
    // Nia: capelli lunghi con ciocca colorata, cuffie grandi, cerchietto all'orecchio, occhiolino
    cuffie(c, st, mood) {
      const sk = skinOf(c), hair = "#2a1d3d";
      const wink = mood === "happy" ? `<path d="M110 100 Q116 94 122 100" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>` : "";
      return `<path d="M44 108 Q34 40 100 36 Q166 40 156 108 L164 170 Q132 160 134 122 L66 122 Q68 160 36 170Z" fill="${hair}"/>
        <path d="M58 60 Q50 100 46 150" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>` + body(c, DARK) +
        `<rect x="87" y="120" width="26" height="28" rx="9" fill="${shade(sk, -.1)}"/>
        <path d="M100 58 Q140 58 138 102 Q136 140 100 142 Q64 140 62 102 Q60 58 100 58Z" fill="${sk}"/>
        <path d="M62 96 Q60 60 100 56 Q140 60 138 96 Q124 74 108 72 Q86 70 62 96Z" fill="${hair}"/>
        ${mood === "happy" ? eyeRow("happy", 84, 116, 102, INK).split("<ellipse")[0] + `<ellipse cx="84" cy="102" rx="7" ry="8" fill="#fff"/><circle cx="85" cy="103" r="4.2" fill="${INK}"/><circle cx="86.5" cy="101.5" r="1.4" fill="#fff"/>` + wink : eyeRow(mood, 84, 116, 102, INK)}
        <circle cx="76" cy="118" r="5" fill="#ff7a9a" opacity=".35"/><circle cx="124" cy="118" r="5" fill="#ff7a9a" opacity=".35"/>
        ${mouth(mood, 100, 126, 11, "#c0405f")}
        <circle cx="140" cy="116" r="5" fill="none" stroke="#FFD23F" stroke-width="2.5"/>
        <path d="M50 102 Q46 38 100 34 Q154 38 150 102" fill="none" stroke="#2c3250" stroke-width="6" stroke-linecap="round"/>
        <rect x="38" y="88" width="22" height="38" rx="11" fill="${c}"/><rect x="140" y="88" width="22" height="38" rx="11" fill="${c}"/>
        <rect x="44" y="96" width="8" height="22" rx="4" fill="${shade(c, .5)}" opacity=".7"/><rect x="148" y="96" width="8" height="22" rx="4" fill="${shade(c, .5)}" opacity=".7"/>`;
    }
  };

  // ---------- Look di 4ª e 5ª elementare: a metà strada, simpatici ma non più «da piccoli» ----------
  function tee(c) {   // maglietta colorata con colletto e stellina
    return `<path d="M16 200 Q18 152 62 142 L138 142 Q182 152 184 200Z" fill="${c}"/>
      <path d="M78 142 Q100 168 122 142 L116 146 Q100 160 84 146Z" fill="${shade(c, -.25)}"/>
      <path d="M100 176 l4 9 9.5 1 -7 6.5 2 9.5 -8.5 -5 -8.5 5 2 -9.5 -7 -6.5 9.5 -1z" fill="#fff" opacity=".9" transform="translate(0 -10) scale(.9) translate(11 0)"/>`;
  }
  const hairOf = c => ["#3b2417", "#1f1a2e", "#6b3d1f", "#2a1d3d", "#8a5a2b", "#1d2438"][Math.max(0, COLORS.findIndex(x => x.hex === c)) % 6];
  const neck = sk => `<rect x="87" y="124" width="26" height="24" rx="9" fill="${shade(sk, -.1)}"/>`;
  const head = sk => `<ellipse cx="62" cy="104" rx="6" ry="9" fill="${sk}"/><ellipse cx="138" cy="104" rx="6" ry="9" fill="${sk}"/><path d="M100 54 Q144 54 142 102 Q140 144 100 146 Q60 144 58 102 Q56 54 100 54Z" fill="${sk}"/>`;
  const cheeksM = `<circle cx="73" cy="120" r="6" fill="#ff7a9a" opacity=".3"/><circle cx="127" cy="120" r="6" fill="#ff7a9a" opacity=".3"/>`;
  const MID = {
    // Leo: cappellino sportivo, sorriso aperto
    leo(c, st, mood) {
      const sk = skinOf(c);
      return tee(c) + neck(sk) + head(sk) + cheeksM + eyeRow(mood, 84, 116, 102, INK, 10) + mouth(mood, 100, 128, 13, INK) +
        `<path d="M56 90 Q58 42 100 40 Q142 42 144 90 Q122 70 100 72 Q78 70 56 90Z" fill="${shade(c, .15)}"/><path d="M96 66 L152 78 Q150 90 142 88 L96 78Z" fill="${shade(c, -.2)}"/><circle cx="100" cy="43" r="4" fill="#fff"/>
         <path d="M70 62 Q82 52 96 52" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>`;
    },
    // Mia: coda di cavallo e cuffie colorate
    mia(c, st, mood) {
      const sk = skinOf(c), hair = hairOf(c);
      return `<path d="M130 70 Q176 70 168 120 Q164 150 146 160 Q158 120 128 96Z" fill="${hair}"/>` + tee(c) + neck(sk) + head(sk) + cheeksM +
        `<path d="M58 98 Q56 48 100 46 Q144 48 142 98 Q128 66 100 70 Q72 66 58 98Z" fill="${hair}"/>` +
        eyeRow(mood, 84, 116, 104, INK, 10) + mouth(mood, 100, 130, 13, "#c0405f") +
        `<circle cx="128" cy="62" r="7" fill="${c}"/><path d="M54 100 Q50 40 100 38 Q150 40 146 100" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
         <rect x="40" y="90" width="20" height="34" rx="10" fill="${shade(c, .2)}"/><rect x="140" y="90" width="20" height="34" rx="10" fill="${shade(c, .2)}"/>`;
    },
    // Gio: capelli ricci e occhiali tondi
    gio(c, st, mood) {
      const sk = skinOf(c), hair = hairOf(c);
      const curls = [[64, 66], [80, 52], [100, 46], [120, 52], [136, 66], [56, 86], [144, 86]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="${hair}"/>`).join("");
      return tee(c) + neck(sk) + curls + head(sk) +
        `<path d="M62 92 Q70 62 100 60 Q130 62 138 92 Q120 76 100 76 Q80 76 62 92Z" fill="${hair}"/>` + cheeksM +
        eyeRow(mood, 84, 116, 104, INK, 10) +
        `<circle cx="84" cy="104" r="15" fill="#fff" fill-opacity=".15" stroke="${INK}" stroke-width="3.5"/><circle cx="116" cy="104" r="15" fill="#fff" fill-opacity=".15" stroke="${INK}" stroke-width="3.5"/><path d="M99 104 L101 104" stroke="${INK}" stroke-width="3.5"/>` +
        mouth(mood, 100, 130, 12, INK);
    },
    // Bit: robottino fresco, schermo-faccia con occhi LED
    bot(c, st, mood) {
      const eyes = mood === "cheer" ? `<path d="M72 98 Q80 88 88 98 M112 98 Q120 88 128 98" fill="none" stroke="#06101a" stroke-width="6" stroke-linecap="round"/>`
        : mood === "sad" ? `<path d="M72 98 L88 92 M128 98 L112 92" stroke="#06101a" stroke-width="5" stroke-linecap="round"/><circle cx="80" cy="102" r="6" fill="#06101a"/><circle cx="120" cy="102" r="6" fill="#06101a"/>`
        : `<circle cx="80" cy="98" r="8" fill="#06101a"/><circle cx="120" cy="98" r="8" fill="#06101a"/><circle cx="83" cy="95" r="2.5" fill="#fff"/><circle cx="123" cy="95" r="2.5" fill="#fff"/>`;
      return `<path d="M16 200 Q18 154 60 144 L140 144 Q182 154 184 200Z" fill="${shade(c, -.15)}"/><rect x="72" y="156" width="56" height="30" rx="8" fill="${shade(c, .35)}"/><circle cx="88" cy="171" r="5" fill="${c}"/><circle cx="104" cy="171" r="5" fill="#FFC94A"/><circle cx="120" cy="171" r="5" fill="#34a847"/>
        <rect x="88" y="136" width="24" height="14" rx="4" fill="#8B91A6"/>
        <rect x="52" y="52" width="96" height="88" rx="28" fill="${c}"/><rect x="60" y="62" width="80" height="62" rx="20" fill="#0f1430"/><rect x="64" y="66" width="72" height="54" rx="17" fill="${shade(c, .55)}"/>${eyes}
        ${mouth(mood, 100, 114, 10, "#06101a")}
        <rect x="40" y="82" width="14" height="30" rx="7" fill="${shade(c, -.2)}"/><rect x="146" y="82" width="14" height="30" rx="7" fill="${shade(c, -.2)}"/>
        <path d="M100 52 L100 34" stroke="#8B91A6" stroke-width="4"/><circle cx="100" cy="30" r="7" fill="#FFC94A"/>`;
    },
    // Dino: felpa con cappuccio e cresta da dinosauro
    dino(c, st, mood) {
      const sk = skinOf(c);
      return `<path d="M16 200 Q18 152 62 142 L138 142 Q182 152 184 200Z" fill="${c}"/><path d="M78 142 L84 186 M122 142 L116 186" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
        <path d="M60 60 L72 30 L84 52 L100 22 L116 52 L128 30 L140 60Z" fill="${shade(c, .3)}"/>
        <path d="M46 108 Q42 44 100 40 Q158 44 154 108 L150 138 Q100 162 50 138Z" fill="${shade(c, -.15)}"/>
        <path d="M64 86 Q100 70 136 86 Q146 120 126 138 Q100 150 74 138 Q54 120 64 86Z" fill="${sk}"/>` + cheeksM +
        eyeRow(mood, 84, 116, 104, INK, 10) +
        (mood === "cheer" ? `<path d="M82 124 Q100 144 118 124Z" fill="#fff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` : mouth(mood, 100, 128, 14, INK)) +
        `<circle cx="100" cy="46" r="3.5" fill="#fff" opacity=".6"/>`;
    }
  };
  const MID_FAMILIES = [
    { id: "leo",  name: "Sport",   pet: "Leo",  hi: "Ciao! Sono Leo. Si parte?" },
    { id: "mia",  name: "Musica",  pet: "Mia",  hi: "Ciao! Sono Mia. Giochiamo insieme?" },
    { id: "gio",  name: "Genio",   pet: "Gio",  hi: "Ehi! Sono Gio. Ho una gran voglia di sfide!" },
    { id: "bot",  name: "Robot",   pet: "Bit",  hi: "Bip! Sono Bit. Sistemi pronti!" },
    { id: "dino", name: "Dino",    pet: "Dino", hi: "Ciao! Sono Dino. Facciamo il botto!" }
  ];
  const BASE_OF = { visiera: "robot", cappellino: "creatura", beanie: "esploratore", casco: "robot", cuffie: "creatura", leo: "esploratore", mia: "creatura", gio: "creatura", bot: "robot", dino: "creatura" };
  const MID_FROM_OLD = { creatura: "dino", robot: "bot", esploratore: "leo" };

  const TEEN_IDS = ["visiera", "cappellino", "beanie", "casco", "cuffie"];
  const TEEN_FROM_OLD = { creatura: "cappellino", robot: "visiera", esploratore: "beanie" };
  const OLD_FROM_TEEN = { visiera: "robot", cappellino: "creatura", beanie: "esploratore", casco: "robot", cuffie: "creatura" };


  // porta un personaggio nella fascia giusta per la classe (elementari piccole / 4ª-5ª / medie)
  function familyFor(id, stage) {
    const base = BASE_OF[id] || (DRAW[id] ? id : "creatura");
    if (stage >= 5) return TEEN[id] ? id : TEEN_FROM_OLD[base] || "cappellino";
    if (stage >= 3) return MID[id] ? id : MID_FROM_OLD[base];
    return base;
  }

  const DRAW = { creatura, robot, esploratore };

  // Ritorna l'SVG come stringa. opts: { family, color(hex), stage(0..7), mood(happy|cheer|sad), label }
  function svg(opts) {
    const color = opts.color || COLORS[0].hex;
    const stage = Math.max(0, Math.min(7, opts.stage | 0));
    const family = familyFor(opts.family, stage);
    const mood = opts.mood || "happy";
    const k = 0.82 + stage * 0.026;   // il personaggio cresce
    const sty = stage <= 2 ? "kawaii" : stage <= 4 ? "cool" : "teen";
    const sx = sty === "teen" ? 0.95 : 1, sy = sty === "teen" ? 1.05 : 1;   // più slanciato alle medie
    const bodySvg = TEEN[family] ? TEEN[family](color, stage, mood) : MID[family] ? MID[family](color, stage, mood) : DRAW[family](color, stage, mood, sty);
    const name = (allFamilies().find(f => f.id === family) || {}).pet || "Compagno";
    return `<svg class="char ${sty}" viewBox="${opts.viewBox || "0 0 200 200"}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${opts.label || name}">` +
           shadow + `<g transform="translate(100 182) scale(${(k * sx).toFixed(3)} ${(k * sy).toFixed(3)}) translate(-100 -182)">${bodySvg}</g></svg>`;
  }

  return { svg, COLORS, FAMILIES, TEEN_FAMILIES, familiesFor, allFamilies, familyFor, teenOf: id => familyFor(id, 5), oldOf: id => BASE_OF[id] || id };
})();
