import React, { useMemo, useState, useCallback } from 'react'

// ============================================================================
// CACHE SIMULATION ENGINE
// ============================================================================

const CACHE_POLICIES = {
  direct_mapped: {
    name: 'Direct Mapped',
    description: 'Each memory block maps to exactly one cache line',
    simulate: (accesses, lines, lineSize) => {
      const cache = new Map()
      let hits = 0, misses = 0
      const log = []
      
      for (const addr of accesses) {
        const lineNum = Math.floor(addr / lineSize)
        const cacheIndex = lineNum % lines
        const tag = Math.floor(lineNum / lines)
        
        const cached = cache.get(cacheIndex)
        const hit = cached !== undefined && cached.tag === tag
        
        if (hit) {
          hits++
        } else {
          misses++
          cache.set(cacheIndex, { tag, data: Array(lineSize).fill(0) })
        }
        
        log.push({
          addr,
          lineNum,
          cacheIndex,
          tag,
          hit,
          action: hit ? 'HIT' : 'MISS',
          evicted: !hit && cached ? cached.tag : null
        })
      }
      
      return { hits, misses, log, finalCache: Array.from(cache.entries()) }
    }
  },
  
  fully_associative: {
    name: 'Fully Associative',
    description: 'Any memory block can go in any cache line (LRU replacement)',
    simulate: (accesses, lines, lineSize) => {
      const cache = []
      let hits = 0, misses = 0
      const log = []
      
      for (const addr of accesses) {
        const lineNum = Math.floor(addr / lineSize)
        const idx = cache.findIndex(entry => entry.lineNum === lineNum)
        
        if (idx !== -1) {
          hits++
          const entry = cache.splice(idx, 1)[0]
          cache.push(entry) // Move to end (MRU)
          log.push({ addr, lineNum, hit: true, action: 'HIT', position: cache.length - 1 })
        } else {
          misses++
          let evicted = null
          if (cache.length >= lines) {
            evicted = cache.shift() // Remove LRU
          }
          cache.push({ lineNum, data: Array(lineSize).fill(0) })
          log.push({ addr, lineNum, hit: false, action: 'MISS', evicted: evicted?.lineNum, position: cache.length - 1 })
        }
      }
      
      return { hits, misses, log, finalCache: cache }
    }
  },
  
  two_way_set: {
    name: '2-Way Set Associative',
    description: 'Cache divided into sets, each holding 2 lines (LRU per set)',
    simulate: (accesses, lines, lineSize) => {
      const numSets = Math.floor(lines / 2)
      const sets = Array.from({ length: numSets }, () => [])
      let hits = 0, misses = 0
      const log = []
      
      for (const addr of accesses) {
        const lineNum = Math.floor(addr / lineSize)
        const setIndex = lineNum % numSets
        const tag = Math.floor(lineNum / numSets)
        const set = sets[setIndex]
        
        const idx = set.findIndex(entry => entry.tag === tag)
        
        if (idx !== -1) {
          hits++
          const entry = set.splice(idx, 1)[0]
          set.push(entry) // MRU
          log.push({ addr, lineNum, setIndex, tag, hit: true, action: 'HIT' })
        } else {
          misses++
          let evicted = null
          if (set.length >= 2) {
            evicted = set.shift() // LRU
          }
          set.push({ tag, data: Array(lineSize).fill(0) })
          log.push({ addr, lineNum, setIndex, tag, hit: false, action: 'MISS', evicted: evicted?.tag })
        }
      }
      
      return { hits, misses, log, finalCache: sets }
    }
  }
}

