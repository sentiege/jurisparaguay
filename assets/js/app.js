/* =============================================
   JurisParaguay — Lógica Principal
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  renderCategorias(CATEGORIAS);
});

/* ---- Renderizado ---- */
function renderCategorias(cats) {
  const grid = document.getElementById('categorias-grid');
  grid.innerHTML = '';

  if (!cats.length) {
    grid.innerHTML = '<div class="empty-state"><div class="big">🔎</div><p>No se encontraron resultados para esa búsqueda.</p></div>';
    return;
  }

  cats.forEach(cat => {
    if (!cat.codigos.length) return;
    const card = document.createElement('div');
    card.className = 'categoria-card';
    card.innerHTML = `
      <div class="categoria-card__header" style="background:${cat.color}">
        <span class="icon">${cat.icono}</span>
        <h2>${cat.nombre}</h2>
      </div>
      <div class="categoria-card__body">
        ${cat.codigos.map(c => `
          <a href="${c.internalUrl}" class="codigo-item" data-id="${c.id}">
            <span class="codigo-item__num">${c.ley}</span>
            <span class="codigo-item__info">
              <span class="codigo-item__nombre">${c.nombre}</span>
              <span class="codigo-item__desc">${c.descripcion.substring(0, 80)}…</span>
            </span>
          </a>
        `).join('')}
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ---- Búsqueda ---- */
function buscar() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!q) { renderCategorias(CATEGORIAS); return; }

  const filtradas = CATEGORIAS.map(cat => ({
    ...cat,
    codigos: cat.codigos.filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      c.ley.toLowerCase().includes(q) ||
      c.descripcion.toLowerCase().includes(q)
    )
  })).filter(cat => cat.codigos.length > 0);

  renderCategorias(filtradas);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.activeElement.id === 'searchInput') buscar();
});
