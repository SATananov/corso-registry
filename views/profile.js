import { client, getSession, createDog, updateDog, submitForReview } from '../api.js';

export async function viewProfile({ app }){
  const { user } = await getSession();
  const mine = await client().from('dogs').select('*').eq('owner_id', user.id).order('updated_at',{ascending:false});
  app.innerHTML = `
    <h1>My Profile</h1>
    <section class="card"><div class="body">
      <h3>New Dog</h3>
      <form id="dogForm" class="form">
        <input class="input" name="name" placeholder="Име" required>
        <select name="sex" required><option value="M">Мъжко</option><option value="F">Женско</option></select>
        <input class="input" name="city" placeholder="Град">
        <textarea class="input" name="description" placeholder="Описание"></textarea>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn">Запази (Draft)</button>
          <button class="btn" type="button" id="submitBtn">Изпрати за одобрение</button>
        </div>
      </form>
    </div></section>

    <h3 style="margin-top:24px">Моите записи</h3>
    <div id="myList" class="grid"></div>
  `;

  const myList = document.getElementById('myList');
  function renderList(rows){
    myList.innerHTML = rows.length? rows.map(d=>`
      <article class="card"><div class="body">
        <b>${escapeHtml(d.name)}</b> <span class="badge">${d.status}</span>
        <div class="muted">${d.sex==='M'?'♂ M':'♀ F'} · ${escapeHtml(d.city||'')}</div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="btn" data-edit="${d.id}">Edit</button>
          <button class="btn" data-submit="${d.id}">Submit</button>
        </div>
      </div></article>`).join('') : `<div class="empty">Нямаш записи</div>`;
  }
  renderList(mine.data||[]);

  document.getElementById('dogForm').addEventListener('submit', async (e)=>{
    e.preventDefault(); const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries()); payload.status='draft';
    payload.sex = payload.sex||'M';
    const { error } = await createDog(payload);
    if(!error){ location.reload(); }
  });

  document.getElementById('submitBtn').addEventListener('click', async ()=>{
    const btn = document.querySelector('[data-submit]');
    if(!btn){ alert('Няма какво да изпратиш. Създай запис първо.'); return; }
    const id = btn.getAttribute('data-submit');
    await submitForReview(id); location.reload();
  });

  myList.addEventListener('click', async (e)=>{
    const id = e.target.getAttribute?.('data-edit');
    if(id){ const name = prompt('Ново име:'); if(name){ await updateDog(id,{ name }); location.reload(); } }
  });
}
function escapeHtml(s=''){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
