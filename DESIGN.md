# Delphine Rose Photography — Design System

## 1. DESIGN OVERVIEW

### Source calibration

This specification is derived from a single 1080 × 1920 px JPEG. The website itself is the centered rectangle from x=140 to x=940 and y=149 to at least y=1850.

| Item | Reference pixels | Canonical implementation |
|---|---:|---:|
| Presentation artboard | 1080 × 1920 | Presentation-only; not part of the live site |
| Visible website | 800 × 1701+ | Approximately 1500 × 3190+ |
| Reference scale | Approximately 53.333% | 100% |
| Conversion | 1 reference px | Approximately 1.875 CSS px |

Use a 1500 px desktop viewport as the calibration coordinate system. Every desktop value below is expressed in unscaled CSS pixels unless a table explicitly says “reference px.” To compare an implementation directly against the supplied image, render the 1500 px site and scale it to 800 px, or compare at approximately 53.333%.

The reference ends during the biography section. It does not show the true bottom of the page, and it contains no measurable footer.

### Source cross-check

The reference is a scaled capture of the [Delphine Rose theme demo](https://delphine.pixandhue.com/). Cross-checking the matching live page confirms the original font families, fixed hero/banner heights, color family, component proportions, and responsive breakpoints. Image measurements remain authoritative for the exact flattened colors and visible geometry; live-source values are used where they resolve otherwise unknowable details such as font names and mobile behavior.

### Aesthetic and design language

The design is an editorial, heirloom-photography composition built from:

- muted mineral and parchment surfaces rather than white;
- documentary wedding and lifestyle photographs with warm brown, olive, sand, and desaturated skin tones;
- high-contrast, uppercase serif typography for emotional statements;
- very small uppercase sans-serif typography for navigation and utility labels;
- a thin, airy signature script used sparingly over photographs;
- square-edged blocks interrupted by large semicircular photo arches;
- intentional overlap between photographs, section boundaries, labels, and one-pixel construction lines;
- generous empty space, especially above and below the portfolio card row;
- no decorative pills, glossy effects, glassmorphism, bright gradients, or conventional card shadows.

The layout should feel quiet, personal, romantic, tactile, and archival. It should resemble a carefully art-directed printed photography portfolio rather than a generic wedding template. The brand personality is intimate, assured, restrained, nostalgic, and premium without becoming ornate.

### Composition principles

1. Photographs carry most of the visual weight.
2. Color blocks establish rhythm; they are never mere card backgrounds.
3. Serif type expresses emotion; sans-serif type handles navigation and metadata.
4. Script type is a visual accent, limited to one short phrase per photographic composition.
5. Overlap is structural. Images and hairlines deliberately cross section boundaries.
6. All ordinary rectangles remain square. The only strong radius is the semicircular arch used for selected portraits.
7. Asymmetry is controlled: the story section is image-heavy on the left, while the biography section shifts its large arch to the right.

### Presentation mockup versus website

The pale outer canvas, the partially obscured still-life panels, and the heavy page shadow belong to the presentation mockup. They should not be placed inside the production website DOM. Include them only when reproducing the complete 1080 × 1920 showcase image.

For a showcase reconstruction:

- artboard: 1080 × 1920 px, background #F7F4ED;
- site preview: x=140, y=149, width=800 px, visible height=1701 px;
- upper-left still-life panel: approximately x=53, y=75, width=568 px, height=423 px;
- right still-life panel: visible from x=940 to 1027 and y=582 to 1316; the hidden width is not recoverable;
- lower-left cool-gray panel: visible from x=53 to 140 and y=1071 to 1561;
- preview shadow: --shadow-page-preview.

## 2. COLOR SYSTEM

### Sampling note

The source is a compressed, downscaled JPEG, but the principal surface colors repeat exactly across tens of thousands of pixels. The first table records those literal raster samples. The matching live theme reveals the intended production CSS values. Use the production values in HTML/CSS: downscaling, antialiasing, and JPEG compression are what shift them into the sampled raster values.

### Core palette

| Token | HEX | Role and exact use |
|---|---|---|
| Canvas | #F7F4ED | Outer presentation canvas; also the flattened-JPEG target for text on photography |
| Header | #F7F6F1 | Header/navigation surface; keep distinct from the canvas |
| Sage surface | #C8CAC5 | Entire “Because these moments…” story section |
| Oatmeal surface | #E8E0D3 | Entire three-card portfolio section |
| Sand surface | #DCCDBA | Biography/profile section |
| Decorative cool gray | #DFE0DA | Presentation-only lower-left and right-side decorative panels |
| Label tan | #D1BFA7 | Vertical portfolio tabs |
| Primary ink | #292825 | Logo, major warm-surface headings, primary text, hover fills |
| Deep ink | #12140F | Highest-contrast heading cores on sage |
| Cool body ink | #565954 | Italic paragraph text on the sage surface |
| Warm body ink | #695E4C | Italic paragraph text on sand and oatmeal surfaces |
| Utility ink | #5D5C59 | Navigation and small sans-serif utility copy |
| Warm label ink | #493D29 | Text inside vertical tan labels |
| On-photo ivory | #F7F4ED | Hero heading and script overlays |
| Muted icon taupe | #C3BAAD | Social icons in the header |
| Cool construction line | #8F928D | Vertical story frame and cool-surface hairlines |
| Warm construction line | #817A70 | Story frame bottom line, biography cross-lines, focus rings |
| Strong control border | #6A6D68 | Outline button border and focused control border |
| Clay photo accent | #8D5933 | Photography grading reference only; not a UI state color |
| Walnut photo accent | #493621 | Photography grading reference only; not a UI state color |
| Disabled neutral | #B7B6B2 | Disabled text, icons, and borders |

### Production CSS palette

| Production token | CSS value | Corresponding flattened sample |
|---|---:|---:|
| Presentation canvas | #F7F4ED | #F7F4ED |
| Site ivory/header | #F8F6F1 | #F7F6F1 |
| Sage surface | #C8CBC5 | #C8CAC5 |
| Oatmeal surface | #E9E0D4 | #E8E0D3 |
| Sand surface | #DBCDBA | #DCCDBA |
| Taupe label/icon | #D1BFA7 | #D1BFA7 |
| Primary ink/lines/borders | #000000 | #292825, #8F928D, #817A70, or #6A6D68 after scaling and antialiasing |
| On-photo/inverse text | #FFFFFF | #F7F4ED through #FFFFF5 after scaling/compression |

The production CSS values are the implementation source of truth. The raster samples are the visual QA targets when the finished page is reduced to the supplied reference size.

Do not merge the canvas, header, oatmeal, and sand colors. Their small differences are part of the design’s layered paper effect.

### Color-to-element map

- Body outside the site preview: --color-canvas.
- Site header: --color-header.
- Hero and banner text: --color-on-photo.
- Story section: --color-surface-sage with --color-heading-cool and --color-body-cool.
- Portfolio section: --color-surface-oatmeal.
- Portfolio tabs: --color-label-tan with --color-label-ink.
- Biography section: --color-surface-sand with --color-ink and --color-body-warm.
- Header social icons: --color-icon-muted; hover to --color-ink.
- Button: transparent background, --color-control-border border, --color-ink text.
- Decorative lines: cool line on sage, warm line where the line crosses oatmeal or sand.
- Keyboard focus: --color-focus-ring at 2 px with 3 px offset.

### Photography-only colors

The following colors are prominent in the photographs but should not be used as additional section backgrounds:

- deep umber: #281E10;
- walnut: #493621;
- warm earth: #604A31;
- clay: #8D5933;
- muted olive: #71674E;
- weathered sand: #B6A997.

These colors define asset selection and color grading. They are not permission to add extra UI colors.

### Gradients and image overlays

No UI surface gradient is visible. Header, sage, oatmeal, sand, and tab surfaces are flat fills. Do not introduce decorative gradients.

The matching production page applies a uniform 10% black overlay to the hero and banner:

- Hero: rgba(0, 0, 0, 0.10).
- Full-width banner: rgba(0, 0, 0, 0.10).

The flattened raster reads slightly warmer because of the photographs and JPEG encoding. The reference-only approximations are rgba(23, 16, 6, 0.12) for the hero and rgba(19, 11, 1, 0.18) for the banner.

Do not apply a directional gradient unless the replacement photograph has a demonstrated readability problem. If the supplied asset already matches the grade, omit the scrim rather than making the image muddy.

### Copy-ready color variables

~~~css
:root {
  --color-canvas: #F7F4ED;
  --color-header: #F8F6F1;
  --color-surface-sage: #C8CBC5;
  --color-surface-oatmeal: #E9E0D4;
  --color-surface-sand: #DBCDBA;
  --color-surface-decorative: #DFE0DA;
  --color-label-tan: #D1BFA7;

  --color-ink: #000000;
  --color-ink-deep: #000000;
  --color-heading-cool: #000000;
  --color-body-cool: #000000;
  --color-body-warm: #000000;
  --color-utility: #000000;
  --color-label-ink: #000000;
  --color-on-photo: #FFFFFF;
  --color-icon-muted: #D1BFA7;

  --color-line-cool: #000000;
  --color-line-warm: #000000;
  --color-control-border: #000000;
  --photo-color-clay: #8D5933;
  --photo-color-walnut: #493621;
  --color-disabled: #B7B6B2;
  --color-focus-ring: #000000;

  --reference-header: #F7F6F1;
  --reference-sage: #C8CAC5;
  --reference-oatmeal: #E8E0D3;
  --reference-sand: #DCCDBA;
  --reference-ink-core: #292825;
  --reference-line-cool: #8F928D;
  --reference-line-warm: #817A70;

  --photo-overlay-hero: rgba(0, 0, 0, 0.10);
  --photo-overlay-banner: rgba(0, 0, 0, 0.10);
  --reference-overlay-hero: rgba(23, 16, 6, 0.12);
  --reference-overlay-banner: rgba(19, 11, 1, 0.18);
}
~~~

## 3. TYPOGRAPHY

### Identified font families

1. **Idealist**
   - Original custom/local OTF used for the logo and all editorial display headings.
   - Weight: 400.
   - Closest free Google Fonts alternative: **Cormorant Garamond 400**.
   - Secondary alternative: Bodoni Moda 400.
   - Stack: "Idealist", "Cormorant Garamond", "Times New Roman", serif.

2. **Modernline**
   - Original custom/local WOFF used for the handwritten phrases.
   - Weight: 400.
   - Closest free Google Fonts alternative: **Allura 400**.
   - Secondary alternative: Italianno 400.
   - Stack: "Modernline", "Allura", "Brush Script MT", cursive.

3. **Cabin**
   - Confirmed Google Font used for navigation, buttons, vertical labels, and metadata.
   - Weight: 400.
   - Stack: "Cabin", "Helvetica Neue", Arial, sans-serif.

4. **Crimson Text**
   - Confirmed Google Font used in italic for paragraph copy.
   - Weight/style: 400 italic.
   - Stack: "Crimson Text", Georgia, "Times New Roman", serif.

Do not hotlink the custom Idealist or Modernline files from the theme demo. Use licensed local copies when available. Otherwise use the documented free alternatives.

Recommended free-font import:

~~~css
@import url("https://fonts.googleapis.com/css2?family=Allura&family=Cabin:wght@400;500&family=Cormorant+Garamond:wght@400&family=Crimson+Text:ital@1&display=swap");
~~~

### Type scale

All values are confirmed production desktop CSS values unless noted otherwise.

| Style | Size | Rem | Weight | Line-height | Letter-spacing | Case and use |
|---|---:|---:|---:|---:|---:|---|
| H1 / hero serif | 50 px | 3.125rem | 400 | 1 / 50 px | 3 px / 0.06em | Uppercase; “CAPTURING MOMENTS” |
| H2 / section statement | 42 px | 2.625rem | 400 | 1.15 / 48 px | 3 px / 0.071em | Uppercase; story and bio headings |
| H3 / display small | 32 px | 2rem | 400 | 1.15 / 37 px | 3 px / 0.094em | Uppercase |
| H4 | 26 px | 1.625rem | 400 | 1.2 / 31 px | 2.5 px / 0.096em | Uppercase |
| H5 | 20 px | 1.25rem | 400 | 1.25 / 25 px | 2.5 px / 0.125em | Uppercase small display |
| H6 / eyebrow | 14 px | 0.875rem | 400 | 1.4 / 20 px | 2 px / 0.143em | Uppercase Cabin |
| Body large | 21 px | 1.3125rem | 400 italic | 1.55 / 33 px | 0 | Default editorial prose |
| Body compact | 19.5 px | 1.21875rem | 400 italic | 1.4 / 27 px | 0 | Tighter copy blocks |
| Body small | 16 px | 1rem | 400 italic | 1.5 / 24 px | 0 | Secondary prose |
| Caption | 13 px | 0.8125rem | 400 | 1.55 / 20 px | 2 px / 0.154em | Metadata |
| Navigation | 12.5 px | 0.78125rem | 400 | 1 / 13 px | 2 px / 0.16em | Uppercase |
| Button label | 13 px | 0.8125rem | 400 | 1 / 13 px | 2 px / 0.154em | Uppercase |
| Vertical tab | 14 px | 0.875rem | 400 | 1 / 14 px | 2.5 px / 0.179em | Uppercase, rotated |
| Logo | 38 px | 2.375rem | 400 | 1 / 38 px | 3 px / 0.079em | Uppercase |
| Hero script | 48 px | 3rem | 400 | 1 / 48 px | 0 | Lowercase sentence |
| Story script | 48 px | 3rem | 400 | 1 / 48 px | 0 | Lowercase sentence |
| Banner script | 48 px | 3rem | 400 | 1 / 48 px | 0 | Lowercase sentence |

### Typography behavior

- Headings are uppercase, left aligned in text sections, and centered only when over a full-width photograph.
- Do not fake uppercase by typing mixed-case text and visually transforming only some instances; use text-transform consistently.
- Major serif headings use Idealist 400, normal style, never italic or bold.
- Visible body paragraphs are Crimson Text 400 italic, not display serif and not sans-serif.
- Navigation and utility labels are small, uppercase, and deliberately tracked.
- Script is decorative and should not carry essential information by itself. Preserve equivalent accessible text for screen readers.
- Do not bold display type. The design depends on the fine strokes of Idealist 400.
- Do not use text shadows. Readability comes from image grading and scrims.
- Keep the exact authored line breaks above 1250 px where they are part of the composition.

## 4. SPACING & LAYOUT SYSTEM

### Base spacing

Use a 4 px base unit. Every margin, gap, inset, and padding must resolve to a token unless an exact measured composition value is explicitly listed.

| Token | Value | Typical use |
|---|---:|---|
| --space-0 | 0 | Flush edges |
| --space-1 | 4 px | Optical corrections |
| --space-2 | 8 px | Icon micro-gap |
| --space-3 | 12 px | Tight label gap |
| --space-4 | 16 px | Small component padding |
| --space-5 | 20 px | Small vertical rhythm |
| --space-6 | 24 px | Grid gutter |
| --space-8 | 32 px | Text group gap |
| --space-10 | 40 px | Button or card separation |
| --space-12 | 48 px | Desktop wide gutter |
| --space-16 | 64 px | Header right inset and medium section gap |
| --space-20 | 80 px | Large content separation |
| --space-24 | 96 px | Standard content container margin |
| --space-30 | 120 px | Large section padding |
| --space-32 | 128 px | Portfolio bottom padding |
| --space-40 | 160 px | Editorial whitespace |
| --space-48 | 192 px | Portfolio side inset |
| --space-56 | 224 px | Portfolio top padding |

Exact measured offsets such as 49, 103, 195, 338, 647, 698, 801, and 855 px are intentional calibration coordinates and are permitted as component variables.

### Containers

- Site calibration width: 1500 px.
- Header uses 40 px padding on all sides in the confirmed desktop implementation.
- Wide content width: 1420 px, centered, 40 px side gutters.
- Standard content width: 1305 px, or 87% of the viewport, centered.
- Portfolio row uses an 87% inner width; its measured visible image group is approximately 1110 px wide and centered.
- Mobile side gutter: 24 px between 480 and 767 px; 20 px below 480 px.

The production site may expand beyond the 1500 px calibration width, but content geometry must stop growing at the stated max-widths. Full-bleed section backgrounds and photography may continue to the viewport edge.

### Grid

- Primary grid: 12 columns.
- Desktop wide-grid outer margin: 40 px.
- Desktop gutter: 24 px.
- Use CSS Grid for macro layout and absolute positioning only inside the two art-directed photo-collage components.
- Portfolio: three equal measured image columns near 302 px wide with approximately 99 px visible gaps. The live component uses three equal columns inside an 87% inner wrapper and 50 px card-side margins.
- Story section: live columns are 27% arched image, 22% foreground image, and 51% copy.
- Biography section: live columns are 46.5% copy and 53.5% portrait.

### Exact desktop vertical bands

| Section | Reference y-range | Reference height | Canonical height |
|---|---:|---:|---:|
| Header | 149–210 | 61 px | Approximately 114–118 px |
| Hero | 210–573 | 363 px | 675 px confirmed |
| Story | 573–910 | 337 px | Approximately 632 px at calibration width |
| Portfolio | 910–1307 | 397 px | Approximately 744 px; 230 px top and 135 px bottom padding confirmed |
| Image banner | 1307–1576 | 269 px | 500 px confirmed |
| Biography | 1576–1850+ | 274 px visible | Approximately 514 px visible and continuing |

Allow a ±2 px implementation tolerance after calibration rounding.

### Section padding and gaps

- Header: 40 px on all sides; vertically centered.
- Hero: no outer padding.
- Story: the arched image uses a 50 px top/left margin; the foreground image uses a 150 px top offset and negative 65 px overlap.
- Portfolio: 230 px top padding and 135 px bottom padding.
- Image banner: no outer padding.
- Biography: portrait column begins with a 100 px top margin; copy is vertically centered.

### Header and footer

- Header visible height is approximately 114–118 px, determined by the 38 px wordmark and 40 px top/bottom padding.
- No footer appears in the source. Do not insert a footer into the visible reconstruction.
- If a future page requires a footer, it must be designed as a new approved extension using only this palette and typography. It must not be treated as pixel-derived from this image.

## 5. COMPONENTS

### 5.1 Site frame

- Production width: 100%, with a 1500 px calibration max-width for measured internal geometry.
- Background: --color-header at the top, then section-specific surfaces.
- Border: none.
- Border-radius: 0.
- Shadow: none in the live site.
- Overflow: visible between story and portfolio so the collage and line can cross the boundary; otherwise clip full-bleed image media to their section.

The shadow is used only by the presentation preview:

~~~css
.site-preview {
  box-shadow: var(--shadow-page-preview);
}
~~~

### 5.2 Header and navbar

**Desktop geometry**

- Width: 1500 px at calibration.
- Height: approximately 118 px.
- Background: --color-header (#F8F6F1 in production).
- Padding: 40 px.
- Layout: three columns: logo 30%, navigation 57%, social icons 13%.
- Logo visible size: approximately 225 × 38 px, rendered as text.
- Navigation item spacing: 40 px total, implemented as 20 px on each side.
- Social icon gap: approximately 14 px.

**Logo**

- Text: “DELPHINE ROSE.”
- Font: display serif.
- Size: 38 px.
- Weight: 400.
- Color: --color-ink.
- Letter-spacing: 3 px.
- No image mark, underline, or enclosing shape.

**Links**

- Labels: START HERE, ABOUT ME, EXPERIENCE, LAYOUTS, SALES.
- Font: Cabin.
- Size: 12.5 px.
- Weight: 400.
- Tracking: 2 px.
- Color: --color-utility.
- Minimum interactive target: 44 × 44 px even though the glyphs are small.
- LAYOUTS and SALES include a 10 px downward chevron with 1.5 px stroke.

**Social group**

- Four compact icons are visible.
- Visible icon size: 18 px.
- Hit area: 44 × 44 px.
- Color: --color-icon-muted.
- The exact icon order is Facebook, Pinterest, Instagram, and heart.
- Font Awesome 5 matches the source. Simple Icons may substitute for the three brand marks; use a compact filled heart for the final glyph.

**States**

- Hover/focus link: --color-surface-sage. Do not add an underline to the exact reconstruction.
- Active/current link: --color-ink.
- Icon hover: --color-ink, opacity 1.
- Focus: 2 px --color-focus-ring outline, 3 px offset.
- Header is not observably sticky. Default to static positioning for exact reproduction.

**Dropdown menus**

- Background: --color-surface-oatmeal.
- Corners and shadow: none.
- Item padding: 19px 40px.
- Typography: Cabin 12px, uppercase, 2px tracking.
- Separator: 1px solid #FFFFFF.
- Hover: --color-surface-sand background with #FFFFFF text.
- Open transition: opacity plus translateY(6px) over 220 ms; rotate the chevron 180deg.

### 5.3 Hero

- Canonical size: 1500 × 675 px.
- Reference size: 800 × 363 px.
- Image aspect ratio: approximately 2.22:1 at calibration.
- Layout: position:relative; display:grid; place-items:center.
- Image: absolute inset 0; width/height 100%; object-fit:cover; object-position:50% 48%.
- Corners: square.
- Border/shadow: none.
- Overlay: --photo-overlay-hero, black at 0.10 opacity.

**Text group**

- Center x: 750 px.
- Optical center y: approximately 338 px.
- Width: approximately 506 px for the serif line.
- Serif line: “CAPTURING MOMENTS,” H1 style, centered, ivory.
- Script line: “to last a lifetime,” 48 px Modernline, centered, ivory.
- Keep it directly beneath and optically overlapping the serif line as one compact title lockup.
- Do not add a box, badge, backdrop blur, or text shadow.

### 5.4 Story collage section

- Calibration height: approximately 632 px.
- Background: --color-surface-sage.
- Position: relative.
- Visible overflow is required into the following section.

**Construction frame**

- Top-left: x=0, y=0.
- Width: approximately 647 px.
- Height: approximately 713 px.
- Render only the right and bottom sides.
- Stroke: 1 px solid.
- Right/upper stroke color: --color-line-cool.
- Bottom/warm stroke color: --color-line-warm.
- It extends approximately 81 px into the oatmeal section.
- It must sit behind both photographs.

**Rear arched image**

- Live layout margin: 50px -20px 0 50px.
- Calibration position: approximately x=49 px, y=41 px.
- Measured calibration size: approximately 394 × 512 px.
- Reference bounds: about 210 × 273 px.
- Clip: square bottom with a perfect semicircular top; top radius 189 px.
- Image: object-fit:cover; object-position:43% 50%.
- No border or shadow.

**Foreground rectangular image**

- Live layout margin: 150px 0 -35px -65px.
- Calibration position: approximately x=338 px, y=150 px.
- Measured calibration size: approximately 398 × 516 px.
- Reference bounds: about 212 × 275 px.
- Overlap with rear image: approximately 105 px.
- Extends approximately 34 px into the oatmeal section.
- Square corners; no border; no shadow.
- Image object-position:52% 45%.

**Photo script**

- Phrase: “the love story.”
- Source positioning is approximately margin:-45px -45px 45px 80px.
- Size: 48 px Modernline.
- Color: --color-on-photo.
- It may cross the rear image and foreground image edge, but must remain readable.

**Copy column**

- Column share: 51%.
- Horizontal padding inside the copy column: 8.25%.
- Calibration left: approximately x=855 px.
- Calibration top: approximately y=157 px.
- Max-width: approximately 469 px.
- Heading: H2, three lines, width about 450 px.
- Body: 21 px Crimson Text italic; heading-to-body spacing 13 px.
- Button: body-to-action spacing approximately 29 px.

**Heading copy**

“BECAUSE THESE  
MOMENTS ARE TOO GOOD  
TO MISS”

Preserve these line breaks at desktop.

### 5.5 Outline button

- Approximate production size: 128 × 36 px, expanding naturally for longer labels.
- Background: transparent.
- Border: 1 px solid --color-control-border.
- Radius: 0.
- Padding: 12 px 24 px.
- Label: 13 px Cabin, weight 400, uppercase, 2 px tracking.
- Text color: --color-ink.
- Layout: inline-flex; align-items:center; justify-content:center.
- Add a 2 px invisible hit-area extension if necessary to reach a 44 px target.

**States**

- Hover: background and border --color-ink; text --color-on-photo.
- Focus-visible: 2 px --color-focus-ring outline with 3 px offset.
- Active: background --color-ink; transform:translateY(1px).
- Disabled: border and text --color-disabled; opacity 0.65; no transform.

### 5.6 Portfolio navigation cards

**Section**

- Calibration height: approximately 744 px.
- Background: --color-surface-oatmeal.
- Inner width: 87%; measured visible image group approximately 1110 px.
- Row centered horizontally.
- Padding: 230 px 0 135 px.

**Each card**

- Measured calibration image size: approximately 302 × 381 px.
- Aspect ratio: approximately 4:5.
- Image corners: square.
- Background/border/shadow: none.
- Each wide-desktop card uses approximately 50 px left/right margin; visible image gaps measure about 99 px.
- Entire image and tab form one link with a 44 px minimum target.

**Vertical tab**

- Rotated visible size: approximately 43 × 245 px.
- Background: --color-label-tan.
- Unrotated link width: 245 px; padding:15px 20px.
- Source position uses a top offset near 55 px and a horizontal offset near -70 px from the image-side anchor. Final rendered placement begins approximately 43 px above the image and ends 29–30 px inside its right edge.
- Radius/border/shadow: none.
- Text: 14 px Cabin 400, uppercase, 2.5 px tracking.
- Implement with transform:rotate(-90deg), matching the source.
- Center text in both axes.

**Labels**

1. THE PORTFOLIO
2. THE EXPERIENCE
3. READ MY JOURNAL

**States**

- Hover image: scale to 1.025 over 500 ms; image wrapper clips overflow.
- Hover tab: background --color-surface-sage; text remains --color-label-ink.
- Focus-visible: outline the complete card with 2 px --color-focus-ring and 4 px offset.
- Active: image scale 1.01; tab background --color-ink; tab text --color-on-photo.

### 5.7 Full-width photographic banner

- Canonical size: 1500 × 500 px.
- Reference size: 800 × 269 px.
- Aspect ratio: 2.97:1.
- Image: object-fit:cover; object-position:50% 43%.
- Overlay: --photo-overlay-banner, black at 0.10 opacity.
- Corners/border/shadow: none.
- Script phrase centered at x=750 px, y≈250 px.
- Phrase: “when all you need is love.”
- Script size: 48 px Modernline.
- Color: rgba(247, 244, 237, 0.82).
- No other copy or call-to-action is visible.

### 5.8 Biography section

Only 274 reference pixels, approximately 514 CSS pixels at calibration, are visible; the section and image continue below the crop.

- Background: --color-surface-sand.
- Position: relative.
- Approximately 514 px are visible at the 1500 px calibration; do not treat that as the confirmed final section height.

**Copy**

- Left column share: 46.5%.
- Horizontal padding: 7%.
- Calibration left: approximately x=103 px.
- Calibration top: approximately y=225 px.
- Width: about 473 px.
- Heading: H2, three lines.
- Body: 21 px Crimson Text italic; margin-top 13 px; max-width about 460 px.
- Text colors: --color-ink and --color-body-warm.

Heading:

“HEY, I'M DELPHINE. AND I  
CAN'T WAIT TO CAPTURE  
YOUR STORY”

**Construction lines**

- Right image column carries a 1 px left border.
- Calibration vertical line: x≈698 px, beginning around y=99 px and continuing below the crop.
- A 1 px horizontal divider extends approximately 200 px from the column boundary toward/behind the portrait.
- Stroke: 1 px solid --color-line-warm.
- Lines sit behind the image.

**Arched portrait**

- Right column share: 53.5%; margin-top:100 px; margin-bottom:-30px; horizontal padding:7%.
- Calibration left: approximately x=801 px.
- Calibration top: approximately y=99 px.
- Measured width: approximately 594 px.
- Semicircular crown radius: about 297 px.
- The lower height is not measurable because it leaves the supplied image.
- Square lower corners.
- Object-fit:cover; object-position:60% 45%.
- No shadow or border.

### 5.9 Decorative hairlines

- Width: 1 px at all breakpoints.
- Never use 2 px decorative lines.
- Color depends on surface: cool line on sage, warm line on oatmeal/sand.
- They must align to whole CSS pixels at 1× rendering to avoid blur.
- Hairlines encode the collage geometry; do not add arbitrary frames around other content.

### 5.10 Forms, badges, and footer

- No form, conventional badge, or footer is visible.
- Do not claim pixel-derived dimensions for absent components.
- If a future form is required, use square fields, transparent or matching-surface backgrounds, 1 px --color-control-border borders, serif 16 px inputs, uppercase 11 px sans labels, and the standard focus ring.
- Never use pill badges. The existing vertical rectangular portfolio tab is the system’s label pattern.
- A future footer requires a separate composition review; it may reuse the palette and type tokens but must not be inserted into the source reconstruction.

## 6. IMAGERY & ICONOGRAPHY

### Photography direction

Use candid, documentary-style couple, wedding, and photographer portraits. Subjects should appear mid-movement or in quiet interaction rather than posed against studio backdrops.

Required visual properties:

- warm golden-hour or warm indoor light;
- subdued saturation;
- deep brown or olive shadows;
- creamy, low-chroma highlights;
- visible natural texture and slight grain;
- restrained contrast with soft highlight roll-off;
- earth-tone clothing and scenery;
- no neon colors, cold blue casts, high-clarity HDR, or glossy commercial lighting.

### Image treatments

| Image | Ratio/size | Crop | Shape |
|---|---|---|---|
| Hero | 2.20:1 | 50% 48% | Full-bleed rectangle |
| Story rear | 378 × 491 | 43% 50% | Semicircular top, square bottom |
| Story front | 382 × 495 | 52% 45% | Square rectangle |
| Portfolio cards | Approximately 302 × 381 at 1500 px calibration | Subject-specific center crop | Square rectangle |
| Banner | 2.97:1 | 50% 43% | Full-bleed rectangle |
| Biography | 571 px wide, height continues | 60% 45% | Semicircular top, square bottom |

Apply color correction only when necessary:

~~~css
.photo--editorial {
  filter: saturate(0.78) contrast(0.94) brightness(0.90) sepia(0.08);
}
~~~

Do not stack this filter on assets that are already graded to match.

### Icons

- Style: minimal line or simple brand glyph.
- Visible size: 14–16 px.
- Stroke width: 1.5 px.
- Color: muted taupe.
- Suggested libraries: Simple Icons for brands; Lucide for chevrons and generic icons.
- Do not mix filled emoji, multicolor brand marks, and outline icons.
- Keep the four-icon header group visually quiet; it must not compete with the logo.

## 7. EFFECTS & MOTION

### Shadows

The live website contains no visible component shadows. Cards, images, buttons, and the header remain flat.

The only prominent shadow belongs to the outer presentation preview:

~~~css
:root {
  --shadow-none: none;
  --shadow-page-preview:
    0 18px 24px -5px rgba(30, 28, 24, 0.45),
    0 5px 10px rgba(30, 28, 24, 0.16);
  --shadow-focus: 0 0 0 3px rgba(129, 122, 112, 0.32);
}
~~~

### Radius system

- --radius-none: 0.
- --radius-control: 0.
- --radius-card: 0.
- --radius-arch: 999px 999px 0 0.
- --radius-round: 999px, reserved for invisible hit zones or genuinely circular icons, not cards.

Do not introduce 8–24 px rounded rectangles. They conflict with the source.

### Motion

Motion is inferred because the source is static. It must remain slow, editorial, and subordinate to photography.

- Standard UI transition: 180 ms ease-out.
- Dropdown fade/translate and chevron rotation: 220 ms cubic-bezier(0.22, 1, 0.36, 1).
- Image hover: 500 ms cubic-bezier(0.215, 0.61, 0.355, 1).
- Optional scroll reveal: 600 ms cubic-bezier(0.22, 1, 0.36, 1), opacity 0→1 and translateY(12px)→0.
- Stagger between related items: no more than 80 ms.
- Hero copy entrance: 800 ms; script may follow the serif line by 120 ms.
- Active press: 100 ms.

Do not use bounce, elastic easing, large parallax, spinning, continuous floating, or animated gradients.

Honor prefers-reduced-motion: reduce:

- remove transforms and parallax;
- set animation duration to 1 ms;
- retain state changes through color and outline only.

## 8. RESPONSIVE BEHAVIOR

Responsive behavior is inferred from the desktop source. Preserve hierarchy, color rhythm, arch geometry, and deliberate overlaps rather than shrinking the entire page with transform:scale().

### Breakpoints

| Name | Range | Behavior |
|---|---|---|
| Desktop | Above 1250 px | Full composition and confirmed desktop values |
| Laptop | 1051–1250 px | Reduced fixed heights and portfolio spacing |
| Tablet | 768–1050 px | Burger header; compact three-card row; reduced type |
| Mobile | 0–767 px | Two-row header and stacked editorial sections |

Use the exact source breakpoints: 1250 px, 1050 px, and 767 px.

### Desktop: above 1250 px

- Header padding: 40 px.
- Logo: 38 px; navigation: 12.5 px; social icons: 18 px.
- H1/H2/H3/script: 50/42/32/48 px.
- Body: 21 px.
- Hero min-height: 675 px.
- Portfolio padding: 230 px 0 135 px.
- Banner min-height: 500 px.
- Story remains a 27% / 22% / 51% three-part row.
- Biography remains a 46.5% / 53.5% two-column split.

### Laptop: 1051–1250 px

- Hero min-height: 600 px.
- Banner min-height: 450 px.
- Portfolio padding: 215 px 0 135 px.
- Card side margins: 30 px.
- Biography bottom margin: 160 px.
- Portrait-column top margin: 75 px; column padding: 5%.
- Preserve the desktop nav and three-card row.

### Tablet: 768–1050 px

- Replace the desktop navigation with a burger control.
- Header padding: 30 px.
- Center the 36 px logo.
- Burger visible size: 25 px; hit area: 44 px.
- H1/H2/H3/script: 45/37/30/43 px.
- Body: 20 px.
- Hero min-height: 525 px.
- Banner min-height: 400 px.
- Portfolio padding: 167 px 0 110 px.
- Card side margins: 15 px.
- Vertical labels: 13 px, 225 px unrotated width, horizontal offset around -60 px.
- Story may keep its row while space allows; give the copy column sufficient inner padding and reduce overlap offsets proportionally.
- Biography receives 90 px top/bottom padding and 118 px bottom margin.

### Mobile: 0–767 px

- Header padding: 15px 20px 0.
- Header becomes two rows: burger column 30%, social column 70%, then a full-width centered logo beneath.
- Logo: 32 px with padding 15px 0 25px.
- Burger: 20 px visible, 44 px target.
- H1/H2/H3/script: 40/34/29/37 px.
- Body: no smaller than 19 px where the original prose scale is retained; 16 px is the absolute accessibility floor.
- Labels: 13 px; smallest metadata: 12.5 px.
- Hero min-height: 375 px. Use a portrait-specific image/crop positioned top center.
- Story images remain a 60% / 40% pair; the copy becomes a full-width row below with 10% 8% 13% top/horizontal/bottom padding.
- Portfolio padding: 90 px 0 80 px.
- Portfolio inner side margins: 12%.
- Stack cards one per row with 80 px between them.
- Keep the vertical-label offset near -65 px.
- Banner min-height: 350 px.
- Biography stacks portrait before copy.
- Biography image block: margin 0 8%; remove the left border; add a 1 px bottom border and 35 px bottom padding.
- Biography copy: margin-top 30 px; 8% horizontal padding.
- Biography section: 60 px top and 65 px bottom padding, plus 110 px bottom margin.

### Responsive hard constraints

- Never allow horizontal scrolling.
- Never distort images; use object-fit:cover.
- Never scale body text below 16 px.
- Never make utility text smaller than 10 px.
- Preserve the order of sections and the alternating sage → oatmeal → photo → sand rhythm.
- Do not remove the arches on mobile.
- Do not convert the page into generic rounded cards.

## 9. SECTION-BY-SECTION BLUEPRINT

### 9.1 Presentation layer, optional

Create a warm off-white 1080 × 1920 showcase canvas. Place three pale, partially hidden still-life rectangles behind an 800 px-wide site screenshot. Center the site at x=140 and y=149. Apply the page-preview shadow. This layer is excluded from production.

### 9.2 Header

Use the confirmed 40 px header padding and 38 px Idealist wordmark. Arrange the desktop header as 30% logo, 57% navigation, and 13% social icons. Align five uppercase Cabin links across the right portion, followed by Facebook, Pinterest, Instagram, and heart icons. Add small chevrons to LAYOUTS and SALES. Keep the header entirely flat and unbordered.

Suggested semantic structure:

~~~html
<header class="site-header">
  <a class="wordmark">DELPHINE ROSE</a>
  <nav class="primary-nav">…</nav>
  <div class="social-nav">…</div>
</header>
~~~

### 9.3 Hero

Place a full-width desert couple photograph directly below the header in a 675 px minimum-height frame. Center the couple near the horizontal midpoint. Apply the 10% dark overlay. Center the 50 px ivory Idealist title over the couple, then overlap it with the 48 px Modernline phrase. Keep all edges square and omit additional controls.

### 9.4 Story section

Begin the sage block as a 27% / 22% / 51% row. Draw an open construction frame from the section’s left edge, with its measured right line near x=647 in the 1500 px calibration and its bottom line extending into the next section.

Place the arched image with margin 50px -20px 0 50px. Overlay the phrase “the love story” near its bottom. Place the square-cornered portrait using margin 150px 0 -35px -65px so it overlaps the rear image and crosses the sage/oatmeal boundary.

Vertically center the copy column with 8.25% horizontal padding. Place the three-line serif statement, then the Crimson Text italic paragraph 13 px below, followed by the outlined LEARN MORE button after approximately 29 px. Align the heading’s top optically with the foreground image.

### 9.5 Portfolio row

Continue with the oatmeal block using 230 px top and 135 px bottom padding. Preserve the story collage and line overlap at its top. Center three portrait links inside an 87% wrapper, with approximately 50 px card-side margins on wide desktop. Position each 245 px unrotated tan label using rotate(-90deg) near the image’s upper-right.

### 9.6 Image banner

Place a 1500 × 500 px warm, dark, full-bleed couple photograph with a 10% black overlay. Center the 48 px Modernline phrase “when all you need is love.” slightly above or at the optical vertical center. Use no other text, button, inset, or border.

### 9.7 Biography introduction

Switch to the sand surface and create a 46.5% copy / 53.5% portrait split. The right column has a 1 px left border, 100 px top margin, -30 px bottom margin, and 7% horizontal padding. Extend a 200 px horizontal rule from the boundary toward the arched portrait. Vertically center the left copy with 7% horizontal padding. Use the three-line H2 statement followed 13 px later by a short Crimson Text italic paragraph. Allow the portrait and line to continue below the supplied reference crop.

### 9.8 Source endpoint

The reference ends during the biography section. Do not infer a page ending, footer, or additional call-to-action from the crop. Any continuation must follow the same palette, type, spacing, and image rules but is not part of the pixel-perfect source blueprint.

## 10. IMPLEMENTATION RULES

### Hard rules

1. Use the 1500 px calibration coordinate system and approximately 1.875 conversion factor for source-image validation.
2. Use only the declared color tokens. Do not introduce pure #000000, pure #FFFFFF, bright accent colors, or extra beige variants.
3. Do not collapse the four pale surfaces into one color.
4. Use Idealist for display, Modernline for script, Cabin for interface copy, and Crimson Text italic for prose. If the custom fonts are not licensed, substitute Cormorant Garamond and Allura.
5. Use spacing tokens for normal flow. Use exact component coordinates only for the measured collages and construction lines.
6. Ordinary cards, buttons, images, and sections use zero border radius.
7. Only arched photographs receive large radii.
8. Use 1 px construction lines and borders. Do not thicken decorative lines.
9. Do not add shadows to live-site cards, images, buttons, or the header.
10. Apply the page shadow only to the optional presentation preview.
11. Keep photographs warm, muted, candid, and textural.
12. Never stretch photographs. Use object-fit:cover and the documented object positions.
13. Use no decorative UI gradients. Use only the optional uniform photo scrims.
14. Limit script typography to one short phrase per photo composition.
15. Keep major statements uppercase serif, body copy italic serif, and utilities uppercase sans-serif.
16. Preserve desktop line breaks where specified.
17. Keep all visible interactive targets at least 44 × 44 px.
18. Provide keyboard focus indicators and reduced-motion behavior.
19. Preserve section order and surface rhythm.
20. Do not invent a footer inside the visible source reconstruction.
21. Use the exact responsive thresholds 1250 px, 1050 px, and 767 px.

### Complete root variables

~~~css
:root {
  /* Color */
  --color-canvas: #F7F4ED;
  --color-header: #F8F6F1;
  --color-surface-sage: #C8CBC5;
  --color-surface-oatmeal: #E9E0D4;
  --color-surface-sand: #DBCDBA;
  --color-surface-decorative: #DFE0DA;
  --color-label-tan: #D1BFA7;

  --color-ink: #000000;
  --color-ink-deep: #000000;
  --color-heading-cool: #000000;
  --color-body-cool: #000000;
  --color-body-warm: #000000;
  --color-utility: #000000;
  --color-label-ink: #000000;
  --color-on-photo: #FFFFFF;
  --color-icon-muted: #D1BFA7;
  --color-line-cool: #000000;
  --color-line-warm: #000000;
  --color-control-border: #000000;
  --photo-color-clay: #8D5933;
  --photo-color-walnut: #493621;
  --color-disabled: #B7B6B2;
  --color-focus-ring: #000000;

  /* Flattened-JPEG QA samples */
  --reference-header: #F7F6F1;
  --reference-sage: #C8CAC5;
  --reference-oatmeal: #E8E0D3;
  --reference-sand: #DCCDBA;
  --reference-ink-core: #292825;
  --reference-line-cool: #8F928D;
  --reference-line-warm: #817A70;

  /* Photo overlays */
  --photo-overlay-hero: rgba(0, 0, 0, 0.10);
  --photo-overlay-banner: rgba(0, 0, 0, 0.10);
  --reference-overlay-hero: rgba(23, 16, 6, 0.12);
  --reference-overlay-banner: rgba(19, 11, 1, 0.18);

  /* Typography */
  --font-display: "Idealist", "Cormorant Garamond", "Times New Roman", serif;
  --font-body: "Crimson Text", Georgia, "Times New Roman", serif;
  --font-utility: "Cabin", "Helvetica Neue", Arial, sans-serif;
  --font-script: "Modernline", "Allura", "Brush Script MT", cursive;

  --font-size-h1: 3.125rem;
  --font-size-h2: 2.625rem;
  --font-size-h3: 2rem;
  --font-size-h4: 1.625rem;
  --font-size-h5: 1.25rem;
  --font-size-h6: 0.875rem;
  --font-size-body-lg: 1.3125rem;
  --font-size-body: 1.21875rem;
  --font-size-body-sm: 1rem;
  --font-size-caption: 0.8125rem;
  --font-size-nav: 0.78125rem;
  --font-size-button: 0.8125rem;
  --font-size-label: 0.875rem;
  --font-size-logo: 2.375rem;
  --font-size-script-hero: 3rem;
  --font-size-script-story: 3rem;
  --font-size-script-banner: 3rem;

  --line-height-h1: 1;
  --line-height-h2: 1.15;
  --line-height-h3: 1.15;
  --line-height-h4: 1.2;
  --line-height-body: 1.55;
  --line-height-utility: 1;
  --line-height-script: 1;

  --tracking-heading: 3px;
  --tracking-logo: 3px;
  --tracking-utility: 2px;
  --tracking-button: 2px;
  --tracking-label: 2.5px;
  --tracking-caption: 2px;

  /* Spacing */
  --space-0: 0;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  --space-30: 7.5rem;
  --space-32: 8rem;
  --space-40: 10rem;
  --space-48: 12rem;
  --space-56: 14rem;

  /* Layout */
  --design-width: 93.75rem;
  --container-wide: 88.75rem;
  --container-content: 81.5625rem;
  --container-cards: 81.5625rem;
  --page-gutter-desktop: 2.5rem;
  --grid-gutter: 1.5rem;
  --header-height: 7.375rem;
  --hero-height: 42.1875rem;
  --story-height-calibration: 39.5rem;
  --portfolio-padding-top: 14.375rem;
  --portfolio-padding-bottom: 8.4375rem;
  --banner-height: 31.25rem;

  /* Measured art-direction anchors */
  --story-arch-x: 3.0625rem;
  --story-arch-y: 2.5625rem;
  --story-front-x: 21.125rem;
  --story-front-y: 9.375rem;
  --story-copy-x: 53.4375rem;
  --story-copy-y: 9.8125rem;
  --story-frame-x: 40.4375rem;
  --bio-copy-x: 6.4375rem;
  --bio-copy-y: 14.0625rem;
  --bio-line-x: 43.625rem;
  --bio-media-x: 50.0625rem;
  --bio-media-y: 6.1875rem;

  /* Borders and radii */
  --border-hairline: 1px;
  --radius-none: 0;
  --radius-control: 0;
  --radius-card: 0;
  --radius-arch: 999px 999px 0 0;
  --radius-round: 999px;

  /* Shadows */
  --shadow-none: none;
  --shadow-page-preview:
    0 18px 24px -5px rgba(30, 28, 24, 0.45),
    0 5px 10px rgba(30, 28, 24, 0.16);
  --shadow-focus: 0 0 0 3px rgba(129, 122, 112, 0.32);

  /* Motion */
  --duration-fast: 100ms;
  --duration-ui: 180ms;
  --duration-nav: 220ms;
  --duration-reveal: 600ms;
  --duration-hero: 800ms;
  --duration-image: 500ms;
  --stagger-item: 80ms;
  --ease-editorial: cubic-bezier(0.22, 1, 0.36, 1);

  /* Breakpoint reference values; copy the values into media queries */
  --breakpoint-mobile: 767px;
  --breakpoint-tablet: 1050px;
  --breakpoint-laptop: 1250px;
}
~~~

### Baseline global CSS

~~~css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  color-scheme: light;
  background: var(--color-canvas);
  font-size: 100%;
}

body {
  margin: 0;
  color: var(--color-ink);
  background: var(--color-canvas);
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  line-height: var(--line-height-body);
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

img {
  display: block;
  max-width: 100%;
}

button,
a,
input,
textarea,
select {
  border-radius: var(--radius-control);
}

:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }
}
~~~

