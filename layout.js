(() => {
  const includes = [
    ["[data-include='header']", "header.html"],
    ["[data-include='footer']", "footer.html"]
  ];

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

  window.__layoutReady = Promise.all(includes.map(loadInclude)).then(() => {
    markActiveNav();
    initSubpageAnimations();
  }).catch((error) => {
    console.error("Layout include failed", error);
  });
})();
