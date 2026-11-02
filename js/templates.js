// Build every template with a loop: each layout x each theme.
// 5 layouts x 10 themes = 50 templates. Adding one theme adds 5 templates, no new code.
const TEMPLATES = [];

LAYOUTS.forEach(layout => {
  THEMES.forEach(theme => {
    TEMPLATES.push({
      id: layout.id + "-" + theme.id,
      name: layout.name + " / " + theme.name,
      layoutId: layout.id,
      themeId: theme.id,
      build: state => layout.build(state, theme)
    });
  });
});

// The final site: the picked template, with the step 4 color and font choices on top.
// Used by the live preview, and later by Download and Publish.
function siteTemplate(state) {
  return TEMPLATES.find(t => t.id === state.templateId) || TEMPLATES[0];
}

// The template's theme, with the step 4 color and font choices on top
function siteTheme(state) {
  const template = siteTemplate(state);
  const colors = THEMES.find(t => t.id === state.themeId) || THEMES.find(t => t.id === template.themeId);
  return Object.assign({}, colors, FONT_STYLES[state.fontStyle]);
}

function buildSite(state) {
  const layout = LAYOUTS.find(l => l.id === siteTemplate(state).layoutId);
  return layout.build(state, siteTheme(state));
}

// Name for the review step: "classic-rust" -> "Classic / Rust", "paper" -> "Paper",
// "restaurant" -> "Restaurant", "" (theme or font not picked) -> "From template"
function displayName(value) {
  if (!value) return "From template";
  const found = [...TEMPLATES, ...THEMES].find(t => t.id === value);
  return found ? found.name : value[0].toUpperCase() + value.slice(1);
}
