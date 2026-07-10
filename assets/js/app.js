/* =============================================
   JurisParaguay — Lógica Principal
   ============================================= */

// URL base absoluta del repo en GitHub Pages (sin trailing slash)
const BASE_URL = 'https://sentiege.github.io/jurisparaguay';

const JSON_CODIGOS = [
  { id: 'codigo-civil',                 nombre: 'Código Civil',                             path: 'codigos/codigocivil/codigo_civil_completo.json' },
  { id: 'codigo-penal',                 nombre: 'Código Penal',                             path: 'codigos/codigopenal/codigo_penal_completo.json' },
  { id: 'codigo-ninez',                 nombre: 'Código de la Niñez y Adolescencia',        path: 'codigos/codigoninez/codigo_ninez_completo.json' },
  { id: 'codigo-ejecucion-penal',       nombre: 'Código de Ejecución Penal',                path: 'codigos/codigoejecucionpenal/codigo_ejecucionpenal_completo.json' },
  { id: 'codigo-laboral',               nombre: 'Código Laboral',                           path: 'codigos/codigolaboral/codigo_laboral_completo.json' },
  { id: 'codigo-procesal-civil',        nombre: 'Código Procesal Civil',                    path: 'codigos/codigoprocesalcivil/codigo_procesal_civil_completo.json' },
  { id: 'codigo-procesal-penal',        nombre: 'Código Procesal Penal',                    path: 'codigos/codigoprocesalpenal/codigo_procesalpenal_completo.json' },
  { id: 'codigo-procesal-laboral',      nombre: 'Código Procesal Laboral',                  path: 'codigos/codigoprocesallaboral/codigo_procesallaboral_completo.json' },
  { id: 'codigo-organizacion-judicial', nombre: 'Código de Organización Judicial',          path: 'codigos/codigoorganizacionjudicial/codigo_organizacion_judicial_completo.json' },
  { id: 'codigo-electoral',             nombre: 'Código Electoral',                         path: 'codigos/codigoelectoral/codigo_electoral_completo.json' },
  { id: 'codigo-navegacion',            nombre: 'Código de Navegación Fluvial y Marítima',  path: 'codigos/codigonavegacion/codigo_navegacion_completo.json' },
  { id: 'codigo-aeronautico',           nombre: 'Código Aeronáutico',                       path: 'codigos/codigoaeronautico/codigo_aeronautico_completo.json' },
  { id: 'codigo-rural',                 nombre: 'Código Rural',                             path: 'codigos/codigorural/codigo_rural_completo.json' },
  { id: 'codigo-aduanero',              nombre: 'Código Aduanero',                          path: 'codigos/codigoaduanero/codigo_aduanero_completo.json' },
  { id: 'codigo-mineria',               nombre: 'Código de Minería',                        path: 'codigos/codigomineria/codigo_minero_completo.json' },
  { id: 'codigo-sanitario',             nombre: 'Código Sanitario',                         path: 'codigos/codigosanitario/codigo_sanitario_completo.json' },
];

let INDICE_GLOBAL = [];
let indiceListoResolve;
const indiceListoPromise = new Promise(res => { indiceListoResolve = res; });
let cargaProgreso = { total: JSON_CODIGOS.length, listos: 0, fallidos: [] };

