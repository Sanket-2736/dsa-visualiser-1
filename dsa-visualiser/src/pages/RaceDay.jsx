import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'

// ============================================================================
// ARRAY GENERATION
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

function generateArray(n, seed = 7) {
  const arr = Array.from({ length: n }, (_, i) => i + 1)
  const rng = seededRNG(seed)
  
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  
  return arr
}

// ============================================================================
// SORTING STEP GENERATORS
// ============================================================================

function bubbleSortSteps(arr) {
  const a = [...arr]
  const steps = []
  
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      steps.push({ type: 'compare', indices: [j, j + 1] })
      if (a[j] > a[j + 1]) {
        steps.push({ type: 'swap', indices: [j, j + 1] })
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
      }
    }
  }
  
  return { steps, final: a }
}

function insertionSortSteps(arr) {
  const a = [...arr]
  const steps = []
  
  for (let i = 1; i < a.length; i++) {
    const key = a[i]
    let j = i - 1
    steps.push({ type: 'select', indices: [i] })
    
    while (j >= 0 && a[j] > key) {
      steps.push({ type: 'compare', indices: [j, j + 1] })
      steps.push({ type: 'shift', indices: [j, j + 1] })
      a[j + 1] = a[j]
      j--
    }
    
    a[j + 1] = key
    steps.push({ type: 'place', indices: [j + 1] })
  }
  
  return { steps, final: a }
}

function selectionSortSteps(arr) {
  const a = [...arr]
  const steps = []
  
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i
    steps.push({ type: 'select', indices: [i] })
    
    for (let j = i + 1; j < a.length; j++) {
      steps.push({ type: 'compare', indices: [minIdx, j] })
      if (a[j] < a[minIdx]) {
        minIdx = j
      }
    }
    
    if (minIdx !== i) {
      steps.push({ type: 'swap', indices: [i, minIdx] })
      ;[a[i], a[minIdx]] = [a[minIdx], a[i]]
    }
  }
  
  return { steps, final: a }
}

function mergeSortSteps(arr) {
  const steps = []
  
  function merge(a, left, mid, right) {
    const L = a.slice(left, mid + 1)
    const R = a.slice(mid + 1, right + 1)
    let i = 0, j = 0, k = left
    
    while (i < L.length && j < R.length) {
      steps.push({ type: 'compare', indices: [left + i, mid + 1 + j] })
      if (L[i] <= R[j]) {
        a[k] = L[i]
        i++
      } else {
        a[k] = R[j]
        j++
      }
      steps.push({ type: 'merge', indices: [k] })
      k++
    }
    
    while (i < L.length) {
      a[k] = L[i]
      steps.push({ type: 'merge', indices: [k] })
      i++
      k++
    }
    
    while (j < R.length) {
      a[k] = R[j]
      steps.push({ type: 'merge', indices: [k] })
      j++
      k++
    }
  }
  
  function sort(a, left, right) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2)
      sort(a, left, mid)
      sort(a, mid + 1, right)
      merge(a, left, mid, right)
    }
  }
  
  const a = [...arr]
  sort(a, 0, a.length - 1)
  
  return { steps, final: a }
}

function quickSortSteps(arr) {
  const a = [...arr]
  const steps = []
  
  function partition(low, high) {
    const pivot = a[high]
    steps.push({ type: 'pivot', indices: [high] })
    let i = low - 1
    
    for (let j = low; j < high; j++) {
      steps.push({ type: 'compare', indices: [j, high] })
      if (a[j] < pivot) {
        i++
        if (i !== j) {
          steps.push({ type: 'swap', indices: [i, j] })
          ;[a[i], a[j]] = [a[j], a[i]]
        }
      }
    }
    
    steps.push({ type: 'swap', indices: [i + 1, high] })
    ;[a[i + 1], a[high]] = [a[high], a[i + 1]]
    return i + 1
  }
  
  function sort(low, high) {
    if (low < high) {
      const pi = partition(low, high)
      sort(low, pi - 1)
      sort(pi + 1, high)
    }
  }
  
  sort(0, a.length - 1)
  return { steps, final: a }
}

