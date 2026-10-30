# NOTES — WebCraft

## Wizard engine
- What: one engine in app.js draws all 12 steps from the steps array in steps.js.
- Why: data-driven, so adding a step means adding one object, not new code.
- XSS defence: user text goes in with textContent, never innerHTML.
- Next is blocked unless validate() passes for every field on the step.

## Themes, layouts, templates
- What: 10 themes (data) x 3 layouts (functions) = 30 templates, built by one loop in templates.js.
- Why: adding one theme adds 3 templates with no new code; every user value goes through escapeHTML, links must be http(s).

## WebCraft name
- What: APP_NAME, APP_TAGLINE, APP_KEY live only in utils.js; index.html fills title, header, footer from them.
- Why: rename in one place; generated sites do not carry the WebCraft name by default.

## Template gallery (step 3)
- What: gallery.js shows all templates as live, scaled-down, sandboxed iframe thumbnails with a layout filter, search and a Random button.
- Why: the user sees the real site before picking; filters only hide tiles, so thumbnails are built once per step view.

## Live preview
- What: preview.js shows buildSite(state) in an iframe beside the wizard, refreshed 200ms after typing stops, at Desktop / Tablet / Mobile width scaled to fit.
- Why: the user sees every answer on the real site at once; buildSite() also applies step 4 color/font choices and will be reused by Download.

## Download
- What: export.js saves buildSite(state) as one .html file, or a ZIP (index.html + style.css + README.txt) made with the local jszip copy in js/lib/.
- Why: works offline with no server; file name comes from the site name; the ZIP has hosting steps but no WebCraft branding.

## Auto-save and project file
- What: every change is saved to localStorage (webcraft_state); Save/Open project file writes and reads webcraft-project.json; Start over clears it after two clicks.
- Why: a refresh never loses work; applySaved() only copies known fields with the right type, so a hand-edited file cannot break the app.

## Undo / Redo
- What: history.js keeps up to 50 JSON snapshots of state, taken 400ms after a change; Undo/Redo buttons and Ctrl+Z / Ctrl+Y move between them.
- Why: snapshots are simple to explain and restore through applySaved(), the same safe path as project import.

## Split and Magazine layouts (50 templates)
- What: two more layouts (split: uneven 7/5 columns; magazine: masthead, huge uppercase headline, numbered sections); shared parts moved to parts.js.
- Why: 5 layouts x 10 themes = 50 templates as CLAUDE.md asks; parts.js keeps each file under 200 lines.

## Publish (local server)
- What: npm start runs server.js (Express, 127.0.0.1:3000); POST /publish saves sites/<name>/index.html, served at localhost:3000/<name>/.
- Why: shows real hosting on one computer; names allow only a-z 0-9 -, and only the builder's css/js/fonts are served, never server.js or .git.

## "Made with WebCraft" credit
- What: a checkbox on the review step (state.madeWith, default false) adds "Made with" + APP_NAME to the generated footer.
- Why: the user's site carries no app branding unless they choose it (CLAUDE.md Section 6).

## Logo upload
- What: step 11 has a file picker (upload.js) for PNG/JPG/SVG/WebP up to 500 KB, stored as a base64 data URL in state.logo and shown in every layout's header.
- Why: works offline and stays inside the single HTML file; parts.js only uses the logo if it matches a strict image data URL pattern.

## Generated site extras
- What: every site now has og: tags and theme-color, a sticky header, a floating WhatsApp button (when a number is given), smooth scroll (off for reduced motion), and the cards section id follows its heading.
- Why: better sharing and SEO, contact in one tap, and menu links like "Projects" now land on the right section.

## Accessibility check
- What: a11y.js reads the finished site with DOMParser on the review step and lists images without alt text, links without text, low contrast (WCAG 4.5:1), a missing headline and a missing description.
- Why: the user sees problems before downloading; contrast uses the same formula browsers and WCAG use.
