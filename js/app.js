// wizard engine
// All answers live in this one object.
const state = {
  siteName: "", siteType: "", templateId: "", themeId: "", fontStyle: "",
  menuItems: ["Home", "About", "Contact"],
  heroTitle: "", heroText: "", about: "",
  cards: [],
  contact: { email: "", phone: "", whatsapp: "", address: "" },
  footer: "",
  social: { instagram: "", linkedin: "", github: "" },
  seo: { title: "", description: "" }
};

let current = 0;  // index of the step on screen
let errors = {};  // field path -> error message

// Read or write a value by path, like "contact.email"
function getValue(path) {
  return path.split(".").reduce((obj, key) => obj[key], state);
}
function setValue(path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  keys.reduce((obj, key) => obj[key], state)[last] = value;
}

// Small helper to make an element. Text goes in with textContent, so it is never run as HTML.
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// A step has one input (the step itself) or several (step.fields)
function inputsOf(step) {
  return step.fields || [step];
}

function render() {
  const step = STEPS[current];
  const box = document.getElementById("wizard");
  const pad = n => String(n).padStart(2, "0");

  box.replaceChildren(
    el("p", "progress", pad(current + 1) + " / " + pad(STEPS.length)),
    el("h1", "", step.title),
    el("p", "help", step.help)
  );

  if (step.type === "review") box.append(renderReview());
  else inputsOf(step).forEach(input => box.append(renderInput(input)));

  // buttons
  const nav = el("div", "nav");
  const back = el("button", "", "Back");
  back.disabled = current === 0;
  back.onclick = goBack;
  nav.append(back);
  if (step.type !== "review" && !inputsOf(step).some(input => input.required)) {
    const skip = el("button", "", "Skip");
    skip.onclick = skipStep;
    nav.append(skip);
  }
  const next = el("button", "primary", "Next");
  next.disabled = current === STEPS.length - 1;
  next.onclick = goNext;
  nav.append(next);
  box.append(nav);

  const first = box.querySelector("input, textarea");
  if (first) first.focus();
}

// One field: label, the control, and the error text under it
function renderInput(input) {
  const wrap = el("div", "field");
  const id = "f-" + input.field.replace(".", "-");
  const label = el("label", "", input.label + (input.required ? " *" : ""));
  label.htmlFor = id;
  wrap.append(label);

  if (input.type === "mcq") {
    input.options.forEach((option, i) => {
      const radio = el("input");
      radio.type = "radio";
      radio.name = id;
      radio.id = i === 0 ? id : id + "-" + i;
      radio.checked = getValue(input.field) === option;
      radio.onchange = () => setValue(input.field, option);
      const optionLabel = el("label", "option");
      optionLabel.append(radio, " " + option);
      wrap.append(optionLabel);
    });
  } else if (input.type === "list") {
    wrap.append(renderList(input, id));
  } else {
    const box = el(input.multiline ? "textarea" : "input");
    box.id = id;
    box.value = getValue(input.field);
    box.maxLength = input.maxLength;
    box.oninput = () => setValue(input.field, box.value);
    wrap.append(box);
  }

  if (errors[input.field]) {
    wrap.classList.add("has-error");
    wrap.append(el("p", "error", errors[input.field]));
  }
  return wrap;
}

// List: one row per item with a Remove button, plus an Add button (up to maxItems)
function renderList(input, id) {
  const items = getValue(input.field);
  const keys = input.itemFields || [null];  // null = the item is a plain string
  const list = el("div", "list");
  items.forEach((item, i) => {
    const row = el("div", "list-row");
    keys.forEach((key, k) => {
      const box = el("input");
      if (i === 0 && k === 0) box.id = id;  // so the label points at the first box
      box.value = key ? item[key] : item;
      box.placeholder = key || input.label;
      box.maxLength = input.maxLength;
      box.oninput = () => { if (key) item[key] = box.value; else items[i] = box.value; };
      row.append(box);
    });
    const remove = el("button", "", "Remove");
    remove.onclick = () => { items.splice(i, 1); render(); };
    row.append(remove);
    list.append(row);
  });

  const add = el("button", "", "Add " + input.label.toLowerCase());
  add.disabled = items.length >= input.maxItems;
  add.onclick = () => { items.push(input.itemFields ? { title: "", detail: "" } : ""); render(); };
  list.append(add);
  return list;
}

// Review: every answer as plain text
function renderReview() {
  const list = el("dl", "review");
  STEPS.filter(step => step.type !== "review").forEach(step => {
    inputsOf(step).forEach(input => {
      let value = getValue(input.field);
      if (Array.isArray(value)) value = value.map(v => typeof v === "object" ? v.title + " - " + v.detail : v).join(", ");
      list.append(el("dt", "", input.label), el("dd", "", value || "(empty)"));
    });
  });
  return list;
}

function goNext() {
  errors = {};
  inputsOf(STEPS[current]).forEach(input => {
    if (!input.field) return;  // review step has no fields
    const error = validate(input, getValue(input.field));
    if (error) errors[input.field] = error;
  });
  if (Object.keys(errors).length === 0 && current < STEPS.length - 1) current++;
  render();
}

function goBack() {
  errors = {};
  if (current > 0) current--;
  render();
}

// Skip clears this step's answers, so no half-filled bad value is kept
function skipStep() {
  inputsOf(STEPS[current]).forEach(input => {
    setValue(input.field, Array.isArray(getValue(input.field)) ? [] : "");
  });
  errors = {};
  current++;
  render();
}

// Enter = Next (not inside a textarea, where Enter makes a new line, and not on a button)
document.addEventListener("keydown", e => {
  if (e.key !== "Enter" || e.target.tagName === "TEXTAREA" || e.target.tagName === "BUTTON") return;
  e.preventDefault();
  goNext();
});

render();
