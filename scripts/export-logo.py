"""Convert the locally built Inter Cyrillic font into portable SVG outlines.
Run after npm run build with Python fonttools[woff] installed.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen

root = Path(__file__).resolve().parents[1]
font = None
for source in (root / '.next/static/media').glob('*.woff2'):
    candidate = TTFont(source)
    if all(ord(char) in candidate.getBestCmap() for char in 'Онега'):
        font = candidate
        break
if font is None:
    raise SystemExit('Build first: Inter Cyrillic font not found')
if 'fvar' in font:
    font = instantiateVariableFont(font, {'wght': 700})
glyphs = font.getGlyphSet()
scale = 30 / font['head'].unitsPerEm
x = 53
paths = []
for char in 'Онега':
    name = font.getBestCmap()[ord(char)]
    pen = SVGPathPen(glyphs)
    glyphs[name].draw(pen)
    paths.append(f'<path transform="translate({x:.3f} 30) scale({scale:.7f} {-scale:.7f})" d="{pen.getCommands()}"/>')
    x += glyphs[name].width * scale - 1.5
mark = (root / 'public/brand/mark.svg').read_text()
for name, color in [('logo', '#0B2A4A'), ('logo-dark', '#FFFFFF')]:
    svg = mark.replace('width="48"', 'width="156"').replace('viewBox="0 0 48 40"', 'viewBox="0 0 156 40"').replace('#0B2A4A', color)
    svg = svg.replace('</svg>', f'<g fill="{color}">{"".join(paths)}</g></svg>')
    (root / f'public/brand/{name}.svg').write_text(svg)
