// Theme Toggle & Initializer
function initTheme() {
  const themeToggle = document.querySelector(".theme-toggle");
  if (!themeToggle) return;

  const currentTheme = document.documentElement.dataset.theme || "light";
  themeToggle.setAttribute("aria-label", currentTheme === "dark" ? "লাইট থিম চালু করুন" : "ডার্ক থিম চালু করুন");
  themeToggle.setAttribute("title", currentTheme === "dark" ? "লাইট থিম" : "ডার্ক থিম");

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
    themeToggle.setAttribute("aria-label", nextTheme === "dark" ? "লাইট থিম চালু করুন" : "ডার্ক থিম চালু করুন");
    themeToggle.setAttribute("title", nextTheme === "dark" ? "লাইট থিম" : "ডার্ক থিম");
  });
}

// Heading Anchor Copy
function initAnchors() {
  document.querySelectorAll(".heading-anchor").forEach(anchor => {
    anchor.addEventListener("click", () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.origin + window.location.pathname + anchor.getAttribute("href")).catch(() => {});
      }
    });
  });
}

// Interactive Glossary Tooltips
function initGlossaryTooltips() {
  const terms = document.querySelectorAll(".glossary-term");
  if (!terms.length) return;

  let tooltip = document.querySelector(".glossary-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.className = "glossary-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.setAttribute("aria-hidden", "true");
    document.body.appendChild(tooltip);
  }

  let activeTerm = null;
  let hideTimeout = null;

  function showTooltip(term) {
    clearTimeout(hideTimeout);
    activeTerm = term;

    const text = term.getAttribute("data-tooltip") || term.getAttribute("title");
    if (!text) return;

    // Cache title to data-tooltip to suppress native browser tooltip
    if (term.hasAttribute("title")) {
      term.setAttribute("data-tooltip", text);
      term.removeAttribute("title");
    }

    tooltip.innerHTML = `
      <div class="glossary-tooltip-header">
        <svg class="glossary-tooltip-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <span>শব্দার্থ</span>
      </div>
      <div class="glossary-tooltip-body">${text}</div>
    `;

    tooltip.classList.add("visible");
    tooltip.setAttribute("aria-hidden", "false");
    term.classList.add("active");

    positionTooltip(term);
  }

  function positionTooltip(term) {
    const rect = term.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    const termCenter = rect.left + rect.width / 2;
    let left = termCenter - tooltipRect.width / 2 + scrollX;

    const margin = 12;
    const minLeft = scrollX + margin;
    const maxLeft = scrollX + window.innerWidth - tooltipRect.width - margin;
    left = Math.max(minLeft, Math.min(left, maxLeft));

    const arrowOffset = Math.max(16, Math.min(termCenter + scrollX - left, tooltipRect.width - 16));
    tooltip.style.setProperty("--arrow-offset", `${arrowOffset}px`);

    const tooltipHeight = tooltipRect.height;
    const spaceAbove = rect.top;
    let top;

    if (spaceAbove >= tooltipHeight + 14) {
      top = rect.top + scrollY - tooltipHeight - 10;
      tooltip.setAttribute("data-placement", "top");
    } else {
      top = rect.bottom + scrollY + 10;
      tooltip.setAttribute("data-placement", "bottom");
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function hideTooltip() {
    hideTimeout = setTimeout(() => {
      tooltip.classList.remove("visible");
      tooltip.setAttribute("aria-hidden", "true");
      if (activeTerm) {
        activeTerm.classList.remove("active");
        activeTerm = null;
      }
    }, 120);
  }

  tooltip.addEventListener("mouseenter", () => clearTimeout(hideTimeout));
  tooltip.addEventListener("mouseleave", hideTooltip);

  terms.forEach(term => {
    if (!term.hasAttribute("tabindex")) {
      term.setAttribute("tabindex", "0");
    }

    if (term.hasAttribute("title")) {
      term.setAttribute("data-tooltip", term.getAttribute("title"));
      term.removeAttribute("title");
    }

    term.addEventListener("mouseenter", () => showTooltip(term));
    term.addEventListener("mouseleave", hideTooltip);

    term.addEventListener("focus", () => showTooltip(term));
    term.addEventListener("blur", hideTooltip);

    term.addEventListener("click", (e) => {
      if (activeTerm === term && tooltip.classList.contains("visible")) {
        hideTooltip();
      } else {
        showTooltip(term);
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (activeTerm && !activeTerm.contains(e.target) && !tooltip.contains(e.target)) {
      clearTimeout(hideTimeout);
      tooltip.classList.remove("visible");
      tooltip.setAttribute("aria-hidden", "true");
      activeTerm.classList.remove("active");
      activeTerm = null;
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeTerm) {
      clearTimeout(hideTimeout);
      tooltip.classList.remove("visible");
      tooltip.setAttribute("aria-hidden", "true");
      activeTerm.classList.remove("active");
      activeTerm = null;
    }
  });

  window.addEventListener("resize", () => {
    if (activeTerm && tooltip.classList.contains("visible")) {
      positionTooltip(activeTerm);
    }
  });
}

// Run on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initAnchors();
    initGlossaryTooltips();
  });
} else {
  initTheme();
  initAnchors();
  initGlossaryTooltips();
}
