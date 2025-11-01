import React, { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Eye, EyeOff, Clock, Zap, TrendingUp } from 'lucide-react';

// ============================================================================
// CACHE SIMULATION ENGINE
// ============================================================================

const CACHE_POLICIES = {
  direct_mapped: {
    name: 'Direct Mapped',
    description: 'Each memory block maps to exactly one cache line',
    simulate: (accesses, lines, lineSize) => {
      const cache = new Map();
      let hits = 0, misses = 0;
      const log = [];
      
      for (const addr of accesses) {
        const lineNum = Math.floor(addr / lineSize);
        const cacheIndex = lineNum % lines;
        const tag = Math.floor(lineNum / lines);
        
        const cached = cache.get(cacheIndex);
        const hit = cached !== undefined && cached.tag === tag;
        
        if (hit) {
          hits++;
        } else {
          misses++;
          cache.set(cacheIndex, { tag, data: Array(lineSize).fill(0) });
        }
        
        log.push({
          addr,
          lineNum,
          cacheIndex,
          tag,
          hit,
          action: hit ? 'HIT' : 'MISS',
          evicted: !hit && cached ? cached.tag : null
        });
      }
      
      return { hits, misses, log, finalCache: Array.from(cache.entries()) };
    }
  },
  
  fully_associative: {
    name: 'Fully Associative',
    description: 'Any memory block can go in any cache line (LRU replacement)',
    simulate: (accesses, lines, lineSize) => {
      const cache = [];
      let hits = 0, misses = 0;
      const log = [];
      
      for (const addr of accesses) {
        const lineNum = Math.floor(addr / lineSize);
        const idx = cache.findIndex(entry => entry.lineNum === lineNum);
        
        if (idx !== -1) {
          hits++;
          const entry = cache.splice(idx, 1)[0];
          cache.push(entry);
          log.push({ addr, lineNum, hit: true, action: 'HIT', position: cache.length - 1 });
        } else {
          misses++;
          let evicted = null;
          if (cache.length >= lines) {
            evicted = cache.shift();
          }
          cache.push({ lineNum, data: Array(lineSize).fill(0) });
          log.push({ addr, lineNum, hit: false, action: 'MISS', evicted: evicted?.lineNum, position: cache.length - 1 });
        }
      }
      
      return { hits, misses, log, finalCache: cache };
    }
  },
  
  two_way_set: {
    name: '2-Way Set Associative',
    description: 'Cache divided into sets, each holding 2 lines (LRU per set)',
    simulate: (accesses, lines, lineSize) => {
      const numSets = Math.floor(lines / 2);
      const sets = Array.from({ length: numSets }, () => []);
      let hits = 0, misses = 0;
      const log = [];
      
      for (const addr of accesses) {
        const lineNum = Math.floor(addr / lineSize);
        const setIndex = lineNum % numSets;
        const tag = Math.floor(lineNum / numSets);
        const set = sets[setIndex];
        
        const idx = set.findIndex(entry => entry.tag === tag);
        
        if (idx !== -1) {
          hits++;
          const entry = set.splice(idx, 1)[0];
          set.push(entry);
          log.push({ addr, lineNum, setIndex, tag, hit: true, action: 'HIT' });
        } else {
          misses++;
          let evicted = null;
          if (set.length >= 2) {
            evicted = set.shift();
          }
          set.push({ tag, data: Array(lineSize).fill(0) });
          log.push({ addr, lineNum, setIndex, tag, hit: false, action: 'MISS', evicted: evicted?.tag });
        }
      }
      
      return { hits, misses, log, finalCache: sets };
    }
  }
};

