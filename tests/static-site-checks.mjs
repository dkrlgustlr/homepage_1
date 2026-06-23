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
["대표 법무사", "권선기", "사업자등록번호", "577-53-00864", "주소", "경기도 화성시 영통로 59", "현대프라자 205호"].forEach((text) => {
  assert(footerHtml.includes(text) && layoutJs.includes(text), `Footer business information should include ${text}.`);
});
assert(!/(주요 업무|대응 분야|상담 권역|<strong>상호<\/strong>|<strong>업태\/종목<\/strong>|전문, 과학 및 기술서비스업|법무사업)/.test(footerHtml + layoutJs), "Footer should keep business information concise without service rows, company row, or business type row.");

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

assert(!/<section[^>]*class="[^"]*\bfaq-section\b[^"]*"/.test(knowledgeHtml), "Knowledge page should remove the separate FAQ section.");
assert(!/"@type":\s*"FAQPage"/.test(knowledgeHtml), "Knowledge page should remove FAQPage structured data when the FAQ section is hidden.");
assert(!knowledgeHtml.includes("질문형 콘텐츠는 검색과 AI 답변에 잘 읽히도록 주제와 조건, 예외를 함께 정리합니다."), "Knowledge page should not show the removed guide sentence above the cards.");
assert(knowledgeHtml.includes('id="knowledge-article-data"'), "Knowledge page should keep article detail content in page-local data.");
assert((knowledgeHtml.match(/data-knowledge-modal-open/g) || []).length >= 6, "Knowledge cards should open article details without separate article pages.");
assert(layoutJs.includes("initKnowledgeModal") && layoutJs.includes("knowledge-article-modal"), "layout.js should initialize the knowledge article modal.");
assert(/\.knowledge-modal\s*{[\s\S]*?position:\s*fixed/.test(css), "Knowledge article details should open in a fixed modal.");
assert(layoutJs.includes("knowledge-modal-news") && layoutJs.includes("knowledge-modal-section"), "Knowledge article modal should render article details in sectioned news-style blocks.");
assert(/\.knowledge-modal-dialog\s*{[\s\S]*?width:\s*min\(920px,\s*calc\(100vw - 40px\)\)/.test(css), "Knowledge article modal should use a wider desktop dialog.");
assert(!layoutJs.includes("knowledge-modal-rail") && !layoutJs.includes("핵심 요약"), "Knowledge article modal should remove the side summary rail.");
assert(/\.knowledge-modal-news\s*{[\s\S]*?display:\s*block/.test(css), "Knowledge article modal should use the full dialog width for article content.");
assert(/\.knowledge-modal-dialog h2\s*{[\s\S]*?font-size:\s*clamp\(28px,\s*2\.1vw,\s*36px\)/.test(css), "Knowledge article modal title should use a more restrained size.");
assert(/\.knowledge-modal-section\s*{[\s\S]*?border-top:\s*1px solid #dbe3ee/.test(css), "Knowledge article modal should visually divide each article section.");
assert(layoutJs.includes("실무상 쟁점") && layoutJs.includes("상담 시 확인할 점"), "Knowledge article modal should include professional section labels.");
assert(knowledgeHtml.includes("채무자회생 및 파산에 관한 법률") && knowledgeHtml.includes("변제계획안") && knowledgeHtml.includes("면책불허가"), "Knowledge article content should include more detailed professional context.");
assert(layoutJs.includes("knowledge-modal-thumb-wrap") && layoutJs.includes("knowledge-modal-thumb"), "Knowledge article modal should include a thumbnail image area.");
assert(layoutJs.includes('trigger.querySelector(".article-thumb")') && layoutJs.includes("dataset.thumb"), "Knowledge article modal should reuse the card thumbnail container source.");
assert(/\.knowledge-modal-head\s*{[\s\S]*?display:\s*grid[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)\s*280px/.test(css), "Knowledge article modal header should lay out title copy and thumbnail on desktop.");
assert(/\.knowledge-modal-thumb\s*{[\s\S]*?aspect-ratio:\s*16 \/ 10[\s\S]*?object-fit:\s*cover/.test(css), "Knowledge article modal thumbnail should keep a stable article image ratio.");
const knowledgeCardMarkup = (knowledgeHtml.match(/<button class="article-card"[\s\S]*?<\/button>/g) || []).join("\n");
assert((knowledgeCardMarkup.match(/class="article-thumb"/g) || []).length === 7 && (knowledgeCardMarkup.match(/class="article-body"/g) || []).length === 7, "Knowledge cards should use one shared thumbnail class and body containers.");
assert(!/<button class="article-card"[\s\S]*?<img\b/.test(knowledgeCardMarkup), "Knowledge cards should not render thumbnails as direct img elements.");
assert(!/article-thumb-(income|seizure|bankruptcy|business|documents|correction|job)/.test(knowledgeHtml + css), "Knowledge thumbnails should not use card-specific classes that can diverge placement.");
assert((knowledgeCardMarkup.match(/--article-thumb-image:\s*url\('/g) || []).length === 7, "Each knowledge thumbnail should pass only its image source through the shared CSS variable.");
assert(!knowledgeCardMarkup.includes('class="answer-label"') && !knowledgeCardMarkup.includes("핵심 답변"), "Knowledge cards should keep direct answers hidden until the article modal opens.");
assert(!knowledgeHtml.includes("핵심 답변"), "Knowledge page should not show the answer label before opening an article modal.");
assert(layoutJs.includes("knowledge-modal-answer") && layoutJs.includes("directAnswer"), "Knowledge modal should render a direct answer before detailed sections.");
assert(/\.article-thumb\s*{[\s\S]*?height:\s*150px[\s\S]*?background-image:\s*var\(--article-thumb-image\)[\s\S]*?background-position:\s*center center[\s\S]*?background-size:\s*cover[\s\S]*?overflow:\s*hidden/.test(css), "Knowledge card thumbnails should share one fixed-height background layout.");
const knowledgeAnswerBlock = getBlock(css, ".knowledge-modal-answer");
assert(!/border-left:\s*4px solid var\(--primary\)/.test(knowledgeAnswerBlock), "Knowledge modal answer should not use a thick blue left divider.");
assert(/background:\s*#f4f7fb/.test(knowledgeAnswerBlock) && /border:\s*1px solid #dbe3ee/.test(knowledgeAnswerBlock), "Knowledge modal answer should use a quiet full box treatment.");

const knowledgeStructuredData = getStructuredData(knowledgeHtml);
const knowledgeGraph = knowledgeStructuredData?.["@graph"] || [];
const knowledgeItemList = knowledgeGraph.find((node) => node["@id"] === "https://dkrlgustlr.github.io/homepage_1/knowledge.html#knowledge-list");
const knowledgeArticles = knowledgeItemList?.itemListElement?.map((entry) => entry.item) || [];
assert(knowledgeArticles.length === 7, "Knowledge structured data should describe all seven knowledge cards.");
assert(knowledgeArticles.every((article) => article.headline && article.description && article.image && article.keywords && article.about && article.mentions && article.mainEntityOfPage && article.datePublished && article.dateModified), "Each knowledge Article should include headline, description, image, keywords, entities, canonical page reference, and dates.");
assert(knowledgeArticles.some((article) => /개인회생 소득/.test(article.keywords)) && knowledgeArticles.some((article) => /급여압류 통장압류/.test(article.keywords)), "Knowledge Article keywords should target practical search and answer queries.");

assert(/<section[^>]*class="[^"]*\bservice-area-section\b[^"]*"/.test(aboutHtml), "About page should include local service-area content.");
assert(/화성/.test(aboutHtml) && /반월동/.test(aboutHtml) && /동탄/.test(aboutHtml) && /수원/.test(aboutHtml), "About page should mention the main local service areas.");
assert(/<main[^>]*class="[^"]*\babout-page\b[^"]*"/.test(aboutHtml), "About page should have a page-specific class for spacing adjustments.");
assert(/\.about-page \.sub-section \+ \.sub-section\s*{[\s\S]*?margin-top:\s*calc\(var\(--fit-gap-xl\) \+ 70px\)/.test(css), "About page sections should add 70px more vertical spacing on desktop.");
assert(/\.about-page \.sub-content > \.sub-section:first-child\s*{[\s\S]*?margin-top:\s*70px/.test(css), "About page should add 70px above the law office introduction section.");
assert(/\.about-page \.sub-content > \.service-area-section\s*{[\s\S]*?margin-bottom:\s*70px/.test(css), "About page should add 70px below the service-area section.");

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
assert(/\.footer-contact\s*{[\s\S]*?border-top:\s*1px solid rgba\(255,255,255,0\.22\)[\s\S]*?border-bottom:\s*1px solid rgba\(255,255,255,0\.22\)/.test(css), "Footer contact frame should draw matching top and bottom divider lines.");
assert(/\.footer-info li:last-child\s*{[\s\S]*?border-bottom:\s*0/.test(css), "Footer info should not draw a final bottom divider line.");
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
