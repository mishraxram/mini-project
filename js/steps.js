// all wizard questions
// A step with one input uses "field". A step with several inputs lists them in "fields".
// "field" is a path into state, like "contact.email".
const STEPS = [
  { id: "name", title: "Site name", help: "Shown in the header and browser tab.",
    type: "text", field: "siteName", label: "Site name", required: true, maxLength: 40 },

  { id: "type", title: "Site type", help: "Pick what the site is for.",
    type: "mcq", field: "siteType", label: "Site type", required: true,
    options: ["portfolio", "business", "blog", "event", "restaurant", "student"] },

  // gallery: true draws thumbnails instead of plain radio buttons (see gallery.js)
  { id: "template", title: "Pick a template", help: "Filter by layout or search by theme name. You can change colors in the next step.",
    type: "mcq", field: "templateId", label: "Template", required: true, gallery: true,
    options: TEMPLATES.map(template => template.id) },

  { id: "theme", title: "Colors and font", help: "Optional. Leave as is to keep the template look.",
    fields: [
      { type: "mcq", field: "themeId", label: "Color theme", options: ["paper", "ink", "rust"] },
      { type: "mcq", field: "fontStyle", label: "Font style", options: ["serif", "sans", "mono"] }
    ] },

  { id: "menu", title: "Menu items", help: "Up to 6 links in the top menu.",
    type: "list", field: "menuItems", label: "Menu item", maxItems: 6, maxLength: 20 },

  { id: "hero", title: "Headline", help: "The first thing visitors read.",
    fields: [
      { type: "text", field: "heroTitle", label: "Headline", required: true, maxLength: 80 },
      { type: "text", field: "heroText", label: "Subtext", maxLength: 200 }
    ] },

  { id: "about", title: "About", help: "A short paragraph about you or the business.",
    type: "text", field: "about", label: "About text", multiline: true, maxLength: 600 },

  { id: "cards", title: "Services or projects", help: "Up to 6 cards. Each has a title and a detail.",
    type: "list", field: "cards", label: "Card", maxItems: 6, maxLength: 120, itemFields: ["title", "detail"] },

  { id: "contact", title: "Contact details", help: "Fill only what you want to show.",
    fields: [
      { type: "text", field: "contact.email", label: "Email", check: "email", maxLength: 80 },
      { type: "text", field: "contact.phone", label: "Phone", check: "phone", maxLength: 20 },
      { type: "text", field: "contact.whatsapp", label: "WhatsApp number", check: "phone", maxLength: 20 },
      { type: "text", field: "contact.address", label: "Address", maxLength: 150 }
    ] },

  { id: "footer", title: "Footer and social links", help: "Small text at the bottom and your profile links.",
    fields: [
      { type: "text", field: "footer", label: "Footer text", maxLength: 100 },
      { type: "text", field: "social.instagram", label: "Instagram link", maxLength: 100 },
      { type: "text", field: "social.linkedin", label: "LinkedIn link", maxLength: 100 },
      { type: "text", field: "social.github", label: "GitHub link", maxLength: 100 }
    ] },

  // logo upload comes later with the image feature
  { id: "seo", title: "Search engine info", help: "Shown in Google results and the browser tab.",
    fields: [
      { type: "text", field: "seo.title", label: "Page title", maxLength: 60 },
      { type: "text", field: "seo.description", label: "Page description", multiline: true, maxLength: 160 }
    ] },

  { id: "review", title: "Review", help: "Check your answers. Download and Publish come later.",
    type: "review" }
];
