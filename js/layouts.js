// 3 layouts. Each one is a function (state, theme) => full HTML page as a string.
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

function footerHTML(state) {
  const links = Object.keys(state.social).filter(key => safeUrl(state.social[key]))
    .map(key => `<a href="${safeUrl(state.social[key])}">${key}</a>`).join("");
  return `<footer><p>${escapeHTML(state.footer || state.siteName)}</p>${links ? `<nav class="social">${links}</nav>` : ""}</footer>`;
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
${css}
</style></head>
<body>${body}</body></html>`;
}

// ---- Classic: top bar, big headline, cards in a grid. Large type, roomy. ----
function classicLayout(state, theme) {
  const css = `
body { font-size: 1.0625rem; line-height: 1.6; }
header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: var(--s);
  padding: var(--s) calc(var(--s) * 2); border-bottom: 1px solid var(--line); }
header strong { font-size: 1.25rem; }
header nav a { margin-left: var(--s); color: var(--text); text-decoration: none; }
main { max-width: 68rem; margin: 0 auto; padding: 0 calc(var(--s) * 2); }
section { padding: calc(var(--s) * 3) 0; border-top: 1px solid var(--line); }
.hero { padding: calc(var(--s) * 6) 0 calc(var(--s) * 4); max-width: 44rem; border-top: 0; }
.hero h1 { font-size: clamp(2.5rem, 6vw, 4rem); line-height: 1.05; }
.hero p { font-size: 1.25rem; color: var(--muted); margin: calc(var(--s) * 1.5) 0 calc(var(--s) * 2); }
h2 { font-size: 1.75rem; margin-bottom: calc(var(--s) * 1.5); }
.cards { list-style: none; padding: 0; display: grid; gap: calc(var(--s) * 1.5);
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); }
.cards li { border: 1px solid var(--line); border-radius: var(--r); padding: calc(var(--s) * 1.5); }
.cards h3 { font-size: 1.125rem; margin-bottom: calc(var(--s) * 0.5); }
.contact { line-height: 2; }
footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--s);
  padding: calc(var(--s) * 2); border-top: 1px solid var(--line); color: var(--muted); }
.social a { margin-left: var(--s); }`;
  return page(state, theme, css, `<header><strong>${escapeHTML(state.siteName)}</strong><nav>${navHTML(state)}</nav></header>
<main>${heroHTML(state)}${aboutHTML(state)}${cardsHTML(state)}${contactHTML(state)}</main>${footerHTML(state)}`);
}

// ---- Sidebar: fixed left column with name and menu. Medium type, tight rows. ----
function sidebarLayout(state, theme) {
  const css = `
body { font-size: 1rem; line-height: 1.7; display: grid; grid-template-columns: 16rem 1fr; min-height: 100vh; }
aside { padding: calc(var(--s) * 2); border-right: 1px solid var(--line); }
aside strong { display: block; font-size: 1.5rem; line-height: 1.1; margin-bottom: calc(var(--s) * 2); }
aside nav a { display: block; padding: calc(var(--s) * 0.25) 0; color: var(--text); text-decoration: none; }
main { padding: calc(var(--s) * 3); max-width: 48rem; }
section { margin-bottom: calc(var(--s) * 3); }
.hero h1 { font-size: 2.25rem; line-height: 1.15; }
.hero p { color: var(--muted); margin: var(--s) 0 calc(var(--s) * 1.5); }
h2 { font-family: var(--body); font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.12em;
  color: var(--muted); margin-bottom: var(--s); }
.cards { list-style: none; padding: 0; }
.cards li { display: grid; grid-template-columns: 12rem 1fr; gap: var(--s); padding: var(--s) 0;
  border-bottom: 1px solid var(--line); }
.cards h3 { font-size: 1rem; }
footer { grid-column: 1 / -1; padding: var(--s) calc(var(--s) * 2); border-top: 1px solid var(--line);
  font-size: 0.875rem; color: var(--muted); }
.social a { margin-right: var(--s); }
@media (max-width: 700px) {
  body { grid-template-columns: 1fr; }
  aside { border-right: 0; border-bottom: 1px solid var(--line); }
  .cards li { grid-template-columns: 1fr; }
}`;
  return page(state, theme, css, `<aside><strong>${escapeHTML(state.siteName)}</strong><nav>${navHTML(state)}</nav></aside>
<main>${heroHTML(state)}${aboutHTML(state)}${cardsHTML(state)}${contactHTML(state)}</main>${footerHTML(state)}`);
}

// ---- Minimal: one narrow column, small headline, big body text, lots of air. ----
function minimalLayout(state, theme) {
  const css = `
body { font-size: 1.125rem; line-height: 1.75; }
.wrap { max-width: 38rem; margin: 0 auto; padding: calc(var(--s) * 4) calc(var(--s) * 2); }
header { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--s);
  font-size: 0.875rem; margin-bottom: calc(var(--s) * 6); }
header nav a { margin-left: var(--s); color: var(--muted); }
.hero h1 { font-size: 1.75rem; line-height: 1.3; font-weight: normal; }
.hero p { color: var(--muted); margin: var(--s) 0 calc(var(--s) * 2); }
.btn { background: none; color: var(--accent); padding: 0; border-radius: 0; border-bottom: 1px solid var(--accent); }
section { margin-top: calc(var(--s) * 6); }
h2 { font-family: var(--body); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em;
  color: var(--muted); margin-bottom: calc(var(--s) * 2); }
.cards { padding-left: 1.25rem; }
.cards li { margin-bottom: calc(var(--s) * 1.5); }
.cards h3 { font-size: 1.125rem; font-weight: normal; font-style: italic; }
footer { max-width: 38rem; margin: 0 auto; padding: calc(var(--s) * 2); font-size: 0.875rem; color: var(--muted); }
.social a { margin-right: var(--s); }`;
  return page(state, theme, css, `<div class="wrap"><header><strong>${escapeHTML(state.siteName)}</strong><nav>${navHTML(state)}</nav></header>
<main>${heroHTML(state)}${aboutHTML(state)}${cardsHTML(state)}${contactHTML(state)}</main></div>${footerHTML(state)}`);
}

const LAYOUTS = [
  { id: "classic", name: "Classic", build: classicLayout },
  { id: "sidebar", name: "Sidebar", build: sidebarLayout },
  { id: "minimal", name: "Minimal", build: minimalLayout }
];
