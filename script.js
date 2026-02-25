// --- Portfolio Menu (flip animation) ---

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

// 2) OPTIONAL: EDIT YOUR DISPLAY NAME/ROLE HERE (also in index.html)
const displayName = 'Viet Anh';
const displayRole = 'User Experience Designer';

// Build pages: cover + project pages + back cover
const pages = [
  {
    label: 'Menu',
    title: `${displayName}'s Portfolio Menu`,
    desc: `Welcome. Flip through the menu to explore projects as dishes. Each dish lists its key ingredients (methods/tools) and what was served (year).`,
    ingredients: ['Tap / click arrows', 'Use ← / → keys', 'Mobile friendly'],
    served: 'Now',
    linkLabel: 'Jump to contact',
    link: '#contact'
  },
  ...projects.map(p => ({
    label: 'Dish',
    ...p
  })),
  {
    label: 'Dessert',
    title: 'Contact / Links',
    desc: 'Want the full recipe? Reach out and I’ll share process docs, research notes, and iterations.',
    ingredients: ['Email', 'LinkedIn', 'PDF case studies', 'GitHub'],
    served: 'Anytime',
    linkLabel: 'Email me',
    link: 'mailto:your.email@example.com',
    footerId: 'contact'
  }
];

const menuCard = document.getElementById('menuCard');
const pageFront = document.getElementById('pageFront');
const pageBack = document.getElementById('pageBack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const hintEl = document.getElementById('menuHint');

let currentIndex = 0;
let isAnimating = false;

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderPage(page, index) {
  const ingredients = Array.isArray(page.ingredients) ? page.ingredients : [];
  const pills = ingredients.map(i => `<span class="pill">${escapeHtml(i)}</span>`).join('');
  const label = page.label ?? 'Dish';
  const served = page.served ? `Served: <strong>${escapeHtml(page.served)}</strong>` : '';
  const link = page.link ? `<a class="link-btn" href="${escapeHtml(page.link)}" target="_blank" rel="noreferrer">${escapeHtml(page.linkLabel ?? 'Open')}</a>` : '';
  const pageNo = `${index + 1} / ${pages.length}`;
  const footerIdAttr = page.footerId ? `id="${escapeHtml(page.footerId)}"` : '';

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
        <span>Flip to continue</span>
      </div>
    </div>
  `;
}

function updateButtons() {
  const atStart = currentIndex <= 0;
  const atEnd = currentIndex >= pages.length - 1;
  if (prevBtn) prevBtn.disabled = atStart || isAnimating;
  if (nextBtn) nextBtn.disabled = atEnd || isAnimating;

  if (hintEl) {
    if (atStart) hintEl.textContent = 'Start of menu — flip right to begin.';
    else if (atEnd) hintEl.textContent = 'End of menu — flip left to go back.';
    else hintEl.textContent = 'Use the arrows (or ← / →) to flip.';
  }
}

function setAriaForIndex() {
  if (!menuCard) return;
  menuCard.setAttribute('aria-label', `Menu page ${currentIndex + 1} of ${pages.length}`);
}

function showIndex(index) {
  const page = pages[index];
  if (pageFront) pageFront.innerHTML = renderPage(page, index);
  if (pageBack) pageBack.innerHTML = '';
  currentIndex = index;
  setAriaForIndex();
  updateButtons();
}

function animateToIndex(nextIndex, direction) {
  if (!menuCard || !pageFront || !pageBack) return;
  if (isAnimating) return;
  if (nextIndex < 0 || nextIndex >= pages.length) return;

  isAnimating = true;
  updateButtons();

  // Prepare the hidden face with the next content
  pageBack.innerHTML = renderPage(pages[nextIndex], nextIndex);

  const className = direction === 'back' ? 'is-flipping-back' : 'is-flipping-forward';
  menuCard.classList.remove('is-flipping-forward', 'is-flipping-back');

  // Force a reflow so class changes are reliably animated
  void menuCard.offsetWidth; // eslint-disable-line no-unused-expressions

  menuCard.classList.add(className);

  const onDone = () => {
    menuCard.removeEventListener('transitionend', onDone);

    // Swap content into the front face
    currentIndex = nextIndex;
    pageFront.innerHTML = pageBack.innerHTML;
    pageBack.innerHTML = '';

    // Reset transform without animating "back".
    menuCard.style.transition = 'none';
    menuCard.classList.remove('is-flipping-forward', 'is-flipping-back');
    // Force transform reset to apply
    void menuCard.offsetWidth; // eslint-disable-line no-unused-expressions
    // Re-enable transitions
    menuCard.style.transition = '';

    isAnimating = false;
    setAriaForIndex();
    updateButtons();
  };

  menuCard.addEventListener('transitionend', onDone);
}

function next() { animateToIndex(currentIndex + 1, 'forward'); }
function prev() { animateToIndex(currentIndex - 1, 'back'); }

// Wire buttons
if (nextBtn) nextBtn.addEventListener('click', next);
if (prevBtn) prevBtn.addEventListener('click', prev);

// Keyboard support
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
});

// Initial render
showIndex(0);
