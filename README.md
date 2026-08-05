# It's A Keeper Photography - Astro + TinaCMS

Astro site for It's A Keeper Photography in Richland, Washington. The public
homepage is statically generated; TinaCMS provides git-backed content editing and
click-to-edit visual preview at `/admin`.

## What is implemented

- Astro 6 static homepage with the original layout, content flow, and interactions.
- TinaCMS collections for homepage content, testimonials, and business settings.
- Visual editing through `@tinacms/astro` and a single primary `TinaIsland`.
- On-demand `/tina-island/[name]` endpoint for preview updates on every editor change.
- Automatic Vercel, Netlify, or local Node adapter selection.
- Local fonts, local GSAP files, responsive image generation, SEO metadata, JSON-LD,
  `robots.txt`, `sitemap.xml`, `llms.txt`, and declarative WebMCP form annotations.

The Tina schema exposes content only. Colors, typography, spacing, and layout remain
in code so a content editor cannot accidentally redesign the site.

## Project map

```text
content/
  homepage/index.json
  settings/index.json
  testimonials/*.json
public/
  uploads/
  fonts/
  vendor/
  scripts/
scripts/
  optimize-images.mjs
  serve-dist.mjs
src/
  components/
  layouts/Base.astro
  lib/tina/
  pages/index.astro
  pages/tina-island/[name].ts
tina/
  config.ts
  queries/homepagePage.gql
  tina-lock.json
```

## Local development

```bash
npm install
npm run dev
```

- Site: `http://localhost:4321`
- Editor: `http://localhost:4321/admin`
- GraphQL playground: `http://localhost:4001/altair`

Local mode intentionally has no login. Tina writes directly to the JSON files on
your machine. Production authentication is supplied by TinaCloud.

### Visual feedback with Agentation

