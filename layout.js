(() => {
  const includes = [
    ["[data-include='header']", "header.html"],
    ["[data-include='footer']", "footer.html"]
  ];
  const OFFICE_EMAIL = "kkkk9628@nate.com";
  const OFFICE_SMS = "01065509628";

  const loadInclude = async ([selector, url]) => {
    const target = document.querySelector(selector);
    if (!target) return;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
    target.outerHTML = await response.text();
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
      ...document.querySelectorAll(".sub-heading, .sub-card, .article-card, .sub-consult-panel, .sub-consult-form, .sub-table tbody tr")
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
