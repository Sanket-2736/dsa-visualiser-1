import React, { useState, useMemo, useCallback, useEffect } from 'react'

// ============================================================================
// CHALLENGE DATABASE
// ============================================================================

const CHALLENGES = [
  {
    id: 'binary-search-off-by-one',
    name: 'Binary Search (off-by-one)',
    difficulty: 'easy',
    bugType: 'Logic Error',
    description: 'Fix the off-by-one bug in binary search',
    code: `// Fix the off-by-one error
function solve(input) {
  const [arr, target] = input;
  let l = 0, r = arr.length - 1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) l = mid;  // BUG HERE
    else r = mid - 1;
  }
  return -1;
}`,
    tests: [
      { input: [[1, 2, 3, 4, 5], 3], expected: 2 },
      { input: [[1, 2, 3, 4, 5], 1], expected: 0 },
      { input: [[1, 2, 3, 4, 5], 5], expected: 4 },
      { input: [[1, 2, 3, 4, 5], 6], expected: -1 }
    ],
    hint: 'When updating left pointer, should we move past mid?',
    solution: 'Change `l = mid` to `l = mid + 1`',
    category: 'search',
    points: 10
  },
  
  {
    id: 'two-sum-edge-case',
    name: 'Two Sum (same index)',
    difficulty: 'easy',
    bugType: 'Logic Error',
    description: 'Fix the bug that allows using the same index twice',
    code: `// Fix the same-index bug
function solve(input) {
  const [nums, target] = input;
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {  // BUG: missing index check
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    tests: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1] },
      { input: [[1, 5, 3], 6], expected: [0, 2] }
    ],
    hint: 'The code is actually correct! This is a trick question.',
    solution: 'No fix needed - the code correctly handles same value by checking map before adding',
    category: 'array',
    points: 10
  },
  
  {
    id: 'reverse-string-mutation',
    name: 'Reverse String (mutation)',
    difficulty: 'easy',
    bugType: 'Mutation Error',
    description: 'Fix the string reversal that mutates the input',
    code: `// Fix the mutation bug
function solve(s) {
  s = s.split('');
  let left = 0, right = s.length - 1;
  while (left <= right) {  // BUG HERE
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
  return s.join('');
}`,
    tests: [
      { input: 'hello', expected: 'olleh' },
      { input: 'world', expected: 'dlrow' },
      { input: 'a', expected: 'a' },
      { input: 'ab', expected: 'ba' }
    ],
    hint: 'When left === right, we swap the middle element with itself unnecessarily',
    solution: 'Change `left <= right` to `left < right`',
    category: 'string',
    points: 10
  },
  
  {
    id: 'merge-sorted-arrays-boundary',
    name: 'Merge Sorted Arrays (boundary)',
    difficulty: 'medium',
    bugType: 'Index Error',
    description: 'Fix the array merge that misses remaining elements',
    code: `// Fix the boundary bug
function solve(input) {
  const [arr1, arr2] = input;
  const result = [];
  let i = 0, j = 0;
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] < arr2[j]) {
      result.push(arr1[i++]);
    } else {
      result.push(arr2[j++]);
    }
  }
  // BUG: missing remaining elements
  return result;
}`,
    tests: [
      { input: [[1, 3, 5], [2, 4, 6]], expected: [1, 2, 3, 4, 5, 6] },
      { input: [[1], [2]], expected: [1, 2] },
      { input: [[], [1, 2]], expected: [1, 2] },
      { input: [[1, 2], []], expected: [1, 2] }
    ],
    hint: 'What happens to elements in arr1 or arr2 after one array is exhausted?',
    solution: 'Add `return result.concat(arr1.slice(i)).concat(arr2.slice(j))`',
    category: 'array',
    points: 15
  },
  
  {
    id: 'factorial-base-case',
    name: 'Factorial (base case)',
    difficulty: 'easy',
    bugType: 'Recursion Error',
    description: 'Fix the missing base case in factorial',
    code: `// Fix the base case
