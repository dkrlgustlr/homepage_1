(() => {
  const INCLUDE_VERSION = "20260624-mobile9";
  const includes = [
    ["[data-include='header']", `header.html?v=${INCLUDE_VERSION}`],
    ["[data-include='footer']", `footer.html?v=${INCLUDE_VERSION}`]
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
      <button class="mobile-menu-toggle" type="button" aria-controls="mobile-nav-panel" aria-expanded="false" aria-label="메뉴 열기" data-mobile-menu-toggle>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav class="top-nav" id="mobile-nav-panel" aria-label="주요 메뉴">
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
      <button class="mobile-nav-backdrop" type="button" aria-label="메뉴 닫기" data-mobile-menu-close></button>
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

<form class="bottom-consult" aria-label="하단 상담 신청" action="send-consult.php" method="post" data-consult-form>
  <a class="bottom-consult-phone" href="tel:15885986">
    <span>대표전화</span>
    <strong>1588-5986</strong>
  </a>
  <div class="bottom-consult-form">
    <label class="bottom-consult-label" for="bottom-case">상담 분야</label>
    <select class="bottom-consult-control" id="bottom-case" name="case_type" aria-label="상담 분야" data-custom-select>
      <option value="">상담 분야</option>
      <option>개인회생</option>
      <option>개인파산</option>
      <option>압류·추심 대응</option>
      <option>직장인 채무</option>
      <option>자영업자 채무</option>
      <option>면책 검토</option>
      <option>보정권고 대응</option>
    </select>
    <label class="bottom-consult-label" for="bottom-name">이름</label>
    <input class="bottom-consult-control" id="bottom-name" name="name" type="text" autocomplete="name" placeholder="이름" aria-label="이름">
    <label class="bottom-consult-label" for="bottom-phone">전화번호</label>
    <input class="bottom-consult-control" id="bottom-phone" name="phone" type="tel" autocomplete="tel" placeholder="전화번호" aria-label="전화번호">
    <div class="bottom-consult-agree">
      <label class="bottom-consult-agree-check">
        <input type="checkbox" name="privacy_consent" required aria-label="개인정보 수집 및 이용 동의">
      </label>
      <button class="privacy-consent-trigger bottom-privacy-trigger" type="button" data-privacy-modal-open>개인정보 수집 및 이용 동의</button>
    </div>
  </div>
  <button class="bottom-consult-submit" type="submit">상담 신청</button>
</form>

<footer class="footer" id="footer">
  <div class="footer-copy">
    <span class="footer-eyebrow">HWASEONG · BANWOL-DONG · HYUNDAI PLAZA</span>
    <h2>법무사 권선기 사무소</h2>
    <p>20년 경력, 2천 건 이상 상담·처리 경험, 사무소 제공 기준 95% 승률을 바탕으로 개인회생, 개인파산, 채권추심·통장압류 대응을 차분하게 검토합니다.</p>
    <div class="footer-actions">
      <a class="footer-action primary" href="consult.html">상담 신청하기</a>
      <a class="footer-action" href="index.html#location">오시는 길</a>
    </div>
    <div class="footer-privacy-box">
      <button class="footer-privacy-link" type="button" data-privacy-modal-open>개인정보 수집 및 이용 동의</button>
    </div>
  </div>
  <div class="footer-contact">
    <div class="call">1588-5986<span>FAX. 0504-470-9628</span></div>
    <ul class="footer-info">
      <li><strong>대표 법무사</strong><span>권선기</span></li>
      <li><strong>사업자등록번호</strong><span>577-53-00864</span></li>
      <li><strong>주소</strong><span>경기도 화성시 영통로 59, 현대프라자 205호(반월동)</span></li>
    </ul>
  </div>
</footer>`;

  const fallbackMarkup = (url) => {
    const path = url.split("?")[0];
    if (path === "header.html") return HEADER_FALLBACK_HTML;
    if (path === "footer.html") return FOOTER_FALLBACK_HTML;
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

  const initMobileNav = () => {
    const header = document.querySelector(".header");
    const toggle = document.querySelector("[data-mobile-menu-toggle]");
    const panel = document.getElementById(toggle?.getAttribute("aria-controls") || "");
    if (!header || !toggle || !panel) return;

    const setOpen = (open) => {
      header.classList.toggle("is-mobile-menu-open", open);
      document.documentElement.classList.toggle("mobile-nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    };

    const closeMenu = () => setOpen(false);

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    document.querySelectorAll("[data-mobile-menu-close]").forEach((button) => {
      button.addEventListener("click", closeMenu);
    });

    panel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.matchMedia("(min-width: 1025px)").addEventListener("change", closeMenu);
  };

  const initFloatingContrast = () => {
    const sideWord = document.querySelector(".side-word");
    if (!sideWord) return;

    const darkSectionSelector = ".hero, .case-section, .consult-section, .footer, .sub-hero, .consult-reference-right";
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
      ...document.querySelectorAll(".sub-heading, .sub-card, .service-area-card, .faq-item, .sub-consult-panel, .sub-consult-form, .consult-reference-left, .consult-proof-grid div, .consult-check-list li, .sub-table tbody tr")
    ];

    if (!targets.length) return;

    targets.forEach((element) => {
      const parent = element.closest(".sub-grid, .article-list, tbody, .sub-consult-layout, .consult-reference-section, .consult-proof-grid, .consult-check-list") || element.parentElement;
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

  const initCountUpStats = () => {
    const numbers = Array.from(document.querySelectorAll("[data-count-to]"));
    if (!numbers.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const formatValue = (element, value) => {
      const decimals = Number(element.dataset.countDecimals || "0");
      return decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
    };

    const runCount = (element, index) => {
      if (element.dataset.counted === "true") return;
      element.dataset.counted = "true";

      const target = Number(element.dataset.countTo || "0");
      if (!Number.isFinite(target)) return;

      if (prefersReducedMotion) {
        element.textContent = formatValue(element, target);
        return;
      }

      const duration = Number(element.dataset.countDuration || "1200");
      const delay = Number(element.dataset.countDelay || index * 95);

      window.setTimeout(() => {
        const startTime = performance.now();
        element.textContent = formatValue(element, 0);
        element.classList.add("is-counting");

        const tick = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          element.textContent = formatValue(element, target * eased);

          if (progress < 1) {
            requestAnimationFrame(tick);
            return;
          }

          element.textContent = formatValue(element, target);
          element.classList.remove("is-counting");
          element.classList.add("is-counted");
        };

        requestAnimationFrame(tick);
      }, delay);
    };

    numbers.forEach((element, index) => {
      element.style.setProperty("--count-order", index);
    });

    if (!("IntersectionObserver" in window)) {
      numbers.forEach(runCount);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = numbers.indexOf(entry.target);
        runCount(entry.target, Math.max(index, 0));
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.35,
      rootMargin: "0px 0px -10% 0px"
    });

    numbers.forEach((element) => observer.observe(element));
  };

  const initMainKnowledgeTabs = () => {
    const section = document.querySelector(".knowledge-row");
    if (!section) return;

    const filters = Array.from(section.querySelectorAll(".knowledge-filter[data-knowledge-topic]"));
    const grid = section.querySelector(".column-grid");
    const title = section.querySelector(".knowledge-right .page-title h2");
    const headline = section.querySelector(".knowledge-right .section-headline");
    if (!filters.length || !grid || !title || !headline) return;

    const topics = {
      rehabilitation: {
        title: "법률정보",
        headline: ["회생·파산 절차에서", "먼저 확인할 기준입니다."],
        cards: [
          ["개인회생", "개인회생 신청 전 반드시 확인할 소득 기준", "반복 소득, 최저생계비, 매달 납부 가능한 변제금을 먼저 확인합니다.", "mockup_assets/knowledge_thumb_1_v2.png", "개인회생 소득 기준", "knowledge.html#income-standard"],
          ["개인파산", "파산과 면책을 함께 검토해야 하는 이유", "파산은 절차이고 면책은 남은 채무 책임을 정리하는 판단 단계입니다.", "mockup_assets/knowledge_thumb_3_v2.png", "개인파산 면책 검토", "knowledge.html#bankruptcy-discharge"],
          ["자영업자 채무", "폐업 후 남은 채무를 정리할 때 필요한 자료", "사업자 대출, 카드채무, 보증채무, 폐업 자료를 함께 정리합니다.", "mockup_assets/knowledge_thumb_4_v2.png", "자영업자 채무 자료", "knowledge.html#business-debt-documents"]
        ]
      },
      seizure: {
        title: "압류·추심 대응",
        headline: ["압류와 채권추심은", "진행 단계부터 구분합니다."],
        cards: [
          ["압류·추심 대응", "급여압류와 통장압류가 걱정될 때 보는 순서", "압류 진행 여부와 추심 상황을 확인한 뒤 금지명령 가능성을 검토합니다.", "mockup_assets/knowledge_thumb_2_v2.png", "급여압류 통장압류 대응", "knowledge.html#seizure-order"],
          ["압류·추심 대응", "추심 문자와 전화가 계속될 때 먼저 확인할 점", "발신 주체, 채권 양도 여부, 법원 절차 진행 여부를 나누어 봅니다.", "mockup_assets/knowledge_thumb_6_v2.png", "채권추심 대응", "knowledge.html#collection-notice"],
          ["생활비 보호", "압류된 통장에서 생활비를 확보할 수 있나요?", "압류금지채권과 생계비 보호 가능성을 자료로 확인합니다.", "mockup_assets/knowledge_thumb_5_v2.png", "압류금지채권 생활비", "knowledge.html#frozen-account-living"]
        ]
      },
      documents: {
        title: "서류 준비",
        headline: ["상담 전 자료를", "빠짐없이 정리합니다."],
        cards: [
          ["기본자료", "상담 전 준비하면 좋은 채무·재산·소득 자료", "채무내역, 소득자료, 재산자료, 압류·추심 관련 서류를 함께 봅니다.", "mockup_assets/knowledge_thumb_5_v2.png", "상담 전 준비 서류", "knowledge.html#basic-documents"],
          ["소득자료", "직장인·자영업자·프리랜서 소득은 다르게 봅니다", "급여명세, 매출자료, 입금내역처럼 실제 소득 흐름을 확인합니다.", "mockup_assets/knowledge_thumb_4_v2.png", "소득자료 정리", "knowledge.html#income-documents"],
          ["보정권고 대응", "누락 자료가 있으면 보정권고로 이어질 수 있습니다", "법원이 요구할 가능성이 큰 자료를 상담 단계에서 먼저 점검합니다.", "mockup_assets/knowledge_thumb_6_v2.png", "보정권고 자료 보완", "knowledge.html#correction-order-documents"]
        ]
      },
      checklist: {
        title: "상담 전 체크사항",
        headline: ["현재 상황을", "짧은 기준으로 점검합니다."],
        cards: [
          ["채무현황", "채무 규모와 연체 기간을 먼저 정리해야 합니다", "카드대금(카드값), 대출, 보증채무, 사채 여부를 나누어 상담 방향을 잡습니다.", "mockup_assets/knowledge_thumb_1_v2.png", "채무현황 체크", "knowledge.html#debt-status-check"],
          ["긴급상황", "압류·추심·지급명령 여부를 확인합니다", "법원 서류를 받았는지, 계좌나 급여 압류가 시작됐는지 먼저 봅니다.", "mockup_assets/knowledge_thumb_2_v2.png", "긴급 채무 상황 확인", "knowledge.html#urgent-legal-check"],
          ["절차선택", "개인회생과 개인파산 중 어떤 절차가 맞을까요?", "소득 유지 가능성과 재산·부양가족·면책 사유를 함께 검토합니다.", "mockup_assets/knowledge_thumb_3_v2.png", "개인회생 개인파산 절차 선택", "knowledge.html#procedure-choice"]
        ]
      },
      court: {
        title: "법원 절차 안내",
        headline: ["법원 절차는", "기한과 제출자료가 중요합니다."],
        cards: [
          ["보정권고 대응", "법원 보정권고가 나왔을 때 당황하지 않는 방법", "요구 자료와 제출 기한을 확인하고 누락된 내용을 보완합니다.", "mockup_assets/knowledge_thumb_6_v2.png", "법원 보정권고 대응", "knowledge.html#court-correction-order"],
          ["면책절차", "면책 판단에서 법원이 주로 확인하는 부분", "채무 발생 원인, 재산 처분, 최근 거래 내역을 중심으로 봅니다.", "mockup_assets/knowledge_thumb_3_v2.png", "개인파산 면책 절차", "knowledge.html#discharge-review"],
          ["지급명령", "지급명령을 받으면 이의신청 기간부터 봅니다", "송달일, 채무 인정 여부, 이의신청 가능성을 기한 안에 확인합니다.", "mockup_assets/knowledge_thumb_2_v2.png", "지급명령 이의신청", "knowledge.html#payment-order-objection"]
        ]
      }
    };

    const createCard = ([categoryText, titleText, summaryText, imageSrc, imageAlt, cardHref]) => {
      const card = document.createElement("a");
      card.className = "column-card";
      card.href = cardHref || "knowledge.html";

      const thumb = document.createElement("div");
      thumb.className = "thumb";
      const image = document.createElement("img");
      image.src = imageSrc;
      image.alt = imageAlt;
      image.loading = "lazy";
      image.decoding = "async";
      thumb.append(image);

      const text = document.createElement("div");
      text.className = "column-text";
      const category = document.createElement("div");
      category.className = "cat";
      category.textContent = categoryText;
      const cardTitle = document.createElement("div");
      cardTitle.className = "title";
      cardTitle.textContent = titleText;
      const summary = document.createElement("p");
      summary.className = "summary";
      summary.textContent = summaryText;
      text.append(category, cardTitle, summary);
      card.append(thumb, text);

      return card;
    };

    const animateCards = () => {
      grid.classList.remove("is-topic-entering");
      void grid.offsetWidth;
      grid.classList.add("is-topic-entering");
      window.setTimeout(() => {
        grid.classList.remove("is-topic-entering");
      }, 820);
    };

    const renderTopic = (topicKey, animate = true) => {
      const topic = topics[topicKey] || topics.rehabilitation;
      title.textContent = topic.title;
      headline.replaceChildren(
        document.createTextNode(topic.headline[0]),
        document.createElement("br"),
        Object.assign(document.createElement("strong"), { textContent: topic.headline[1] })
      );
      grid.replaceChildren(...topic.cards.map(createCard));
      grid.scrollTo({ left: 0 });
      if (animate) animateCards();

      filters.forEach((filter) => {
        const active = filter.dataset.knowledgeTopic === topicKey;
        filter.setAttribute("aria-pressed", String(active));
        filter.closest("li")?.classList.toggle("is-active", active);
      });
    };

    filters.forEach((filter) => {
      filter.addEventListener("click", () => renderTopic(filter.dataset.knowledgeTopic, true));
    });

    const activeFilter = filters.find((filter) => filter.getAttribute("aria-pressed") === "true") || filters[0];
    renderTopic(activeFilter.dataset.knowledgeTopic, false);
  };

  const getFieldValue = (form, name) => {
    const field = form.elements[name];
    return field ? String(field.value || "").trim() : "";
  };

  const initCustomSelects = () => {
    const selects = Array.from(document.querySelectorAll("select[data-custom-select]"));
    if (!selects.length) return;

    const closeCustomSelect = (field) => {
      if (!field) return;
      const button = field.querySelector(".custom-select-button");
      const list = field.querySelector(".custom-select-list");
      field.classList.remove("is-open");
      button?.setAttribute("aria-expanded", "false");
      if (list) list.hidden = true;
    };

    const closeAllCustomSelects = (except = null) => {
      document.querySelectorAll(".custom-select.is-open").forEach((field) => {
        if (field !== except) closeCustomSelect(field);
      });
    };

    selects.forEach((select, selectIndex) => {
      if (select.dataset.customReady === "true") return;

      select.dataset.customReady = "true";
      select.classList.add("native-select-hidden");

      const isBottom = select.classList.contains("bottom-consult-control");
      const field = document.createElement("div");
      const button = document.createElement("button");
      const value = document.createElement("span");
      const chevron = document.createElement("span");
      const list = document.createElement("div");
      const listId = `${select.id || `custom-select-${selectIndex}`}-list`;

      field.className = `custom-select ${isBottom ? "custom-select--bottom" : "custom-select--line"}`;
      button.className = "custom-select-button";
      button.type = "button";
      button.setAttribute("aria-haspopup", "listbox");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", listId);
      value.className = "custom-select-value";
      chevron.className = "custom-select-chevron";
      chevron.setAttribute("aria-hidden", "true");
      list.className = "custom-select-list";
      list.id = listId;
      list.role = "listbox";
      list.hidden = true;

      const options = Array.from(select.options);

      const syncSelected = () => {
        const selectedIndex = Math.max(select.selectedIndex, 0);
        const selectedOption = options[selectedIndex] || options[0];
        value.textContent = selectedOption ? selectedOption.textContent.trim() : "";
        list.querySelectorAll(".custom-select-option").forEach((optionButton, index) => {
          const isSelected = index === selectedIndex;
          optionButton.classList.toggle("is-selected", isSelected);
          optionButton.setAttribute("aria-selected", String(isSelected));
        });
      };

      const setOpen = (open) => {
        if (open) {
          closeAllCustomSelects(field);
          field.classList.add("is-open");
          button.setAttribute("aria-expanded", "true");
          list.hidden = false;
          return;
        }
        closeCustomSelect(field);
      };

      const chooseOption = (index) => {
        if (!options[index]) return;
        select.selectedIndex = index;
        syncSelected();
        select.dispatchEvent(new Event("change", { bubbles: true }));
      };

      options.forEach((option, index) => {
        const optionButton = document.createElement("button");
        optionButton.className = "custom-select-option";
        optionButton.type = "button";
        optionButton.role = "option";
        optionButton.tabIndex = -1;
        optionButton.textContent = option.textContent.trim();
        optionButton.addEventListener("click", () => {
          chooseOption(index);
          setOpen(false);
          button.focus();
        });
        list.appendChild(optionButton);
      });

      button.append(value, chevron);
      field.append(button, list);
      select.insertAdjacentElement("afterend", field);
      syncSelected();

      button.addEventListener("click", () => {
        setOpen(!field.classList.contains("is-open"));
      });

      button.addEventListener("keydown", (event) => {
        const currentIndex = Math.max(select.selectedIndex, 0);
        let nextIndex = currentIndex;

        if (event.key === "ArrowDown") nextIndex = Math.min(currentIndex + 1, options.length - 1);
        if (event.key === "ArrowUp") nextIndex = Math.max(currentIndex - 1, 0);
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = options.length - 1;

        if (nextIndex !== currentIndex || ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          setOpen(true);
          chooseOption(nextIndex);
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setOpen(!field.classList.contains("is-open"));
        }
      });

      select.addEventListener("change", syncSelected);
    });

    if (document.documentElement.dataset.customSelectEvents === "true") return;
    document.documentElement.dataset.customSelectEvents = "true";

    document.addEventListener("click", (event) => {
      if (event.target.closest(".custom-select")) return;
      closeAllCustomSelects();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeAllCustomSelects();
    });
  };

  const resetConsultForm = (form) => {
    form.reset();
    form.querySelectorAll("select[data-custom-select]").forEach((select) => {
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
  };

  const submitConsultFormToServer = async (form) => {
    const action = form.getAttribute("action");
    if (!action || !window.fetch || !window.FormData) return false;

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton?.textContent;

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "접수 중...";
      }

      const formData = new FormData(form);
      formData.set("page_url", window.location.href);

      const response = await fetch(action, {
        method: form.getAttribute("method") || "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Consult form server submit failed");
      }

      alert(result.message || "상담 신청이 접수되었습니다. 확인 후 연락드리겠습니다.");
      resetConsultForm(form);
      return true;
    } catch (error) {
      console.warn("Consult form server submit failed", error);
      return false;
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    }
  };

  const initConsultForms = () => {
    document.querySelectorAll("[data-consult-form]").forEach((form) => {
      form.addEventListener("submit", async (event) => {
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
        const serverSubmitted = await submitConsultFormToServer(form);
        if (serverSubmitted) return;

        window.location.href = isMobile
          ? `sms:${OFFICE_SMS}${smsSeparator}body=${body}`
          : `mailto:${OFFICE_EMAIL}?subject=${subject}&body=${body}`;
      });
    });
  };

  const initPrivacyModal = () => {
    let lastFocusedElement = null;

    const ensureModal = () => {
      let modal = document.getElementById("privacy-consent-modal");
      if (modal) return modal;

      document.body.insertAdjacentHTML("beforeend", `
<div class="privacy-modal" id="privacy-consent-modal" aria-hidden="true">
  <div class="privacy-modal-backdrop" data-privacy-modal-close></div>
  <section class="privacy-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="privacy-modal-title" tabindex="-1">
    <button class="privacy-modal-close" type="button" data-privacy-modal-close aria-label="개인정보 수집 및 이용 동의 닫기">&times;</button>
    <h2 id="privacy-modal-title">개인정보 수집 및 이용 동의</h2>
    <div class="privacy-modal-body">
      <section>
        <h3>수집하는 개인정보의 항목</h3>
        <p>상담 신청과 방문 상담 안내를 위해 아래와 같은 개인정보를 수집합니다.</p>
        <ul>
          <li><strong>수집 항목</strong> 이름, 전화번호, 지역, 상담 분야, 문의 내용</li>
          <li><strong>개인정보 수집방법</strong> 홈페이지 상담 신청</li>
        </ul>
      </section>
      <section>
        <h3>개인정보의 수집 및 이용목적</h3>
        <p>상담 신청 내용 확인, 전화 또는 문자 상담 안내, 방문 상담 일정 조율, 개인회생·개인파산·면책·채권추심·압류 대응 관련 상담 진행을 위해 활용합니다.</p>
      </section>
      <section>
        <h3>개인정보의 보유 및 이용기간</h3>
        <p>상담 신청일로부터 1년간 보관 후 파기합니다. 단, 상담 후 수임계약이 체결되는 경우 사건 처리 및 관련 법령에 따른 보존기간 동안 보관될 수 있습니다.</p>
      </section>
      <section>
        <h3>동의 거부 권리 및 안내사항</h3>
        <p>개인정보 수집 및 이용에 동의하지 않을 권리가 있으나, 동의하지 않을 경우 홈페이지를 통한 상담 신청이 제한될 수 있습니다. 상담 신청 단계에서는 주민등록번호, 계좌번호 등 고유식별정보를 입력하지 마시기 바랍니다.</p>
      </section>
    </div>
  </section>
</div>`);
      modal = document.getElementById("privacy-consent-modal");
      return modal;
    };

    const getModal = () => document.getElementById("privacy-consent-modal");
    const getDialog = () => getModal()?.querySelector(".privacy-modal-dialog");

    const closeModal = () => {
      const modal = getModal();
      if (!modal || modal.getAttribute("aria-hidden") === "true") return;
      modal.setAttribute("aria-hidden", "true");
      document.documentElement.classList.remove("privacy-modal-open");
      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
      }
    };

    const openModal = (trigger) => {
      const modal = ensureModal();
      lastFocusedElement = trigger;
      modal.setAttribute("aria-hidden", "false");
      document.documentElement.classList.add("privacy-modal-open");
      requestAnimationFrame(() => getDialog()?.focus());
    };

    document.addEventListener("click", (event) => {
      const openTrigger = event.target.closest("[data-privacy-modal-open]");
      if (openTrigger) {
        event.preventDefault();
        openModal(openTrigger);
        return;
      }

      if (event.target.closest("[data-privacy-modal-close]")) {
        event.preventDefault();
        closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal();
    });
  };

  const initKnowledgePagination = () => {
    const list = document.querySelector("[data-knowledge-article-list]");
    const pagination = document.querySelector("[data-article-pagination]");
    if (!list || !pagination) return;

    const cards = Array.from(list.children).filter((element) => element.classList.contains("article-card"));
    const perPage = 6;
    const pageCount = Math.ceil(cards.length / perPage);

    if (pageCount <= 1) {
      pagination.hidden = true;
      return;
    }

    let currentPage = 1;
    const shouldAnimate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const playPageChange = () => {
      if (!shouldAnimate) return;
      list.classList.remove("is-page-changing");
      void list.offsetWidth;
      list.classList.add("is-page-changing");
    };

    const showPage = (page, focusButton = false) => {
      currentPage = Math.min(Math.max(page, 1), pageCount);
      const start = (currentPage - 1) * perPage;
      const end = start + perPage;

      cards.forEach((card, index) => {
        const isVisible = index >= start && index < end;
        card.hidden = !isVisible;
        if (isVisible) {
          card.removeAttribute("aria-hidden");
        } else {
          card.setAttribute("aria-hidden", "true");
        }
      });

      Array.from(pagination.children).forEach((button, index) => {
        const isCurrent = index + 1 === currentPage;
        button.classList.toggle("is-active", isCurrent);
        if (isCurrent) {
          button.setAttribute("aria-current", "page");
        } else {
          button.removeAttribute("aria-current");
        }
      });

      if (focusButton) {
        pagination.children[currentPage - 1]?.focus({ preventScroll: true });
        playPageChange();
      }
    };

    const buttons = Array.from({ length: pageCount }, (_, index) => {
      const page = index + 1;
      const button = document.createElement("button");
      button.className = "article-page-button";
      button.type = "button";
      button.textContent = String(page);
      button.setAttribute("aria-label", `지식센터 ${page}페이지 보기`);
      button.addEventListener("click", () => showPage(page, true));
      return button;
    });

    pagination.replaceChildren(...buttons);
    pagination.hidden = false;
    showPage(1);
  };

  const initCaseStudyPagination = () => {
    const list = document.querySelector("[data-case-study-list]");
    const pagination = document.querySelector("[data-case-study-pagination]");
    if (!list || !pagination) return;

    const cards = Array.from(list.children).filter((element) => element.classList.contains("case-study-card"));
    const perPage = 6;
    const pageCount = Math.ceil(cards.length / perPage);

    if (pageCount <= 1) {
      pagination.hidden = true;
      return;
    }

    let currentPage = 1;
    const shouldAnimate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const playPageChange = () => {
      if (!shouldAnimate) return;
      list.classList.remove("is-page-changing");
      void list.offsetWidth;
      list.classList.add("is-page-changing");
    };

    const getPageFromHash = () => {
      const targetId = window.location.hash.slice(1);
      if (!targetId) return 1;
      const targetIndex = cards.findIndex((card) => card.id === targetId);
      return targetIndex >= 0 ? Math.floor(targetIndex / perPage) + 1 : 1;
    };

    const showPage = (page, focusButton = false) => {
      currentPage = Math.min(Math.max(page, 1), pageCount);
      const start = (currentPage - 1) * perPage;
      const end = start + perPage;

      cards.forEach((card, index) => {
        const isVisible = index >= start && index < end;
        card.hidden = !isVisible;
        if (isVisible) {
          card.removeAttribute("aria-hidden");
        } else {
          card.setAttribute("aria-hidden", "true");
        }
      });

      Array.from(pagination.children).forEach((button, index) => {
        const isCurrent = index + 1 === currentPage;
        button.classList.toggle("is-active", isCurrent);
        if (isCurrent) {
          button.setAttribute("aria-current", "page");
        } else {
          button.removeAttribute("aria-current");
        }
      });

      if (focusButton) {
        pagination.children[currentPage - 1]?.focus({ preventScroll: true });
        playPageChange();
      }
    };

    const buttons = Array.from({ length: pageCount }, (_, index) => {
      const page = index + 1;
      const button = document.createElement("button");
      button.className = "article-page-button";
      button.type = "button";
      button.textContent = String(page);
      button.setAttribute("aria-label", `실제사례 ${page}페이지 보기`);
      button.addEventListener("click", () => showPage(page, true));
      return button;
    });

    pagination.replaceChildren(...buttons);
    pagination.hidden = false;
    showPage(getPageFromHash());
    window.addEventListener("hashchange", () => showPage(getPageFromHash()));
  };

  const initKnowledgeModal = () => {
    const dataNode = document.getElementById("knowledge-article-data");
    const triggers = document.querySelectorAll("[data-knowledge-modal-open]");
    if (!dataNode || !triggers.length) return;

    let articles = [];
    try {
      articles = JSON.parse(dataNode.textContent || "[]");
    } catch (error) {
      console.error("Knowledge article data could not be parsed", error);
      return;
    }

    const articleMap = new Map(articles.map((article) => [article.id, article]));
    const sectionLabels = ["핵심 기준", "검토 자료", "실무상 쟁점", "상담 시 확인할 점"];
    let lastFocusedElement = null;

    const ensureModal = () => {
      let modal = document.getElementById("knowledge-article-modal");
      if (modal) return modal;

      document.body.insertAdjacentHTML("beforeend", `
<div class="knowledge-modal" id="knowledge-article-modal" aria-hidden="true">
  <div class="knowledge-modal-backdrop" data-knowledge-modal-close></div>
  <article class="knowledge-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="knowledge-modal-title" tabindex="-1">
    <button class="knowledge-modal-close" type="button" data-knowledge-modal-close aria-label="지식센터 게시물 닫기">&times;</button>
    <header class="knowledge-modal-head">
      <div class="knowledge-modal-copy">
        <div class="knowledge-modal-category" id="knowledge-modal-category"></div>
        <h2 id="knowledge-modal-title"></h2>
      </div>
      <figure class="knowledge-modal-thumb-wrap">
        <img class="knowledge-modal-thumb" src="" alt="" loading="lazy" decoding="async">
      </figure>
    </header>
    <p class="knowledge-modal-answer"><span>핵심 답변</span><strong id="knowledge-modal-answer"></strong></p>
    <div class="knowledge-modal-news">
      <div class="knowledge-modal-body"></div>
    </div>
  </article>
</div>`);
      modal = document.getElementById("knowledge-article-modal");
      return modal;
    };

    const getModal = () => document.getElementById("knowledge-article-modal");
    const getDialog = () => getModal()?.querySelector(".knowledge-modal-dialog");

    const renderArticle = (article, trigger) => {
      const modal = ensureModal();
      modal.querySelector("#knowledge-modal-category").textContent = article.category || "지식센터";
      modal.querySelector("#knowledge-modal-title").textContent = article.title || "";
      modal.querySelector("#knowledge-modal-answer").textContent = article.directAnswer || article.summary || "";

      const cardThumb = trigger.querySelector(".article-thumb");
      const thumbnailWrap = modal.querySelector(".knowledge-modal-thumb-wrap");
      const thumbnail = modal.querySelector(".knowledge-modal-thumb");
      if (cardThumb?.dataset.thumb && thumbnail && thumbnailWrap) {
        thumbnail.src = cardThumb.dataset.thumb;
        thumbnail.alt = cardThumb.dataset.thumbAlt || cardThumb.getAttribute("aria-label") || article.title || "";
        thumbnailWrap.hidden = false;
      } else if (thumbnailWrap) {
        thumbnailWrap.hidden = true;
      }

      const body = modal.querySelector(".knowledge-modal-body");
      const paragraphs = Array.isArray(article.body) ? article.body : [];
      body.replaceChildren(...paragraphs.map((text, index) => {
        const section = document.createElement("section");
        section.className = "knowledge-modal-section";

        const heading = document.createElement("h3");
        heading.textContent = sectionLabels[index] || "추가 확인";

        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        section.append(heading, paragraph);
        return section;
      }));

      return modal;
    };

    const closeModal = () => {
      const modal = getModal();
      if (!modal || modal.getAttribute("aria-hidden") === "true") return;
      modal.setAttribute("aria-hidden", "true");
      document.documentElement.classList.remove("knowledge-modal-open");
      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
      }
    };

    const openModal = (trigger) => {
      const article = articleMap.get(trigger.dataset.knowledgeArticle);
      if (!article) return;
      const modal = renderArticle(article, trigger);
      lastFocusedElement = trigger;
      modal.setAttribute("aria-hidden", "false");
      document.documentElement.classList.add("knowledge-modal-open");
      requestAnimationFrame(() => getDialog()?.focus());
    };

    document.addEventListener("click", (event) => {
      const openTrigger = event.target.closest("[data-knowledge-modal-open]");
      if (openTrigger) {
        event.preventDefault();
        openModal(openTrigger);
        return;
      }

      if (event.target.closest("[data-knowledge-modal-close]")) {
        event.preventDefault();
        closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal();
    });

    const openArticleFromHash = () => {
      const articleId = decodeURIComponent((window.location.hash || "").replace(/^#/, ""));
      if (!articleId) return;
      const trigger = document.getElementById(articleId);
      if (!trigger?.matches("[data-knowledge-modal-open]")) return;
      window.setTimeout(() => openModal(trigger), 120);
    };

    window.addEventListener("hashchange", openArticleFromHash);
    openArticleFromHash();
  };

  const initConsultPageSnap = () => {
    const page = document.querySelector(".consult-page");
    if (!page) return;

    const snapSections = Array.from(page.children).filter((section) => (
      section.matches(".consult-reference-section, .footer")
    ));
    if (snapSections.length < 2) return;

    let snapLocked = false;
    const snapTolerance = 8;
    let pointerStartY = null;
    let pointerStartX = null;
    let touchStartY = null;
    let touchStartX = null;

    const stickyConsultHeight = () => {
      const stickyBar = document.querySelector(".bottom-consult");
      return stickyBar ? Math.ceil(stickyBar.getBoundingClientRect().height) : 0;
    };
    const usableViewportHeight = () => Math.max(360, window.innerHeight - stickyConsultHeight());
    const shouldUseSnap = () => (
      window.matchMedia("(min-width: 1025px)").matches &&
      !document.documentElement.classList.contains("privacy-modal-open") &&
      !document.documentElement.classList.contains("knowledge-modal-open")
    );
    const maxScrollTop = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const sectionTop = (section) => Math.min(section.offsetTop, maxScrollTop());

    const currentSectionIndex = () => {
      const viewportPoint = window.scrollY + usableViewportHeight() * 0.38;
      let bestIndex = 0;
      let bestDistance = Infinity;

      snapSections.forEach((section, index) => {
        const distance = Math.abs(section.offsetTop - viewportPoint);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });

      return bestIndex;
    };

    const targetSectionIndex = (direction) => {
      const scrollTop = window.scrollY;

      if (direction > 0) {
        const nextIndex = snapSections.findIndex((section, index) => (
          index > 0 && sectionTop(snapSections[index]) > scrollTop + snapTolerance
        ));
        return nextIndex === -1 ? snapSections.length - 1 : nextIndex;
      }

      for (let index = snapSections.length - 2; index >= 0; index -= 1) {
        if (sectionTop(snapSections[index]) < scrollTop - snapTolerance) return index;
      }

      return 0;
    };

    const snapToSection = (direction) => {
      if (!shouldUseSnap() || snapLocked || snapSections.length === 0) return false;

      const next = targetSectionIndex(direction);
      const targetTop = sectionTop(snapSections[next]);
      if (Math.abs(targetTop - window.scrollY) <= snapTolerance) return false;

      snapLocked = true;
      window.scrollTo({
        top: targetTop,
        behavior: "smooth"
      });

      window.setTimeout(() => {
        snapLocked = false;
      }, 920);

      return true;
    };

    window.addEventListener("wheel", (event) => {
      if (!shouldUseSnap() || event.ctrlKey || Math.abs(event.deltaY) < 14) return;
      if (snapLocked) {
        event.preventDefault();
        return;
      }
      if (!snapToSection(event.deltaY > 0 ? 1 : -1)) return;
      event.preventDefault();
    }, { passive: false });

    window.addEventListener("keydown", (event) => {
      if (!shouldUseSnap()) return;
      const downKeys = ["ArrowDown", "PageDown", "Space"];
      const upKeys = ["ArrowUp", "PageUp"];
      if (![...downKeys, ...upKeys].includes(event.code)) return;
      if (snapLocked) {
        event.preventDefault();
        return;
      }
      if (!snapToSection(downKeys.includes(event.code) ? 1 : -1)) return;
      event.preventDefault();
    });

    window.addEventListener("pointerdown", (event) => {
      if (!shouldUseSnap()) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      pointerStartY = event.clientY;
      pointerStartX = event.clientX;
    });

    window.addEventListener("pointerup", (event) => {
      if (!shouldUseSnap()) return;
      if (pointerStartY === null || pointerStartX === null) return;
      const deltaY = pointerStartY - event.clientY;
      const deltaX = pointerStartX - event.clientX;
      pointerStartY = null;
      pointerStartX = null;
      if (Math.abs(deltaY) < 72 || Math.abs(deltaY) < Math.abs(deltaX) * 1.15) return;
      snapToSection(deltaY > 0 ? 1 : -1);
    });

    window.addEventListener("touchstart", (event) => {
      if (!shouldUseSnap()) return;
      const touch = event.touches[0];
      if (!touch) return;
      touchStartY = touch.clientY;
      touchStartX = touch.clientX;
    }, { passive: true });

    window.addEventListener("touchend", (event) => {
      if (!shouldUseSnap()) return;
      if (touchStartY === null || touchStartX === null) return;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const deltaY = touchStartY - touch.clientY;
      const deltaX = touchStartX - touch.clientX;
      touchStartY = null;
      touchStartX = null;
      if (Math.abs(deltaY) < 58 || Math.abs(deltaY) < Math.abs(deltaX) * 1.15) return;
      snapToSection(deltaY > 0 ? 1 : -1);
    }, { passive: true });
  };

  window.__layoutReady = Promise.all(includes.map(loadInclude)).then(() => {
    markActiveNav();
    initMobileNav();
    initFloatingContrast();
    initSubpageAnimations();
    initCountUpStats();
    initMainKnowledgeTabs();
    initCustomSelects();
    initConsultForms();
    initPrivacyModal();
    initKnowledgePagination();
    initCaseStudyPagination();
    initKnowledgeModal();
    initConsultPageSnap();
  }).catch((error) => {
    console.error("Layout include failed", error);
  });
})();
