/* =================================================
   JurisParaguay — app.js
   ================================================= */

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/jurisparaguay/sw.js', { scope: '/jurisparaguay/' })
    .then(() => console.log('SW registrado'))
    .catch(e => console.warn('SW error:', e));
}

const BASE = 'https://sentiege.github.io/jurisparaguay';
const CODIGOS = [
  // ── Códigos ────────────────────────────────────────────────────────────
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
  { id:'constitucion-nacional',        nombre:'Constitución Nacional',                   path:'codigos/constitucion/constitucion_nacional.json' },
  // ── Leyes ──────────────────────────────────────────────────────────────
  { id:'ley-1',     nombre:'Ley de Matrimonio Civil',                          path:'codigos/leyes/ley-1/ley_1_matrimonio_civil.json' },
  { id:'ley-45',    nombre:'Ley de Adopciones',                                path:'codigos/leyes/ley-45/ley_45_adopciones.json' },
  { id:'ley-125',   nombre:'Ley Tributaria N° 125/91',                         path:'codigos/leyes/ley-125/ley_125_tributacion.json' },
  { id:'ley-294',   nombre:'Ley de Evaluación de Impacto Ambiental',           path:'codigos/leyes/ley-294/ley_294_evaluacion_impacto_ambiental.json' },
  { id:'ley-861',   nombre:'Ley General de Bancos y Entidades de Crédito',     path:'codigos/leyes/ley-861/ley_861_general_de_bancos_financieras_y_otras_entidades_de_credito.json' },
  { id:'ley-1034',  nombre:'Ley del Comerciante',                              path:'codigos/leyes/ley-1034/ley_1034_del_comerciante.json' },
  { id:'ley-1294',  nombre:'Ley de Marcas',                                    path:'codigos/leyes/ley-1294/ley_1294_de_marcas.json' },
  { id:'ley-1328',  nombre:'Ley de Derecho de Autor y Derechos Conexos',       path:'codigos/leyes/ley-1328/ley_1328_derecho_de_autor_y_derechos_conexos.json' },
  { id:'ley-1337',  nombre:'Ley Orgánica del Poder Ejecutivo',                 path:'codigos/leyes/ley-1337/ley_1337_poder_ejecutivo.json' },
  { id:'ley-1535',  nombre:'Ley de Administración Financiera del Estado',      path:'codigos/leyes/ley-1535/ley_1535_administracion_financiera_del_estado.json' },
  { id:'ley-1561',  nombre:'Ley del Sistema Nacional del Ambiente',            path:'codigos/leyes/ley-1561/ley_1561_sistema_nacional_del_ambiente.json' },
  { id:'ley-1863',  nombre:'Estatuto Agrario',                                 path:'codigos/leyes/ley-1863/ley_1863_estatuto_agrario.json' },
  { id:'ley-2051',  nombre:'Ley de Contrataciones Públicas',                   path:'codigos/leyes/ley-2051/ley_2051_contrataciones_publicas.json' },
  { id:'ley-3966',  nombre:'Ley Orgánica Municipal',                           path:'codigos/leyes/ley-3966/ley_3966_organica_municipal.json' },
  { id:'ley-4868',  nombre:'Ley de Comercio Electrónico',                      path:'codigos/leyes/ley-4868/ley_4868_comercio_electronico.json' },
  { id:'ley-5074',  nombre:'Ley de Obras Públicas (Régimen Especial)',         path:'codigos/leyes/ley-5074/ley_5074.json' },
  { id:'ley-5542',  nombre:'Ley de Defensa del Consumidor y el Usuario',       path:'codigos/leyes/ley-5542/ley_5542_proteccion_consumidor.json' },
  { id:'ley-5659',  nombre:'Ley de Buen Trato y Protección contra el Castigo Físico', path:'codigos/leyes/ley-5659/ley_5659.json' },
  { id:'ley-5777',  nombre:'Ley Integral de Protección de las Mujeres',        path:'codigos/leyes/ley-5777/ley_5777_proteccion_mujeres.json' },
  { id:'ley-6380',  nombre:'Ley de Modernización y Simplificación Tributaria', path:'codigos/leyes/ley-6380/ley_6380_modernizacion_tributaria.json' },
  { id:'ley-6480',  nombre:'Ley de Empresa por Acciones Simplificadas (EAS)', path:'codigos/leyes/ley-6480/ley_6480_empresa_por_acciones_simplificadas.json' },
  { id:'ley-7445',  nombre:'Ley de la Función Pública',                        path:'codigos/leyes/ley-7445/ley_7445_funcion_publica.json' },
];
const PREVIEW = 20;

let INDICE = [];
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

