create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  timezone text not null default 'Asia/Kolkata',
  created_at timestamptz not null default now()
);

create table if not exists public.daily_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  big_goal_text text not null default '',
  big_goal_completed boolean not null default false,
  study_build_completed boolean not null default false,
  exercise_completed boolean not null default false,
  sleep_time text,
  wake_time text,
  sleep_qualified boolean not null default false,
  silent_time_minutes integer not null default 0,
  walk_without_headphones_completed boolean not null default false,
  fantasy_detection_answer text check (fantasy_detection_answer in ('no', 'a_little', 'yes')),
  recovery_mode_used boolean not null default false,
  recovery_action_key text,
  proof_submitted boolean not null default false,
  reality_score integer not null default 0,
  minimum_viable_day_completed boolean not null default false,
  minimum_build_completed boolean not null default false,
  minimum_pushups_completed boolean not null default false,
  minimum_no_porn_completed boolean not null default false,
  minimum_sleep_before_midnight_completed boolean not null default false,
  no_zero_day_completed boolean not null default false,
  full_day_completed boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

create table if not exists public.daily_drift_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  drift_trigger text not null check (drift_trigger in ('porn', 'doom_scrolling', 'fantasy_loop', 'youtube_binge', 'music_escape', 'oversleeping')),
  severity smallint default 1,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.proof_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  proof_type text not null check (proof_type in ('screenshot', 'github_link', 'photo', 'note')),
  storage_path text,
  external_url text,
  text_content text,
  created_at timestamptz not null default now()
);

create table if not exists public.streak_state (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  full_streak integer not null default 0,
  best_full_streak integer not null default 0,
  no_zero_day_streak integer not null default 0,
  identity_save_count integer not null default 0,
  weekly_grace_available boolean not null default true,
  weekly_grace_last_reset_date date,
  last_success_date date,
  updated_at timestamptz not null default now()
);

create table if not exists public.reminder_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  morning_reminder_time text not null default '07:30',
  exercise_reminder_time text not null default '18:00',
  evening_checkin_time text not null default '21:30',
  notifications_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_daily_entries_updated_at on public.daily_entries;
create trigger set_daily_entries_updated_at
before update on public.daily_entries
for each row execute procedure public.set_updated_at();

drop trigger if exists set_streak_state_updated_at on public.streak_state;
create trigger set_streak_state_updated_at
before update on public.streak_state
for each row execute procedure public.set_updated_at();

drop trigger if exists set_reminders_updated_at on public.reminder_preferences;
create trigger set_reminders_updated_at
before update on public.reminder_preferences
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.daily_entries enable row level security;
alter table public.daily_drift_logs enable row level security;
alter table public.proof_entries enable row level security;
alter table public.streak_state enable row level security;
alter table public.reminder_preferences enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
for insert with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id);

drop policy if exists "daily_entries_own_all" on public.daily_entries;
create policy "daily_entries_own_all" on public.daily_entries
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "daily_drift_logs_own_all" on public.daily_drift_logs;
create policy "daily_drift_logs_own_all" on public.daily_drift_logs
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "proof_entries_own_all" on public.proof_entries;
create policy "proof_entries_own_all" on public.proof_entries
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "streak_state_own_all" on public.streak_state;
create policy "streak_state_own_all" on public.streak_state
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "reminder_preferences_own_all" on public.reminder_preferences;
create policy "reminder_preferences_own_all" on public.reminder_preferences
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('proof-of-day', 'proof-of-day', false)
on conflict (id) do nothing;

drop policy if exists "proof_bucket_read_own" on storage.objects;
create policy "proof_bucket_read_own" on storage.objects
for select using (bucket_id = 'proof-of-day' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "proof_bucket_insert_own" on storage.objects;
create policy "proof_bucket_insert_own" on storage.objects
for insert with check (bucket_id = 'proof-of-day' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "proof_bucket_update_own" on storage.objects;
create policy "proof_bucket_update_own" on storage.objects
for update using (bucket_id = 'proof-of-day' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "proof_bucket_delete_own" on storage.objects;
create policy "proof_bucket_delete_own" on storage.objects
for delete using (bucket_id = 'proof-of-day' and auth.uid()::text = (storage.foldername(name))[1]);
