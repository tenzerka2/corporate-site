"""Onega tractor and trailer, authored geometry. Blender 5, Cycles."""
import bpy, math
from mathutils import Vector
from pathlib import Path
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
root=Path(__file__).resolve().parents[2]
def mat(name,color,metal=0,rough=.4):
 m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*color,1); p.inputs['Metallic'].default_value=metal; p.inputs['Roughness'].default_value=rough
 return m
navy=mat('Onega navy lacquer',(.012,.045,.1),.45,.3)
white=mat('Trailer canvas',(.77,.8,.82),.05,.57)
rubber=mat('Tyre rubber',(.012,.015,.019),0,.6)
black=mat('Chassis',(.022,.028,.035),.6,.4)
metal=mat('Aluminium',(.35,.42,.48),.85,.25)
glass=mat('Dark windshield',(.015,.055,.08),.6,.13)
orange=mat('Safety orange',(.89,.16,.01),.1,.35)
light=mat('Headlight',(.83,.94,1),.2,.15)
def box(name,loc,scale,material,bevel=0):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(material)
 if bevel:
  b=o.modifiers.new('Manufactured edge','BEVEL');b.width=bevel;b.segments=3;o.modifiers.new('Corner normals','WEIGHTED_NORMAL')
 return o
def cyl(name,loc,radius,depth,material,axis='Y',verts=48):
 bpy.ops.mesh.primitive_cylinder_add(vertices=verts,radius=radius,depth=depth,location=loc);o=bpy.context.object;o.name=name;o.data.materials.append(material)
 if axis=='Y':o.rotation_euler[0]=math.pi/2
 elif axis=='X':o.rotation_euler[1]=math.pi/2
 b=o.modifiers.new('Rounded edges','BEVEL');b.width=.025;b.segments=2;o.modifiers.new('Normals','WEIGHTED_NORMAL');return o
def line(name,pts,radius,material):
 c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.bevel_depth=radius;c.bevel_resolution=3;s=c.splines.new('POLY');s.points.add(len(pts)-1)
 for p,co in zip(s.points,pts):p.co=(*co,1)
 o=bpy.data.objects.new(name,c);bpy.context.collection.objects.link(o);o.data.materials.append(material);return o
# Trailer: taut canvas, machined rail, suspension and three rear axles.
box('Trailer main structure',(2.35,0,2.65),(12.5,2.55,2.7),white,.055)
box('Trailer upper rail',(2.35,0,4.035),(12.62,2.62,.07),metal,.02)
box('Trailer lower rail',(2.35,0,1.29),(12.62,2.62,.12),metal,.02)
box('Trailer chassis',(2.5,0,1.06),(12.3,1.75,.32),black,.025)
for y in [-1.292,1.292]:
 box('Continuous orange safety strip',(2.35,y,1.48),(12.45,.015,.08),orange,.006)
 for x in [i*.52-3.65 for i in range(24)]:
  box('Curtain buckle',(x,y,1.38),(.08,.055,.1),metal,.01)
 for x in [-3.1,-.5,2.2,4.8,7.8]:
  box('Side reflector',(x,y*1.025,1.16),(.15,.04,.065),orange,.009)
 for x in [-2.8,-2.5]:box('Landing leg',(x,y*.7,.68),(.15,.15,.7),black,.01)
 box('Side impact rail',(.4,y, .79),(5.9,.1,.15),metal,.015)
# Rear door seam, hinges and locking rods.
for y in [-.64,.64]:
 box('Rear door',(8.63,y,2.65),(.045,1.22,2.59),white,.01)
 for z in [1.65,2.65,3.65]:box('Door hinge',(8.68,y*1.72,z),(.08,.14,.16),metal,.01)
 line('Lock rod',[(8.7,y,1.5),(8.7,y,3.8)],.025,metal)
box('Rear bumper',(8.72,0,.69),(.12,2.35,.15),metal,.02)
# Tractor frame and cab.
box('Tractor chassis',(-4.55,0,1.03),(5.2,1.76,.26),black,.03)
box('Cab lower body',(-5.85,0,1.66),(2.53,2.52,1.14),navy,.14)
box('Cab upper body',(-5.77,0,2.85),(2.44,2.48,1.4),navy,.18)
box('Cab roof',(-5.5,0,3.58),(2.08,2.43,.45),navy,.18)
box('Roof aerodynamic fairing',(-4.65,0,3.79),(.53,2.35,.64),navy,.16)
# Windshield and doors.
box('Front windshield',(-7.001,0,2.92),(.025,2.19,.87),glass,.12)
for y in [-1.253,1.253]:
 box('Side glazing',(-6.14,y,2.95),(1.25,.025,.78),glass,.08)
 box('Door outline',(-5.99,y*1.006,2.12),(1.47,.012,.03),black,.004)
 box('Door handle',(-5.47,y*1.013,2.45),(.24,.035,.045),metal,.015)
 for z in [1.02,1.23]:box('Cab steps',(-5.45,y*.91,z),(.65,.3,.1),metal,.02)
 line('Mirror arm',[(-6.6,y,3.13),(-6.92,y*1.3,3.13),(-6.92,y*1.3,2.6)],.035,black)
 box('Mirror housing',(-6.9,y*1.3,2.8),(.22,.16,.42),black,.05)