## 11. ADDENDUM DE RUTA — ABOUT A+C

Este addendum documenta la extensión aprobada para `/about/`. No reemplaza la
homepage como autoridad visual ni convierte el sistema en la marca de la
referencia. Los comps generados sirven únicamente para resolver composición;
producción usa el color, la tipografía, las fotografías y el copy de It's A
Keeper Photography.

### Tesis y forma aprobada

- **Tesis:** la página es un archivo de por qué y cómo Lisa fotografía, no una
  colección genérica de credenciales.
- **Híbrido A+C:** A, `Keeper Archive`, aporta el arco de origen, el print
  superpuesto y el ledger del nombre. C, `Through Her Lens`, aporta el ritmo de
  retratos de Lisa, el ledger de método y la autoridad editorial.
- **Mundo propio:** marfil, sand, olive, walnut y umber; arcos
  semicirculares, prints cuadrados, hairlines de 1 px y superficies planas.
- **Prohibido:** badges, cards redondeadas, sombras decorativas, cintas o pins,
  estadísticas aisladas como widgets y fotografías generadas en el DOM final.

### Hero rebaselined y protegido

El usuario aprobó explícitamente una única excepción de media: reemplazar solo
el fondo del hero por `/uploads/about-lisa-photographing-tricities.jpg`. La
baseline protegida debe preservar:

