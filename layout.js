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

  window.__layoutReady = Promise.all(includes.map(loadInclude)).then(markActiveNav).catch((error) => {
    console.error("Layout include failed", error);
  });
})();
