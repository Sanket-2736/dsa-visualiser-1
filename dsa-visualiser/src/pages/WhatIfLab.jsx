import React, { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Settings, 
  Zap, 
  TrendingUp, 
  Award, 
  Clock, 
  BarChart3,
  Lightbulb,
  History,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// ============================================================================
// DATA GENERATION ENGINE
// ============================================================================

function seededRNG(seed) {
  let state = seed;
  return () => {
    state ^= state << 13;
    state ^= state >> 17;
    state ^= state << 5;
    return ((state >>> 0) / 4294967296);
  };
}

function generateArray(n, disorder = 0.5, duplicates = 0.0, seed = 5) {
  const rng = seededRNG(seed);
  const arr = Array.from({ length: n }, (_, i) => i);
  
  if (duplicates > 0) {
    const dupeCount = Math.floor(n * duplicates);
    for (let i = 0; i < dupeCount; i++) {
      const srcIdx = Math.floor(rng() * n);
      const dstIdx = Math.floor(rng() * n);
      arr[dstIdx] = arr[srcIdx];
    }
  }
  
  const swaps = Math.floor(n * disorder);
  for (let i = 0; i < swaps; i++) {
    const a = Math.floor(rng() * n);
    const b = Math.floor(rng() * n);
    [arr[a], arr[b]] = [arr[b], arr[a]];
  }
  
  return arr;
}

// ============================================================================
// SORTING ALGORITHMS WITH INSTRUMENTATION
// ============================================================================

function bubbleSort(arr) {
  const a = [...arr];
  let comparisons = 0, swaps = 0;
  const start = performance.now();
  
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      comparisons++;
      if (a[j] > a[j + 1]) {
        swaps++;
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
  }
  
  const time = performance.now() - start;
  return { sorted: a, time, comparisons, swaps, name: 'Bubble Sort' };
}

function insertionSort(arr) {
  const a = [...arr];
  let comparisons = 0, swaps = 0;
  const start = performance.now();
  
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0) {
      comparisons++;
      if (a[j] <= key) break;
      a[j + 1] = a[j];
      swaps++;
      j--;
    }
    a[j + 1] = key;
  }
  
  const time = performance.now() - start;
  return { sorted: a, time, comparisons, swaps, name: 'Insertion Sort' };
}

function mergeSort(arr) {
  let comparisons = 0, merges = 0;
  const start = performance.now();
  
  function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
      comparisons++;
      if (left[i] <= right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
      merges++;
    }
    
    return result.concat(left.slice(i)).concat(right.slice(j));
  }
  
  function sort(a) {
    if (a.length <= 1) return a;
    const mid = Math.floor(a.length / 2);
    const left = sort(a.slice(0, mid));
    const right = sort(a.slice(mid));
    return merge(left, right);
  }
  
  const sorted = sort([...arr]);
  const time = performance.now() - start;
  
  return { sorted, time, comparisons, swaps: merges, name: 'Merge Sort' };
}

function quickSort(arr) {
  let comparisons = 0, swaps = 0;
  const start = performance.now();
  
  function partition(a, low, high) {
    const pivot = a[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      comparisons++;
      if (a[j] < pivot) {
        i++;
        swaps++;
        [a[i], a[j]] = [a[j], a[i]];
      }
    }
    swaps++;
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    return i + 1;
  }
  
  function sort(a, low, high) {
    if (low < high) {
      const pi = partition(a, low, high);
      sort(a, low, pi - 1);
      sort(a, pi + 1, high);
    }
  }
  
  const a = [...arr];
  sort(a, 0, a.length - 1);
  const time = performance.now() - start;
  
  return { sorted: a, time, comparisons, swaps, name: 'Quick Sort' };
}

function heapSort(arr) {
  let comparisons = 0, swaps = 0;
  const start = performance.now();
  
  function heapify(a, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n) {
      comparisons++;
      if (a[left] > a[largest]) largest = left;
    }
    
    if (right < n) {
      comparisons++;
      if (a[right] > a[largest]) largest = right;
    }
    
    if (largest !== i) {
      swaps++;
      [a[i], a[largest]] = [a[largest], a[i]];
      heapify(a, n, largest);
    }
  }
  
  const a = [...arr];
  const n = a.length;
  
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(a, n, i);
  }
  
  for (let i = n - 1; i > 0; i--) {
    swaps++;
    [a[0], a[i]] = [a[i], a[0]];
    heapify(a, i, 0);
  }
  
  const time = performance.now() - start;
  return { sorted: a, time, comparisons, swaps, name: 'Heap Sort' };
}

function selectionSort(arr) {
  const a = [...arr];
  let comparisons = 0, swaps = 0;
  const start = performance.now();
  
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      comparisons++;
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      swaps++;
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    }
  }
  
  const time = performance.now() - start;
  return { sorted: a, time, comparisons, swaps, name: 'Selection Sort' };
}

// ============================================================================
// RECOMMENDATION ENGINE
// ============================================================================

