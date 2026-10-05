# Agent Instructions — SSD Bengali Translation Project

> **Read this file in full before making any change to any file in this project.**
> These rules apply to every AI agent, automated tool, or script that touches this codebase.

---

## Project Overview

This project publishes Bengali translations of EFF Surveillance Self-Defense (SSD) guides at `translation.samin-yasar.dev`. Each guide lives in its own folder under `ssd/` and contains:

- `index.md` — the **source of truth**: the finalized Bengali translation
- `index.html` — the **rendered HTML output**, built from `index.md` using `TEMPLATE.html`
- `media/` — local screenshots/images referenced from both files

The canonical HTML template is at `ssd/TEMPLATE.html`.
The site stylesheet is at `assets/style.css`.
The site script is at `assets/main.js`.

---

## Section 1 — What You MUST Do

### 1.1 Follow the template exactly

- Use `ssd/TEMPLATE.html` as the structural skeleton for every new `index.html`.
- Every element — header, nav, article, footer — must appear in the **same order** and use the **same CSS classes** as the template.
- Every heading (`h2`, `h3`) must include a `heading-anchor` link using the pattern:
  ```html
  <h2 id="section-slug">Bengali heading <a class="heading-anchor" href="#section-slug"
      aria-label="এই অনুচ্ছেদের লিংক">#</a></h2>
  ```
- `h4` headings do **not** get an anchor link.

### 1.2 Reproduce translations faithfully from index.md

- Copy all Bengali text **word for word** from `index.md`. Do not paraphrase, improve, shorten, or rewrite.
- If `index.md` uses a numbered list, the HTML must use `<ol>`. If `index.md` uses a bullet list, use `<ul>`. Do not switch between them.
- Section order in the HTML must match the section order in `index.md`.
- If `index.md` has a horizontal rule (`---`), include an `<hr>` at the same position.

### 1.3 Preserve English UI labels exactly

- Device menu names, button labels, and setting paths from step-by-step instructions stay in English and are wrapped in `<strong>`:
  ```html
  <strong>Settings</strong> &gt; <strong>Privacy &amp; Security</strong>
  ```
- Do not translate UI labels like `Settings`, `Turn on Lockdown Mode`, `Safari`, etc.

### 1.4 Use local media paths

- All images reference local files in the guide's `media/` folder:
  ```html
  <img src="media/filename.jpeg" alt="বাংলা বিকল্প পাঠ্য।">
  ```
- Never hot-link images from EFF or any external CDN.

### 1.5 Apply glossary terms correctly

- For any technical term listed in `ssd/glossary.md`, use `<abbr class="glossary-term">` with a Bengali `title` tooltip:
  ```html
  <abbr class="glossary-term" title="বাংলায় সংজ্ঞা।">পরিভাষা (English Term)</abbr>
  ```
- The tooltip text (`title`) must be written in Bengali.
- The `<abbr>` must not be wrapped in an external link. The definition is delivered inline via the tooltip.
- Only mark the **first occurrence** of a term per article unless the article is very long and the term appears again in a very different section.

### 1.6 Use the correct callout pattern

Map source callout types as follows:

| Source marker | Callout class | Bengali label |
|---|---|---|
| `> ⚠` / warning / "Lockdown Mode does not protect…" | `callout warning` | `সতর্কতা` |
| `> 💡` / tip / note / "Pixel phones also have…" | `callout note` | `পরামর্শ` |

Use the exact SVG icons and `<div class="callout-label">` structure from `TEMPLATE.html`. Do not invent new callout types.

### 1.7 Update the GitHub header link per guide

- The `<a class="icon-link">` in the header must point to the specific guide's folder on GitHub:
  ```
  https://github.com/Samin-yasar/translation/tree/main/ssd/{{GUIDE_SLUG}}
  ```

### 1.8 Include a Table of Contents only when appropriate

- Include a TOC (`<h2 id="table-of-contents">`) only if:
  - The source `index.md` contains an explicit table of contents, **or**
  - The article has four or more major `##` sections.
- If a TOC is included, it must appear immediately after the `<hr>` that follows the license `<blockquote>`, before the article body.

### 1.9 Keep the footer and script unchanged

- The `<footer class="site-footer">` content and link structure must be identical across all guides.
- The only script tag is `<script src="/assets/main.js"></script>` at the end of `<body>`. Do not add other scripts.

---

## Section 2 — What You Must NOT Do

### 2.1 Do NOT link glossary terms to EFF's English-language glossary

**Wrong:**
```html
<a href="https://ssd.eff.org/glossary/spyware"><abbr class="glossary-term" ...>স্পাইওয়্যার</abbr></a>
```
**Right:**
```html
<abbr class="glossary-term" title="বাংলায় সংজ্ঞা।">স্পাইওয়্যার (spyware)</abbr>
```

