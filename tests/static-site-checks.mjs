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
assert(siteText.includes("20년 경력"), "The site should mention the provided 20-year experience claim.");
assert(siteText.includes("2천 건 이상 상담·처리 경험"), "The site should mention the provided 2,000+ consultation/handling experience claim.");
assert(siteText.includes("95% 승률"), "The site should include the provided 95% win-rate claim.");
assert(/채권추심/.test(siteText) && /카드값 연체/.test(siteText) && /통장압류/.test(siteText), "The site should reflect the priority emergency debt situations.");
assert(/직장인/.test(siteText) && /자영업자/.test(siteText) && /프리랜서/.test(siteText) && /일용직/.test(siteText), "The site should reflect the supported customer work types.");
assert(/주식·코인·도박 채무 상담/.test(siteText), "The site should reflect stock, crypto, and gambling debt consultation wording.");
assert(/전화상담 후 방문 상담/.test(siteText), "The site should state the phone-first visit consultation flow.");
assert(!/(031-211-5230|031-211-5233|0312115230|01065509628|\+82-31-211)/.test(siteText), "The site should not contain old office phone numbers.");
assert(indexHtml.includes("영업시간") && indexHtml.includes("월-금 09:30 - 18:00") && indexHtml.includes("토·일 정기휴무"), "Location section should show office hours instead of the building row.");
assert(!indexHtml.includes("<span>건물</span><small>반월동, 현대프라자</small>"), "Location section should not show the old building row.");

