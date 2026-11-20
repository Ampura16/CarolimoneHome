# -*- coding: utf-8 -*-
"""可选优化：压缩站点图片体积（需要 Python + Pillow：pip install pillow）。
用法：python tools/optimize_assets.py
"""
import os

try:
    from PIL import Image
except ImportError:
    raise SystemExit('未安装 Pillow，跳过优化：pip install pillow')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
saved = 0


def opt(rel, maxw):
    global saved
    p = os.path.join(ROOT, rel)
    if not os.path.exists(p):
        return
    before = os.path.getsize(p)
    im = Image.open(p)
    mode = 'RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB'
    im = im.convert(mode)
    if im.width > maxw:
        im = im.resize((maxw, int(im.height * maxw / im.width)), Image.LANCZOS)
    im.save(p, optimize=True)
    after = os.path.getsize(p)
    saved += before - after
    print('opt %-45s %5sx%-5s %.1fKB -> %.1fKB' % (rel, im.width, im.height, before / 1024, after / 1024))


for i in range(6):
    opt('assets/img/hero/layer%d.png' % i, 3000)

games_dir = os.path.join(ROOT, 'assets/img/games')
for f in sorted(os.listdir(games_dir)):
    opt('assets/img/games/' + f, 460)

for f in ['lobby.png', 'restaurant.png', 'ssm.png', 'halloween.png']:
    opt('assets/img/news/' + f, 1000)

opt('assets/img/ui/play_java.png', 620)
opt('assets/img/ui/play_bedrock.png', 620)

print('优化完成，共节省 %.1f MB' % (saved / 1024 / 1024))
