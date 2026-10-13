# Study Shelf illustrations

Created with the built-in image generation tool on 13 October 2026. Original transparent PNGs are retained here. Production files live under `public/illustrations`; the originals are not shipped with the website.

## Placement

- study-desk: homepage hero, next to the introduction and search on desktop; below search at a smaller size on mobile.
- learning-shelf: course library and About introductions. Hidden at narrow widths to keep navigation and page text first.
- contact-message: Study Shelf support card on Contact, above the direct email address.
- mca-sem1-paper1 through mca-sem1-paper9: individual illustrations for all six theory papers and three labs. Used as semester list thumbnails and subject header artwork. Subject header artwork is hidden below 640px without downloading an image.

The illustrations share cobalt and periwinkle blue, warm amber accents, fine ink contours, and subtle watercolor texture. Existing typography, theme colors, and note pages are unchanged. Illustrations contain no text, so copy remains accessible HTML.

## Production assets

Each illustration has three responsive widths in AVIF and WebP, with transparent backgrounds preserved. Illustration.jsx uses picture, source sets, explicit intrinsic dimensions, async decoding, and lazy loading except for the hero/introduction images. These assets are decorative and have empty alt text; the surrounding headings and controls carry all meaning.

## Generation prompts

The nine MCA Semester 1 prompts are saved in `mca-sem1-prompts.json`. Each paper has transparent AVIF and WebP assets at 160, 320, and 640 pixels wide. The original PNGs are retained alongside this file.

### study-desk

Create one polished editorial illustration asset for Study Shelf, an adult BCA/MCA computer applications learning website. Use case: illustration-story. A charming but sophisticated compact study workspace: open textbook in foreground with abstract blue diagrams, slim laptop showing an abstract network diagram, a few blue books stacked on a simple shelf, a small amber desk lamp. Perspective slightly elevated three-quarter view. Distinctive hand-drawn ink lines with subtle paper-like painted fills, restrained cobalt blue #2457d6, periwinkle #93b4ff, muted amber #d7a54b, slate #52617b, and off-white surfaces. Clean recognizable silhouette, readable at 300px, generous transparent margins. Composition balanced landscape 4:3, everything fits wholly in frame. Dark contours and light highlights so it works on both light and dark website backgrounds. Adult academic tone, no people, no text or labels, no logos, no watermark, no UI mockup, no photographic backdrop, no background panel. Actual transparent background.

### learning-shelf

One transparent editorial illustration asset for Study Shelf adult BCA/MCA learning website. A compact wooden bookshelf with four cobalt and periwinkle textbooks, one open notebook, small green trailing plant, and a small abstract blue circuit tile leaning against the books. Sophisticated hand-drawn ink contours and subtle watercolor paper texture, matching a painted study desk illustration. Cobalt #2457d6, periwinkle #93b4ff, muted amber wood, slate ink, off-white book pages. Centered horizontal 4:3 composition, clear silhouette, all objects entirely in frame and generous margins. No lettering or readable text, no people, no logos, no watermark, no background panel. Actual transparent background. Light highlights and dark edges for use on both dark navy and near-white website backgrounds.

### contact-message

One transparent editorial illustration asset for Study Shelf adult computing study website contact page. A cobalt blue open envelope holding a cream page with three short abstract blue ink lines, a fountain pen alongside it and one small muted amber speech bubble above. Sophisticated hand-drawn ink contours and subtle watercolor paper texture. Matching a painted academic desk illustration. Palette cobalt #2457d6, periwinkle #93b4ff, muted amber #d7a54b, slate ink and off-white paper. Compact square composition readable at 150px, centered with generous transparent margins. No text, lettering, logos, people, watermark, or background panel. Actual transparent background. Clear on dark navy and near-white backgrounds. Not photorealistic, not 3D.