- H1 `Meet Lisa — The Heart Behind It's A Keeper`;
- intro, script y CTA hash `#it-started-with-my-own-children`;
- fondo aprobado con alt literal `Lisa holding a camera to her face among dry
  grass and shrubs.` y `object-position: 50% 24%` tanto en desktop como en
  móvil;
- los dos prints laterales existentes, sin reemplazo ni cambio de crop;
- DOM fingerprint Playwright
  `7788c70630779dbd4405b8eebc4856ea3700a3896003c74962a596d08286bf17`;
- geometría exterior de 1440×882, 1200×782, 900×688 y 390×867.64 px en los
  cuatro viewports de QA, con tolerancia máxima de 1 CSS px.

La fuente anterior `/uploads/lisa-photographer-tricities.jpg` no se elimina ni
se reprocesa porque continúa utilizada en otras rutas de producción. Playwright
aprobó además el encuadre a 1728×997 y las regresiones a 1440, 1200, 900 y
390 px. Cualquier cambio futuro al hero exige una aprobación explícita y una
nueva baseline; no debe ocurrir como efecto colateral de editar las secciones
About.

### Secuencia compositiva

1. **Origen:** retícula de doce columnas; retrato de Lisa en arco, fotografía
   familiar como print y una nota marfil restringida. Un hairline atraviesa la
   composición sin convertirse en decoración flotante.
