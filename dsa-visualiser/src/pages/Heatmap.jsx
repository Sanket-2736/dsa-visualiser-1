import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Grid3x3, 
  Zap, 
  TrendingUp,
  Activity,
  Layers,
  Settings
} from 'lucide-react';

function genArray(n, disorder, dupes) {
  const a = Array.from({ length: n }, (_, i) => i);
  if (dupes > 0) {
    for (let i = 0; i < n; i++) {
      if (Math.random() < dupes) {
        a[i] = a[Math.floor(Math.random() * i)] || a[i];
      }
    }
  }
  const swaps = Math.floor(n * disorder);
  for (let k = 0; k < swaps; k++) {
    const i = Math.floor(Math.random() * n);
    const j = Math.floor(Math.random() * n);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function time(fn, a) {
  const b = a.slice();
  const t0 = performance.now();
  fn(b);
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

const ALGORITHMS = [
  { key: 'insertion', name: 'Insertion Sort', color: 'rgba(239, 68, 68, ', icon: '🔴' },
  { key: 'merge', name: 'Merge Sort', color: 'rgba(16, 185, 129, ', icon: '🟢' },
  { key: 'quick', name: 'Quick Sort', color: 'rgba(59, 130, 246, ', icon: '🔵' }
];

export default function PerformanceHeatmap() {
  const [n, setN] = useState(100);
  const [grid, setGrid] = useState(5);
  const [algos, setAlgos] = useState({ insertion: true, merge: true, quick: false });
  const [data, setData] = useState(null);
  const [running, setRunning] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);

  const stepsD = Array.from({ length: grid }, (_, i) => i / (grid - 1));
  const stepsU = Array.from({ length: grid }, (_, i) => i / (grid - 1));

  const run = useCallback(() => {
    setRunning(true);
    setData(null);

    setTimeout(() => {
      const rows = [];
      for (const d of stepsD) {
        const row = [];
        for (const u of stepsU) {
          const base = genArray(n, d, u);
          row.push({
            d,
            u,
            ins: algos.insertion ? time(insertion, base) : 0,
            mer: algos.merge ? time(merge, base) : 0,
            qk: algos.quick ? time(quick, base) : 0
          });
        }
        rows.push(row);
      }
      setData(rows);
      setRunning(false);
    }, 100);
  }, [n, grid, algos, stepsD, stepsU]);

  const max = data ? Math.max(...data.flat().map(x => Math.max(x.ins, x.mer, x.qk))) : 1;
  const activeAlgoCount = Object.values(algos).filter(Boolean).length;

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
            🔥 Performance Heatmap
          </h1>
          <p className="text-lg text-indigo-300">
            Visualize algorithm performance across disorder and duplicate dimensions
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
              <Layers size={16} className="text-cyan-400" />
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
              <Grid3x3 size={16} className="text-purple-400" />
              <span className="text-xs text-indigo-300">Grid Size</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">{grid}×{grid}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <Activity size={16} className="text-emerald-400" />
              <span className="text-xs text-indigo-300">Algorithms</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">{activeAlgoCount}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-yellow-400" />
              <span className="text-xs text-indigo-300">Max Time</span>
            </div>
            <div className="text-xl font-bold text-yellow-400">{max.toFixed(2)} ms</div>
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
            <Settings size={20} />
            Configuration
          </h3>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Array Size */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Array Size: {n}
              </label>
              <input
                type="range"
                min={50}
                max={500}
                step={10}
                value={n}
                onChange={(e) => setN(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>50</span>
                <span>500</span>
              </div>
            </div>

            {/* Grid Resolution */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Grid Resolution: {grid}×{grid}
              </label>
              <input
                type="range"
                min={3}
                max={12}
                value={grid}
                onChange={(e) => setGrid(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>3×3</span>
                <span>12×12</span>
              </div>
            </div>
          </div>

          {/* Algorithm Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-indigo-300 mb-3">
              Select Algorithms
            </label>
            <div className="grid grid-cols-3 gap-3">
              {ALGORITHMS.map((algo) => (
                <motion.label
                  key={algo.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 transition-all ${
                    algos[algo.key]
                      ? 'border-indigo-500 bg-indigo-900/30'
                      : 'border-gray-700 bg-gray-900/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={algos[algo.key]}
                    onChange={(e) => setAlgos(a => ({ ...a, [algo.key]: e.target.checked }))}
                    className="w-5 h-5 accent-indigo-500"
                  />
                  <span className="text-xl">{algo.icon}</span>
                  <span className="text-sm font-semibold text-white">{algo.name}</span>
                </motion.label>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <motion.button
            onClick={run}
            disabled={running || activeAlgoCount === 0}
            whileHover={!running && activeAlgoCount > 0 ? { scale: 1.05 } : {}}
            whileTap={!running && activeAlgoCount > 0 ? { scale: 0.95 } : {}}
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
                Generating Heatmap...
              </>
            ) : (
              <>
                <Play size={20} />
                Generate Heatmap
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Heatmap Display */}
        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
            >
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Grid3x3 size={20} />
                Performance Heatmap
              </h3>

              {/* Axis Labels */}
              <div className="mb-4 text-sm text-gray-400">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-cyan-400">X-axis:</span>
                  <span>Duplicate Rate (0% → 100%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-purple-400">Y-axis:</span>
                  <span>Disorder Level (0% → 100%)</span>
                </div>
              </div>

              {/* Heatmap Grid */}
              <div className="overflow-auto bg-gray-900 rounded-lg p-4">
                <div className="inline-block">
                  {ALGORITHMS.filter(algo => algos[algo.key]).map((algo, algoIdx) => (
                    <div key={algo.key} className="mb-6 last:mb-0">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">{algo.icon}</span>
                        <span className="text-sm font-semibold text-white">{algo.name}</span>
                      </div>
                      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${grid}, 32px)` }}>
                        {data.map((row, ri) =>
                          row.map((cell, ci) => {
                            const value = algo.key === 'insertion' ? cell.ins :
                                        algo.key === 'merge' ? cell.mer : cell.qk;
                            const intensity = value / max;
                            const cellKey = `${algo.key}-${ri}-${ci}`;
                            const isHovered = hoveredCell === cellKey;

                            return (
                              <motion.div
                                key={cellKey}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: (ri * grid + ci) * 0.01 }}
                                whileHover={{ scale: 1.3, zIndex: 10 }}
                                onHoverStart={() => setHoveredCell(cellKey)}
                                onHoverEnd={() => setHoveredCell(null)}
                                className="relative cursor-pointer rounded"
                                style={{
                                  width: 32,
                                  height: 32,
                                  background: algo.color + intensity + ')',
                                  border: isHovered ? '2px solid white' : '1px solid rgba(255,255,255,0.1)'
                                }}
                                title={`Disorder: ${(cell.d * 100).toFixed(0)}%, Dupes: ${(cell.u * 100).toFixed(0)}%, Time: ${value.toFixed(2)}ms`}
                              >
                                {isHovered && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-xs whitespace-nowrap z-20 shadow-lg"
                                  >
                                    <div className="font-semibold text-cyan-400 mb-1">{value.toFixed(3)} ms</div>
                                    <div className="text-gray-400">Disorder: {(cell.d * 100).toFixed(0)}%</div>
                                    <div className="text-gray-400">Dupes: {(cell.u * 100).toFixed(0)}%</div>
                                  </motion.div>
                                )}
                              </motion.div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                <h4 className="text-sm font-semibold text-white mb-3">Color Intensity Legend</h4>
                <div className="space-y-2">
                  {ALGORITHMS.filter(algo => algos[algo.key]).map(algo => (
                    <div key={algo.key} className="flex items-center gap-3">
                      <span className="text-lg">{algo.icon}</span>
                      <span className="text-sm text-gray-300">{algo.name}:</span>
                      <div className="flex-1 h-6 rounded-lg flex items-center" style={{
                        background: `linear-gradient(to right, ${algo.color}0), ${algo.color}1))`
                      }}>
                        <div className="w-full flex justify-between px-2 text-xs text-white font-semibold mix-blend-difference">
                          <span>Fast</span>
                          <span>Slow</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-blue-900/30 border border-blue-700 rounded-xl p-6"
        >
          <h3 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
            <Zap size={18} />
            How to Read the Heatmap
          </h3>
          <div className="text-sm text-blue-200 space-y-2">
            <p>
              • <strong>Color Intensity:</strong> Darker = slower execution time, Lighter = faster
            </p>
            <p>
              • <strong>X-axis (left → right):</strong> Duplicate rate increases from 0% to 100%
            </p>
            <p>
              • <strong>Y-axis (top → bottom):</strong> Disorder level increases from 0% to 100%
            </p>
            <p>
              • <strong>Hover:</strong> Place cursor over any cell to see exact timings
            </p>
            <p>
              • <strong>Patterns:</strong> Look for algorithm strengths/weaknesses across different input characteristics
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
