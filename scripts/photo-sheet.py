from PIL import Image,ImageOps,ImageDraw
from pathlib import Path
root=Path(__file__).resolve().parents[1]
files=sorted((root/'public/images/photos/source').glob('*-original.png'))
out=Image.new('RGB',(1600,4*255),'white');d=ImageDraw.Draw(out)
for i,p in enumerate(files):
 im=Image.open(p);out.paste(ImageOps.fit(im,(400,225)),((i%4)*400,(i//4)*255));d.text(((i%4)*400+8,(i//4)*255+230),p.stem,fill='black')
out.save(root/'artifacts/stage-2/originals.jpg')
