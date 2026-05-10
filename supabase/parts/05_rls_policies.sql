alter table public.profiles enable row level security;
alter table public.daily_entries enable row level security;
alter table public.daily_drift_logs enable row level security;
alter table public.proof_entries enable row level security;
alter table public.streak_state enable row level security;
alter table public.challenge_state enable row level security;
alter table public.planned_days enable row level security;
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

drop policy if exists "challenge_state_own_all" on public.challenge_state;
create policy "challenge_state_own_all" on public.challenge_state
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "planned_days_own_all" on public.planned_days;
create policy "planned_days_own_all" on public.planned_days
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "reminder_preferences_own_all" on public.reminder_preferences;
create policy "reminder_preferences_own_all" on public.reminder_preferences
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
