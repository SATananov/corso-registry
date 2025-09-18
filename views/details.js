import { getDogById } from '../api.js';

export async function viewDetails({ app, params }){
  const id = params[2]; // #/details/{id}
  const dog = await getDogById(id);
  app.innerHTML = `
    <h1>${escapeHtml(dog.name||'Dog')}</h1>
    <p class="muted">${dog.sex==='M'?'♂ Мъжко':'♀ Женско'} · ${escapeHtml(dog.city||'—')} · <span class="badge">${dog.status}</span></p>
    <article class="card"><div class="body">${escapeHtml(dog.description||'')}</div></article>
    <div class="empty">Галерията ще е тук (албуми/снимки) — виж supabase.sql.</div>
  `;
}
function escapeHtml(s=''){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
