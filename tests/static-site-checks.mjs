import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(resolve(root, file), "utf8");
const failures = [];

const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const getBlock = (css, selector) => {
  const start = css.indexOf(selector);
  if (start === -1) return "";
  const open = css.indexOf("{", start);
  if (open === -1) return "";
  let depth = 0;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === "{") depth += 1;
    if (css[i] === "}") depth -= 1;
    if (depth === 0) return css.slice(open + 1, i);
  }
  return "";
};

const indexHtml = read("index.html");
const consultHtml = read("consult.html");
const footerHtml = read("footer.html");
const css = read("style.css");
const layoutJs = read("layout.js");

assert((indexHtml.match(/<h1[\s>]/g) || []).length === 1, "index.html should have exactly one h1.");

assert(/<form[^>]*class="consult-form"[^>]*data-consult-form/.test(indexHtml), "Main page consultation form needs data-consult-form.");
assert(/<button[^>]*class="form-button"[^>]*type="submit"/.test(indexHtml), "Main page consultation button should submit.");

assert(/<form[^>]*class="sub-consult-form"[^>]*id="consult-form"[^>]*data-consult-form/.test(consultHtml), "Consult page form needs id and data-consult-form.");
assert(/<button[^>]*class="sub-submit"[^>]*type="submit"/.test(consultHtml), "Consult page submit button should submit.");

assert(/<form[^>]*class="bottom-consult"[^>]*data-consult-form/.test(footerHtml), "Bottom consultation form needs data-consult-form.");
assert(/<button[^>]*class="bottom-consult-submit"[^>]*type="submit"/.test(footerHtml), "Bottom consultation button should submit.");

assert(layoutJs.includes("initConsultForms"), "layout.js should initialize consultation forms.");
assert(layoutJs.includes("mailto:") && layoutJs.includes("sms:"), "Consultation submit should support mailto and sms fallbacks.");

const headerBlock = getBlock(css, ".header-bar");
assert(/translate:\s*-50%\s+0/.test(headerBlock), "Desktop header bar should use translate longhand for centering.");
assert(!/transform:\s*translateX\(-50%\)/.test(headerBlock), "Desktop header centering should not use transform because headerDrop animates transform.");
assert(/@media \(max-width:\s*1024px\)[\s\S]*?\.header-bar\s*{[\s\S]*?translate:\s*none/.test(css), "Tablet/mobile header bar should clear desktop translate.");

if (failures.length) {
  console.error(`Static checks failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Static checks passed.");
