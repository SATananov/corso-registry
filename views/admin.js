import { adminListPending, adminApprove, adminReject } from '../api.js';

export async function viewAdmin({ app }){
  const rows = await adminListPending();
  app.innerHTML = `<h1>Admin Dashboard</h1>
  <table class="table">
    <thead><tr><th>Dog</th><th>Owner</th><th>City</th><th></th></tr></thead>
    <tbody id="tbody">${rows.map(r=>`
      <tr>
        <td>${escapeHtml(r.name||'')}</td>
        <td>${escapeHtml(r.owner_id||'')}</td>
        <td>${escapeHtml(r.city||'')}</td>
        <td>
          <button class="btn" data-approve="${r.id}">Approve</button>
          <button class="btn" data-reject="${r.id}">Reject</button>
        </td>
      </tr>`).join('')}</tbody>
  </table>`;

  const tbody = document.getElementById('tbody');
  tbody.addEventListener('click', async (e)=>{
    const idA = e.target.getAttribute?.('data-approve');
    const idR = e.target.getAttribute?.('data-reject');
    if(idA){ await adminApprove(idA); location.reload(); }
    if(idR){ const reason = prompt('Причина за отказ:')||''; await adminReject(idR, reason); location.reload(); }
  });
}
function escapeHtml(s=''){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