/* ── Extracción recursiva ── */
const STRUCT_KEYS = ['libros','libro','partes','parte','titulos','titulo',
  'secciones','seccion','capitulos','capitulo','subcapitulos','subcapitulo',
  'articulos','articulo','arts','items','artículos','libros_internos'];

function extraerArticulos(node, out) {
  if (!node || typeof node !== 'object') return;
  if ('numero' in node) out.push(node);
  for (const k of STRUCT_KEYS) {
    if (Array.isArray(node[k])) node[k].forEach(c => extraerArticulos(c, out));
  }
  const visitadas = new Set(STRUCT_KEYS);
  for (const k of Object.keys(node)) {
    if (visitadas.has(k)) continue;
    const v = node[k];
    if (Array.isArray(v))              v.forEach(c => extraerArticulos(c, out));
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
    if (done < total) txt.textContent = `Cargando índice… ${done}/${total} documentos`;
    else if (errores)  txt.textContent = `⚠️ ${done} cargados, ${errores} con error`;
    else               txt.textContent = `✅ ${total} documentos listos para búsqueda`;
  }
  if (pct === 100 && wrap) setTimeout(() => wrap.classList.add('jp-progress--done'), 1500);
}

/* ── Carga ── */
async function cargarIndice() {
  let done = 0, errores = 0;
  setProgreso(0, CODIGOS.length, 0);
  const todos = await Promise.allSettled(
    CODIGOS.map(async cod => {
      const res = await fetch(`${BASE}/${cod.path}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${cod.path}`);
      const data = await res.json();
      const arts = []; extraerArticulos(data, arts);
      done++; setProgreso(done, CODIGOS.length, errores);
      console.log(`✔ ${cod.nombre}: ${arts.length}`);
      return { cod, arts };
    })
  );
  INDICE = [];
  todos.forEach(r => {
    if (r.status !== 'fulfilled') {
      errores++; console.error('❌', r.reason?.message);
      diag('❌ ' + (r.reason?.message||'Error'), 'error'); return;
    }
    const { cod, arts } = r.value;
    const meta = (typeof CATEGORIAS!=='undefined')
      ? CATEGORIAS.flatMap(c=>c.codigos).find(c=>c.id===cod.id) : null;
    arts.forEach(art => INDICE.push({
      codigoId:      cod.id,
      codigoNombre:  cod.nombre,
      codigoUrl:     meta ? meta.internalUrl : '#',
      numero:        art.numero,
      epigrafe:      art.epigrafe  || '',
      texto:         Array.isArray(art.texto) ? art.texto : (art.texto ? [art.texto] : []),
      palabrasClave: Array.isArray(art.palabrasClave) ? art.palabrasClave : [],
    }));
  });
  LISTO = true;
  setProgreso(CODIGOS.length, CODIGOS.length, errores);
  diag(`✅ Índice: ${INDICE.length} artículos`, 'ok');
  if (QUERY_PENDIENTE) { const q=QUERY_PENDIENTE; QUERY_PENDIENTE=''; ejecutarBusqueda(q); }
}

/* ── Render grid ── */
const LIMITE_LEYES = 3;

function renderGrid(cats) {
  const grid = document.getElementById('categorias-grid');
  if (!grid) return;
  const filtradas = cats.filter(c => c.codigos && c.codigos.length);
  if (!filtradas.length) { grid.innerHTML = ''; return; }

  grid.innerHTML = filtradas.map(cat => {
    const codigos = cat.codigos.filter(c => !c.esLey);
    const leyes   = cat.codigos.filter(c =>  c.esLey);

    const itemHtml = c => `
      <a href="${c.internalUrl}" class="cat-item${c.esLey?' cat-item--ley':''}" data-id="${c.id}">
        <span class="cat-item__nombre">${esc(c.nombre)}</span>
        <span class="cat-item__ley">${esc(c.ley)}</span>
      </a>`;

    const leyesVisibles = leyes.slice(0, LIMITE_LEYES).map(itemHtml).join('');
    const leyesOcultas  = leyes.slice(LIMITE_LEYES).map(itemHtml).join('');
    const resto = leyes.length - LIMITE_LEYES;

    return `
      <div class="cat-section">
        <div class="cat-section__title" style="background:${cat.color}">${esc(cat.nombre)}</div>
        <div class="cat-list">${codigos.map(itemHtml).join('')}</div>
        ${leyes.length ? `
          <div class="cat-list__divider">Leyes relacionadas (${leyes.length})</div>
          <div class="cat-list cat-list--leyes">
            ${leyesVisibles}
            ${leyesOcultas ? `<div class="cat-list--collapsed" hidden>${leyesOcultas}</div>` : ''}
          </div>
          ${resto > 0 ? `<button type="button" class="cat-ver-mas" data-resto="${resto}">&#9660; Ver ${resto} más</button>` : ''}
        ` : ''}
      </div>`;
  }).join('');

  grid.querySelectorAll('.cat-ver-mas').forEach(btn => {
    btn.addEventListener('click', () => {
      const lista   = btn.previousElementSibling;
      const oculto  = lista.querySelector('.cat-list--collapsed');
      if (!oculto) return;
      const cerrado = oculto.hidden;
      oculto.hidden = !cerrado;
      const resto   = parseInt(btn.dataset.resto, 10);
      btn.textContent = cerrado
        ? '▴ Ocultar'
        : `▾ Ver ${resto} más`;
    });
  });
}