Reason: This is a Bengali-language guide. Sending readers to an English page breaks the language contract. Definitions belong in the inline tooltip.

### 2.2 Do NOT change, rephrase, or "improve" translations from index.md

- The translations in `index.md` are final. Do not alter phrasing, word choice, sentence structure, or punctuation.
- Do not add explanatory content that is not in `index.md`.
- Do not omit any content that is in `index.md`.

### 2.3 Do NOT change the HTML design or layout

- Do not add inline `style=""` attributes.
- Do not add new CSS classes.
- Do not modify the existing CSS class names on any element.
- Do not change the order of elements within the header, main, or footer.
- Do not add any new structural blocks (e.g., sidebars, modals, banners) not present in the template.

### 2.4 Do NOT use placeholder images or generate synthetic images

- Use only the images already present in the guide's `media/` folder.
- If an image is referenced in `index.md` but missing from `media/`, flag it — do not substitute or generate a replacement.

### 2.5 Do NOT add a TOC if index.md has none and the article has fewer than four sections

### 2.6 Do NOT add translation notes, disclaimers, or commentary not in index.md

- The only boilerplate text permitted is the license/attribution blockquote, which is fixed and standardised.

### 2.7 Do NOT change the `<title>` format

The title must follow exactly: `{{Bengali guide title}} — বাংলা অনুবাদ`

### 2.8 Do NOT change heading anchor ids to Bengali slugs

Anchor `id` attributes use the English slug (matching the guide folder name pattern), not Bengali:
- ✅ `id="how-to-enable-lockdown-mode-on-iphone"`
- ❌ `id="আইফোনে-লকডাউন-মোড"`

### 2.9 Do NOT link to external pages for standard navigation

- The "← সব গাইড" nav links always go to `/ssd/` (relative), never to an absolute external URL.

### 2.10 Do NOT modify assets/style.css or assets/main.js

These are shared site-wide assets. Changes to them affect all guides. They are out of scope for per-guide work.

---

## Section 3 — HTML Conversion Workflow

When converting an `index.md` to `index.html`:

1. **Read `TEMPLATE.html`** — understand every section before writing a single line.
2. **Read `index.md` in full** — understand all sections, callout types, images, and list structures.
3. **Read `glossary.md`** — identify which terms in the article appear in the glossary and require `<abbr class="glossary-term">` markup.
4. **Fill in all `{{PLACEHOLDERS}}`** in the template header: title, slug, description, dates, translator.
5. **Convert the body** section by section, in order. For each element:
   - Match list type (ordered vs unordered) to the source.
   - Apply glossary markup to first occurrences.
   - Apply callout markup where the source has blockquotes or warning/tip markers.
   - Use `<figure>/<figcaption>` for every image.
6. **Update the search index**: Add the new guide and its key sections to `ssd/search-index.json`.
7. **Verify** the rendered HTML against the source `index.md` — every sentence must be accounted for.

---

## Section 4 — Glossary Term Handling Reference

The `title` attribute on `<abbr class="glossary-term">` must contain the **Bengali definition** written for a non-technical reader. Copy from the table below — do not write a new definition unless the term is not listed here.

