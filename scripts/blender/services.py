"""Onega service objects. Cycles studio, shared materials and authored geometry."""
import bpy, math, os
from mathutils import Vector
from pathlib import Path
root=Path(__file__).resolve().parents[2]
# Reuse primitive/material definitions without executing the tractor scene.
exec((root/'scripts/blender/tractor.py').read_text().split('# Trailer:')[0])
wood=mat('Pallet hardwood',(.35,.28,.19),0,.8)
card=mat('Corrugated board',(.55,.49,.39),0,.85)
film=mat('Stretch film',(.8,.85,.9),0,.13)
p=film.node_tree.nodes.get('Principled BSDF');p.inputs['Transmission Weight'].default_value=.96;p.inputs['IOR'].default_value=1.1

def pallet(x,y,z=0):
 for a in [-.45,0,.45]:
  for b in [-.35,.35]:box('Pallet block',(x+a,y+b,z+.09),(.16,.18,.18),wood,.015)
 for a in range(6):box('Pallet deck',(x-.5+a*.2,y,z+.21),(.17,.95,.065),wood,.008)
 for a in [-.45,0,.45]:box('Pallet runner',(x+a,y,z+.025),(.18,.95,.05),wood,.005)
def carton(x,y,z,w=.5,d=.4,h=.45):
 box('Corrugated carton',(x,y,z+h/2),(w,d,h),card,.012)
 box('Paper tape',(x,y,z+h+.002),(.055,d,.006),white,.001)
 box('Fold seam',(x,y-d/2-.003,z+h/2),(.003,.004,h),wood)
def stack(x,y,z=0,strap=False):
 pallet(x,y,z)
 for level in range(3):
  for dx in [-.26,.26]:
   for dy in [-.23,.23]:carton(x+dx,y+dy,z+.25+level*.45)
 shell=box('Transparent stretch wrap',(x,y,z+.95),(1.04,.91,1.39),film,.015)
 solid=shell.modifiers.new('Film thickness','SOLIDIFY');solid.thickness=.002
 if strap:
  box('Orange shipping strap',(x,y-.462,z+.94),(.05,.012,1.4),orange,.003)
  box('Orange strap top',(x,y,z+1.647),(.05,.93,.012),orange,.003)
def studio(name,target,scale):
 if os.environ.get("ONEGA_RENDER_ONLY") and os.environ["ONEGA_RENDER_ONLY"] != name:return
 world=bpy.context.scene.world;world.use_nodes=True;world.node_tree.nodes['Background'].inputs[0].default_value=(.18,.22,.29,1);world.node_tree.nodes['Background'].inputs[1].default_value=.4
 for loc,power,size in [((-5,-6,9),1500,7),((4,5,7),1800,6),((-7,2,4),1000,5)]:
  bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=power;o.data.size=size;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
 bpy.ops.object.camera_add(location=(-7,-10,7));cam=bpy.context.object;cam.rotation_euler=(Vector(target)-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=scale
 s=bpy.context.scene;s.camera=cam;s.render.engine='CYCLES';s.cycles.samples=40;s.cycles.use_denoising=True;s.render.threads_mode='FIXED';s.render.threads=8;s.render.resolution_x=1600;s.render.resolution_y=1200;s.render.resolution_percentage=100;s.render.film_transparent=True;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA';s.view_settings.view_transform='AgX';s.render.filepath=str(root/f'public/images/renders/{name}.png');bpy.ops.render.render(write_still=True)
def clear():
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
stack(-.9,-.5,strap=True);stack(.7,.7);pallet(1.2,-.8);carton(1.2,-.8,.25,.9,.75,.7);carton(1.2,-.8,.95,.6,.5,.5)
studio('groupage',(.2,0,.8),5.6);clear()
# Three storage levels with braced steel uprights and a reach truck.
for x in [-1.5,1.5]:
 for y in [-.5,.5]:box('Steel upright',(x,y,1.9),(.09,.09,3.8),navy,.008)
 for z in [.1,1.35,2.6]:
  line('Diagonal brace',[(x,-.5,z),(x,.5,z+1.15)],.024,metal)
for z in [.2,1.4,2.6]:
 for y in [-.5,.5]:box('Rack beam',(0,y,z),(3.1,.09,.12),orange,.008)
 for x in [-.76,.76]:
  pallet(x,0,z+.07)
  for dx in [-.26,.26]:carton(x+dx,0,z+.32,.5,.8,.65)
box('Reach truck chassis',(-2.1,-1.1,.35),(1,.8,.4),navy,.06)
box('Battery housing',(-2.3,-1.1,.8),(.6,.8,.65),white,.06)
for y in [-1.46,-.74]:
 cyl('Truck wheel',(-2.25,y,.23),.21,.13,rubber)
 box('Mast',(-1.72,y,1.1),(.08,.08,2),navy,.008)
 box('Fork',(-1.15,y,.23),(1.1,.08,.07),metal,.008)
box('Mast crossbar',(-1.72,-1.1,1.98),(.08,.8,.08),metal,.008)
box('Operator seat',(-2.3,-1.1,1.1),(.35,.5,.12),black,.04)
line('Control tiller',[(-2,-1.1,.8),(-1.98,-1.1,1.35),(-2.18,-1.1,1.5)],.04,black)
studio('warehouse',(-.45,-.2,1.9),7.8)
if os.environ.get('ONEGA_RENDER_ONLY')=='warehouse':raise SystemExit(0)
clear()
carton(-.4,.3,0,1.25,.85,.9);carton(-.5,.3,.9,.9,.7,.65);carton(.75,.25,0,.75,.65,.55);carton(.65,.25,.55,.55,.5,.4)
# Barcode on the front carton, distinct machine-readable-looking bars, no text.
for i in range(24):box('Barcode',(-.85+i*.029,-.128,.46),(.008+(i%3)*.003,.006,.24),black)
scanner=box('Scanner handle',(.7,-.65,.28),(.18,.24,.55),navy,.05);scanner.rotation_euler[1]=-.4
box('Scanner head',(.58,-.65,.58),(.43,.38,.23),navy,.045)
box('Scanner lens',(.35,-.65,.59),(.016,.27,.11),glass,.02)
box('Scanner orange trigger',(.57,-.65,.32),(.06,.1,.08),orange,.01)
studio('marketplaces',(0,0,.65),3.6)
# Full tractor uses precisely the same geometry as the hero.
bpy.ops.wm.open_mainfile(filepath=str(root/'artifacts/tractor.blend'))
s=bpy.context.scene;s.render.resolution_x=1600;s.render.resolution_y=1200;s.render.filepath=str(root/'public/images/renders/ftl.png');bpy.ops.render.render(write_still=True)
# Native 4K solid master and matching native line pass.
s.render.resolution_x=3840;s.render.resolution_y=2400;s.render.filepath=str(root/'public/images/renders/hero-solid.png');bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=str(root/'artifacts/tractor-4k.blend'))
