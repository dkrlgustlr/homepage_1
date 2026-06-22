(() => {
  const includes = [
    ["[data-include='header']", "header.html"],
    ["[data-include='footer']", "footer.html"]
  ];
  const OFFICE_EMAIL = "kkkk9628@nate.com";
  const OFFICE_SMS = "15885986";
  const HEADER_FALLBACK_HTML = `
<header class="header">
  <div class="header-bar">
    <div class="header-bar-inner">
      <a class="consult-btn" href="tel:15885986">
        <span class="pointer"></span>
        <span>법무사 상담 접수 1588-5986</span>
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
</header>`;
  const FOOTER_FALLBACK_HTML = `
<aside class="fixed-side">
  <div class="side-word">KWONSEONKI</div>
  <div class="quick-btn">
    <div class="quick-title">Menu</div>
    <div class="quick-item"><div class="quick-icon kakao"><img src="mockup_assets/icon-kakaotalk-talk-provided.png" alt="" aria-hidden="true"></div><div class="quick-label">카카오톡</div></div>
    <div class="quick-item"><div class="quick-icon phone"><img src="mockup_assets/icon-phone-blue.png" alt="" aria-hidden="true"></div><div class="quick-label">전화상담</div></div>
    <div class="quick-item"><div class="quick-icon red">↑</div><div class="quick-label">TOP</div></div>
  </div>
</aside>

<form class="bottom-consult" aria-label="하단 상담 신청" data-consult-form>
  <a class="bottom-consult-phone" href="tel:15885986">
    <span class="phone-mark"><img src="mockup_assets/icon-phone-blue.png" alt="" aria-hidden="true"></span>
    <span>대표전화</span>
    <strong>1588-5986</strong>
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
    <div class="bottom-consult-agree">
      <label class="bottom-consult-agree-check">
        <input type="checkbox" name="privacy_consent" required aria-label="개인정보 수집 및 이용 동의">
        <span>개인정보 수집 및 이용 동의</span>
      </label>
      <details class="bottom-privacy-detail">
        <summary>내용보기</summary>
        <div class="bottom-privacy-panel">
          <strong>개인정보 수집 및 이용 안내</strong>
          <p><b>수집 항목</b> 이름, 전화번호, 지역, 상담 분야, 문의 내용</p>
          <p><b>이용 목적</b> 상담 신청 내용 확인, 전화 또는 문자 상담 안내, 방문 상담 일정 조율</p>
          <p><b>보유 기간</b> 상담 신청일로부터 1년간 보관 후 파기합니다. 수임계약 체결 시 사건 처리 및 관련 법령에 따른 보존기간 동안 보관될 수 있습니다.</p>
          <p><b>동의 거부 권리</b> 동의하지 않을 권리가 있으나, 홈페이지 상담 신청이 제한될 수 있습니다.</p>
          <p><b>안내 사항</b> 주민등록번호, 계좌번호 등 고유식별정보는 입력하지 마시기 바랍니다.</p>
        </div>
      </details>
    </div>
  </div>
  <button class="bottom-consult-submit" type="submit">상담 신청</button>
</form>

<footer class="footer" id="footer">
  <div class="footer-copy">
    <span class="footer-eyebrow">HWASEONG · BANWOL-DONG · HYUNDAI PLAZA</span>
    <h2>법무사 권선기 사무소</h2>
    <p>20년 경력, 2천 건 이상 상담·처리 경험, 사무소 제공 기준 95% 승률을 바탕으로 개인회생, 개인파산, 채권추심·통장압류 대응을 차분하게 검토합니다. 전화상담 후 경기도 화성시 영통로 59, <span class="text-nowrap">현대프라자 205호</span> 방문 상담을 안내합니다.</p>
    <div class="footer-actions">
      <a class="footer-action primary" href="consult.html">상담 신청하기</a>
      <a class="footer-action" href="about.html#office">오시는 길</a>
    </div>
  </div>
  <div class="footer-contact">
    <div class="call">1588-5986<span>FAX. 1588-5986</span></div>
    <ul class="footer-info">
      <li><strong>주요 업무</strong><span>개인회생 · 개인파산 · 면책</span></li>
      <li><strong>대응 분야</strong><span>채권추심 · 통장압류 · 보정권고</span></li>
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

  const initFloatingContrast = () => {
    const sideWord = document.querySelector(".side-word");
    if (!sideWord) return;

    const darkSectionSelector = ".hero, .case-section, .consult-section, .footer, .sub-hero";
    let ticking = false;

    const isDarkSectionAt = (viewportY) => {
      const darkSections = Array.from(document.querySelectorAll(darkSectionSelector));
      return darkSections.some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= viewportY && rect.bottom >= viewportY;
      });
    };

    const updateFloatingContrast = () => {
      if (sideWord) {
        const rect = sideWord.getBoundingClientRect();
        const pointY = rect.top + rect.height / 2;
        sideWord.classList.toggle("is-over-dark", Boolean(isDarkSectionAt(pointY)));
      }
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateFloatingContrast();
        ticking = false;
      });
    };

    updateFloatingContrast();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
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
        const privacyConsent = form.elements.privacy_consent;

        if (!phone) {
          alert("연락 가능한 전화번호를 입력해주세요.");
          if (form.elements.phone) form.elements.phone.focus();
          return;
        }

        if (privacyConsent && !privacyConsent.checked) {
          alert("개인정보 수집 및 이용에 동의해주세요.");
          privacyConsent.focus();
          return;
        }

        const lines = [
          "[법무사 권선기 사무소 상담 신청]",
          `상담 분야: ${caseType}`,
          name ? `이름: ${name}` : null,
          `전화번호: ${phone}`,
          area ? `지역: ${area}` : null,
          message ? `문의내용: ${message}` : null,
          "개인정보 수집 및 이용 동의: 동의"
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
    initFloatingContrast();
    initSubpageAnimations();
    initConsultForms();
  }).catch((error) => {
    console.error("Layout include failed", error);
  });
})();