| Term (EN) | Term (BN) | Bengali tooltip (copy exactly) |
|---|---|---|
| malware | ম্যালওয়্যার | ক্ষতি করার উদ্দেশ্যে তৈরি সফটওয়্যার। এটি আপনার ডিভাইসে গোপনে ঢুকে পাসওয়ার্ড চুরি, তথ্য মুছে দেওয়া বা ডিভাইস অচল করে দিতে পারে। ভাইরাস, র‍্যানসমওয়্যার ও স্পাইওয়্যার সবই ম্যালওয়্যারের উদাহরণ। |
| spyware | স্পাইওয়্যার | একধরনের ম্যালওয়্যার যা আপনার অজান্তে আপনার ডিভাইসে বসে কাজ করে এবং গোপনে আপনার কথোপকথন, অবস্থান, ছবি বা পাসওয়ার্ড পাচার করে দেয়। Pegasus স্পাইওয়্যার এর একটি পরিচিত উদাহরণ। |
| fingerprinting | ফিঙ্গারপ্রিন্টিং | কোনো ওয়েবসাইট বা অ্যাপ আপনার ব্রাউজার, ডিভাইস বা নেটওয়ার্কের বিশেষ বৈশিষ্ট্যগুলো মিলিয়ে আপনাকে চেনার চেষ্টা করা — কুকি ছাড়াই। ভাবুন, কেউ আপনার কথা বলার ধরন শুনেই বুঝতে পারছে আপনি কে। |
| phishing | ফিশিং | প্রতারণামূলক বার্তা বা ওয়েবসাইটের মাধ্যমে আপনার পাসওয়ার্ড, ব্যাংকের তথ্য বা ব্যক্তিগত তথ্য হাতিয়ে নেওয়ার চেষ্টা। এই বার্তাগুলো সাধারণত ব্যাংক, সরকারি সংস্থা বা পরিচিত সেবার নামে আসে। |
| adversary | প্রতিপক্ষ | যে ব্যক্তি, সংস্থা বা সরকার আপনার ডিজিটাল নিরাপত্তা বা গোপনীয়তা নষ্ট করতে চায়। |
| vulnerability | নিরাপত্তা দুর্বলতা | সফটওয়্যার বা সিস্টেমে এমন একটি ফাঁকফোকর যা আক্রমণকারীরা সুযোগ হিসেবে ব্যবহার করতে পারে। সফটওয়্যার আপডেট দিলে সাধারণত এই দুর্বলতাগুলো ঠিক হয়। |
| encryption | এনক্রিপশন | তথ্যকে বিশেষ পদ্ধতিতে তালাবন্ধ করার প্রক্রিয়া, যাতে সঠিক চাবি ছাড়া কেউ তা পড়তে না পারে। |
| end-to-end encryption | এন্ড-টু-এন্ড এনক্রিপশন | বার্তাটি প্রেরকের ডিভাইসে তালাবন্ধ হয় এবং শুধু প্রাপকের ডিভাইসেই খোলে। মাঝখানে — এমনকি অ্যাপের কোম্পানিও — পড়তে পারে না। |
| metadata | মেটাডাটা | বার্তার বিষয়বস্তু নয়, কিন্তু সেই বার্তা সম্পর্কে তথ্য — কে পাঠাল, কখন, কাকে, কোথা থেকে। এমনকি এনক্রিপ্টেড বার্তার মেটাডাটাও প্রায়ই দেখা যায়। |
| two-factor authentication | টু-ফ্যাক্টর অথেনটিকেশন | শুধু পাসওয়ার্ডের পাশাপাশি আরেকটি যাচাই যোগ করা — যেমন SMS কোড বা অথেন্টিকেটর অ্যাপ। পাসওয়ার্ড চুরি হলেও অ্যাকাউন্ট সুরক্ষিত থাকে। |
| lockdown mode | লকডাউন মোড | আইফোন ও আইপ্যাডে একটি বিশেষ সুরক্ষা সেটিং, যা চালু করলে ডিভাইসের অনেক ফিচার সীমিত হয়ে যায় কিন্তু বিপজ্জনক আক্রমণ থেকে রক্ষা পাওয়া অনেক সহজ হয়। সাংবাদিক, আইনজীবী বা মানবাধিকারকর্মীদের মতো ঝুঁকিতে থাকা মানুষদের জন্য তৈরি। |
| cell site simulator | সেল সাইট সিমুলেটর | এমন একটি যন্ত্র যা মোবাইল টাওয়ারের ভান করে কাছাকাছি সব ফোনকে নিজের সাথে যুক্ত করিয়ে নেয়। এভাবে পুলিশ বা নিরাপত্তা সংস্থা কোনো এলাকার ফোনগুলোর অবস্থান বা কল শনাক্ত করতে পারে। |
| configuration profile | কনফিগারেশন প্রোফাইল | কোনো প্রতিষ্ঠান (যেমন স্কুল বা কর্মক্ষেত্র) আপনার ডিভাইসে ইনস্টল করা একটি ফাইল, যা ডিভাইসের কিছু সেটিংস নিয়ন্ত্রণ করতে পারে। |

For a complete list with all terms, see [`ssd/glossary.md`](../glossary.md) and [`ssd/glossary/index.html`](../glossary/index.html).


---

## Section 5 — File & Folder Conventions

```
ssd/
├── TEMPLATE.html          ← canonical HTML template — read before any conversion
├── instructions.md        ← this file
├── search-index.json      ← local search index for SSD guides and glossary
├── glossary.md            ← master Bengali terminology list
├── glossary/index.html    ← rendered glossary page
├── style-guide.md         ← translation writing style guidelines
├── index.html             ← guide index/listing page
└── {{guide-slug}}/
    ├── index.md           ← source of truth (Bengali translation)
    ├── index.html         ← rendered HTML output
    └── media/             ← local images only
        └── *.jpeg / *.png
```

**Never commit placeholder text** (e.g. `{{GUIDE_SLUG}}`) to any `index.html` file. Placeholders are only for `TEMPLATE.html`.

---

## Section 6 — When to Update glossary.md and glossary/index.html

If a new article introduces a technical term not yet in `glossary.md`:

1. Add the term (English → Bengali) to `ssd/glossary.md`.
2. Add the same entry to the term list in `ssd/glossary/index.html`.
3. Add the glossary entry to `ssd/search-index.json`.
4. If the term belongs in the "মনে রাখবেন" quick-reference table, add it there too.
5. Use the agreed Bengali rendering **consistently** across all articles — do not invent a different translation for the same term in a different guide.
