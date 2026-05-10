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
