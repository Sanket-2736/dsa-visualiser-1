import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// ============================================================================
// PROBLEM LIBRARY - Complete DSA problem set with tests
// ============================================================================

const PROBLEM_LIBRARY = {
  'two-sum': {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'easy',
    description: 'Given an array of integers nums and an integer target, return indices of two numbers that add up to target.',
    signature: 'solve([nums, target])',
    template: `function solve(input) {
  const [nums, target] = input;
  // Your code here
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
    tests: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], hidden: false },
      { input: [[3, 2, 4], 6], expected: [1, 2], hidden: false },
      { input: [[3, 3], 6], expected: [0, 1], hidden: true },
      { input: [[1, 5, 3, 7, 9], 12], expected: [2, 4], hidden: true }
    ],
    hints: ['Use a hash map to store seen values', 'Check if complement exists before adding current number'],
    timeLimit: 1000,
    tags: ['array', 'hash-table']
  },
  
  'reverse-string': {
    id: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'easy',
    description: 'Write a function that reverses a string. The input string is given as a string.',
    signature: 'solve(s)',
    template: `function solve(s) {
  // Your code here
  return s.split('').reverse().join('');
}`,
    tests: [
      { input: 'hello', expected: 'olleh', hidden: false },
      { input: 'racecar', expected: 'racecar', hidden: false },
      { input: 'a', expected: 'a', hidden: true },
      { input: '', expected: '', hidden: true }
    ],
    hints: ['Use built-in array methods', 'Or implement with two pointers'],
    timeLimit: 500,
    tags: ['string', 'two-pointers']
  },
  
  'valid-parentheses': {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    description: 'Given a string containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    signature: 'solve(s)',
    template: `function solve(s) {
  // Your code here
  const stack = [];
  const pairs = { '(': ')', '{': '}', '[': ']' };
  for (const char of s) {
    if (pairs[char]) {
      stack.push(char);
    } else {
      const top = stack.pop();
      if (pairs[top] !== char) return false;
    }
  }
  return stack.length === 0;
}`,
    tests: [
      { input: '()', expected: true, hidden: false },
      { input: '()[]{}', expected: true, hidden: false },
      { input: '(]', expected: false, hidden: false },
      { input: '([)]', expected: false, hidden: true },
      { input: '{[]}', expected: true, hidden: true }
    ],
    hints: ['Use a stack to track opening brackets', 'Match each closing bracket with the most recent opening'],
    timeLimit: 1000,
    tags: ['string', 'stack']
  },
  
  'merge-sorted-arrays': {
    id: 'merge-sorted-arrays',
    title: 'Merge Two Sorted Arrays',
    difficulty: 'easy',
    description: 'Merge two sorted arrays into one sorted array.',
    signature: 'solve([arr1, arr2])',
    template: `function solve(input) {
  const [arr1, arr2] = input;
  // Your code here
  const result = [];
  let i = 0, j = 0;
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] < arr2[j]) {
      result.push(arr1[i++]);
    } else {
      result.push(arr2[j++]);
    }
  }
  return result.concat(arr1.slice(i)).concat(arr2.slice(j));
}`,
    tests: [
      { input: [[1, 3, 5], [2, 4, 6]], expected: [1, 2, 3, 4, 5, 6], hidden: false },
      { input: [[1], [2]], expected: [1, 2], hidden: false },
      { input: [[], [1]], expected: [1], hidden: true },
      { input: [[1, 2, 3], []], expected: [1, 2, 3], hidden: true }
    ],
    hints: ['Use two pointers for each array', 'Don\'t forget remaining elements'],
    timeLimit: 1000,
    tags: ['array', 'two-pointers', 'merge']
  },
  
  'max-subarray-sum': {
    id: 'max-subarray-sum',
    title: 'Maximum Subarray Sum (Kadane)',
    difficulty: 'medium',
    description: 'Find the contiguous subarray with the largest sum.',
    signature: 'solve(nums)',
    template: `function solve(nums) {
  // Your code here (Kadane's algorithm)
  let maxSum = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
    tests: [
      { input: [-2, 1, -3, 4, -1, 2, 1, -5, 4], expected: 6, hidden: false },
      { input: [1], expected: 1, hidden: false },
      { input: [5, 4, -1, 7, 8], expected: 23, hidden: true },
      { input: [-1, -2, -3], expected: -1, hidden: true }
    ],
    hints: ['Use Kadane\'s algorithm', 'Track both current and maximum sum'],
    timeLimit: 1000,
    tags: ['array', 'dynamic-programming']
  },
  
  'binary-search': {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'easy',
    description: 'Search for a target value in a sorted array. Return its index or -1 if not found.',
    signature: 'solve([nums, target])',
    template: `function solve(input) {
  const [nums, target] = input;
  // Your code here
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    tests: [
      { input: [[1, 2, 3, 4, 5], 3], expected: 2, hidden: false },
      { input: [[1, 2, 3, 4, 5], 6], expected: -1, hidden: false },
      { input: [[1], 1], expected: 0, hidden: true },
      { input: [[], 1], expected: -1, hidden: true }
    ],
    hints: ['Divide search space in half each iteration', 'Check middle element'],
    timeLimit: 500,
    tags: ['array', 'binary-search']
  },
  
  'fibonacci': {
    id: 'fibonacci',
    title: 'Fibonacci Number',
    difficulty: 'easy',
    description: 'Calculate the nth Fibonacci number (0-indexed).',
    signature: 'solve(n)',
    template: `function solve(n) {
  // Your code here
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}`,
    tests: [
      { input: 0, expected: 0, hidden: false },
      { input: 1, expected: 1, hidden: false },
      { input: 5, expected: 5, hidden: false },
      { input: 10, expected: 55, hidden: true },
      { input: 15, expected: 610, hidden: true }
    ],
    hints: ['Use iteration instead of recursion for efficiency', 'Track last two numbers'],
    timeLimit: 500,
    tags: ['math', 'dynamic-programming']
  },
  
  'is-palindrome': {
    id: 'is-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'easy',
    description: 'Check if a string is a palindrome (ignoring case and non-alphanumeric characters).',
    signature: 'solve(s)',
    template: `function solve(s) {
  // Your code here
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
    tests: [
      { input: 'A man, a plan, a canal: Panama', expected: true, hidden: false },
      { input: 'race a car', expected: false, hidden: false },
      { input: ' ', expected: true, hidden: true },
      { input: 'ab', expected: false, hidden: true }
    ],
    hints: ['Clean the string first', 'Use two pointers from both ends'],
    timeLimit: 500,
    tags: ['string', 'two-pointers']
  }
}

