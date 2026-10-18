"""Build responsive developer illustrations from retained transparent originals."""
import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
manifest_path = root / 'src/config/illustrations.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
for name in ('developer-backend', 'developer-production'):
    with Image.open(root / 'artwork' / f'{name}.png') as source:
        image = source.convert('RGBA')
        widths = [240, 480, 720]
        for width in widths:
            resized = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
            for extension in ('avif', 'webp'):
                resized.save(root / 'public/illustrations' / f'{name}-{width}.{extension}', quality=82)
        manifest[name] = {'width': image.width, 'height': image.height, 'widths': widths}
manifest_path.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
