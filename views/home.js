export async function viewHome({ app }){
  app.innerHTML = `
    <section class="container">
      <h1>Cane Corso Registry</h1>
      <p class="muted">Публичен каталог на одобрени Cane Corso профили и снимки.</p>
      <div class="empty">Използвай менюто Catalog за списък с одобрени записи.</div>
    </section>`;
}
