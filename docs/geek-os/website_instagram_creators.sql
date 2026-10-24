-- Geek Influencer OS (Supabase) — run ONCE in Supabase → SQL Editor.
-- Public, read-only list of Instagram-connected CREATORS for the agency
-- website's homepage mosaic. Returns only handle, profile picture and follower
-- count. Excludes non-creator accounts (brands/agencies) and blocklisted creators.

create or replace function public.website_instagram_creators(p_limit int default 48)
returns table (username text, profile_picture_url text, followers_count int)
language sql stable security definer set search_path = '' as $$
  select s.username, s.profile_picture_url, s.followers_count
    from public.social_accounts s
   where s.platform = 'instagram'
     and coalesce(s.username, '') <> ''
     and coalesce(s.profile_picture_url, '') <> ''
     -- creators only (member is the creator themself)
     and exists (select 1 from intel.ci_identity_actor_access a
                  where a.member_id = s.member_id and a.access_role = 'self' and a.revoked_at is null)
     -- never show blocklisted creators
     and not exists (select 1 from intel.ci_identity_actor_access a
                       join intel.ci_creator_blacklist b on b.identity_id = a.identity_id and b.lifted_at is null
                      where a.member_id = s.member_id and a.access_role = 'self' and a.revoked_at is null)
     and not exists (select 1 from intel.ci_creator_blacklist b
                      where lower(b.handle) = lower(s.username) and b.lifted_at is null)
   order by s.connected_at desc nulls last, s.updated_at desc nulls last   -- latest creators first
   limit least(greatest(coalesce(p_limit, 48), 1), 100)
$$;

revoke all on function public.website_instagram_creators(int) from public;
grant execute on function public.website_instagram_creators(int) to anon, authenticated;

-- Check: should be close to the "Instagram connected" count in Super Admin → Creators
-- select count(*) from public.website_instagram_creators(100);
