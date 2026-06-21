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

const getStructuredData = (html) => {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch (error) {
    failures.push(`Structured data should be valid JSON: ${error.message}`);
    return null;
  }
};

const indexHtml = read("index.html");
const aboutHtml = read("about.html");
const casesHtml = read("cases.html");
const consultHtml = read("consult.html");
const knowledgeHtml = read("knowledge.html");
const footerHtml = read("footer.html");
const headerHtml = read("header.html");
const css = read("style.css");
const layoutJs = read("layout.js");
const pages = [
  ["index.html", indexHtml],
  ["about.html", aboutHtml],
  ["cases.html", casesHtml],
  ["knowledge.html", knowledgeHtml],
  ["consult.html", consultHtml]
];

assert((indexHtml.match(/<h1[\s>]/g) || []).length === 1, "index.html should have exactly one h1.");
pages.forEach(([file, html]) => {
  assert((html.match(/<h1[\s>]/g) || []).length === 1, `${file} should have exactly one h1.`);
  assert(/<link rel="canonical" href="https:\/\/dkrlgustlr\.github\.io\/homepage_1\/[^"]*"/.test(html), `${file} should have an absolute canonical URL.`);
  assert(/<meta property="og:title"/.test(html) && /<meta property="og:description"/.test(html), `${file} should have Open Graph title and description.`);
  assert(/<script type="application\/ld\+json">[\s\S]*"@type":\s*"BreadcrumbList"/.test(html), `${file} should include breadcrumb structured data.`);
  const structuredData = getStructuredData(html);
  assert(Boolean(structuredData?.["@graph"]?.length), `${file} structured data should have an @graph.`);
});

assert(/<form[^>]*class="consult-form"[^>]*data-consult-form/.test(indexHtml), "Main page consultation form needs data-consult-form.");
assert(/<button[^>]*class="form-button"[^>]*type="submit"/.test(indexHtml), "Main page consultation button should submit.");

assert(/<form[^>]*class="sub-consult-form"[^>]*id="consult-form"[^>]*data-consult-form/.test(consultHtml), "Consult page form needs id and data-consult-form.");
assert(/<button[^>]*class="sub-submit"[^>]*type="submit"/.test(consultHtml), "Consult page submit button should submit.");

assert(/<form[^>]*class="bottom-consult"[^>]*data-consult-form/.test(footerHtml), "Bottom consultation form needs data-consult-form.");
assert(/<button[^>]*class="bottom-consult-submit"[^>]*type="submit"/.test(footerHtml), "Bottom consultation button should submit.");

assert(layoutJs.includes("initConsultForms"), "layout.js should initialize consultation forms.");
assert(layoutJs.includes("mailto:") && layoutJs.includes("sms:"), "Consultation submit should support mailto and sms fallbacks.");
assert(layoutJs.includes("HEADER_FALLBACK_HTML") && layoutJs.includes("FOOTER_FALLBACK_HTML"), "layout.js should provide fallback HTML when shared includes cannot be fetched.");
assert(layoutJs.includes("insertAdjacentHTML"), "layout.js fallback should inject shared layout when fetch fails.");

assert(/<a href="index\.html">메인<\/a>[\s\S]*<a href="about\.html">법무사소개<\/a>[\s\S]*<a href="cases\.html">실제사례<\/a>[\s\S]*<a href="knowledge\.html">지식센터<\/a>[\s\S]*<a href="consult\.html">상담신청<\/a>/.test(headerHtml), "Header nav should keep the approved order.");

assert(/<section[^>]*class="[^"]*\bfaq-section\b[^"]*"/.test(knowledgeHtml), "Knowledge page should include visible FAQ content for AEO.");
assert(/"@type":\s*"FAQPage"/.test(knowledgeHtml), "Knowledge page should include FAQPage structured data.");
assert((knowledgeHtml.match(/<article class="faq-item"/g) || []).length >= 4, "Knowledge page should include at least four FAQ items.");

assert(/<section[^>]*class="[^"]*\bservice-area-section\b[^"]*"/.test(aboutHtml), "About page should include local service-area content.");
assert(/화성/.test(aboutHtml) && /반월동/.test(aboutHtml) && /동탄/.test(aboutHtml) && /수원/.test(aboutHtml), "About page should mention the main local service areas.");

pages.forEach(([file, html]) => {
  const imageTags = html.match(/<img\b[^>]*>/g) || [];
  imageTags.forEach((tag) => {
    assert(/\balt="[^"]+"/.test(tag), `${file} image is missing alt text: ${tag}`);
    assert(/\b(loading|fetchpriority)=/.test(tag), `${file} image should define loading or fetchpriority: ${tag}`);
    assert(/\bdecoding="async"/.test(tag) || /\bfetchpriority="high"/.test(tag), `${file} image should define async decoding or high fetch priority: ${tag}`);
  });
});

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
