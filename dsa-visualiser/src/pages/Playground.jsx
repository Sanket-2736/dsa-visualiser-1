import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Eye, 
  EyeOff, 
  Save, 
  FolderOpen, 
  Layers,
  Code,
  CheckCircle,
  XCircle,
  Clock,
  Lightbulb,
  AlertCircle,
  FileCode,
  Trash2,
  Download
} from 'lucide-react';

// ============================================================================
// PROBLEM LIBRARY
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
    description: 'Write a function that reverses a string.',
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
};

// ============================================================================
// STORAGE UTILITIES
// ============================================================================

const STORAGE_KEYS = {
  SNIPPETS: 'oj_snippets',
  SUBMISSIONS: 'oj_submissions',
  CURRENT_CODE: 'oj_current_code',
  CURRENT_TESTS: 'oj_current_tests',
  CURRENT_PROBLEM: 'oj_current_problem',
  SETTINGS: 'oj_settings'
};

function safeJSONParse(str, fallback) {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch {
    return fallback;
  }
}

const Storage = {
  getSnippets: () => safeJSONParse(localStorage.getItem(STORAGE_KEYS.SNIPPETS), []),
  saveSnippets: (snippets) => localStorage.setItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(snippets)),
  
  getSubmissions: () => safeJSONParse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS), []),
  saveSubmission: (submission) => {
    const all = Storage.getSubmissions();
    all.unshift({ ...submission, id: Date.now(), timestamp: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(all.slice(0, 100)));
  },
  
  getCurrentCode: (problemId) => localStorage.getItem(`${STORAGE_KEYS.CURRENT_CODE}:${problemId}`),
  saveCurrentCode: (problemId, code) => localStorage.setItem(`${STORAGE_KEYS.CURRENT_CODE}:${problemId}`, code),
  
  getCurrentProblem: () => localStorage.getItem(STORAGE_KEYS.CURRENT_PROBLEM),
  saveCurrentProblem: (id) => localStorage.setItem(STORAGE_KEYS.CURRENT_PROBLEM, id),
  
  getSettings: () => safeJSONParse(localStorage.getItem(STORAGE_KEYS.SETTINGS), {
    autoSave: true,
    showHiddenTests: false
  }),
  saveSettings: (settings) => localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
};

// ============================================================================
// WEB WORKER - Improved isolation
// ============================================================================

function createWorkerBlob() {
  return new Blob([`
    self.onmessage = async (e) => {
      const { code, tests, timeLimit } = e.data;
      const verdicts = [];
      let passed = 0;
      const total = tests.length;
      let userFn = null;
      
      const clone = (v) => (typeof structuredClone === 'function' ? structuredClone(v) : JSON.parse(JSON.stringify(v)));
      
      // Compile user code
      try {
        const fn = new Function(\`"use strict"; return (function(){\\n\${code}\\n;return (typeof solve==="function"?solve:null); })();\`);
        userFn = fn();
      } catch (err) {
        postMessage({ 
          type: 'error', 
          error: 'Compilation Error: ' + (err?.message || String(err)),
          details: err?.stack
        });
        return;
      }
      
      if (!userFn) {
        postMessage({ type: 'error', error: 'No solve() function found in your code.' });
        return;
      }
      
      // Run each test case
      for (let i = 0; i < tests.length; i++) {
        const t = tests[i];
        let verdict = { index: i, hidden: t.hidden };
        
        try {
          const start = performance.now();
          const output = userFn(clone(t.input));
          const runtimeMs = performance.now() - start;
          
          if (runtimeMs > (timeLimit || 2000)) {
            verdict.ok = false;
            verdict.error = 'Time Limit Exceeded';
            verdict.runtimeMs = runtimeMs;
          } else {
            verdict.ok = deepEqual(output, t.expected);
            verdict.runtimeMs = runtimeMs;
            verdict.output = output;
            verdict.expected = t.expected;
            if (verdict.ok) passed++;
          }
        } catch (err) {
          verdict.ok = false;
          verdict.error = 'Runtime Error: ' + (err?.message || String(err));
          verdict.details = err?.stack;
        }
        
        postMessage({ type: 'case', ...verdict });
      }
      
      postMessage({ type: 'done', passed, total });
    };
    
    function deepEqual(a, b) {
      if (a === b) return true;
      if (typeof a !== typeof b) return false;
      if (a && b && typeof a === 'object') {
        if (Array.isArray(a) !== Array.isArray(b)) return false;
        if (Array.isArray(a)) {
          if (a.length !== b.length) return false;
          for (let i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i])) return false;
          }
          return true;
        } else {
          const ka = Object.keys(a).sort();
          const kb = Object.keys(b).sort();
          if (ka.length !== kb.length) return false;
          for (let i = 0; i < ka.length; i++) {
            if (ka[i] !== kb[i]) return false;
            if (!deepEqual(a[ka[i]], b[kb[i]])) return false;
          }
          return true;
        }
      }
      return false;
    }
  `], { type: 'text/javascript' });
}