/* ── Mostrar / ocultar grid ── */
function mostrarGrid() {
  const grid = document.getElementById('categorias-grid');
  if (grid) grid.style.display = '';
}
function ocultarGrid() {
  const grid = document.getElementById('categorias-grid');
  if (grid) grid.style.display = 'none';
}

/* ── Limpiar ── */
function limpiar() {
  const c = document.getElementById('resultados-container');
  if (c) c.innerHTML = '';
}
function setStatus(html) {
  const c = document.getElementById('resultados-container');
  if (c) c.innerHTML = `<div class="jp-search-status">${html}</div>`;
}

/* ── Búsqueda artículos ── */
function buscarArticulos(q, qn) {
  const matches = INDICE.filter(art =>
    norm(art.epigrafe).includes(qn) ||
    art.palabrasClave.some(k => norm(k).includes(qn)) ||
    art.texto.some(t => norm(t).includes(qn))
  );
  console.log(`"${q}": ${matches.length} resultados de ${INDICE.length}`);
  return matches;
}

/* ── Búsqueda leyes ── */
function buscarLeyes(q, qn) {
  if (typeof window._leyesData === 'undefined') return [];
  return window._leyesData.filter(ley => {
    const titulo = norm(ley.acapite || '');
    const numLey = norm(String(ley.numeroLey || ''));
    return titulo.includes(qn) || numLey.includes(qn);
  });
}

/* ── Render resultados leyes ── */
function renderResultadosLeyes(leyes, rawQ, contenedor) {
  const sec = document.createElement('div');
  sec.className = 'jp-leyes-resultados';

  sec.innerHTML = `<h3>📜 ${leyes.length} ley${leyes.length !== 1 ? 'es' : ''} que mencionan &ldquo;<em>${esc(rawQ)}</em>&rdquo;</h3>`;

  const lista = document.createElement('div');
  const mostrar = leyes.slice(0, 20);
  mostrar.forEach(ley => {
    const item = document.createElement('a');
    const href = ley.appURL
      ? `template_lector.html?id=${ley.idProyecto}&ley=${ley.numeroLey}`
      : (ley.appURL || '#');
    item.href = href;
    item.className = 'jp-ley-item';
    const fecha = ley.fechaPromulgacion ? ` — ${ley.fechaPromulgacion}` : '';
    item.innerHTML = `
      <div class="jp-ley-item__num">Ley N.° ${esc(String(ley.numeroLey || '—'))}</div>
      <div class="jp-ley-item__titulo">${hl(ley.acapite || '(Sin título)', rawQ)}</div>
      <div class="jp-ley-item__meta">Promulgación${fecha}${ley.tipoPromulgacion ? ' · ' + esc(ley.tipoPromulgacion) : ''}</div>`;
    lista.appendChild(item);
  });

  if (leyes.length === 0) {
    lista.innerHTML = '<p class="jp-leyes-no-resultados">No se encontraron leyes para esta búsqueda.</p>';
  }

  sec.appendChild(lista);
  contenedor.appendChild(sec);
}