// Generate access pattern
function generateAccesses(pattern, arrayLength, stride) {
  const accesses = []
  
  switch (pattern) {
    case 'sequential':
      for (let i = 0; i < arrayLength; i += stride) {
        accesses.push(i)
      }
      break
    case 'reverse':
      for (let i = arrayLength - 1; i >= 0; i -= stride) {
        accesses.push(i)
      }
      break
    case 'strided':
      for (let i = 0; i < arrayLength; i += stride) {
        accesses.push(i)
      }
      break
    case 'random':
      const visited = new Set()
      for (let i = 0; i < Math.min(arrayLength, 100); i++) {
        let addr
        do {
          addr = Math.floor(Math.random() * arrayLength)
        } while (visited.has(addr))
        visited.add(addr)
        accesses.push(addr)
      }
      break
    case 'hot-cold':
      // 80% accesses to first 20%
      const hotSize = Math.floor(arrayLength * 0.2)
      for (let i = 0; i < 80; i++) {
        accesses.push(Math.floor(Math.random() * hotSize))
      }
      for (let i = 0; i < 20; i++) {
        accesses.push(Math.floor(Math.random() * arrayLength))
      }
      break
    default:
      for (let i = 0; i < arrayLength; i += stride) {
        accesses.push(i)
      }
  }
  
  return accesses
}

// ============================================================================
// STORAGE
// ============================================================================

const STORAGE_KEY = 'cache_sim_history'

