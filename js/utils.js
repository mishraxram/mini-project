// escapeHTML, validation
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