/* ── Render resultados artículos ── */
function renderResultados(matches, rawQ, qn) {
  const c = document.getElementById('resultados-container');
  if (!c) return;
  c.innerHTML = '';
  const grupos = {}, orden = [];
  for (const art of matches) {
    if (!grupos[art.codigoId]) {
      grupos[art.codigoId] = { nombre: art.codigoNombre, url: art.codigoUrl, arts: [] };
      orden.push(art.codigoId);
    }
    grupos[art.codigoId].arts.push(art);
  }
  const hdr = document.createElement('div');
  hdr.className = 'jp-resultados-header';
  hdr.innerHTML = `
    <h2 class="jp-resultados-titulo">
      🔎 <strong>${matches.length}</strong> artículo${matches.length!==1?'s':''}
      en <strong>${orden.length}</strong> documento${orden.length!==1?'s':''}
      para &ldquo;<em>${esc(rawQ)}</em>&rdquo;
    </h2>
    <div class="jp-chips">
      ${orden.map(id=>`<a href="#grp-${id}" class="jp-chip">${esc(grupos[id].nombre)}<span class="jp-chip__count">${grupos[id].arts.length}</span></a>`).join('')}
    </div>`;
  c.appendChild(hdr);
  for (const id of orden) {
    const g = grupos[id];
    const sec = document.createElement('div');
    sec.className = 'jp-grupo';
    sec.id = `grp-${id}`;
    sec.innerHTML = `<div class="jp-grupo__header">
      <span class="jp-grupo__nombre">${esc(g.nombre)}</span>
      <span class="jp-grupo__meta">
        <span class="jp-grupo__count">${g.arts.length} resultado${g.arts.length!==1?'s':''}</span>
        <a href="${g.url}" class="jp-grupo__link">Abrir →</a>
      </span></div>`;
    const lista = document.createElement('div');
    lista.className = 'jp-art-lista';
    pintarArts(lista, g.arts, qn, rawQ, 0, PREVIEW);
    sec.appendChild(lista);
    if (g.arts.length > PREVIEW) {
      const btn = document.createElement('button');
      btn.className = 'jp-ver-mas';
      let shown = PREVIEW;
      const rest0 = g.arts.length - shown;
      btn.textContent = `▼ Ver ${Math.min(rest0,20)} artículos más (${rest0} restantes)`;
      btn.onclick = () => {
        const next = shown + 20;
        pintarArts(lista, g.arts, qn, rawQ, shown, next);
        shown = next;
        const rest = g.arts.length - shown;
        if (rest <= 0) btn.remove();
        else btn.textContent = `▼ Ver ${Math.min(rest,20)} artículos más (${rest} restantes)`;
      };
      sec.appendChild(btn);
    }
    c.appendChild(sec);
  }

  const leyesMatches = buscarLeyes(rawQ, norm(rawQ));
  if (leyesMatches.length > 0) {
    renderResultadosLeyes(leyesMatches, rawQ, c);
  }
}

function pintarArts(lista, arts, qn, rawQ, desde, hasta) {
  for (const art of arts.slice(desde, hasta)) {
    const parrafos = art.texto.filter(t => norm(t).includes(qn));
    const snippets = parrafos.slice(0,3).map(p => {
      const idx = norm(p).indexOf(qn),
            start = Math.max(0, idx - 80);
      const frag = (start>0?'…':'') + p.slice(start, start+220) + (p.length>start+220?'…':'');
      return `<div class="jp-art-item__snippet">${hl(frag,rawQ)}</div>`;
    }).join('');
    const a = document.createElement('a');
    a.href = `${art.codigoUrl}#art-${art.numero}`;
    a.className = 'jp-art-item';
    a.innerHTML = `<div class="jp-art-item__header">
      <span class="jp-art-item__num">Art. ${art.numero}</span>
      <span class="jp-art-item__epigrafe">${hl(art.epigrafe||'(sin epígrafe)',rawQ)}</span>
    </div>${snippets}`;
    lista.appendChild(a);
  }
}

/* ── Ejecutar búsqueda ── */
function ejecutarBusqueda(q) {
  const qn = norm(q);
  limpiar();
  ocultarGrid();
  if (!LISTO) {
    setStatus('⏳ Cargando artículos… aparecerán automáticamente.');
    QUERY_PENDIENTE = q;
    return;
  }
  const matches = buscarArticulos(q, qn);
  const leyesMatches = buscarLeyes(q, qn);

  if (!matches.length && !leyesMatches.length) {
    setStatus(`🔍 No se encontraron artículos ni leyes que mencionen «<strong>${esc(q)}</strong>».<br><small>Índice: ${INDICE.length} artículos.</small>`);
    return;
  }
  if (!matches.length && leyesMatches.length) {
    const c = document.getElementById('resultados-container');
    if (c) { c.innerHTML = ''; renderResultadosLeyes(leyesMatches, q, c); }
    return;
  }
  renderResultados(matches, q, qn);
}

function buscar() {
  const q = (document.getElementById('searchInput')?.value||'').trim();
  if (!q) { limpiar(); mostrarGrid(); renderGrid(CATEGORIAS); return; }
  ejecutarBusqueda(q);
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  renderGrid(CATEGORIAS);
  cargarIndice().catch(e => { console.error(e); diag('❌ Error: '+e.message,'error'); });
  const input = document.getElementById('searchInput');
  if (!input) return;
  let timer = null;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    const q = input.value.trim();
    if (!q) { limpiar(); mostrarGrid(); renderGrid(CATEGORIAS); return; }
    timer = setTimeout(() => ejecutarBusqueda(q), 350);
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      clearTimeout(timer);
      buscar();
    }
  });
});