// Generate access pattern
function generateAccesses(pattern, arrayLength, stride) {
  const accesses = [];
  
  switch (pattern) {
    case 'sequential':
      for (let i = 0; i < arrayLength; i += stride) {
        accesses.push(i);
      }
      break;
    case 'reverse':
      for (let i = arrayLength - 1; i >= 0; i -= stride) {
        accesses.push(i);
      }
      break;
    case 'strided':
      for (let i = 0; i < arrayLength; i += stride) {
        accesses.push(i);
      }
      break;
    case 'random':
      const visited = new Set();
      for (let i = 0; i < Math.min(arrayLength, 100); i++) {
        let addr;
        do {
          addr = Math.floor(Math.random() * arrayLength);
        } while (visited.has(addr));
        visited.add(addr);
        accesses.push(addr);
      }
      break;
    case 'hot-cold':
      const hotSize = Math.floor(arrayLength * 0.2);
      for (let i = 0; i < 80; i++) {
        accesses.push(Math.floor(Math.random() * hotSize));
      }
      for (let i = 0; i < 20; i++) {
        accesses.push(Math.floor(Math.random() * arrayLength));
      }
      break;
    default:
      for (let i = 0; i < arrayLength; i += stride) {
        accesses.push(i);
      }
  }
  
  return accesses;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CacheSimulator() {
  const [arrayLength, setArrayLength] = useState(256);
  const [stride, setStride] = useState(1);
  const [cacheLines, setCacheLines] = useState(8);
  const [lineSize, setLineSize] = useState(16);
  const [policy, setPolicy] = useState('direct_mapped');
  const [pattern, setPattern] = useState('sequential');
  const [showLog, setShowLog] = useState(false);
  const [animateAccess, setAnimateAccess] = useState(false);
  
  const accesses = useMemo(
    () => generateAccesses(pattern, arrayLength, stride),
    [pattern, arrayLength, stride]
  );
  
  const simulation = useMemo(() => {
    return CACHE_POLICIES[policy].simulate(accesses, cacheLines, lineSize);
  }, [accesses, cacheLines, lineSize, policy]);
  
  const hitRate = ((simulation.hits / (simulation.hits + simulation.misses)) * 100) || 0;
  
  const reset = () => {
    setArrayLength(256);
    setStride(1);
    setCacheLines(8);
    setLineSize(16);
    setPolicy('direct_mapped');
    setPattern('sequential');
    setShowLog(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Cache Memory Simulator 💾
          </h1>
          <p className="text-lg text-indigo-300">
            Visualize cache behavior with different <span className="font-bold">access patterns</span> and <span className="font-bold">replacement policies</span>
          </p>
        </motion.div>

        {/* Configuration Panel */}
        <motion.div
          className="mb-8 p-6 bg-gray-800/70 backdrop-blur-sm border border-indigo-700 rounded-xl shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-indigo-300">Configuration</h2>
            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center gap-2 transition-colors duration-200"
            >
              <RotateCcw size={18} /> Reset
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Access Pattern */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Access Pattern
              </label>
              <select
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full bg-gray-900 border border-indigo-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="sequential">Sequential (i++)</option>
                <option value="reverse">Reverse (i--)</option>
                <option value="strided">Strided (custom)</option>
                <option value="random">Random</option>
                <option value="hot-cold">Hot-Cold (80/20)</option>
              </select>
            </div>

            {/* Cache Policy */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Cache Policy
              </label>
              <select
                value={policy}
                onChange={(e) => setPolicy(e.target.value)}
                className="w-full bg-gray-900 border border-indigo-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {Object.entries(CACHE_POLICIES).map(([key, pol]) => (
                  <option key={key} value={key}>{pol.name}</option>
                ))}
              </select>
              <p className="text-xs text-indigo-400 mt-1">
                {CACHE_POLICIES[policy].description}
              </p>
            </div>

            {/* Array Length */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Array Length: <span className="text-yellow-300">{arrayLength}</span>
              </label>
              <input
                type="range"
                min="16"
                max="1024"
                step="16"
                value={arrayLength}
                onChange={(e) => setArrayLength(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Stride */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Stride: <span className="text-yellow-300">{stride}</span>
              </label>
              <input
                type="range"
                min="1"
                max="32"
                value={stride}
                onChange={(e) => setStride(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Cache Lines */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Cache Lines: <span className="text-yellow-300">{cacheLines}</span>
              </label>
              <input
                type="range"
                min="2"
                max="64"
                value={cacheLines}
                onChange={(e) => setCacheLines(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Line Size */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Line Size (bytes): <span className="text-yellow-300">{lineSize}</span>
              </label>
              <input
                type="range"
                min="4"
                max="128"
                step="4"
                value={lineSize}
                onChange={(e) => setLineSize(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Results Panel */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-600 rounded-xl shadow-xl"
          >
            <div className="flex items-center gap-3 mb-2">
              <Zap className="text-green-400" size={24} />
              <div className="text-sm text-green-300">Cache Hits</div>
            </div>
            <div className="text-4xl font-bold text-green-400">{simulation.hits}</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 bg-gradient-to-br from-red-900/50 to-red-800/30 border border-red-600 rounded-xl shadow-xl"
          >
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-red-400" size={24} />
              <div className="text-sm text-red-300">Cache Misses</div>
            </div>
            <div className="text-4xl font-bold text-red-400">{simulation.misses}</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-600 rounded-xl shadow-xl"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-blue-400" size={24} />
              <div className="text-sm text-blue-300">Hit Rate</div>
            </div>
            <div className="text-4xl font-bold text-yellow-300">{hitRate.toFixed(1)}%</div>
            <div className="mt-3 w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${hitRate}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full"
              />
            </div>
          </motion.div>
        </div>

        {/* Cache Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8 p-6 bg-gray-800/70 backdrop-blur-sm border border-indigo-700 rounded-xl shadow-xl"
        >
          <h3 className="text-2xl font-semibold text-indigo-300 mb-4 border-b border-indigo-900 pb-2">
            Cache State Visualization
          </h3>
          <div className="grid grid-cols-8 md:grid-cols-16 gap-2">
            {Array.from({ length: cacheLines }).map((_, i) => {
              let filled = false;
              if (policy === 'direct_mapped') {
                filled = simulation.finalCache.some(([idx]) => idx === i);
              } else if (policy === 'fully_associative') {
                filled = i < simulation.finalCache.length;
              } else if (policy === 'two_way_set') {
                const setIdx = Math.floor(i / 2);
                const posInSet = i % 2;
                filled = simulation.finalCache[setIdx]?.[posInSet] !== undefined;
              }
              
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.02 }}
                  className={`h-12 rounded-lg flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                    filled
                      ? 'bg-gradient-to-br from-indigo-600 to-teal-500 border-indigo-400 text-white shadow-lg'
                      : 'bg-gray-900 border-gray-700 text-gray-500'
                  }`}
                  title={`Line ${i}`}
                >
                  {i}
                </motion.div>
              );
            })}
          </div>
          <p className="text-xs text-indigo-400 mt-4 text-center">
            {simulation.finalCache.length > 0 
              ? `${Array.from(new Set(policy === 'direct_mapped' ? simulation.finalCache.map(([idx]) => idx) : policy === 'fully_associative' ? simulation.finalCache.map((_, i) => i) : simulation.finalCache.flatMap((set, i) => set.map((_, j) => i * 2 + j)))).length} of ${cacheLines} cache lines occupied`
              : 'No cache lines occupied'}
          </p>
        </motion.div>

        {/* Access Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-6 bg-gray-800/70 backdrop-blur-sm border border-indigo-700 rounded-xl shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold text-indigo-300">
              Access Log <span className="text-yellow-300">({simulation.log.length} accesses)</span>
            </h3>
            <button
              onClick={() => setShowLog(!showLog)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md flex items-center gap-2 transition-colors duration-200"
            >
              {showLog ? <EyeOff size={18} /> : <Eye size={18} />}
              {showLog ? 'Hide' : 'Show'} Details
            </button>
          </div>
          
          <AnimatePresence>
            {showLog && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="max-h-96 overflow-y-auto space-y-2"
              >
                {simulation.log.map((entry, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.01 }}
                    className={`p-3 rounded-lg text-sm font-mono border ${
                      entry.hit
                        ? 'bg-green-900/30 border-green-600 text-green-300'
                        : 'bg-red-900/30 border-red-600 text-red-300'
                    }`}
                  >
                    <span className="font-bold text-yellow-300">[{idx}]</span> Addr: {entry.addr} →{' '}
                    <span className={`font-bold ${entry.hit ? 'text-green-400' : 'text-red-400'}`}>
                      {entry.action}
                    </span>
                    {entry.evicted !== null && entry.evicted !== undefined && (
                      <span className="text-indigo-300"> (evicted: {entry.evicted})</span>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
