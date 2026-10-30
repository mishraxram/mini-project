# TESTS

| # | Input | Expected | Actual | Pass/Fail |
|---|-------|----------|--------|-----------|
| 1 | Empty site name, press Next | Error text under field, Next blocked | | |
| 2 | Headline `<script>alert(1)</script>` | Shown as plain text, no script runs | | |
| 3 | 300-char text in a field | Stopped at max length, error shown | | |
| 4 | Image over 500 KB | Rejected with error text | | |
| 5 | Refresh mid-way (step 6) | Answers restored from localStorage | | |
| 6 | Each of the 5 layouts | Preview and download render correctly | | |
| 7 | Run in Chrome | All steps work | | |
| 8 | Run in Edge | All steps work | | |
| 9 | Mobile size (375px) | No horizontal scroll, menu works | | |
| 10 | Publish with name `../bad` | Server rejects, error shown | | |
