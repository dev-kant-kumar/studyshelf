"""Encode dedicated career artwork at responsive widths for card illustrations."""
import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
manifest_path = root / 'src/config/illustrations.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
source_dir = root / 'artwork/careers'
widths = [240, 480, 720]
for source_path in sorted(source_dir.glob('career-*.png')):
    name = source_path.stem
    with Image.open(source_path) as source:
        image = source.convert('RGBA')
        for width in widths:
            resized = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
            for extension in ('avif', 'webp'):
                resized.save(root / 'public/illustrations' / f'{name}-{width}.{extension}', quality=82)
        manifest[name] = {'width': image.width, 'height': image.height, 'widths': widths}
manifest_path.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
print(f'Prepared {len(list(source_dir.glob("career-*.png")))} dedicated career illustrations.')
