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

drop trigger if exists set_challenge_state_updated_at on public.challenge_state;
create trigger set_challenge_state_updated_at
before update on public.challenge_state
for each row execute procedure public.set_updated_at();

drop trigger if exists set_planned_days_updated_at on public.planned_days;
create trigger set_planned_days_updated_at
before update on public.planned_days
for each row execute procedure public.set_updated_at();
