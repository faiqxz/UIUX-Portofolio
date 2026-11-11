"""Model and render an original cartoon toy rocket (portfolio palette) with a transparent background.

Run: blender -b --factory-startup -P rocket.py -- <out.png> [preview]
"""
import bpy, bmesh, math, sys
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = argv[0] if argv else "//rocket.png"
PREVIEW = len(argv) > 1 and argv[1] == "preview"

# ---------- reset ----------
for ob in list(bpy.data.objects):
    bpy.data.objects.remove(ob, do_unlink=True)
for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras):
    for d in list(coll):
        coll.remove(d)
scene = bpy.context.scene


def srgb(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c) + (1.0,)


def mat(name, color, rough=0.3, metal=0.0, coat=0.6, emit=None, emit_str=0.0, transmission=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value = srgb(color)
    p.inputs["Roughness"].default_value = rough
    p.inputs["Metallic"].default_value = metal
    if "Coat Weight" in p.inputs:
        p.inputs["Coat Weight"].default_value = coat
        p.inputs["Coat Roughness"].default_value = 0.08
    if emit:
        p.inputs["Emission Color"].default_value = srgb(emit)
        p.inputs["Emission Strength"].default_value = emit_str
    if transmission and "Transmission Weight" in p.inputs:
        p.inputs["Transmission Weight"].default_value = transmission
    return m


M_BODY = mat("Body", "#F4EEE2", rough=0.28, coat=0.8)
M_PINK = mat("Pink", "#FF3D81", rough=0.25, coat=0.9)
M_SUN = mat("Sun", "#FFC93C", rough=0.3, coat=0.7)
M_GLASS = mat("Glass", "#3DE3F2", rough=0.05, coat=1.0, emit="#3DE3F2", emit_str=0.35)
M_METAL = mat("Metal", "#B9BCD6", rough=0.22, metal=1.0, coat=0.0)
M_DARK = mat("Dark", "#1A1640", rough=0.5, coat=0.0)
M_VIOLET = mat("Violet", "#6C5CFF", rough=0.3, coat=0.8)


def link(ob):
    scene.collection.objects.link(ob)
    return ob


def smooth(me):
    me.polygons.foreach_set("use_smooth", [True] * len(me.polygons))


def lathe(name, profile, material, segs=96):
    """Revolve a (radius, z) profile, bottom to top, around Z."""
    bm = bmesh.new()
    rings = []
    for r, z in profile:
        if r < 1e-4:
            rings.append([bm.verts.new((0, 0, z))])
        else:
            rings.append([bm.verts.new((r * math.cos(2 * math.pi * i / segs), r * math.sin(2 * math.pi * i / segs), z)) for i in range(segs)])
    for a, b in zip(rings, rings[1:]):
        if len(a) == 1 and len(b) == 1:
            continue
        if len(a) == 1:
            for i in range(segs):
                bm.faces.new((a[0], b[i], b[(i + 1) % segs]))
        elif len(b) == 1:
            for i in range(segs):
                bm.faces.new((a[i], b[0], a[(i + 1) % segs]))
        else:
            for i in range(segs):
                bm.faces.new((a[i], a[(i + 1) % segs], b[(i + 1) % segs], b[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    smooth(me)
    me.materials.append(material)
    return link(bpy.data.objects.new(name, me))


def torus(name, major, minor, loc, rot, material, segs=96, ring=24):
    bm = bmesh.new()
    verts = []
    for i in range(segs):
        u = 2 * math.pi * i / segs
        row = []
        for j in range(ring):
            v = 2 * math.pi * j / ring
            r = major + minor * math.cos(v)
            row.append(bm.verts.new((r * math.cos(u), r * math.sin(u), minor * math.sin(v))))
        verts.append(row)
    for i in range(segs):
        for j in range(ring):
            bm.faces.new((verts[i][j], verts[(i + 1) % segs][j], verts[(i + 1) % segs][(j + 1) % ring], verts[i][(j + 1) % ring]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    smooth(me)
    me.materials.append(material)
    ob = link(bpy.data.objects.new(name, me))
    ob.location = loc
    ob.rotation_euler = rot
    return ob


def sphere(name, radius, loc, scale, material):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=64, v_segments=32, radius=radius)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    smooth(me)
    me.materials.append(material)
    ob = link(bpy.data.objects.new(name, me))
    ob.location = loc
    ob.scale = scale
    return ob


# ---------- body ----------
body_profile = [
    (0.0, 0.12), (0.40, 0.12), (0.50, 0.18), (0.58, 0.30), (0.66, 0.50), (0.73, 0.75), (0.79, 1.05),
    (0.83, 1.35), (0.845, 1.60), (0.835, 1.85), (0.80, 2.10), (0.74, 2.35), (0.66, 2.58), (0.0, 2.60)
]
SLIM = 0.88
body_profile = [(r * SLIM, z) for r, z in body_profile]
lathe("Body", body_profile, M_BODY)

nose_profile = [
    (0.0, 2.52), (0.67, 2.52), (0.68, 2.60), (0.64, 2.74), (0.57, 2.92), (0.47, 3.12), (0.35, 3.30),
    (0.22, 3.46), (0.11, 3.57), (0.03, 3.62), (0.0, 3.63)
]
nose_profile = [(r * SLIM, z) for r, z in nose_profile]
lathe("Nose", nose_profile, M_PINK)

# Violet belly band (gives the white body a graphic stripe)
band_profile = [(0.0, 1.02), (0.795, 1.02), (0.83, 1.06), (0.845, 1.15), (0.85, 1.25), (0.84, 1.33), (0.80, 1.37), (0.0, 1.37)]
band_profile = [(r * SLIM, z) for r, z in band_profile]
lathe("Band", band_profile, M_VIOLET)

nozzle_profile = [
    (0.0, 0.16), (0.30, 0.16), (0.29, 0.06), (0.30, -0.02), (0.34, -0.14), (0.40, -0.27), (0.43, -0.32),
    (0.41, -0.34), (0.33, -0.30), (0.0, -0.30)
]
lathe("Nozzle", nozzle_profile, M_METAL)
lathe("NozzleInner", [(0.0, -0.20), (0.34, -0.20), (0.39, -0.305), (0.0, -0.305)], M_DARK)

# Gold trim rings
torus("RingNose", 0.665 * SLIM, 0.055, (0, 0, 2.53), (0, 0, 0), M_SUN)
torus("RingBase", 0.53 * SLIM, 0.06, (0, 0, 0.24), (0, 0, 0), M_SUN)

# Porthole
win_z = 1.88
win_r = 0.835 * SLIM
torus("WindowRim", 0.25, 0.065, (0, -win_r + 0.02, win_z), (math.radians(90), 0, 0), M_SUN)
sphere("WindowGlass", 0.24, (0, -win_r + 0.06, win_z), (1, 0.42, 1), M_GLASS)
sphere("Glint", 0.05, (-0.08, -win_r - 0.035, win_z + 0.09), (1, 0.4, 1), mat("Glint", "#FFFFFF", rough=0.0, emit="#FFFFFF", emit_str=6))

# Antenna
lathe("Antenna", [(0.0, 3.55), (0.025, 3.55), (0.02, 4.05), (0.0, 4.05)], M_METAL, segs=24)
sphere("AntennaTip", 0.07, (0, 0, 4.08), (1, 1, 1), M_SUN)

# ---------- fins ----------
fin_pts = [(0.36, 1.55), (0.60, 1.12), (1.00, 0.50), (1.22, -0.05), (1.24, -0.58), (1.04, -0.62), (0.86, -0.28), (0.58, 0.02), (0.36, 0.10)]
CAM_AZ = math.degrees(math.atan2(-10.8, 2.4))
for k, ang in enumerate((CAM_AZ + 45, CAM_AZ + 135, CAM_AZ + 225, CAM_AZ + 315)):
    bm = bmesh.new()
    vs = [bm.verts.new((x, 0, z)) for x, z in fin_pts]
    bm.faces.new(vs)
    me = bpy.data.meshes.new(f"Fin{k}")
    bm.to_mesh(me)
    bm.free()
    me.materials.append(M_PINK)
    ob = link(bpy.data.objects.new(f"Fin{k}", me))
    sol = ob.modifiers.new("Solidify", "SOLIDIFY")
    sol.thickness = 0.16
    sol.offset = 0.0
    bev = ob.modifiers.new("Bevel", "BEVEL")
    bev.width = 0.065
    bev.segments = 6
    bev.limit_method = "ANGLE"
    bev.harden_normals = True
    smooth(me)
    ob.rotation_euler = (0, 0, math.radians(ang))  # one fin faces the camera, two flank the body symmetrically

# ---------- world, lights, camera ----------
world = bpy.data.worlds.new("World") if not scene.world else scene.world
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes.get("Background")
bg.inputs["Color"].default_value = srgb("#2A2470")
bg.inputs["Strength"].default_value = 0.9


def area(name, loc, energy, color, size):
    ld = bpy.data.lights.new(name, "AREA")
    ld.energy = energy
    ld.color = color
    ld.size = size
    ob = link(bpy.data.objects.new(name, ld))
    ob.location = loc
    tgt = Vector((0, 0, 1.8))
    ob.rotation_euler = (tgt - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    return ob


area("Key", (-3.5, -5.0, 5.5), 900, (1.0, 0.96, 0.9), 4.0)
area("Fill", (2.0, -7.0, 1.0), 260, (0.85, 0.88, 1.0), 6.0)
area("RimPink", (4.5, 2.5, 3.0), 900, (1.0, 0.35, 0.6), 3.0)
area("RimCyan", (-4.5, 3.0, 2.0), 900, (0.3, 0.9, 1.0), 3.0)
area("Under", (0.0, -2.5, -3.0), 250, (1.0, 0.75, 0.45), 4.0)

cam_d = bpy.data.cameras.new("Cam")
cam_d.lens = 70
cam = link(bpy.data.objects.new("Cam", cam_d))
cam.location = (2.4, -10.8, 2.6)
cam.rotation_euler = (Vector((0, 0, 1.85)) - cam.location).to_track_quat("-Z", "Y").to_euler()
scene.camera = cam

# ---------- render ----------
for eng in ("BLENDER_EEVEE", "BLENDER_EEVEE_NEXT"):
    try:
        scene.render.engine = eng
        break
    except TypeError:
        pass
ee = scene.eevee
if hasattr(ee, "taa_render_samples"):
    ee.taa_render_samples = 16 if PREVIEW else 96
if hasattr(ee, "use_raytracing"):
    ee.use_raytracing = True
scene.render.film_transparent = True
scene.render.resolution_x = 1000
scene.render.resolution_y = 1500
scene.render.resolution_percentage = 40 if PREVIEW else 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.view_settings.view_transform = "Standard"
scene.view_settings.look = "None"
scene.view_settings.exposure = -0.35
scene.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print("RENDERED", OUT, scene.render.engine)