2. **Nombre:** ledger horizontal sand con H2, dos párrafos y `Keepers.` como
   payoff tipográfico. En tablet y móvil se apila conservando las divisiones de
   1 px.
3. **Cámara:** bloque earth de fotografía vertical y copy; sin collage extra.
4. **Veinte años:** superficie olive, tres fotografías con arco central y tres
   entradas de texto. El ledger responde 3 columnas en desktop, 2 con la tercera
   a ancho completo en tablet y 1 en móvil.
5. **Creencia:** imagen dominante, statement serif y papel sand cuadrado; título
   y cita conservan una medida horizontal balanceada, nunca una columna de una
   palabra. No usar clip-path, cinta, pin ni sombra.
6. **Método:** heading lateral más cuatro entradas numeradas. Responde 4/2/1,
   conserva los títulos como `strong`, no como headings adicionales, y mantiene
   un inset responsive entre copy y divisiones.
7. **Lisa, Off Camera:** copy más dos retratos verticales en solape controlado;
   el retrato frontal en blanco y negro lleva marco de print.
8. **Autoridad:** `Experience & Recognition` es un ledger de cuatro filas, no
   una fila de badges. La identidad de Lisa precede a 20+ años, 14 años,
   cientos de historias y la portada verificable de Tri-Cities MOM Magazine.
