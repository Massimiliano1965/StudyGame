// ===== Personaggi originali disegnati in SVG =====
// Tre famiglie: creatura fantasy, robot, esploratore (volpe).
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
    { id: "creatura",    name: "Creature fantasy",  pet: "Pufo" },
    { id: "robot",       name: "Robot e spazio",    pet: "Bip" },
    { id: "esploratore", name: "Esploratori",       pet: "Rudy" }
  ];

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

  // ---------- 3) Esploratore: la volpe Rudy ----------
  function esploratore(c, st, mood, sty) {
    const hard = sty !== "kawaii", teen = sty === "teen";
    const d = shade(c, -0.22), l = shade(c, 0.55);
    const khaki = "#D9B26F", khakiD = "#B88A44";
    let s = "";
    // coda
    s += `<path d="M138 164 C186 168 200 120 176 100 C176 128 154 142 134 146 Z" fill="${c}"/>` +
         `<path d="M176 100 C170 108 170 116 176 124 C190 116 190 106 176 100 Z" fill="#fff"/>`;
    // zaino
    if (st >= 1) s += `<rect x="124" y="118" width="34" height="48" rx="12" fill="#3D7BFF"/><rect x="130" y="130" width="22" height="14" rx="5" fill="#2F62CC"/>`;
    // gambe e corpo
    s += `<ellipse cx="80" cy="176" rx="17" ry="9" fill="${d}"/><ellipse cx="120" cy="176" rx="17" ry="9" fill="${d}"/>`;
    s += `<ellipse cx="100" cy="144" rx="42" ry="38" fill="${c}"/>`;
    s += `<ellipse cx="100" cy="152" rx="26" ry="26" fill="#FFF3DD"/>`;
    // felpa (medie)
    if (teen) {
      s += `<path d="M58 128 Q100 112 142 128 L148 172 Q100 188 52 172 Z" fill="${HOOD}"/>` +
           `<path d="M92 124 L90 150 M108 124 L110 150" stroke="${LIME}" stroke-width="3.5" stroke-linecap="round"/>` +
           `<rect x="78" y="156" width="44" height="14" rx="6" fill="${HOOD2}"/>`;
    }
    // gilet
    if (st >= 6 && !teen) {
      s += `<path d="M62 132 Q70 176 96 180 L96 120 Z" fill="${khaki}" stroke="${khakiD}" stroke-width="2.5"/>` +
           `<path d="M138 132 Q130 176 104 180 L104 120 Z" fill="${khaki}" stroke="${khakiD}" stroke-width="2.5"/>` +
           `<circle cx="92" cy="150" r="2.6" fill="${khakiD}"/><circle cx="108" cy="150" r="2.6" fill="${khakiD}"/>`;
    }
    // braccia
    const arm = teen ? HOOD : d;
    s += `<ellipse cx="60" cy="146" rx="9" ry="17" transform="rotate(16 60 146)" fill="${arm}"/>` +
         `<ellipse cx="140" cy="146" rx="9" ry="17" transform="rotate(-16 140 146)" fill="${arm}"/>`;
    if (hard) s += sneaker(80, 177, c) + sneaker(120, 177, c);
    // mappa in mano
    if (st >= 4) {
      s += `<g transform="rotate(-18 150 152)"><rect x="140" y="132" width="18" height="34" rx="4" fill="#FFF3DD" stroke="${khakiD}" stroke-width="2.5"/>` +
           `<path d="M144 142 L154 146 M144 152 L154 150 M146 160 L152 158" stroke="#FF5C8A" stroke-width="2.4" stroke-linecap="round"/></g>`;
    }
    // sciarpa
    if (st >= 2 && !hard) s += `<path d="M66 124 Q100 144 134 124 L132 112 Q100 130 68 112 Z" fill="#FF5C8A"/>`;
    // binocolo
    if (st >= 3 && !teen) {
      s += `<rect x="80" y="134" width="40" height="8" rx="3" fill="${NAVY}" opacity=".0"/>` +
           `<circle cx="88" cy="146" r="9" fill="#5B5F97"/><circle cx="112" cy="146" r="9" fill="#5B5F97"/>` +
           `<rect x="92" y="142" width="16" height="8" rx="3" fill="#5B5F97"/><circle cx="88" cy="146" r="4.5" fill="#BDEBFF"/><circle cx="112" cy="146" r="4.5" fill="#BDEBFF"/>`;
    }
    // medaglia bussola
    if (st >= 7) s += `<circle cx="100" cy="164" r="9" fill="#FFD23F" stroke="#E0A800" stroke-width="2.5"/><path d="M100 157 L103 164 L100 171 L97 164 Z" fill="#FF5C8A"/>`;
    // orecchie
    s += `<path d="M58 70 L56 28 L86 52 Z" fill="${c}"/><path d="M64 62 L63 40 L78 54 Z" fill="${NAVY}" opacity=".85"/>` +
         `<path d="M142 70 L144 28 L114 52 Z" fill="${c}"/><path d="M136 62 L137 40 L122 54 Z" fill="${NAVY}" opacity=".85"/>`;
    // testa
    s += `<ellipse cx="100" cy="88" rx="52" ry="44" fill="${c}"/>`;
    s += `<path d="M48 100 Q60 134 100 134 Q140 134 152 100 Q130 112 100 112 Q70 112 48 100 Z" fill="#fff"/>`;
    s += eyes(80, 120, 88, 10.5, mood, sty) + cheeks(66, 134, 108, 7, sty);
    s += `<ellipse cx="100" cy="102" rx="7" ry="5" fill="${NAVY}"/>`;
    s += mouth(100, 114, mood, 8, sty);
    // cappello
    if (teen) {
      s += `<path d="M58 68 Q58 28 100 26 Q142 28 142 68 Z" fill="${HOOD}" stroke="${NAVY}" stroke-width="3" stroke-linejoin="round"/>` +
           `<path d="M58 62 Q100 72 142 62" fill="none" stroke="${LIME}" stroke-width="4.5"/>` +
           `<path d="M120 64 Q154 56 172 70 Q146 80 120 72 Z" fill="${HOOD2}" stroke="${NAVY}" stroke-width="3" stroke-linejoin="round"/>` +
           `<circle cx="100" cy="27" r="4.5" fill="${LIME}"/>`;
    } else if (st < 5) {
      s += `<path d="M58 62 Q100 22 142 62 Q100 54 58 62 Z" fill="${khaki}" stroke="${khakiD}" stroke-width="2.5" stroke-linejoin="round"/>` +
           `<path d="M54 64 Q100 72 146 64 Q100 56 54 64 Z" fill="${khakiD}"/>`;
    } else {
      s += `<ellipse cx="100" cy="62" rx="62" ry="12" fill="${khaki}" stroke="${khakiD}" stroke-width="2.5"/>` +
           `<path d="M66 60 Q68 24 100 22 Q132 24 134 60 Z" fill="${khaki}" stroke="${khakiD}" stroke-width="2.5" stroke-linejoin="round"/>` +
           `<rect x="67" y="46" width="66" height="9" fill="#FF5C8A"/>` +
           `<path d="M128 44 Q150 20 164 28 Q152 46 132 52 Z" fill="#3DDC97" stroke="#2A9E6B" stroke-width="2"/>`;
    }
    if (hard) s += headphones(c, 0, 52, 4, 88);
    if (st >= 7) s += star(22, 60, 8, "#FFD23F") + star(180, 50, 7, "#FFD23F");
    return s;
  }

  const DRAW = { creatura, robot, esploratore };

  // Ritorna l'SVG come stringa. opts: { family, color(hex), stage(0..7), mood(happy|cheer|sad), label }
  function svg(opts) {
    const family = DRAW[opts.family] ? opts.family : "creatura";
    const color = opts.color || COLORS[0].hex;
    const stage = Math.max(0, Math.min(7, opts.stage | 0));
    const mood = opts.mood || "happy";
    const k = 0.82 + stage * 0.026;   // il personaggio cresce
    const sty = stage <= 2 ? "kawaii" : stage <= 4 ? "cool" : "teen";
    const sx = sty === "teen" ? 0.95 : 1, sy = sty === "teen" ? 1.05 : 1;   // più slanciato alle medie
    const body = DRAW[family](color, stage, mood, sty);
    const name = (FAMILIES.find(f => f.id === family) || {}).pet || "Compagno";
    return `<svg class="char ${sty}" viewBox="${opts.viewBox || "0 0 200 200"}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${opts.label || name}">` +
           shadow + `<g transform="translate(100 182) scale(${(k * sx).toFixed(3)} ${(k * sy).toFixed(3)}) translate(-100 -182)">${body}</g></svg>`;
  }

  return { svg, COLORS, FAMILIES };
})();
