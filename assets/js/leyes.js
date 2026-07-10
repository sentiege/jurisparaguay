/**
 * leyes.js — Módulo para cargar y renderizar leyes del Congreso Nacional
 * Fuente: API SILpy — datos.congreso.gov.py (CC BY 4.0)
 */

(function () {
  'use strict';

  const LEYES_JSON = './data/leyes.json';
  const POR_PAGINA = 20;
  let leyesData = [];
  let leyesFiltradas = [];
  let paginaActual = 1;

  // ── Utilidades de fecha ──────────────────────────────────────────────────────
  function parseFecha(str) {
    // Formato de la API: dd/mm/yyyy
    if (!str) return null;
    const [d, m, y] = str.split('/');
    return new Date(`${y}-${m}-${d}`);
  }

  function formatFecha(str) {
    const f = parseFecha(str);
    if (!f) return '—';
    return f.toLocaleDateString('es-PY', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // ── Renderizado ─────────────────────────────────────────────────────────────
  function renderTarjeta(ley) {
    const badge = ley.tipoPromulgacion === 'AUTOMATICA'
      ? '<span class="ley-badge ley-badge--auto">Promulgación automática</span>'
      : '';

    return `
      <article class="ley-card" data-id="${ley.idLey}">
        <div class="ley-card__header">
          <span class="ley-card__numero">Ley N.° ${ley.numeroLey || '—'}</span>
          ${badge}
        </div>
        <h3 class="ley-card__titulo">${ley.acapite || '(Sin título disponible)'}</h3>
        <ul class="ley-card__meta">
          <li><span>Sanción:</span> ${formatFecha(ley.fechaSancion)}</li>
          <li><span>Promulgación:</span> ${formatFecha(ley.fechaPromulgacion)}</li>
          <li><span>Publicación:</span> ${formatFecha(ley.fechaPublicacion)}</li>
          ${ley.numeroDecreto ? `<li><span>Decreto reglamentario:</span> N.° ${ley.numeroDecreto} (${formatFecha(ley.fechaDecreto)})</li>` : ''}
        </ul>
        <div class="ley-card__actions">
          ${ley.appURL
            ? `<a class="ley-btn ley-btn--primary" href="template_lector.html?id=${ley.idProyecto}&ley=${ley.numeroLey}" title="Ver en JurisParaguay">Ver expediente</a>
               <a class="ley-btn ley-btn--secondary" href="${ley.appURL}" target="_blank" rel="noopener" title="Ver en SILpy">SILpy ↗</a>`
            : ''}
        </div>
      </article>`;
  }

  function renderPaginacion() {
    const totalPaginas = Math.ceil(leyesFiltradas.length / POR_PAGINA);
    const wrap = document.getElementById('leyes-paginacion');
    if (!wrap || totalPaginas <= 1) { if (wrap) wrap.innerHTML = ''; return; }

    let html = `<div class="leyes-pag">`;
    if (paginaActual > 1)
      html += `<button onclick="LeyesModule.irPagina(${paginaActual - 1})">&#8592; Anterior</button>`;
    html += `<span>Página ${paginaActual} de ${totalPaginas}</span>`;
    if (paginaActual < totalPaginas)
      html += `<button onclick="LeyesModule.irPagina(${paginaActual + 1})">Siguiente &#8594;</button>`;
    html += `</div>`;
    wrap.innerHTML = html;
  }

  function renderLista() {
    const contenedor = document.getElementById('leyes-lista');
    const contador   = document.getElementById('leyes-contador');
    if (!contenedor) return;

    const inicio = (paginaActual - 1) * POR_PAGINA;
    const pagina = leyesFiltradas.slice(inicio, inicio + POR_PAGINA);

    if (pagina.length === 0) {
      contenedor.innerHTML = '<p class="leyes-vacio">No se encontraron leyes con los filtros aplicados.</p>';
    } else {
      contenedor.innerHTML = pagina.map(renderTarjeta).join('');
    }

    if (contador)
      contador.textContent = `${leyesFiltradas.length} ley${leyesFiltradas.length !== 1 ? 'es' : ''} encontrada${leyesFiltradas.length !== 1 ? 's' : ''}`;

    renderPaginacion();
    contenedor.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── Filtros ──────────────────────────────────────────────────────────────────
  function aplicarFiltros() {
    const texto = (document.getElementById('leyes-buscar')?.value || '').toLowerCase().trim();
    const anio  = document.getElementById('leyes-anio')?.value || '';
    const tipo  = document.getElementById('leyes-tipo')?.value || '';

    leyesFiltradas = leyesData.filter(ley => {
      const titulo = (ley.acapite || '').toLowerCase();
      const numLey = String(ley.numeroLey || '');

      const coincideTexto = !texto || titulo.includes(texto) || numLey.includes(texto);
      const coincideAnio  = !anio  || (ley.fechaPromulgacion || '').endsWith(anio);
      const coincideTipo  = !tipo  || ley.tipoPromulgacion === tipo;

      return coincideTexto && coincideAnio && coincideTipo;
    });

    paginaActual = 1;
    renderLista();
  }

  // ── Poblar selector de años ──────────────────────────────────────────────────
  function poblarAnios() {
    const sel = document.getElementById('leyes-anio');
    if (!sel) return;
    const anios = [...new Set(
      leyesData
        .map(l => (l.fechaPromulgacion || '').split('/')[2])
        .filter(Boolean)
    )].sort((a, b) => b - a);

    anios.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a; opt.textContent = a;
      sel.appendChild(opt);
    });
  }

  // ── Init ─────────────────────────────────────────────────────────────────────
  async function init() {
    const seccion = document.getElementById('seccion-leyes');
    if (!seccion) return;

    const estado = document.getElementById('leyes-estado');
    if (estado) estado.textContent = 'Cargando leyes del Congreso…';

    try {
      const res = await fetch(LEYES_JSON);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      leyesData = await res.json();
      leyesFiltradas = [...leyesData];

      if (estado) estado.style.display = 'none';
      poblarAnios();
      renderLista();

      // Eventos de filtro
      document.getElementById('leyes-buscar')?.addEventListener('input',  aplicarFiltros);
      document.getElementById('leyes-anio')  ?.addEventListener('change', aplicarFiltros);
      document.getElementById('leyes-tipo')  ?.addEventListener('change', aplicarFiltros);
      document.getElementById('leyes-buscar-btn')?.addEventListener('click', aplicarFiltros);

    } catch (err) {
      if (estado) estado.textContent = '⚠ No se pudo cargar el listado de leyes. Intente más tarde.';
      console.error('[JurisParaguay] Error cargando leyes.json:', err);
    }
  }

  // API pública del módulo
  window.LeyesModule = {
    init,
    irPagina(n) { paginaActual = n; renderLista(); }
  };

  document.addEventListener('DOMContentLoaded', init);
})();
