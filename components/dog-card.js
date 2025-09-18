export function dogCard(dog){
  const status = dog.status?.[0].toUpperCase()+dog.status?.slice(1);
  return `
  <article class="card">
    <div class="body">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
        <h3 style="margin:0">${escapeHtml(dog.name||'Без име')}</h3>
        <span class="badge status-${status}">${status}</span>
      </div>
      <p class="muted">${dog.sex==='M'?'♂ Мъжко':'♀ Женско'} · ${escapeHtml(dog.city||'—')}</p>
      <p>${escapeHtml(dog.description||'')}</p>
      <a class="btn" href="#/details/${dog.id}">Детайли</a>
    </div>
  </article>`;
}
function escapeHtml(s=''){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
