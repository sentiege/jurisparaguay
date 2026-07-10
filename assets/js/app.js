/* =================================================
   JurisParaguay — app.js (reescritura desde cero)
   ================================================= */

/* ── Service Worker ── */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/jurisparaguay/sw.js', { scope: '/jurisparaguay/' })
    .then(() => console.log('SW registrado'))
    .catch(e => console.warn('SW error:', e));
}

/* ── Constantes ── */
const BASE = 'https://sentiege.github.io/jurisparaguay';
const CODIGOS = [
  { id:'codigo-civil',                 nombre:'Código Civil',                            path:'codigos/codigocivil/codigo_civil_completo.json' },
  { id:'codigo-penal',                 nombre:'Código Penal',                            path:'codigos/codigopenal/codigo_penal_completo.json' },
  { id:'codigo-ninez',                 nombre:'Código de la Niñez y Adolescencia',       path:'codigos/codigoninez/codigo_ninez_completo.json' },
  { id:'codigo-ejecucion-penal',       nombre:'Código de Ejecución Penal',               path:'codigos/codigoejecucionpenal/codigo_ejecucionpenal_completo.json' },
  { id:'codigo-laboral',               nombre:'Código Laboral',                          path:'codigos/codigolaboral/codigo_laboral_completo.json' },
  { id:'codigo-procesal-civil',        nombre:'Código Procesal Civil',                   path:'codigos/codigoprocesalcivil/codigo_procesal_civil_completo.json' },
  { id:'codigo-procesal-penal',        nombre:'Código Procesal Penal',                   path:'codigos/codigoprocesalpenal/codigo_procesalpenal_completo.json' },
  { id:'codigo-procesal-laboral',      nombre:'Código Procesal Laboral',                 path:'codigos/codigoprocesallaboral/codigo_procesallaboral_completo.json' },
  { id:'codigo-organizacion-judicial', nombre:'Código de Organización Judicial',         path:'codigos/codigoorganizacionjudicial/codigo_organizacion_judicial_completo.json' },
  { id:'codigo-electoral',             nombre:'Código Electoral',                        path:'codigos/codigoelectoral/codigo_electoral_completo.json' },
  { id:'codigo-navegacion',            nombre:'Código de Navegación Fluvial y Marítima', path:'codigos/codigonavegacion/codigo_navegacion_completo.json' },
  { id:'codigo-aeronautico',           nombre:'Código Aeronáutico',                      path:'codigos/codigoaeronautico/codigo_aeronautico_completo.json' },
  { id:'codigo-rural',                 nombre:'Código Rural',                            path:'codigos/codigorural/codigo_rural_completo.json' },
  { id:'codigo-aduanero',              nombre:'Código Aduanero',                         path:'codigos/codigoaduanero/codigo_aduanero_completo.json' },
  { id:'codigo-mineria',               nombre:'Código de Minería',                       path:'codigos/codigomineria/codigo_minero_completo.json' },
  { id:'codigo-sanitario',             nombre:'Código Sanitario',                        path:'codigos/codigosanitario/codigo_sanitario_completo.json' },
];
const PREVIEW = 20; // artículos iniciales por código

/* ── Estado global ── */
let INDICE = [];        // [{ codigoId, codigoNombre, codigoUrl, numero, epigrafe, texto[], palabrasClave[] }]
let LISTO  = false;
let QUERY_PENDIENTE = '';

