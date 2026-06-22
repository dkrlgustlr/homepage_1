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
const kakaoIconBytes = readFileSync(resolve(root, "mockup_assets/icon-kakaotalk-talk-provided.png"));
const phoneIconBytes = readFileSync(resolve(root, "mockup_assets/icon-phone-blue.png"));
const pages = [
  ["index.html", indexHtml],
  ["about.html", aboutHtml],
  ["cases.html", casesHtml],
  ["knowledge.html", knowledgeHtml],
  ["consult.html", consultHtml]
];
const siteText = [indexHtml, aboutHtml, casesHtml, knowledgeHtml, consultHtml, footerHtml, headerHtml, layoutJs].join("\n");

assert((indexHtml.match(/<h1[\s>]/g) || []).length === 1, "index.html should have exactly one h1.");
pages.forEach(([file, html]) => {
  assert((html.match(/<h1[\s>]/g) || []).length === 1, `${file} should have exactly one h1.`);
  assert(/<link rel="canonical" href="https:\/\/dkrlgustlr\.github\.io\/homepage_1\/[^"]*"/.test(html), `${file} should have an absolute canonical URL.`);
  assert(/<meta property="og:title"/.test(html) && /<meta property="og:description"/.test(html), `${file} should have Open Graph title and description.`);
  assert(/<script type="application\/ld\+json">[\s\S]*"@type":\s*"BreadcrumbList"/.test(html), `${file} should include breadcrumb structured data.`);
  const structuredData = getStructuredData(html);
  assert(Boolean(structuredData?.["@graph"]?.length), `${file} structured data should have an @graph.`);
});

assert(siteText.includes("1588-5986"), "The site should display the unified representative phone number.");
assert(!/(031-211-5230|031-211-5233|0312115230|01065509628|\+82-31-211)/.test(siteText), "The site should not contain old office phone numbers.");

assert(/<form[^>]*class="consult-form"[^>]*data-consult-form/.test(indexHtml), "Main page consultation form needs data-consult-form.");
assert(/<button[^>]*class="form-button"[^>]*type="submit"/.test(indexHtml), "Main page consultation button should submit.");

assert(/<form[^>]*class="sub-consult-form"[^>]*id="consult-form"[^>]*data-consult-form/.test(consultHtml), "Consult page form needs id and data-consult-form.");
assert(/<button[^>]*class="sub-submit"[^>]*type="submit"/.test(consultHtml), "Consult page submit button should submit.");

assert(/<form[^>]*class="bottom-consult"[^>]*data-consult-form/.test(footerHtml), "Bottom consultation form needs data-consult-form.");
assert(/<button[^>]*class="bottom-consult-submit"[^>]*type="submit"/.test(footerHtml), "Bottom consultation button should submit.");

assert(!/site-intro|introLogoRise|is-finished|animationend/.test(indexHtml + css), "Main page should load directly without an intro overlay.");