9. **Cierre:** fotografía full-bleed, wash de lectura, frame hairline centrado y
   CTA outlined a Contact.

### Densidad de Belief y Method

La revisión a 1728×997 detectó dos fallos CSS, no un problema de contenido ni
de estructura:

- En Belief, `max-width: 8ch` estaba en el padre `blockquote`; esa unidad se
  calculaba con el font del body y producía una medida cercana a 70 px antes de
  que el párrafo adoptara la tipografía display. El resultado era una cita de
  una palabra por línea y una sección de 1738.5 px.
- En Method, `--space-7` no existe. Al aparecer dentro del shorthand `padding`,
  el navegador invalidaba la declaración completa y dejaba el copy pegado a
  las divisiones.

El contrato corregido usa `12ch` en el texto display de Belief,
`text-wrap: balance`, un máximo de `3.75rem` para la cita y separaciones de
32 px donde antes había 40 px. Method usa únicamente tokens existentes mediante
`clamp(var(--space-5), 1.6vw, var(--space-8))`, es decir, un inset de 20–32 px,
sin alterar la retícula 4/2/1.

En el layout Method de dos columnas entre 768 y 1050 px, los dos ítems de la
primera fila añaden `padding-bottom: var(--space-8)`. Este inset inferior de
32 px separa el final del copy de la hairline que abre la segunda fila sin
introducir `gap`, romper el ledger ni afectar los layouts 4/1. A 900 px, la
distancia medida desde la última línea del ítem 01 hasta esa hairline es
exactamente 32 px, frente a aproximadamente 8–10 px antes del ajuste; la
retícula conserva dos columnas y overflow horizontal 0.

A 1728×997, Belief queda en 1324.2 px; la cita en 180 px y tres líneas; la media
y el copy miden 973.8 y 978.6 px. El inset resuelto de Method es 27.648 px. Las
regresiones 1440/1200/900/390 conservan cero overflow y la misma semántica,
copy, media, schema, hero e indexación.

### Responsive y accesibilidad

- Breakpoints About: 1250, 1050, 767 y 479 px, alineados con los tokens globales.
- Prosa visible: mínimo 18 px en móvil; ningún bloque debe provocar overflow
  horizontal.
- Los estados hover solo se aplican con `hover:hover` y `pointer:fine`; el CTA
  conserva feedback `:active` y los enlaces tienen `:focus-visible` claro.
- `prefers-reduced-motion: reduce` elimina transiciones y transforms
  prescindibles.
- Las fotografías informativas conservan alt literal; ninguna imagen de Lisa o
  del portfolio se trata como decorativa.

### Aislamiento

`about-page.css` se procesa como asset Vite mediante `?url` y se enlaza desde
`Base.astro` únicamente para `/about/`. Ninguna regla `.about-*` debe aparecer
en las otras veinte rutas públicas. El contrato de dirección se conserva como
comentario HTML solo en About para que una revisión futura pueda contrastar la
tesis con el render.

## 12. ADDENDUM DE MEDIA — HOMEPAGE

Este addendum registra la fotografía aprobada para `/` sin modificar la
composición que sigue siendo autoridad visual. Tampoco cambia la imagen global
de Open Graph/schema configurada en Settings.

### Hero art-directed

- Fuente visual: `/uploads/kennewick-couple-open-field-golden-hour.jpg`,
  2400×1600. La escena abierta, el gesto de la pareja y el fondo tranquilo
  sustituyen el encuadre anterior con ramas sin alterar copy ni geometría.
- Desktop sirve AVIF/WebP 1440×960 con foco `50% 29%` por encima de 1050 px.
  Tablet conserva esa fuente con foco `50% 58%`.
- Móvil sirve un recorte vertical AVIF/WebP 640×1024 con foco `50% 42%` para
  mantener ambos sujetos reconocibles detrás del copy.
- La carga debe resolver a una sola fuente AVIF cuando el navegador la soporta;
  el JPEG queda como fallback semántico, no como descarga paralela.

### Meet Lisa y portfolio

- El retrato principal en arco permanece
  `/uploads/lisa-photographer-tricities.jpg`.
- Solo el print pequeño cambia a
  `/uploads/about-lisa-camera-candid-black-white.jpg`; es decorativo,
  `aria-hidden`, con alt vacío, `object-position: 50% 50%` y sin ampliación.
  Carga WebP 640 en desktop y 400 en móvil. Tina expone esta media como
  `meetLisa.printImage` opcional y usa el retrato principal como fallback.
- Las cinco cards mantienen la selección y el orden de ADR-048. Seniors no se
  reemplaza, reprocesa ni reencuadra.

### Guardas

Todo cambio futuro a estas fotografías debe conservar alt/semántica,
art direction por breakpoint, foco visible, cero overflow y carga responsive
sin JPEG innecesario. Las fuentes anteriores siguen disponibles mientras otra
ruta, Settings, schema u Open Graph las referencie; este addendum no autoriza
borrarlas.

## 13. ADDENDUM DE CONVERSIÓN — CONTACT GATED ESTIMATE

Este addendum fija el patrón aprobado para `/contact/`: la selección ocurre
antes de pedir datos y el recibo personalizado se revela solamente cuando el
transporte de Netlify confirma el envío. El gate no convierte el estimado en una
reserva, un pago o una cotización contractual.

### Jerarquía y composición

- El `EditorialHero` introduce la tarea y desplaza al planner mediante
  `Build My Estimate`.
- Session, Coverage y Keepsakes conservan opciones y precios visibles. La
  anticipación vive en el total combinado y su desglose; no oculta la estructura
  comercial necesaria para elegir con criterio.
- Details es la cuarta y última fase. Solo nombre y email son obligatorios;
  teléfono, timing y nota permanecen opcionales.
- En desktop, el recibo se mantiene como papel editorial sticky dentro de la
  retícula. En estado bloqueado usa eyebrow, H3, marca de cierre y
  `Finish & reveal`; no usa blur, glassmorphism, sombra ni una capa engañosa.
- En móvil, una barra sticky compacta presenta `Ready to reveal` y conduce al
  mismo bloque Details. Después de confirmar, se convierte en acceso al total
  revelado.
- El total y el desglose usan `hidden` antes del éxito. No basta con bajar
  opacidad, aplicar filtro o cubrir texto que seguiría expuesto a tecnologías
  asistivas.

### Estados de interacción