/* ─── Utilidades ──────────────────────────────────────────── */
function normalize(str) {
  return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function escapeHtml(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function highlight(str, query) {
  if (!query || !str) return escapeHtml(str || '');
  const escaped = escapeHtml(str);
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return escaped.replace(re, '<mark>$1</mark>');
}

/* ─── Extracción recursiva de artículos ──────────────────── */
function extractArticulos(node, out) {
  if (!node || typeof node !== 'object') return;
  if ('numero' in node && (node.texto !== undefined || node.epigrafe !== undefined)) {
    out.push(node); return;
  }
  for (const key of Object.keys(node)) {
    const val = node[key];
    if (Array.isArray(val)) val.forEach(child => extractArticulos(child, out));
    else if (val && typeof val === 'object') extractArticulos(val, out);
  }
}

/* ─── Ranking ────────────────────────────────────────────── */
function calcScore(art, qn) {
  let score = 0;
  const epNorm  = normalize(art.epigrafe);
  const kwNorms = (art.palabrasClave || []).map(normalize);
  const txNorms = (art.texto || []).map(normalize);
  const wordRe  = new RegExp(`\\b${qn}\\b`);
  if (epNorm.includes(qn))               { score += 10; if (wordRe.test(epNorm)) score += 2; }
  if (kwNorms.some(k => k.includes(qn))) { score += 5;  if (kwNorms.some(k => wordRe.test(k))) score += 2; }
  txNorms.forEach((t, i) => {
    if (t.includes(qn)) { score += i === 0 ? 3 : 1; if (wordRe.test(t)) score += 1; }
  });
  return score;
}

/* ─── Barra de progreso ──────────────────────────────────── */
function mostrarBarraProgreso() {
  if (document.getElementById('jp-progress-wrap')) return;
  const wrap = document.createElement('div');
  wrap.id = 'jp-progress-wrap';
  wrap.innerHTML = `
    <span id="jp-progress-text">Cargando índice… 0/${cargaProgreso.total} códigos</span>
    <div class="jp-progress-track"><div id="jp-progress-bar" style="width:0%"></div></div>
  `;
  const hero = document.querySelector('.hero');
  if (hero) hero.insertAdjacentElement('afterend', wrap);
  else document.body.prepend(wrap);
}

function actualizarBarraProgreso() {
  const barra = document.getElementById('jp-progress-bar');
  const texto = document.getElementById('jp-progress-text');
  if (!barra) return;
  const pct = Math.round((cargaProgreso.listos / cargaProgreso.total) * 100);
  barra.style.width = pct + '%';
  if (texto) {
    texto.textContent = cargaProgreso.listos < cargaProgreso.total
      ? `Cargando índice… ${cargaProgreso.listos}/${cargaProgreso.total} códigos`
      : cargaProgreso.fallidos.length
        ? `⚠️ ${cargaProgreso.listos} cargados, ${cargaProgreso.fallidos.length} con error`
        : `✅ ${cargaProgreso.total} códigos listos para búsqueda`;
  }
  if (pct === 100) {
    setTimeout(() => {
      const wrap = document.getElementById('jp-progress-wrap');
      if (wrap) wrap.classList.add('jp-progress--done');
    }, 1400);
  }
}

/* ─── Carga e indexado ───────────────────────────────────── */
async function cargarIndiceGlobal() {
  mostrarBarraProgreso();
  cargaProgreso = { total: JSON_CODIGOS.length, listos: 0, fallidos: [] };

  const resultados = await Promise.allSettled(
    JSON_CODIGOS.map(async (cod) => {
      const url = `${BASE_URL}/${cod.path}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
      const data = await res.json();
      const arts = [];
      extractArticulos(data, arts);
      cargaProgreso.listos++;
      actualizarBarraProgreso();
      return { cod, arts };
    })
  );

  INDICE_GLOBAL = [];
  resultados.forEach(r => {
    if (r.status !== 'fulfilled') {
      cargaProgreso.fallidos.push(r.reason?.message || 'Error');
      console.error('⚠️ JSON fallido:', r.reason?.message);
      return;
    }
    const { cod, arts } = r.value;
    const cat = CATEGORIAS.flatMap(c => c.codigos).find(c => c.id === cod.id);
    arts.forEach(art => {
      INDICE_GLOBAL.push({
        codigoId:      cod.id,
        codigoNombre:  cod.nombre,
        codigoUrl:     cat ? cat.internalUrl : '#',
        numero:        art.numero,
        epigrafe:      art.epigrafe || '',
        texto:         art.texto || [],
        palabrasClave: art.palabrasClave || [],
      });
    });
  });

  actualizarBarraProgreso();
  indiceListoResolve();

  // Debug visible en consola y en pantalla
  const total = INDICE_GLOBAL.length;
  const errores = cargaProgreso.fallidos.length;
  console.log(`✅ Índice listo: ${total} artículos | ${errores} errores`);
  if (errores) console.warn('Errores:', cargaProgreso.fallidos);
}

/* ─── Render categorías ──────────────────────────────────── */
function renderCategorias(cats) {
  const grid = document.getElementById('categorias-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const con = cats.filter(c => c.codigos && c.codigos.length);
  if (!con.length) {
    grid.innerHTML = '<div class="empty-state"><div class="big">🔎</div><p>No se encontraron categorías.</p></div>';
    return;
  }
  con.forEach(cat => {
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
              <span class="codigo-item__desc">${escapeHtml(c.descripcion.substring(0, 80))}…</span>
            </span>
          </a>
        `).join('')}
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ─── INIT ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderCategorias(CATEGORIAS);
  cargarIndiceGlobal().catch(err => console.error('Error cargando índice:', err));

  const input = document.getElementById('searchInput');
  if (!input) return;

  let debounceTimer = null;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const q = input.value.trim();
    ocultarResultadosGlobales();
    if (!q) { renderCategorias(CATEGORIAS); return; }
    buscarMetadatos(q);
    debounceTimer = setTimeout(() => buscarArticulos(q), 400);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      clearTimeout(debounceTimer);
      const q = input.value.trim();
      if (!q) return;
      ocultarResultadosGlobales();
      buscarMetadatos(q);
      buscarArticulos(q);
    }
  });
});

