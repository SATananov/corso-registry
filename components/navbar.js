import { getSession, logout } from '../api.js';

export function mountNavbar(){
  const host = document.getElementById('navbar');
  const { hash } = location;
  const is = (r)=> hash.startsWith(r);
  const linksGuest = `
    <a href="#/" class="${is('#/')?'active':''}">Home</a>
    <a href="#/catalog" class="${is('#/catalog')?'active':''}">Catalog</a>
    <a href="#/auth" class="${is('#/auth')?'active':''}">Login</a>
  `;
  const linksUser = `
    <a href="#/" class="${is('#/')?'active':''}">Home</a>
    <a href="#/catalog" class="${is('#/catalog')?'active':''}">Catalog</a>
    <a href="#/profile" class="${is('#/profile')?'active':''}">My Profile</a>
    <button class="btn" id="logoutBtn">Logout</button>
  `;
  const linksAdminExtra = `<a href="#/admin" class="${is('#/admin')?'active':''}">Admin</a>`;

  host.innerHTML = `<nav class="nav container">
    <div><a href="#/" class="brand">🐾 Cane Corso</a></div>
    <div id="navLinks">${linksGuest}</div>
  </nav>`;

  (async ()=>{
    const { user, role } = await getSession();
    const nav = document.getElementById('navLinks');
    if(user){
      nav.innerHTML = linksUser + (role==='admin'? (' ' + linksAdminExtra) : '');
      const btn = document.getElementById('logoutBtn');
      btn?.addEventListener('click', async ()=>{ await logout(); location.hash = '#/'; });
    } else {
      nav.innerHTML = linksGuest;
    }
  })();
}
