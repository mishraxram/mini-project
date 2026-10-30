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
