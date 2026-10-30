// Image upload for the logo, hero, about and card images.
// PNG, JPG, SVG or WebP. Photos are shrunk in the browser (canvas) so many images still fit in storage.
// The saved image is a base64 "data URL" text, so it lives in state and inside the downloaded HTML.
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];
const MAX_IMAGE_KB = 500;      // the saved image can be at most this big
const MAX_PHOTO_MB = 5;        // a photo can be picked up to this size, then it is shrunk
const MAX_SIDE = 1200;         // longest side of a shrunk photo, in pixels

// Draw the photo smaller on a canvas and save it as WebP. done("") if the browser cannot read it.
function shrinkImage(dataUrl, maxSide, done) {
  const img = new Image();
  img.onload = () => {
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    done(canvas.toDataURL("image/webp", 0.82));
  };
  img.onerror = () => done("");
  img.src = dataUrl;
}

// Check a picked file and turn it into a data URL. done(errorText, dataUrl).
function readImage(file, maxSide, done) {
  if (!IMAGE_TYPES.includes(file.type)) return done("Use a PNG, JPG, SVG or WebP image.");
  const isSvg = file.type === "image/svg+xml";
  const limitKB = isSvg ? MAX_IMAGE_KB : MAX_PHOTO_MB * 1024;
  if (file.size > limitKB * 1024) return done("This image is " + Math.round(file.size / 1024) + " KB. The limit is " + limitKB + " KB.");
  const reader = new FileReader();
  reader.onerror = () => done("Could not read this file.");
  reader.onload = () => {
    if (isSvg) return done("", reader.result);  // SVG is already small and sharp at any size
    shrinkImage(reader.result, maxSide, small => {
      if (!small) return done("Could not read this image.");
      if (small.length * 0.75 > MAX_IMAGE_KB * 1024) return done("This image is still over " + MAX_IMAGE_KB + " KB after shrinking. Try a smaller one.");
      done("", small);
    });
  };
  reader.readAsDataURL(file);
}

// File picker with a preview and a Remove button.
// getImage() returns the current image; setImage(url) saves a new one ("" removes it).
function imagePicker(id, label, getImage, setImage, maxSide) {
  const wrap = el("div", "upload");
  const error = el("p", "error");
  error.hidden = true;

  const file = el("input");
  file.type = "file";
  file.id = id;
  file.name = id;
  file.accept = IMAGE_TYPES.join(",");
  file.setAttribute("aria-label", label);
  file.onchange = () => {
    if (!file.files[0]) return;
    readImage(file.files[0], maxSide, (message, url) => {
      if (message) {
        error.textContent = message;
        error.hidden = false;
        file.value = "";
        return;
      }
      setImage(url);
      render();
    });
  };
  wrap.append(file);

  if (getImage()) {
    const preview = el("img", "upload-preview");
    preview.src = getImage();
    preview.alt = label + " preview";
    const remove = el("button", "", "Remove image");
    remove.type = "button";
    remove.onclick = () => { setImage(""); render(); };
    wrap.append(preview, remove);
  }
  wrap.append(error);
  return wrap;
}

// A step field with image: true (logo, hero image, about image)
function renderImageInput(input, id) {
  return imagePicker(id, input.label, () => getValue(input.field), url => setValue(input.field, url), input.maxSide || MAX_SIDE);
}
