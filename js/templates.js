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
