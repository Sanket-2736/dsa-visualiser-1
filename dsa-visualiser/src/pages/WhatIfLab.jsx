import React, { useMemo, useState, useCallback, useEffect } from 'react'

// ============================================================================
// DATA GENERATION ENGINE
// ============================================================================

function seededRNG(seed) {
  let state = seed
  return () => {
    state ^= state << 13
    state ^= state >> 17
    state ^= state << 5
    return ((state >>> 0) / 4294967296)
  }
}

function generateArray(n, disorder = 0.5, duplicates = 0.0, seed = 5) {
  const rng = seededRNG(seed)
  const arr = Array.from({ length: n }, (_, i) => i)
  
  // Introduce duplicates
  if (duplicates > 0) {
    const dupeCount = Math.floor(n * duplicates)
    for (let i = 0; i < dupeCount; i++) {
      const srcIdx = Math.floor(rng() * n)
      const dstIdx = Math.floor(rng() * n)
      arr[dstIdx] = arr[srcIdx]
    }
  }
  
  // Introduce disorder (shuffle)
  const swaps = Math.floor(n * disorder)
  for (let i = 0; i < swaps; i++) {
    const a = Math.floor(rng() * n)
    const b = Math.floor(rng() * n)
    ;[arr[a], arr[b]] = [arr[b], arr[a]]
  }
  
  return arr
}

// ============================================================================
// SORTING ALGORITHMS WITH INSTRUMENTATION
// ============================================================================

function bubbleSort(arr) {
  const a = [...arr]
  let comparisons = 0, swaps = 0
  const start = performance.now()
  
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      comparisons++
      if (a[j] > a[j + 1]) {
        swaps++
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
      }
    }
  }
  
  const time = performance.now() - start
  return { sorted: a, time, comparisons, swaps, name: 'Bubble Sort' }
}

function insertionSort(arr) {
  const a = [...arr]
  let comparisons = 0, swaps = 0
  const start = performance.now()
  
  for (let i = 1; i < a.length; i++) {
    const key = a[i]
    let j = i - 1
    while (j >= 0) {
      comparisons++
      if (a[j] <= key) break
      a[j + 1] = a[j]
      swaps++
      j--
    }
    a[j + 1] = key
  }
  
  const time = performance.now() - start
  return { sorted: a, time, comparisons, swaps, name: 'Insertion Sort' }
}

function mergeSort(arr) {
  let comparisons = 0, merges = 0
  const start = performance.now()
  
  function merge(left, right) {
    const result = []
    let i = 0, j = 0
    
    while (i < left.length && j < right.length) {
      comparisons++
      if (left[i] <= right[j]) {
        result.push(left[i++])
      } else {
        result.push(right[j++])
      }
      merges++
    }
    
    return result.concat(left.slice(i)).concat(right.slice(j))
  }
  
  function sort(a) {
    if (a.length <= 1) return a
    const mid = Math.floor(a.length / 2)
    const left = sort(a.slice(0, mid))
    const right = sort(a.slice(mid))
    return merge(left, right)
  }
  
  const sorted = sort([...arr])
  const time = performance.now() - start
  
  return { sorted, time, comparisons, swaps: merges, name: 'Merge Sort' }
}

function quickSort(arr) {
  let comparisons = 0, swaps = 0
  const start = performance.now()
  
  function partition(a, low, high) {
    const pivot = a[high]
    let i = low - 1
    
    for (let j = low; j < high; j++) {
      comparisons++
      if (a[j] < pivot) {
        i++
        swaps++
        ;[a[i], a[j]] = [a[j], a[i]]
      }
    }
    swaps++
    ;[a[i + 1], a[high]] = [a[high], a[i + 1]]
    return i + 1
  }
  
  function sort(a, low, high) {
    if (low < high) {
      const pi = partition(a, low, high)
      sort(a, low, pi - 1)
      sort(a, pi + 1, high)
    }
  }
  
  const a = [...arr]
  sort(a, 0, a.length - 1)
  const time = performance.now() - start
  
  return { sorted: a, time, comparisons, swaps, name: 'Quick Sort' }
}

function heapSort(arr) {
  let comparisons = 0, swaps = 0
  const start = performance.now()
  
  function heapify(a, n, i) {
    let largest = i
    const left = 2 * i + 1
    const right = 2 * i + 2
    
    if (left < n) {
      comparisons++
      if (a[left] > a[largest]) largest = left
    }
    
    if (right < n) {
      comparisons++
      if (a[right] > a[largest]) largest = right
    }
    
    if (largest !== i) {
      swaps++
      ;[a[i], a[largest]] = [a[largest], a[i]]
      heapify(a, n, largest)
    }
  }
  
  const a = [...arr]
  const n = a.length
  
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(a, n, i)
  }
  
  for (let i = n - 1; i > 0; i--) {
    swaps++
    ;[a[0], a[i]] = [a[i], a[0]]
    heapify(a, i, 0)
  }
  
  const time = performance.now() - start
  return { sorted: a, time, comparisons, swaps, name: 'Heap Sort' }
}

