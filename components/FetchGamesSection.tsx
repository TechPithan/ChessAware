'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FetchGamesSection() {
  const [platform, setPlatform] = useState<'chess.com' | 'lichess'>('chess.com');
  const [username, setUsername] = useState('');
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setShow(true);
  }, []);

  const handleFetchGames = () => {
    if (!username) {
      alert('Please enter a username!');
      return;
    }
    router.push(`/fetch-games?platform=${platform}&username=${encodeURIComponent(username)}`);
  };

  return (
    <section
      className={`bg-gradient-to-b from-white via-[#fafafa] to-[#f5f5f5] text-black px-6 py-8 flex justify-center transition-all duration-700`}
    >
      <div
        className={`bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl text-center border border-gray-100 fade-in-up ${
          show ? 'show' : ''
        }`}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Analyse Your Games Instantly</h2>
        <p className="text-gray-500 mb-6">
          Type your username and fetch your games for instant analysis and insights.
        </p>

        <div className="flex justify-center mb-6 space-x-2">
          <button
            onClick={() => setPlatform('chess.com')}
            className={`px-4 py-2 rounded-full border ${
              platform === 'chess.com'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            } transition`}
          >
            Chess.com
          </button>
          <button
            onClick={() => setPlatform('lichess')}
            className={`px-4 py-2 rounded-full border ${
              platform === 'lichess'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            } transition`}
          >
            Lichess
          </button>
        </div>

        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded-full px-4 py-3 w-full mb-4 focus:ring-2 focus:ring-blue-600 outline-none transition"
        />

        <button
          onClick={handleFetchGames}
          className="bg-blue-600 text-white px-6 py-3 rounded-full w-full font-semibold hover:bg-blue-700 transition"
        >
          Fetch My Games
        </button>

        <p className="text-gray-400 text-xs mt-4">
          Might take a few minutes — the more games you’ve played, the longer it takes!
        </p>
      </div>
    </section>
  );
}