box('Front grille',(-7.14,0,1.94),(.06,1.65,.7),black,.06)
for z in [1.68,1.79,1.9,2.01,2.12]:box('Grille slat',(-7.185,0,z),(.025,1.58,.025),metal,.005)
box('Bumper',(-7.17,0,1.28),(.14,2.43,.28),navy,.07)
for y in [-.92,.92]:
 box('Headlight cluster',(-7.18,y,1.53),(.05,.41,.22),light,.04)
 box('Orange indicator',(-7.214,y,1.69),(.04,.4,.045),orange,.01)
for y in [-.51,.51]:line('Windshield wiper',[(-7.03,y,2.59),(-7.035,y+.32,2.88)],.016,black)
for y in [-1.04,1.04]:
 cyl('Fuel tank',(-3.7,y, .89),.31,1.25,metal,'X')
 box('Tank strap',(-3.9,y, .89),(.09,.63,.63),black,.045)
box('Fifth wheel',(-2.6,0,1.26),(1.0,1.3,.13),metal,.1)
# Axles, detailed wheels, lug nuts and tyre grooves.
for x in [-5.96,-3.07,-2.07,5.55,6.7,7.85]:
 cyl('Axle',(x,0,.58),.13,2.3,black)
 for side in [-1,1]:
  y=side*1.13
  cyl('Tyre',(x,y,.61),.56,.34,rubber,verts=64)
  cyl('Rim',(x,y+side*.18,.61),.35,.025,metal)
  cyl('Hub',(x,y+side*.21,.61),.16,.08,black)
  for a in range(10):
   angle=a*2*math.pi/10
   cyl('Lug bolt',(x+math.sin(angle)*.225,y+side*.202,.61+math.cos(angle)*.225),.024,.026,metal,verts=12)
  for off in [-.115,-.035,.045,.12]:
   bpy.ops.mesh.primitive_torus_add(major_radius=.552,minor_radius=.008,major_segments=64,minor_segments=6,location=(x,y+off,.61),rotation=(math.pi/2,0,0));bpy.context.object.data.materials.append(black)
  box('Mud flap',(x+.56,y,.43),(.035,.44,.54),rubber,.01)
# Onega mark on both sides of the trailer, no third-party wordmarks.
for side in [-1,1]:
 for i,(length,material) in enumerate([(2.1,navy),(1.7,navy),(1.28,orange)]):
  points=[(.5+j*length/32,side*1.286,3.28-i*.22+.045*math.sin(j/32*math.pi*2)) for j in range(33)]
  line('Onega line',points,.055,material)
# Product studio lighting and camera.
world=bpy.context.scene.world;world.color=(.15,.15,.15);world.use_nodes=True;world.node_tree.nodes['Background'].inputs[0].default_value=(.18,.22,.29,1);world.node_tree.nodes['Background'].inputs[1].default_value=.4
for name,loc,power,size in [('Key',(-8,-9,13),2400,9),('Rim',(5,5,10),3000,8),('Front',(-12,2,5),1500,6)]:
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.name=name;o.data.energy=power;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(Vector((0,0,1.8))-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(-17,-22,11));camera=bpy.context.object;camera.rotation_euler=(Vector((.2,0,1.9))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=20.1
scene=bpy.context.scene;scene.camera=camera;scene.render.engine='CYCLES';scene.cycles.samples=48;scene.cycles.use_denoising=True;scene.render.threads_mode='FIXED';scene.render.threads=8
scene.render.resolution_x=1920;scene.render.resolution_y=1200;scene.render.resolution_percentage=100;scene.render.film_transparent=True;scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.render.filepath=str(root/'public/images/renders/tractor-preview.png');scene.view_settings.view_transform='AgX'
bpy.ops.wm.save_as_mainfile(filepath=str(root/'artifacts/tractor.blend'))
bpy.ops.render.render(write_still=True)
