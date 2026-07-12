create extension if not exists pgcrypto;

insert into public.profiles (id, auth_user_id, full_name, email, avatar_color)
values
  ('11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111', 'Giulia', 'giulia@example.com', '#f59e0b'),
  ('22222222-2222-4222-8222-222222222222', '22222222-2222-4222-8222-222222222222', 'Karim', 'karim@example.com', '#3b82f6'),
  ('33333333-3333-4333-8333-333333333333', '33333333-3333-4333-8333-333333333333', 'Aïsha', 'aisha@example.com', '#10b981'),
  ('44444444-4444-4444-8444-444444444444', '44444444-4444-4444-8444-444444444444', 'Léo', 'leo@example.com', '#ef4444')
on conflict (id) do update
set auth_user_id = excluded.auth_user_id,
    full_name = excluded.full_name,
    email = excluded.email,
    avatar_color = excluded.avatar_color;

insert into public.meals (id, host_id, title, neighborhood, seats_total, seats_left, price_per_person, created_at)
values
  ('m1', '11111111-1111-4111-8111-111111111111', 'Lasagnes maison de Nonna', 'Croix-Rousse', 6, 2, 12, now()),
  ('m2', '22222222-2222-4222-8222-222222222222', 'Tajine agneau & couscous', 'Guillotière', 8, 4, 15, now()),
  ('m3', '33333333-3333-4333-8333-333333333333', 'Curry de légumes du marché', 'Confluence', 5, 3, 10, now()),
  ('m4', '44444444-4444-4444-8444-444444444444', 'Atelier sushis à partager', 'Part-Dieu', 4, 1, 18, now())
on conflict (id) do update
set host_id = excluded.host_id,
    title = excluded.title,
    neighborhood = excluded.neighborhood,
    seats_total = excluded.seats_total,
    seats_left = excluded.seats_left,
    price_per_person = excluded.price_per_person;

insert into public.messages (id, thread_id, author_name, body, created_at)
values
  ('55555555-5555-4555-8555-555555555555', 'thread-m1', 'Giulia', 'Bienvenue à table, on commence à 19h30.', now()),
  ('66666666-6666-4666-8666-666666666666', 'thread-m1', 'Léo', 'Merci, je viens avec un ami.', now())
on conflict (id) do update
set thread_id = excluded.thread_id,
    author_name = excluded.author_name,
    body = excluded.body;

insert into public.reservations (id, user_id, meal_id, seats, payment_status, created_at)
values
  ('77777777-7777-4777-8777-777777777777', '11111111-1111-4111-8111-111111111111', 'm1', 1, 'simulated', now()),
  ('88888888-8888-4888-8888-888888888888', '22222222-2222-4222-8222-222222222222', 'm2', 2, 'simulated', now())
on conflict (id) do update
set user_id = excluded.user_id,
    meal_id = excluded.meal_id,
    seats = excluded.seats,
    payment_status = excluded.payment_status;
