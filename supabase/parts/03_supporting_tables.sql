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
  weekly_grace_available boolean not null default false,
  weekly_grace_last_reset_date date,
  last_success_date date,
  updated_at timestamptz not null default now()
);

create table if not exists public.challenge_state (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  challenge_start_date date not null default '2026-05-11',
  challenge_day_number integer not null default 1,
  strict_days_completed integer not null default 0,
  saved_days integer not null default 0,
  missed_days integer not null default 0,
  status text not null default 'active' check (status in ('active', 'completed', 'reset')),
  updated_at timestamptz not null default now()
);

create table if not exists public.planned_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  planned_big_goal_text text not null default '',
  planning_note text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

create table if not exists public.reminder_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  morning_reminder_time text not null default '07:30',
  exercise_reminder_time text not null default '18:00',
  evening_checkin_time text not null default '21:30',
  notifications_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);
