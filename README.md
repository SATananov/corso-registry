# Cane Corso Registry — Starter

Vanilla JS + Supabase SPA: роли (visitor/user/admin), каталог, детайли, auth, админ панел, подготовка за фото галерии.

## Quickstart
1. Create Supabase project. Copy Project URL + anon key.
2. Run `supabase.sql` in SQL editor (tables, RLS, storage policies).
3. In `api.js` set `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
4. Open `index.html` with a local live server.

## Routes
- `#/` Home
- `#/catalog` Catalog (одобрени)
- `#/details/:id` Dog details
- `#/auth` Login/Register
- `#/profile` My Dogs (guard: user/admin)
- `#/admin` Admin Dashboard (guard: admin)

## Next Steps
- Добави Albums/Photos UI, upload към bucket.
- Search с повече филтри, pagination.
- i18n (BG/EN) и theme toggle.
- Unit тестове за API слоя.
