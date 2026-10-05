"""Visible technical contours with Freestyle, same camera as the solid pass."""
import bpy
from pathlib import Path
root=Path(__file__).resolve().parents[2]
bpy.ops.wm.open_mainfile(filepath=str(root/'artifacts/tractor-4k.blend'))
m=bpy.data.materials.new('Black technical surface');m.use_nodes=True;n=m.node_tree.nodes;n.clear();links=m.node_tree.links
out=n.new('ShaderNodeOutputMaterial');emission=n.new('ShaderNodeEmission');emission.inputs['Color'].default_value=(0,0,0,1);links.new(emission.outputs[0],out.inputs[0])
for o in bpy.data.objects:
 if o.type in ['MESH','CURVE']:
  o.data.materials.clear();o.data.materials.append(m)
scene=bpy.context.scene;scene.cycles.samples=8;scene.render.use_freestyle=True
settings=bpy.context.view_layer.freestyle_settings
settings.crease_angle=2.3
lineset=settings.linesets[0];lineset.linestyle.color=(.85,.94,1);lineset.linestyle.thickness=2.4
scene.render.filepath=str(root/'public/images/renders/hero-lines-raw.png');bpy.ops.render.render(write_still=True)