function selectionSort(arr) {
  const a = [...arr]
  let comparisons = 0, swaps = 0
  const start = performance.now()
  
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i
    for (let j = i + 1; j < a.length; j++) {
      comparisons++
      if (a[j] < a[minIdx]) minIdx = j
    }
    if (minIdx !== i) {
      swaps++
      ;[a[i], a[minIdx]] = [a[minIdx], a[i]]
    }
  }
  
  const time = performance.now() - start
  return { sorted: a, time, comparisons, swaps, name: 'Selection Sort' }
}

// ============================================================================
// RECOMMENDATION ENGINE
// ============================================================================

function recommendAlgorithm(n, disorder, duplicates) {
  const insights = []
  let primary = null
  
  if (n < 10) {
    primary = 'Insertion Sort'
    insights.push('Small input: simple O(n²) algorithms are fine')
  } else if (n < 50 && disorder < 0.3) {
    primary = 'Insertion Sort'
    insights.push('Nearly sorted: Insertion Sort is O(n) in best case')
  } else if (disorder < 0.2) {
    primary = 'Insertion Sort or Tim Sort'
    insights.push('Low disorder: adaptive algorithms excel')
  } else if (duplicates > 0.3) {
    primary = 'Merge Sort'
    insights.push('Many duplicates: stable sort preserves order')
  } else if (n > 100 && disorder > 0.7) {
    primary = 'Quick Sort or Merge Sort'
    insights.push('Large random input: divide-and-conquer shines')
  } else if (disorder > 0.8) {
    primary = 'Quick Sort (randomized pivot)'
    insights.push('High disorder: Quick Sort averages O(n log n)')
  } else {
    primary = 'Merge Sort'
    insights.push('General case: Merge Sort guarantees O(n log n)')
  }
  
  // Memory consideration
  if (n > 1000) {
    insights.push('Large n: consider in-place (Quick/Heap) vs. auxiliary space (Merge)')
  }
  
  // Stability
  if (duplicates > 0.2) {
    insights.push('Duplicates present: prefer stable sorts (Merge, Insertion)')
  }
  
  return { primary, insights }
}

// ============================================================================
// STORAGE
// ============================================================================

const STORAGE_KEY = 'whatif_experiments'

function saveExperiment(data) {
  try {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    history.unshift({ ...data, timestamp: new Date().toISOString(), id: Date.now() })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 30)))
  } catch (e) {
    console.warn('Failed to save experiment:', e)
  }
}