1. **Locked:** selecciones editables; recibo y barra móvil anuncian que el
   estimado está listo para revelar.
2. **Submitting:** formulario `aria-busy`, CTA `Sending…`, controles congelados
   y guard contra doble envío.
3. **Unlocked:** solo una respuesta HTTP 2xx muestra recibo, desglose y total;
   las selecciones y datos quedan congelados para coincidir con el payload.
4. **Error:** HTTP no exitoso, fallo de red o timeout de 15 segundos conserva
   los valores, vuelve a habilitar controles, mantiene el recibo bloqueado y
   permite reintentar.
5. **No JavaScript:** el form HTML conserva `POST` a `/thank-you/`; no intenta
   simular un unlock local.

### Accesibilidad y feedback

- `Finish & reveal` lleva a Details y enfoca nombre; el éxito lleva al título
  del recibo y el error enfoca su alerta.
- Éxito usa `role="status"`/`aria-live="polite"`; error usa
  `role="alert"`/`aria-live="assertive"`.
- El anuncio del total ocurre solo después del reveal.
- Los campos conservan labels visibles, foco de teclado, invalid state y los
  estilos cuadrados/hairline del sistema. No se cambia color como única señal.
- `prefers-reduced-motion` elimina desplazamientos o animaciones no esenciales
  sin alterar el cambio de estado.

### Transporte, analítica y privacidad

- Contact contiene un único form `session-estimate`, detectable de forma
  estática por Netlify, con honeypot y fallback `/thank-you/`.
- El submit mejorado usa body URL-encoded same-origin. Solo `response.ok`
  desbloquea; ninguna excepción o timeout cuenta como conversión.
- Los eventos enviados a Google tag describen view, inicio, intento, éxito,
  error y reveal sin adjuntar nombre, email, teléfono, historia ni valores de
  campos.
- La microcopia junto a la CTA declara de forma factual que los datos de
  contacto y elecciones se envían a Lisa mediante Netlify Forms para responder
  sobre la sesión.
- Este disclosure no reemplaza la revisión legal. `/privacy/` permanece
  `draft/noindex` y debe evaluar Netlify Forms, Clarity, GA4 y consentimiento
  antes de su propia publicación.

### Regresión

Las pruebas deben interceptar cualquier POST y nunca usar información real.
Cubrir 1440, 1200, 900 y 390 px con 2xx, 5xx, fallo de red y doble clic; exigir
un solo POST, unlock exclusivo de 2xx, preservación de datos en error, foco
correcto, controles congelados tras éxito, fallback sin JavaScript y cero
overflow horizontal.

## 14. ADDENDUM DE MEDIA — BRANDING Y HEADSHOTS

Este addendum fija la renovación fotográfica aprobada para
`/branding-photographer-tri-cities-wa/` y
`/headshot-photographer-tri-cities-wa/`. Cambia la selección y su disciplina
SEO; no modifica el lenguaje visual, el copy comercial ni el estado editorial
de las rutas.

### Selección y diversidad

- Las nuevas fuentes proceden de las carpetas verificadas de Google Drive
  `Branding photos / Richland`, `Branding photos / Kennewick` y
  `Branding photos / West Richland`, además del inventario Headshot auditado.
- Branding renderiza 13 superficies, 11 fuentes únicas y un máximo de dos usos
  por fuente. Hero y cierre son distintos; sus cuatro superficies de mosaico
  también usan fuentes distintas.
- Headshots renderiza 14 superficies, 11 fuentes únicas y un máximo de dos usos
  por fuente. Hero y cierre son distintos; el par de Team Headshots no repite
  fotografía.
- Las repeticiones compositivas usan alt vacío cuando la misma imagen ya fue
  descrita. Las imágenes informativas conservan una descripción literal del
  sujeto y la acción.
- Ninguna fuente anterior se borra por esta renovación: otras rutas de
  producción todavía pueden referenciarla.

### Contrato SEO y privacidad de la imagen

- Los 18 JPEG nuevos usan nombres descriptivos en minúsculas y kebab-case. La
  ruta, el alt y la descripción XMP trabajan juntos; el filename no sustituye
  la descripción accesible.
- `config/image-seo-metadata.json` es la allowlist de metadata del lote. Define
  creator, credit, rights, web statement, title, description y, cuando la
  carpeta Drive lo prueba, ciudad, Washington, United States y `US`.
- La ciudad es granularidad editorial, no una coordenada. No se inventa GPS,
  dirección, venue ni sublocation. El retrato contra fondo neutral no incluye
  ciudad porque su carpeta no la verifica.
- `scripts/lib/image-xmp.mjs` construye y normaliza el XMP seguro. Se eliminan
  EXIF/IPTC/ICC y cualquier GPS, fecha de captura, serial, nombre RAW,
  `OriginalDocumentID`, historial o identificador `xmpMM`.
- `scripts/optimize-images.mjs` añade ese XMP solo a los assets allowlisted y
  regenera sus WebP si el manifiesto cambia. Los 18 JPEG originan 72 variantes
  WebP de 400, 640, 960 y 1440 px.

### Guardas y QA

El validador exige naming, peso y dimensiones de las fuentes, metadata XMP
exacta, ausencia de metadata sensible, cuatro variantes WebP por asset y los
contratos de diversidad/alt de ambas rutas. Playwright comprueba en 1440, 1200,
900 y 390 px la fuente responsive cargada, dimensiones intrínsecas, carga y
prioridad, alt, unicidad, crops, consola, red y overflow. El cierre aprobado es
release 21/21 y Playwright PASS en los cuatro anchos, con inspección visual de
los crops.

Ambas rutas continúan `draft/noindex` y fuera de sitemap/`llms.txt` hasta que
se confirmen los entregables, cantidades y duraciones pendientes. La calidad
visual no sustituye ese gate editorial.

## 15. ADDENDUM DE CONVERSIÓN — CONTACT TRANSPARENT NATIVE ESTIMATE

Este addendum supersede el addendum 13 únicamente en el gate, el transporte
AJAX, los estados de reveal/retry y la opcionalidad de campos. El addendum 13 se
conserva como historial de la dirección anterior. Permanecen vigentes la
composición editorial del planner, el único form `session-estimate`, la
publicación `ready/index`, `ContactPage` + `BreadcrumbList`, sitemap 10,
`llms.txt` 9 y la confirmación externa de Netlify Forms/notificaciones.

### Tesis y jerarquía transparentes

- **Tesis:** el precio orientativo ayuda a decidir antes del contacto; no es una
  recompensa condicionada al envío.
- Session, Coverage y Keepsakes conservan opciones y precios visibles. El
  recibo completo también es visible desde el HTML SSR, con Session, Coverage,
  People, Keepsakes, Add-ons y un total inicial de `$160`.
- Details sigue como fase 04, renombrada `Review & send`. Nombre, email,
  teléfono e historia son obligatorios; preferred timing es el único campo de
  contacto opcional.
- En desktop, el recibo continúa como papel editorial sticky. Su eyebrow es
  `Live session receipt`, el H3 es `Your Estimate` y no contiene lock, blur,
  cubierta, éxito ni error AJAX.
- En móvil, la barra muestra `Estimated total`, el valor visible y
  `Review estimate`; el botón desplaza al recibo en lugar de conducir a un
  reveal.
- Tanto el recibo como los totales desktop/móvil deben estar presentes,
  expuestos a tecnologías asistivas y visibles antes de ejecutar JavaScript.

### Calculador vivo y progressive enhancement

1. **SSR:** el paquete #ONE produce `$160` visible en recibo, barra móvil y
   anuncio polite.
2. **Selección:** JavaScript actualiza de inmediato líneas, fotografía, total,
   campos ocultos y estado de personas sin exigir datos ni submit.
3. **Navegación del planner:** progress, avance entre fases, stepper y
   `Review estimate` conservan scroll suave o instantáneo con reduced motion.
4. **Validación:** los campos nativos requeridos usan el navegador y
   `aria-invalid`; no existe un estado de error de transporte en la página.
5. **Sin JavaScript:** el recibo SSR permanece visible en `$160`; las
   selecciones crudas permiten recalcular el estimate después del envío.

El cambio de total puede usar una transición breve de opacity/transform y una
región `aria-live="polite"`, siempre respetando `prefers-reduced-motion`. El
valor no debe anunciarse por cada frame ni depender únicamente de color.

### Transporte nativo

- Contact contiene exactamente un form `session-estimate`, detectable de forma
  estática por Netlify, con `method="post"`, `action="/thank-you/"`, honeypot y
  campo `form-name`.
- Un submit válido siempre pertenece al navegador: POST URL-encoded como
  navegación de documento hacia `/thank-you/`, con JavaScript activo o
  desactivado.
- El calculador no usa `fetch`, `FormData`, `URLSearchParams`,
  `preventDefault`, `AbortController` ni otro control del transporte.
- No existen estados locked/submitting/unlocked, reveal condicionado a 2xx,
  timeout, retry, freeze posterior al éxito ni persistencia del unlock.
- No se emiten eventos personalizados `contact_gate_*`,
  `estimate_revealed`, `submission_id` ni datos de campos desde el calculador.
  Esto no modifica los snippets globales de Clarity y GA4.

### Accesibilidad, privacidad y límites comerciales

- Recibo y total tienen semántica disponible desde SSR; la región polite
  anuncia actualizaciones posteriores.
- Labels visibles, foco cuadrado, `aria-current` del progress, invalid state y
  navegación de teclado permanecen dentro del sistema global.
- `prefers-reduced-motion` retira desplazamientos y animación del total sin
  alterar cálculo, validación ni submit.
- El estimado sigue siendo planificación, no booking, pago ni precio
  contractual. Lisa confirma detalles, contrato y retainer fuera del planner.
- Netlify Forms recibe contacto, notas, selecciones y campos calculados. La
  configuración y las notificaciones productivas fueron confirmadas por el
  usuario; `/privacy/` sigue `draft/noindex` hasta revisión autorizada.

### Regresión

El HTML release debe empezar con `$160` visible en recibo y barra móvil y no
contener ningún marcador del gate histórico. La prueba viva cambia Family,
paquete #THREE, siete personas, Collection #1, extra retouched image y rush 48h
hasta `$955.98`; después intercepta el POST y exige navegación de documento,
acción `/thank-you/`, URL encoding y payload calculado completo. Cubrir 1440,
1200, 900 y 390 px, más un contexto sin JavaScript a 390 px. QA nunca usa una
persona real ni envía el formulario a producción.

## 16. ADDENDUM DE RUTA — SENIOR TIMING FIELD GUIDE

Este addendum fija el rediseño de
`/journal/when-to-book-senior-pictures-tri-cities/` sin cambiar su gate
editorial. La mejora visual y semántica no autoriza publicación: la ruta
permanece `draft/noindex`, conserva su header release y sigue fuera de sitemap
y `llms.txt` mientras no exista una fecha editorial aprobada.

### Dirección aprobada

- Mock canónico:
  `.impeccable/mocks/senior-timing-03-contact-sheet-field-guide.png`.
- Se rechazaron
  `.impeccable/mocks/senior-timing-01-season-ledger.png` y
  `.impeccable/mocks/senior-timing-02-season-spine.png`: la opción 03 traduce
  las cuatro estaciones como un solo año fotográfico, evita una fila de cards
  intercambiables y conserva un recorrido image-first más claro.
- La gramática combina `EditorialHero`, superficies ivory/sand/umber, una sola
  imagen en arco, hairlines de 1 px, una contact sheet asimétrica y un cierre
  fotográfico full-bleed.
