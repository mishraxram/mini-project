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

// Only a real base64 image data URL is used. An imported project file could hold anything else.
function safeImage(src) {
  return typeof src === "string" && /^data:image\/(png|jpeg|svg\+xml|webp);base64,[A-Za-z0-9+/=]+$/.test(src) ? src : "";
}

// <img> for an uploaded image, or "" when there is none
function imgHTML(src, alt, className) {
  return safeImage(src) ? `<img class="${className}" src="${src}" alt="${escapeHTML(alt)}">` : "";
}

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
${imgHTML(state.heroImage, state.heroTitle || state.siteName, "hero-img")}
</section>`;
}

function aboutHTML(state) {
  const photo = imgHTML(state.aboutImage, "About " + state.siteName, "about-img");
  if (!state.about.trim() && !photo) return "";
  return `<section id="about"><h2>About</h2>${photo}<p>${escapeHTML(state.about)}</p></section>`;
}

function cardsHTML(state) {
  const cards = state.cards.filter(card => card.title.trim() || card.detail.trim() || safeImage(card.image));
  if (!cards.length) return "";
  const items = cards.map(card =>
    `<li>${imgHTML(card.image, card.title, "card-img")}<h3>${escapeHTML(card.title)}</h3><p>${escapeHTML(card.detail)}</p></li>`).join("");
  const heading = CARD_HEADINGS[state.siteType] || "Work";
  // id matches the heading ("projects"), so a menu item with the same name jumps here
  return `<section id="${slug(heading)}" class="work"><h2>${heading}</h2><ol class="cards">${items}</ol></section>`;
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

// Logo: the uploaded one, or a small square with the site's initials ("Dosa Corner" -> "DC")
function logoHTML(state) {
  if (safeImage(state.logo)) return imgHTML(state.logo, state.siteName + " logo", "logo");
  const initials = state.siteName.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join("").toUpperCase();
  return initials ? `<span class="logo monogram" aria-hidden="true">${escapeHTML(initials)}</span>` : "";
}

function footerHTML(state) {
  const links = Object.keys(state.social).filter(key => safeUrl(state.social[key]))
    .map(key => `<a href="${safeUrl(state.social[key])}">${key}</a>`).join("");
  const madeWith = state.madeWith ? `<p>Made with ${escapeHTML(APP_NAME)}</p>` : "";
  return `<footer><p>${escapeHTML(state.footer || state.siteName)}</p>${madeWith}${links ? `<nav class="social">${links}</nav>` : ""}</footer>`;
}

// Wraps a layout's body and CSS into a full page. Theme values become CSS variables.
// Which embedded font files each family needs (data is in fontdata.js)
const FONT_FILES = {
  "Fraunces": [["fraunces-400", 400], ["fraunces-700", 700]],
  "DM Sans": [["dm-sans-400", 400], ["dm-sans-700", 700]],
  "JetBrains Mono": [["jetbrains-mono-400", 400]]
};

// @font-face rules for only the families this theme uses, with the font inside the page as base64
function fontFaceCSS(theme) {
  return Object.keys(FONT_FILES).filter(family => (theme.headingFont + theme.bodyFont).includes(family))
    .flatMap(family => FONT_FILES[family].map(([file, weight]) =>
      `@font-face { font-family: "${family}"; src: url(data:font/woff2;base64,${FONT_DATA[file]}) format("woff2"); font-weight: ${weight}; font-display: swap; }`))
    .join("\n");
}

// Floating WhatsApp button, only when a number was given
function whatsappHTML(state) {
  const number = state.contact.whatsapp.replace(/[^0-9]/g, "");
  return number ? `<a class="wa" href="https://wa.me/${number}">WhatsApp</a>` : "";
}

// CSS variables for one set of theme colors
function colorVars(c) {
  return `--bg: ${c.bg}; --text: ${c.text}; --muted: ${c.muted}; --accent: ${c.accent}; --on-accent: ${c.onAccent}; --line: ${c.line};`;
}

function page(state, theme, css, body) {
  const c = theme.colors;
  // The mode button swaps a light theme to Ink colors and a dark theme to Paper colors
  const other = THEMES.find(t => t.id === (theme.dark ? "paper" : "ink")).colors;
  const title = escapeHTML(state.seo.title || state.siteName || "My site");
  const description = escapeHTML(state.seo.description);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta name="theme-color" content="${c.bg}">
<style>
${fontFaceCSS(theme)}
:root { ${colorVars(c)}
  --head: ${theme.headingFont}; --body: ${theme.bodyFont}; --r: ${theme.radius}px; --s: ${theme.spacing}px; }
html.other-mode { ${colorVars(other)} }
* { box-sizing: border-box; margin: 0; }
body { background: var(--bg); color: var(--text); font-family: var(--body); overflow-wrap: anywhere; }
h1, h2, h3, header strong, aside strong { font-family: var(--head); }
h1, h2, h3 { text-wrap: balance; }
h1 { letter-spacing: -0.02em; }
p { max-width: 68ch; }
a { color: var(--accent); text-decoration-thickness: 1px; text-underline-offset: 0.2em; }
header nav a:hover, aside nav a:hover { color: var(--accent); }
::selection { background: var(--accent); color: var(--on-accent); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.btn { display: inline-block; background: var(--accent); color: var(--on-accent); text-decoration: none;
  padding: calc(var(--s) * 0.75) calc(var(--s) * 1.5); border-radius: var(--r); }
.contact { list-style: none; padding: 0; }
.logo { height: 1.5em; width: auto; vertical-align: middle; margin-right: 0.5em; }
.monogram { display: inline-grid; place-items: center; width: 1.9em; height: 1.9em; background: var(--accent); color: var(--on-accent);
  font-family: var(--head); font-size: 0.85em; font-weight: bold; letter-spacing: 0; border-radius: min(var(--r), 8px); }
/* uploaded images: cropped to a fixed shape so every site looks tidy */
.hero-img, .about-img, .card-img { display: block; width: 100%; height: auto; object-fit: cover; border-radius: min(var(--r), 12px); }
.hero-img { aspect-ratio: 16 / 9; margin-top: calc(var(--s) * 2); }
.about-img { aspect-ratio: 4 / 3; max-width: 28rem; margin-bottom: var(--s); }
.card-img { aspect-ratio: 4 / 3; margin-bottom: var(--s); }
/* header stays on top while scrolling; sections stop below it when a menu link is clicked */
header { position: sticky; top: 0; z-index: 1; background: var(--bg); }
section { scroll-margin-top: 5rem; }
.wa { position: fixed; right: 16px; bottom: 16px; z-index: 2; background: var(--accent); color: var(--on-accent);
  padding: 10px 16px; border-radius: min(var(--r), 24px); text-decoration: none; font-weight: bold; }
@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }
/* small screens: the menu hides behind a "Menu" button (the button is added by MENU_SCRIPT) */
.menu-btn { display: none; font: inherit; font-size: 0.875rem; background: none; color: var(--text); cursor: pointer;
  border: 1px solid var(--line); border-radius: min(var(--r), 8px); padding: 4px 12px; }
@media (max-width: 600px) {
  .menu-btn { display: inline-block; }
  .menu-btn + nav { display: none; flex-basis: 100%; }
  .menu-btn + nav.open { display: block; }
  .menu-btn + nav a { display: block; margin: 0; padding: 8px 0; }
}
.mode-btn { position: fixed; left: 16px; bottom: 16px; z-index: 2; font: inherit; font-size: 0.875rem; cursor: pointer;
  background: var(--bg); color: var(--text); border: 1px solid var(--line); border-radius: min(var(--r), 24px); padding: 8px 14px; }
${css}
</style></head>
<body>${body}${whatsappHTML(state)}
<button class="mode-btn" type="button" aria-pressed="false">${theme.dark ? "Light mode" : "Dark mode"}</button>
${MENU_SCRIPT}${MODE_SCRIPT}</body></html>`;
}

