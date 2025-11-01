import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Trophy, 
  Zap, 
  Clock,
  Target,
  TrendingDown,
  Award,
  ChevronRight
} from 'lucide-react';

function gen(n, kind) {
  const a = Array.from({ length: n }, (_, i) => i);
  if (kind === 'reversed') return a.reverse();
  if (kind === 'nearly') {
    const b = a.slice();
    for (let k = 0; k < Math.max(1, Math.floor(n * 0.05)); k++) {
      const i = Math.floor(Math.random() * n);
      const j = Math.floor(Math.random() * n);
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  }
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function time(fn, a) {
  const arr = a.slice();
  const t0 = performance.now();
  fn(arr);
  return performance.now() - t0;
}

function insertion(a) {
  const arr = a.slice();
  for (let i = 1; i < arr.length; i++) {
    const k = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > k) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = k;
  }
  return arr;
}

function merge(a) {
  const arr = a.slice();
  function ms(l, r) {
    if (r - l <= 1) return arr.slice(l, r);
    const m = (l + r) >> 1;
    const L = ms(l, m), R = ms(m, r);
    const out = [];
    let i = 0, j = 0;
    while (i < L.length || j < R.length) {
      if (j >= R.length || (i < L.length && L[i] <= R[j])) out.push(L[i++]);
      else out.push(R[j++]);
    }
    return out;
  }
  return ms(0, arr.length);
}

function quick(a) {
  const arr = a.slice();
  function qs(l, r) {
    if (l >= r) return;
    const p = arr[Math.floor((l + r) / 2)];
    let i = l, j = r;
    while (i <= j) {
      while (arr[i] < p) i++;
      while (arr[j] > p) j--;
      if (i <= j) {
        const t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
        i++;
        j--;
      }
    }
    if (l < j) qs(l, j);
    if (i < r) qs(i, r);
  }
  qs(0, arr.length - 1);
  return arr;
}

const ALGOS = [
  { name: 'Insertion Sort', fn: insertion, color: 'from-blue-600 to-cyan-600', icon: '🔵' },
  { name: 'Merge Sort', fn: merge, color: 'from-purple-600 to-pink-600', icon: '🟣' },
  { name: 'Quick Sort', fn: quick, color: 'from-emerald-600 to-green-600', icon: '🟢' }
];

export default function AlgorithmBracketTournament() {
  const [n, setN] = useState(200);
  const [kind, setKind] = useState('random');
  const [tree, setTree] = useState(null);
  const [running, setRunning] = useState(false);

  const run = useCallback(() => {
    setRunning(true);
    setTree(null);

    setTimeout(() => {
      const base = gen(n, kind);
      const [a, b, c] = ALGOS;

      const r1a = time(a.fn, base);
      const r1b = time(b.fn, base);
      const semiWinner = r1a < r1b ? a : b;
      const semiTime = Math.min(r1a, r1b);
      const semiLoser = r1a < r1b ? b : a;

      const r2a = time(c.fn, base);
      const r2b = semiTime;
      const finalWinner = r2a < r2b ? c : semiWinner;
      const finalLoser = r2a < r2b ? semiWinner : c;

      setTree({
        matches: [
          {
            round: 'Semifinal',
            A: a,
            B: b,
            tA: r1a,
            tB: r1b,
            winner: semiWinner,
            loser: semiLoser
          },
          {
            round: 'Final',
            A: c,
            B: semiWinner,
            tA: r2a,
            tB: r2b,
            winner: finalWinner,
            loser: finalLoser
          }
        ],
        champion: finalWinner
      });
      setRunning(false);
    }, 100);
  }, [n, kind]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            🏆 Algorithm Bracket Tournament
          </h1>
          <p className="text-lg text-indigo-300">
            Head-to-head matchups on the same input; fastest advances
          </p>
        </motion.div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <Target size={16} className="text-cyan-400" />
              <span className="text-xs text-indigo-300">Array Size</span>
            </div>
            <div className="text-2xl font-bold text-cyan-400">{n}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} className="text-purple-400" />
              <span className="text-xs text-indigo-300">Distribution</span>
            </div>
            <div className="text-lg font-bold text-purple-400 capitalize">{kind}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4 col-span-2 md:col-span-1"
          >
            <div className="flex items-center gap-2 mb-1">
              <Trophy size={16} className="text-yellow-400" />
              <span className="text-xs text-indigo-300">Champion</span>
            </div>
            <div className="text-lg font-bold text-yellow-400">
              {tree ? tree.champion.name.split(' ')[0] : '—'}
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
        >
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Zap size={20} />
            Configuration
          </h3>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Array Size: {n}
              </label>
              <input
                type="range"
                min={50}
                max={2000}
                step={50}
                value={n}
                onChange={(e) => setN(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>50</span>
                <span>2000</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Distribution Type
              </label>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value)}
                className="w-full bg-gray-900 border border-indigo-600 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="random">Random</option>
                <option value="reversed">Reversed</option>
                <option value="nearly">Nearly-Sorted</option>
              </select>
            </div>

            <div className="flex items-end">
              <motion.button
                onClick={run}
                disabled={running}
                whileHover={!running ? { scale: 1.05 } : {}}
                whileTap={!running ? { scale: 0.95 } : {}}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {running ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Zap size={20} />
                    </motion.div>
                    Running...
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    Run Tournament
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Competitors */}
          <div className="grid grid-cols-3 gap-3">
            {ALGOS.map((algo, idx) => (
              <motion.div
                key={algo.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="p-3 bg-gray-900/50 border border-gray-700 rounded-lg"
              >
                <div className="text-2xl mb-1">{algo.icon}</div>
                <div className="text-sm font-semibold text-white">{algo.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tournament Bracket */}
        <AnimatePresence>
          {tree && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Champion Banner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 border-2 border-yellow-500 rounded-xl p-6 shadow-2xl"
              >
                <div className="flex items-center justify-center gap-4">
                  <Trophy size={48} className="text-white" />
                  <div>
                    <div className="text-sm text-yellow-100 mb-1">Tournament Champion</div>
                    <div className="text-3xl font-bold text-white">{tree.champion.name}</div>
                  </div>
                  <Trophy size={48} className="text-white" />
                </div>
              </motion.div>

              {/* Match Cards */}
              <div className="space-y-4">
                {tree.matches.map((match, matchIdx) => (
                  <motion.div
                    key={matchIdx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: matchIdx * 0.2 }}
                    className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Award size={20} className="text-cyan-400" />
                        {match.round}
                      </h3>
                      <span className="text-xs px-3 py-1 bg-indigo-600/30 text-indigo-300 rounded-full border border-indigo-600/50">
                        Round {matchIdx + 1}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      {/* Competitor A */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          match.winner === match.A
                            ? 'border-emerald-500 bg-emerald-900/30'
                            : 'border-gray-700 bg-gray-900/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{match.A.icon}</span>
                            <span className="font-semibold text-white">{match.A.name}</span>
                          </div>
                          {match.winner === match.A && (
                            <Trophy size={20} className="text-emerald-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-cyan-400" />
                          <span className={`text-lg font-mono font-bold ${
                            match.winner === match.A ? 'text-emerald-400' : 'text-gray-400'
                          }`}>
                            {match.tA.toFixed(3)} ms
                          </span>
                        </div>
                      </motion.div>

                      {/* Competitor B */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          match.winner === match.B
                            ? 'border-emerald-500 bg-emerald-900/30'
                            : 'border-gray-700 bg-gray-900/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{match.B.icon}</span>
                            <span className="font-semibold text-white">{match.B.name}</span>
                          </div>
                          {match.winner === match.B && (
                            <Trophy size={20} className="text-emerald-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-cyan-400" />
                          <span className={`text-lg font-mono font-bold ${
                            match.winner === match.B ? 'text-emerald-400' : 'text-gray-400'
                          }`}>
                            {match.tB.toFixed(3)} ms
                          </span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Match Result */}
                    <div className="flex items-center justify-center gap-3 p-3 bg-indigo-900/30 border border-indigo-700 rounded-lg">
                      <TrendingDown size={18} className="text-emerald-400" />
                      <span className="text-sm text-gray-300">Winner advances:</span>
                      <span className="font-bold text-emerald-400">{match.winner.name}</span>
                      <span className="text-sm text-gray-400">
                        ({Math.abs(match.tA - match.tB).toFixed(3)} ms faster)
                      </span>
                      <ChevronRight size={18} className="text-cyan-400" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Performance Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
              >
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock size={20} />
                  Performance Summary
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {ALGOS.map((algo) => {
                    const match1 = tree.matches[0];
                    const match2 = tree.matches[1];
                    let time = null;
                    
                    if (match1.A === algo) time = match1.tA;
                    else if (match1.B === algo) time = match1.tB;
                    else if (match2.A === algo) time = match2.tA;

                    return (
                      <div key={algo.name} className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{algo.icon}</span>
                          <span className="text-sm font-semibold text-white">{algo.name}</span>
                        </div>
                        {time !== null && (
                          <div className="text-2xl font-mono font-bold text-cyan-400">
                            {time.toFixed(3)} ms
                          </div>
                        )}
                        {tree.champion === algo && (
                          <div className="mt-2 inline-block px-2 py-1 bg-yellow-600/30 text-yellow-300 rounded text-xs font-semibold border border-yellow-600/50">
                            🏆 Champion
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-blue-900/30 border border-blue-700 rounded-xl p-6"
        >
          <h3 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
            <Zap size={18} />
            Tournament Format
          </h3>
          <div className="text-sm text-blue-200 space-y-2">
            <p>
              • <strong>Semifinal:</strong> Insertion Sort vs Merge Sort on identical input
            </p>
            <p>
              • <strong>Final:</strong> Quick Sort vs Semifinal Winner
            </p>
            <p>
              • <strong>Scoring:</strong> Fastest execution time wins each matchup
            </p>
            <p>
              • <strong>Variables:</strong> Adjust array size and distribution to see different outcomes
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
