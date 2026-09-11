"""Subset the Material Symbols icon font to the icons the site can actually show.

The full font is ~3.9 MB and loads (with font-display: block) on every page —
on a mobile connection that alone held first paint back by ~20 seconds. The
subset keeps every icon that can reach the page:

  - every icon offered by the CMS icon picker (norr3-cms IconPicker.tsx),
  - every lowercase identifier-like string literal in this site's src/,
  - every such word stored anywhere in the CMS database (icon fields, and
    the `"icon":"…"` entries inside JSON copy),

intersected with the icons the font really contains. Over-inclusive on
purpose: a stray word that happens to be an icon name costs a few hundred
bytes, a missing icon renders as its name in plain text.

Re-run after adding an icon in code or to the CMS picker list:

    pip install fonttools brotli
    python3 scripts/subset-icons.py
"""
import os, re, sqlite3, sys
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.varLib import instancer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_FONT = os.path.join(ROOT, "node_modules/material-symbols/material-symbols-outlined.woff2")
OUT_FONT = os.path.join(ROOT, "public/fonts/material-symbols-subset.woff2")
CMS_ROOT = os.environ.get("NORR3_CMS_ROOT", "/root/norr3-cms")
CMS_DB = os.path.join(CMS_ROOT, "data/norr3-cms.db")
PICKER = os.path.join(CMS_ROOT, "app/(admin)/IconPicker.tsx")
WORD = re.compile(r"[a-z][a-z0-9_]{1,50}")

font = TTFont(SRC_FONT)
cmap = font.getBestCmap()
by_glyph = {g: chr(cp) for cp, g in cmap.items()}

# Ligature name -> output glyph, rebuilt from GSUB so we know what exists.
ligatures = {}
for lookup in font["GSUB"].table.LookupList.Lookup:
    for st in lookup.SubTable:
        st = getattr(st, "ExtSubTable", st)
        for first, ligs in getattr(st, "ligatures", {}).items():
            for lig in ligs:
                chars = [by_glyph.get(g) for g in [first, *lig.Component]]
                if None not in chars:
                    ligatures["".join(chars)] = lig.LigGlyph

wanted = set()
for dirpath, _, files in os.walk(os.path.join(ROOT, "src")):
    for f in files:
        if f.endswith((".ts", ".tsx")):
            text = open(os.path.join(dirpath, f), encoding="utf-8", errors="ignore").read()
            wanted.update(re.findall(r"[\"'`]([a-z0-9_]{2,51})[\"'`]", text))
            # Icons written as JSX text: <span className="material-symbols-outlined">task_alt</span>
            wanted.update(re.findall(r">\s*([a-z0-9_]{2,51})\s*<", text))
if os.path.exists(PICKER):
    wanted.update(re.findall(r'"([a-z0-9_]{2,51})"', open(PICKER, encoding="utf-8").read()))
if os.path.exists(CMS_DB):
    db = sqlite3.connect(f"file:{CMS_DB}?mode=ro", uri=True)
    for (table,) in db.execute("select name from sqlite_master where type='table'"):
        if table in ("activity_log", "chat_messages", "page_revisions", "post_revisions"):
            continue
        cols = [c[1] for c in db.execute(f"pragma table_info({table})")]
        for row in db.execute(f"select {', '.join(cols)} from {table}"):
            for value in row:
                if isinstance(value, str):
                    wanted.update(WORD.findall(value))
else:
    print(f"warning: no CMS database at {CMS_DB} — CMS-chosen icons may be missing", file=sys.stderr)

keep = sorted(n for n in wanted if n in ligatures)
letters = set("abcdefghijklmnopqrstuvwxyz0123456789_")

# Static instance at the default axes: nothing on the site varies FILL/wght/
# GRAD/opsz, and the variation data is most of the file.
font = instancer.instantiateVariableFont(TTFont(SRC_FONT), {"FILL": 0, "wght": 400, "GRAD": 0, "opsz": 24})
opts = subset.Options()
opts.flavor = "woff2"
opts.layout_features = ["liga", "rlig", "calt", "ccmp"]
opts.layout_closure = False  # otherwise every ligature survives: its letters are all kept
opts.notdef_outline = True
opts.name_IDs = ["*"]
sub = subset.Subsetter(opts)
sub.populate(glyphs=[ligatures[n] for n in keep], unicodes=[ord(c) for c in letters])
sub.subset(font)
os.makedirs(os.path.dirname(OUT_FONT), exist_ok=True)
font.flavor = "woff2"
font.save(OUT_FONT)
print(f"{len(keep)} icons kept of {len(ligatures)}; {os.path.getsize(SRC_FONT)//1024} KB -> {os.path.getsize(OUT_FONT)//1024} KB")
