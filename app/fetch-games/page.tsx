"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from '@/components/supabaseClient';
import { fetchAndSaveChessComProfile } from '@/components/chesscomProfileUtils';

const AccuracyTooltip = ({ percentage, breakdown }: { percentage: string; breakdown?: any }) => {
  const displayBreakdown = breakdown || {
    brilliant: 0,
    great: 0,
    best: 0,
    inaccuracy: 0,
    mistake: 0,
    blunder: 0
  };

  return (
    <div className="relative group inline-block">
      <span className="text-blue-400 cursor-help">{percentage}</span>
      <div className="absolute hidden group-hover:block z-50 w-48 p-3 bg-gray-800 rounded-md shadow-xl border border-gray-600 text-xs left-1/2 transform -translate-x-1/2">
        <div className="space-y-1">
          <div className="flex justify-between text-blue-300"><span>‼️ Brilliant</span><span>{displayBreakdown.brilliant}</span></div>
          <div className="flex justify-between text-blue-300"><span>! Great</span><span>{displayBreakdown.great}</span></div>
          <div className="flex justify-between text-green-400"><span>⭐ Best</span><span>{displayBreakdown.best}</span></div>
          <div className="border-t border-gray-600 my-1"></div>
          <div className="flex justify-between text-yellow-400"><span>⁉️ Inaccuracy</span><span>{displayBreakdown.inaccuracy}</span></div>
          <div className="flex justify-between text-orange-400"><span>❓ Mistake</span><span>{displayBreakdown.mistake}</span></div>
          <div className="flex justify-between text-red-400"><span>❓❓ Blunder</span><span>{displayBreakdown.blunder}</span></div>
        </div>
      </div>
    </div>
  );
};

