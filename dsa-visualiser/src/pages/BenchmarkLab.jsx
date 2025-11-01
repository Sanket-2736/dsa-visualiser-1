import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Download, 
  BarChart3, 
  Settings,
  Zap,
  TrendingUp,
  Activity,
  Clock,
  Grid3x3
} from 'lucide-react';

function genArray(n, kind, seed = 42) {
  let arr = Array.from({ length: n }, (_, i) => i);
  function rng() {
    seed ^= seed << 13; 
    seed ^= seed >> 17; 
    seed ^= seed << 5; 
    return (seed >>> 0) / 4294967296;
  }
  if (kind === 'random') {
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  } else if (kind === 'reversed') {
    arr.reverse();
  } else if (kind === 'nearly') {
    for (let k = 0; k < Math.max(1, Math.floor(n * 0.05)); k++) {
      const i = Math.floor(rng() * n), j = Math.floor(rng() * n);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  return arr;
}

function bubbleSort(a) {
  const arr = a.slice();
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        const t = arr[j]; 
        arr[j] = arr[j + 1]; 
        arr[j + 1] = t;
      }
    }
  }
  return arr;
}

function insertionSort(a) {
  const arr = a.slice();
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) { 
      arr[j + 1] = arr[j]; 
      j--; 
    }
    arr[j + 1] = key;
  }
  return arr;
}

