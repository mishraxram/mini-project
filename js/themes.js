// 10 themes. A theme is data only: colors, fonts, corner radius, spacing.
// Fonts are system fonts, so the generated site works offline with no font files.
// radius = corner size in px (999 = pill buttons). spacing = base unit in px, layouts multiply it.
const SERIF = 'Georgia, "Times New Roman", serif';
const PALATINO = '"Palatino Linotype", "Book Antiqua", Palatino, serif';
const SANS = '"Helvetica Neue", Arial, sans-serif';
const HUMANIST = '"Trebuchet MS", "Segoe UI", sans-serif';
const VERDANA = 'Verdana, Geneva, sans-serif';
const MONO = '"Courier New", Courier, monospace';

const THEMES = [
  { id: "paper", name: "Paper", headingFont: SERIF, bodyFont: SANS, radius: 0, spacing: 16,
    colors: { bg: "#F5F1E8", text: "#1A1A1A", muted: "#5C574F", accent: "#B8401F", onAccent: "#FFFFFF", line: "#1A1A1A" } },

  { id: "ink", name: "Ink", headingFont: SANS, bodyFont: SANS, radius: 0, spacing: 16,
    colors: { bg: "#1A1A1A", text: "#F5F1E8", muted: "#B5AFA4", accent: "#F0A35E", onAccent: "#1A1A1A", line: "#3A3A3A" } },

  { id: "rust", name: "Rust", headingFont: PALATINO, bodyFont: SANS, radius: 4, spacing: 16,
    colors: { bg: "#FBF7F2", text: "#2B1D16", muted: "#6B5A4E", accent: "#A63D17", onAccent: "#FFFFFF", line: "#D9CCC0" } },

  { id: "forest", name: "Forest", headingFont: SERIF, bodyFont: VERDANA, radius: 8, spacing: 12,
    colors: { bg: "#F1F4EE", text: "#1E2B22", muted: "#55635A", accent: "#2F6B45", onAccent: "#FFFFFF", line: "#C9D3C6" } },

  { id: "harbor", name: "Harbor", headingFont: SANS, bodyFont: SANS, radius: 4, spacing: 16,
    colors: { bg: "#EEF2F5", text: "#14212B", muted: "#4E5D69", accent: "#1F5C8A", onAccent: "#FFFFFF", line: "#C5D0D8" } },

  { id: "clay", name: "Clay", headingFont: PALATINO, bodyFont: PALATINO, radius: 999, spacing: 16,
    colors: { bg: "#F3E9DF", text: "#3A2A20", muted: "#6E5A4C", accent: "#8C4422", onAccent: "#FFFFFF", line: "#D8C6B5" } },

  { id: "slate", name: "Slate", headingFont: HUMANIST, bodyFont: SANS, radius: 0, spacing: 8,
    colors: { bg: "#E9EAEC", text: "#1C1F24", muted: "#50565E", accent: "#B0341C", onAccent: "#FFFFFF", line: "#1C1F24" } },

  { id: "newsprint", name: "Newsprint", headingFont: SERIF, bodyFont: SERIF, radius: 0, spacing: 12,
    colors: { bg: "#FFFFFF", text: "#111111", muted: "#555555", accent: "#0B5CAD", onAccent: "#FFFFFF", line: "#111111" } },

  { id: "mustard", name: "Mustard", headingFont: MONO, bodyFont: SANS, radius: 4, spacing: 16,
    colors: { bg: "#FFF8E7", text: "#222222", muted: "#5E5646", accent: "#7A5200", onAccent: "#FFFFFF", line: "#E5D9B8" } },

  { id: "night", name: "Night", headingFont: SANS, bodyFont: SANS, radius: 8, spacing: 16,
    colors: { bg: "#10161C", text: "#DDE3E8", muted: "#93A1AD", accent: "#4FB3A9", onAccent: "#10161C", line: "#2A343D" } }
];