function solve(n) {
  if (n === 1) return 1;  // BUG: missing n === 0 case
  return n * solve(n - 1);
}`,
    tests: [
      { input: 0, expected: 1 },
      { input: 1, expected: 1 },
      { input: 5, expected: 120 },
      { input: 3, expected: 6 }
    ],
    hint: 'What should factorial of 0 return?',
    solution: 'Change `if (n === 1)` to `if (n <= 1)`',
    category: 'recursion',
    points: 10
  },
  
  {
    id: 'quick-sort-partition',
    name: 'Quick Sort (partition)',
    difficulty: 'hard',
    bugType: 'Logic Error',
    description: 'Fix the partition logic in quicksort',
    code: `// Fix partition bug
function solve(arr) {
  function partition(low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] <= pivot) {  // BUG: should be < for stability
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  }
  function quickSort(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    }
  }
  quickSort(0, arr.length - 1);
  return arr;
}`,
    tests: [
      { input: [3, 1, 4, 1, 5, 9], expected: [1, 1, 3, 4, 5, 9] },
      { input: [5, 2, 8, 1], expected: [1, 2, 5, 8] },
      { input: [1], expected: [1] },
      { input: [2, 1], expected: [1, 2] }
    ],
    hint: 'Using <= vs < affects how equal elements are handled',
    solution: 'Actually no bug - <= is correct for standard partition. Change test expectations or keep as-is.',
    category: 'sorting',
    points: 20
  },
  
  {
    id: 'palindrome-check',
    name: 'Palindrome Check (case)',
    difficulty: 'easy',
    bugType: 'Logic Error',
    description: 'Fix the case-sensitive palindrome check',
    code: `// Fix case sensitivity
