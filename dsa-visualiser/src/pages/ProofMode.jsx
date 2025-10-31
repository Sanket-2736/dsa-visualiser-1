import React, { useState, useEffect, useMemo } from 'react'

// ============================================================================
// ALGORITHM LIBRARY - Complete proof scenarios
// ============================================================================

const ALGORITHM_LIBRARY = {
  insertion_sort: {
    name: 'Insertion Sort',
    description: 'Sort an array by maintaining a sorted prefix and inserting elements one by one.',
    difficulty: 'beginner',
    steps: [
      { id: 1, text: 'Initialize loop index i = 1', phase: 'initialization' },
      { id: 2, text: 'Loop invariant: A[0..i-1] is sorted before iteration', phase: 'maintenance' },
      { id: 3, text: 'Insert A[i] into sorted position in A[0..i-1]', phase: 'maintenance' },
      { id: 4, text: 'Increment i and repeat until i = n', phase: 'maintenance' },
      { id: 5, text: 'Termination: When i = n, entire array A[0..n-1] is sorted', phase: 'termination' }
    ],
    invariants: [
      { key: 'inv_prefix_sorted', text: 'A[0..i-1] is sorted', category: 'correctness' },
      { key: 'inv_bounds', text: '1 ≤ i ≤ n', category: 'safety' },
      { key: 'inv_perm', text: 'A is a permutation of original input', category: 'correctness' },
      { key: 'inv_loop_progress', text: 'i increases each iteration', category: 'termination' }
    ],
    correctAssignments: {
      1: ['inv_bounds', 'inv_perm'],
      2: ['inv_prefix_sorted', 'inv_bounds', 'inv_perm'],
      3: ['inv_prefix_sorted', 'inv_perm'],
      4: ['inv_bounds', 'inv_loop_progress'],
      5: ['inv_prefix_sorted', 'inv_perm']
    },
    hints: {
      1: 'Initialization establishes the base case. What must be true when we start?',
      2: 'What properties hold at the start of each loop iteration?',
      3: 'During insertion, which invariants are preserved?',
      4: 'How do we ensure progress toward termination?',
      5: 'At termination, which invariants give us the final result?'
    }
  },
  
  binary_search: {
    name: 'Binary Search',
    description: 'Find target value in sorted array by repeatedly halving search space.',
    difficulty: 'intermediate',
    steps: [
      { id: 1, text: 'Initialize left = 0, right = n - 1', phase: 'initialization' },
      { id: 2, text: 'Loop invariant: If target exists, it is in A[left..right]', phase: 'maintenance' },
      { id: 3, text: 'Compute mid = (left + right) / 2', phase: 'maintenance' },
      { id: 4, text: 'Adjust bounds: if A[mid] < target, left = mid + 1; else right = mid - 1', phase: 'maintenance' },
      { id: 5, text: 'Termination: left > right means target not found', phase: 'termination' }
    ],
    invariants: [
      { key: 'inv_search_space', text: 'Target in A[left..right] if it exists', category: 'correctness' },
      { key: 'inv_bounds', text: '0 ≤ left ≤ right + 1 ≤ n', category: 'safety' },
      { key: 'inv_sorted', text: 'A[0..n-1] remains sorted', category: 'precondition' },
      { key: 'inv_shrinking', text: 'Search space halves each iteration', category: 'termination' }
    ],
    correctAssignments: {
      1: ['inv_bounds', 'inv_sorted', 'inv_search_space'],
      2: ['inv_search_space', 'inv_sorted', 'inv_bounds'],
      3: ['inv_bounds'],
      4: ['inv_search_space', 'inv_shrinking'],
      5: ['inv_search_space', 'inv_bounds']
    },
    hints: {
      1: 'What must be true about the initial search space?',
      2: 'The key invariant: where could the target be?',
      3: 'Computing mid is safe when bounds are valid',
      4: 'How do we maintain the search space invariant while making progress?',
      5: 'What does left > right tell us when the invariant holds?'
    }
  },
  
  merge_sort: {
    name: 'Merge Sort (Divide & Conquer)',
    description: 'Recursively divide array, sort halves, and merge sorted subarrays.',
    difficulty: 'advanced',
    steps: [
      { id: 1, text: 'Base case: If n ≤ 1, array is already sorted', phase: 'initialization' },
      { id: 2, text: 'Divide: Split array into left[0..mid] and right[mid+1..n-1]', phase: 'maintenance' },
      { id: 3, text: 'Recursively sort left and right subarrays', phase: 'maintenance' },
      { id: 4, text: 'Merge two sorted subarrays into final sorted array', phase: 'maintenance' },
      { id: 5, text: 'Termination: Merged result is sorted permutation of input', phase: 'termination' }
    ],
    invariants: [
      { key: 'inv_subarray_sorted', text: 'Recursive calls return sorted subarrays', category: 'correctness' },
      { key: 'inv_perm', text: 'Output is permutation of input', category: 'correctness' },
      { key: 'inv_merge_correct', text: 'Merge preserves sortedness', category: 'correctness' },
      { key: 'inv_divide_valid', text: '0 ≤ mid < n ensures valid split', category: 'safety' }
    ],
    correctAssignments: {
      1: ['inv_perm'],
      2: ['inv_divide_valid', 'inv_perm'],
      3: ['inv_subarray_sorted', 'inv_perm'],
      4: ['inv_merge_correct', 'inv_perm'],
      5: ['inv_subarray_sorted', 'inv_merge_correct', 'inv_perm']
    },
    hints: {
      1: 'What is trivially true for arrays of size ≤ 1?',
      2: 'Division must preserve all elements',
      3: 'Inductive hypothesis: what do recursive calls guarantee?',
      4: 'Merging two sorted arrays produces what?',
      5: 'Combine the guarantees from recursion and merge'
    }
  },
  
  bubble_sort: {
    name: 'Bubble Sort',
    description: 'Repeatedly swap adjacent elements to bubble largest to end.',
    difficulty: 'beginner',
    steps: [
      { id: 1, text: 'Initialize outer loop: for i = 0 to n-1', phase: 'initialization' },
      { id: 2, text: 'Loop invariant: A[n-i..n-1] contains i largest elements, sorted', phase: 'maintenance' },
      { id: 3, text: 'Inner loop: compare adjacent pairs, swap if out of order', phase: 'maintenance' },
      { id: 4, text: 'After inner loop, largest in A[0..n-i-1] is at position n-i-1', phase: 'maintenance' },
      { id: 5, text: 'Termination: After n iterations, entire array is sorted', phase: 'termination' }
    ],
    invariants: [
      { key: 'inv_suffix_sorted', text: 'A[n-i..n-1] is sorted', category: 'correctness' },
      { key: 'inv_suffix_largest', text: 'A[n-i..n-1] contains i largest elements', category: 'correctness' },
      { key: 'inv_perm', text: 'A is permutation of input', category: 'correctness' },
      { key: 'inv_bounds', text: '0 ≤ i ≤ n', category: 'safety' }
    ],
    correctAssignments: {
      1: ['inv_bounds', 'inv_perm'],
      2: ['inv_suffix_sorted', 'inv_suffix_largest', 'inv_perm', 'inv_bounds'],
      3: ['inv_perm'],
      4: ['inv_suffix_largest'],
      5: ['inv_suffix_sorted', 'inv_suffix_largest', 'inv_perm']
    },
    hints: {
      1: 'What is true before the first iteration?',
      2: 'The key invariant: what is true about the suffix?',
      3: 'Swapping preserves what property?',
      4: 'After bubbling, where is the largest element?',
      5: 'When i = n, what does the suffix invariant tell us?'
    }
  }
}

