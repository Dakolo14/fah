import { BRAND_DAYS } from './data/brands.js';

// DOM Selectors
const daysGrid = document.getElementById('daysGrid');
const modalOverlay = document.getElementById('brandModalOverlay');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalBrandName = document.getElementById('modalBrandName');
const modalCategoryTag = document.getElementById('modalCategoryTag');
const modalBodyContent = document.getElementById('modalBodyContent');

// Render Grid
function renderDaysGrid() {
  daysGrid.innerHTML = BRAND_DAYS.map(day => {
    const dateNum = day.dateFormatted.split(' ')[1];
    const monthStr = day.dateFormatted.split(' ')[0];

    return `
      <article class="day-card" 
               data-brand-id="${day.id}" 
               style="--card-accent: ${day.color}; --card-accent-bg: ${day.accentBg};"
               tabindex="0"
               role="button"
               aria-label="${day.brand} Day on ${day.weekday} ${day.dateFormatted}">
        <div>
          <div class="day-card-header">
            <div class="day-date-lockup">
              <div class="date-box">
                <span class="day-num">${dateNum}</span>
                <span class="month-abbr">${monthStr}</span>
              </div>
              <div class="day-info">
                <span class="day-weekday">${day.weekday}</span>
                <span class="day-category">${day.category}</span>
              </div>
            </div>
            <div class="day-brand-badge">${day.brand}</div>
          </div>

          ${day.daySeries ? `<span class="day-series-indicator">${day.daySeries}</span>` : ''}

          <h3 class="day-headline">${day.heroTitle}</h3>
          <p class="day-desc">${day.description}</p>

          <div class="day-perk-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>${day.discountBadge}</span>
          </div>
        </div>

        <div class="day-card-footer">
          <span class="card-status-pill">Upcoming</span>
          <span class="card-view-btn">
            <span>Explore Lineup</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </span>
        </div>
      </article>
    `;
  }).join('');

  // Attach card click handlers
  daysGrid.querySelectorAll('.day-card').forEach(card => {
    card.addEventListener('click', () => {
      const brandId = card.dataset.brandId;
      const day = BRAND_DAYS.find(d => d.id === brandId);
      if (day) openModal(day);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const brandId = card.dataset.brandId;
        const day = BRAND_DAYS.find(d => d.id === brandId);
        if (day) openModal(day);
      }
    });
  });
}

// Modal Functions
function openModal(day) {
  modalBrandName.textContent = day.brand;
  modalBrandName.style.color = day.color;
  modalCategoryTag.textContent = day.category;

  const seriesHtml = day.daySeries ? `<div style="font-size: 0.8125rem; font-weight: 700; color: ${day.color}; margin-bottom: 0.5rem;">${day.daySeries}</div>` : '';

  modalBodyContent.innerHTML = `
    ${seriesHtml}
    <h2 class="modal-hero-title">${day.heroTitle}</h2>
    <div style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.25rem; font-weight: 600;">
      Schedule: ${day.weekday}, ${day.dateFormatted}, 2026
    </div>
    <p class="modal-desc">${day.description}</p>

    <div class="modal-perks-box">
      <div class="modal-perks-title">Exclusive Brand Day Perks & Assurances</div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${day.highlightPerks.map(perk => `
          <div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.875rem; font-weight: 500;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${day.color}" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${perk}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="modal-products-heading">Spotlight Products on Special Promo</div>
    <div class="modal-product-list">
      ${day.products.map(prod => `
        <div class="mini-product-card">
          <div class="mini-product-info">
            <h5>${prod.name}</h5>
            <span>${prod.highlight}</span>
          </div>
          <div style="text-align: right; flex-shrink: 0;">
            <span class="mini-product-tag" style="display: block; margin-bottom: 0.25rem;">${prod.tag}</span>
            <span style="font-size: 0.8125rem; font-weight: 700; color: var(--accent-warm);">${prod.price}</span>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="modal-footer">
      <button class="btn-primary" id="modalCloseActionBtn">Close</button>
    </div>
  `;

  modalOverlay.classList.add('active');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const closeActionBtn = modalBodyContent.querySelector('#modalCloseActionBtn');
  if (closeActionBtn) {
    closeActionBtn.addEventListener('click', closeModal);
  }
}

function closeModal() {
  modalOverlay.classList.remove('active');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

modalCloseBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
    closeModal();
  }
});

// Initialize
renderDaysGrid();