[Agentation](https://www.agentation.com/install) mounts automatically on every
page when the site runs through `npm run dev`. Use its desktop toolbar to point
at an element, attach feedback, and copy structured context for a coding agent.

The integration is injected by Astro only for the `dev` command. It is absent
from production builds, Netlify deploys, and `npm run preview:static`.

Real-time MCP syncing is optional and is not configured by this repository
because it changes each developer's agent configuration outside the project.

Other commands:

```bash
npm run build:local     # local Tina index + safe staging/noindex Astro build
npm run build           # uses SITE_MODE; requires TinaCloud variables
npm run preview:static  # serve an existing production build on port 4321
npm run audit:lighthouse # build locally, then serve production on port 4321
```

## Sitemap and indexing

`/sitemap.xml` is generated from `src/lib/page-manifest.ts`. Staging builds keep
the sitemap empty and globally noindex the site. Release builds include only
routes that are ready, explicitly indexable, and enabled for the sitemap; each
published entry also carries a validated `lastmod` date. See
[`STRUCTURE.md`](./STRUCTURE.md) for the complete route registry and publishing
checklist.

If Astro is launched by an agent or CI wrapper, set `ASTRO_DEV_BACKGROUND=0`.
If a killed Tina process leaves ports occupied, check ports `4001` and `9000`
before retrying.

## Why live editing did not work before

The components imported JSON files directly. That supports form-based editing and
saving, but it gives Tina no query metadata, editable island, or refresh endpoint.

The current implementation follows Tina's static Astro flow:

1. `src/pages/index.astro` executes the generated Tina query.
2. The page is wrapped in `<TinaIsland primary name="homepage">`.
3. `data-tina-field` markers connect visible elements to exact fields.
4. `/tina-island/[name]` is rendered on demand by the host adapter.
5. Tina posts unsaved editor data to that endpoint and swaps the returned HTML.

The public homepage remains static. Only the visual-editing refresh endpoint uses a
serverless function.

## Production login and permissions

Do not add a shared password to the code. Connect the site to TinaCloud and invite
the client as a **Project Editor**. TinaCloud then prompts authorized users for
their own credentials at `/admin`; Editors can change and save content but cannot
manage project settings or collaborators.

The `/admin` HTML and JavaScript are public static assets, which is normal. Access
to content editing and saving is protected by TinaCloud authentication and project
authorization. Adding a second Basic Auth wall in front of `/admin` is usually
unnecessary and can interrupt the OAuth redirect flow.

Production setup:

1. Commit and push this whole folder, including `tina/tina-lock.json`.
2. Create a project at `https://app.tina.io` and connect the GitHub repository.
3. Select the production branch, normally `main`.
4. Add the production origin and local origin to TinaCloud **Site URLs**.
5. Invite Lisa in the project's **Collaborators** tab with the **Editor** role.
6. Add the following variables to the deployment platform:

```dotenv
TINA_PUBLIC_CLIENT_ID=your_client_id
TINA_TOKEN=your_read_only_token
TINA_PUBLIC_BRANCH=main
NODE_VERSION=22
```

`TINA_PUBLIC_CLIENT_ID` is safe to embed in the admin bundle. `TINA_TOKEN` is
build-time only and must remain secret.

When an editor saves in production, TinaCloud commits the content change to GitHub.
That commit triggers a new Vercel or Netlify deployment. Unsaved changes still appear
immediately inside the visual editor.

## Deploy to Vercel

Import the GitHub repository and use:

| Setting | Value |
| --- | --- |
| Root Directory | `its-a-keeper-astro` |
| Framework Preset | Astro |
| Build Command | `npm run build` |
| Output Directory | leave automatic |

The `VERCEL` environment variable selects `@astrojs/vercel` automatically. The
verified build creates static assets plus a serverless route for
`/tina-island/[name]`.

## Deploy to Netlify

Create a site from the GitHub repository and use:

| Setting | Value |
| --- | --- |
| Base directory | `its-a-keeper-astro` |
| Build command | `npm run build` |
| Publish directory | `dist` |

The `NETLIFY` environment variable selects `@astrojs/netlify` automatically. The
verified build emits the static site and the required Netlify function.

Publication mode is context-controlled in `netlify.toml`:

| Netlify context | `SITE_MODE` | Search behavior |
| --- | --- | --- |
| Production | `release` | Ready/index routes may be indexed |
| Deploy Preview | `staging` | Global `noindex`; empty sitemap |
| Branch deploy | `staging` | Global `noindex`; empty sitemap |
| Netlify Dev | `staging` | Global `noindex`; empty sitemap |

The build fails if a Netlify production deploy is accidentally configured as
staging, or if a preview is configured as release. The public
apex domain and `itsakeeperphotography.netlify.app` hostname redirect to the
custom `www` primary domain; deploy-preview and immutable deploy hostnames
remain available for QA.

## Images and Lighthouse

`npm run build` generates width-specific WebP variants for images in
`public/uploads`. New Tina uploads therefore receive responsive files during the
next deployment. The current hero also has hand-cropped mobile and desktop variants
to preserve its exact focal point.

Latest local Lighthouse 13 checks on the compressed production build:

| Category | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 97-99 | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| Agentic Browsing | Pass | Pass |

Always run the performance audit against `npm run audit:lighthouse`, not
`npm run dev`. The development server injects Vite's unminified HMR client and
development CSS, so Lighthouse reports work that is never shipped in a deployment.
Once the command prints the preview URL, audit `http://localhost:4321/` in an
incognito window. Stop the preview with `Ctrl+C` before returning to the editor.

Lighthouse performance is a simulated lab result and can vary by run and hosting
TTFB. The remaining mobile point is LCP rounding; reducing the hero further caused
visible quality loss and was not retained. Re-run PageSpeed Insights after the first
production deployment because CDN behavior cannot be reproduced exactly on localhost.

Agentic Browsing is an experimental pass/fail style category rather than the same
weighted 0-100 model used by the four standard Lighthouse categories.

## Launch blocker outside this task

The guided inquiry still posts to the placeholder `/api/inquiry` and simulates
success in the browser. Connect it to a real form handler before launch.
