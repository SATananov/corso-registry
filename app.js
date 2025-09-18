import { initClient, getSession, onAuthStateChange } from './api.js';
import { mountNavbar } from './components/navbar.js';
import { viewHome } from './views/home.js';
import { viewCatalog } from './views/catalog.js';
import { viewDetails } from './views/details.js';
import { viewAuth } from './views/auth.js';
import { viewProfile } from './views/profile.js';
import { viewAdmin } from './views/admin.js';

initClient();
const app = document.getElementById('app');
const routes = {
  '#/': viewHome,
  '#/catalog': viewCatalog,
  '#/details': viewDetails,          // expects :id in hash like #/details/uuid
  '#/auth': viewAuth,
  '#/profile': guard(viewProfile, ['user','admin']),
  '#/admin': guard(viewAdmin, ['admin'])
};

function guard(viewFn, roles){
  return async (ctx)=>{
    const { user, role } = await getSession();
    if(!user || (roles && !roles.includes(role))){
      location.hash = '#/auth';
      return;
    }
    return viewFn(ctx);
  }
}

function parseHash(){
  const [path, ...params] = location.hash.split('/');
  return { path: `${path || '#/'}`, params };
}

async function router(){
  const session = await getSession();
  mountNavbar(session);
  const { path, params } = parseHash();
  const view = routes[path] || viewHome;
  app.innerHTML = '<div class="empty">Зареждане…</div>';
  await view({ app, params });
}

window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
  onAuthStateChange(router);
  if(!location.hash) location.hash = '#/';
  router();
});