- Se prohíben cards redondeadas, sombras decorativas, badges, cinta, pins,
  splatter, glassmorphism y gradientes. El wash funcional del cierre sirve solo
  para lectura sobre fotografía.

### Secuencia compositiva

1. **Hero:** fotografía verificada full-bleed, H1 e intro centrados, dos prints
   decorativos y un botón `Read the timeline` hacia `the-short-answer`.
2. **Byline:** rail `By Lisa Weiss · It's A Keeper Photography · Richland, WA`,
   sin fecha falsa.
3. **Short Answer:** statement marfil con regla superior/inferior y nota
   editorial lateral.
4. **Yearbook guidance:** retrato en arco y prosa estrecha con un enlace inline
   a Seniors; recomienda consultar el deadline publicado por la escuela, sin
   fingir fechas distritales.
5. **Season by season:** ordered list de cuatro retratos y cuatro H3 como una
   contact sheet asimétrica; responde 4 composiciones en desktop, 2×2 en tablet
   y una columna en móvil sin cambiar el orden DOM.
6. **Too late:** statement oscuro, text-led, sin card ornamental.
7. **Golden hour:** split ancho de imagen/prosa con la respuesta directa.
8. **Booking calendar:** advisory spread con reglas, retrato y enlaces a
   Seniors/Locations; no inventa un calendario mensual.
9. **Quick Answers:** tres filas `<details>` nativas con H3 visibles; Q54 queda
   ausente hasta confirmación.
10. **Cierre:** imagen full-bleed, H2, prosa y CTA outlined a Contact.

### Semántica, media y verdad

- El contrato visible exacto es 1 H1, 8 H2, 7 H3 y cuatro anchors dentro de
  `<main>`: Seniors, Seniors, Locations y Contact. El control del hero es botón,
  no anchor.
- Se renderizan 11 imágenes: nueve informativas con alt literal y dos prints
  decorativos con alt vacío. La nueva
  `/uploads/west-richland-senior-woodpile-portrait.jpg` procede de una carpeta
  West Richland verificada y conserva solo XMP allowlisted sin GPS ni metadata
  sensible.
- La frase distrital no demostrada se reemplaza por guía basada en el deadline
  que publique cada escuela; `no school-schedule conflicts` se corrige a
  `fewer school-schedule conflicts`. Q54 no se renderiza y no existe fecha en
  byline ni schema.
- `Article`, `FAQPage` y `BreadcrumbList` derivan de texto visible y omiten
  fechas. `og:type` es `article`; no se emiten `Service`, `Review`,
  `AggregateRating`, calle ni coordenadas.

### Interacción, responsive y aislamiento

- Breakpoints de la ruta: 1250, 1050, 767 y 479 px. El layout conserva lectura,
  hit areas mínimas de 44 px, foco visible, acordeones operables por teclado,
  reduced motion y overflow horizontal cero.
- El único defecto real detectado por Impeccable fue una transición de `width`
  en la línea de los enlaces del booking ledger; ahora el estado usa
  `transform: scaleX()` con el mismo resultado visual. Los diez avisos
  `broken-image` restantes provenían de regex del validador y fueron refutados
  por las 11 imágenes cargadas en el DOM real.
- `journal-senior-timing-page.css` se procesa mediante `?url` y se enlaza desde
  `Base.astro` solo para esta ruta. `EditorialPageRouter.astro` resuelve también
  `SeniorTimingPage` para que el refresco Tina no caiga en `ContentPage`.
- Validadores staging y release aprobaron 21/21 rutas. Playwright aprobó
  1440×1000, 1200×900, 900×900 y 390×844; la revisión final independiente
  devolvió `PASS` sin defectos P1/P2 y confirmó que `og:type` no regresó en las
  otras veinte rutas.

## 17. ADDENDUM DE RUTA — NEWBORN COMPARISON HOUSE ARCHIVE

Este addendum fija el rediseño de
`/journal/in-home-vs-studio-newborn-photography/` sin levantar su gate
editorial. La ruta permanece `draft/noindex`, conserva el header release
noindex, no muestra fechas y sigue fuera de sitemap y `llms.txt`. Calidad visual
y QA no sustituyen la aprobación factual de Lisa, la confirmación del formato
exacto ni una fecha editorial real.

### Dirección canónica

- Concept B / Impeccable,
  `.impeccable/mocks/newborn-comparison-b-house-archive.png`, es la comp
  canónica: `The house as archive`.
- La dirección convierte la casa en archivo de la memoria y la falta de una
  fotografía studio verificable en espacio negativo deliberado. El díptico
  enfrenta una fotografía in-home en un único arco con una página umber de
  prosa y un marco hairline vacío; no fabrica una sesión de estudio.
- Concept A comprimía demasiado la comparación en un díptico convencional y
  Concept C daba al outdoor más peso del que tiene en el artículo. Ambos se
  conservan como alternativas rechazadas.
- Las comps definen geometría y jerarquía. Personas, escenas y sample copy
  generados nunca se publican.

### Secuencia compositiva

1. **Hero compartido:** `EditorialHero` full-bleed, madre y bebé verificados,
   dos prints decorativos, H1/intro centrados y botón `Read the comparison`
   hacia `the-short-answer`.
2. **Byline:** Lisa Weiss, It's A Keeper Photography y Richland, WA; sin fecha.
3. **Short Answer:** manifiesto marfil amplio y text-led.
4. **Definitions:** díptico sand/umber, arco in-home frente a definición Studio
   sin fotografía ni falsa equivalencia visual.
5. **Honest Comparison:** cuatro filas completas con reglas, H3 y párrafo en el
   orden definitivo; no cards de igual altura.
6. **Outdoor:** fotografía familiar ancha, panel estrecho y enlace a Family.
7. **Treasure:** ensayo personal centrado, spread de dos fotografías y enlace a
   Newborn.
8. **Common Questions:** tres `<details>` nativos; el primero abierto y cada H3
   visible se refleja 1:1 en FAQ schema.
9. **Cierre:** fotografía full-bleed, H2, párrafo Tri-Cities y CTA a Contact.

### Copy, media y semántica

- Contrato visible exacto: 1 H1, 8 H2, 7 H3, tres FAQ y tres anchors en orden
  Family → Newborn → Contact. El control del hero es botón, no anchor.
- Se conserva el copy definitivo completo, incluido `What About Outdoor
  Newborn Sessions?` y el párrafo final Tri-Cities. El validador compara cada
  párrafo y su orden exacto para impedir omisiones o paráfrasis accidentales.
- Nueve fuentes locales existentes cubren la ruta: siete imágenes informativas
  con alt literal y dos prints decorativos con alt vacío. Las escenas
  aspiracionales de nursing, nursery, bassinet y parents by the window no se
  usan como alt porque las fuentes elegidas no las demuestran.
- Las tres imágenes del hero cargan eager; solo el fondo tiene prioridad alta.
  Las otras seis cargan lazy/async y reutilizan dimensiones intrínsecas y WebP
  400/640/960/1440 existentes.
- Un `Article`, un `FAQPage` y un `BreadcrumbList` derivan de contenido visible.
  No se emiten `Service`, `Review`, `AggregateRating`, calle, coordenadas,
  credencial de seguridad ni fechas.

### Correcciones finales y responsive

- El último pase corrigió focos sin sustituir media: hero `61% 48%` en desktop
  y `65% 48%` en móvil; arco in-home `50% 38%`; outdoor principal `62% 47%` y
  secundaria `50% 43%`; cierre `50% 46%` y `58% 50%` en móvil.
- Se restituyó breathing room vertical entre definiciones y capítulos, y se
  equilibró el díptico: dos páginas asimétricas amplias en desktop, balance
  legible en tablet y una sola columna en móvil, siempre en orden DOM.
- Por debajo de 768 px se disuelven los overlaps, las filas pasan a ancho
  completo y los crops protegen rostros. Texto de cuerpo ≥16 px, hit areas de
  44 px, foco visible, reduced motion y overflow horizontal cero permanecen
  obligatorios.
- `journal-newborn-comparison-page.css` se procesa con `?url` y `Base.astro` lo
  enlaza solo para esta ruta. `journal/[slug].astro` y
  `EditorialPageRouter.astro` resuelven `NewbornComparisonPage` en SSR y refresh
  Tina; no existe caída a `ContentPage`.

### Regresión y gate

Los validadores staging y release aprobaron 21/21 rutas. Playwright aprobó
1440×1000, 1200×900, 900×900 y 390×844, más una inspección puntual a 1728 px,
con headings, párrafos, anchors, imágenes, FAQ, schema, foco, crops, red,
consola, CSS aislado y overflow correctos. El detector Impeccable final devolvió
`[]`.

Los tres pendientes literales son `[VALIDAR CON LISA]`,
`[VALIDAR: formato exacto que ofrece Lisa]` y `[FECHA]`. Mientras cualquiera
permanezca, no se añaden `datePublished`, `dateModified` o `lastModified`, no se
cambia a `ready/index` y no se incorpora la URL a crawler outputs.

## 18. ADDENDUM DE RUTA — BRANDING VS. HEADSHOTS VERSUS AXIS

Este addendum fija el rediseño y publicación de
`/journal/branding-photos-vs-headshots/`. La ruta es un artículo comparativo
`ready/index`, publicado y modificado el `2026-08-11`; no publica ni resuelve
los paquetes pendientes de las páginas de servicio Branding y Headshots.

### Dirección canónica

- Comp C / Impeccable,
  `.impeccable/mocks/branding-headshots-comparison-c-versus-axis.png`, es la
  dirección canónica: `Versus Axis`.
- El eje hace visible la diferencia antes de la tabla: un retrato formal y
  singular enfrenta una biblioteca asimétrica de persona, proceso y lugar. Una
  costura central `VS` une ambas pruebas y continúa conceptualmente en la tabla
  reglada.
- Comp A `Proofbook` y Comp B `Dossier` se conservan como alternativas
  auditadas no seleccionadas. A dispersaba la comparación en un archivo de
  pruebas; B la subordinaba a una lectura de dossier menos inmediata.
- Las comps solo gobiernan geometría, densidad y jerarquía. Personas, escenas,
  sample copy o identidades generadas no llegan a producción.

### Secuencia compositiva

1. **Hero compartido:** `EditorialHero` con chef trabajando, dos prints
   decorativos, H1/intro centrados y botón `Read the comparison` hacia
   `the-short-answer`.
2. **Byline:** Lisa Weiss, It's A Keeper Photography, Richland, WA y fecha
   autorizada `August 11, 2026`.
3. **Short Answer:** manifiesto ivory con las dos afirmaciones definitivas y su
   énfasis semántico restaurado.
4. **What Are Branding Photos?:** arco único, biblioteca asimétrica de tres
   imágenes y checklist semántico de cinco ítems.
5. **What Is a Headshot?:** columna estrecha de copy y una prueba formal
   disciplinada; no se convierte en card.
6. **Side by Side:** retrato singular, costura `VS`, prueba Branding más amplia
   y tabla semántica de tres columnas/seis filas.
7. **Which Does Your Business Need First?:** ledger deep-umber de tres
   decisiones y enlaces Branding/Headshots en orden fuente.
8. **What Happens in a Branding Session?:** split de acción/prosa, sin grilla
   de cards equivalentes.
9. **Common Questions:** tres filas `<details>` nativas; el primer detalle abre
   por defecto y sus H3/respuestas se reflejan 1:1 en schema.
10. **Cierre:** fotografía de equipo full-bleed, copy definitivo y CTA a
    Contact.

