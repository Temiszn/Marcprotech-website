/* ==========================================================================
   PRODUCTS: the data lives in ONE array. To add a product, copy a block
   between { } and edit the text. Everything else updates by itself.
   ========================================================================== */

const categories = [
  { key: 'all',         label: 'All' },
  { key: 'cij',         label: 'Continuous Inkjet (CIJ)' },
  { key: 'tij',         label: 'Thermal Inkjet (TIJ)' },
  { key: 'laser',       label: 'Laser Marking' },
  { key: 'consumables', label: 'Consumables' }
];

const products = [
  {
    category: 'cij',
    name: 'Continuous Inkjet Coders',
    text: 'Non-contact printing of dates, batch numbers and codes at production-line speed.',
    points: ['Bottles, cans and cartons', 'Suited to high-speed lines', 'Long-run production'],
    image: 'assets/images/cij.jpg',
    topic: 'equipment'
  },
  {
    category: 'tij',
    name: 'Thermal Inkjet Coders',
    text: 'Compact, clean printing of sharp codes, barcodes and text.',
    points: ['Cartons and cases', 'Barcodes and QR codes', 'Easy cartridge changes'],
    image: 'assets/images/tij.jpg',
    topic: 'equipment'
  },
  {
    category: 'laser',
    name: 'Laser Marking Machines',
    text: 'Permanent marks with no ink, ideal where codes must not rub off.',
    points: ['Permanent marking', 'No ink to replace', 'Wide range of materials'],
    image: 'assets/images/lmm.jpg',
    topic: 'equipment'
  },
  {
    category: 'consumables',
    name: 'Ink Cartridges',
    text: 'Inks to keep your coder printing clearly and consistently.',
    points: ['Matched to your machine', 'Ready when you need them'],
    image: 'assets/images/inkcart.jpg',
    topic: 'consumables'
  },
  {
    category: 'consumables',
    name: 'Makeup Cartridges',
    text: 'Makeup fluid that keeps ink at the right consistency while the machine runs.',
    points: ['Matched to your machine', 'Ready when you need them'],
    image: 'assets/images/make-up.jpg',
    topic: 'consumables'
  },
  {
    category: 'consumables',
    name: 'Solvents',
    text: 'Solvents for cleaning and maintaining your coding equipment.',
    points: ['Matched to your machine', 'Ready when you need them'],
    image: 'assets/images/solvent.jpg',
    topic: 'consumables'
  }

  /* EXAMPLE of a real product with a photo (remove the slashes to use):
  ,{
    category: 'tij',
    name: 'Model name here',
    text: 'One or two lines about what it does.',
    points: ['Feature one', 'Feature two', 'Feature three'],
    image: 'assets/images/products/model-name.jpg',
    topic: 'equipment'
  }
  */
];

/* ==========================================================================
   RENDERING (you shouldn't need to edit below this line)
   ========================================================================== */

const grid = document.getElementById('productGrid');
const filterBar = document.getElementById('productFilters');
const countEl = document.getElementById('productCount');

// Shown when a product has no photo yet
const placeholderIcon = `
  <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor"
       stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="9" rx="1.5"/>
    <path d="M7 13v3h10v-3M8 20h8M12 16v4M7 8h4"/>
  </svg>`;

function cardHTML(product, index) {
  const label = categories.find((c) => c.key === product.category).label;

  const media = product.image
    ? `<img src="${product.image}" alt="${product.name}" loading="lazy">`
    : placeholderIcon;

  return `
    <article class="product-card p-card" style="--delay:${(index % 3) * 90}ms">
      <div class="p-media">${media}</div>
      <span class="tag">${label}</span>
      <h3>${product.name}</h3>
      <p>${product.text}</p>
      <ul class="p-points">
        ${product.points.map((point) => `<li>${point}</li>`).join('')}
      </ul>
      <a href="contact.html?topic=${product.topic}" class="btn btn-primary btn-sm">Enquire</a>
    </article>`;
}

function showProducts(key) {
  // filter() keeps only the products that match the chosen category
  const list = key === 'all' ? products : products.filter((p) => p.category === key);

  grid.innerHTML = list.map(cardHTML).join('');
  countEl.textContent = `Showing ${list.length} ${list.length === 1 ? 'product' : 'products'}`;

  filterBar.querySelectorAll('.topic').forEach((btn) => {
    btn.setAttribute('aria-pressed', btn.dataset.filter === key);
  });
}

// Only create filter buttons for categories that actually have products
filterBar.innerHTML = categories
  .filter((c) => c.key === 'all' || products.some((p) => p.category === c.key))
  .map((c) => `<button type="button" class="topic" data-filter="${c.key}">${c.label}</button>`)
  .join('');

filterBar.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-filter]');
  if (btn) showProducts(btn.dataset.filter);
});

showProducts('all');