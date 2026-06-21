(() => {
  const includes = [
    ["[data-include='header']", "header.html"],
    ["[data-include='footer']", "footer.html"]
  ];
  const OFFICE_EMAIL = "kkkk9628@nate.com";
  const OFFICE_SMS = "01065509628";
  const HEADER_FALLBACK_HTML = `
<header class="header">
  <div class="header-bar">
    <div class="header-bar-inner">
      <a class="consult-btn" href="tel:0312115230">
        <span class="pointer"></span>
        <span>법무사 상담 접수 031-211-5230</span>
      </a>
      <nav class="top-nav" aria-label="주요 메뉴">
        <a href="index.html">메인</a>
        <span class="divider">|</span>
        <a href="about.html">법무사소개</a>
        <span class="divider">|</span>
        <a href="cases.html">실제사례</a>
        <span class="divider">|</span>
        <a href="knowledge.html">지식센터</a>
        <span class="divider">|</span>
        <a href="consult.html">상담신청</a>
      </nav>
    </div>
  </div>
  <div class="header-top">
    <div class="hamburger">
      <span class="line"></span><span class="line"></span><span class="line"></span>
      <div>menu</div>
    </div>
  </div>
</header>`;
  const FOOTER_FALLBACK_HTML = `
<aside class="fixed-side">
  <div class="side-word">KWONSEONKI</div>
  <div class="quick-btn">
    <div class="quick-title">Menu</div>
    <div class="quick-item"><div class="quick-icon kakao">K</div><div>카카오톡</div></div>
    <div class="quick-item"><div class="quick-icon naver">N</div><div>예약</div></div>
    <div class="quick-item"><div class="quick-icon">☎</div><div>전화상담</div></div>
    <div class="quick-item"><div class="quick-icon red">↑</div></div>
  </div>
</aside>

<form class="bottom-consult" aria-label="하단 상담 신청" data-consult-form>
  <a class="bottom-consult-phone" href="tel:031-211-5230">
    <span class="phone-mark">☎</span>
    <span>대표전화</span>
    <strong>031-211-5230</strong>
  </a>
  <div class="bottom-consult-form">
    <label class="bottom-consult-label" for="bottom-case">사건 영역</label>
    <select class="bottom-consult-control" id="bottom-case" name="case_type" aria-label="사건 영역">
      <option>사건 영역</option>
      <option>개인회생</option>
      <option>개인파산</option>
      <option>압류 · 추심 대응</option>
      <option>면책 검토</option>
    </select>
    <label class="bottom-consult-label" for="bottom-name">이름</label>
    <input class="bottom-consult-control" id="bottom-name" name="name" type="text" autocomplete="name" placeholder="이름" aria-label="이름">
    <label class="bottom-consult-label" for="bottom-phone">전화번호</label>
    <input class="bottom-consult-control" id="bottom-phone" name="phone" type="tel" autocomplete="tel" placeholder="전화번호" aria-label="전화번호">
    <label class="bottom-consult-agree">
      <input type="checkbox" checked aria-label="개인정보 수집 및 이용 동의">
      <span>개인정보 수집 및 이용 동의</span>
    </label>
  </div>
  <button class="bottom-consult-submit" type="submit">상담 신청</button>
</form>

<footer class="footer" id="footer">
  <div class="footer-copy">
    <span class="footer-eyebrow">HWASEONG · BANWOL-DONG · HYUNDAI PLAZA</span>
    <h2>법무사 권선기 사무소</h2>
    <p>개인회생, 개인파산, 면책, 압류·추심 대응까지 현재 상황에 맞는 절차를 차분하게 검토합니다. 경기도 화성시 영통로 59, <span class="text-nowrap">현대프라자 205호</span>에서 방문 상담을 안내합니다.</p>
    <div class="footer-actions">
      <a class="footer-action primary" href="consult.html">상담 신청하기</a>
      <a class="footer-action" href="about.html#office">오시는 길</a>
    </div>
  </div>
  <div class="footer-contact">
    <div class="call">031-211-5230<span>FAX. 031-211-5233</span></div>
    <ul class="footer-info">
      <li><strong>주요 업무</strong><span>개인회생 · 개인파산 · 면책</span></li>
      <li><strong>대응 분야</strong><span>압류 · 추심 · 보정권고</span></li>
      <li><strong>상담 권역</strong><span>화성 · 반월동 · 동탄</span></li>
    </ul>
  </div>
</footer>`;

  const fallbackMarkup = (url) => {
    if (url === "header.html") return HEADER_FALLBACK_HTML;
    if (url === "footer.html") return FOOTER_FALLBACK_HTML;
    return "";
  };

  const loadInclude = async ([selector, url]) => {
    const target = document.querySelector(selector);
    if (!target) return;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
      target.outerHTML = await response.text();
    } catch (error) {
      const html = fallbackMarkup(url);
      if (!html) throw error;
      target.insertAdjacentHTML("beforebegin", html);
      target.remove();
      console.warn(`Using embedded fallback for ${url}`, error);
    }
  };

  const markActiveNav = () => {
    const current = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".top-nav a").forEach((link) => {
      const href = link.getAttribute("href") || "";
      link.classList.toggle("is-active", href === current);
    });
  };

  const initSubpageAnimations = () => {
    const targets = [
      ...document.querySelectorAll(".sub-heading, .sub-card, .service-area-card, .article-card, .faq-item, .sub-consult-panel, .sub-consult-form, .sub-table tbody tr")
    ];

    if (!targets.length) return;

    targets.forEach((element) => {
      const parent = element.closest(".sub-grid, .article-list, tbody, .sub-consult-layout") || element.parentElement;
      const index = parent ? Array.from(parent.children).indexOf(element) : 0;
      const delay = Math.min(Math.max(index, 0) * 0.055, 0.32);
      element.classList.add("sub-reveal");
      element.style.setProperty("--sub-reveal-delay", `${delay}s`);
    });

    if (!("IntersectionObserver" in window)) {
      targets.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px"
    });

    targets.forEach((element) => observer.observe(element));
  };

  const getFieldValue = (form, name) => {
    const field = form.elements[name];
    return field ? String(field.value || "").trim() : "";
  };

  const initConsultForms = () => {
    document.querySelectorAll("[data-consult-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const caseType = getFieldValue(form, "case_type") || "상담 분야 미선택";
        const name = getFieldValue(form, "name");
        const phone = getFieldValue(form, "phone");
        const area = getFieldValue(form, "area");
        const message = getFieldValue(form, "message");

        if (!phone) {
          alert("연락 가능한 전화번호를 입력해주세요.");
          if (form.elements.phone) form.elements.phone.focus();
          return;
        }

        const lines = [
          "[법무사 권선기 사무소 상담 신청]",
          `상담 분야: ${caseType}`,
          name ? `이름: ${name}` : null,
          `전화번호: ${phone}`,
          area ? `지역: ${area}` : null,
          message ? `문의내용: ${message}` : null
        ].filter(Boolean);
        const body = encodeURIComponent(lines.join("\n"));
        const subject = encodeURIComponent("홈페이지 상담 신청");
        const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
        const smsSeparator = /iPhone|iPad|iPod/i.test(navigator.userAgent) ? "&" : "?";

        window.location.href = isMobile
          ? `sms:${OFFICE_SMS}${smsSeparator}body=${body}`
          : `mailto:${OFFICE_EMAIL}?subject=${subject}&body=${body}`;
      });
    });
  };

  window.__layoutReady = Promise.all(includes.map(loadInclude)).then(() => {
    markActiveNav();
    initSubpageAnimations();
    initConsultForms();
  }).catch((error) => {
    console.error("Layout include failed", error);
  });
})();
