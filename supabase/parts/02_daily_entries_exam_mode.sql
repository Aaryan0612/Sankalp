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

alter table public.daily_entries add column if not exists aptitude_completed boolean not null default false;
alter table public.daily_entries add column if not exists primary_focus_type text not null default 'dsa';
alter table public.daily_entries add column if not exists primary_focus_completed boolean not null default false;
alter table public.daily_entries add column if not exists secondary_continuity_type text not null default 'react';
alter table public.daily_entries add column if not exists secondary_continuity_completed boolean not null default false;
alter table public.daily_entries add column if not exists german_completed boolean not null default false;
alter table public.daily_entries add column if not exists daily_reality_check text default 'nothing';
alter table public.daily_entries add column if not exists recovery_tier text;
alter table public.daily_entries add column if not exists minimum_study_sprint_completed boolean not null default false;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'daily_entries_primary_focus_type_check'
  ) then
    alter table public.daily_entries
      add constraint daily_entries_primary_focus_type_check
      check (primary_focus_type in ('dsa', 'react'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'daily_entries_secondary_continuity_type_check'
  ) then
    alter table public.daily_entries
      add constraint daily_entries_secondary_continuity_type_check
      check (secondary_continuity_type in ('dsa', 'react'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'daily_entries_recovery_tier_check'
  ) then
    alter table public.daily_entries
      add constraint daily_entries_recovery_tier_check
      check (recovery_tier in ('standard', 'low_energy'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'daily_entries_daily_reality_check_check'
  ) then
    alter table public.daily_entries
      add constraint daily_entries_daily_reality_check_check
      check (daily_reality_check in ('skills', 'body', 'project', 'discipline', 'nothing'));
  end if;
end $$;