assert(/data-count-to="2000"[^>]*>2000<\/span>건\+/.test(indexHtml) && /data-count-to="2000"[^>]*>2000<\/span>건\+/.test(consultHtml), "Consult proof cards should display 2000건+ instead of 2천 건+.");
["20", "2000", "95"].forEach((target) => {
  const marker = `data-count-to="${target}"`;
  assert(indexHtml.includes(marker) && consultHtml.includes(marker), `Consult proof number ${target} should be wired for count-up animation.`);
});
[
  ["20", "1800"],
  ["2000", "2600"],
  ["95", "2100"]
].forEach(([target, duration]) => {
  const pattern = new RegExp(`data-count-to="${target}"[^>]*data-count-duration="${duration}"`);
  assert(pattern.test(indexHtml) && pattern.test(consultHtml), `Consult proof number ${target} should count up more slowly over ${duration}ms.`);
});
assert(layoutJs.includes("initCountUpStats") && layoutJs.includes("requestAnimationFrame"), "layout.js should animate consult proof numbers with requestAnimationFrame.");
assert(/\.count-up\s*{[\s\S]*?display:\s*inline-block/.test(css), "Count-up numbers should have stable inline-block styling.");

assert(/<form[^>]*class="consult-form"[^>]*data-consult-form/.test(indexHtml), "Main page consultation form needs data-consult-form.");
assert(/<button[^>]*class="form-button"[^>]*type="submit"/.test(indexHtml), "Main page consultation button should submit.");
assert(/name="privacy_consent"[^>]*required/.test(indexHtml), "Main page consultation form should require privacy consent.");
assert(indexHtml.includes("data-privacy-modal-open") && indexHtml.includes("privacy-consent-trigger"), "Main page consultation form should open the shared privacy modal from the consent text.");

assert(/<form[^>]*class="sub-consult-form"[^>]*id="consult-form"[^>]*data-consult-form/.test(consultHtml), "Consult page form needs id and data-consult-form.");
assert(/<button[^>]*class="sub-submit"[^>]*type="submit"/.test(consultHtml), "Consult page submit button should submit.");
assert(/name="privacy_consent"[^>]*required/.test(consultHtml), "Consult page form should require privacy consent.");
assert(consultHtml.includes("data-privacy-modal-open") && consultHtml.includes("privacy-consent-trigger"), "Consult page form should open the shared privacy modal from the consent text.");

assert(/<form[^>]*class="bottom-consult"[^>]*data-consult-form/.test(footerHtml), "Bottom consultation form needs data-consult-form.");
assert(/<button[^>]*class="bottom-consult-submit"[^>]*type="submit"/.test(footerHtml), "Bottom consultation button should submit.");
assert(/name="privacy_consent"[^>]*required/.test(footerHtml), "Bottom consultation form should require privacy consent.");
assert(!/privacy_consent"[^>]*checked/.test(footerHtml + layoutJs), "Privacy consent checkboxes should not be pre-checked.");
assert(footerHtml.includes("bottom-privacy-trigger") && footerHtml.includes("footer-privacy-link"), "Footer should expose privacy modal triggers in the bottom bar and footer copy.");
assert(layoutJs.includes("bottom-privacy-trigger") && layoutJs.includes("footer-privacy-link"), "Footer fallback should expose privacy modal triggers in the bottom bar and footer copy.");
assert(indexHtml.includes("data-custom-select") && consultHtml.includes("data-custom-select"), "Consult page native selects should be marked for custom dropdown rendering.");
assert(footerHtml.includes("data-custom-select") && layoutJs.includes("data-custom-select"), "Bottom bar select and its fallback should be marked for custom dropdown rendering.");

assert(!/site-intro|introLogoRise|is-finished|animationend/.test(indexHtml + css), "Main page should load directly without an intro overlay.");

assert(layoutJs.includes("initConsultForms"), "layout.js should initialize consultation forms.");
assert(layoutJs.includes("initCustomSelects") && layoutJs.includes("custom-select-option") && layoutJs.includes("aria-expanded"), "layout.js should replace marked native selects with accessible custom dropdowns.");
assert(layoutJs.includes("initPrivacyModal") && layoutJs.includes("privacy-consent-modal"), "layout.js should initialize the shared privacy consent modal.");
assert(layoutJs.includes("mailto:") && layoutJs.includes("sms:"), "Consultation submit should support mailto and sms fallbacks.");
assert(layoutJs.includes("privacy_consent") && layoutJs.includes("개인정보 수집 및 이용에 동의해주세요."), "Consultation submit should validate privacy consent before opening mail or sms.");
assert(layoutJs.includes("HEADER_FALLBACK_HTML") && layoutJs.includes("FOOTER_FALLBACK_HTML"), "layout.js should provide fallback HTML when shared includes cannot be fetched.");
assert(layoutJs.includes("insertAdjacentHTML"), "layout.js fallback should inject shared layout when fetch fails.");
assert(layoutJs.includes("initFloatingContrast"), "layout.js should initialize floating contrast on every page.");
assert(layoutJs.includes(".sub-hero") && layoutJs.includes(".footer") && layoutJs.includes(".hero"), "Floating contrast should inspect both main and subpage dark sections.");
assert(layoutJs.includes(".side-word") && layoutJs.includes("is-over-dark") && !layoutJs.includes("document.querySelector(\".hamburger\")"), "Floating contrast should update the side word without depending on the removed hamburger menu.");
assert(!headerHtml.includes("class=\"hamburger\"") && !layoutJs.includes("class=\"hamburger\""), "Header should not render the removed top-right hamburger menu.");
assert(/\.header-bar\s*{[\s\S]*?left:\s*auto[\s\S]*?right:\s*calc\(clamp\(34px,\s*4vw,\s*76px\)\s*\+\s*180px\)[\s\S]*?translate:\s*0 0/.test(css), "Header pill menu should be positioned from the right side and moved 180px left.");
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
assert(/\.privacy-consent\s*{[\s\S]*?display:\s*grid[\s\S]*?padding-left:\s*150px/.test(css), "Main consultation privacy block should align with the form input column.");
assert(/\.privacy-consent-light\s*{[\s\S]*?padding-left:\s*162px/.test(css), "Consult page privacy block should align with the sub form input column.");
assert(/\.bottom-consult-agree input:checked,\s*\.privacy-consent-label input:checked\s*{[\s\S]*?box-shadow:\s*inset 0 0 0 4px var\(--primary\)/.test(css), "Consent checkboxes should show a shared distinct checked state.");
assert(/\.privacy-modal\s*{[\s\S]*?position:\s*fixed/.test(css), "Privacy consent details should open in a fixed modal.");
assert(/\.privacy-modal-dialog\s*{[\s\S]*?border-radius:\s*20px/.test(css), "Privacy consent modal should use the rounded reference dialog style.");
assert(siteText.includes("동의 거부 권리") && siteText.includes("주민등록번호") && siteText.includes("계좌번호"), "Privacy consent details should include refusal rights and warn against unique identifiers.");
assert(/\.bottom-consult select\.bottom-consult-control\s*{[\s\S]*?appearance:\s*none[\s\S]*?padding-right:\s*38px[\s\S]*?background-image:\s*url\("data:image\/svg\+xml/.test(css), "Bottom consult select should use the shared custom chevron with enough right padding.");
assert(/\.bottom-consult select\.bottom-consult-control\s*{[\s\S]*?background-position:\s*right 14px center/.test(css), "Bottom consult select chevron should keep the approved right margin.");
assert(/\.consult-reference-right \.consult-form \.form-row select,\s*\.consult-reference-right \.sub-consult-form \.sub-form-row select\s*{[\s\S]*?appearance:\s*none[\s\S]*?padding-right:\s*36px[\s\S]*?background-image:\s*url\("data:image\/svg\+xml/.test(css), "Reference consultation selects should use the shared custom chevron with enough text clearance.");
assert(/\.consult-reference-right \.consult-form \.form-row select,\s*\.consult-reference-right \.sub-consult-form \.sub-form-row select\s*{[\s\S]*?background-position:\s*right 2px center/.test(css), "Reference consultation select chevron should align with the underline field edge.");
assert(/\.bottom-consult select\.bottom-consult-control option,\s*\.consult-reference-right \.consult-form \.form-row select option,\s*\.consult-reference-right \.sub-consult-form \.sub-form-row select option\s*{[\s\S]*?padding:\s*10px 14px[\s\S]*?min-height:\s*36px[\s\S]*?line-height:\s*1\.45/.test(css), "Expanded select options should keep the approved padding and row height.");
assert(/\.bottom-consult select\.bottom-consult-control option:checked,\s*\.consult-reference-right \.consult-form \.form-row select option:checked,\s*\.consult-reference-right \.sub-consult-form \.sub-form-row select option:checked\s*{[\s\S]*?background-color:\s*var\(--primary\)/.test(css), "Expanded selected options should use the brand highlight color where the browser allows it.");
assert(/\.native-select-hidden\s*{[\s\S]*?display:\s*none !important/.test(css), "Native selects marked for custom rendering should be hidden after enhancement.");
assert(/\.custom-select-option\s*{[\s\S]*?padding:\s*10px 18px[\s\S]*?min-height:\s*38px[\s\S]*?text-align:\s*left/.test(css), "Custom dropdown option rows should have controlled left padding and height.");
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
assert(/left:\s*auto/.test(headerBlock) && /right:\s*calc\(clamp\(34px,\s*4vw,\s*76px\)\s*\+\s*180px\)/.test(headerBlock) && /translate:\s*0 0/.test(headerBlock), "Desktop header bar should be anchored to the right with a 180px left offset.");
assert(/@media \(max-width:\s*1024px\)[\s\S]*?\.header-bar\s*{[\s\S]*?right:\s*18px[\s\S]*?translate:\s*none/.test(css), "Tablet/mobile header bar should use the space freed by the removed hamburger menu.");

if (failures.length) {
  console.error(`Static checks failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Static checks passed.");