const FetchGamesPage: React.FC = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const platform = searchParams.get("platform");

  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [games, setGames] = useState<any[]>([]);
  const [filteredGames, setFilteredGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    timeControl: "All games",
    color: "Both colors",
    result: "All results",
    endedBy: "All endings",
    dateRange: "All dates",
    opening: "All openings",
    customStart: "",
    customEnd: "",
    customLabel: "",
  });

  const [availableTimeControls, setAvailableTimeControls] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableResults, setAvailableResults] = useState<string[]>([]);
  const [availableEndings, setAvailableEndings] = useState<string[]>([]);
  const [availableOpenings, setAvailableOpenings] = useState<string[]>([]);

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (username && platform === 'chess.com') {
        const data = await fetchAndSaveChessComProfile(username);
        if (data) {
          setProfile(data.profile);
          setStats(data.stats);
        }
      }
    };
    fetchProfile();
  }, [username, platform]);

  useEffect(() => {
    const fetchAllGames = async () => {
      if (!username || !platform) return;

      setLoading(true);
      setError(null);
      let allGames: any[] = [];

      try {
        if (platform === "chess.com") {
          try {
            const archivesRes = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`);
            if (!archivesRes.ok) {
              throw new Error(`Failed to fetch archives: ${archivesRes.status}`);
            }
            const archivesData = await archivesRes.json();
            
            if (!archivesData.archives || !Array.isArray(archivesData.archives)) {
              throw new Error("No game archives found for this user");
            }

            const archiveUrls = archivesData.archives;

            for (const url of archiveUrls) {
              try {
                const gamesRes = await fetch(url);
                if (!gamesRes.ok) {
                  console.error(`Failed to fetch games from ${url}: ${gamesRes.status}`);
                  continue;
                }
                const gamesData = await gamesRes.json();

                if (!gamesData.games || !Array.isArray(gamesData.games)) {
                  console.error(`No games found in archive ${url}`);
                  continue;
                }

                const formatted = await Promise.all(gamesData.games.map(async (g: any, idx: number) => {
                  const isWhite = g.white.username.toLowerCase() === username.toLowerCase();
                  const opponent = isWhite ? g.black.username : g.white.username;
                  const yourRating = isWhite ? g.white.rating : g.black.rating;
                  const opponentRating = isWhite ? g.black.rating : g.white.rating;
                  const playerResultRaw = isWhite ? g.white.result : g.black.result;
                  const opponentResultRaw = isWhite ? g.black.result : g.white.result;

                  let result = "Lost";
                  if (playerResultRaw === "win") result = "Win";
                  else if (["agreed", "stalemate", "repetition", "insufficient", "timevsinsufficient"].includes(playerResultRaw)) result = "Draw";

                  let endedBy = "Other";
                  if (result === "Win") {
                    if (opponentResultRaw === "checkmated") endedBy = "Checkmate";
                    else if (opponentResultRaw === "timeout") endedBy = "Timeout";
                    else if (opponentResultRaw === "resigned") endedBy = "Resignation";
                  } else if (result === "Lost") {
                    if (playerResultRaw === "checkmated") endedBy = "Checkmate";
                    else if (playerResultRaw === "timeout") endedBy = "Timeout";
                    else if (playerResultRaw === "resigned") endedBy = "Resignation";
                  } else if (result === "Draw") {
                    if (playerResultRaw === "agreed") endedBy = "Draw - Agreed";
                    else if (playerResultRaw === "stalemate") endedBy = "Draw - Stalemate";
                    else if (playerResultRaw === "repetition") endedBy = "Draw - Repetition";
                    else if (playerResultRaw === "insufficient") endedBy = "Draw - Insufficient Material";
                    else if (playerResultRaw === "timevsinsufficient") endedBy = "Draw - Time vs Insufficient";
                  }

                  let timeControlName = "";
                  let timeControlDetail = "";
                  if (g.time_control.includes("/")) {
                    const seconds = parseInt(g.time_control.split("/")[1]);
                    const days = Math.floor(seconds / 86400);
                    timeControlName = "Daily";
                    timeControlDetail = `${days} day${days > 1 ? "s" : ""}`;
                  } else {
                    const base = parseInt(g.time_control.split("+")[0]);
                    const increment = g.time_control.includes("+") ? parseInt(g.time_control.split("+")[1]) : 0;
                    const classifyTimeControl = (b: number) => {
                      if (b < 60) return "Ultra Bullet";
                      if (b < 180) return "Bullet";
                      if (b < 600) return "Blitz";
                      if (b < 3600) return "Rapid";
                      return "Classic";
                    };
                    timeControlName = classifyTimeControl(base);
                    const baseTime = base < 60 ? `${base}s` : `${Math.floor(base / 60)} min`;
                    timeControlDetail = baseTime + (increment ? `|${increment}` : "");
                  }

                  const variant = g.rules === "chess960" ? "Chess960" : "Standard";

                  const gameObj = {
                    id: g.url,
                    opponent,
                    opponentRating: opponentRating ?? "N/A",
                    yourRating: yourRating ?? "N/A",
                    result,
                    endedBy,
                    timeControl: timeControlName,
                    timeDetail: timeControlDetail,
                    accuracy: Math.floor(70 + Math.random() * 30) + "%",
                    accuracyBreakdown: {
                      brilliant: Math.floor(Math.random() * 3),
                      great: Math.floor(Math.random() * 5),
                      best: 10 + Math.floor(Math.random() * 10),
                      inaccuracy: Math.floor(Math.random() * 3),
                      mistake: Math.floor(Math.random() * 2),
                      blunder: Math.floor(Math.random() * 1)
                    },
                    tags: [],
                    date: g.end_time ? new Date(g.end_time * 1000).toISOString().split("T")[0] : "N/A",
                    color: isWhite ? "White" : "Black",
                    opponentColor: isWhite ? "Black" : "White",
                    variant,
                    url: g.url,
                    pgn: g.pgn,
                    fen: g.fen,
                    time_control: g.time_control,
                    time_class: g.time_class,
                    eco: g.eco,
                    eco_url: g.eco_url,
                    tournament: g.tournament,
                    match: g.match,
                    accuracies: g.accuracies,
                    white_username: g.white?.username,
                    white_rating: g.white?.rating,
                    white_result: g.white?.result,
                    white_uuid: g.white?.uuid,
                    black_username: g.black?.username,
                    black_rating: g.black?.rating,
                    black_result: g.black?.result,
                    black_uuid: g.black?.uuid,
                    end_time: g.end_time,
                    rated: g.rated,
                    raw_api_data: g
                  };
                  // Before inserting, check for duplicate
                  const { data: existingGame } = await supabase
                    .from('games')
                    .select('id')
                    .eq('game_id', g.url)
                    .eq('username', username)
                    .eq('platform', platform)
                    .maybeSingle();
                  if (!existingGame) {
                    const { error } = await supabase.from('games').insert([
                      {
                        platform,
                        game_id: g.url,
                        username,
                        opponent: opponent,
                        color: isWhite ? "White" : "Black",
                        your_rating: yourRating,
                        opponent_rating: opponentRating,
                        result,
                        ended_by: endedBy,
                        time_control: g.time_control,
                        time_class: g.time_class,
                        variant,
                        date: g.end_time ? new Date(g.end_time * 1000).toISOString().split("T")[0] : "N/A",
                        pgn: g.pgn,
                        fen: g.fen,
                        eco: g.eco,
                        eco_url: g.eco_url,
                        tournament: g.tournament,
                        match: g.match,
                        accuracies: g.accuracies,
                        analysis: null,
                        raw_api_data: g,
                        white_username: g.white?.username,
                        white_rating: g.white?.rating,
                        white_result: g.white?.result,
                        white_uuid: g.white?.uuid,
                        black_username: g.black?.username,
                        black_rating: g.black?.rating,
                        black_result: g.black?.result,
                        black_uuid: g.black?.uuid,
                        end_time: g.end_time,
                        rated: g.rated
                      }
                    ]);
                    if (error) {
                      if (error.code === '23505') { // Unique violation
                        console.log('Duplicate game not inserted (unique constraint).');
                      } else {
                        console.error('Supabase insert error:', error);
                      }
                    } else {
                      console.log('Game inserted into Supabase!');
                    }
                  } else {
                    console.log('Duplicate game skipped:', g.url);
                  }
                  return gameObj;
                }));

                allGames = [...allGames, ...formatted];
              } catch (error) {
                console.error(`Error processing archive ${url}:`, error);
              }
            }
          } catch (error) {
            console.error("Error fetching Chess.com archives:", error);
            setError("Failed to load games from Chess.com. Please check the username and try again.");
          }
        } else if (platform === "lichess") {
          try {
            const res = await fetch(`https://lichess.org/api/games/user/${username}?max=1000&moves=false&tags=true`, {
              headers: { Accept: "application/x-ndjson" },
            });
            
            if (!res.ok) {
              throw new Error(`Failed to fetch games: ${res.status}`);
            }
            
            const text = await res.text();
            const lines = text.split("\n").filter(Boolean);

            await Promise.all(lines.map(async (line, idx) => {
              try {
                const g = JSON.parse(line);

                const isWhite = g.players.white.user?.name.toLowerCase() === username.toLowerCase();
                const opponent = isWhite 
                  ? (g.players.black.user?.name || "Anonymous") 
                  : (g.players.white.user?.name || "Anonymous");
                const yourRating = isWhite ? g.players.white.rating : g.players.black.rating;
                const opponentRating = isWhite ? g.players.black.rating : g.players.white.rating;

                let result = "Lost";
                if (g.winner === (isWhite ? "white" : "black")) result = "Win";
                else if (!g.winner) result = "Draw";

                let endedBy = "Other";
                if (g.status === "mate") endedBy = "Checkmate";
                else if (g.status === "resign") endedBy = "Resignation";
                else if (g.status === "timeout") endedBy = "Timeout";
                else if (g.status === "draw") endedBy = "Draw - Agreed";

                let timeControlName = "";
                if (g.speed === "ultraBullet") timeControlName = "Ultra Bullet";
                else if (g.speed === "bullet") timeControlName = "Bullet";
                else if (g.speed === "blitz") timeControlName = "Blitz";
                else if (g.speed === "rapid") timeControlName = "Rapid";
                else if (g.speed === "classical") timeControlName = "Classic";
                else if (g.speed === "correspondence") timeControlName = "Daily";
                else timeControlName = "Other";

                const timeDetail = g.clock ? `${g.clock.initial / 60} min|${g.clock.increment}` : "";

                const variant = g.variant === "chess960" ? "Chess960" : "Standard";

                const gameObj = {
                  id: `${g.id}-${idx}`,
                  opponent,
                  opponentRating: opponentRating ?? "N/A",
                  yourRating: yourRating ?? "N/A",
                  result,
                  endedBy,
                  timeControl: timeControlName,
                  timeDetail,
                  accuracy: Math.floor(70 + Math.random() * 30) + "%",
                  accuracyBreakdown: {
                    brilliant: Math.floor(Math.random() * 3),
                    great: Math.floor(Math.random() * 5),
                    best: 10 + Math.floor(Math.random() * 10),
                    inaccuracy: Math.floor(Math.random() * 3),
                    mistake: Math.floor(Math.random() * 2),
                    blunder: Math.floor(Math.random() * 1)
                  },
                  tags: [],
                  date: g.createdAt ? new Date(g.createdAt).toISOString().split("T")[0] : "N/A",
                  color: isWhite ? "White" : "Black",
                  opponentColor: isWhite ? "Black" : "White",
                  variant,
                };
                // Before inserting, check for duplicate
                const { data: existingGame } = await supabase
                  .from('lichess_games')
                  .select('game_id')
                  .eq('game_id', gameObj.id)
                  .eq('username', username)
                  .eq('platform', platform)
                  .maybeSingle();
                if (!existingGame) {
                  const { error } = await supabase.from('lichess_games').insert([
                    {
                      username,
                      platform,
                      game_id: gameObj.id,
                      game_data: gameObj
                    }
                  ]);
                  if (error) {
                    if (error.code === '23505') { // Unique violation
                      console.log('Duplicate game not inserted (unique constraint).');
                    } else {
                      console.error('Supabase insert error:', error);
                    }
                  } else {
                    console.log('Game inserted into Supabase!');
                  }
                } else {
                  console.log('Duplicate game skipped:', gameObj.id);
                }
                allGames.push(gameObj);
              } catch (parseError) {
                console.error("Error parsing game:", parseError);
              }
            }));
          } catch (error) {
            console.error("Error fetching Lichess games:", error);
            setError("Failed to load games from Lichess. Please check the username and try again.");
          }
        }

        if (allGames.length > 0) {
          const desiredOrder = ["Ultra Bullet", "Bullet", "Blitz", "Rapid", "Classic", "Daily"];
          let timeControlsArray = Array.from(new Set(allGames.map((g) => g.timeControl)));
          timeControlsArray.sort((a, b) => desiredOrder.indexOf(a) - desiredOrder.indexOf(b));

          setAvailableTimeControls(["All games", ...timeControlsArray]);
          setAvailableColors(["Both colors", ...Array.from(new Set(allGames.map((g) => g.color)))]);
          setAvailableResults(["All results", ...Array.from(new Set(allGames.map((g) => g.result)))]);
          setAvailableEndings(["All endings", ...Array.from(new Set(allGames.map((g) => g.endedBy)))]);
          allGames.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          // Extract unique, short opening names for the filter
          const openingNames = Array.from(new Set(allGames.map((g) => getShortOpeningName(g.eco_url || g.opening_name || g.eco || g.opening))));
          setAvailableOpenings(['All openings', ...openingNames]);
        }

        setGames(allGames);
        setFilteredGames(allGames);
      } catch (error) {
        console.error("Error in fetchAllGames:", error);
        setError("An unexpected error occurred while loading games.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllGames();
  }, [username, platform]);

  const applyFilters = () => {
    let newGames = [...games];
    
    if (filters.timeControl !== "All games") {
      newGames = newGames.filter((g) => g.timeControl === filters.timeControl);
    }
    
    if (filters.result !== "All results") {
      newGames = newGames.filter((g) => g.result === filters.result);
    }
    
    if (filters.endedBy !== "All endings") {
      newGames = newGames.filter((g) => g.endedBy === filters.endedBy);
    }
    
    if (filters.color !== "Both colors") {
      newGames = newGames.filter((g) => g.color === filters.color);
    }
    
    if (filters.dateRange !== "All dates") {
      const now = new Date();
      let startDate = new Date();
      
      switch(filters.dateRange) {
        case "Last 24 hours":
          startDate.setDate(now.getDate() - 1);
          break;
        case "Last 3 days":
          startDate.setDate(now.getDate() - 3);
          break;
        case "Last 7 days":
          startDate.setDate(now.getDate() - 7);
          break;
        case "Last 30 days":
          startDate.setDate(now.getDate() - 30);
          break;
        case "Last 3 months":
          startDate.setMonth(now.getMonth() - 3);
          break;
        case "Last 6 months":
          startDate.setMonth(now.getMonth() - 6);
          break;
        case "Last 365 days":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          if (filters.dateRange.startsWith("Custom:")) {
            startDate = new Date(filters.customStart);
            const endDate = new Date(filters.customEnd);
            newGames = newGames.filter((g) => {
              const gameDate = new Date(g.date);
              return gameDate >= startDate && gameDate <= endDate;
            });
            break;
          }
          break;
      }
      
      if (!filters.dateRange.startsWith("Custom:")) {
        newGames = newGames.filter((g) => {
          const gameDate = new Date(g.date);
          return gameDate >= startDate && gameDate <= now;
        });
      }
    }

    if (filters.opening !== "All openings") {
      newGames = newGames.filter((g) => getShortOpeningName(g.eco_url || g.opening_name || g.eco || g.opening) === filters.opening);
    }

    setFilteredGames(newGames);
    setShowPopup(false);
  };

  const resetFilters = () => {
    setFilters({
      timeControl: "All games",
      color: "Both colors",
      result: "All results",
      endedBy: "All endings",
      dateRange: "All dates",
      opening: "All openings",
      customStart: "",
      customEnd: "",
      customLabel: "",
    });
    setFilteredGames(games);
  };

  const handleDateRangeChange = (value: string) => {
    if (value === "Custom range") {
      setShowPopup(true);
      setFilters({ ...filters, dateRange: value });
    } else {
      setShowPopup(false);
      setFilters({ ...filters, dateRange: value, customStart: "", customEnd: "", customLabel: "" });
      applyFilters();
    }
  };

  const confirmCustomRange = () => {
    if (filters.customStart && filters.customEnd) {
      const label = `Custom: ${filters.customStart} to ${filters.customEnd}`;
      setFilters({ ...filters, dateRange: label, customLabel: label });
      setShowPopup(false);
      applyFilters();
    }
  };

  // --- Statistics block ---
  const winCount = filteredGames.filter((g) => g.result === "Win").length;
  const lostCount = filteredGames.filter((g) => g.result === "Lost").length;
  const drawCount = filteredGames.filter((g) => g.result === "Draw").length;
  const total = filteredGames.length || 1;
  const winPct = ((winCount / total) * 100).toFixed(1);
  const lostPct = ((lostCount / total) * 100).toFixed(1);
  const drawPct = ((drawCount / total) * 100).toFixed(1);

  // Helper to get country flag emoji from country code
  function getFlag(countryUrl: string | undefined) {
    if (!countryUrl) return '';
    const code = countryUrl.split('/').pop()?.toUpperCase() || '';
    if (code.length !== 2) return '';
    // Convert country code to flag emoji
    return String.fromCodePoint(...[...code].map(c => 127397 + c.charCodeAt()));
  }

  // Helper to count moves from PGN
  function getMoveCount(pgn: string | undefined) {
    if (!pgn) return 0;
    // Count occurrences of move numbers (e.g., '1.', '2.', ...)
    return (pgn.match(/\d+\./g) || []).length;
  }

  // Helper to extract only the boxed part from the opening URL or eco string
  function getShortOpeningName(openingUrlOrEco: string | undefined) {
    if (!openingUrlOrEco) return 'Unknown Opening';
    let str = openingUrlOrEco;
    if (str.includes('/')) {
      str = str.split('/').pop() || str;
    }
    // Remove everything after the first dot, number, or space
    str = str.replace(/[.\d\s].*$/, '');
    // Replace dashes/underscores with spaces, trim
    str = str.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
    // Capitalize first letter
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  // Tag icon and color mapping
  const TAGS = [
    { key: 'Book Opening', icon: '📘', color: '#2563eb' },
    { key: 'Advantage Slipped', icon: '😅', color: '#f59e42' },
    { key: 'Solid Endgame', icon: '🏁', color: '#64748b' },
    { key: 'Initiative', icon: '🎯', color: '#22d3ee' },
    { key: 'Awesome Comeback', icon: '💪', color: '#16a34a' },
  ];
  const tagMap = Object.fromEntries(TAGS.map(t => [t.key, t]));

  return (
    <section style={{ backgroundColor: "#171717", color: "#e5e5e5", padding: "40px 0", maxWidth: "1600px", margin: "0 auto" }}>
      {/* Profile Header Section */}
      {profile && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#23232b',
          borderRadius: 12,
          padding: 24,
          marginBottom: 32,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <img
              src={profile.avatar || 'https://ui-avatars.com/api/?name=' + profile.username}
              alt="avatar"
              style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid #333', objectFit: 'cover' }}
              onError={e => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + profile.username; }}
            />
            <div>
              <div style={{ fontSize: 28, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
                {profile.username}
                {profile.country && <span style={{ fontSize: 24 }}>{getFlag(profile.country)}</span>}
              </div>
              <div style={{ color: '#60a5fa', fontSize: 17, fontWeight: 600, marginTop: 2 }}>
                Platform: {platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : ''}
              </div>
              {profile.status && <div style={{ color: '#fbbf24', fontSize: 16 }}>{profile.status}</div>}
              {profile.name && <div style={{ color: '#aaa', fontSize: 18 }}>{profile.name}</div>}
              <div style={{ color: '#ccc', fontSize: 14, marginTop: 4 }}>
                Joined: {profile.joined ? new Date(profile.joined * 1000).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
          {/* Statistics in profile header */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'center', marginLeft: 32 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 15, color: '#aaa' }}>Total Games Played</div>
              <div style={{ fontWeight: 700, fontSize: 22 }}>{filteredGames.length}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 15, color: '#aaa' }}>Win %</div>
              <div style={{ fontWeight: 700, fontSize: 22, color: '#16a34a' }}>{winPct}%</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 15, color: '#aaa' }}>Loss %</div>
              <div style={{ fontWeight: 700, fontSize: 22, color: '#dc2626' }}>{lostPct}%</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 15, color: '#aaa' }}>Draw %</div>
              <div style={{ fontWeight: 700, fontSize: 22, color: '#fbbf24' }}>{drawPct}%</div>
            </div>
          </div>
          {stats && (
            <div style={{ display: 'flex', gap: 16, marginLeft: 32 }}>
              {['chess_daily', 'chess_blitz', 'chess_rapid', 'chess_bullet'].map(mode => (
                stats[mode] && stats[mode].last && (
                  <div key={mode} style={{ background: '#18181b', borderRadius: 8, padding: 12, minWidth: 80, textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#aaa' }}>{mode.replace('chess_', '').toUpperCase()}</div>
                    <div style={{ fontSize: 22, fontWeight: 'bold' }}>{stats[mode].last.rating}</div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      )}
      {/* Filters Block Sleek */}
      <div style={{ background: '#23232b', borderRadius: 14, padding: 18, margin: '0 auto 32px auto', maxWidth: 1500, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', flexWrap: 'wrap', gap: '18px 24px', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
        <div style={{ display: "flex", flexDirection: "column", minWidth: 160 }}>
          <label style={{ fontSize: "0.85rem", marginBottom: "2px", color: '#bbb' }}>Time Control</label>
          <select 
            style={{ padding: "7px 10px", color: "#23232b", backgroundColor: "#fff", borderRadius: 7, border: '1px solid #bbb', fontSize: 15 }} 
            value={filters.timeControl} 
            onChange={(e) => setFilters({ ...filters, timeControl: e.target.value })}
          >
            {availableTimeControls.map((tc) => <option key={tc}>{tc}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", minWidth: 160 }}>
          <label style={{ fontSize: "0.85rem", marginBottom: "2px", color: '#bbb' }}>Color</label>
          <select 
            style={{ padding: "7px 10px", color: "#23232b", backgroundColor: "#fff", borderRadius: 7, border: '1px solid #bbb', fontSize: 15 }} 
            value={filters.color} 
            onChange={(e) => setFilters({ ...filters, color: e.target.value })}
          >
            {availableColors.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", minWidth: 160 }}>
          <label style={{ fontSize: "0.85rem", marginBottom: "2px", color: '#bbb' }}>Result</label>
          <select 
            style={{ padding: "7px 10px", color: "#23232b", backgroundColor: "#fff", borderRadius: 7, border: '1px solid #bbb', fontSize: 15 }} 
            value={filters.result} 
            onChange={(e) => setFilters({ ...filters, result: e.target.value })}
          >
            {availableResults.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", minWidth: 160 }}>
          <label style={{ fontSize: "0.85rem", marginBottom: "2px", color: '#bbb' }}>Ended By</label>
          <select 
            style={{ padding: "7px 10px", color: "#23232b", backgroundColor: "#fff", borderRadius: 7, border: '1px solid #bbb', fontSize: 15 }} 
            value={filters.endedBy} 
            onChange={(e) => setFilters({ ...filters, endedBy: e.target.value })}
          >
            {availableEndings.map((eopt) => <option key={eopt}>{eopt}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", minWidth: 220, flex: 1 }}>
          <label style={{ fontSize: "0.85rem", marginBottom: "2px", color: '#bbb' }}>Opening</label>
          <select
            style={{ padding: "7px 10px", color: "#23232b", backgroundColor: "#fff", borderRadius: 7, border: '1px solid #bbb', fontSize: 15 }}
            value={filters.opening}
            onChange={(e) => setFilters({ ...filters, opening: e.target.value })}
          >
            {availableOpenings.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", minWidth: 180 }}>
          <label style={{ fontSize: "0.85rem", marginBottom: "2px", color: '#bbb' }}>Date Range</label>
          <select 
            style={{ padding: "7px 10px", color: "#23232b", backgroundColor: "#fff", borderRadius: 7, border: '1px solid #bbb', fontSize: 15 }} 
            value={filters.dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
          >
            <option>All dates</option>
            <option>Last 24 hours</option>
            <option>Last 3 days</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 6 months</option>
            <option>Last 365 days</option>
            <option>Custom range</option>
            {filters.customLabel && <option>{filters.customLabel}</option>}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 18 }}>
          <button 
            onClick={applyFilters} 
            style={{ padding: "8px 18px", fontWeight: "bold", backgroundColor: "#5b21b6", color: "white", border: "none", borderRadius: "7px", cursor: "pointer", fontSize: 15 }}
          >
            Apply
          </button>
          <button 
            onClick={resetFilters} 
            style={{ padding: "8px 18px", fontWeight: "bold", backgroundColor: "#374151", color: "white", border: "none", borderRadius: "7px", cursor: "pointer", fontSize: 15 }}
          >
            Reset Filters
          </button>
        </div>
      </div>
      {/* Table Block */}
      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <table style={{ minWidth: 1200, width: "100%", borderCollapse: "separate", borderSpacing: 0, background: "#23232b", borderRadius: 16, overflow: "hidden" }}>
          <thead>
            <tr style={{ background: '#26272b', borderBottom: "2px solid #333" }}>
              <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 16, fontWeight: 700, color: '#e5e5e5' }}>Game</th>
              <th style={{ padding: "14px 8px", fontSize: 16, fontWeight: 700, color: '#e5e5e5' }}>Result</th>
              <th style={{ padding: "14px 8px", fontSize: 16, fontWeight: 700, color: '#e5e5e5' }}>Time Control</th>
              <th style={{ padding: "14px 8px", fontSize: 16, fontWeight: 700, color: '#e5e5e5' }}>Moves</th>
              <th style={{ padding: "14px 8px", fontSize: 16, fontWeight: 700, color: '#e5e5e5' }}>Accuracy</th>
              <th style={{ padding: "14px 8px", fontSize: 16, fontWeight: 700, color: '#e5e5e5' }}>Played</th>
              <th style={{ padding: "14px 8px", fontSize: 16, fontWeight: 700, color: '#e5e5e5' }}>Tags</th>
              <th style={{ padding: "14px 8px", fontSize: 16, fontWeight: 700, color: '#e5e5e5' }}>Analyse Game</th>
            </tr>
          </thead>
          <tbody>
            {filteredGames.map((game, idx) => (
              <React.Fragment key={game.id}>
                <tr style={{ background: "#23232b" }}>
                  {/* Game column */}
                  <td style={{ padding: "14px 16px", textAlign: "left", minWidth: 220, fontWeight: 600, fontSize: 16 }}>
                    <span style={{
                      display: 'inline-block',
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      background: game.color === 'White' ? '#fff' : '#23232b',
                      border: '1.5px solid #444',
                      marginRight: 8,
                      verticalAlign: 'middle',
                      boxShadow: game.color === 'White' ? '0 0 0 1px #bbb' : '0 0 0 1px #222'
                    }}></span>
                    {`${username} (${game.yourRating}) vs ${game.opponent} (${game.opponentRating})`}
                    <div style={{ color: '#aaa', fontSize: 13, marginTop: 2 }}>
                      {getShortOpeningName(game.eco_url || game.opening_name || game.eco || game.opening)}
                    </div>
                  </td>
                  {/* Result column */}
                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                    <div style={{
                      display: 'inline-block',
                      backgroundColor: game.result === "Win" ? "#16a34a" : game.result === "Lost" ? "#dc2626" : "#e5e5e5",
                      color: game.result === "Draw" ? "#000" : "#fff",
                      padding: "6px 18px",
                      borderRadius: 16,
                      fontWeight: 700,
                      fontSize: 16,
                      marginBottom: 2
                    }}>
                      {game.result === "Win" ? "Win" : game.result === "Lost" ? "Loss" : "Draw"}
                    </div>
                    <div style={{ color: '#aaa', fontSize: 13, marginTop: 2 }}>
                      {game.endedBy}
                    </div>
                  </td>
                  {/* Time Control column */}
                  <td style={{ textAlign: "center", fontSize: 16 }}>
                    <div style={{ fontWeight: 600 }}>{game.timeControl || game.time_control}</div>
                    <div style={{ color: '#aaa', fontSize: 14 }}>{game.timeDetail}</div>
                  </td>
                  {/* Moves column */}
                  <td style={{ textAlign: "center", fontWeight: 600, fontSize: 16 }}>
                    {getMoveCount(game.pgn)}
                  </td>
                  {/* Accuracy column */}
                  <td style={{ textAlign: "center" }}>
                    <div
                      style={{
                        color: '#3b82f6',
                        fontWeight: 700,
                        fontSize: 16,
                        cursor: 'pointer',
                        display: 'inline-block',
                        position: 'relative'
                      }}
                      title="Click for breakdown"
                      onMouseEnter={e => {
                        // Show dummy tooltip (replace with real logic later)
                        const tooltip = document.createElement('div');
                        tooltip.innerHTML = `<div style='background:#23232b;color:#fff;padding:10px;border-radius:8px;box-shadow:0 2px 8px #000;position:absolute;z-index:1000;top:30px;left:0;min-width:120px;font-size:13px;'>
                          <div><span style='color:#60a5fa;'>Brilliant:</span> 1</div>
                          <div><span style='color:#60a5fa;'>Great:</span> 2</div>
                          <div><span style='color:#22d3ee;'>Best:</span> 8</div>
                          <div><span style='color:#facc15;'>Inaccuracy:</span> 1</div>
                          <div><span style='color:#fb923c;'>Mistake:</span> 0</div>
                          <div><span style='color:#ef4444;'>Blunder:</span> 0</div>
                        </div>`;
                        tooltip.id = 'acc-tooltip';
                        e.currentTarget.appendChild(tooltip);
                      }}
                      onMouseLeave={e => {
                        const tooltip = document.getElementById('acc-tooltip');
                        if (tooltip) tooltip.remove();
                      }}
                    >
                      {game.accuracy || '—'}
                    </div>
                  </td>
                  {/* Played column */}
                  <td style={{ textAlign: "center", color: '#aaa', fontSize: 16 }}>
                    {(() => {
                      const date = new Date(game.date);
                      const now = new Date();
                      const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
                      return diff === 0 ? "Today" : `${diff} day${diff > 1 ? "s" : ""} ago`;
                    })()}
                  </td>
                  {/* Tags column */}
                  <td style={{ textAlign: "center" }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
                      {/* Limit to top 3 tags, smaller size */}
                      {TAGS.slice(0, 3).map((tag, i) => (
                        <span
                          key={tag.key + i}
                          style={{
                            fontSize: 12,
                            padding: '2px 8px',
                            borderRadius: 10,
                            background: tag.color,
                            color: '#fff',
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontWeight: 600,
                            gap: 4
                          }}
                        >
                          <span style={{ fontSize: 15 }}>{tag.icon}</span> {tag.key}
                        </span>
                      ))}
                    </div>
                  </td>
                  {/* Analyse Game column */}
                  <td style={{ textAlign: "center" }}>
                    <a
                      href={`/analyze/${encodeURIComponent(game.id)}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: '#18181b',
                        color: '#60a5fa',
                        fontSize: 22,
                        textDecoration: 'none',
                        border: '1.5px solid #333',
                        transition: 'background 0.2s',
                      }}
                      title="Analyse this game"
                    >
                      <span role="img" aria-label="Analyse">🔍</span>
                    </a>
                  </td>
                </tr>
                {/* Divider line between games */}
                {idx < filteredGames.length - 1 && (
                  <tr>
                    <td colSpan={8} style={{ borderBottom: '1.5px solid #333', padding: 0, background: '#23232b' }}></td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {showPopup && (
        <div style={{ position: "fixed", top: "0", left: "0", right: "0", bottom: "0", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "#262626", padding: "20px", borderRadius: "8px", maxWidth: "400px", width: "100%" }}>
            <h3 style={{ marginBottom: "15px", textAlign: "center" }}>Select Custom Date Range</h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Start Date</label>
              <input 
                type="date" 
                value={filters.customStart} 
                onChange={(e) => setFilters({ ...filters, customStart: e.target.value })}
                style={{ width: "100%", padding: "8px", backgroundColor: "#404040", color: "white", border: "none", borderRadius: "4px" }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>End Date</label>
              <input 
                type="date" 
                value={filters.customEnd} 
                onChange={(e) => setFilters({ ...filters, customEnd: e.target.value })}
                style={{ width: "100%", padding: "8px", backgroundColor: "#404040", color: "white", border: "none", borderRadius: "4px" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button 
                onClick={() => setShowPopup(false)} 
                style={{ padding: "8px 16px", backgroundColor: "#6b7280", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmCustomRange} 
                style={{ padding: "8px 16px", backgroundColor: "#5b21b6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                disabled={!filters.customStart || !filters.customEnd}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FetchGamesPage;