function solve(s) {
  s = s.replace(/[^a-zA-Z0-9]/g, '');  // BUG: not lowercased
  let left = 0, right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
    tests: [
      { input: 'A man, a plan, a canal: Panama', expected: true },
      { input: 'race a car', expected: false },
      { input: 'Was it a car or a cat I saw?', expected: true },
      { input: 'Madam', expected: true }
    ],
    hint: 'Should "A" and "a" be considered the same?',
    solution: 'Change to `s = s.toLowerCase().replace(/[^a-z0-9]/g, \'\')`',
    category: 'string',
    points: 10
  },
  
  {
    id: 'max-subarray-initialization',
    name: 'Max Subarray (initialization)',
    difficulty: 'medium',
    bugType: 'Edge Case',
    description: 'Fix the initialization bug in Kadane\'s algorithm',
    code: `// Fix initialization
function solve(nums) {
  let maxSum = 0;  // BUG HERE
  let currentSum = 0;
  for (let num of nums) {
    currentSum = Math.max(num, currentSum + num);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
    tests: [
      { input: [-2, 1, -3, 4, -1, 2, 1, -5, 4], expected: 6 },
      { input: [1], expected: 1 },
      { input: [-1, -2, -3], expected: -1 },
      { input: [5, 4, -1, 7, 8], expected: 23 }
    ],
    hint: 'What if all numbers are negative?',
    solution: 'Initialize `maxSum = nums[0]` and `currentSum = nums[0]`, start loop from index 1',
    category: 'dynamic-programming',
    points: 15
  }
]

// ============================================================================
// STORAGE
// ============================================================================

const STORAGE_KEY = 'debug_bug_progress'

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (e) {
    console.warn('Failed to save progress:', e)
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DebugBug() {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [code, setCode] = useState('')
  const [results, setResults] = useState(null)
  const [progress, setProgress] = useState(getProgress())
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [attempts, setAttempts] = useState(0)
  
  const challenge = CHALLENGES[selectedIdx]
  
  useEffect(() => {
    setCode(challenge.code)
    setResults(null)
    setShowHint(false)
    setShowSolution(false)
    setAttempts(progress[challenge.id]?.attempts || 0)
  }, [selectedIdx, challenge, progress])
  
  const runTests = useCallback(() => {
    setResults(null)
    
    try {
      // Compile user code
      const userFn = eval(`(function(){${code}; return solve})()`)
      
      if (typeof userFn !== 'function') {
        setResults({ error: 'No solve() function found in your code' })
        return
      }
      
      // Run tests
      const verdicts = challenge.tests.map((test, idx) => {
        try {
          const output = userFn(JSON.parse(JSON.stringify(test.input)))
          const ok = JSON.stringify(output) === JSON.stringify(test.expected)
          return { ok, output, expected: test.expected, input: test.input }
        } catch (err) {
          return { ok: false, error: err.message, expected: test.expected, input: test.input }
        }
      })
      
      const allPassed = verdicts.every(v => v.ok)
      const newAttempts = attempts + 1
      
      setResults({ verdicts, allPassed })
      setAttempts(newAttempts)
      
      // Update progress
      if (allPassed) {
        const newProgress = {
          ...progress,
          [challenge.id]: {
            solved: true,
            attempts: newAttempts,
            timestamp: new Date().toISOString(),
            points: challenge.points
          }
        }
        setProgress(newProgress)
        saveProgress(newProgress)
      } else {
        const newProgress = {
          ...progress,
          [challenge.id]: {
            ...progress[challenge.id],
            attempts: newAttempts
          }
        }
        setProgress(newProgress)
        saveProgress(newProgress)
      }
    } catch (err) {
      setResults({ error: 'Compilation Error: ' + err.message })
    }
  }, [code, challenge, attempts, progress])
  
  const totalPoints = useMemo(() => {
    return Object.values(progress).reduce((sum, p) => sum + (p.solved ? (CHALLENGES.find(c => c.id === p.id)?.points || 0) : 0), 0)
  }, [progress])
  
  const solvedCount = useMemo(() => {
    return Object.values(progress).filter(p => p.solved).length
  }, [progress])
  
  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-700 border-green-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      hard: 'bg-red-100 text-red-700 border-red-300'
    }
    return colors[difficulty] || colors.easy
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-600">
            🐛 Debug-the-Bug Challenge
          </h1>
          <p className="text-sm text-slate-600">
            Find and fix the minimal bug to make all tests pass
          </p>
        </div>

        {/* Stats Bar */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border border-green-200 rounded-xl bg-white shadow-sm">
            <div className="text-2xl font-bold text-green-600">{solvedCount}/{CHALLENGES.length}</div>
            <div className="text-xs text-slate-600">Challenges Solved</div>
          </div>
          <div className="p-4 border border-blue-200 rounded-xl bg-white shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{totalPoints}</div>
            <div className="text-xs text-slate-600">Total Points</div>
          </div>
          <div className="p-4 border border-purple-200 rounded-xl bg-white shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{attempts}</div>
            <div className="text-xs text-slate-600">Current Attempts</div>
          </div>
          <div className="p-4 border border-orange-200 rounded-xl bg-white shadow-sm">
            <div className="text-2xl font-bold text-orange-600">
              {progress[challenge.id]?.solved ? '✅' : '❌'}
            </div>
            <div className="text-xs text-slate-600">Current Status</div>
          </div>
        </div>

        {/* Challenge Selector */}
        <div className="mb-6 p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Select Challenge</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CHALLENGES.map((ch, idx) => {
              const isSolved = progress[ch.id]?.solved
              const isSelected = selectedIdx === idx
              
              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedIdx(idx)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-red-500 bg-red-50 shadow-md'
                      : isSolved
                      ? 'border-green-300 bg-green-50'
                      : 'border-slate-200 bg-white hover:border-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-slate-800">{ch.name}</h3>
                    {isSolved && <span className="text-xl">✅</span>}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(ch.difficulty)}`}>
                      {ch.difficulty}
                    </span>
                    <span className="text-xs text-slate-600">{ch.points} pts</span>
                  </div>
                  <p className="text-xs text-slate-600">{ch.bugType}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Challenge Details */}
        <div className="mb-6 p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">{challenge.name}</h2>
              <p className="text-sm text-slate-600 mb-2">{challenge.description}</p>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                  {challenge.bugType}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700">
                  {challenge.category}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-orange-100 text-orange-700">
                  {challenge.points} points
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-3 py-1.5 text-sm border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
              >
                {showHint ? 'Hide' : 'Show'} Hint
              </button>
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="px-3 py-1.5 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
              >
                {showSolution ? 'Hide' : 'Show'} Solution
              </button>
            </div>
          </div>
          
          {showHint && (
            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900">💡 <strong>Hint:</strong> {challenge.hint}</p>
            </div>
          )}
          
          {showSolution && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-900">🔑 <strong>Solution:</strong> {challenge.solution}</p>
            </div>
          )}
        </div>

        {/* Code Editor & Tests Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Code Editor */}
          <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-800">Fix the Code</h3>
              <button
                onClick={() => setCode(challenge.code)}
                className="px-3 py-1.5 text-xs bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
              >
                🔄 Reset
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full min-h-[400px] p-3 border border-slate-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50"
              spellCheck={false}
            />
            <button
              onClick={runTests}
              className="mt-3 w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold hover:from-red-700 hover:to-orange-700 shadow-md active:scale-95 transition-all"
            >
              ▶ Run Tests
            </button>
          </div>

          {/* Test Cases */}
          <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">Test Cases</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {challenge.tests.map((test, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50"
                >
                  <div className="text-xs font-semibold text-slate-700 mb-2">
                    Test #{idx + 1}
                  </div>
                  <div className="text-xs text-slate-600 mb-1">
                    <strong>Input:</strong>{' '}
                    <code className="bg-white px-1 py-0.5 rounded">
                      {JSON.stringify(test.input)}
                    </code>
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong>Expected:</strong>{' '}
                    <code className="bg-white px-1 py-0.5 rounded">
                      {JSON.stringify(test.expected)}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        {results && (
          <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">Test Results</h3>
            
            {results.error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>❌ Error:</strong> {results.error}
                </p>
              </div>
            ) : (
              <>
                {results.allPassed && (
                  <div className="mb-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                    <p className="text-lg font-bold text-green-800">
                      🎉 All tests passed! Challenge solved! (+{challenge.points} points)
                    </p>
                  </div>
                )}
                
                <div className="space-y-3">
                  {results.verdicts.map((verdict, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-2 ${
                        verdict.ok
                          ? 'border-green-400 bg-green-50'
                          : 'border-red-400 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">
                          Test #{idx + 1} — {verdict.ok ? '✅ Passed' : '❌ Failed'}
                        </span>
                      </div>
                      
                      {!verdict.ok && (
                        <div className="mt-2 space-y-1 text-xs">
                          {verdict.error ? (
                            <div className="p-2 bg-red-100 border border-red-200 rounded">
                              <strong className="text-red-800">Error:</strong>
                              <code className="block mt-1 text-red-700">{verdict.error}</code>
                            </div>
                          ) : (
                            <>
                              <div>
                                <strong>Input:</strong>{' '}
                                <code className="bg-white px-1 py-0.5 rounded">
                                  {JSON.stringify(verdict.input)}
                                </code>
                              </div>
                              <div>
                                <strong>Expected:</strong>{' '}
                                <code className="bg-white px-1 py-0.5 rounded">
                                  {JSON.stringify(verdict.expected)}
                                </code>
                              </div>
                              <div>
                                <strong>Got:</strong>{' '}
                                <code className="bg-white px-1 py-0.5 rounded">
                                  {JSON.stringify(verdict.output)}
                                </code>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
