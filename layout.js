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

  window.__layoutReady = Promise.all(includes.map(loadInclude)).catch((error) => {
    console.error("Layout include failed", error);
  });
})();
