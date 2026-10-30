# TESTS — WebCraft

| # | Input | Expected | Actual | Pass/Fail |
|---|-------|----------|--------|-----------|
| 1 | Empty site name, press Next | Error text under field, Next blocked | "This field is required.", stayed on 01 / 12 | Pass |
| 2 | Headline `<script>alert(1)</script>` | Shown as plain text, no script runs | Plain text in review step and in all 30 templates, 0 script tags | Pass |
| 3 | 300-char text in a field | Stopped at max length, error shown | Box stops at maxLength (40 for site name); validate() returns "Keep it under 40 characters." for imported long text | Pass |
| 4 | Image over 500 KB | Photo is shrunk to max 1200px WebP and saved under 500 KB; files over 5 MB (photos) or 500 KB (SVG) are rejected with error text | 4000x3000 photo saved as 13 KB WebP; 6 MB file: "This image is 6144 KB. The limit is 5120 KB." | Pass |
| 5 | Refresh mid-way (step 5) | Answers restored from localStorage | Back on 05 / 12, name, template and menu kept | Pass |
| 6 | Each of the 5 layouts | Preview and download render correctly | All 50 templates build; split and magazine: no overflow at 320-1200px; XSS sample escaped | Pass |
| 7 | Run in Chrome | All steps work | Went 01 to 12, no console errors | Pass |
| 8 | Run in Edge | All steps work | | |
| 9 | Mobile size (375px) | No horizontal scroll, menu works | Builder: no overflow on all 12 steps at the narrowest window Chrome allowed (500px); all 50 sites: no overflow at 320 and 375px | Pass |
| 10 | Publish with name `../bad` | Server rejects, error shown | 400 "Site name can only use a-z, 0-9 and -"; also `a/b`, `\`, `BAD`, `js`, empty, 41 chars rejected | Pass |
| 11 | Social link `javascript:alert(1)` | Link dropped from footer | Not in any of 30 templates | Pass |
| 12 | All 30 templates at 320, 375, 768, 1200px | No horizontal scroll | First run: mustard overflowed at 375px (long mono word). Fixed with overflow-wrap. Re-run: none | Pass |
| 13 | Step 3, press Next with no template | Error, stays on 03 / 12 | "This field is required.", stayed | Pass |
| 14 | Gallery: Sidebar filter + search "night", then "zzz" | 10, then 1, then 0 with empty message and Random disabled | 10 / 1 / 0, message shown, Random disabled | Pass |
| 15 | Gallery keyboard: Arrow key, Enter, then Back | Selection moves, Enter goes to 04, Back keeps the pick | classic-ink kept after Back | Pass |
| 16 | Type site name `Asha <b>Rao</b>` | Preview updates, shows tags as text | Updated in ~200ms, 0 `<b>` elements | Pass |
| 17 | Step 4: night + mono on sidebar-paper | Preview keeps sidebar layout, dark colors, mono headings | bg rgb(16,22,28), Courier New, aside kept | Pass |
| 18 | Preview Desktop / Mobile toggle | 1280px scaled to fit; 375px centered at full size | scale 0.39; 375px scale 1 centered | Pass |
| 19 | Builder at narrow window (500px) | Preview stacks under wizard, no horizontal scroll | Stacked, no overflow (first run overflowed, fixed with minmax) | Pass |
| 20 | Download HTML, name `Asha <Rao>` | File `asha-rao.html`, opens offline, no script tags | asha-rao.html, 0 script tags, 1 style block | Pass |
| 21 | Download ZIP | index.html + style.css + README.txt, index links style.css | All 3 files, link present, no WebCraft name | Pass |
| 22 | About text `</style><style>body{display:none}` | Shown as text, page still visible | Escaped, only one real style block | Pass |
| 23 | Save project file, then Open it | webcraft-project.json; opening goes to review with all answers | Name and template restored, step 12 | Pass |
| 24 | Open a non-JSON file / JSON from another app | Error text under header, answers unchanged | "This is not a valid project file." / "This file is not a WebCraft project." | Pass |
| 25 | Open a hand-edited file (wrong types, unknown keys, `__proto__`, bad themeId) | Bad fields skipped, no crash | Skipped, no pollution, preview still builds | Pass |
| 26 | Start over: one click, then two clicks | One click only asks; two clicks clear everything | Back to 01 / 12, empty answers | Pass |
| 27 | Type "Asha", pause, type " Rao", Undo twice, Redo | "Asha", then empty, then "Asha" | Matches; Undo disabled at start | Pass |
| 28 | Remove a menu item, Undo, then Ctrl+Y outside a text box | Item comes back, then is removed again | Matches | Pass |
| 29 | Undo, then make a new change | Redo becomes disabled | Disabled | Pass |
| 30 | Menu and card list inputs | Every input has a name and a screen-reader label, no Chrome form warning | names like f-cards-0-title, 0 unnamed fields, no console issue | Pass |
| 31 | Publish from http://localhost:3000 | Saved to sites/asha-rao, link opens the site | Link http://localhost:3000/asha-rao/, `<script>` escaped | Pass |
| 32 | Ask the server for /server.js, /.git/config, /node_modules/..., /%2e%2e/server.js | 404, nothing private served | All 404 | Pass |
| 33 | Publish with server stopped / builder opened as file | Clear error text, no alert | "The local server is not running..." / "Publish needs the local server..." | Pass |
| 34 | "Made with WebCraft" checkbox on review | Off by default; ticking adds it to footer; undo and auto-save work; non-boolean import ignored | Off, footer shows credit when ticked, undo clears, "yes" ignored | Pass |
| 35 | Upload a .txt as logo | Rejected with error text | "Use a PNG, JPG, SVG or WebP image." | Pass |
| 36 | Upload a small PNG logo | Shows in step, in site header with alt text, review says "Image added" | All three | Pass |
| 37 | SVG logo with a `<script>` inside; imported logo `javascript:` or with `" onerror=` | Script never runs; bad logos not put in the site | Did not run; both dropped | Pass |
| 38 | Generated site head and extras (all 50 templates) | og:title / og:description / theme-color present; WhatsApp button links wa.me/<digits>; header stays at top on scroll | All 50 pass | Pass |
| 39 | Every menu link `#...` in all 50 templates (menu Home/About/Projects/Contact) | Each link has a matching section id | 0 broken links (first run: Projects pointed to missing #projects, fixed) | Pass |
| 40 | Review step accessibility check | Clean site: "No problems found."; empty description and low-contrast colors are listed | Clean: no problems; empty description listed; test theme flagged 4 contrast issues; all 10 real themes pass | Pass |
| 41 | "Made with" checkbox size | Normal small checkbox | 13px wide (was stretched to full width, CSS fixed) | Pass |
| 42 | Pick "restaurant" on step 2 | Menu becomes Home, Menu, About, Contact; steps 6-8 show restaurant example hints; hints not in the site | All as expected | Pass |
| 43 | Change site type after editing the menu by hand | Hand-made menu is kept | Kept ["Start","Food"] | Pass |
| 44 | Builder fonts with internet off (file://) | Fraunces, DM Sans, JetBrains Mono load from /fonts | document.fonts: Fraunces 700, DM Sans 400, JetBrains Mono 400 loaded; no network font URLs | Pass |
| 45 | Images on steps 1, 6, 7, 8 (logo, hero, about, each card) | Each shows in the step with Remove, and in the site in every layout; no overflow at 1280 / 375px | All shown; 5 layouts no overflow | Pass |
| 46 | No logo uploaded | Site header shows the initials ("Dosa Corner" -> DC) | "DC" monogram | Pass |
| 47 | Card image with `" onerror=` in an imported file | Not put in the site | Dropped | Pass |
