/* =============================================
   LegalHub — Lógica Principal
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  renderCategorias(CATEGORIAS);
  crearModal();
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
        ${cat.codigos.map(c => {
          const hasExternalLinks = c.links && c.links.length > 0;
          return `
            <a href="${c.internalUrl}" class="codigo-item" data-id="${c.id}">
              <span class="codigo-item__num">${c.ley}</span>
              <span class="codigo-item__info">
                <span class="codigo-item__nombre">${c.nombre}</span>
                <span class="codigo-item__desc">${c.descripcion.substring(0, 80)}…</span>
              </span>
              ${hasExternalLinks ? `<button class="codigo-item__ext" onclick="event.preventDefault();event.stopPropagation();abrirModal('${c.id}')" title="Ver fuentes externas">🔗</button>` : ''}
            </a>
          `;
        }).join('')}
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ---- Modal (solo fuentes externas) ---- */
function crearModal() {
  const overlay = document.createElement('div');
  overlay.id = 'modal-overlay';
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal__header">
        <h3 id="modal-titulo"></h3>
        <button class="modal__close" onclick="cerrarModal()" aria-label="Cerrar">✕</button>
      </div>
      <div class="modal__body" id="modal-body"></div>
    </div>
  `;
  overlay.addEventListener('click', e => { if (e.target === overlay) cerrarModal(); });
  document.body.appendChild(overlay);
}

function abrirModal(id) {
  const codigo = buscarCodigoPorId(id);
  if (!codigo) return;

  document.getElementById('modal-titulo').textContent = codigo.nombre;
  document.getElementById('modal-body').innerHTML = `
    <span class="ley-badge">${codigo.ley}</span>
    <p>${codigo.descripcion}</p>
    <div class="links-wrap">
      ${codigo.links && codigo.links.length
        ? codigo.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener noreferrer" class="btn-link">${l.label}</a>`).join('')
        : '<p style="color:#888;font-size:.88rem">No hay enlaces externos disponibles.</p>'
      }
    </div>
  `;
  document.getElementById('modal-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  document.getElementById('modal-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

function buscarCodigoPorId(id) {
  for (const cat of CATEGORIAS) {
    const c = cat.codigos.find(x => x.id === id);
    if (c) return c;
  }
  return null;
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
  if (e.key === 'Escape') cerrarModal();
  if (e.key === 'Enter' && document.activeElement.id === 'searchInput') buscar();
});
