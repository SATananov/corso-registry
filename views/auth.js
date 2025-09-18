import { login, register } from '../api.js';

export async function viewAuth({ app }){
  app.innerHTML = `
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
    <section>
      <h2>Login</h2>
      <form id="loginForm" class="form">
        <input class="input" name="email" type="email" placeholder="Email" required />
        <input class="input" name="password" type="password" placeholder="Password" required />
        <button class="btn">Вход</button>
      </form>
      <div id="loginMsg" class="muted"></div>
    </section>
    <section>
      <h2>Register</h2>
      <form id="regForm" class="form">
        <input class="input" name="display_name" placeholder="Име за показване" required />
        <input class="input" name="email" type="email" placeholder="Email" required />
        <input class="input" name="password" type="password" placeholder="Password" required />
        <button class="btn">Регистрация</button>
      </form>
      <div id="regMsg" class="muted"></div>
    </section>
  </div>`;

  document.getElementById('loginForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await login(fd.get('email'), fd.get('password'));
    document.getElementById('loginMsg').textContent = error? error.message : 'Успешно!';
    if(!error) location.hash = '#/';
  });

  document.getElementById('regForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try{
      await register(fd.get('email'), fd.get('password'), fd.get('display_name'));
      document.getElementById('regMsg').textContent = 'Провери имейла си (ако е включено потвърждение).';
    }catch(err){ document.getElementById('regMsg').textContent = err.message; }
  });
}
