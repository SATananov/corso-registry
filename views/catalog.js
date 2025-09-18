import { getDogs } from '../api.js';
import { dogCard } from '../components/dog-card.js';

export async function viewCatalog({ app }){
  const controls = `
    <form id="filters" class="form" style="margin-bottom:16px">
      <input class="input" name="q" placeholder="Търси по име/описание" />
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
        <select name="sex"><option value="">Пол</option><option value="M">Мъжко</option><option value="F">Женско</option></select>
        <input class="input" name="city" placeholder="Град" />
        <select name="status"><option value="approved">Само одобрени</option><option value="">Всички (според права)</option></select>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn">Филтрирай</button>
        <button class="btn" type="button" id="clearBtn">Изчисти</button>
      </div>
    </form>`;

  app.innerHTML = `<h1>Catalog</h1>${controls}<div id="list" class="grid"></div>`;
  const list = document.getElementById('list');

  async function load(){
    const fd = new FormData(document.getElementById('filters'));
    const data = await getDogs({ q:fd.get('q')||'', city:fd.get('city')||'', sex:fd.get('sex')||'', status:fd.get('status')||'approved' });
    list.innerHTML = data.length? data.map(dogCard).join('') : `<div class="empty">Няма записи</div>`;
  }
  document.getElementById('filters').addEventListener('submit', (e)=>{ e.preventDefault(); load(); });
  document.getElementById('clearBtn').addEventListener('click', ()=>{ app.querySelectorAll('input,select').forEach(el=>el.value=''); load(); });
  load();
}