/* ── Utilidades ── */
const norm = s => (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const esc  = s => (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function hl(text, q) {
  if (!q || !text) return esc(text||'');
  return esc(text).replace(
    new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi'),
    '<mark>$1</mark>'
  );
}

/* ── Extracción recursiva de artículos ── */
const STRUCT_KEYS = ['libros','libro','partes','parte','titulos','titulo',
  'secciones','seccion','capitulos','capitulo','subcapitulos','subcapitulo',
  'articulos','articulo','arts','items','artículos','libros_internos'];

function extraerArticulos(node, out) {
  if (!node || typeof node !== 'object') return;
  // Si es artículo hoja, agregarlo
  if ('numero' in node) out.push(node);
  // Recorrer claves estructurales conocidas
  for (const k of STRUCT_KEYS) {
    if (Array.isArray(node[k])) node[k].forEach(c => extraerArticulos(c, out));
  }
  // Fallback: otras claves objeto/array no visitadas
  const visitadas = new Set(STRUCT_KEYS);
  for (const k of Object.keys(node)) {
    if (visitadas.has(k)) continue;
    const v = node[k];
    if (Array.isArray(v))             v.forEach(c => extraerArticulos(c, out));
    else if (v && typeof v==='object') extraerArticulos(v, out);
  }
}

/* ── Diagnóstico ── */
function diag(msg, tipo='info') {
  const el = document.getElementById('jp-diag');
  if (!el) return;
  const d = document.createElement('div');
  d.style.background = tipo==='ok'?'#1a5c3a':tipo==='error'?'#7b1d1d':'#1a3a5c';
  d.textContent = msg;
  el.appendChild(d);
  setTimeout(() => d.remove(), 7000);
}

/* ── Progreso ── */
function setProgreso(done, total, errores) {
  const bar  = document.getElementById('jp-progress-bar');
  const txt  = document.getElementById('jp-progress-text');
  const wrap = document.getElementById('jp-progress-wrap');
  if (!bar) return;
  const pct = Math.round((done/total)*100);
  bar.style.width = pct + '%';
  if (txt) {
    if (done < total) txt.textContent = `Cargando índice… ${done}/${total} códigos`;
    else if (errores) txt.textContent = `⚠️ ${done} cargados, ${errores} con error`;
    else              txt.textContent = `✅ ${total} códigos listos`;
  }
  if (pct === 100 && wrap) setTimeout(() => wrap.classList.add('done'), 1500);
}

/* ── Carga del índice global ── */
async function cargarIndice() {
  let done = 0, errores = 0;
  setProgreso(0, CODIGOS.length, 0);

  const todos = await Promise.allSettled(
    CODIGOS.map(async cod => {
      const url = `${BASE}/${cod.path}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
      const data = await res.json();
      const arts = [];
      extraerArticulos(data, arts);
      done++;
      setProgreso(done, CODIGOS.length, errores);
      console.log(`✔ ${cod.nombre}: ${arts.length} artículos`);
      return { cod, arts };
    })
  );

  INDICE = [];
  todos.forEach(r => {
    if (r.status !== 'fulfilled') {
      errores++;
      done++;
      console.error('❌', r.reason?.message);
      diag('❌ ' + (r.reason?.message || 'Error'), 'error');
      return;
    }
    const { cod, arts } = r.value;
    // Buscar internalUrl en CATEGORIAS (de data.js)
    const meta = (typeof CATEGORIAS !== 'undefined')
      ? CATEGORIAS.flatMap(c => c.codigos).find(c => c.id === cod.id)
      : null;
    const codigoUrl = meta ? meta.internalUrl : '#';
    arts.forEach(art => {
      INDICE.push({
        codigoId:     cod.id,
        codigoNombre: cod.nombre,
        codigoUrl,
        numero:       art.numero,
        epigrafe:     art.epigrafe  || '',
        texto:        Array.isArray(art.texto) ? art.texto : (art.texto ? [art.texto] : []),
        palabrasClave: Array.isArray(art.palabrasClave) ? art.palabrasClave : [],
      });
    });
  });

  LISTO = true;
  setProgreso(CODIGOS.length, CODIGOS.length, errores);
  diag(`✅ Índice listo: ${INDICE.length} artículos (${errores} errores)`, INDICE.length > 0 ? 'ok' : 'error');
  console.log('INDICE_GLOBAL cargado:', INDICE.length, 'artículos');

  // Si el usuario ya tenía una búsqueda pendiente, ejecutarla ahora
  if (QUERY_PENDIENTE) {
    const q = QUERY_PENDIENTE;
    QUERY_PENDIENTE = '';
    ejecutarBusqueda(q);
  }
}

/* ── Render grid de categorías ── */
function renderGrid(cats) {
  const grid = document.getElementById('categorias-grid');
  if (!grid) return;
  const filtradas = cats.filter(c => c.codigos && c.codigos.length);
  if (!filtradas.length) {
    grid.innerHTML = '<div class="empty-state"><div class="big">🔎</div><p>Sin resultados en los metadatos.</p></div>';
    return;
  }
  grid.innerHTML = filtradas.map(cat => `
    <div class="categoria-card">
      <div class="categoria-card__header" style="background:${cat.color}">
        <span class="icon">${cat.icono}</span>
        <h2>${esc(cat.nombre)}</h2>
      </div>
      <div class="categoria-card__body">
        ${cat.codigos.map(c => `
          <a href="${c.internalUrl}" class="codigo-item" data-id="${c.id}">
            <span class="codigo-item__num">${esc(c.ley)}</span>
            <span class="codigo-item__info">
              <span class="codigo-item__nombre">${esc(c.nombre)}</span>
              <span class="codigo-item__desc">${esc((c.descripcion||'').substring(0,80))}…</span>
            </span>
          </a>
        `).join('')}
      </div>
    </div>
  `).join('');
}

/* ── Limpiar resultados ── */
function limpiar() {
  const c = document.getElementById('resultados-container');
  if (c) c.innerHTML = '';
}
function setStatus(html) {
  const c = document.getElementById('resultados-container');
  if (c) c.innerHTML = `<div class="jp-search-status">${html}</div>`;
}

/* ── Búsqueda de metadatos (filtra tarjetas) ── */
function buscarMetadatos(qn) {
  renderGrid(CATEGORIAS.map(cat => ({
    ...cat,
    codigos: cat.codigos.filter(c =>
      norm(c.nombre).includes(qn) ||
      norm(c.ley).includes(qn) ||
      norm(c.descripcion).includes(qn)
    )
  })));
}

/* ── Búsqueda de artículos ── */
function buscarArticulos(q, qn) {
  // Filtrar: la palabra debe aparecer en epígrafe, palabrasClave o algún párrafo de texto
  const matches = [];
  for (const art of INDICE) {
    const enEpigrafe = norm(art.epigrafe).includes(qn);
    const enKw = art.palabrasClave.some(k => norm(k).includes(qn));
    const enTexto = art.texto.some(t => norm(t).includes(qn));
    if (enEpigrafe || enKw || enTexto) matches.push(art);
  }

  console.log(`Búsqueda "${q}": ${matches.length} artículos encontrados en INDICE de ${INDICE.length}`);

  if (!matches.length) {
    setStatus(`🔍 No se encontraron artículos que mencionen «<strong>${esc(q)}</strong>».
      <br><small>Índice cargado: ${INDICE.length} artículos.</small>`);
    return;
  }

  renderResultados(matches, q, qn);
}

/* ── Render resultados por código ── */
function renderResultados(matches, rawQ, qn) {
  const c = document.getElementById('resultados-container');
  if (!c) return;
  c.innerHTML = '';

  // Agrupar por código
  const grupos = {};
  const orden  = [];
  for (const art of matches) {
    if (!grupos[art.codigoId]) {
      grupos[art.codigoId] = { nombre: art.codigoNombre, url: art.codigoUrl, arts: [] };
      orden.push(art.codigoId);
    }
    grupos[art.codigoId].arts.push(art);
  }

  // Header con total y chips
  const hdr = document.createElement('div');
  hdr.className = 'jp-resultados-header';
  hdr.innerHTML = `
    <h2 class="jp-resultados-titulo">
      🔎 <strong>${matches.length}</strong> artículo${matches.length!==1?'s':''}
      en <strong>${orden.length}</strong> código${orden.length!==1?'s':''}
      para &ldquo;<em>${esc(rawQ)}</em>&rdquo;
    </h2>
    <div class="jp-chips">
      ${orden.map(id=>`
        <a href="#grp-${id}" class="jp-chip">
          ${esc(grupos[id].nombre)}
          <span class="jp-chip__count">${grupos[id].arts.length}</span>
        </a>`).join('')}
    </div>`;
  c.appendChild(hdr);

  // Un bloque por código
  for (const id of orden) {
    const g = grupos[id];
    const sec = document.createElement('div');
    sec.className = 'jp-grupo';
    sec.id = `grp-${id}`;

    sec.innerHTML = `
      <div class="jp-grupo__header">
        <span class="jp-grupo__nombre">${esc(g.nombre)}</span>
        <span class="jp-grupo__meta">
          <span class="jp-grupo__count">${g.arts.length} resultado${g.arts.length!==1?'s':''}</span>
          <a href="${g.url}" class="jp-grupo__link">Abrir código →</a>
        </span>
      </div>`;

    const lista = document.createElement('div');
    lista.className = 'jp-art-lista';
    pintarArts(lista, g.arts, qn, rawQ, 0, PREVIEW);
    sec.appendChild(lista);

    if (g.arts.length > PREVIEW) {
      const btn = document.createElement('button');
      btn.className = 'jp-ver-mas';
      let shown = PREVIEW;
      const rest0 = g.arts.length - shown;
      btn.textContent = `▼ Ver ${Math.min(rest0, 20)} artículos más (${rest0} restantes)`;
      btn.onclick = () => {
        const next = shown + 20;
        pintarArts(lista, g.arts, qn, rawQ, shown, next);
        shown = next;
        const rest = g.arts.length - shown;
        if (rest <= 0) btn.remove();
        else btn.textContent = `▼ Ver ${Math.min(rest, 20)} artículos más (${rest} restantes)`;
      };
      sec.appendChild(btn);
    }
    c.appendChild(sec);
  }
}

function pintarArts(lista, arts, qn, rawQ, desde, hasta) {
  for (const art of arts.slice(desde, hasta)) {
    const parrafos = art.texto.filter(t => norm(t).includes(qn));
    const snippets = parrafos.slice(0, 3).map(p => {
      const idx   = norm(p).indexOf(qn);
      const start = Math.max(0, idx - 80);
      const frag  = (start > 0 ? '…' : '') +
        p.slice(start, start + 220) +
        (p.length > start + 220 ? '…' : '');
      return `<div class="jp-art-item__snippet">${hl(frag, rawQ)}</div>`;
    }).join('');

    const a = document.createElement('a');
    a.href      = `${art.codigoUrl}#art-${art.numero}`;
    a.className = 'jp-art-item';
    a.innerHTML = `
      <div class="jp-art-item__header">
        <span class="jp-art-item__num">Art. ${art.numero}</span>
        <span class="jp-art-item__epigrafe">${hl(art.epigrafe || '(sin epígrafe)', rawQ)}</span>
      </div>
      ${snippets}`;
    lista.appendChild(a);
  }
}

/* ── Ejecutar búsqueda completa ── */
function ejecutarBusqueda(q) {
  const qn = norm(q);
  limpiar();
  buscarMetadatos(qn);
  if (!LISTO) {
    setStatus('⏳ Cargando artículos… los resultados aparecerán automáticamente.');
    QUERY_PENDIENTE = q;
    return;
  }
  buscarArticulos(q, qn);
}

/* ── Botón buscar (llamado desde HTML) ── */
function buscar() {
  const q = (document.getElementById('searchInput')?.value || '').trim();
  if (!q) {
    limpiar();
    renderGrid(CATEGORIAS);
    return;
  }
  ejecutarBusqueda(q);
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  renderGrid(CATEGORIAS);
  cargarIndice().catch(e => {
    console.error(e);
    diag('❌ Error fatal cargando índice: ' + e.message, 'error');
  });

  const input = document.getElementById('searchInput');
  if (!input) return;

  let timer = null;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    const q = input.value.trim();
    if (!q) { limpiar(); renderGrid(CATEGORIAS); return; }
    timer = setTimeout(() => ejecutarBusqueda(q), 350);
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { clearTimeout(timer); buscar(); }
  });
});
