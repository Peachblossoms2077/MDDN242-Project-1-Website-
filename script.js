// --- Portfolio Menu (booklet / restaurant menu style) ---

// Keep the copyright year current automatically
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// 1) EDIT YOUR PROJECTS HERE
// Treat each project as a "dish".
const projects = [
  {
    title: 'Course Selection Redesign',
    desc: 'A UX redesign of a university course selection flow, focusing on clarity, reduced cognitive load, and fewer dead ends.',
    ingredients: ['User research', 'Information architecture', 'Wireframes', 'Figma prototype'],
    served: '2025',
    linkLabel: 'View prototype',
    link: '#'
  },
  {
    title: 'Accessibility Awareness Campaign',
    desc: 'Poster-based campaign to reduce misuse of mobility spaces and path obstruction, designed for high readability and quick comprehension.',
    ingredients: ['Accessible typography', 'Messaging system', 'Poster design'],
    served: '2025',
    linkLabel: 'Case study',
    link: '#'
  },
  {
    title: 'Sustainability Subvertisement',
    desc: 'A campaign that reframes product desire into environmental accountability using interactive storytelling and design activism.',
    ingredients: ['Narrative UX', 'Interaction map', 'Digital mockups'],
    served: '2025',
    linkLabel: 'View campaign',
    link: '#'
  },
  {
    title: 'The Third Place Concept',
    desc: 'A physical space concept to slow people down and encourage real-time small-group interaction—no monetization, no screens.',
    ingredients: ['Service blueprint', 'Environmental design', 'Behavioral cues'],
    served: '2025',
    linkLabel: 'Read concept',
    link: '#'
  }
];

// 2) OPTIONAL: EDIT YOUR DISPLAY NAME/ROLE HERE
const displayName = 'Ha Dao';
const displayRole = 'User Experience Designer';

// Build a single-page list for the booklet.
// NOTE: Each sheet has two sides (front/right + back/left), so keep this as an array of *pages*.
const pages = [
  {
    label: 'Cover',
    title: `${displayName} • ${displayRole}`,
    desc: 'Portfolio Menu — flip pages like a restaurant booklet.',
    ingredients: ['← / → keys', 'Touch-friendly', '3D page turn'],
    served: 'Now',
    linkLabel: 'Start',
    link: '#'
  },
  {
    label: 'Chef’s Note',
    title: 'How to read this menu',
    desc: 'Each project is plated as a dish. Ingredients are the methods/tools. Served is the year. Links go to prototypes/case studies.',
    ingredients: ['Context', 'Scope', 'Process'],
    served: 'Always',
    linkLabel: 'Jump to contact',
    link: '#contact'
  },
  ...projects.map(p => ({ label: 'Dish', ...p })),
  {
    label: 'Dessert',
    title: 'Contact / Links',
    desc: 'Want the full recipe? Reach out and I’ll share research notes, iterations, and decision rationale.',
    ingredients: ['Email', 'LinkedIn', 'PDF case studies', 'GitHub'],
    served: 'Anytime',
    linkLabel: 'Email me',
    link: 'mailto:your.email@example.com',
    footerId: 'contact'
  },
  {
    label: 'Back Cover',
    title: 'Thanks for reading',
    desc: 'If you’d like, I can tailor the menu for a specific role (product, research, service design).',
    ingredients: ['UX', 'UI', 'Research'],
    served: '—',
    linkLabel: 'Back to top',
    link: '#'
  }
];

const bookEl = document.getElementById('book');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const hintEl = document.getElementById('menuHint');

const TURN_MS = 900; // keep in sync with CSS transition

let papers = []; // DOM refs
let currentPaperIndex = 0; // how many papers are flipped
let isAnimating = false;

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderPage(page, pageIndex) {
  const label = page.label ?? 'Dish';
  const footerIdAttr = page.footerId ? `id="${escapeHtml(page.footerId)}"` : '';
  const pageNo = `${pageIndex + 1} / ${pages.length}`;

  // Special layouts for menu cover pages
  const isCover = String(label).toLowerCase() === 'cover';
  const isBackCover = String(label).toLowerCase() === 'back cover';

  if (isCover || isBackCover) {
    const kicker = isCover ? 'Today' : 'Bon appétit';
    const subtitle = isCover
      ? 'A booklet-style menu of my UX work.'
      : 'Thanks for reading — reach out for the full recipe.';

    return `
      <div class="page page--cover" ${footerIdAttr}>
        <div class="cover">
          <img src="icon.png" class="cover__icon" alt="Menu emblem">
          <div class="cover__kicker">${escapeHtml(kicker)}</div>
          <div class="cover__title">${escapeHtml(displayName)}</div>
          <div class="cover__role">${escapeHtml(displayRole)}</div>
          <div class="cover__portfolio">Portfolio</div>
          <div class="cover__rule" aria-hidden="true"></div>
          <div class="cover__subtitle">${escapeHtml(subtitle)}</div>
          <div class="cover__stamp">Est. ${new Date().getFullYear()}</div>
        </div>

        <div class="page__bottom page__bottom--cover">
          <span class="page__number">${escapeHtml(pageNo)}</span>
          <span>Use ← / → to turn pages</span>
        </div>
      </div>
    `;
  }

  const ingredients = Array.isArray(page.ingredients) ? page.ingredients : [];
  const pills = ingredients.map(i => `<span class="pill">${escapeHtml(i)}</span>`).join('');
  const served = page.served ? `Served: <strong>${escapeHtml(page.served)}</strong>` : '';

  let link = '';
  if (page.link) {
    const href = String(page.link);
    const isHash = href.startsWith('#');
    link = `<a class="link-btn" href="${escapeHtml(href)}"${isHash ? '' : ' target="_blank" rel="noreferrer"'}>${escapeHtml(page.linkLabel ?? 'Open')}</a>`;
  }

  return `
    <div class="page" ${footerIdAttr}>
      <div class="page__top">
        <div class="page__label">${escapeHtml(label)}</div>
        <div class="page__number">${escapeHtml(pageNo)}</div>
      </div>

      <article class="dish">
        <h2 class="dish__title">${escapeHtml(page.title ?? '')}</h2>
        <p class="dish__desc">${escapeHtml(page.desc ?? '')}</p>

        <div class="dish__meta" aria-label="Ingredients">
          ${pills}
        </div>

        <div class="dish__cta">
          ${link}
          <span class="pill" aria-label="Served">${served || ' '}</span>
        </div>
      </article>

      <div class="page__bottom">
        <span><strong>${escapeHtml(displayName)}</strong> • ${escapeHtml(displayRole)}</span>
        <span>Turn the page</span>
      </div>
    </div>
  `;
}