function getExperiments() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function WhatIfLab() {
  const [n, setN] = useState(100)
  const [disorder, setDisorder] = useState(0.5)
  const [duplicates, setDuplicates] = useState(0.1)
  const [seed, setSeed] = useState(42)
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState(null)
  const [experiments, setExperiments] = useState(getExperiments())
  const [showPresets, setShowPresets] = useState(false)
  
  const arr = useMemo(
    () => generateArray(n, disorder, duplicates, seed),
    [n, disorder, duplicates, seed]
  )
  
  const recommendation = useMemo(
    () => recommendAlgorithm(n, disorder, duplicates),
    [n, disorder, duplicates]
  )
  
  const runBenchmark = useCallback(() => {
    setRunning(true)
    setResults(null)
    
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const algorithms = [
        bubbleSort,
        insertionSort,
        selectionSort,
        mergeSort,
        quickSort,
        heapSort
      ]
      
      const benchmarks = algorithms.map(algo => {
        try {
          return algo(arr)
        } catch (e) {
          return {
            name: algo.name,
            time: Infinity,
            comparisons: 0,
            swaps: 0,
            error: e.message
          }
        }
      })
      
      benchmarks.sort((a, b) => a.time - b.time)
      
      const experiment = {
        n,
        disorder,
        duplicates,
        seed,
        fastest: benchmarks[0].name,
        fastestTime: benchmarks[0].time.toFixed(3),
        benchmarks: benchmarks.map(b => ({
          name: b.name,
          time: b.time.toFixed(3),
          comparisons: b.comparisons,
          swaps: b.swaps
        }))
      }
      
      saveExperiment(experiment)
      setExperiments(getExperiments())
      setResults(benchmarks)
      setRunning(false)
    }, 100)
  }, [arr, n, disorder, duplicates, seed])
  
  const loadPreset = useCallback((preset) => {
    switch (preset) {
      case 'nearly-sorted':
        setN(200)
        setDisorder(0.1)
        setDuplicates(0.05)
        break
      case 'random':
        setN(300)
        setDisorder(0.9)
        setDuplicates(0.1)
        break
      case 'reverse':
        setN(250)
        setDisorder(1.0)
        setDuplicates(0)
        break
      case 'many-dupes':
        setN(150)
        setDisorder(0.5)
        setDuplicates(0.6)
        break
      case 'small':
        setN(20)
        setDisorder(0.5)
        setDuplicates(0.1)
        break
      case 'large':
        setN(1000)
        setDisorder(0.7)
        setDuplicates(0.2)
        break
      default:
        break
    }
    setShowPresets(false)
  }, [])
  
  const loadExperiment = useCallback((exp) => {
    setN(exp.n)
    setDisorder(exp.disorder)
    setDuplicates(exp.duplicates)
    setSeed(exp.seed)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600">
            What-If Performance Lab
          </h1>
          <p className="text-sm text-slate-600">
            Experiment with data characteristics and see which sorting algorithm wins
          </p>
        </div>

        {/* Configuration Panel */}
        <div className="mb-6 p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Data Configuration</h2>
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="px-4 py-2 text-sm border-2 border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
            >
              📋 {showPresets ? 'Hide' : 'Show'} Presets
            </button>
          </div>
          
          {showPresets && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {[
                  { key: 'nearly-sorted', label: 'Nearly Sorted', icon: '📊' },
                  { key: 'random', label: 'Random', icon: '🎲' },
                  { key: 'reverse', label: 'Reverse', icon: '🔄' },
                  { key: 'many-dupes', label: 'Many Dupes', icon: '👥' },
                  { key: 'small', label: 'Small (n=20)', icon: '🔬' },
                  { key: 'large', label: 'Large (n=1K)', icon: '🏗️' }
                ].map(preset => (
                  <button
                    key={preset.key}
                    onClick={() => loadPreset(preset.key)}
                    className="px-3 py-2 text-xs border border-amber-300 rounded-lg hover:bg-white transition-colors"
                  >
                    {preset.icon} {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Array Size */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Array Size (n): <span className="font-bold text-amber-600">{n}</span>
              </label>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value, 10))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>10</span>
                <span>2000</span>
              </div>
            </div>

            {/* Disorder */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Disorder Level: <span className="font-bold text-amber-600">{(disorder * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={disorder}
                onChange={(e) => setDisorder(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Sorted</span>
                <span>Random</span>
              </div>
            </div>

            {/* Duplicates */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Duplicate Rate: <span className="font-bold text-amber-600">{(duplicates * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={duplicates}
                onChange={(e) => setDuplicates(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Unique</span>
                <span>Many Dupes</span>
              </div>
            </div>

            {/* Random Seed */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Random Seed: <span className="font-bold text-amber-600">{seed}</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(parseInt(e.target.value, 10) || 1)}
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={() => setSeed(Math.floor(Math.random() * 10000))}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-sm transition-colors"
                >
                  🎲
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation Panel */}
        <div className="mb-6 p-5 border border-blue-200 rounded-xl bg-blue-50 shadow-sm">
          <h3 className="font-semibold text-blue-900 mb-2">
            💡 AI Recommendation: <span className="text-blue-700">{recommendation.primary}</span>
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            {recommendation.insights.map((insight, idx) => (
              <li key={idx}>{insight}</li>
            ))}
          </ul>
        </div>

        {/* Run Button */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={runBenchmark}
            disabled={running}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold text-lg hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95 transition-all"
          >
            {running ? (
              <span className="flex items-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Running Benchmark...
              </span>
            ) : (
              '🚀 Run Performance Test'
            )}
          </button>
        </div>

        {/* Results Panel */}
        {results && (
          <div className="mb-6 p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              🏆 Results (n={n}, disorder={(disorder*100).toFixed(0)}%, dupes={(duplicates*100).toFixed(0)}%)
            </h3>
            
            <div className="space-y-3">
              {results.map((result, idx) => {
                const maxTime = Math.max(...results.map(r => r.time))
                const relWidth = (result.time / maxTime) * 100
                const isWinner = idx === 0
                
                return (
                  <div
                    key={result.name}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      isWinner
                        ? 'border-amber-400 bg-amber-50'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {isWinner && <span className="text-2xl">🥇</span>}
                        <h4 className="font-semibold text-slate-800">{result.name}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-amber-600">
                          {result.time.toFixed(3)} ms
                        </div>
                        <div className="text-xs text-slate-600">
                          {result.comparisons.toLocaleString()} comparisons
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isWinner ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${relWidth}%` }}
                      />
                    </div>
                    
                    <div className="mt-2 flex gap-4 text-xs text-slate-600">
                      <span>Swaps: {result.swaps.toLocaleString()}</span>
                      <span>Ratio: {(result.time / results[0].time).toFixed(2)}x</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Experiment History */}
        {experiments.length > 0 && (
          <div className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">📊 Experiment History</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {experiments.slice(0, 15).map((exp) => (
                <div
                  key={exp.id}
                  className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => loadExperiment(exp)}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">n={exp.n}</span>
                      {' · '}
                      <span className="text-slate-600">
                        disorder {(exp.disorder * 100).toFixed(0)}%
                      </span>
                      {' · '}
                      <span className="text-slate-600">
                        dupes {(exp.duplicates * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-xs">
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
                        🏆 {exp.fastest}
                      </span>
                      <span className="ml-2 text-slate-600">{exp.fastestTime}ms</span>
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
