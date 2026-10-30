# TESTS — WebCraft

| # | Input | Expected | Actual | Pass/Fail |
|---|-------|----------|--------|-----------|
| 1 | Empty site name, press Next | Error text under field, Next blocked | "This field is required.", stayed on 01 / 12 | Pass |
| 2 | Headline `<script>alert(1)</script>` | Shown as plain text, no script runs | Plain text in review step and in all 30 templates, 0 script tags | Pass |
| 3 | 300-char text in a field | Stopped at max length, error shown | | |
| 4 | Image over 500 KB | Rejected with error text | | |
| 5 | Refresh mid-way (step 6) | Answers restored from localStorage | | |
| 6 | Each of the 5 layouts | Preview and download render correctly | | |
| 7 | Run in Chrome | All steps work | Went 01 to 12, no console errors | Pass |
| 8 | Run in Edge | All steps work | | |
| 9 | Mobile size (375px) | No horizontal scroll, menu works | | |
| 10 | Publish with name `../bad` | Server rejects, error shown | | |
| 11 | Social link `javascript:alert(1)` | Link dropped from footer | Not in any of 30 templates | Pass |
| 12 | All 30 templates at 320, 375, 768, 1200px | No horizontal scroll | First run: mustard overflowed at 375px (long mono word). Fixed with overflow-wrap. Re-run: none | Pass |
| 13 | Step 3, press Next with no template | Error, stays on 03 / 12 | "This field is required.", stayed | Pass |
| 14 | Gallery: Sidebar filter + search "night", then "zzz" | 10, then 1, then 0 with empty message and Random disabled | 10 / 1 / 0, message shown, Random disabled | Pass |
| 15 | Gallery keyboard: Arrow key, Enter, then Back | Selection moves, Enter goes to 04, Back keeps the pick | classic-ink kept after Back | Pass |
| 16 | Type site name `Asha <b>Rao</b>` | Preview updates, shows tags as text | Updated in ~200ms, 0 `<b>` elements | Pass |
| 17 | Step 4: night + mono on sidebar-paper | Preview keeps sidebar layout, dark colors, mono headings | bg rgb(16,22,28), Courier New, aside kept | Pass |
| 18 | Preview Desktop / Mobile toggle | 1280px scaled to fit; 375px centered at full size | scale 0.39; 375px scale 1 centered | Pass |
| 19 | Builder at narrow window (500px) | Preview stacks under wizard, no horizontal scroll | Stacked, no overflow (first run overflowed, fixed with minmax) | Pass |
