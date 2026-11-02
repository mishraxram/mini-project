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

// Small label above the headline, also chosen by site type (fixed text, no user input)
const KICKERS = { portfolio: "Selected work", business: "Open for business", blog: "Journal", event: "Save the date",
  restaurant: "Kitchen and dining", student: "Student portfolio" };

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
  const kicker = KICKERS[state.siteType] ? `<p class="kicker">${KICKERS[state.siteType]}</p>` : "";
  return `<section id="home" class="hero">${kicker}
<h1>${escapeHTML(state.heroTitle || state.siteName)}</h1>
${state.heroText ? `<p>${escapeHTML(state.heroText)}</p>` : ""}
${hasContact ? `<a class="btn" href="#contact">Get in touch ${ARROW_SVG}</a>` : ""}
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
  // the email is shown large (class "email"), the other rows are normal size
  if (c.email) rows.push(`<li class="email"><a href="mailto:${escapeHTML(c.email)}">${escapeHTML(c.email)}</a></li>`);
  if (c.phone) rows.push(`<li><a href="tel:${c.phone.replace(/[^0-9+]/g, "")}">${escapeHTML(c.phone)}</a></li>`);
  if (c.whatsapp) rows.push(`<li><a href="https://wa.me/${c.whatsapp.replace(/[^0-9]/g, "")}">WhatsApp</a></li>`);
  if (c.address) rows.push(`<li>${escapeHTML(c.address)}</li>`);
  if (!rows.length) return "";
  return `<section id="contact"><h2>Contact</h2><ul class="contact">${rows.join("")}</ul></section>`;
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
  return `<footer><p>${escapeHTML(state.footer || state.siteName)}</p>${madeWith}${links ? `<nav class="social">${links}</nav>` : ""}<a class="to-top" href="#home">Back to top</a></footer>`;
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
${SITE_CSS}
${css}
</style></head>
<body>${body}${whatsappHTML(state)}
<button class="mode-btn" type="button" aria-pressed="false">${theme.dark ? "Light mode" : "Dark mode"}</button>
${MENU_SCRIPT}${MODE_SCRIPT}${REVEAL_SCRIPT}</body></html>`;
}

