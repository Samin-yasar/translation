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
        navigator.clipboard.writeText(window.location.origin + window.location.pathname + anchor.getAttribute("href")).catch(() => { });
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
        <span>শব্দকোষ</span>
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

// Local In-Browser Search Engine (Scoped to SSD)
function initSearch() {
  const isSSD = window.location.pathname.startsWith("/ssd") || window.location.pathname === "/";
  if (!isSSD) return;

  const headerActions = document.querySelector(".header-actions");
  if (!headerActions) return;

  // Insert search trigger button if not already in HTML
  let searchTrigger = headerActions.querySelector(".search-trigger");
  if (!searchTrigger) {
    searchTrigger = document.createElement("button");
    searchTrigger.className = "search-trigger";
    searchTrigger.type = "button";
    searchTrigger.setAttribute("aria-label", "অনুসন্ধান করুন (⌘K)");
    searchTrigger.setAttribute("title", "অনুসন্ধান করুন (⌘K)");
    searchTrigger.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <span class="search-trigger-text">খুঁজুন</span>
      <span class="search-hint"><kbd>⌘</kbd><kbd>K</kbd></span>
    `;
    // Insert before theme toggle
    const themeToggle = headerActions.querySelector(".theme-toggle");
    if (themeToggle) {
      headerActions.insertBefore(searchTrigger, themeToggle);
    } else {
      headerActions.appendChild(searchTrigger);
    }
  }

  // Create Modal DOM
  let backdrop = document.querySelector(".search-modal-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "search-modal-backdrop";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-label", "গাইড ও শব্দভাণ্ডার অনুসন্ধান");
    backdrop.innerHTML = `
      <div class="search-modal">
        <div class="search-input-wrapper">
          <svg class="search-input-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input class="search-input" type="search" placeholder="গাইড, পরিভাষা বা বিষয় খুঁজুন..." aria-label="খুঁজুন" autocomplete="off" spellcheck="false">
          <button class="search-close-btn" type="button" aria-label="বন্ধ করুন">ESC</button>
        </div>
        <ul class="search-results" role="listbox">
          <li class="search-empty">কীওয়ার্ড লিখে খুঁজুন (যেমন: লকডাউন, ফিশিং, BleachBit, এয়ারট্যাগ)</li>
        </ul>
        <div class="search-footer">
          <span class="search-footer-info">SSD বাংলা অনুবাদ সংগ্রহ</span>
          <div class="search-footer-shortcuts">
            <span><kbd>↑</kbd> <kbd>↓</kbd> নির্বাচন</span>
            <span><kbd>↵</kbd> প্রবেশ</span>
            <span><kbd>ESC</kbd> বন্ধ</span>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
  }

  const input = backdrop.querySelector(".search-input");
  const resultsContainer = backdrop.querySelector(".search-results");
  const closeBtn = backdrop.querySelector(".search-close-btn");

  let searchIndex = null;
  let isLoading = false;
  let selectedIndex = -1;

  async function loadIndex() {
    if (searchIndex || isLoading) return;
    isLoading = true;
    try {
      const res = await fetch("/ssd/search-index.json");
      if (res.ok) {
        searchIndex = await res.json();
      }
    } catch (err) {
      console.error("Failed to load search index:", err);
    } finally {
      isLoading = false;
    }
  }

  function openModal() {
    backdrop.classList.add("open");
    loadIndex();
    setTimeout(() => input.focus(), 50);
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    backdrop.classList.remove("open");
    input.value = "";
    resultsContainer.innerHTML = `<li class="search-empty">কীওয়ার্ড লিখে খুঁজুন (যেমন: লকডাউন, ফিশিং, BleachBit, এয়ারট্যাগ)</li>`;
    selectedIndex = -1;
    document.body.style.overflow = "";
  }

  const BENGALI_COMBINING_MARKS = /^[\u0981-\u0983\u09BC\u09BE-\u09CD\u09D7\u09E2\u09E3\u200C\u200D]+$/;

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getGraphemeClusters(text) {
    const clusters = [];
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter("bn", { granularity: "grapheme" });
      for (const seg of segmenter.segment(text)) {
        clusters.push({
          start: seg.index,
          end: seg.index + seg.segment.length,
          text: seg.segment
        });
      }
    } else {
      const graphemeRegex = /[\u0985-\u0994\u0995-\u09B9\u09CE\u09DC-\u09DF](?:[\u09BC]|[\u09CD][\u0985-\u09B9\u09DC-\u09DF\u200C\u200D]|[\u09BE-\u09CC\u09D7]|[\u0981-\u0983]|[\u200C\u200D])*|[\s\S]/gu;
      let match;
      while ((match = graphemeRegex.exec(text)) !== null) {
        clusters.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0]
        });
      }
    }
    return clusters;
  }

  function highlight(text, queryTokens) {
    if (!text) return "";

    const validTokens = (queryTokens || [])
      .map(t => (t || "").trim())
      .filter(t => t.length > 0 && !BENGALI_COMBINING_MARKS.test(t));

    if (validTokens.length === 0) {
      return escapeHtml(text);
    }

    const clusters = getGraphemeClusters(text);
    const lowerText = text.toLowerCase();
    const rawRanges = [];

    for (const token of validTokens) {
      const tokenLower = token.toLowerCase();
      let idx = lowerText.indexOf(tokenLower);
      while (idx !== -1) {
        rawRanges.push({ start: idx, end: idx + tokenLower.length });
        idx = lowerText.indexOf(tokenLower, idx + 1);
      }
    }

    if (rawRanges.length === 0) {
      return escapeHtml(text);
    }

    // Snap ranges to unbroken grapheme cluster boundaries
    const snappedRanges = rawRanges.map(r => {
      let start = r.start;
      let end = r.end;

      for (const c of clusters) {
        if (r.start > c.start && r.start < c.end) {
          start = Math.min(start, c.start);
        }
        if (r.end > c.start && r.end < c.end) {
          end = Math.max(end, c.end);
        }
      }
      return { start, end };
    });

    snappedRanges.sort((a, b) => a.start - b.start || b.end - a.end);
    const merged = [];
    for (const r of snappedRanges) {
      if (merged.length === 0) {
        merged.push({ ...r });
      } else {
        const last = merged[merged.length - 1];
        if (r.start <= last.end) {
          last.end = Math.max(last.end, r.end);
        } else {
          merged.push({ ...r });
        }
      }
    }

    let result = "";
    let cursor = 0;
    for (const r of merged) {
      if (r.start > cursor) {
        result += escapeHtml(text.slice(cursor, r.start));
      }
      result += `<mark>${escapeHtml(text.slice(r.start, r.end))}</mark>`;
      cursor = r.end;
    }
    if (cursor < text.length) {
      result += escapeHtml(text.slice(cursor));
    }

    return result;
  }

  function performSearch(query) {
    const raw = query.trim();
    if (!raw) {
      resultsContainer.innerHTML = `<li class="search-empty">কীওয়ার্ড লিখে খুঁজুন (যেমন: লকডাউন, ফিশিং, BleachBit, এয়ারট্যাগ)</li>`;
      selectedIndex = -1;
      return;
    }

    if (!searchIndex) {
      resultsContainer.innerHTML = `<li class="search-empty">ইনডেক্স লোড হচ্ছে...</li>`;
      return;
    }

    const tokens = raw.toLowerCase().split(/\s+/).filter(Boolean);

    const matches = [];

    for (const item of searchIndex) {
      let score = 0;
      const titleLower = (item.title || "").toLowerCase();
      const subLower = (item.subtitle || "").toLowerCase();
      const summaryLower = (item.summary || "").toLowerCase();
      const keywordsStr = (item.keywords || []).join(" ").toLowerCase();
      const tagsStr = (item.tags || []).join(" ").toLowerCase();

      let allMatched = true;

      for (const token of tokens) {
        let tokenScore = 0;

        if (titleLower.includes(token)) {
          tokenScore += (titleLower.startsWith(token) ? 80 : 50);
        }
        if (subLower.includes(token)) {
          tokenScore += 40;
        }
        if (keywordsStr.includes(token)) {
          tokenScore += 35;
        }
        if (tagsStr.includes(token)) {
          tokenScore += 30;
        }
        if (summaryLower.includes(token)) {
          tokenScore += 20;
        }

        if (tokenScore === 0) {
          allMatched = false;
          break;
        }
        score += tokenScore;
      }

      if (allMatched && score > 0) {
        // Boost guide over section slightly
        if (item.type === "guide") score += 15;
        if (item.type === "glossary") score += 10;
        matches.push({ item, score });
      }
    }

    matches.sort((a, b) => b.score - a.score);
    const topResults = matches.slice(0, 15);

    if (topResults.length === 0) {
      resultsContainer.innerHTML = `<li class="search-empty">"${raw}"-এর সাথে মেলে এমন কোনো ফলাফল পাওয়া যায়নি।</li>`;
      selectedIndex = -1;
      return;
    }

    const badgeLabels = {
      guide: "গাইড",
      section: "অনুচ্ছেদ",
      glossary: "শব্দকোষ"
    };

    resultsContainer.innerHTML = topResults.map(({ item }, index) => {
      const badgeText = badgeLabels[item.type] || item.type;
      const parentLabel = item.parentTitle ? `<span class="search-item-parent">${item.parentTitle}</span>` : "";
      const highlightedTitle = highlight(item.title, tokens);
      const highlightedSub = highlight(item.subtitle, tokens);
      const highlightedSummary = highlight(item.summary, tokens);

      return `
        <li>
          <a class="search-item" href="${item.url}" data-index="${index}" role="option">
            <div class="search-item-header">
              <span class="search-badge search-badge-${item.type}">${badgeText}</span>
              <span class="search-item-title">${highlightedTitle}</span>
              ${parentLabel}
            </div>
            ${item.subtitle ? `<div class="search-item-subtitle">${highlightedSub}</div>` : ""}
            ${item.summary ? `<div class="search-item-summary">${highlightedSummary}</div>` : ""}
          </a>
        </li>
      `;
    }).join("");

    selectedIndex = 0;
    updateSelection();
  }

  function updateSelection() {
    const items = resultsContainer.querySelectorAll(".search-item");
    items.forEach((item, idx) => {
      if (idx === selectedIndex) {
        item.classList.add("selected");
        item.scrollIntoView({ block: "nearest" });
      } else {
        item.classList.remove("selected");
      }
    });
  }

  // Event Listeners
  searchTrigger.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });

  input.addEventListener("input", (e) => {
    performSearch(e.target.value);
  });

  // Global Keyboard Shortcuts
  document.addEventListener("keydown", (e) => {
    // ⌘K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (backdrop.classList.contains("open")) {
        closeModal();
      } else {
        openModal();
      }
      return;
    }

    // Slash key '/' when not in input/textarea
    if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openModal();
      return;
    }

    if (!backdrop.classList.contains("open")) return;

    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const items = resultsContainer.querySelectorAll(".search-item");
      if (items.length) {
        selectedIndex = (selectedIndex + 1) % items.length;
        updateSelection();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const items = resultsContainer.querySelectorAll(".search-item");
      if (items.length) {
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateSelection();
      }
    } else if (e.key === "Enter") {
      const selected = resultsContainer.querySelector(".search-item.selected");
      if (selected) {
        e.preventDefault();
        selected.click();
      }
    }
  });
}

// Run on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initAnchors();
    initGlossaryTooltips();
    initSearch();
  });
} else {
  initTheme();
  initAnchors();
  initGlossaryTooltips();
  initSearch();
}

