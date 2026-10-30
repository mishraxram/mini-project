// Live preview: the site as it is now, in an iframe, at desktop / tablet / mobile width.
const DEVICES = [
  { name: "Desktop", width: 1280 },
  { name: "Tablet", width: 768 },
  { name: "Mobile", width: 375 }
];
let device = DEVICES[0];
let previewTimer = null;
let lastPreview = "";

// Wait a moment after typing stops, so the frame does not reload on every key
function schedulePreview() {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(updatePreview, 200);
}

function updatePreview() {
  const html = buildSite(state);
  if (html === lastPreview) return;  // nothing changed, keep the scroll position
  lastPreview = html;
  document.getElementById("preview-frame").srcdoc = html;
}

// Draw the page at the real device width, then shrink it to fit the panel
function fitPreview() {
  const stage = document.getElementById("preview-stage");
  const frame = document.getElementById("preview-frame");
  if (!stage.clientWidth) return;  // panel is hidden (gallery step)
  const scale = Math.min(1, stage.clientWidth / device.width);
  frame.style.width = device.width + "px";
  frame.style.height = stage.clientHeight / scale + "px";
  frame.style.transform = "scale(" + scale + ")";
  // a narrow device (mobile) sits in the middle of the panel
  frame.style.marginLeft = scale === 1 ? (stage.clientWidth - device.width) / 2 + "px" : "0";
}

function setupPreview() {
  const bar = document.getElementById("preview-devices");
  DEVICES.forEach(d => {
    const button = el("button", "chip", d.name);
    button.type = "button";
    button.setAttribute("aria-pressed", d === device);
    button.onclick = () => {
      device = d;
      bar.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b === button));
      fitPreview();
    };
    bar.append(button);
  });
  new ResizeObserver(fitPreview).observe(document.getElementById("preview-stage"));

  // Any typing or picking inside the wizard refreshes the preview
  const wizard = document.getElementById("wizard");
  wizard.addEventListener("input", schedulePreview);
  wizard.addEventListener("change", schedulePreview);
}