function mergeSort(a) {
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

function quickSort(a) {
  const arr = a.slice();
  function qs(l, r) {
    if (l >= r) return;
    const pivot = arr[Math.floor((l + r) / 2)];
    let i = l, j = r;
    while (i <= j) {
      while (arr[i] < pivot) i++;
      while (arr[j] > pivot) j--;
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

function heapSort(a) {
  const arr = a.slice(); 
  const n = arr.length;
  function heapify(n, i) {
    let largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest !== i) { 
      const t = arr[i]; 
      arr[i] = arr[largest]; 
      arr[largest] = t; 
      heapify(n, largest); 
    }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  for (let i = n - 1; i > 0; i--) { 
    const t = arr[0]; 
    arr[0] = arr[i]; 
    arr[i] = t; 
    heapify(i, 0); 
  }
  return arr;
}

const SUITE = [
  { id: 'bubble', name: 'Bubble Sort', fn: bubbleSort, color: 'from-red-600 to-pink-600', rgb: '239, 68, 68' },
  { id: 'insertion', name: 'Insertion Sort', fn: insertionSort, color: 'from-orange-600 to-amber-600', rgb: '245, 158, 11' },
  { id: 'merge', name: 'Merge Sort', fn: mergeSort, color: 'from-emerald-600 to-green-600', rgb: '16, 185, 129' },
  { id: 'quick', name: 'Quick Sort', fn: quickSort, color: 'from-blue-600 to-cyan-600', rgb: '59, 130, 246' },
  { id: 'heap', name: 'Heap Sort', fn: heapSort, color: 'from-purple-600 to-pink-600', rgb: '168, 85, 247' },
];

function exportCsv(results) {
  if (!results) return;
  const algs = Object.keys(results);
  const sizes = results[algs[0]].map(x => x.n);
  let rows = [['Algorithm', ...sizes.map(n => `n=${n}`)]];
  for (const a of algs) { 
    rows.push([a, ...results[a].map(x => x.ms.toFixed(3))]); 
  }
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); 
  a.href = url; 
  a.download = 'benchmarks.csv'; 
  a.click(); 
  URL.revokeObjectURL(url);
}

const Chart = ({ results, sizes, logScale }) => {
  const all = Object.values(results).flat().map(x => x.ms);
  const maxY = Math.max(...all, 1);
  const minY = Math.min(...all, 0.1);
  const width = Math.max(500, sizes.length * 160);
  const height = 320;
  const pad = 50;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;

  return (
    <svg width={width} height={height} className="bg-gray-900 rounded-lg">
      <defs>
        {SUITE.map(alg => (
          <linearGradient key={alg.id} id={`grad-${alg.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={`rgb(${alg.rgb})`} />
            <stop offset="100%" stopColor={`rgb(${alg.rgb})`} stopOpacity="0.7" />
          </linearGradient>
        ))}
      </defs>
      
      <g transform={`translate(${pad},${pad})`}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
          <line
            key={i}
            x1={0}
            y1={innerH * pct}
            x2={innerW}
            y2={innerH * pct}
            stroke="#374151"
            strokeWidth={1}
            strokeDasharray="4,4"
            opacity={0.3}
          />
        ))}
        
        {/* Axes */}
        <line x1={0} y1={innerH} x2={innerW} y2={innerH} stroke="#6366f1" strokeWidth={2} />
        <line x1={0} y1={0} x2={0} y2={innerH} stroke="#6366f1" strokeWidth={2} />
        
        {/* Algorithm lines */}
        {Object.entries(results).map(([key, arr]) => {
          const alg = SUITE.find(a => a.id === key);
          const dx = innerW / Math.max(1, sizes.length - 1);
          const scale = (v) => logScale 
            ? (Math.log10(v) - Math.log10(minY)) / (Math.log10(maxY) - Math.log10(minY)) 
            : (v / maxY);
          const pts = arr.map((p, idx) => [idx * dx, innerH - scale(p.ms) * innerH]);
          const d = pts.map((p, j) => (j === 0 ? `M ${p[0]},${p[1]}` : `L ${p[0]},${p[1]}`)).join(' ');
          
          return (
            <g key={key}>
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                d={d}
                fill="none"
                stroke={`url(#grad-${key})`}
                strokeWidth={3}
              />
              {pts.map((p, j) => (
                <motion.circle
                  key={j}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5 + j * 0.1, type: 'spring', stiffness: 300 }}
                  cx={p[0]}
                  cy={p[1]}
                  r={5}
                  fill={`rgb(${alg.rgb})`}
                  stroke="#1f2937"
                  strokeWidth={2}
                />
              ))}
            </g>
          );
        })}
        
        {/* X-axis labels */}
        {sizes.map((n, idx) => (
          <text
            key={n}
            x={(innerW / Math.max(1, sizes.length - 1)) * idx}
            y={innerH + 20}
            fontSize={12}
            fill="#9ca3af"
            textAnchor="middle"
          >
            n={n}
          </text>
        ))}
        
        {/* Y-axis label */}
        <text x={-10} y={-15} fontSize={12} fill="#9ca3af" fontWeight="bold">
          Time (ms)
        </text>
      </g>
      
      {/* Legend */}
      <g transform={`translate(${pad},${height - 25})`}>
        {SUITE.map((alg, i) => (
          <g key={alg.id} transform={`translate(${i * 120},0)`}>
            <rect x={0} y={-8} width={16} height={6} fill={`rgb(${alg.rgb})`} rx={2} />
            <text x={20} y={-3} fontSize={11} fill="#d1d5db">
              {alg.name.split(' ')[0]}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

const BenchmarkLab = () => {
  const [sizes, setSizes] = useState('100,200,400,800');
  const [dist, setDist] = useState('random');
  const [runs, setRuns] = useState(3);
  const [results, setResults] = useState(null);
  const [logScale, setLogScale] = useState(false);
  const [running, setRunning] = useState(false);

  const parsedSizes = useMemo(() => 
    sizes.split(',').map(s => parseInt(s.trim(), 10)).filter(Boolean), 
    [sizes]
  );

  function runBench() {
    setRunning(true);
    setResults(null);
    
    setTimeout(() => {
      const out = {};
      for (const alg of SUITE) out[alg.id] = [];
      
      for (const n of parsedSizes) {
        const base = genArray(n, dist, 123);
        for (const alg of SUITE) {
          let total = 0;
          for (let r = 0; r < runs; r++) {
            const data = base.slice();
            const t0 = performance.now();
            alg.fn(data);
            total += performance.now() - t0;
          }
          out[alg.id].push({ n, ms: total / runs });
        }
      }
      
      setResults(out);
      setRunning(false);
    }, 100);
  }

  const fastest = useMemo(() => {
    if (!results) return null;
    const totals = SUITE.map(alg => ({
      name: alg.name,
      total: results[alg.id].reduce((sum, x) => sum + x.ms, 0)
    }));
    return totals.sort((a, b) => a.total - b.total)[0];
  }, [results]);

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
            ⚡ Benchmark Lab
          </h1>
          <p className="text-lg text-indigo-300">
            Measure algorithm runtimes across sizes and distributions
          </p>
        </motion.div>

        {/* Stats */}
        {results && fastest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Activity size={16} className="text-cyan-400" />
                <span className="text-xs text-indigo-300">Algorithms</span>
              </div>
              <div className="text-2xl font-bold text-cyan-400">{SUITE.length}</div>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Grid3x3 size={16} className="text-purple-400" />
                <span className="text-xs text-indigo-300">Test Sizes</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">{parsedSizes.length}</div>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} className="text-emerald-400" />
                <span className="text-xs text-indigo-300">Fastest</span>
              </div>
              <div className="text-lg font-bold text-emerald-400">{fastest.name.split(' ')[0]}</div>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 size={16} className="text-orange-400" />
                <span className="text-xs text-indigo-300">Distribution</span>
              </div>
              <div className="text-lg font-bold text-orange-400 capitalize">{dist}</div>
            </div>
          </motion.div>
        )}

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
        >
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Settings size={20} />
            Configuration
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Sizes (comma-separated)
              </label>
              <input
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                className="w-full bg-gray-900 border border-indigo-600 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="100,200,400"
              />
            </div>

            {/* Distribution */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Distribution
              </label>
              <select
                value={dist}
                onChange={(e) => setDist(e.target.value)}
                className="w-full bg-gray-900 border border-indigo-600 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="random">Random</option>
                <option value="reversed">Reversed</option>
                <option value="nearly">Nearly-Sorted</option>
              </select>
            </div>

            {/* Runs */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Runs per size
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={runs}
                onChange={(e) => setRuns(parseInt(e.target.value || '1', 10))}
                className="w-full bg-gray-900 border border-indigo-600 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Log Scale */}
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-3 text-sm text-indigo-300 cursor-pointer bg-gray-900 border border-indigo-600 rounded-lg px-4 py-2 hover:bg-gray-800 transition-colors">
                <input
                  type="checkbox"
                  checked={logScale}
                  onChange={(e) => setLogScale(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500"
                />
                <span>Logarithmic Scale</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <motion.button
            onClick={runBench}
            disabled={running || parsedSizes.length === 0}
            whileHover={!running && parsedSizes.length > 0 ? { scale: 1.05 } : {}}
            whileTap={!running && parsedSizes.length > 0 ? { scale: 0.95 } : {}}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {running ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Zap size={20} />
                </motion.div>
                Running Benchmarks...
              </>
            ) : (
              <>
                <Play size={20} />
                Run Benchmark
              </>
            )}
          </motion.button>

          <motion.button
            onClick={() => exportCsv(results)}
            disabled={!results}
            whileHover={results ? { scale: 1.05 } : {}}
            whileTap={results ? { scale: 0.95 } : {}}
            className="flex items-center gap-2 px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Download size={20} />
            Export CSV
          </motion.button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Chart */}
              <div className="mb-8 bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg overflow-x-auto">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 size={20} />
                  Performance Visualization
                </h3>
                <Chart results={results} sizes={parsedSizes} logScale={logScale} />
              </div>

              {/* Table */}
              <div className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl overflow-hidden shadow-lg">
                <div className="p-4 bg-indigo-900/30 border-b border-indigo-700">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Clock size={20} />
                    Detailed Results
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-900/50">
                        <th className="text-left p-4 text-indigo-300 font-semibold">Algorithm</th>
                        {parsedSizes.map(n => (
                          <th key={n} className="text-right p-4 text-indigo-300 font-semibold">
                            n={n}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SUITE.map((alg, idx) => (
                        <motion.tr
                          key={alg.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="border-t border-gray-700 hover:bg-gray-900/30 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${alg.color}`} />
                              <span className="font-medium text-white">{alg.name}</span>
                            </div>
                          </td>
                          {results[alg.id].map(x => {
                            const isFastest = results[alg.id].every(r => 
                              parsedSizes.indexOf(x.n) === parsedSizes.indexOf(r.n) ? true : 
                              x.ms <= results[alg.id][parsedSizes.indexOf(r.n)]?.ms
                            );
                            return (
                              <td
                                key={x.n}
                                className={`p-4 text-right font-mono ${
                                  isFastest ? 'text-emerald-400 font-bold' : 'text-gray-300'
                                }`}
                              >
                                {x.ms.toFixed(2)} ms
                              </td>
                            );
                          })}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BenchmarkLab;