function saveHistory(entry) {
  try {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    history.unshift({ ...entry, timestamp: new Date().toISOString(), id: Date.now() })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 20)))
  } catch (e) {
    console.warn('Failed to save history:', e)
  }
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CacheSim() {
  const [arrayLength, setArrayLength] = useState(256)
  const [stride, setStride] = useState(1)
  const [cacheLines, setCacheLines] = useState(8)
  const [lineSize, setLineSize] = useState(16)
  const [policy, setPolicy] = useState('direct_mapped')
  const [pattern, setPattern] = useState('sequential')
  const [showLog, setShowLog] = useState(false)
  const [history, setHistory] = useState(getHistory())
  
  const accesses = useMemo(
    () => generateAccesses(pattern, arrayLength, stride),
    [pattern, arrayLength, stride]
  )
  
  const simulation = useMemo(() => {
    const sim = CACHE_POLICIES[policy].simulate(accesses, cacheLines, lineSize)
    
    // Auto-save
    saveHistory({
      policy,
      pattern,
      arrayLength,
      stride,
      cacheLines,
      lineSize,
      hits: sim.hits,
      misses: sim.misses,
      hitRate: ((sim.hits / (sim.hits + sim.misses)) * 100).toFixed(1)
    })
    
    return sim
  }, [accesses, cacheLines, lineSize, policy, pattern, arrayLength, stride])
  
  const hitRate = ((simulation.hits / (simulation.hits + simulation.misses)) * 100) || 0
  
  const loadHistoryEntry = useCallback((entry) => {
    setPolicy(entry.policy)
    setPattern(entry.pattern)
    setArrayLength(entry.arrayLength)
    setStride(entry.stride)
    setCacheLines(entry.cacheLines)
    setLineSize(entry.lineSize)
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            Memory & Cache Simulator
          </h1>
          <p className="text-sm text-slate-600">
            Visualize cache behavior with different access patterns and replacement policies
          </p>
        </div>

        {/* Configuration Panel */}
        <div className="mb-6 p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Configuration</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Access Pattern */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Access Pattern
              </label>
              <select
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cache Policy
              </label>
              <select
                value={policy}
                onChange={(e) => setPolicy(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Object.entries(CACHE_POLICIES).map(([key, pol]) => (
                  <option key={key} value={key}>{pol.name}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                {CACHE_POLICIES[policy].description}
              </p>
            </div>

            {/* Array Length */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Array Length: {arrayLength}
              </label>
              <input
                type="range"
                min="16"
                max="1024"
                step="16"
                value={arrayLength}
                onChange={(e) => setArrayLength(parseInt(e.target.value, 10))}
                className="w-full"
              />
            </div>

            {/* Stride */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Stride: {stride}
              </label>
              <input
                type="range"
                min="1"
                max="32"
                value={stride}
                onChange={(e) => setStride(parseInt(e.target.value, 10))}
                className="w-full"
              />
            </div>

            {/* Cache Lines */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cache Lines: {cacheLines}
              </label>
              <input
                type="range"
                min="2"
                max="64"
                value={cacheLines}
                onChange={(e) => setCacheLines(parseInt(e.target.value, 10))}
                className="w-full"
              />
            </div>

            {/* Line Size */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Line Size (bytes): {lineSize}
              </label>
              <input
                type="range"
                min="4"
                max="128"
                step="4"
                value={lineSize}
                onChange={(e) => setLineSize(parseInt(e.target.value, 10))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="p-5 border border-green-200 rounded-xl bg-green-50 shadow-sm">
            <div className="text-sm text-green-700 mb-1">Cache Hits</div>
            <div className="text-3xl font-bold text-green-800">{simulation.hits}</div>
          </div>
          
          <div className="p-5 border border-red-200 rounded-xl bg-red-50 shadow-sm">
            <div className="text-sm text-red-700 mb-1">Cache Misses</div>
            <div className="text-3xl font-bold text-red-800">{simulation.misses}</div>
          </div>
          
          <div className="p-5 border border-blue-200 rounded-xl bg-blue-50 shadow-sm">
            <div className="text-sm text-blue-700 mb-1">Hit Rate</div>
            <div className="text-3xl font-bold text-blue-800">{hitRate.toFixed(1)}%</div>
            <div className="mt-2 w-full h-2 bg-blue-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${hitRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cache Visualization */}
        <div className="mb-6 p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">Cache State</h3>
          <div className="grid grid-cols-8 md:grid-cols-16 gap-1">
            {Array.from({ length: cacheLines }).map((_, i) => {
              let filled = false
              if (policy === 'direct_mapped') {
                filled = simulation.finalCache.some(([idx]) => idx === i)
              } else if (policy === 'fully_associative') {
                filled = i < simulation.finalCache.length
              } else if (policy === 'two_way_set') {
                const setIdx = Math.floor(i / 2)
                const posInSet = i % 2
                filled = simulation.finalCache[setIdx]?.[posInSet] !== undefined
              }
              
              return (
                <div
                  key={i}
                  className={`h-8 rounded flex items-center justify-center text-xs font-medium ${
                    filled
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                  title={`Line ${i}`}
                >
                  {i}
                </div>
              )
            })}
          </div>
        </div>

        {/* Access Log */}
        <div className="mb-6 p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Access Log ({simulation.log.length} accesses)</h3>
            <button
              onClick={() => setShowLog(!showLog)}
              className="px-3 py-1.5 text-sm bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
            >
              {showLog ? 'Hide' : 'Show'} Details
            </button>
          </div>
          
          {showLog && (
            <div className="max-h-96 overflow-y-auto space-y-1">
              {simulation.log.map((entry, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded text-xs font-mono ${
                    entry.hit
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <span className="font-bold">[{idx}]</span> Addr: {entry.addr} →{' '}
                  <span className={entry.hit ? 'text-green-700' : 'text-red-700'}>
                    {entry.action}
                  </span>
                  {entry.evicted !== null && entry.evicted !== undefined && (
                    <span className="text-slate-600"> (evicted: {entry.evicted})</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* History Panel */}
        {history.length > 0 && (
          <div className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">Recent Simulations</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => loadHistoryEntry(entry)}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">{CACHE_POLICIES[entry.policy].name}</span>
                      {' · '}
                      <span className="text-slate-600">{entry.pattern}</span>
                      {' · '}
                      <span className="text-slate-600">
                        {entry.arrayLength} elem, stride {entry.stride}
                      </span>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                      parseFloat(entry.hitRate) > 80
                        ? 'bg-green-100 text-green-700'
                        : parseFloat(entry.hitRate) > 50
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {entry.hitRate}% hit
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
