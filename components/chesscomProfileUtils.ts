import { supabase } from './supabaseClient';

export async function fetchAndSaveChessComProfile(username: string) {
  const platform = 'chess.com';
  try {
    // Fetch profile
    const profileRes = await fetch(`https://api.chess.com/pub/player/${username}`);
    if (!profileRes.ok) throw new Error('Failed to fetch Chess.com profile');
    const profileData = await profileRes.json();

    // Fetch stats
    const statsRes = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
    if (!statsRes.ok) throw new Error('Failed to fetch Chess.com stats');
    const statsData = await statsRes.json();

    // Upsert into players table
    const { error } = await supabase.from('players').upsert([
      {
        platform,
        username: profileData.username.toLowerCase(),
        profile_data: profileData,
        stats_data: statsData,
        last_updated: new Date().toISOString(),
      }
    ], { onConflict: 'platform,username' });
    if (error) {
      console.error('Supabase upsert error:', error);
    }
    return { profile: profileData, stats: statsData };
  } catch (err) {
    console.error('Error fetching/saving Chess.com profile:', err);
    return null;
  }
} 