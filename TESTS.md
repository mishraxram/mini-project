# TESTS — WebCraft

| # | Input | Expected | Actual | Pass/Fail |
|---|-------|----------|--------|-----------|
| 1 | Empty site name, press Next | Error text under field, Next blocked | "This field is required.", stayed on 01 / 12 | Pass |
| 2 | Headline `<script>alert(1)</script>` | Shown as plain text, no script runs | Plain text in review step and in all 30 templates, 0 script tags | Pass |
| 3 | 300-char text in a field | Stopped at max length, error shown | | |
| 4 | Image over 500 KB | Rejected with error text | | |
| 5 | Refresh mid-way (step 5) | Answers restored from localStorage | Back on 05 / 12, name, template and menu kept | Pass |
| 6 | Each of the 5 layouts | Preview and download render correctly | All 50 templates build; split and magazine: no overflow at 320-1200px; XSS sample escaped | Pass |
| 7 | Run in Chrome | All steps work | Went 01 to 12, no console errors | Pass |
| 8 | Run in Edge | All steps work | | |
| 9 | Mobile size (375px) | No horizontal scroll, menu works | | |
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
