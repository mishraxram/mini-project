// Parts shared by every layout: safe links, menu, sections, footer, and the page wrapper.
// Every user value goes through escapeHTML before it enters the string.

// Only allow http(s) links, so a "javascript:" link can never run.
function safeUrl(url) {
  return /^https?:\/\//i.test(url.trim()) ? escapeHTML(url.trim()) : "";
}

// "About Us" -> "about-us", used for menu anchors
function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Heading for the cards section changes with the site type
const CARD_HEADINGS = { portfolio: "Projects", business: "Services", blog: "Posts",
  event: "Schedule", restaurant: "Menu", student: "Projects" };

// ---- Parts shared by all layouts. Each layout styles them its own way. ----

function navHTML(state) {
  return state.menuItems.filter(item => item.trim())
    .map(item => `<a href="#${slug(item)}">${escapeHTML(item)}</a>`).join("");
}

function heroHTML(state) {
  const hasContact = Object.values(state.contact).some(value => value.trim());
  return `<section id="home" class="hero">
<h1>${escapeHTML(state.heroTitle || state.siteName)}</h1>
${state.heroText ? `<p>${escapeHTML(state.heroText)}</p>` : ""}
${hasContact ? `<a class="btn" href="#contact">Contact</a>` : ""}
</section>`;
}

function aboutHTML(state) {
  return state.about.trim() ? `<section id="about"><h2>About</h2><p>${escapeHTML(state.about)}</p></section>` : "";
}

function cardsHTML(state) {
  const cards = state.cards.filter(card => card.title.trim() || card.detail.trim());
  if (!cards.length) return "";
  const items = cards.map(card => `<li><h3>${escapeHTML(card.title)}</h3><p>${escapeHTML(card.detail)}</p></li>`).join("");
  return `<section id="work"><h2>${CARD_HEADINGS[state.siteType] || "Work"}</h2><ol class="cards">${items}</ol></section>`;
}

function contactHTML(state) {
  const c = state.contact;
  const rows = [];
  if (c.email) rows.push(`<a href="mailto:${escapeHTML(c.email)}">${escapeHTML(c.email)}</a>`);
  if (c.phone) rows.push(`<a href="tel:${c.phone.replace(/[^0-9+]/g, "")}">${escapeHTML(c.phone)}</a>`);
  if (c.whatsapp) rows.push(`<a href="https://wa.me/${c.whatsapp.replace(/[^0-9]/g, "")}">WhatsApp</a>`);
  if (c.address) rows.push(escapeHTML(c.address));
  if (!rows.length) return "";
  return `<section id="contact"><h2>Contact</h2><ul class="contact">${rows.map(row => `<li>${row}</li>`).join("")}</ul></section>`;
}

// Logo: only a real base64 image data URL is used. An imported project file could hold anything else.
function logoHTML(state) {
  const isImage = /^data:image\/(png|jpeg|svg\+xml|webp);base64,[A-Za-z0-9+/=]+$/.test(state.logo);
  return isImage ? `<img class="logo" src="${state.logo}" alt="${escapeHTML(state.siteName)} logo">` : "";
}

function footerHTML(state) {
  const links = Object.keys(state.social).filter(key => safeUrl(state.social[key]))
    .map(key => `<a href="${safeUrl(state.social[key])}">${key}</a>`).join("");
  const madeWith = state.madeWith ? `<p>Made with ${escapeHTML(APP_NAME)}</p>` : "";
  return `<footer><p>${escapeHTML(state.footer || state.siteName)}</p>${madeWith}${links ? `<nav class="social">${links}</nav>` : ""}</footer>`;
}

// Wraps a layout's body and CSS into a full page. Theme values become CSS variables.
function page(state, theme, css, body) {
  const c = theme.colors;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHTML(state.seo.title || state.siteName || "My site")}</title>
<meta name="description" content="${escapeHTML(state.seo.description)}">
<style>
:root { --bg: ${c.bg}; --text: ${c.text}; --muted: ${c.muted}; --accent: ${c.accent}; --on-accent: ${c.onAccent};
  --line: ${c.line}; --head: ${theme.headingFont}; --body: ${theme.bodyFont}; --r: ${theme.radius}px; --s: ${theme.spacing}px; }
* { box-sizing: border-box; margin: 0; }
body { background: var(--bg); color: var(--text); font-family: var(--body); overflow-wrap: anywhere; }
h1, h2, h3, header strong, aside strong { font-family: var(--head); }
a { color: var(--accent); }
.btn { display: inline-block; background: var(--accent); color: var(--on-accent); text-decoration: none;
  padding: calc(var(--s) * 0.75) calc(var(--s) * 1.5); border-radius: var(--r); }
.contact { list-style: none; padding: 0; }
.logo { height: 1.5em; width: auto; vertical-align: middle; margin-right: 0.5em; }
${css}
</style></head>
<body>${body}</body></html>`;
}