// ============================================================================
// STORAGE UTILITIES - Comprehensive persistence
// ============================================================================

const STORAGE_KEYS = {
  SNIPPETS: 'oj_snippets',
  SUBMISSIONS: 'oj_submissions',
  CURRENT_CODE: 'oj_current_code',
  CURRENT_TESTS: 'oj_current_tests',
  CURRENT_PROBLEM: 'oj_current_problem',
  SETTINGS: 'oj_settings'
}

function safeJSONParse(str, fallback) {
  try {
    return str ? JSON.parse(str) : fallback
  } catch {
    return fallback
  }
}

const Storage = {
  getSnippets: () => safeJSONParse(localStorage.getItem(STORAGE_KEYS.SNIPPETS), []),
  saveSnippets: (snippets) => localStorage.setItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(snippets)),
  
  getSubmissions: () => safeJSONParse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS), []),
  saveSubmission: (submission) => {
    const all = Storage.getSubmissions()
    all.unshift({ ...submission, id: Date.now(), timestamp: new Date().toISOString() })
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(all.slice(0, 100))) // Keep last 100
  },
  
  getCurrentCode: () => localStorage.getItem(STORAGE_KEYS.CURRENT_CODE),
  saveCurrentCode: (code) => localStorage.setItem(STORAGE_KEYS.CURRENT_CODE, code),
  
  getCurrentTests: () => localStorage.getItem(STORAGE_KEYS.CURRENT_TESTS),
  saveCurrentTests: (tests) => localStorage.setItem(STORAGE_KEYS.CURRENT_TESTS, tests),
  
  getCurrentProblem: () => localStorage.getItem(STORAGE_KEYS.CURRENT_PROBLEM),
  saveCurrentProblem: (id) => localStorage.setItem(STORAGE_KEYS.CURRENT_PROBLEM, id),
  
  getSettings: () => safeJSONParse(localStorage.getItem(STORAGE_KEYS.SETTINGS), {
    autoSave: true,
    showHiddenTests: false,
    theme: 'light'
  }),
  saveSettings: (settings) => localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
}

