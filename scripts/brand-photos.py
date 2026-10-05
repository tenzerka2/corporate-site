"""Perspective branding and export explicitly requested in the visual brief.
Native generated files preserved; 3840px JPEG masters are Lanczos upscales.
"""
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw,ImageFont
import numpy as np,json,subprocess
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
root=Path(__file__).resolve().parents[1];out=root/'public/images/photos';src=out/'source'
for p in (root/'.next/static/media').glob('*.woff2'):
 f=TTFont(p)
 if all(ord(c) in f.getBestCmap() for c in 'ОНЕГА'):
  if 'fvar' in f:f=instantiateVariableFont(f,{'wght':700})
  f.flavor=None;f.save(root/'artifacts/stage-2/inter.ttf');break
font=ImageFont.truetype(str(root/'artifacts/stage-2/inter.ttf'),120)
logo=Image.new('RGBA',(660,150));d=ImageDraw.Draw(logo)
for i,length in enumerate([125,105,80]):d.line([(10,45+i*26),(10+length,45+i*26)],fill='#F26B1D' if i==2 else '#0B2A4A',width=13)
d.text((163,-2),'ОНЕГА',font=font,fill='#0B2A4A')
mark=Image.new('RGBA',(100,70));d=ImageDraw.Draw(mark)
for i,length in enumerate([80,65,50]):d.line([(5,12+i*20),(5+length,12+i*20)],fill=(255,255,255,230),width=7)
# Clockwise target corners, normalized to the generated image dimensions.
quads={
'highway-dawn':[[[.59,.32],[.70,.365],[.70,.414],[.59,.382]]],
'driver':[[[.36,.19],[.48,.27],[.48,.30],[.36,.235]]],
'loading':[[[.77,.24],[.87,.33],[.87,.40],[.77,.33]]],
'warehouse':[[[.18,.31],[.29,.36],[.29,.39],[.18,.36]]],
'client-manager':[[[.87,.25],[.96,.28],[.96,.30],[.87,.285]]],
'customer-handover':[[[.05,.255],[.18,.22],[.18,.285],[.05,.305]]],
'winter-route':[[[.65,.36],[.75,.425],[.75,.485],[.65,.435]]],
'fleet':[[[.66,.48],[.84,.411],[.84,.48],[.66,.565]],[[.42,.44],[.55,.398],[.55,.443],[.42,.492]],[[.29,.4],[.36,.38],[.36,.413],[.29,.438]]],
'marketplace':[[[.76,.23],[.92,.295],[.92,.35],[.76,.30]]],
'director':[[[.72,.23],[.82,.245],[.82,.28],[.72,.27]]],
'team':[[[.68,.135],[.85,.235],[.85,.28],[.68,.20]]],
'fleet-portrait':[[[.7,.475],[.94,.393],[.94,.447],[.7,.541]],[[.45,.388],[.72,.331],[.72,.377],[.45,.441]],[[.27,.332],[.55,.285],[.55,.318],[.27,.385]]],
'team-portrait':[[[.37,.115],[.64,.126],[.64,.168],[.37,.165]]],
}
# Chest mark anchors (normalized x,y,width); deliberate placement below reflective band.
chests={'driver':[(.54,.54,.027)],'customer-handover':[(.455,.53,.022)],'warehouse':[(.515,.695,.021)],'marketplace':[(.159,.64,.024),(.49,.30,.02)],'loading':[(.155,.48,.012)],'logistics-office':[(.10,.40,.019),(.48,.69,.019)],'client-manager':[(.28,.54,.023)],'team':[(.245,.414,.014),(.353,.423,.014),(.742,.468,.014)],'team-portrait':[(.285,.596,.036),(.573,.63,.033),(.575,.408,.029)]}
focal={'driver':.59,'warehouse':.57,'director':.42,'customer-handover':.67,'logistics-office':.55,'client-manager':.49,'loading':.52,'highway-dawn':.57,'winter-route':.59,'marketplace':.41}
def warp(im,asset,q):
 w,h=im.size;dst=[(x*w,y*h) for x,y in q];sw,sh=asset.size;source=[(0,0),(sw,0),(sw,sh),(0,sh)];a=[];b=[]
 for (x,y),(u,v) in zip(dst,source):a.extend([[x,y,1,0,0,0,-u*x,-u*y],[0,0,0,x,y,1,-v*x,-v*y]]);b.extend([u,v])
 coeff=np.linalg.solve(np.array(a),np.array(b));layer=asset.transform(im.size,Image.Transform.PERSPECTIVE,coeff,Image.Resampling.BICUBIC);im.alpha_composite(layer)
def webp(im,p):
 for q in range(88,44,-3):
  im.save(p,'WEBP',quality=q,method=6)
  if p.stat().st_size<=350000:break
 assert p.stat().st_size<=350000,p
report=[]
for p in sorted(src.glob('*-original.png')):
 slug=p.name.replace('-original.png','');im=Image.open(p).convert('RGBA');native=im.size
 for quad in quads.get(slug,[]):warp(im,logo,quad)
 for x,y,w in chests.get(slug,[]):
  h=w*im.width/im.height*.7;warp(im,mark,[(x,y),(x+w,y),(x+w,y+h),(x,y+h)])
 im=im.convert('RGB');im.resize((round(im.width*3840/max(im.size)),round(im.height*3840/max(im.size))),Image.Resampling.LANCZOS).save(src/f'{slug}-3840.jpg',quality=95,subsampling=0)
 if slug.endswith('-portrait'):
  webp(ImageOps.fit(im,(1536,1920),method=Image.Resampling.LANCZOS),out/f'{slug}.webp')
 else:
  webp(ImageOps.fit(im,(1920,1080),method=Image.Resampling.LANCZOS),out/f'{slug}.webp')
  if not (src/f'{slug}-portrait-original.png').exists():
   # Center crop with an explicit focal point, keeping the subject visible.
   cw=im.height*.8;left=max(0,min(im.width-cw,focal.get(slug,.5)*im.width-cw/2));crop=im.crop((round(left),0,round(left+cw),im.height));webp(crop.resize((1536,1920),Image.Resampling.LANCZOS),out/f'{slug}-portrait.webp')
 report.append({'slug':slug,'native':native,'masterLongSide':3840,'upscale':'Lanczos','branding':'perspective composite'})
(root/'artifacts/stage-2/photo-exports.json').write_text(json.dumps(report,indent=2))
for portrait in [False,True]:
 files=sorted(out.glob('*-portrait.webp')) if portrait else sorted(p for p in out.glob('*.webp') if '-portrait' not in p.name)
 cw,ch=(300,375) if portrait else (400,225);sheet=Image.new('RGB',(cw*4,(ch+30)*3),'white');d=ImageDraw.Draw(sheet)
 for i,p in enumerate(files):sheet.paste(Image.open(p).resize((cw,ch)),(i%4*cw,i//4*(ch+30)));d.text((i%4*cw+8,i//4*(ch+30)+ch+6),p.stem,fill='#0B2A4A')
 sheet.save(out/('contact-sheet-portrait.png' if portrait else 'contact-sheet.png'))
print('Exported',len(report),'masters and 24 web images')
