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

// ---- Save / load ----
const SAVE_KEY = APP_KEY + "_state";

// Auto-save answers and the current step. Storage can be full or blocked, so errors are ignored.
function saveState() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ state: state, step: current }));
  } catch (e) {
    // the app still works, it just will not remember answers after a refresh
  }
}

// Load the auto-save on start. A missing or broken save means a fresh start.
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (saved && applySaved(saved.state)) current = Math.min(Math.max(0, saved.step | 0), STEPS.length - 1);
  } catch (e) {
    // start fresh
  }
}

function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* nothing saved */ }
}

// Copy saved answers into state: only fields state already has, with the same type.
// Saved files can be edited by hand, so anything unknown or wrong is skipped.
function applySaved(saved) {
  if (!saved || typeof saved !== "object") return false;
  Object.keys(state).forEach(key => {
    const value = saved[key];
    if (key === "menuItems" && Array.isArray(value)) {
      state.menuItems = value.filter(item => typeof item === "string").slice(0, 6);
    } else if (key === "cards" && Array.isArray(value)) {
      state.cards = value.filter(card => card && typeof card.title === "string" && typeof card.detail === "string")
        .map(card => ({ title: card.title, detail: card.detail })).slice(0, 6);
    } else if (typeof state[key] === "object" && !Array.isArray(state[key]) && value && typeof value === "object") {
      Object.keys(state[key]).forEach(k => { if (typeof value[k] === "string") state[key][k] = value[k]; });
    } else if (typeof state[key] === "string" && typeof value === "string") {
      state[key] = value;
    }
  });
  return true;
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