// ============================================================================
// WEB WORKER - Sandboxed execution
// ============================================================================

function createWorkerBlob() {
  return new Blob([`
    self.onmessage = async (e) => {
      const { code, tests, timeLimit } = e.data;
      const verdicts = [];
      let passed = 0;
      const total = tests.length;
      let userFn = null;
      
      // Compile user code
      try {
        const wrapped = '(function(){\\n' + code + '\\n;return (typeof solve === "function" ? solve : null);})()'
        userFn = eval(wrapped)
      } catch (err) {
        postMessage({ 
          type: 'error', 
          error: 'Compilation Error: ' + (err?.message || String(err)),
          details: err?.stack
        })
        return
      }
      
      if (!userFn) {
        postMessage({ type: 'error', error: 'No solve() function found in your code.' })
        return
      }
      
      // Run each test case
      for (let i = 0; i < tests.length; i++) {
        const t = tests[i]
        let verdict = { index: i, hidden: t.hidden }
        
        try {
          const start = performance.now()
          
          // Timeout mechanism
          let timedOut = false
          const timeoutId = setTimeout(() => { timedOut = true }, timeLimit || 2000)
          
          const output = userFn(structuredClone(t.input))
          const runtimeMs = performance.now() - start
          
          clearTimeout(timeoutId)
          
          if (timedOut) {
            verdict.ok = false
            verdict.error = 'Time Limit Exceeded'
            verdict.runtimeMs = runtimeMs
          } else if (runtimeMs > (timeLimit || 2000)) {
            verdict.ok = false
            verdict.error = 'Time Limit Exceeded'
            verdict.runtimeMs = runtimeMs
          } else {
            verdict.ok = deepEqual(output, t.expected)
            verdict.runtimeMs = runtimeMs
            verdict.output = output
            verdict.expected = t.expected
            if (verdict.ok) passed++
          }
        } catch (err) {
          verdict.ok = false
          verdict.error = 'Runtime Error: ' + (err?.message || String(err))
          verdict.details = err?.stack
        }
        
        postMessage({ type: 'case', ...verdict })
      }
      
      postMessage({ type: 'done', passed, total })
    }
    
    function deepEqual(a, b) {
      if (a === b) return true
      if (typeof a !== typeof b) return false
      if (a && b && typeof a === 'object') {
        if (Array.isArray(a) !== Array.isArray(b)) return false
        if (Array.isArray(a)) {
          if (a.length !== b.length) return false
          for (let i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i])) return false
          }
          return true
        } else {
          const ka = Object.keys(a).sort()
          const kb = Object.keys(b).sort()
          if (ka.length !== kb.length) return false
          for (let i = 0; i < ka.length; i++) {
            if (ka[i] !== kb[i]) return false
            if (!deepEqual(a[ka[i]], b[kb[i]])) return false
          }
          return true
        }
      }
      return false
    }
  `], { type: 'text/javascript' })
}

// ============================================================================
// SYNTAX HIGHLIGHTER - Simple inline highlighting
// ============================================================================

