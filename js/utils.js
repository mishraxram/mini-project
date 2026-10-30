// escapeHTML, validation, small helpers

// App name lives only here. APP_KEY prefixes localStorage keys and export file names.
const APP_NAME = "WebCraft";
const APP_TAGLINE = "12 steps. One website. No AI.";
const APP_KEY = "webcraft";

// Read or write a value by path, like "contact.email".
// state lives in app.js; it exists by the time these run.
function getValue(path) {
  return path.split(".").reduce((obj, key) => obj[key], state);
}
function setValue(path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  keys.reduce((obj, key) => obj[key], state)[last] = value;
}

// Small helper to make an element. Text goes in with textContent, so it is never run as HTML.
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Check one input's value. Returns an error message, or "" if it is fine.
function validate(step, value) {
  // list: check the item count, then check every text inside it
  if (Array.isArray(value)) {
    const texts = value.flatMap(item => typeof item === "object" ? Object.values(item) : [item]);
    if (step.required && !texts.some(t => t.trim())) return "Add at least one item.";
    if (step.maxItems && value.length > step.maxItems) return "You can add up to " + step.maxItems + " items.";
    for (const t of texts) {
      const error = validate({ maxLength: step.maxLength }, t);
      if (error) return error;
    }
    return "";
  }

  const text = String(value || "").trim();
  if (!text) return step.required ? "This field is required." : "";
  if (step.maxLength && text.length > step.maxLength) return "Keep it under " + step.maxLength + " characters.";
  if (step.check === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return "Enter a valid email, like name@example.com.";
  if (step.check === "phone" && !/^\+?[0-9 -]{7,15}$/.test(text)) return "Enter a valid phone number: digits, spaces or -, 7 to 15 long.";
  return "";
}
