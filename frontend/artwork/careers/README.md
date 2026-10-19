# Dedicated career illustrations

Each of the 16 Career Explorer fields has its own illustration, generated with the built-in image generation tool. The reference artwork supplies the shared ink-and-watercolor style, not the subject. Full prompts are retained in `prompts.json`.

Original transparent PNGs are retained here as `career-<field>.png`. The website serves AVIF and WebP variants at 240, 480 and 720 pixels wide through the existing Illustration component. Run `python scripts/prepare-career-artwork.py` from `frontend` after adding or replacing an original. The script refreshes the illustration manifest and production variants.

Field-to-image mapping lives in `src/app/main-website/pages/Careers/careerIllustrations.js`. Every field uses a distinct image. Images are decorative because the adjacent career title labels the clickable card. Existing detail drawers and navigation are preserved.