// ============================================================================
// RACE TRACK COMPONENT
// ============================================================================

function RaceTrack({ name, baseArray, sortFunction, speed, onFinish, isRunning }) {
  const [arr, setArr] = useState([...baseArray])
  const [stepIndex, setStepIndex] = useState(0)
  const [activeIndices, setActiveIndices] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const planRef = useRef(null)
  const timerRef = useRef(null)
  
  const plan = useMemo(() => sortFunction(baseArray), [baseArray, sortFunction])
  
  useEffect(() => {
    planRef.current = plan
    setArr([...baseArray])
    setStepIndex(0)
    setActiveIndices([])
    setIsComplete(false)
  }, [baseArray, plan])
  
  useEffect(() => {
    if (!isRunning) {
      clearInterval(timerRef.current)
      return
    }
    
    if (stepIndex >= plan.steps.length) {
      setIsComplete(true)
      setActiveIndices([])
      if (onFinish) onFinish()
      return
    }
    
    timerRef.current = setInterval(() => {
      setStepIndex(prev => {
        const nextIdx = prev + 1
        if (nextIdx >= plan.steps.length) {
          clearInterval(timerRef.current)
          setIsComplete(true)
          setActiveIndices([])
          if (onFinish) onFinish()
          return prev
        }
        
        const step = plan.steps[prev]
        
        setArr(current => {
          const newArr = [...current]
          
          if (step.type === 'swap') {
            const [i, j] = step.indices
            ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
          } else if (step.type === 'shift') {
            const [i, j] = step.indices
            newArr[j] = newArr[i]
          }
          
          return newArr
        })
        
        setActiveIndices(step.indices || [])
        return nextIdx
      })
    }, speed)
    
    return () => clearInterval(timerRef.current)
  }, [isRunning, stepIndex, plan, speed, onFinish])
  
  const progress = plan.steps.length > 0 ? (stepIndex / plan.steps.length) * 100 : 0
  
  return (
    <div className="p-4 border-2 border-slate-200 rounded-xl bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-800">{name}</h3>
          {isComplete && <span className="text-2xl">🏁</span>}
        </div>
        <div className="text-xs text-slate-600">
          Step {stepIndex}/{plan.steps.length}
        </div>
      </div>
      
      <div className="mb-3 w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isComplete ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex items-end gap-0.5 h-32" style={{ minHeight: '128px' }}>
        {arr.map((val, idx) => {
          const maxVal = Math.max(...baseArray)
          const height = (val / maxVal) * 100
          const isActive = activeIndices.includes(idx)
          
          return (
            <div
              key={idx}
              className="flex-1 flex flex-col justify-end"
              style={{ minWidth: '2px' }}
            >
              <div
                className={`transition-all duration-200 rounded-t ${
                  isComplete
                    ? 'bg-green-400'
                    : isActive
                    ? 'bg-yellow-400'
                    : 'bg-blue-400'
                }`}
                style={{
                  height: `${height}%`,
                  transition: 'all 0.2s ease'
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// STORAGE
// ============================================================================

const STORAGE_KEY = 'race_day_history'

function saveRace(data) {
  try {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    history.unshift({ ...data, timestamp: new Date().toISOString(), id: Date.now() })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 20)))
  } catch (e) {
    console.warn('Failed to save race:', e)
  }
}

function getRaceHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function RaceDay() {
  const [n, setN] = useState(20)
  const [seed, setSeed] = useState(7)
  const [speed, setSpeed] = useState(100)
  const [isRacing, setIsRacing] = useState(false)
  const [finishOrder, setFinishOrder] = useState([])
  const [raceHistory, setRaceHistory] = useState(getRaceHistory())
  
  const baseArray = useMemo(() => generateArray(n, seed), [n, seed])
  
  const algorithms = useMemo(() => [
    { name: 'Bubble Sort', fn: bubbleSortSteps, color: 'red' },
    { name: 'Insertion Sort', fn: insertionSortSteps, color: 'blue' },
    { name: 'Selection Sort', fn: selectionSortSteps, color: 'green' },
    { name: 'Merge Sort', fn: mergeSortSteps, color: 'purple' },
    { name: 'Quick Sort', fn: quickSortSteps, color: 'orange' }
  ], [])
  
  const startRace = useCallback(() => {
    setIsRacing(true)
    setFinishOrder([])
  }, [])
  
  const resetRace = useCallback(() => {
    setIsRacing(false)
    setFinishOrder([])
  }, [])
  
  const handleFinish = useCallback((algoName) => {
    setFinishOrder(prev => {
      if (prev.includes(algoName)) return prev
      const newOrder = [...prev, algoName]
      
      // Save race when all algorithms finish
      if (newOrder.length === algorithms.length) {
        saveRace({
          n,
          seed,
          speed,
          winner: newOrder[0],
          finishOrder: newOrder
        })
        setRaceHistory(getRaceHistory())
      }
      
      return newOrder
    })
  }, [algorithms.length, n, seed, speed])
  
  const loadRace = useCallback((race) => {
    setN(race.n)
    setSeed(race.seed)
    setSpeed(race.speed)
    resetRace()
  }, [resetRace])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600">
            🏁 Algorithm Race Day
          </h1>
          <p className="text-sm text-slate-600">
            Watch sorting algorithms compete head-to-head in real-time
          </p>
        </div>

        {/* Control Panel */}
        <div className="mb-6 p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Race Configuration</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Array Size */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Array Size: <span className="font-bold text-green-600">{n}</span>
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value, 10))}
                disabled={isRacing}
                className="w-full disabled:opacity-50"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>5</span>
                <span>50</span>
              </div>
            </div>

            {/* Speed */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Speed: <span className="font-bold text-green-600">{speed}ms</span>
              </label>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
                disabled={isRacing}
                className="w-full disabled:opacity-50"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Fast</span>
                <span>Slow</span>
              </div>
            </div>

            {/* Random Seed */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Random Seed: <span className="font-bold text-green-600">{seed}</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(parseInt(e.target.value, 10) || 1)}
                  disabled={isRacing}
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                />
                <button
                  onClick={() => setSeed(Math.floor(Math.random() * 10000))}
                  disabled={isRacing}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🎲
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={startRace}
              disabled={isRacing}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-95 transition-all"
            >
              🚀 Start Race
            </button>
            <button
              onClick={resetRace}
              className="px-6 py-3 rounded-lg border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 active:scale-95 transition-all"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        {finishOrder.length > 0 && (
          <div className="mb-6 p-5 border border-green-200 rounded-xl bg-green-50 shadow-sm">
            <h3 className="font-semibold text-green-900 mb-3">🏆 Finish Order</h3>
            <div className="space-y-2">
              {finishOrder.map((name, idx) => (
                <div
                  key={name}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200"
                >
                  <span className="text-2xl">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
                  </span>
                  <span className="font-semibold text-slate-800">{name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Race Tracks */}
        <div className="mb-6 space-y-4">
          {algorithms.map((algo) => (
            <RaceTrack
              key={algo.name}
              name={algo.name}
              baseArray={baseArray}
              sortFunction={algo.fn}
              speed={speed}
              onFinish={() => handleFinish(algo.name)}
              isRunning={isRacing}
            />
          ))}
        </div>

        {/* Race History */}
        {raceHistory.length > 0 && (
          <div className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">📊 Race History</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {raceHistory.map((race) => (
                <div
                  key={race.id}
                  className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => loadRace(race)}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">n={race.n}</span>
                      {' · '}
                      <span className="text-slate-600">seed {race.seed}</span>
                      {' · '}
                      <span className="text-slate-600">{race.speed}ms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🥇</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {race.winner}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    {race.finishOrder.join(' → ')}
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
