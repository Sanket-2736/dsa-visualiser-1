import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  Zap, 
  TrendingUp, 
  Activity,
  Shuffle,
  Target,
  BarChart3
} from 'lucide-react';

function bubbleComparisons(arr) {
  let comps = 0;
  const a = arr.slice();
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      comps++;
      if (a[j] > a[j + 1]) {
        const t = a[j];
        a[j] = a[j + 1];
        a[j + 1] = t;
      }
    }
  }
  return comps;
}

function mutate(a) {
  const b = a.slice();
  const i = Math.floor(Math.random() * b.length);
  const j = Math.floor(Math.random() * b.length);
  [b[i], b[j]] = [b[j], b[i]];
  return b;
}

export default function WorstCaseEvolver() {
  const [n, setN] = useState(12);
  const [seed, setSeed] = useState(() => Array.from({ length: 12 }, (_, i) => i));
  const [best, setBest] = useState(null);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState([]);
  const [generation, setGeneration] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);

  const theoreticalMax = (n * (n - 1)) / 2;
  const efficiency = best ? ((best.comps / theoreticalMax) * 100).toFixed(1) : 0;

  useEffect(() => {
    setHistory([]);
    setBest(null);
    setGeneration(0);
    setCurrentScore(0);
  }, [n]);

  const run = useCallback(() => {
    setRunning(true);
    setHistory([]);
    setGeneration(0);
    
    setTimeout(() => {
      let cur = seed.slice();
      let curScore = bubbleComparisons(cur);
      const hist = [{ gen: 0, score: curScore }];
      setCurrentScore(curScore);
      
      for (let gen = 1; gen <= 200; gen++) {
        const cand = mutate(cur);
        const score = bubbleComparisons(cand);
        
        if (score > curScore) {
          cur = cand;
          curScore = score;
          hist.push({ gen, score: curScore });
        }
        
        if (gen % 10 === 0) {
          setGeneration(gen);
          setCurrentScore(curScore);
        }
      }
      
      setBest({ arr: cur, comps: curScore });
      setHistory(hist);
      setGeneration(200);
      setRunning(false);
    }, 100);
  }, [seed]);

  const randomizeSeed = useCallback(() => {
    const arr = Array.from({ length: n }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setSeed(arr);
  }, [n]);

  const resetToSorted = useCallback(() => {
    setSeed(Array.from({ length: n }, (_, i) => i));
  }, [n]);

  const handleSizeChange = useCallback((newSize) => {
    setN(newSize);
    setSeed(Array.from({ length: newSize }, (_, i) => i));
  }, []);

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
            🧬 Worst-Case Input Evolver
          </h1>
          <p className="text-lg text-indigo-300">
            Evolve inputs that maximize comparisons for Bubble Sort
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
              <Activity size={16} className="text-purple-400" />
              <span className="text-xs text-indigo-300">Generation</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">{generation}/200</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-emerald-400" />
              <span className="text-xs text-indigo-300">Best Score</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {best ? best.comps : currentScore}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 size={16} className="text-yellow-400" />
              <span className="text-xs text-indigo-300">Efficiency</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{efficiency}%</div>
          </motion.div>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
        >
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Zap size={20} />
            Configuration
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Array Size: {n}
              </label>
              <input
                type="range"
                min={5}
                max={60}
                value={n}
                onChange={(e) => handleSizeChange(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>5</span>
                <span>60</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Theoretical Max: {theoreticalMax}
              </label>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${efficiency}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-500"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.button
              onClick={run}
              disabled={running}
              whileHover={!running ? { scale: 1.05 } : {}}
              whileTap={!running ? { scale: 0.95 } : {}}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {running ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Activity size={20} />
                  </motion.div>
                  Evolving...
                </>
              ) : (
                <>
                  <Play size={20} />
                  Evolve
                </>
              )}
            </motion.button>

            <motion.button
              onClick={randomizeSeed}
              disabled={running}
              whileHover={!running ? { scale: 1.05 } : {}}
              whileTap={!running ? { scale: 0.95 } : {}}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Shuffle size={20} />
              Randomize Seed
            </motion.button>

            <motion.button
              onClick={resetToSorted}
              disabled={running}
              whileHover={!running ? { scale: 1.05 } : {}}
              whileTap={!running ? { scale: 0.95 } : {}}
              className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <RotateCcw size={20} />
              Reset
            </motion.button>
          </div>
        </motion.div>

        {/* Arrays Display */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Seed Array */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
          >
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Target size={18} />
              Seed Array
            </h3>
            <div className="flex flex-wrap gap-2">
              {seed.map((x, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="px-3 py-2 bg-indigo-600/30 text-indigo-300 rounded-lg font-mono text-sm border border-indigo-600/50"
                >
                  {x}
                </motion.span>
              ))}
            </div>
            <div className="mt-4 text-xs text-gray-400">
              Initial comparisons: {bubbleComparisons(seed)}
            </div>
          </motion.div>

          {/* Best Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
          >
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={18} />
              Best Found
            </h3>
            {best ? (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  {best.arr.map((x, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="px-3 py-2 bg-emerald-600/30 text-emerald-300 rounded-lg font-mono text-sm border border-emerald-600/50"
                    >
                      {x}
                    </motion.span>
                  ))}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Comparisons:</span>
                    <span className="text-emerald-400 font-bold">{best.comps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Theoretical Max:</span>
                    <span className="text-cyan-400 font-bold">{theoreticalMax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Efficiency:</span>
                    <span className="text-yellow-400 font-bold">{efficiency}%</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-gray-500">
                <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-sm">Run evolution to see results</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Evolution History Chart */}
        <AnimatePresence>
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
            >
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 size={20} />
                Evolution Progress
              </h3>
              
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <svg width="100%" height="200" className="min-w-[600px]">
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgb(34, 211, 238)" />
                      <stop offset="100%" stopColor="rgb(168, 85, 247)" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={180 * pct + 10}
                      x2="100%"
                      y2={180 * pct + 10}
                      stroke="#374151"
                      strokeWidth={1}
                      strokeDasharray="4,4"
                      opacity={0.3}
                    />
                  ))}
                  
                  {/* Evolution line */}
                  {history.length > 1 && (
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, ease: 'easeInOut' }}
                      d={history
                        .map((h, i) => {
                          const x = (i / (history.length - 1)) * 100 + '%';
                          const y = 190 - (h.score / theoreticalMax) * 180;
                          return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="url(#grad)"
                      strokeWidth={3}
                    />
                  )}
                  
                  {/* Points */}
                  {history.map((h, i) => {
                    const x = `${(i / (history.length - 1)) * 100}%`;
                    const y = 190 - (h.score / theoreticalMax) * 180;
                    return (
                      <motion.circle
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 2 + i * 0.05, type: 'spring' }}
                        cx={x}
                        cy={y}
                        r={4}
                        fill="rgb(34, 211, 238)"
                        stroke="#1f2937"
                        strokeWidth={2}
                      />
                    );
                  })}
                </svg>
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-400">Improvements:</span>
                  <span className="ml-2 text-cyan-400 font-bold">{history.length - 1}</span>
                </div>
                <div>
                  <span className="text-gray-400">Initial:</span>
                  <span className="ml-2 text-purple-400 font-bold">{history[0]?.score}</span>
                </div>
                <div>
                  <span className="text-gray-400">Final:</span>
                  <span className="ml-2 text-emerald-400 font-bold">{history[history.length - 1]?.score}</span>
                </div>
                <div>
                  <span className="text-gray-400">Gain:</span>
                  <span className="ml-2 text-yellow-400 font-bold">
                    +{history[history.length - 1]?.score - history[0]?.score}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-blue-900/30 border border-blue-700 rounded-xl p-6"
        >
          <h3 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
            <Zap size={18} />
            How It Works
          </h3>
          <div className="text-sm text-blue-200 space-y-2">
            <p>
              • <strong>Evolution:</strong> Randomly swaps two elements and keeps the mutation if it increases comparisons
            </p>
            <p>
              • <strong>Goal:</strong> Find input arrays that force Bubble Sort to perform the maximum number of comparisons
            </p>
            <p>
              • <strong>Worst Case:</strong> Reverse-sorted arrays typically maximize comparisons: n(n-1)/2
            </p>
            <p>
              • <strong>Generations:</strong> Runs 200 iterations to converge toward the worst-case input
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