function recommendAlgorithm(n, disorder, duplicates) {
  const insights = [];
  let primary = null;
  
  if (n < 10) {
    primary = 'Insertion Sort';
    insights.push('Small input: simple O(n²) algorithms are fine');
  } else if (n < 50 && disorder < 0.3) {
    primary = 'Insertion Sort';
    insights.push('Nearly sorted: Insertion Sort is O(n) in best case');
  } else if (disorder < 0.2) {
    primary = 'Insertion Sort or Tim Sort';
    insights.push('Low disorder: adaptive algorithms excel');
  } else if (duplicates > 0.3) {
    primary = 'Merge Sort';
    insights.push('Many duplicates: stable sort preserves order');
  } else if (n > 100 && disorder > 0.7) {
    primary = 'Quick Sort or Merge Sort';
    insights.push('Large random input: divide-and-conquer shines');
  } else if (disorder > 0.8) {
    primary = 'Quick Sort (randomized pivot)';
    insights.push('High disorder: Quick Sort averages O(n log n)');
  } else {
    primary = 'Merge Sort';
    insights.push('General case: Merge Sort guarantees O(n log n)');
  }
  
  if (n > 1000) {
    insights.push('Large n: consider in-place (Quick/Heap) vs. auxiliary space (Merge)');
  }
  
  if (duplicates > 0.2) {
    insights.push('Duplicates present: prefer stable sorts (Merge, Insertion)');
  }
  
  return { primary, insights };
}

// ============================================================================
// PRESET CONFIGURATIONS
// ============================================================================

