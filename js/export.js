// Download the finished site: one HTML file, or a ZIP with separate files.
// Everything runs in the browser. A temporary <a download> link saves the file.

// Hosting help that goes inside the ZIP. No WebCraft name: the site belongs to the user.
const ZIP_README = `This folder is your website.

Open index.html in a browser to see it.

To put it online for free:
- Netlify Drop: open app.netlify.com/drop and drag this folder in.
- GitHub Pages: upload these files to a GitHub repository, then turn on Pages in Settings.
`;

// "Asha Rao" -> "asha-rao"; falls back to "website" if the name has no letters or digits
function siteFileName() {
  return slug(state.siteName) || "website";
}

function saveFile(blob, fileName) {
  const link = el("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);  // free memory after the save starts
}

function downloadHTML() {
  saveFile(new Blob([buildSite(state)], { type: "text/html" }), siteFileName() + ".html");
}

// ZIP: the page's <style> block moves into style.css, and index.html links to it.
// User text is escaped, so the only <style> tag in the page is ours.
function downloadZIP() {
  const html = buildSite(state);
  const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  const page = html.replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="style.css">');

  const zip = new JSZip();
  zip.file("index.html", page);
  zip.file("style.css", css.trim() + "\n");
  zip.file("README.txt", ZIP_README);
  return zip.generateAsync({ type: "blob" }).then(blob => saveFile(blob, siteFileName() + ".zip"));
}

// Download buttons for the review step, with an error line under them
function renderExport() {
  const wrap = el("div", "export");
  const error = el("p", "error");
  error.hidden = true;
  const showError = text => { error.textContent = text; error.hidden = false; };

  const htmlButton = el("button", "primary", "Download HTML");
  htmlButton.type = "button";
  htmlButton.onclick = downloadHTML;

  const zipButton = el("button", "", "Download ZIP");
  zipButton.type = "button";
  zipButton.onclick = () => {
    if (typeof JSZip === "undefined") return showError("ZIP library is missing (js/lib/jszip.min.js). Use Download HTML.");
    error.hidden = true;
    zipButton.disabled = true;
    zipButton.textContent = "Making ZIP...";
    downloadZIP()
      .catch(() => showError("Could not make the ZIP. Try Download HTML."))
      .finally(() => { zipButton.disabled = false; zipButton.textContent = "Download ZIP"; });
  };

  wrap.append(
    el("h2", "", "Download"),
    el("p", "help", "HTML: one file, open it anywhere. ZIP: index.html, style.css and steps to put it online."),
    htmlButton, zipButton, error
  );
  return wrap;
}