function buildBook() {
  if (!bookEl) return;

  // Each paper (sheet) has 2 pages: front (right) and back (left)
  const paperCount = Math.ceil(pages.length / 2);
  const frag = document.createDocumentFragment();
  papers = [];

  for (let i = 0; i < paperCount; i++) {
    const frontPageIndex = i * 2;
    const backPageIndex = i * 2 + 1;

    const paper = document.createElement('div');
    paper.className = 'paper';
    paper.setAttribute('data-index', String(i));

    const sheet = document.createElement('div');
    sheet.className = 'paper__sheet';

    const front = document.createElement('div');
    front.className = 'page-face page-face--front';
    front.innerHTML = pages[frontPageIndex] ? renderPage(pages[frontPageIndex], frontPageIndex) : '';

    const frontLabel = pages[frontPageIndex]?.label ? String(pages[frontPageIndex].label).toLowerCase() : '';
    if (frontLabel === 'cover' || frontLabel === 'back cover') front.classList.add('is-cover-face');

    const back = document.createElement('div');
    back.className = 'page-face page-face--back';
    back.innerHTML = pages[backPageIndex] ? renderPage(pages[backPageIndex], backPageIndex) : '';

    const backLabel = pages[backPageIndex]?.label ? String(pages[backPageIndex].label).toLowerCase() : '';
    if (backLabel === 'cover' || backLabel === 'back cover') back.classList.add('is-cover-face');

    sheet.appendChild(front);
    sheet.appendChild(back);
    paper.appendChild(sheet);
    frag.appendChild(paper);
    papers.push(paper);
  }

  bookEl.innerHTML = '';
  bookEl.appendChild(frag);

  // Start OPEN like a restaurant booklet: flip the cover once.
  // That means paper 0 is flipped, showing page 2 on the left and page 3 on the right.
  currentPaperIndex = 1;
  for (let i = 0; i < papers.length; i++) {
    papers[i].classList.toggle('is-flipped', i < currentPaperIndex);
  }

  updateZ();
  updateButtons();
  updateAria();
}

function updateZ() {
  const total = papers.length;
  for (let i = 0; i < total; i++) {
    const paper = papers[i];
    // Flipped papers should stack on the left; unflipped on the right.
    // We change z-index dynamically to keep the "top" page interactive visually.
    if (i < currentPaperIndex) paper.style.zIndex = String(i + 1);
    else paper.style.zIndex = String(total - i);
  }
}

function updateAria() {
  if (!bookEl) return;
  const leftPage = Math.min(currentPaperIndex * 2, pages.length);
  const rightPage = Math.min(leftPage + 1, pages.length);

  // When closed (index 0) only cover is visible; when open, we show a spread.
  const label = currentPaperIndex === 0
    ? `Menu cover. Page 1 of ${pages.length}.`
    : `Open menu. Left page ${leftPage} of ${pages.length}, right page ${rightPage} of ${pages.length}.`;

  bookEl.setAttribute('aria-label', label);
}

function updateButtons() {
  const atStart = currentPaperIndex <= 0;
  const atEnd = currentPaperIndex >= papers.length;

  if (prevBtn) prevBtn.disabled = atStart || isAnimating;
  if (nextBtn) nextBtn.disabled = atEnd || isAnimating;

  if (!hintEl) return;
  if (atStart) hintEl.textContent = 'Menu closed — turn right to open.';
  else if (atEnd) hintEl.textContent = 'End of menu — turn left to go back.';
  else hintEl.textContent = 'Use the arrows (or ← / →) to turn pages.';
}

function next() {
  if (isAnimating) return;
  if (currentPaperIndex >= papers.length) return;

  isAnimating = true;
  updateButtons();

  const paperToFlip = papers[currentPaperIndex];
  if (paperToFlip) paperToFlip.classList.add('is-flipped');
  currentPaperIndex += 1;
  updateZ();
  updateAria();

  window.setTimeout(() => {
    isAnimating = false;
    updateButtons();
  }, TURN_MS);
}

function prev() {
  if (isAnimating) return;
  if (currentPaperIndex <= 0) return;

  isAnimating = true;
  updateButtons();

  currentPaperIndex -= 1;
  const paperToUnflip = papers[currentPaperIndex];
  if (paperToUnflip) paperToUnflip.classList.remove('is-flipped');
  updateZ();
  updateAria();

  window.setTimeout(() => {
    isAnimating = false;
    updateButtons();
  }, TURN_MS);
}

// Wire buttons
if (nextBtn) nextBtn.addEventListener('click', next);
if (prevBtn) prevBtn.addEventListener('click', prev);

// Keyboard support
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
});

// Initial render
buildBook();