const PRESETS = [
  { key: 'nearly-sorted', label: 'Nearly Sorted', icon: '📊', n: 200, disorder: 0.1, duplicates: 0.05, color: 'from-emerald-600 to-green-600' },
  { key: 'random', label: 'Random', icon: '🎲', n: 300, disorder: 0.9, duplicates: 0.1, color: 'from-blue-600 to-cyan-600' },
  { key: 'reverse', label: 'Reverse', icon: '🔄', n: 250, disorder: 1.0, duplicates: 0, color: 'from-purple-600 to-pink-600' },
  { key: 'many-dupes', label: 'Many Dupes', icon: '👥', n: 150, disorder: 0.5, duplicates: 0.6, color: 'from-orange-600 to-amber-600' },
  { key: 'small', label: 'Small (n=20)', icon: '🔬', n: 20, disorder: 0.5, duplicates: 0.1, color: 'from-teal-600 to-cyan-600' },
  { key: 'large', label: 'Large (n=1K)', icon: '🏗️', n: 1000, disorder: 0.7, duplicates: 0.2, color: 'from-red-600 to-pink-600' }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const WhatIfPerformanceLab = () => {
  const [n, setN] = useState(100);
  const [disorder, setDisorder] = useState(0.5);
  const [duplicates, setDuplicates] = useState(0.1);
  const [seed, setSeed] = useState(42);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [experiments, setExperiments] = useState([]);
  const [showPresets, setShowPresets] = useState(false);
  
  const arr = useMemo(
    () => generateArray(n, disorder, duplicates, seed),
    [n, disorder, duplicates, seed]
  );
  
  const recommendation = useMemo(
    () => recommendAlgorithm(n, disorder, duplicates),
    [n, disorder, duplicates]
  );
  
  const runBenchmark = useCallback(() => {
    setRunning(true);
    setResults(null);
    
    setTimeout(() => {
      const algorithms = [
        bubbleSort,
        insertionSort,
        selectionSort,
        mergeSort,
        quickSort,
        heapSort
      ];
      
      const benchmarks = algorithms.map(algo => {
        try {
          return algo(arr);
        } catch (e) {
          return {
            name: algo.name,
            time: Infinity,
            comparisons: 0,
            swaps: 0,
            error: e.message
          };
        }
      });
      
      benchmarks.sort((a, b) => a.time - b.time);
      
      const experiment = {
        n,
        disorder,
        duplicates,
        seed,
        fastest: benchmarks[0].name,
        fastestTime: benchmarks[0].time.toFixed(3),
        timestamp: new Date().toISOString(),
        id: Date.now()
      };
      
      setExperiments(prev => [experiment, ...prev].slice(0, 30));
      setResults(benchmarks);
      setRunning(false);
    }, 100);
  }, [arr, n, disorder, duplicates, seed]);
  
  const loadPreset = useCallback((preset) => {
    setN(preset.n);
    setDisorder(preset.disorder);
    setDuplicates(preset.duplicates);
    setShowPresets(false);
  }, []);
  
  const loadExperiment = useCallback((exp) => {
    setN(exp.n);
    setDisorder(exp.disorder);
    setDuplicates(exp.duplicates);
    setSeed(exp.seed);
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
            ⚡ What-If Performance Lab
          </h1>
          <p className="text-lg text-indigo-300">
            Experiment with data characteristics and see which sorting algorithm wins
          </p>
        </motion.div>

        {/* Configuration Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Settings size={24} />
              Data Configuration
            </h2>
            <motion.button
              onClick={() => setShowPresets(!showPresets)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold transition-colors"
            >
              {showPresets ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              {showPresets ? 'Hide' : 'Show'} Presets
            </motion.button>
          </div>
          
          <AnimatePresence>
            {showPresets && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-indigo-900/30 border border-indigo-700 rounded-lg overflow-hidden"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {PRESETS.map((preset, index) => (
                    <motion.button
                      key={preset.key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => loadPreset(preset)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 bg-gradient-to-r ${preset.color} rounded-lg text-white text-xs font-semibold shadow-lg border border-white/20`}
                    >
                      <div className="text-2xl mb-1">{preset.icon}</div>
                      {preset.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Array Size */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-3 flex items-center justify-between">
                <span>Array Size (n)</span>
                <span className="text-xl font-bold text-cyan-400">{n}</span>
              </label>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>10</span>
                <span>2000</span>
              </div>
            </div>

            {/* Disorder */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-3 flex items-center justify-between">
                <span>Disorder Level</span>
                <span className="text-xl font-bold text-cyan-400">{(disorder * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={disorder}
                onChange={(e) => setDisorder(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Sorted</span>
                <span>Random</span>
              </div>
            </div>

            {/* Duplicates */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-3 flex items-center justify-between">
                <span>Duplicate Rate</span>
                <span className="text-xl font-bold text-cyan-400">{(duplicates * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={duplicates}
                onChange={(e) => setDuplicates(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Unique</span>
                <span>Many Dupes</span>
              </div>
            </div>

            {/* Random Seed */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-3 flex items-center justify-between">
                <span>Random Seed</span>
                <span className="text-xl font-bold text-cyan-400">{seed}</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(parseInt(e.target.value, 10) || 1)}
                  className="flex-1 bg-gray-900 border border-indigo-600 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <motion.button
                  onClick={() => setSeed(Math.floor(Math.random() * 10000))}
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <RefreshCw size={18} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recommendation Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 p-6 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-blue-700 rounded-xl shadow-lg"
        >
          <h3 className="font-semibold text-blue-300 mb-3 flex items-center gap-2 text-lg">
            <Lightbulb size={20} />
            AI Recommendation: <span className="text-cyan-400">{recommendation.primary}</span>
          </h3>
          <ul className="text-sm text-blue-200 space-y-2">
            {recommendation.insights.map((insight, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="flex items-start gap-2"
              >
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>{insight}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Run Button */}
        <div className="mb-8 flex justify-center">
          <motion.button
            onClick={runBenchmark}
            disabled={running}
            whileHover={!running ? { scale: 1.05 } : {}}
            whileTap={!running ? { scale: 0.95 } : {}}
            className="px-10 py-4 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-lg shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3"
          >
            {running ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Zap size={24} />
                </motion.div>
                Running Benchmark...
              </>
            ) : (
              <>
                <Play size={24} />
                Run Performance Test
              </>
            )}
          </motion.button>
        </div>

        {/* Results Panel */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Award size={24} className="text-yellow-400" />
                Results (n={n}, disorder={(disorder*100).toFixed(0)}%, dupes={(duplicates*100).toFixed(0)}%)
              </h3>
              
              <div className="space-y-4">
                {results.map((result, idx) => {
                  const maxTime = Math.max(...results.map(r => r.time));
                  const relWidth = (result.time / maxTime) * 100;
                  const isWinner = idx === 0;
                  const medals = ['🥇', '🥈', '🥉'];
                  
                  return (
                    <motion.div
                      key={result.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-5 rounded-xl border-2 transition-all ${
                        isWinner
                          ? 'border-yellow-500 bg-gradient-to-r from-yellow-900/30 to-orange-900/30'
                          : 'border-gray-700 bg-gray-900/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {idx < 3 && <span className="text-3xl">{medals[idx]}</span>}
                          <h4 className="font-bold text-lg text-white">{result.name}</h4>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${isWinner ? 'text-yellow-400' : 'text-cyan-400'}`}>
                            {result.time.toFixed(3)} ms
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                            <BarChart3 size={12} />
                            {result.comparisons.toLocaleString()} comparisons
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden mb-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${relWidth}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            isWinner 
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                              : 'bg-gradient-to-r from-gray-500 to-gray-600'
                          }`}
                        />
                      </div>
                      
                      <div className="flex gap-6 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <TrendingUp size={12} />
                          Swaps: {result.swaps.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          Ratio: {(result.time / results[0].time).toFixed(2)}x
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Experiment History */}
        {experiments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
          >
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-lg">
              <History size={20} />
              Experiment History ({experiments.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {experiments.slice(0, 15).map((exp, idx) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => loadExperiment(exp)}
                  whileHover={{ x: 4, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                  className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-300">
                      <span className="font-semibold text-white">n={exp.n}</span>
                      <span className="text-gray-500 mx-2">·</span>
                      <span>disorder {(exp.disorder * 100).toFixed(0)}%</span>
                      <span className="text-gray-500 mx-2">·</span>
                      <span>dupes {(exp.duplicates * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-full font-semibold flex items-center gap-1">
                        <Award size={12} />
                        {exp.fastest}
                      </span>
                      <span className="text-gray-400">{exp.fastestTime}ms</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WhatIfPerformanceLab;
