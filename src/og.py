# Generates assets/img/og.png (social share image). Run: python3 src/og.py  (needs Pillow)
import os
from PIL import Image, ImageDraw, ImageFont
W, H = 1200, 630
im = Image.new('RGB', (W, H)); d = ImageDraw.Draw(im)
for x in range(W):
    t = x / W
    d.line([(x, 0), (x, H)], fill=(int(27 + 80 * t), int(19 + 24 * t), int(64 + 120 * t)))
def font(bold, size):
    for p in (['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'] if bold else ['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']):
        if os.path.exists(p): return ImageFont.truetype(p, size)
    return ImageFont.load_default()
d.rounded_rectangle([80, 80, 180, 180], radius=26, fill=(255, 255, 255))
d.text((105, 92), "★", font=font(False, 72), fill=(91, 61, 245))
d.text((80, 230), "SuperBest.com", font=font(True, 96), fill=(255, 255, 255))
d.text((80, 360), "The super best of everything —", font=font(False, 48), fill=(217, 210, 255))
d.text((80, 420), "researched, ranked, simplified.", font=font(False, 48), fill=(217, 210, 255))
d.text((80, 530), "Best-of lists · Comparisons · Free matching", font=font(True, 32), fill=(255, 213, 122))
os.makedirs('assets/img', exist_ok=True)
im.save('assets/img/og.png', optimize=True)