// ============================================================================
// CODE EDITOR
// ============================================================================

function SimpleCodeEditor({ value, onChange, readOnly = false, placeholder = '' }) {
  const [lines, setLines] = useState(value.split('\n').length);
  
  useEffect(() => {
    setLines(value.split('\n').length);
  }, [value]);
  
  return (
    <div className="relative font-mono text-sm rounded-lg overflow-hidden bg-gray-900">
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-800 border-r border-gray-700 text-gray-500 text-xs pt-3 text-right pr-2 select-none">
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
        className="w-full min-h-[400px] p-3 pl-14 bg-transparent text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
        style={{ fontFamily: 'ui-monospace, monospace' }}
      />
    </div>
  );
}

// ============================================================================
// TOAST NOTIFICATIONS
// ============================================================================

const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed bottom-6 right-6 z-50 space-y-3">
    <AnimatePresence>
      {toasts.map(toast => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className={`px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 min-w-[300px] ${
            toast.type === 'success' 
              ? 'bg-emerald-900/90 border-emerald-700 text-emerald-100' 
              : toast.type === 'error'
              ? 'bg-red-900/90 border-red-700 text-red-100'
              : 'bg-blue-900/90 border-blue-700 text-blue-100'
          }`}
        >
          {toast.type === 'success' && <CheckCircle size={20} />}
          {toast.type === 'error' && <XCircle size={20} />}
          {toast.type === 'info' && <AlertCircle size={20} />}
          <span className="flex-1 text-sm">{toast.message}</span>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function OnlineJudgePlayground() {
  const [selectedProblem, setSelectedProblem] = useState(Storage.getCurrentProblem() || 'two-sum');
  const [code, setCode] = useState('');
  const [customTests, setCustomTests] = useState('');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [snippets, setSnippets] = useState(Storage.getSnippets());
  const [snippetName, setSnippetName] = useState('');
  const [submissions, setSubmissions] = useState(Storage.getSubmissions());
  const [settings, setSettings] = useState(Storage.getSettings());
  const [showHints, setShowHints] = useState(false);
  const [activeTab, setActiveTab] = useState('problem');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  const workerRef = useRef(null);
  const workerUrlRef = useRef(null);
  const autoSaveTimer = useRef(null);
  
  const problem = PROBLEM_LIBRARY[selectedProblem];
  
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);
  
  // Initialize worker with cleanup
  useEffect(() => {
    const blob = createWorkerBlob();
    const url = URL.createObjectURL(blob);
    workerUrlRef.current = url;
    const worker = new Worker(url);
    workerRef.current = worker;
    
    worker.onmessage = (e) => {
      const msg = e.data;
      
      if (msg.type === 'error') {
        setRunning(false);
        addToast(msg.error, 'error');
        if (msg.details) console.error(msg.details);
      } else if (msg.type === 'case') {
        setResults(prev => {
          const next = [...prev];
          next[msg.index] = msg;
          return next;
        });
      } else if (msg.type === 'done') {
        setRunning(false);
        const resultSummary = { passed: msg.passed, total: msg.total };
        setSummary(resultSummary);
        
        Storage.saveSubmission({
          problemId: selectedProblem,
          code,
          passed: msg.passed,
          total: msg.total,
          verdict: msg.passed === msg.total ? 'Accepted' : 'Wrong Answer'
        });
        setSubmissions(Storage.getSubmissions());
        
        if (msg.passed === msg.total) {
          addToast(`✅ All tests passed! (${msg.total}/${msg.total})`, 'success');
        } else {
          addToast(`⚠️ ${msg.passed}/${msg.total} tests passed`, 'error');
        }
      }
    };
    
    return () => {
      worker.terminate();
      URL.revokeObjectURL(url);
      workerRef.current = null;
      workerUrlRef.current = null;
    };
  }, [selectedProblem, code, addToast]);
  
  // Load problem template
  useEffect(() => {
    if (!isCustomMode && problem) {
      const saved = Storage.getCurrentCode(selectedProblem);
      setCode(saved || problem.template);
      Storage.saveCurrentProblem(selectedProblem);
      setResults([]);
      setSummary(null);
    }
  }, [selectedProblem, isCustomMode, problem]);
  
  // Auto-save per problem
  useEffect(() => {
    if (settings.autoSave && !isCustomMode && selectedProblem) {
      clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        Storage.saveCurrentCode(selectedProblem, code);
      }, 1000);
    }
    return () => clearTimeout(autoSaveTimer.current);
  }, [code, settings.autoSave, isCustomMode, selectedProblem]);
  
  // Run tests
  const runTests = useCallback(() => {
    let tests;
    
    if (isCustomMode) {
      try {
        const parsed = JSON.parse(customTests);
        if (!Array.isArray(parsed)) throw new Error('Tests must be an array');
        tests = parsed.map(t => ({ ...t, hidden: false }));
      } catch (err) {
        addToast('Invalid tests JSON: ' + err.message, 'error');
        return;
      }
    } else {
      tests = settings.showHiddenTests ? problem.tests : problem.tests.filter(t => !t.hidden);
    }
    
    if (tests.length === 0) {
      addToast('No tests to run', 'error');
      return;
    }
    
    setResults(Array(tests.length).fill(null));
    setSummary(null);
    setRunning(true);
    
    workerRef.current?.postMessage({
      code,
      tests,
      timeLimit: problem?.timeLimit || 2000
    });
  }, [code, customTests, isCustomMode, problem, settings.showHiddenTests, addToast]);
  
  // Snippet management
  const saveSnippet = useCallback(() => {
    const name = snippetName.trim() || `Snippet ${snippets.length + 1}`;
    const newSnippet = {
      name,
      code,
      tests: isCustomMode ? customTests : JSON.stringify(problem.tests, null, 2),
      problemId: isCustomMode ? 'custom' : selectedProblem,
      timestamp: new Date().toISOString()
    };
    
    const updated = [newSnippet, ...snippets];
    setSnippets(updated);
    Storage.saveSnippets(updated);
    setSnippetName('');
    addToast('Snippet saved!', 'success');
  }, [snippetName, code, customTests, snippets, selectedProblem, isCustomMode, problem, addToast]);
  
  const loadSnippet = useCallback((idx) => {
    const snippet = snippets[idx];
    if (!snippet) return;
    
    setCode(snippet.code);
    if (snippet.problemId === 'custom') {
      setIsCustomMode(true);
      setCustomTests(snippet.tests);
    } else {
      setIsCustomMode(false);
      setSelectedProblem(snippet.problemId);
    }
    addToast('Snippet loaded', 'info');
  }, [snippets, addToast]);
  
  const deleteSnippet = useCallback((idx) => {
    const updated = snippets.filter((_, i) => i !== idx);
    setSnippets(updated);
    Storage.saveSnippets(updated);
    addToast('Snippet deleted', 'info');
  }, [snippets, addToast]);
  
  const switchToCustomMode = useCallback(() => {
    setIsCustomMode(true);
    setCode(`function solve(input) {\n  // Your code here\n  return input;\n}`);
    setCustomTests(JSON.stringify([
      { input: [], expected: [] }
    ], null, 2));
    setResults([]);
    setSummary(null);
  }, []);
  
  const getDifficultyColor = (diff) => {
    const colors = {
      easy: 'from-green-600 to-emerald-600',
      medium: 'from-yellow-600 to-orange-600',
      hard: 'from-red-600 to-pink-600'
    };
    return colors[diff] || 'from-gray-600 to-slate-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white">
      <ToastContainer toasts={toasts} />
      
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            💻 Online Judge Playground
          </h1>
          <p className="text-lg text-indigo-300">
            Write, test, and debug algorithms in your browser
          </p>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-wrap gap-3 justify-center"
        >
          <motion.button
            onClick={runTests}
            disabled={running}
            whileHover={!running ? { scale: 1.05 } : {}}
            whileTap={!running ? { scale: 0.95 } : {}}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {running ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Layers size={20} />
                </motion.div>
                Running...
              </>
            ) : (
              <>
                <Play size={20} />
                Run Tests
              </>
            )}
          </motion.button>

          <motion.button
            onClick={() => setSettings(prev => ({ ...prev, showHiddenTests: !prev.showHiddenTests }))}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 transition-all ${
              settings.showHiddenTests
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-300'
            }`}
          >
            {settings.showHiddenTests ? <Eye size={18} /> : <EyeOff size={18} />}
            {settings.showHiddenTests ? 'All Tests' : 'Visible Only'}
          </motion.button>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-8 flex gap-2 border-b border-gray-700">
          {['problem', 'submissions', 'snippets'].map(tab => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              whileHover={{ y: -2 }}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Problem Tab */}
        {activeTab === 'problem' && (
          <>
            {/* Problem Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Select Problem</h2>
                <motion.button
                  onClick={switchToCustomMode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors"
                >
                  ➕ Custom Problem
                </motion.button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.values(PROBLEM_LIBRARY).map((prob, idx) => (
                  <motion.button
                    key={prob.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => { setSelectedProblem(prob.id); setIsCustomMode(false); }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      !isCustomMode && selectedProblem === prob.id
                        ? 'border-cyan-500 bg-cyan-900/30 shadow-lg'
                        : 'border-gray-700 bg-gray-900/50 hover:border-indigo-600'
                    }`}
                  >
                    <h3 className="font-semibold text-sm text-white mb-2">{prob.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r ${getDifficultyColor(prob.difficulty)} text-white`}>
                        {prob.difficulty}
                      </span>
                      <span className="text-xs text-gray-400">{prob.tests.length} tests</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {prob.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Problem Description */}
            {!isCustomMode && problem && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8 bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{problem.title}</h2>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-lg text-sm font-semibold bg-gradient-to-r ${getDifficultyColor(problem.difficulty)} text-white`}>
                        {problem.difficulty}
                      </span>
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Clock size={14} />
                        {problem.timeLimit}ms
                      </span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setShowHints(!showHints)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Lightbulb size={16} />
                    {showHints ? 'Hide' : 'Show'} Hints
                  </motion.button>
                </div>
                
                <p className="text-gray-300 mb-4">{problem.description}</p>
                <code className="text-sm bg-gray-900 px-3 py-2 rounded text-cyan-400 block">
                  {problem.signature}
                </code>
                
                <AnimatePresence>
                  {showHints && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-amber-900/30 border border-amber-700 rounded-lg overflow-hidden"
                    >
                      <h4 className="text-sm font-semibold text-amber-300 mb-2 flex items-center gap-2">
                        <Lightbulb size={16} />
                        Hints:
                      </h4>
                      <ul className="text-sm text-amber-200 space-y-1 list-disc list-inside">
                        {problem.hints.map((hint, idx) => (
                          <li key={idx}>{hint}</li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {problem.tags.map(tag => (
                    <span key={tag} className="text-xs px-3 py-1 bg-indigo-600/30 text-indigo-300 rounded-full border border-indigo-600/50">
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Code Editor & Tests Grid */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Code Editor */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Code size={18} />
                    Solution Code
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={snippetName}
                      onChange={(e) => setSnippetName(e.target.value)}
                      placeholder="Snippet name..."
                      className="px-3 py-1.5 text-sm bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <motion.button
                      onClick={saveSnippet}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Save size={14} />
                    </motion.button>
                  </div>
                </div>
                <SimpleCodeEditor
                  value={code}
                  onChange={setCode}
                  placeholder="Write your solve() function here..."
                />
              </motion.div>

              {/* Tests Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
              >
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <FileCode size={18} />
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
                            ? 'bg-gray-900/50 border-gray-700 opacity-50'
                            : 'bg-gray-900/70 border-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-gray-300">
                            Test #{idx + 1}
                          </span>
                          {test.hidden && (
                            <span className="text-xs px-2 py-0.5 bg-yellow-600/30 text-yellow-300 rounded-full border border-yellow-600/50">
                              Hidden
                            </span>
                          )}
                        </div>
                        {(!test.hidden || settings.showHiddenTests) && (
                          <>
                            <div className="text-xs text-gray-400 mb-1">
                              <strong className="text-gray-300">Input:</strong>{' '}
                              <code className="bg-gray-800 px-2 py-0.5 rounded text-cyan-400">
                                {JSON.stringify(test.input)}
                              </code>
                            </div>
                            <div className="text-xs text-gray-400">
                              <strong className="text-gray-300">Expected:</strong>{' '}
                              <code className="bg-gray-800 px-2 py-0.5 rounded text-emerald-400">
                                {JSON.stringify(test.expected)}
                              </code>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Results Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Test Results</h3>
                {summary && (
                  <div className={`px-4 py-2 rounded-lg font-bold ${
                    summary.passed === summary.total
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}>
                    {summary.passed}/{summary.total} Passed
                  </div>
                )}
              </div>
              
              {results.length === 0 ? (
                <div className="py-16 text-center text-gray-500">
                  <FileCode size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Click "Run Tests" to execute your code</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((r, idx) => {
                    if (!r) {
                      return (
                        <div key={idx} className="p-4 rounded-lg border border-gray-700 bg-gray-900/50 animate-pulse">
                          <div className="h-4 bg-gray-700 rounded w-1/3 mb-2" />
                          <div className="h-3 bg-gray-700 rounded w-2/3" />
                        </div>
                      );
                    }
                    
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-4 rounded-lg border-2 ${
                          r.ok
                            ? 'border-emerald-500 bg-emerald-900/20'
                            : 'border-red-500 bg-red-900/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {r.ok ? <CheckCircle size={20} className="text-emerald-400" /> : <XCircle size={20} className="text-red-400" />}
                            <span className="font-semibold">
                              Test #{idx + 1} — {r.ok ? '✅ Passed' : '❌ Failed'}
                            </span>
                            {r.hidden && (
                              <span className="text-xs px-2 py-0.5 bg-yellow-600/30 text-yellow-300 rounded-full">
                                Hidden
                              </span>
                            )}
                          </div>
                          {typeof r.runtimeMs === 'number' && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock size={12} />
                              {r.runtimeMs.toFixed(2)} ms
                            </span>
                          )}
                        </div>
                        
                        {!r.ok && (
                          <div className="mt-2 space-y-1 text-xs">
                            {r.error ? (
                              <div className="p-2 bg-red-900/30 border border-red-700 rounded">
                                <strong className="text-red-400">Error:</strong>
                                <code className="block mt-1 text-red-300 font-mono">{r.error}</code>
                              </div>
                            ) : (
                              <div className="grid gap-2">
                                <div>
                                  <strong className="text-gray-300">Expected:</strong>{' '}
                                  <code className="bg-gray-800 px-2 py-1 rounded text-emerald-400 font-mono">
                                    {JSON.stringify(r.expected)}
                                  </code>
                                </div>
                                <div>
                                  <strong className="text-gray-300">Got:</strong>{' '}
                                  <code className="bg-gray-800 px-2 py-1 rounded text-red-400 font-mono">
                                    {JSON.stringify(r.output)}
                                  </code>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FolderOpen size={20} />
              Submission History
            </h2>
            
            {submissions.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
                <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-sm">No submissions yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {submissions.map((sub) => {
                  const prob = PROBLEM_LIBRARY[sub.problemId];
                  return (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ x: 4 }}
                      className="p-4 border border-gray-700 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white">
                              {prob?.title || sub.problemId}
                            </h3>
                            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                              sub.verdict === 'Accepted'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-red-600 text-white'
                            }`}>
                              {sub.verdict}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>{sub.passed}/{sub.total} tests passed</span>
                            <span>{new Date(sub.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => {
                            setCode(sub.code);
                            setSelectedProblem(sub.problemId);
                            setIsCustomMode(false);
                            setActiveTab('problem');
                            addToast('Submission loaded', 'info');
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                          <Download size={14} />
                          Load
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Snippets Tab */}
        {activeTab === 'snippets' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Layers size={20} />
              Saved Snippets
            </h2>
            
            {snippets.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
                <Layers size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-sm">No saved snippets yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {snippets.map((snippet, idx) => {
                  const prob = PROBLEM_LIBRARY[snippet.problemId];
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ x: 4 }}
                      className="p-4 border border-gray-700 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{snippet.name}</h3>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                            <span>
                              {snippet.problemId === 'custom' ? '🔧 Custom' : prob?.title || snippet.problemId}
                            </span>
                            <span>{new Date(snippet.timestamp).toLocaleString()}</span>
                          </div>
                          <pre className="text-xs bg-gray-800 p-2 rounded overflow-x-auto max-h-20 text-gray-300 font-mono">
                            {snippet.code.slice(0, 150)}...
                          </pre>
                        </div>
                        <div className="flex flex-col gap-2 ml-3">
                          <motion.button
                            onClick={() => loadSnippet(idx)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors whitespace-nowrap flex items-center gap-2"
                          >
                            <Download size={14} />
                            Load
                          </motion.button>
                          <motion.button
                            onClick={() => deleteSnippet(idx)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                          >
                            <Trash2 size={14} />
                            Delete
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