function SimpleCodeEditor({ value, onChange, readOnly = false, placeholder = '' }) {
  const [lines, setLines] = useState(value.split('\n').length)
  
  useEffect(() => {
    setLines(value.split('\n').length)
  }, [value])
  
  return (
    <div className="relative font-mono text-sm border rounded-lg overflow-hidden bg-slate-50">
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-100 border-r border-slate-200 text-slate-500 text-xs pt-3 text-right pr-2 select-none">
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className="leading-6">{i + 1}</div>
        ))}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        spellCheck={false}
        className="w-full min-h-[400px] p-3 pl-14 bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
        style={{ fontFamily: 'ui-monospace, monospace' }}
      />
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Playground() {
  const [selectedProblem, setSelectedProblem] = useState(Storage.getCurrentProblem() || 'two-sum')
  const [code, setCode] = useState('')
  const [customTests, setCustomTests] = useState('')
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState([])
  const [summary, setSummary] = useState(null)
  const [snippets, setSnippets] = useState(Storage.getSnippets())
  const [snippetName, setSnippetName] = useState('')
  const [submissions, setSubmissions] = useState(Storage.getSubmissions())
  const [settings, setSettings] = useState(Storage.getSettings())
  const [showHints, setShowHints] = useState(false)
  const [activeTab, setActiveTab] = useState('problem') // problem, submissions, snippets
  const [isCustomMode, setIsCustomMode] = useState(false)
  
  const workerRef = useRef(null)
  const autoSaveTimer = useRef(null)
  
  const problem = PROBLEM_LIBRARY[selectedProblem]
  
  // Initialize worker
  const workerUrl = useMemo(() => URL.createObjectURL(createWorkerBlob()), [])
  
  useEffect(() => {
    const worker = new Worker(workerUrl)
    workerRef.current = worker
    
    worker.onmessage = (e) => {
      const msg = e.data
      
      if (msg.type === 'error') {
        setRunning(false)
        toast.error(msg.error, { autoClose: 5000 })
        if (msg.details) console.error(msg.details)
      } else if (msg.type === 'case') {
        setResults(prev => {
          const next = [...prev]
          next[msg.index] = msg
          return next
        })
      } else if (msg.type === 'done') {
        setRunning(false)
        const resultSummary = { passed: msg.passed, total: msg.total }
        setSummary(resultSummary)
        
        // Save submission
        Storage.saveSubmission({
          problemId: selectedProblem,
          code,
          passed: msg.passed,
          total: msg.total,
          verdict: msg.passed === msg.total ? 'Accepted' : 'Wrong Answer'
        })
        setSubmissions(Storage.getSubmissions())
        
        if (msg.passed === msg.total) {
          toast.success(`✅ All tests passed! (${msg.total}/${msg.total})`, { autoClose: 3000 })
        } else {
          toast.warn(`⚠️ ${msg.passed}/${msg.total} tests passed`, { autoClose: 3000 })
        }
      }
    }
    
    return () => {
      worker.terminate()
      workerRef.current = null
    }
  }, [workerUrl, selectedProblem, code])
  
  // Load problem template on selection
  useEffect(() => {
    if (!isCustomMode && problem) {
      const saved = Storage.getCurrentCode()
      const savedProblem = Storage.getCurrentProblem()
      
      if (savedProblem === selectedProblem && saved) {
        setCode(saved)
      } else {
        setCode(problem.template)
      }
      
      Storage.saveCurrentProblem(selectedProblem)
      setResults([])
      setSummary(null)
    }
  }, [selectedProblem, isCustomMode, problem])
  
  // Auto-save
  useEffect(() => {
    if (settings.autoSave && !isCustomMode) {
      clearTimeout(autoSaveTimer.current)
      autoSaveTimer.current = setTimeout(() => {
        Storage.saveCurrentCode(code)
      }, 1000)
    }
    return () => clearTimeout(autoSaveTimer.current)
  }, [code, settings.autoSave, isCustomMode])
  
  // Run tests
  const runTests = useCallback(() => {
    let tests
    
    if (isCustomMode) {
      try {
        const parsed = JSON.parse(customTests)
        if (!Array.isArray(parsed)) throw new Error('Tests must be an array')
        tests = parsed.map(t => ({ ...t, hidden: false }))
      } catch (err) {
        toast.error('Invalid tests JSON: ' + err.message)
        return
      }
    } else {
      tests = settings.showHiddenTests ? problem.tests : problem.tests.filter(t => !t.hidden)
    }
    
    if (tests.length === 0) {
      toast.error('No tests to run')
      return
    }
    
    setResults(Array(tests.length).fill(null))
    setSummary(null)
    setRunning(true)
    
    workerRef.current?.postMessage({
      code,
      tests,
      timeLimit: problem?.timeLimit || 2000
    })
  }, [code, customTests, isCustomMode, problem, settings.showHiddenTests])
  
  // Snippet management
  const saveSnippet = useCallback(() => {
    const name = snippetName.trim() || `Snippet ${snippets.length + 1}`
    const newSnippet = {
      name,
      code,
      tests: isCustomMode ? customTests : JSON.stringify(problem.tests, null, 2),
      problemId: isCustomMode ? 'custom' : selectedProblem,
      timestamp: new Date().toISOString()
    }
    
    const updated = [newSnippet, ...snippets]
    setSnippets(updated)
    Storage.saveSnippets(updated)
    setSnippetName('')
    toast.success('Snippet saved!')
  }, [snippetName, code, customTests, snippets, selectedProblem, isCustomMode, problem])
  
  const loadSnippet = useCallback((idx) => {
    const snippet = snippets[idx]
    if (!snippet) return
    
    setCode(snippet.code)
    if (snippet.problemId === 'custom') {
      setIsCustomMode(true)
      setCustomTests(snippet.tests)
    } else {
      setIsCustomMode(false)
      setSelectedProblem(snippet.problemId)
    }
    toast.info('Snippet loaded')
  }, [snippets])
  
  const deleteSnippet = useCallback((idx) => {
    const updated = snippets.filter((_, i) => i !== idx)
    setSnippets(updated)
    Storage.saveSnippets(updated)
    toast.info('Snippet deleted')
  }, [snippets])
  
  // Switch to custom mode
  const switchToCustomMode = useCallback(() => {
    setIsCustomMode(true)
    setCode(`function solve(input) {\n  // Your code here\n  return input;\n}`)
    setCustomTests(JSON.stringify([
      { input: [], expected: [] }
    ], null, 2))
    setResults([])
    setSummary(null)
  }, [])
  
  // Difficulty colors
  const getDifficultyColor = (diff) => {
    const colors = {
      easy: 'bg-green-100 text-green-700 border-green-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      hard: 'bg-red-100 text-red-700 border-red-300'
    }
    return colors[diff] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 px-6 py-10">
      <ToastContainer position="bottom-right" theme="light" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
              Online Judge Playground
            </h1>
            <p className="text-sm text-slate-600">Write, test, and debug algorithms in your browser</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setSettings(prev => ({ ...prev, showHiddenTests: !prev.showHiddenTests }))}
              className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                settings.showHiddenTests
                  ? 'bg-purple-100 border-purple-400 text-purple-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-purple-300'
              }`}
            >
              {settings.showHiddenTests ? '🔓 All Tests' : '🔒 Visible Only'}
            </button>
            
            <button
              onClick={runTests}
              disabled={running}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-95 transition-all"
            >
              {running ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Running...
                </span>
              ) : (
                '▶ Run Tests'
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex gap-2 border-b border-slate-200">
          {['problem', 'submissions', 'snippets'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Problem Selection Panel */}
        {activeTab === 'problem' && (
          <>
            <div className="mb-6 p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Select Problem</h2>
                <button
                  onClick={switchToCustomMode}
                  className="px-4 py-2 text-sm border-2 border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  ➕ Custom Problem
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.values(PROBLEM_LIBRARY).map(prob => (
                  <button
                    key={prob.id}
                    onClick={() => { setSelectedProblem(prob.id); setIsCustomMode(false) }}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      !isCustomMode && selectedProblem === prob.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-slate-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <h3 className="font-semibold text-sm text-slate-800 mb-1">{prob.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(prob.difficulty)}`}>
                        {prob.difficulty}
                      </span>
                      <span className="text-xs text-slate-500">{prob.tests.length} tests</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {prob.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Problem Description */}
            {!isCustomMode && problem && (
              <div className="mb-6 p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-1">{problem.title}</h2>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                      <span className="text-xs text-slate-500">Time Limit: {problem.timeLimit}ms</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="px-3 py-1.5 text-sm border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    {showHints ? 'Hide' : 'Show'} Hints
                  </button>
                </div>
                
                <p className="text-sm text-slate-700 mb-3">{problem.description}</p>
                <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-800">
                  {problem.signature}
                </code>
                
                {showHints && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-amber-900 mb-2">💡 Hints:</h4>
                    <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                      {problem.hints.map((hint, idx) => (
                        <li key={idx}>{hint}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-4 flex flex-wrap gap-1">
                  {problem.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Code Editor & Tests Grid */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Code Editor */}
              <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-800">Solution Code</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={snippetName}
                      onChange={(e) => setSnippetName(e.target.value)}
                      placeholder="Snippet name..."
                      className="px-3 py-1 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={saveSnippet}
                      className="px-3 py-1.5 text-xs bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
                    >
                      💾 Save
                    </button>
                  </div>
                </div>
                <SimpleCodeEditor
                  value={code}
                  onChange={setCode}
                  placeholder="Write your solve() function here..."
                />
              </div>

              {/* Tests Panel */}
              <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-3">
                  {isCustomMode ? 'Custom Tests (JSON)' : 'Test Cases'}
                </h3>
                
                {isCustomMode ? (
                  <SimpleCodeEditor
                    value={customTests}
                    onChange={setCustomTests}
                    placeholder='[{"input": ..., "expected": ...}]'
                  />
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {problem?.tests.map((test, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${
                          test.hidden && !settings.showHiddenTests
                            ? 'bg-slate-100 border-slate-300 opacity-50'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-700">
                            Test #{idx + 1}
                          </span>
                          {test.hidden && (
                            <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                              Hidden
                            </span>
                          )}
                        </div>
                        {(!test.hidden || settings.showHiddenTests) && (
                          <>
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
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Results Panel */}
            <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">Test Results</h3>
                {summary && (
                  <div className={`px-3 py-1.5 rounded-lg font-semibold ${
                    summary.passed === summary.total
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {summary.passed}/{summary.total} Passed
                  </div>
                )}
              </div>
              
              {results.length === 0 ? (
                <div className="py-10 text-center text-slate-500">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-sm">Click "Run Tests" to execute your code</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((r, idx) => {
                    if (!r) {
                      return (
                        <div key={idx} className="p-4 rounded-lg border border-slate-200 bg-slate-50 animate-pulse">
                          <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
                          <div className="h-3 bg-slate-200 rounded w-2/3" />
                        </div>
                      )
                    }
                    
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border-2 ${
                          r.ok
                            ? 'border-green-400 bg-green-50'
                            : 'border-red-400 bg-red-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${r.ok ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="font-semibold text-sm">
                              Test #{idx + 1} — {r.ok ? '✅ Passed' : '❌ Failed'}
                            </span>
                            {r.hidden && (
                              <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                                Hidden
                              </span>
                            )}
                          </div>
                          {typeof r.runtimeMs === 'number' && (
                            <span className="text-xs text-slate-600">
                              {r.runtimeMs.toFixed(2)} ms
                            </span>
                          )}
                        </div>
                        
                        {!r.ok && (
                          <div className="mt-2 space-y-1 text-xs">
                            {r.error ? (
                              <div className="p-2 bg-red-100 border border-red-200 rounded">
                                <strong className="text-red-800">Error:</strong>
                                <code className="block mt-1 text-red-700">{r.error}</code>
                              </div>
                            ) : (
                              <>
                                <div>
                                  <strong>Expected:</strong>{' '}
                                  <code className="bg-white px-1 py-0.5 rounded">{JSON.stringify(r.expected)}</code>
                                </div>
                                <div>
                                  <strong>Got:</strong>{' '}
                                  <code className="bg-white px-1 py-0.5 rounded">{JSON.stringify(r.output)}</code>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Submission History</h2>
            
            {submissions.length === 0 ? (
              <div className="py-10 text-center text-slate-500">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm">No submissions yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {submissions.map((sub) => {
                  const prob = PROBLEM_LIBRARY[sub.problemId]
                  return (
                    <div key={sub.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm text-slate-800">
                              {prob?.title || sub.problemId}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              sub.verdict === 'Accepted'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {sub.verdict}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-600">
                            <span>{sub.passed}/{sub.total} tests passed</span>
                            <span>{new Date(sub.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setCode(sub.code)
                            setSelectedProblem(sub.problemId)
                            setIsCustomMode(false)
                            setActiveTab('problem')
                            toast.info('Submission loaded')
                          }}
                          className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          Load
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Snippets Tab */}
        {activeTab === 'snippets' && (
          <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Saved Snippets</h2>
            
            {snippets.length === 0 ? (
              <div className="py-10 text-center text-slate-500">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V
8M7 18h10" />
                </svg>
                <p className="text-sm">No saved snippets yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {snippets.map((snippet, idx) => {
                  const prob = PROBLEM_LIBRARY[snippet.problemId]
                  return (
                    <div key={idx} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-slate-800 mb-1">
                            {snippet.name}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-slate-600 mb-2">
                            <span>
                              {snippet.problemId === 'custom' ? '🔧 Custom' : prob?.title || snippet.problemId}
                            </span>
                            <span>{new Date(snippet.timestamp).toLocaleString()}</span>
                          </div>
                          <pre className="text-xs bg-slate-100 p-2 rounded overflow-x-auto max-h-20 text-slate-700">
                            {snippet.code.slice(0, 150)}...
                          </pre>
                        </div>
                        <div className="flex flex-col gap-2 ml-3">
                          <button
                            onClick={() => loadSnippet(idx)}
                            className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors whitespace-nowrap"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => deleteSnippet(idx)}
                            className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