// ============================================================================
// STORAGE UTILITIES - LocalStorage persistence
// ============================================================================

const STORAGE_KEY = 'proof_mode_progress'

function loadProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveProgress(algorithmId, data) {
  try {
    const all = loadProgress()
    all[algorithmId] = {
      ...data,
      lastAttempt: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch (error) {
    console.warn('Failed to save progress:', error)
  }
}

function getAlgorithmProgress(algorithmId) {
  const progress = loadProgress()
  return progress[algorithmId] || { completed: false, attempts: 0, bestScore: 0 }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProofMode() {
  const [selectedAlgo, setSelectedAlgo] = useState('insertion_sort')
  const [assignments, setAssignments] = useState({})
  const [result, setResult] = useState(null)
  const [showHints, setShowHints] = useState(false)
  const [activeHint, setActiveHint] = useState(null)
  const [showSolution, setShowSolution] = useState(false)
  const [attempts, setAttempts] = useState(0)
  
  const algorithm = ALGORITHM_LIBRARY[selectedAlgo]
  
  // Load saved progress on algorithm change
  useEffect(() => {
    const progress = getAlgorithmProgress(selectedAlgo)
    setAssignments({})
    setResult(null)
    setShowHints(false)
    setActiveHint(null)
    setShowSolution(false)
    setAttempts(progress.attempts || 0)
  }, [selectedAlgo])
  
  // Calculate current score
  const score = useMemo(() => {
    let correct = 0
    let total = 0
    
    for (const step of algorithm.steps) {
      const required = new Set(algorithm.correctAssignments[step.id] || [])
      const assigned = new Set(assignments[step.id] || [])
      
      total += required.size
      
      for (const inv of required) {
        if (assigned.has(inv)) correct++
      }
    }
    
    return total > 0 ? Math.round((correct / total) * 100) : 0
  }, [algorithm, assignments])
  
  // Toggle invariant assignment
  function toggleInvariant(stepId, invKey) {
    if (result?.success) return // Lock after success
    
    setAssignments(prev => {
      const current = new Set(prev[stepId] || [])
      if (current.has(invKey)) {
        current.delete(invKey)
      } else {
        current.add(invKey)
      }
      return { ...prev, [stepId]: Array.from(current) }
    })
    setResult(null) // Clear result on change
  }
  
  // Check correctness
  function checkProof() {
    let allCorrect = true
    const stepResults = {}
    
    for (const step of algorithm.steps) {
      const required = new Set(algorithm.correctAssignments[step.id] || [])
      const assigned = new Set(assignments[step.id] || [])
      
      const missing = [...required].filter(k => !assigned.has(k))
      const extra = [...assigned].filter(k => !required.has(k))
      
      stepResults[step.id] = {
        correct: missing.length === 0 && extra.length === 0,
        missing,
        extra
      }
      
      if (!stepResults[step.id].correct) allCorrect = false
    }
    
    const newAttempts = attempts + 1
    setAttempts(newAttempts)
    
    setResult({
      success: allCorrect,
      stepResults,
      score
    })
    
    // Save progress
    if (allCorrect) {
      const progress = getAlgorithmProgress(selectedAlgo)
      saveProgress(selectedAlgo, {
        completed: true,
        attempts: newAttempts,
        bestScore: Math.max(progress.bestScore || 0, score),
        completedAt: new Date().toISOString()
      })
    }
  }
  
  // Reset current algorithm
  function reset() {
    setAssignments({})
    setResult(null)
    setShowHints(false)
    setActiveHint(null)
    setShowSolution(false)
  }
  
  // Show solution
  function revealSolution() {
    setAssignments(algorithm.correctAssignments)
    setShowSolution(true)
    setResult(null)
  }
  
  // Get invariant category badge color
  function getCategoryColor(category) {
    const colors = {
      correctness: 'bg-blue-100 text-blue-700 border-blue-300',
      safety: 'bg-amber-100 text-amber-700 border-amber-300',
      termination: 'bg-purple-100 text-purple-700 border-purple-300',
      precondition: 'bg-green-100 text-green-700 border-green-300'
    }
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-300'
  }
  
  // Get difficulty badge color
  function getDifficultyColor(difficulty) {
    const colors = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-yellow-100 text-yellow-700',
      advanced: 'bg-red-100 text-red-700'
    }
    return colors[difficulty] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
            Interactive Proof Mode
          </h1>
          <p className="text-sm text-slate-600">
            Master algorithm correctness by assigning loop invariants to proof steps
          </p>
        </div>

        {/* Algorithm Selector */}
        <div className="mb-6 p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Select Algorithm</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(ALGORITHM_LIBRARY).map(([id, algo]) => {
              const progress = getAlgorithmProgress(id)
              return (
                <button
                  key={id}
                  onClick={() => setSelectedAlgo(id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedAlgo === id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm font-semibold text-slate-800">{algo.name}</h3>
                    {progress.completed && (
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-label="Completed">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mb-2 line-clamp-2">{algo.description}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(algo.difficulty)}`}>
                    {algo.difficulty}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Steps & Assignments */}
          <div className="lg:col-span-2 space-y-4">
            {/* Progress Header */}
            <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-slate-800">{algorithm.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">Score:</span>
                  <span className={`text-lg font-bold ${score === 100 ? 'text-green-600' : 'text-blue-600'}`}>
                    {score}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-3">{algorithm.description}</p>
              
              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${score}%` }}
                  role="progressbar"
                  aria-valuenow={score}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-label="Proof completion"
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {algorithm.steps.map((step) => {
                const stepResult = result?.stepResults?.[step.id]
                const isCorrect = stepResult?.correct
                const hasError = stepResult && !stepResult.correct
                
                return (
                  <div
                    key={step.id}
                    className={`p-4 border-2 rounded-xl bg-white shadow-sm transition-all ${
                      isCorrect
                        ? 'border-green-300 bg-green-50'
                        : hasError
                        ? 'border-red-300 bg-red-50'
                        : 'border-slate-200'
                    }`}
                  >
                    {/* Step Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                            {step.id}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                            {step.phase}
                          </span>
                        </div>
                        <p className="text-sm text-slate-800 font-medium">{step.text}</p>
                      </div>
                      
                      {/* Hint Button */}
                      <button
                        onClick={() => setActiveHint(activeHint === step.id ? null : step.id)}
                        className="ml-2 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label={`Hint for step ${step.id}`}
                        aria-expanded={activeHint === step.id}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    {/* Hint */}
                    {activeHint === step.id && algorithm.hints[step.id] && (
                      <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800">
                          <strong>Hint:</strong> {algorithm.hints[step.id]}
                        </p>
                      </div>
                    )}

                    {/* Invariant Chips */}
                    <div className="flex flex-wrap gap-2">
                      {algorithm.invariants.map((inv) => {
                        const isAssigned = (assignments[step.id] || []).includes(inv.key)
                        const isRequired = (algorithm.correctAssignments[step.id] || []).includes(inv.key)
                        const showingResult = result !== null
                        
                        let chipStyle = 'bg-white border-slate-300 text-slate-700 hover:border-blue-400'
                        
                        if (isAssigned) {
                          if (showingResult) {
                            chipStyle = isRequired
                              ? 'bg-green-100 border-green-400 text-green-800'
                              : 'bg-red-100 border-red-400 text-red-800'
                          } else {
                            chipStyle = 'bg-blue-100 border-blue-400 text-blue-800'
                          }
                        }
                        
                        return (
                          <button
                            key={inv.key}
                            onClick={() => toggleInvariant(step.id, inv.key)}
                            disabled={result?.success}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition-all ${chipStyle} ${
                              result?.success ? 'cursor-not-allowed opacity-75' : 'hover:shadow-sm active:scale-95'
                            }`}
                            aria-pressed={isAssigned}
                            aria-label={`${inv.text} for step ${step.id}`}
                          >
                            {inv.text}
                          </button>
                        )
                      })}
                    </div>

                    {/* Step Error Feedback */}
                    {hasError && (
                      <div className="mt-3 text-xs space-y-1">
                        {stepResult.missing.length > 0 && (
                          <p className="text-red-700">
                            <strong>Missing:</strong> {stepResult.missing.map(k => algorithm.invariants.find(i => i.key === k)?.text).join(', ')}
                          </p>
                        )}
                        {stepResult.extra.length > 0 && (
                          <p className="text-red-700">
                            <strong>Extra:</strong> {stepResult.extra.map(k => algorithm.invariants.find(i => i.key === k)?.text).join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={checkProof}
                disabled={result?.success}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-95 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
              >
                Check Proof
              </button>
              <button
                onClick={reset}
                className="px-5 py-2.5 rounded-lg border-2 border-slate-300 text-slate-700 font-medium hover:bg-slate-50 active:scale-95 transition-all"
              >
                Reset
              </button>
              <button
                onClick={revealSolution}
                className="px-5 py-2.5 rounded-lg border-2 border-amber-300 text-amber-700 font-medium hover:bg-amber-50 active:scale-95 transition-all"
              >
                Show Solution
              </button>
              <button
                onClick={() => setShowHints(!showHints)}
                className="px-5 py-2.5 rounded-lg border-2 border-purple-300 text-purple-700 font-medium hover:bg-purple-50 active:scale-95 transition-all"
              >
                {showHints ? 'Hide' : 'Show'} All Hints
              </button>
            </div>

            {/* Result Message */}
            {result && (
              <div
                className={`p-4 rounded-xl border-2 ${
                  result.success
                    ? 'bg-green-50 border-green-300'
                    : 'bg-amber-50 border-amber-300'
                }`}
                role="alert"
              >
                <div className="flex items-start gap-3">
                  <svg
                    className={`w-6 h-6 flex-shrink-0 ${
                      result.success ? 'text-green-600' : 'text-amber-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    {result.success ? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    )}
                  </svg>
                  <div className="flex-1">
                    <h3 className={`font-semibold text-sm mb-1 ${result.success ? 'text-green-900' : 'text-amber-900'}`}>
                      {result.success ? '🎉 Proof Complete!' : '⚠️ Proof Incomplete'}
                    </h3>
                    <p className={`text-sm ${result.success ? 'text-green-800' : 'text-amber-800'}`}>
                      {result.success
                        ? `Perfect! You've correctly assigned all invariants. Score: ${result.score}%`
                        : `Some invariants are missing or misplaced. Review the highlighted steps. Score: ${result.score}%`}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">Attempts: {attempts}</p>
                  </div>
                </div>
              </div>
            )}

            {showSolution && (
              <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl" role="alert">
                <p className="text-sm text-amber-900">
                  <strong>Solution revealed.</strong> Study the correct assignments above, then reset to try again.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Reference */}
          <div className="space-y-4">
            {/* Invariants Legend */}
            <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm sticky top-4">
              <h3 className="font-semibold text-slate-800 mb-3">Available Invariants</h3>
              <div className="space-y-2">
                {algorithm.invariants.map((inv) => (
                  <div key={inv.key} className="text-sm">
                    <div className="flex items-start gap-2">
                      <span className={`mt-0.5 px-2 py-0.5 rounded text-xs font-medium border ${getCategoryColor(inv.category)}`}>
                        {inv.category}
                      </span>
                    </div>
                    <p className="text-slate-700 mt-1">{inv.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <h4 className="text-xs font-semibold text-slate-600 mb-2">Category Guide</h4>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li><strong>Correctness:</strong> What must be true for the algorithm to work</li>
                  <li><strong>Safety:</strong> Bounds and preconditions</li>
                  <li><strong>Termination:</strong> Progress toward completion</li>
                  <li><strong>Precondition:</strong> Input requirements</li>
                </ul>
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 border border-blue-200 rounded-xl bg-blue-50 shadow-sm">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Tips</h3>
              <ul className="text-xs text-blue-800 space-y-1.5 list-disc list-inside">
                <li>Each step can require multiple invariants</li>
                <li>Initialization establishes the base case</li>
                <li>Maintenance preserves invariants through iterations</li>
                <li>Termination uses invariants to prove correctness</li>
                <li>Click hint icons (?) for step-specific guidance</li>
              </ul>
            </div>

            {/* All Hints Panel */}
            {showHints && (
              <div className="p-4 border border-purple-200 rounded-xl bg-purple-50 shadow-sm">
                <h3 className="font-semibold text-purple-900 mb-3">All Hints</h3>
                <div className="space-y-2">
                  {algorithm.steps.map((step) => (
                    <div key={step.id} className="text-xs">
                      <p className="font-medium text-purple-800">Step {step.id}:</p>
                      <p className="text-purple-700">{algorithm.hints[step.id]}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
