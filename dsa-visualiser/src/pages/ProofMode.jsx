import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  RotateCcw, 
  Eye, 
  EyeOff,
  Award,
  Target,
  HelpCircle,
  Zap,
  Lock,
  Unlock,
  TrendingUp
} from 'lucide-react';

// ============================================================================
// ALGORITHM LIBRARY
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
};

// ============================================================================
// STORAGE
// ============================================================================

const STORAGE_KEY = 'proof_mode_progress';

function loadProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveProgress(algorithmId, data) {
  try {
    const all = loadProgress();
    all[algorithmId] = {
      ...data,
      lastAttempt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (error) {
    console.warn('Failed to save progress:', error);
  }
}

function getAlgorithmProgress(algorithmId) {
  const progress = loadProgress();
  return progress[algorithmId] || { completed: false, attempts: 0, bestScore: 0 };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function InteractiveProofMode() {
  const [selectedAlgo, setSelectedAlgo] = useState('insertion_sort');
  const [assignments, setAssignments] = useState({});
  const [result, setResult] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [activeHint, setActiveHint] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const algorithm = ALGORITHM_LIBRARY[selectedAlgo];
  
  useEffect(() => {
    const progress = getAlgorithmProgress(selectedAlgo);
    setAssignments({});
    setResult(null);
    setShowHints(false);
    setActiveHint(null);
    setShowSolution(false);
    setAttempts(progress.attempts || 0);
  }, [selectedAlgo]);
  
  const score = useMemo(() => {
    let correct = 0;
    let total = 0;
    
    for (const step of algorithm.steps) {
      const required = new Set(algorithm.correctAssignments[step.id] || []);
      const assigned = new Set(assignments[step.id] || []);
      
      total += required.size;
      
      for (const inv of required) {
        if (assigned.has(inv)) correct++;
      }
    }
    
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  }, [algorithm, assignments]);
  
  function toggleInvariant(stepId, invKey) {
    if (result?.success) return;
    
    setAssignments(prev => {
      const current = new Set(prev[stepId] || []);
      if (current.has(invKey)) {
        current.delete(invKey);
      } else {
        current.add(invKey);
      }
      return { ...prev, [stepId]: Array.from(current) };
    });
    setResult(null);
  }
  
  function checkProof() {
    let allCorrect = true;
    const stepResults = {};
    
    for (const step of algorithm.steps) {
      const required = new Set(algorithm.correctAssignments[step.id] || []);
      const assigned = new Set(assignments[step.id] || []);
      
      const missing = [...required].filter(k => !assigned.has(k));
      const extra = [...assigned].filter(k => !required.has(k));
      
      stepResults[step.id] = {
        correct: missing.length === 0 && extra.length === 0,
        missing,
        extra
      };
      
      if (!stepResults[step.id].correct) allCorrect = false;
    }
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    setResult({
      success: allCorrect,
      stepResults,
      score
    });
    
    if (allCorrect) {
      const progress = getAlgorithmProgress(selectedAlgo);
      saveProgress(selectedAlgo, {
        completed: true,
        attempts: newAttempts,
        bestScore: Math.max(progress.bestScore || 0, score),
        completedAt: new Date().toISOString()
      });
    }
  }
  
  function reset() {
    setAssignments({});
    setResult(null);
    setShowHints(false);
    setActiveHint(null);
    setShowSolution(false);
  }
  
  function revealSolution() {
    setAssignments(algorithm.correctAssignments);
    setShowSolution(true);
    setResult(null);
  }
  
  const getCategoryColor = (category) => {
    const colors = {
      correctness: 'from-blue-600 to-cyan-600',
      safety: 'from-amber-600 to-orange-600',
      termination: 'from-purple-600 to-pink-600',
      precondition: 'from-emerald-600 to-green-600'
    };
    return colors[category] || 'from-gray-600 to-slate-600';
  };
  
  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'from-green-600 to-emerald-600',
      intermediate: 'from-yellow-600 to-orange-600',
      advanced: 'from-red-600 to-pink-600'
    };
    return colors[difficulty] || 'from-gray-600 to-slate-600';
  };

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
            🧩 Interactive Proof Mode
          </h1>
          <p className="text-lg text-indigo-300">
            Master algorithm correctness by assigning loop invariants to proof steps
          </p>
        </motion.div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <Target size={16} className="text-cyan-400" />
              <span className="text-xs text-indigo-300">Current Score</span>
            </div>
            <div className={`text-2xl font-bold ${score === 100 ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {score}%
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-purple-400" />
              <span className="text-xs text-indigo-300">Attempts</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">{attempts}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} className="text-yellow-400" />
              <span className="text-xs text-indigo-300">Steps</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{algorithm.steps.length}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <Award size={16} className="text-orange-400" />
              <span className="text-xs text-indigo-300">Invariants</span>
            </div>
            <div className="text-2xl font-bold text-orange-400">{algorithm.invariants.length}</div>
          </motion.div>
        </div>

        {/* Algorithm Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Select Algorithm</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(ALGORITHM_LIBRARY).map(([id, algo], idx) => {
              const progress = getAlgorithmProgress(id);
              return (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedAlgo(id)}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedAlgo === id
                      ? 'border-cyan-500 bg-cyan-900/30 shadow-lg'
                      : 'border-gray-700 bg-gray-900/50 hover:border-indigo-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-white">{algo.name}</h3>
                    {progress.completed && (
                      <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">{algo.description}</p>
                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r ${getDifficultyColor(algo.difficulty)} text-white`}>
                    {algo.difficulty}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Steps */}
          <div className="lg:col-span-2 space-y-4">
            {/* Progress Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">{algorithm.name}</h2>
                <div className="flex items-center gap-2">
                  {result?.success ? <Lock size={20} className="text-emerald-400" /> : <Unlock size={20} className="text-gray-400" />}
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-4">{algorithm.description}</p>
              
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    score === 100 
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                      : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
                  }`}
                />
              </div>
            </motion.div>

            {/* Steps */}
            <div className="space-y-3">
              {algorithm.steps.map((step, idx) => {
                const stepResult = result?.stepResults?.[step.id];
                const isCorrect = stepResult?.correct;
                const hasError = stepResult && !stepResult.correct;
                
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-5 rounded-xl border-2 transition-all ${
                      isCorrect
                        ? 'border-emerald-500 bg-emerald-900/20'
                        : hasError
                        ? 'border-red-500 bg-red-900/20'
                        : 'border-gray-700 bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            {step.id}
                          </div>
                          <span className="text-xs px-3 py-1 rounded-full bg-indigo-600/30 text-indigo-300 font-medium capitalize">
                            {step.phase}
                          </span>
                        </div>
                        <p className="text-sm text-white font-medium">{step.text}</p>
                      </div>
                      
                      <motion.button
                        onClick={() => setActiveHint(activeHint === step.id ? null : step.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="ml-2 p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-900/30 rounded-lg transition-colors"
                      >
                        <HelpCircle size={20} />
                      </motion.button>
                    </div>

                    <AnimatePresence>
                      {activeHint === step.id && algorithm.hints[step.id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-3 p-3 bg-cyan-900/30 border border-cyan-700 rounded-lg overflow-hidden"
                        >
                          <div className="flex items-start gap-2">
                            <Lightbulb size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-cyan-200">{algorithm.hints[step.id]}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-wrap gap-2">
                      {algorithm.invariants.map((inv) => {
                        const isAssigned = (assignments[step.id] || []).includes(inv.key);
                        const isRequired = (algorithm.correctAssignments[step.id] || []).includes(inv.key);
                        const showingResult = result !== null;
                        
                        let chipStyle = 'bg-gray-900 border-gray-600 text-gray-300 hover:border-indigo-500';
                        
                        if (isAssigned) {
                          if (showingResult) {
                            chipStyle = isRequired
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'bg-red-600 border-red-500 text-white';
                          } else {
                            chipStyle = 'bg-indigo-600 border-indigo-500 text-white';
                          }
                        }
                        
                        return (
                          <motion.button
                            key={inv.key}
                            onClick={() => toggleInvariant(step.id, inv.key)}
                            disabled={result?.success}
                            whileHover={!result?.success ? { scale: 1.05 } : {}}
                            whileTap={!result?.success ? { scale: 0.95 } : {}}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition-all ${chipStyle} ${
                              result?.success ? 'cursor-not-allowed opacity-75' : ''
                            }`}
                          >
                            {inv.text}
                          </motion.button>
                        );
                      })}
                    </div>

                    {hasError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 text-xs space-y-1"
                      >
                        {stepResult.missing.length > 0 && (
                          <p className="text-red-400">
                            <strong>Missing:</strong> {stepResult.missing.map(k => algorithm.invariants.find(i => i.key === k)?.text).join(', ')}
                          </p>
                        )}
                        {stepResult.extra.length > 0 && (
                          <p className="text-red-400">
                            <strong>Extra:</strong> {stepResult.extra.map(k => algorithm.invariants.find(i => i.key === k)?.text).join(', ')}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <motion.button
                onClick={checkProof}
                disabled={result?.success}
                whileHover={!result?.success ? { scale: 1.05 } : {}}
                whileTap={!result?.success ? { scale: 0.95 } : {}}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <CheckCircle size={20} />
                Check Proof
              </motion.button>

              <motion.button
                onClick={reset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
              >
                <RotateCcw size={20} />
                Reset
              </motion.button>

              <motion.button
                onClick={revealSolution}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-all"
              >
                <Eye size={20} />
                Show Solution
              </motion.button>

              <motion.button
                onClick={() => setShowHints(!showHints)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-all"
              >
                {showHints ? <EyeOff size={20} /> : <Eye size={20} />}
                {showHints ? 'Hide' : 'Show'} All Hints
              </motion.button>
            </div>

            {/* Result Message */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-5 rounded-xl border-2 ${
                    result.success
                      ? 'bg-emerald-900/30 border-emerald-500'
                      : 'bg-amber-900/30 border-amber-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.success ? (
                      <CheckCircle size={24} className="text-emerald-400 flex-shrink-0" />
                    ) : (
                      <XCircle size={24} className="text-amber-400 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg mb-1 ${result.success ? 'text-emerald-300' : 'text-amber-300'}`}>
                        {result.success ? '🎉 Proof Complete!' : '⚠️ Proof Incomplete'}
                      </h3>
                      <p className={`text-sm ${result.success ? 'text-emerald-200' : 'text-amber-200'}`}>
                        {result.success
                          ? `Perfect! You've correctly assigned all invariants. Score: ${result.score}%`
                          : `Some invariants are missing or misplaced. Review the highlighted steps. Score: ${result.score}%`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Attempts: {attempts}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {showSolution && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-5 bg-amber-900/30 border-2 border-amber-500 rounded-xl"
                >
                  <p className="text-sm text-amber-200">
                    <strong>Solution revealed.</strong> Study the correct assignments above, then reset to try again.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Reference */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg sticky top-4"
            >
              <h3 className="font-semibold text-white mb-4">Available Invariants</h3>
              <div className="space-y-3">
                {algorithm.invariants.map((inv, idx) => (
                  <motion.div
                    key={inv.key}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.05 }}
                    className="text-sm"
                  >
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r ${getCategoryColor(inv.category)} text-white mb-2`}>
                      {inv.category}
                    </span>
                    <p className="text-gray-300">{inv.text}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="text-xs font-semibold text-indigo-300 mb-3">Category Guide</h4>
                <ul className="text-xs text-gray-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    <span><strong className="text-gray-300">Correctness:</strong> What must be true for the algorithm to work</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    <span><strong className="text-gray-300">Safety:</strong> Bounds and preconditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    <span><strong className="text-gray-300">Termination:</strong> Progress toward completion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    <span><strong className="text-gray-300">Precondition:</strong> Input requirements</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-blue-900/30 border border-blue-700 rounded-xl p-5 shadow-lg"
            >
              <h3 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
                <Lightbulb size={18} />
                Tips
              </h3>
              <ul className="text-xs text-blue-200 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>Each step can require multiple invariants</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>Initialization establishes the base case</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>Maintenance preserves invariants through iterations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>Termination uses invariants to prove correctness</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>Click hint icons (?) for step-specific guidance</span>
                </li>
              </ul>
            </motion.div>

            <AnimatePresence>
              {showHints && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-purple-900/30 border border-purple-700 rounded-xl p-5 shadow-lg overflow-hidden"
                >
                  <h3 className="font-semibold text-purple-300 mb-3">All Hints</h3>
                  <div className="space-y-3">
                    {algorithm.steps.map((step) => (
                      <div key={step.id} className="text-xs">
                        <p className="font-semibold text-purple-200 mb-1">Step {step.id}:</p>
                        <p className="text-purple-300">{algorithm.hints[step.id]}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