assert(layoutJs.includes("initConsultForms"), "layout.js should initialize consultation forms.");
assert(layoutJs.includes("mailto:") && layoutJs.includes("sms:"), "Consultation submit should support mailto and sms fallbacks.");
assert(layoutJs.includes("HEADER_FALLBACK_HTML") && layoutJs.includes("FOOTER_FALLBACK_HTML"), "layout.js should provide fallback HTML when shared includes cannot be fetched.");
assert(layoutJs.includes("insertAdjacentHTML"), "layout.js fallback should inject shared layout when fetch fails.");
assert(layoutJs.includes("initFloatingContrast"), "layout.js should initialize floating contrast on every page.");
assert(layoutJs.includes(".sub-hero") && layoutJs.includes(".footer") && layoutJs.includes(".hero"), "Floating contrast should inspect both main and subpage dark sections.");
assert(layoutJs.includes(".side-word") && layoutJs.includes("is-over-dark") && !layoutJs.includes("document.querySelector(\".hamburger\")"), "Floating contrast should update the side word without depending on the removed hamburger menu.");
assert(!headerHtml.includes("class=\"hamburger\"") && !layoutJs.includes("class=\"hamburger\""), "Header should not render the removed top-right hamburger menu.");
assert(/\.header-bar\s*{[\s\S]*?left:\s*auto[\s\S]*?right:\s*calc\(clamp\(34px,\s*4vw,\s*76px\)\s*\+\s*30px\)[\s\S]*?translate:\s*0 0/.test(css), "Header pill menu should be positioned from the right side and moved 30px left.");
assert(!/예약|quick-icon naver|sideFloat/.test(footerHtml + layoutJs + css), "Floating side banner should stay still and should not include Naver reservation.");
assert(footerHtml.includes("mockup_assets/icon-kakaotalk-talk-provided.png") && layoutJs.includes("mockup_assets/icon-kakaotalk-talk-provided.png"), "Floating side banner should use the user-provided TALK image.");
assert(footerHtml.includes("mockup_assets/icon-phone-blue.png") && layoutJs.includes("mockup_assets/icon-phone-blue.png"), "Floating and bottom phone actions should use the local blue phone icon.");
assert(kakaoIconBytes.length > 1000, "Blue TALK icon asset should be present.");
assert(phoneIconBytes.length > 500, "Blue phone icon asset should be present.");
assert(/\.quick-icon\.kakao img\s*{[\s\S]*?object-fit:\s*contain/.test(css), "Kakao TALK icon should not be cropped.");
assert(/\.quick-icon\.kakao\s*{[\s\S]*?width:\s*46px[\s\S]*?height:\s*46px[\s\S]*?border-radius:\s*0[\s\S]*?overflow:\s*visible/.test(css), "Kakao TALK icon should show the provided image at the requested 46px size without forced circular cropping.");
assert(footerHtml.includes("quick-label\">TOP") && layoutJs.includes("quick-label\">TOP"), "Floating side banner should include a TOP label.");
assert(/\.quick-item\s*{[\s\S]*?height:\s*92px[\s\S]*?gap:\s*12px/.test(css), "Floating side banner should keep wider icon and label spacing.");
assert(!/☎|>K<\/div>/.test(footerHtml + layoutJs), "Floating and bottom phone/Kakao actions should not use text placeholder icons.");

assert(/<a href="index\.html">메인<\/a>[\s\S]*<a href="about\.html">법무사소개<\/a>[\s\S]*<a href="cases\.html">실제사례<\/a>[\s\S]*<a href="knowledge\.html">지식센터<\/a>[\s\S]*<a href="consult\.html">상담신청<\/a>/.test(headerHtml), "Header nav should keep the approved order.");

assert(/<section[^>]*class="[^"]*\bfaq-section\b[^"]*"/.test(knowledgeHtml), "Knowledge page should include visible FAQ content for AEO.");
assert(/"@type":\s*"FAQPage"/.test(knowledgeHtml), "Knowledge page should include FAQPage structured data.");
assert((knowledgeHtml.match(/<article class="faq-item"/g) || []).length >= 4, "Knowledge page should include at least four FAQ items.");

assert(/<section[^>]*class="[^"]*\bservice-area-section\b[^"]*"/.test(aboutHtml), "About page should include local service-area content.");
assert(/화성/.test(aboutHtml) && /반월동/.test(aboutHtml) && /동탄/.test(aboutHtml) && /수원/.test(aboutHtml), "About page should mention the main local service areas.");

assert(indexHtml.includes("daumRoughmapContainer1782029506097"), "Main page should include the Kakao roughmap container.");
assert(indexHtml.includes("daumRoughmapContainer1782035826357"), "Main page should include the mobile Kakao roughmap container.");
assert(indexHtml.includes("roughmapLoader.js"), "Main page should load the Kakao roughmap loader script.");
assert(indexHtml.includes('"key" : "pw7oq2qig7i"') || indexHtml.includes('key: "pw7oq2qig7i"'), "Kakao roughmap should use the provided map key.");
assert(indexHtml.includes('"key" : "2rcohv5rv8fz"') || indexHtml.includes('key: "2rcohv5rv8fz"'), "Mobile Kakao roughmap should use the provided mobile map key.");
assert(indexHtml.includes('"timestamp" : "1782035826357"'), "Mobile Kakao roughmap should use the provided mobile timestamp.");
assert(indexHtml.includes('"mapWidth" : "360"') && indexHtml.includes('"mapHeight" : "240"'), "Mobile Kakao roughmap should keep the provided fixed 360x240 size.");
assert(indexHtml.includes("renderKakaoRoughMap"), "Main page should render the Kakao map after calculating responsive dimensions.");
assert(!/"mapWidth"\s*:\s*"640"/.test(indexHtml) && !/"mapHeight"\s*:\s*"360"/.test(indexHtml), "Kakao roughmap should not keep the original fixed 640x360 size.");
assert(css.includes(".kakao-map"), "Styles should size the Kakao map container.");
assert(css.includes(".kakao-map-mobile"), "Styles should include a mobile-only Kakao map container.");
assert(/@media \(max-width:\s*640px\)[\s\S]*?\.kakao-map-desktop\s*{[\s\S]*?display:\s*none/.test(css), "Desktop Kakao map should be hidden on mobile.");
assert(/@media \(max-width:\s*640px\)[\s\S]*?\.kakao-map-mobile\s*{[\s\S]*?display:\s*block/.test(css), "Mobile Kakao map should be shown on mobile.");
assert(!indexHtml.includes("beommusa_map_hyundai_plaza.png"), "Main page should not keep the old placeholder map image.");
const mapBlock = getBlock(css, ".map");
const mapTransitionBlock = css.match(/\.map,\s*\n\s*\.more,\s*\n\s*\.add-btn\s*{/)?.[0] || "";
assert(/height:\s*min\(calc\(var\(--section-h\)\s*-\s*var\(--header-h\)\s*-\s*var\(--fit-content-offset\)\s*-\s*70px\),\s*520px\)/.test(mapBlock), "Desktop map height should be reduced by about 70px.");
assert(!mapTransitionBlock, "Map should not be included in the shared hover transition group.");
assert(!/\.map:hover\s*{[\s\S]*?transform:/.test(css), "Map should not move on hover.");
assert(/@media \(max-width:\s*1024px\)[\s\S]*?\.map\s*{[\s\S]*?height:\s*360px/.test(css), "Tablet map height should be reduced to 360px.");
assert(/@media \(max-width:\s*640px\)[\s\S]*?\.map\s*{[\s\S]*?height:\s*240px/.test(css), "Mobile map height should use the provided 240px map height.");
assert(/\.sub-heading\s*\+\s*\.sub-table\s*{[\s\S]*?border-top:\s*0/.test(css), "Tables immediately after section headings should remove their top border to avoid double horizontal lines.");
assert(/\.page\s+:is\(\s*h1,\s*h2,\s*h3,\s*h4,\s*p,\s*li,\s*dt,\s*dd,\s*th,\s*td,\s*label,\s*button,\s*input,\s*select,\s*textarea[\s\S]*?\)\s*{[\s\S]*?word-break:\s*keep-all;[\s\S]*?overflow-wrap:\s*normal;[\s\S]*?line-break:\s*strict;/.test(css), "Content text should use Korean keep-all wrapping to avoid awkward one-character line breaks.");
assert(!/overflow-wrap:\s*break-word;/.test(css), "Korean content text should not use break-word because it can split words into awkward one-character lines.");
const caseInnerBlock = getBlock(css, ".case-inner");
assert(/--case-inner-lift:\s*-30px/.test(caseInnerBlock) && /translate:\s*0\s+var\(--case-inner-lift\)/.test(caseInnerBlock), "Desktop case section content should be lifted by 30px.");
assert(/@media \(max-width:\s*1024px\)[\s\S]*?\.case-inner\s*{[\s\S]*?translate:\s*none/.test(css), "Stacked case layout should reset the desktop 30px lift on tablet/mobile.");
const caseRightBlock = getBlock(css, ".case-right");
const caseRightChildrenBlock = getBlock(css, ".case-right > *");
assert(/--case-content-drop:\s*30px/.test(caseRightBlock) && /translate:\s*0\s+var\(--case-content-drop\)/.test(caseRightChildrenBlock), "Desktop case right text and table content should move down by 30px.");
assert(/@media \(max-width:\s*1024px\)[\s\S]*?\.case-right\s*{[\s\S]*?--case-content-drop:\s*0px/.test(css), "Stacked case layout should reset the desktop case content drop.");

pages.forEach(([file, html]) => {
  const imageTags = html.match(/<img\b[^>]*>/g) || [];
  imageTags.forEach((tag) => {
    assert(/\balt="[^"]+"/.test(tag), `${file} image is missing alt text: ${tag}`);
    assert(/\b(loading|fetchpriority)=/.test(tag), `${file} image should define loading or fetchpriority: ${tag}`);
    assert(/\bdecoding="async"/.test(tag) || /\bfetchpriority="high"/.test(tag), `${file} image should define async decoding or high fetch priority: ${tag}`);
  });
});

const headerBlock = getBlock(css, ".header-bar");
assert(/left:\s*auto/.test(headerBlock) && /right:\s*calc\(clamp\(34px,\s*4vw,\s*76px\)\s*\+\s*30px\)/.test(headerBlock) && /translate:\s*0 0/.test(headerBlock), "Desktop header bar should be anchored to the right with a 30px left offset.");
assert(/@media \(max-width:\s*1024px\)[\s\S]*?\.header-bar\s*{[\s\S]*?right:\s*18px[\s\S]*?translate:\s*none/.test(css), "Tablet/mobile header bar should use the space freed by the removed hamburger menu.");

if (failures.length) {
  console.error(`Static checks failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Static checks passed.");
