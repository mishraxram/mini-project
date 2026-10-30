// Logo upload (step 11): PNG, JPG, SVG or WebP up to 500 KB.
// The file is turned into a base64 "data URL" text, so it lives in state and in the downloaded HTML.
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];
const MAX_IMAGE_KB = 500;

function renderImageInput(input, id) {
  const wrap = el("div", "upload");
  const error = el("p", "error");
  error.hidden = true;
  const showError = text => { error.textContent = text; error.hidden = false; file.value = ""; };

  const file = el("input");
  file.type = "file";
  file.id = id;
  file.name = id;
  file.accept = IMAGE_TYPES.join(",");
  file.onchange = () => {
    const picked = file.files[0];
    error.hidden = true;
    if (!picked) return;
    if (!IMAGE_TYPES.includes(picked.type)) return showError("Use a PNG, JPG, SVG or WebP image.");
    if (picked.size > MAX_IMAGE_KB * 1024) {
      return showError("This image is " + Math.round(picked.size / 1024) + " KB. The limit is " + MAX_IMAGE_KB + " KB.");
    }
    const reader = new FileReader();
    reader.onload = () => { setValue(input.field, reader.result); render(); };
    reader.onerror = () => showError("Could not read this file.");
    reader.readAsDataURL(picked);
  };
  wrap.append(file);

  // Show the current image with a Remove button
  if (getValue(input.field)) {
    const preview = el("img", "upload-preview");
    preview.src = getValue(input.field);
    preview.alt = "Current logo";
    const remove = el("button", "", "Remove image");
    remove.type = "button";
    remove.onclick = () => { setValue(input.field, ""); render(); };
    wrap.append(preview, remove);
  }
  wrap.append(error);
  return wrap;
}