async function buscar() {
  const q = (document.getElementById('searchInput')?.value || '').trim();
  ocultarResultadosGlobales();
  if (!q) { renderCategorias(CATEGORIAS); return; }
  buscarMetadatos(q);
  await buscarArticulos(q);
}

/* ─── Búsqueda metadatos ─────────────────────────────────── */
function buscarMetadatos(q) {
  const qn = normalize(q);
  renderCategorias(CATEGORIAS.map(cat => ({
    ...cat,
    codigos: cat.codigos.filter(c =>
      normalize(c.nombre).includes(qn) ||
      normalize(c.ley).includes(qn) ||
      normalize(c.descripcion).includes(qn)
    )
  })));
}

/* ─── Búsqueda artículos ─────────────────────────────────── */
async function buscarArticulos(q) {
  const qn = normalize(q);

  if (INDICE_GLOBAL.length === 0) {
    mostrarEstadoBusqueda('⏳ Cargando artículos… esperá un momento y volvé a buscar.');
    await indiceListoPromise;
    ocultarResultadosGlobales();
  }

  if (INDICE_GLOBAL.length === 0) {
    mostrarEstadoBusqueda('⚠️ No se pudieron cargar los artículos. Recargá la página.');
    return;
  }

  const matches = INDICE_GLOBAL
    .map(art => ({ art, score: calcScore(art, qn) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ art }) => art);

  if (!matches.length) {
    mostrarEstadoBusqueda(`🔍 No se encontraron artículos que mencionen "<strong>${escapeHtml(q)}</strong>".`);
    return;
  }

  mostrarResultadosGlobales(matches, q);
}

function mostrarEstadoBusqueda(html) {
  ocultarResultadosGlobales();
  const el = document.createElement('div');
  el.id = 'resultados-globales';
  el.className = 'jp-search-loading';
  el.innerHTML = html;
  document.getElementById('codigos').appendChild(el);
}

/* ─── Render resultados ──────────────────────────────────── */
const PREVIEW_POR_GRUPO = 5;