// Fixed script: the mode button switches colors and remembers the choice in this browser.
// The key includes the page path, so two published sites do not share one choice.
// try/catch because some browsers block storage for files opened from disk.
const MODE_SCRIPT = `<script>
const modeButton = document.querySelector(".mode-btn");
const setMode = on => { document.documentElement.classList.toggle("other-mode", on); modeButton.setAttribute("aria-pressed", on); };
try { setMode(localStorage.getItem("site-mode:" + location.pathname) === "other"); } catch (e) {}
modeButton.onclick = () => {
  const on = !document.documentElement.classList.contains("other-mode");
  setMode(on);
  try { localStorage.setItem("site-mode:" + location.pathname, on ? "other" : "normal"); } catch (e) {}
};
</script>`;

// Fixed script (no user text inside). Without JavaScript the menu simply stays open.
const MENU_SCRIPT = `<script>
const menu = document.querySelector("header nav, aside nav");
if (menu && menu.children.length) {
  const button = document.createElement("button");
  button.className = "menu-btn";
  button.textContent = "Menu";
  button.setAttribute("aria-expanded", "false");
  menu.id = "site-menu";
  button.setAttribute("aria-controls", "site-menu");
  menu.before(button);
  const setOpen = open => { menu.classList.toggle("open", open); button.setAttribute("aria-expanded", open); };
  button.onclick = () => setOpen(!menu.classList.contains("open"));
  menu.onclick = event => { if (event.target.closest("a")) setOpen(false); };
}
</script>`;

