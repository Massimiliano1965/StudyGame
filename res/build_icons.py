#!/usr/bin/env python3
"""Rigenera l'emblema, www/js/logo.js e le icone Android (res/android/*.png). Serve Playwright + Chromium."""
import math, os
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
N = "#2B2D52"

def star(cx, cy, R, r, n=5, rot=-90):
    pts = []
    for k in range(n * 2):
        a = math.radians(rot + k * 180 / n); rad = R if k % 2 == 0 else r
        pts.append((cx + rad * math.cos(a), cy + rad * math.sin(a)))
    return "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + " Z"

frag = f'''<g class="em">
  <g class="em-star"><path d="{star(100, 42, 38, 19)}" fill="#FFD23F" stroke="{N}" stroke-width="6" stroke-linejoin="round"/>
    <circle cx="90" cy="39" r="3.6" fill="{N}"/><circle cx="110" cy="39" r="3.6" fill="{N}"/>
    <path d="M90 47 Q100 56 110 47" fill="none" stroke="{N}" stroke-width="4" stroke-linecap="round"/></g>
  <path d="M10 148 Q56 124 100 160 Q144 124 190 148 L190 160 Q144 136 100 172 Q56 136 10 160 Z" fill="#FF5C8A" stroke="{N}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M100 152 Q60 128 20 140 L20 76 Q60 62 100 86 Z" fill="#FFFFFF" stroke="{N}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M100 152 Q140 128 180 140 L180 76 Q140 62 100 86 Z" fill="#FFF6D6" stroke="{N}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M52 92 h12 v11 h11 v12 H64 v11 H52 v-11 H41 v-12 h11 z" fill="#4DB8FF" stroke="{N}" stroke-width="3.5" stroke-linejoin="round"/>
  <circle cx="138" cy="100" r="9" fill="#FF5C8A" stroke="{N}" stroke-width="3.5"/>
  <circle cx="156" cy="116" r="9" fill="#3DDC97" stroke="{N}" stroke-width="3.5"/>
</g>'''
open(os.path.join(HERE, "emblem.svg"), "w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 190">{frag}</svg>')
open(os.path.join(ROOT, "www/js/logo.js"), "w", encoding="utf-8").write(
    "// ===== Logo di Gioca e Impara (libro aperto + joystick + stella sorridente) — generato da res/build_icons.py =====\n"
    "const Logo = {\n  svg(cls) { return `<svg class=\"${cls || \"\"}\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 190\" aria-hidden=\"true\">"
    + frag.replace("\n", " ") + "</svg>`; }\n};\n")

leg = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}
ada = {"mdpi": 108, "hdpi": 162, "xhdpi": 216, "xxhdpi": 324, "xxxhdpi": 432}
grad = '<defs><linearGradient id="g" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stop-color="#6EC6FF"/><stop offset="0.55" stop-color="#9B6BFF"/><stop offset="1" stop-color="#FF8AB5"/></linearGradient></defs>'
def emb(S, k):
    w = S * k; h = w * 190 / 200
    return f'<svg x="{(S-w)/2}" y="{(S-h)/2+S*0.01}" width="{w}" height="{h}" viewBox="0 0 200 190">{frag}</svg>'
legacy = lambda S: f'<svg xmlns="http://www.w3.org/2000/svg" width="{S}" height="{S}" viewBox="0 0 {S} {S}">{grad}<rect width="{S}" height="{S}" rx="{S*0.22}" fill="url(#g)"/>{emb(S, 0.78)}</svg>'
fg = lambda S: f'<svg xmlns="http://www.w3.org/2000/svg" width="{S}" height="{S}" viewBox="0 0 {S} {S}">{emb(S, 0.56)}</svg>'
bg = lambda S: f'<svg xmlns="http://www.w3.org/2000/svg" width="{S}" height="{S}" viewBox="0 0 {S} {S}">{grad}<rect width="{S}" height="{S}" fill="url(#g)"/></svg>'
out = os.path.join(HERE, "android"); os.makedirs(out, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch()
    def shot(svg, S, path):
        pg = b.new_page(viewport={"width": S, "height": S})
        pg.set_content(f'<html><body style="margin:0;background:transparent">{svg}</body></html>')
        pg.screenshot(path=path, omit_background=True, clip={"x": 0, "y": 0, "width": S, "height": S}); pg.close()
    for d, S in leg.items(): shot(legacy(S), S, f"{out}/icon-{d}.png")
    for d, S in ada.items(): shot(fg(S), S, f"{out}/fg-{d}.png"); shot(bg(S), S, f"{out}/bg-{d}.png")
    shot(legacy(512), 512, os.path.join(HERE, "icon-512.png"))
    b.close()
