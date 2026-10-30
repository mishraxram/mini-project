// Build every template with a loop: each layout x each theme.
// 3 layouts x 10 themes = 30 templates. Adding one theme adds 3 templates, no new code.
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
function buildSite(state) {
  const template = TEMPLATES.find(t => t.id === state.templateId) || TEMPLATES[0];
  const layout = LAYOUTS.find(l => l.id === template.layoutId);
  const colors = THEMES.find(t => t.id === state.themeId) || THEMES.find(t => t.id === template.themeId);
  const theme = Object.assign({}, colors, FONT_STYLES[state.fontStyle]);
  return layout.build(state, theme);
}
