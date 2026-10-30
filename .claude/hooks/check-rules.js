// check-rules.js - auto-runs after Claude edits a file
let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let f = "";
  try {
    const j = JSON.parse(raw);
    f = (j.tool_input && j.tool_input.file_path) || "";
  } catch (e) {
    process.exit(0);
  }
  if (!/\.(html|css|js)$/i.test(f)) process.exit(0);
  if (/check-rules\.js$/.test(f) || /setup-project\.js$/.test(f)) process.exit(0);
  const fs = require("fs");
  if (!fs.existsSync(f)) process.exit(0);
  const t = fs.readFileSync(f, "utf8");
  const problems = [];
  if (/gradient\(/i.test(t)) problems.push("Gradient found. Design rules: no gradients.");
  if (/backdrop-filter/i.test(t)) problems.push("Glass blur found. Not allowed.");
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(t)) problems.push("Emoji found. Use inline SVG icons.");
  if (/<script[^>]+src=["']https?:/i.test(t) || /<link[^>]+href=["']https?:/i.test(t)) problems.push("External CDN/link found. Project must work offline.");
  if (/fetch\(\s*["']https?:/i.test(t)) problems.push("External API call found. Not allowed.");
  if (/\.innerHTML\s*=/.test(t) && !/escapeHTML/.test(t)) problems.push("innerHTML used but escapeHTML is missing in this file.");
  if (problems.length) {
    console.error("RULE CHECK FAILED in " + f + ":\n- " + problems.join("\n- "));
    process.exit(2);
  }
});