### Gramática, semántica y verdad

- Contrato exacto: 1 H1, 8 H2, 6 H3, tres FAQ y tres anchors dentro de
  `<main>`: Branding → Headshots → Contact. El control del hero es botón local,
  no anchor.
- Los cinco ejemplos Branding son un `<ul>` y la comparación fuente es una
  `<table>` accesible. `Headshot` y `Branding photos` son headers de columna, no
  headings falsos.
- Superficies cuadradas, elevación plana y hairlines de 1 px. El arco de la
  biblioteca es la única curva fuerte; la costura central no es badge.
- Tipografía display compartida hasta `6rem`, tracking nunca menor que
  `-0.04em`, body mínimo de `1rem` y metadata uppercase con la sans del sitio.
- Sin gradientes, glass, sombras, cards redondeadas, tape, pins, splatter,
  badges, textura falsa, rotación arbitraria ni identidad copiada.
- Las comparaciones editoriales `1–3 polished portraits`, `Under an hour` y
  `Half a day, typically` permanecen copy visible autorizado; no se modelan
  como paquete, `Service`, `Offer`, duración o precio estructurado.

### Media

- Once fuentes existentes y únicas: ocho informativas con alt literal y tres
  decorativas con alt vacío.
- El hero usa
  `/uploads/branding-chef-kitchen-richland-wa.jpg`,
  `/uploads/professional-headshot-woman-neutral-backdrop.jpg` y
  `/uploads/pianist-creative-branding-portrait-richland-wa.jpg`.
- El cuerpo usa tres pruebas Branding, dos Headshots, una pareja de negocio,
  un detalle de proceso y el cierre de equipo definidos en
  `paginas/18-journal-branding-vs-headshots.md`.
- Las tres imágenes del hero cargan eager; solo el fondo tiene prioridad alta.
  Las otras ocho cargan lazy/async, con dimensiones intrínsecas y WebP
  responsive 400/640/960/1440 existentes.
- El rollout no renombra, recodifica, sobrescribe ni borra media compartida, y
  no infiere ciudad, rol o tipo de sesión fuera del alt y metadata verificados.

### Render, responsive e interacción

- `BrandingHeadshotsArticlePage.astro` resuelve la ruta tanto en SSR como en el
  refresh Tina; no existe caída a `ContentPage`.
- `journal-branding-vs-headshots-page.css` se importa mediante `?url` y
  `Base.astro` lo enlaza solo para esta ruta. Todos los selectores se limitan a
  `.branding-headshots-*`; el validador debe fallar ante ausencia o leakage.
- Breakpoints: 1250, 1050, 767 y 430 px. Desktop conserva spreads de 12
  columnas y eje vertical; móvil respeta el orden DOM, apila las pruebas,
  convierte la costura en regla horizontal y permite wrapping en la tabla sin
  `min-width` que genere overflow.
- Foco visible y superficies operables de al menos 44 px son obligatorios para
  botón, links y summaries. La única animación revela la costura `VS`, con el
  contenido visible por defecto y desactivación bajo `prefers-reduced-motion`.

### Publicación, schema y QA requerido

- La ruta usa `ready/index`, `lastModified: 2026-08-11`, canonical `www`,
  `og:type=article`, sin header release noindex y con membresía única en sitemap
  y `llms.txt`. Staging conserva noindex global y sitemap vacío.
- Se emiten un `Article` fechado `2026-08-11`, un `FAQPage` derivado 1:1 de las
  tres preguntas visibles y un `BreadcrumbList` Home → Journal → Branding
  Photos vs. Headshots. No se emiten `Service`, `Offer`, `Review`,
  `AggregateRating`, calle, coordenadas, duración o precio estructurado.
- QA final: validadores staging/release 21/21 y Playwright `PASS` en
  1440×1000, 1200×900, 900×900, 390×844 y 1728×963, con 15 capturas. La
  costura `VS` es vertical en 900–1728 y horizontal en 390; a 1440,
  `figureGap` 174.375 px ≥ seam 88 px. Contraste Headshot 4.6104:1, foco del
  ledger 13.479:1, tabla/body ≥16 px, targets ≥44 px, reduced motion y cero
  overflow/runtime quedan aprobados. Impeccable devolvió `[]` y la revisión
  independiente `PASS` sin P1/P2. El P3 no funcional de los crops de sección
  con header/skip-link enfocado no afecta las capturas full-page ni la
  accesibilidad real.

## 19. ADDENDUM DE PUBLICACIÓN — JOURNAL HUB

Este addendum fija la publicación de `/journal/` sin rediseñar su composición
aprobada. La ruta conserva su firma `overlap`, hero walnut, listado editorial
marfil y cierre umber; el cambio es de publicación, semántica y navegación
segura hacia contenido ya indexable.

### Jerarquía y enlaces

- Se conservan H1 `The Journal`, H2 `Planning Guides` y H2 `Start With Your
  Session`, junto con las cuatro cards y su orden editorial.
- Locations Guide y Branding vs. Headshots son las únicas cards enlazadas.
  Senior Timing y Newborn Comparison mantienen título y extracto visibles, pero
  no presentan anchor mientras sigan `draft/noindex`.
- El enlace secundario Portfolio y la CTA final Contact completan cuatro anchors
  exactos dentro de `<main>`: Locations, Branding vs. Headshots, Portfolio y
  Contact.
- Footer y rutas `ready/index` tampoco enlazan los dos artículos draft. Newborn
  conserva el copy relacionado aprobado y pierde únicamente el enlace.

### Publicación y regresión

- Estado canónico: `ready/index`, `lastModified: 2026-08-11`, canonical `www`,
  sin header release noindex y con membresía única en sitemap y `llms.txt`.
- La ruta emite un `CollectionPage` y un `BreadcrumbList` Home → Journal; no se
  convierte en `Article`, `Service`, lista de ofertas ni schema de reseñas.
- Release valida 21/21 rutas con 12 URLs en sitemap y 11 entradas en `llms.txt`.
  Staging valida 21/21, mantiene sitemap vacío y noindex global.
- Playwright aprobó Journal en 1440/1200/900/390 sin overflow, imágenes rotas ni
  errores runtime. La suite Newborn volvió a pasar en los cuatro anchos después
  de retirar su enlace draft; la revisión independiente dio `PASS` sin P1/P2.

## 20. ADDENDUM DE RUTA — REVIEWS / WORDS BECOME PICTURES

Este addendum fija el rediseño y publicación de `/reviews/`. La referencia
externa gobierna geometría y ritmo —hero fotográfico, seam, prints, arco y
capítulos inmersivos—, pero no aporta marca, colores, sujetos ni textos. La
ruta permanece dentro del lenguaje earth-and-gold de It's A Keeper Photography.

### Dirección canónica

- Comp C / Impeccable,
  `.impeccable/mocks/reviews-c-at-ease-purpose.png`, es la dirección canónica:
  `Words Become Pictures / At Ease, on Purpose`, seed `c2ad8044`.
- Las comps A `Words Kept` y B `Comfort Quote` quedan como alternativas
  auditadas no seleccionadas. C articula mejor la promesa principal: primero la
  comodidad deliberada, después diez testimonios como prueba y finalmente las
  fotografías que respaldan esas palabras.
- El mundo propio usa marfil, umber, oliva y arena; fotografía real, mats
  cuadrados, un solo arco, print superpuesto, seam rasgado y script restringida.
  No usa gradientes, glass, badges, grids de testimonial cards ni sombras
  decorativas genéricas.

### Secuencia y geometría

1. **Hero compartido:** `EditorialHero` idéntico al sistema de Seniors, Family
   y Newborn, con fondo B/N, dos prints inferiores, copy centrado y botón local
   `Read their stories`. Ocupa exactamente el viewport restante: 882 px a
   1440×1000, 782 px a 1200×900, 688 px a 900×900 y 656 px a 390×844.
2. **At Ease, on Purpose:** superficie marfil, retrato familiar en arco y print
   B/N superpuesto, sin la intersección de reglas del primer pase. La prosa
   explica que la comodidad es un método deliberado, no una promesa ornamental.
3. **What Tri-Cities Clients Remember:** reutiliza `KindWords.astro`: clothesline,
   clips físicos, diez fotografías, reverso legible por hover/foco/tap y resumen
   social estático. Reviews añade debajo un CTA externo `Leave us a review` con
   relleno de papel y flecha animados; Homepage no recibe ese CTA.
4. **The Photographs Behind the Words:** capítulo oliva con el libro canónico de
   seis páginas de Portfolio. Sus hojas rígidas usan el giro 3D nativo desde la
   esquina inferior; Reviews carga todas sus fotos lazy y Portfolio conserva la
   primera página eager/high.
5. **Leave the Nerves at Home:** fotografía familiar B/N full-bleed, copy corto
   y único anchor de la ruta hacia Contact.

### Componentes, interacción y responsive

- `ReviewsPage.astro` se resuelve en SSR y refresh Tina; `reviews-page.css` se
  enlaza solo en `/reviews/` mediante `?url`.
- `JournalBook.astro` es el componente compartido; cada instancia tiene IDs,
  ARIA y memoria de página independientes. Cada hoja declara densidad `hard` y
  PageFlip usa 1200 ms, sombra máxima `0.50` y esquina inferior, produciendo
  caras `matrix3d`/`rotateY`. El flip se hidrata al entrar en viewport y pasa a
  crossfade con instrucciones específicas bajo reduced motion.
- Contrato semántico exacto: 1 H1, 4 H2, 6 H3, diez testimonios originales,
  seis páginas de libro y dos anchors dentro de `<main>`: Google externo seguro
  y Contact interno. Hero y libro usan botones; el resumen KindWords no se
  enlaza a sí mismo.
- A 900 px se conserva la composición en dos columnas donde existe espacio; a
  390 px arco/copy se apilan, el clothesline mantiene scroll horizontal y el
  libro presenta una página. Ningún título se recorta, el body permanece
  ≥17.28 px, los controles ≥44 px y el overflow horizontal es cero.

### Media, publicación y QA

- Toda fotografía proviene de `public/uploads/`; ninguna región image-native
  usa un recorte de la comp generada. Papeles, seam, mats, wire, libro y
  controles permanecen HTML/CSS/SVG. El print pequeño de At Ease se desatura
  con CSS para conservar el rol monocromo de la dirección.
- La ruta usa `ready/index`, `lastModified: 2026-08-12`, canonical `www`, sin
  header release noindex y con membresía única en sitemap/`llms.txt`. Emite
  `WebPage` y `BreadcrumbList`; no emite `Review` ni `AggregateRating` sin URL,
  fecha, rating y fuente individual verificables.
- Staging y release validan 21/21 rutas. Release contiene 13 URLs en sitemap y
  12 entradas en `llms.txt`. Playwright pasa 1920×963, 1440×1000, 1200×900,
  900×900 y 390×844, además de teclado, giro 3D, reduced motion, imágenes,
  consola/red, tipografía y regresión de Portfolio. El gap CTA→Journal queda en
  184/172.8/148/144/144 px y el resumen logra 4.61:1. El detector de los
  archivos propios devuelve `[]`. Las 30 instancias de imagen del archive
  —diez originales y dos juegos clonados— deben tener `currentSrc`, estar
  completas y decodificar a ancho natural positivo tras entrar en viewport;
  Homepage conserva el resumen enlazado y cero CTAs Google. La revisión
  independiente original finalizó
  con `disposition: ship`, `ceiling: reached` y ningún fix material.
