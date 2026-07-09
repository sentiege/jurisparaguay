// lector.js — Lector compartido JurisParaguay
// Lee window.CODIGO_NOMBRE, window.CODIGO_LEY, window.CODIGO_JSON, window.CODIGO_LS_KEY

const CODIGO_NOMBRE = window.CODIGO_NOMBRE || 'Código';
const CODIGO_LEY    = window.CODIGO_LEY    || '';
const CODIGO_JSON   = window.CODIGO_JSON   || 'codigo.json';
const CODIGO_LS_KEY = window.CODIGO_LS_KEY || 'jurisparaguay_lastIdx';

let DATA=null,FLAT=[],currentIdx=0,ttsPlaying=false,ttsPaused=false,ttsReadIdx=0,voices=[],deferredInstallPrompt=null;
const $=id=>document.getElementById(id);

document.addEventListener('DOMContentLoaded', () => {
  document.title = CODIGO_NOMBRE + ' — JurisParaguay';

  const sidebar=$('sidebar'),hamburger=$('hamburger'),sidebarTree=$('sidebarTree'),
    searchInput=$('searchInput'),searchClear=$('searchClear'),searchResults=$('searchResults'),
    breadcrumbArticulo=$('breadcrumbArticulo'),articleNumber=$('articleNumber'),
    articleTitle=$('articleTitle'),articleMeta=$('articleMeta'),articleBody=$('articleBody'),
    btnPrev=$('btnPrev'),btnNext=$('btnNext'),btnCopyText=$('btnCopyText'),
    btnTags=$('btnTags'),btnPDF=$('btnPDF'),btnInstall=$('btnInstall'),
    tagsOverlay=$('tagsOverlay'),tagsList=$('tagsList'),tagsArtTitle=$('tagsArtTitle'),tagsClose=$('tagsClose'),
    playerPlay=$('playerPlay'),playerStop=$('playerStop'),playerPrev=$('playerPrev'),
    playerNext=$('playerNext'),playerSkipBack=$('playerSkipBack'),playerSkipFwd=$('playerSkipFwd'),
    playerTitle=$('playerTitle'),playerSubtitle=$('playerSubtitle'),playerCounter=$('playerCounter'),
    playerProgressFill=$('playerProgressFill'),playerSpeed=$('playerSpeed'),
    playerSpeedVal=$('playerSpeedVal'),playerVoice=$('playerVoice');

  // Setear textos dinámicos
  const appTitleEl = document.querySelector('.app-title');
  const appSubtitleEl = document.querySelector('.app-subtitle');
  if (appTitleEl) appTitleEl.textContent = CODIGO_NOMBRE;
  if (appSubtitleEl) appSubtitleEl.textContent = CODIGO_LEY;

  if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});

  window.addEventListener('beforeinstallprompt',e=>{
    e.preventDefault();deferredInstallPrompt=e;
    if(btnInstall) btnInstall.classList.add('visible');
  });
  if(btnInstall) btnInstall.addEventListener('click',async()=>{
    if(!deferredInstallPrompt)return;
    deferredInstallPrompt.prompt();
    const{outcome}=await deferredInstallPrompt.userChoice;
    if(outcome==='accepted') btnInstall.classList.remove('visible');
    deferredInstallPrompt=null;
  });

  if(btnPDF) btnPDF.addEventListener('click',()=>window.print());
  if(btnTags) btnTags.addEventListener('click',openTagsPanel);
  if(tagsClose) tagsClose.addEventListener('click',()=>tagsOverlay.classList.remove('open'));
  if(tagsOverlay) tagsOverlay.addEventListener('click',e=>{
    if(e.target===tagsOverlay) tagsOverlay.classList.remove('open');
  });

  function openTagsPanel(){
    if(!FLAT.length)return;
    const{articulo}=FLAT[currentIdx];
    const tags=articulo.palabrasClave||[];
    if(tagsArtTitle) tagsArtTitle.textContent=`Art. ${articulo.numero}${articulo.epigrafe?' — '+articulo.epigrafe:''}`;
    if(tagsList) tagsList.innerHTML='';
    if(!tags.length){
      if(tagsList) tagsList.innerHTML='<span class="tags-empty">Sin palabras clave.</span>';
    }else{
      tags.forEach(tag=>{
        const chip=document.createElement('button');
        chip.className='tag-chip';
        chip.textContent=tag;
        chip.addEventListener('click',()=>{
          tagsOverlay.classList.remove('open');
          searchInput.value=tag;
          searchClear.classList.add('visible');
          runSearch(tag);
        });
        tagsList.appendChild(chip);
      });
    }
    tagsOverlay.classList.add('open');
  }

  if(hamburger) hamburger.addEventListener('click',()=>sidebar.classList.toggle('open'));

  function normalize(s){return(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
  function highlight(s,q){
    if(!q)return s;
    return s.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`,'gi'),'<mark class="search-highlight">$1</mark>');
  }
  function buildFlat(data){
    const f=[];
    (data.libros||[]).forEach(l=>(l.titulos||[]).forEach(t=>(t.capitulos||[]).forEach(c=>(c.articulos||[]).forEach(a=>f.push({libro:l,titulo:t,capitulo:c,articulo:a})))));
    return f;
  }
  function getHashArtNum(){const h=window.location.hash.replace('#art-','').trim();return h?parseInt(h,10):null;}
  function setHashFromIdx(i){if(FLAT.length)history.replaceState(null,'','#art-'+FLAT[i].articulo.numero);}
  function savePos(i){try{localStorage.setItem(CODIGO_LS_KEY,i);}catch(e){}}
  function loadPos(){try{return parseInt(localStorage.getItem(CODIGO_LS_KEY),10)||0;}catch(e){return 0;}}

  async function loadData(){
    try{
      const res=await fetch(new URL(CODIGO_JSON,window.location.href).href,{cache:'no-store'});
      if(!res.ok) throw new Error('HTTP '+res.status);
      DATA=await res.json();
      if(!DATA||!Array.isArray(DATA.libros)) throw new Error('JSON inválido');
      FLAT=buildFlat(DATA);
      renderSidebar();
      initVoices();
      const h=getHashArtNum();
      let idx=loadPos();
      if(h!==null){const f=FLAT.findIndex(e=>e.articulo.numero===h);if(f!==-1)idx=f;}
      showArticleByIdx(Math.max(0,Math.min(idx,FLAT.length-1)));
      updatePlayerControls();
    }catch(err){
      if(sidebarTree) sidebarTree.innerHTML=`<div class="search-empty">⚠️ ${err.message}</div>`;
      if(articleBody) articleBody.innerHTML=`<div class="article-empty"><div class="article-empty-icon">⚠️</div><p>No se pudo cargar ${CODIGO_JSON}.<br>Verificá que el archivo existe en el servidor.</p></div>`;
    }
  }

  function initVoices(){
    function pop(){
      voices=speechSynthesis.getVoices().filter(v=>v.lang.startsWith('es'));
      if(!voices.length) voices=speechSynthesis.getVoices();
      if(!playerVoice) return;
      playerVoice.innerHTML='';
      voices.forEach((v,i)=>{
        const o=document.createElement('option');
        o.value=i;
        o.textContent=v.name+(v.lang?` (${v.lang})`:'');
        playerVoice.appendChild(o);
      });
      const py=voices.findIndex(v=>v.lang.startsWith('es-PY'));
      playerVoice.selectedIndex=py>=0?py:0;
    }
    if(speechSynthesis.onvoiceschanged!==undefined) speechSynthesis.onvoiceschanged=pop;
    pop();
  }

  function getVoice(){return voices[parseInt(playerVoice?playerVoice.value:0,10)]||null;}

  if(playerSpeed) playerSpeed.addEventListener('input',()=>{
    if(playerSpeedVal) playerSpeedVal.textContent=parseFloat(playerSpeed.value).toFixed(1)+'×';
  });

  function renderSidebar(){
    if(!sidebarTree) return;
    sidebarTree.innerHTML='';
    DATA.libros.forEach(libro=>{
      const gt=document.createElement('div');
      gt.className='tree-group-title';
      gt.textContent=libro.nombre;
      sidebarTree.appendChild(gt);
      libro.titulos.forEach(titulo=>{
        const block=document.createElement('section');
        block.className='title-block';
        const head=document.createElement('button');
        head.className='title-head';
        head.type='button';
        head.innerHTML=`<div class="title-head-main"><span class="title-kicker">Título ${titulo.numero}</span><span class="title-name">${titulo.nombre}</span><span class="title-range">Arts. ${titulo.rangoArticulos}</span></div><span class="title-chevron">›</span>`;
        head.addEventListener('click',()=>block.classList.toggle('open'));
        block.appendChild(head);
        const cl=document.createElement('div');
        cl.className='chapter-list';
        titulo.capitulos.forEach(cap=>{
          const btn=document.createElement('button');
          btn.className='chapter-btn';
          btn.type='button';
          btn.dataset.capId=cap.id;
          btn.innerHTML=`<span class="chapter-name">Cap. ${cap.numero} — ${cap.nombre}</span><span class="chapter-range">Arts. ${cap.rangoArticulos}</span>`;
          btn.addEventListener('click',()=>{
            setActiveChapterBtn(btn);
            const fi=FLAT.findIndex(e=>e.capitulo.id===cap.id);
            if(fi!==-1) showArticleByIdx(fi);
            if(window.innerWidth<=900) sidebar.classList.remove('open');
          });
          cl.appendChild(btn);
        });
        block.appendChild(cl);
        sidebarTree.appendChild(block);
      });
    });
  }

  function setActiveChapterBtn(ab){
    document.querySelectorAll('.chapter-btn').forEach(b=>b.classList.remove('active'));
    if(ab) ab.classList.add('active');
  }

  function showArticleByIdx(idx,fp){
    if(!FLAT.length)return;
    idx=Math.max(0,Math.min(idx,FLAT.length-1));
    currentIdx=idx;
    savePos(idx);
    const{titulo,capitulo,articulo}=FLAT[idx];
    setHashFromIdx(idx);
    if(breadcrumbArticulo) breadcrumbArticulo.textContent=`Art. ${articulo.numero}${articulo.epigrafe?' — '+articulo.epigrafe:''}`;
    if(articleNumber) articleNumber.textContent=`Artículo ${articulo.numero}`;
    if(articleTitle) articleTitle.textContent=articulo.epigrafe||`Artículo ${articulo.numero}`;
    if(articleMeta) articleMeta.textContent=`Título ${titulo.numero} — ${titulo.nombre} · Capítulo ${capitulo.numero} — ${capitulo.nombre}`;
    const textos=articulo.texto||[];
    if(articleBody) articleBody.innerHTML=textos.length
      ?textos.map(p=>`<p>${p}</p>`).join('')
      :`<div class="article-empty"><div class="article-empty-icon">📄</div><p>Texto no disponible.</p></div>`;
    if(btnPrev) btnPrev.disabled=idx===0;
    if(btnNext) btnNext.disabled=idx===FLAT.length-1;
    const cb=document.querySelector(`.chapter-btn[data-cap-id="${capitulo.id}"]`);
    setActiveChapterBtn(cb);
    if(cb){
      const bl=cb.closest('.title-block');
      if(bl) bl.classList.add('open');
      if(!fp) cb.scrollIntoView({block:'nearest',behavior:'smooth'});
    }
  }

  if(btnPrev) btnPrev.addEventListener('click',()=>showArticleByIdx(currentIdx-1));
  if(btnNext) btnNext.addEventListener('click',()=>showArticleByIdx(currentIdx+1));

  window.addEventListener('hashchange',()=>{
    const h=getHashArtNum();
    if(h!==null&&FLAT.length){
      const f=FLAT.findIndex(e=>e.articulo.numero===h);
      if(f!==-1&&f!==currentIdx) showArticleByIdx(f);
    }
  });

  function copyCurrentArticle(){
    if(!FLAT.length)return;
    const{articulo}=FLAT[currentIdx];
    const txt=[`Artículo ${articulo.numero}${articulo.epigrafe?' — '+articulo.epigrafe:''}`,'',...(articulo.texto||['(texto no disponible)'])].join('\n');
    navigator.clipboard.writeText(txt).then(()=>{
      if(btnCopyText){btnCopyText.textContent='✅ Copiado';setTimeout(()=>btnCopyText.textContent='Copiar texto',2000);}
    });
  }
  if(btnCopyText) btnCopyText.addEventListener('click',copyCurrentArticle);

  let sd=null;
  if(searchInput) searchInput.addEventListener('input',()=>{
    const q=searchInput.value.trim();
    if(searchClear) searchClear.classList.toggle('visible',q.length>0);
    clearTimeout(sd);
    sd=setTimeout(()=>runSearch(q),200);
  });
  if(searchClear) searchClear.addEventListener('click',()=>{
    searchInput.value='';
    searchClear.classList.remove('visible');
    hideSearchResults();
    searchInput.focus();
  });

  function runSearch(rq){
    if(!rq||!FLAT.length){hideSearchResults();return;}
    const q=normalize(rq);
    const isNum=/^\d+$/.test(rq.trim());
    const matches=FLAT.filter(({articulo:a})=>isNum
      ?String(a.numero)===rq.trim()
      :normalize(a.epigrafe).includes(q)||(a.texto||[]).some(t=>normalize(t).includes(q))||(a.palabrasClave||[]).some(p=>normalize(p).includes(q)));
    showSearchResults(matches,rq);
  }

  function showSearchResults(matches,rq){
    if(sidebarTree) sidebarTree.style.display='none';
    if(searchResults) searchResults.classList.add('visible');
    if(!searchResults) return;
    searchResults.innerHTML='';
    if(!matches.length){
      searchResults.innerHTML=`<div class="search-empty">Sin resultados para "${rq}"</div>`;
      return;
    }
    const cnt=document.createElement('div');
    cnt.className='search-count';
    cnt.textContent=`${matches.length} resultado${matches.length!==1?'s':''}`;
    searchResults.appendChild(cnt);
    matches.forEach(({articulo:a,titulo:t,capitulo:c})=>{
      const fi=FLAT.findIndex(e=>e.articulo.numero===a.numero&&e.capitulo.id===c.id);
      const item=document.createElement('div');
      item.className='search-result-item';
      item.setAttribute('role','button');
      item.setAttribute('tabindex','0');
      const q=normalize(rq);
      const mp=(a.texto||[]).find(tx=>normalize(tx).includes(q));
      let snip='';
      if(mp){const s=Math.max(0,normalize(mp).indexOf(q)-40);snip=(s>0?'…':'')+mp.slice(s,s+100)+(mp.length>s+100?'…':'');}
      item.innerHTML=`<span class="search-result-num">Art. ${a.numero}</span><span class="search-result-epig">${highlight(a.epigrafe||'(sin epígrafe)',rq)}</span><span class="search-result-ctx">${highlight(snip,rq)||`Tít. ${t.numero} · Cap. ${c.numero}`}</span>`;
      const go=()=>{
        showArticleByIdx(fi);
        searchInput.value='';
        if(searchClear) searchClear.classList.remove('visible');
        hideSearchResults();
        if(window.innerWidth<=900&&sidebar) sidebar.classList.remove('open');
      };
      item.addEventListener('click',go);
      item.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')go();});
      searchResults.appendChild(item);
    });
  }

  function hideSearchResults(){
    if(searchResults){searchResults.classList.remove('visible');searchResults.innerHTML='';}
    if(sidebarTree) sidebarTree.style.display='';
  }

  // TTS
  function speakArticle(idx){
    if(!window.speechSynthesis)return;
    speechSynthesis.cancel();
    if(idx>=FLAT.length){ttsStop();return;}
    ttsReadIdx=idx;
    const{articulo}=FLAT[idx];
    showArticleByIdx(idx,true);
    updatePlayerInfo(idx);
    const textos=articulo.texto||[];
    if(!textos.length){setTimeout(()=>{if(ttsPlaying)speakArticle(idx+1);},300);return;}
    const utt=new SpeechSynthesisUtterance((articulo.epigrafe?`Artículo ${articulo.numero}. ${articulo.epigrafe}. `:`Artículo ${articulo.numero}. `)+textos.join(' '));
    utt.rate=parseFloat(playerSpeed?playerSpeed.value:1);
    utt.pitch=1;
    const v=getVoice();
    if(v) utt.voice=v; else utt.lang='es';
    utt.onend=()=>{if(ttsPlaying)speakArticle(idx+1);};
    utt.onerror=e=>{if(e.error==='interrupted'||e.error==='canceled')return;if(ttsPlaying)speakArticle(idx+1);};
    speechSynthesis.speak(utt);
  }

  function ttsPlay(s){
    if(!window.speechSynthesis){alert('Tu navegador no soporta TTS.');return;}
    ttsPlaying=true;ttsPaused=false;
    if(playerPlay) playerPlay.textContent='⏸';
    if(playerStop) playerStop.disabled=false;
    if(playerPrev) playerPrev.disabled=false;
    if(playerNext) playerNext.disabled=false;
    if(playerSkipBack) playerSkipBack.disabled=false;
    if(playerSkipFwd) playerSkipFwd.disabled=false;
    speakArticle(s!==undefined?s:currentIdx);
  }
  function ttsPause(){
    if(speechSynthesis.speaking&&!speechSynthesis.paused){
      speechSynthesis.pause();ttsPaused=true;
      if(playerPlay) playerPlay.textContent='▶';
    }
  }
  function ttsResume(){
    if(speechSynthesis.paused){
      speechSynthesis.resume();ttsPaused=false;
      if(playerPlay) playerPlay.textContent='⏸';
    }
  }
  function ttsStop(){
    speechSynthesis.cancel();ttsPlaying=false;ttsPaused=false;
    if(playerPlay) playerPlay.textContent='▶';
    if(playerStop) playerStop.disabled=true;
    if(playerPrev) playerPrev.disabled=true;
    if(playerNext) playerNext.disabled=true;
    if(playerSkipBack) playerSkipBack.disabled=true;
    if(playerSkipFwd) playerSkipFwd.disabled=true;
    if(playerProgressFill) playerProgressFill.style.width='0%';
    if(playerTitle) playerTitle.textContent='Sin reproducción activa';
    if(playerSubtitle) playerSubtitle.textContent='Presioná ▶ para comenzar';
    if(playerCounter) playerCounter.textContent='';
  }
  function updatePlayerInfo(idx){
    if(!FLAT.length)return;
    const{articulo,titulo,capitulo}=FLAT[idx];
    if(playerTitle) playerTitle.textContent=`Art. ${articulo.numero}${articulo.epigrafe?' — '+articulo.epigrafe:''}`;
    if(playerSubtitle) playerSubtitle.textContent=`Tít. ${titulo.numero} · Cap. ${capitulo.numero}`;
    if(playerCounter) playerCounter.textContent=`${idx+1} / ${FLAT.length}`;
    if(playerProgressFill) playerProgressFill.style.width=(FLAT.length>1?(idx/(FLAT.length-1))*100:100).toFixed(1)+'%';
  }
  function updatePlayerControls(){
    const a=ttsPlaying;
    if(playerStop) playerStop.disabled=!a;
    if(playerPrev) playerPrev.disabled=!a;
    if(playerNext) playerNext.disabled=!a;
    if(playerSkipBack) playerSkipBack.disabled=!a;
    if(playerSkipFwd) playerSkipFwd.disabled=!a;
  }

  if(playerPlay) playerPlay.addEventListener('click',()=>{
    if(!ttsPlaying) ttsPlay(currentIdx);
    else if(ttsPaused) ttsResume();
    else ttsPause();
  });
  if(playerStop) playerStop.addEventListener('click',ttsStop);
  if(playerPrev) playerPrev.addEventListener('click',()=>{if(ttsPlaying)speakArticle(Math.max(0,ttsReadIdx-1));});
  if(playerNext) playerNext.addEventListener('click',()=>{if(ttsPlaying)speakArticle(Math.min(FLAT.length-1,ttsReadIdx+1));});
  if(playerSkipBack) playerSkipBack.addEventListener('click',()=>{if(ttsPlaying)speakArticle(Math.max(0,ttsReadIdx-5));});
  if(playerSkipFwd) playerSkipFwd.addEventListener('click',()=>{if(ttsPlaying)speakArticle(Math.min(FLAT.length-1,ttsReadIdx+5));});

  loadData();
});