function mostrarResultadosGlobales(matches, rawQuery) {
  ocultarResultadosGlobales();
  const qn = normalize(rawQuery);

  const resumen = {}, orden = [];
  matches.forEach(m => {
    if (!resumen[m.codigoId]) {
      resumen[m.codigoId] = { nombre: m.codigoNombre, url: m.codigoUrl, total: 0, arts: [] };
      orden.push(m.codigoId);
    }
    resumen[m.codigoId].total++;
    resumen[m.codigoId].arts.push(m);
  });

  const container = document.createElement('div');
  container.id = 'resultados-globales';

  // Encabezado
  const header = document.createElement('div');
  header.className = 'jp-resultados-header';
  header.innerHTML = `
    <h2 class="jp-resultados-titulo">
      🔎 <strong>${matches.length}</strong> artículo${matches.length !== 1 ? 's' : ''}
      en <strong>${orden.length}</strong> código${orden.length !== 1 ? 's' : ''}
      para &ldquo;<em>${escapeHtml(rawQuery)}</em>&rdquo;
    </h2>
    <div class="jp-chips">
      ${orden.map(id => `
        <a href="#jp-grupo-${id}" class="jp-chip">
          ${escapeHtml(resumen[id].nombre)}
          <span class="jp-chip__count">${resumen[id].total}</span>
        </a>
      `).join('')}
    </div>
  `;
  container.appendChild(header);

  // Grupos por código
  orden.forEach(id => {
    const grupo = resumen[id];
    const section = document.createElement('div');
    section.className = 'jp-grupo';
    section.id = `jp-grupo-${id}`;

    section.innerHTML = `
      <div class="jp-grupo__header">
        <span class="jp-grupo__nombre">${escapeHtml(grupo.nombre)}</span>
        <span class="jp-grupo__meta">
          <span class="jp-grupo__count">${grupo.total} resultado${grupo.total !== 1 ? 's' : ''}</span>
          <a href="${grupo.url}" class="jp-grupo__link">Abrir código →</a>
        </span>
      </div>
    `;

    const lista = document.createElement('div');
    lista.className = 'jp-art-lista';
    renderArts(lista, grupo.arts, qn, rawQuery, 0, PREVIEW_POR_GRUPO);
    section.appendChild(lista);

    if (grupo.total > PREVIEW_POR_GRUPO) {
      const verMas = document.createElement('button');
      verMas.className = 'jp-ver-mas';
      verMas.dataset.shown = PREVIEW_POR_GRUPO;
      const r0 = grupo.total - PREVIEW_POR_GRUPO;
      verMas.textContent = `▼ Ver ${Math.min(r0, 20)} artículos más (${r0} restantes)`;
      verMas.addEventListener('click', () => {
        const shown = parseInt(verMas.dataset.shown);
        const next  = shown + 20;
        renderArts(lista, grupo.arts, qn, rawQuery, shown, next);
        verMas.dataset.shown = next;
        const rest = grupo.total - next;
        if (rest <= 0) verMas.remove();
        else verMas.textContent = `▼ Ver ${Math.min(rest, 20)} artículos más (${rest} restantes)`;
      });
      section.appendChild(verMas);
    }

    container.appendChild(section);
  });

  document.getElementById('codigos').appendChild(container);
}

function renderArts(lista, arts, qn, rawQuery, desde, hasta) {
  arts.slice(desde, hasta).forEach(art => {
    const matchedParrafos = art.texto.filter(t => normalize(t).includes(qn));
    const snippets = matchedParrafos.slice(0, 3).map(parr => {
      const idx   = normalize(parr).indexOf(qn);
      const start = Math.max(0, idx - 80);
      const raw   = (start > 0 ? '…' : '') +
        parr.slice(start, start + 220) +
        (parr.length > start + 220 ? '…' : '');
      return `<div class="jp-art-item__snippet">${highlight(raw, rawQuery)}</div>`;
    }).join('');

    const item = document.createElement('a');
    item.href      = `${art.codigoUrl}#art-${art.numero}`;
    item.className = 'jp-art-item';
    item.innerHTML = `
      <div class="jp-art-item__header">
        <span class="jp-art-item__num">Art. ${art.numero}</span>
        <span class="jp-art-item__epigrafe">${highlight(art.epigrafe || '(sin epígrafe)', rawQuery)}</span>
      </div>
      ${snippets}
    `;
    lista.appendChild(item);
  });
}

function ocultarResultadosGlobales() {
  const el = document.getElementById('resultados-globales');
  if (el) el.remove();
}
