import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Eye, EyeOff, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';

const MISCONCEPTION_CASES = [
  {
    id: 'c1',
    title: 'Binary Search: Off-by-One Error',
    category: 'Searching',
    difficulty: 'Common',
    flawed: `mid = (low + high) / 2;
if (A[mid] < target)
    low = mid;
else
    high = mid;`,
    issue: 'This code can cause an infinite loop when the search space has only 2 elements.',
    fix: `mid = (low + high) / 2;
if (A[mid] < target)
    low = mid + 1;  // Skip mid
else
    high = mid - 1; // Skip mid`,
    explanation: 'When discarding the lower half, use low = mid + 1; and when discarding the upper half, use high = mid - 1. Otherwise, you risk an infinite loop with 2 elements.',
    tip: 'Always move the boundary past mid to ensure the search space shrinks.'
  },
  {
    id: 'c2',
    title: 'MST: Forgetting Cycle Detection',
    category: 'Graphs',
    difficulty: 'Critical',
    flawed: `// Kruskal's approach
sort edges by weight
for each edge (u, v):
    add edge to MST`,
    issue: 'Always picking the cheapest edge without checking for cycles will create cycles in the MST.',
    fix: `sort edges by weight
for each edge (u, v):
    if (find(u) != find(v)):  // Check cycle
        union(u, v)
        add edge to MST`,
    explanation: 'Must check cycle formation using Union-Find (DSU). The cheapest edge can create a cycle if both vertices are already connected.',
    tip: 'Use Union-Find to efficiently detect cycles before adding edges.'
  },
  {
    id: 'c3',
    title: 'QuickSort: Poor Pivot Choice',
    category: 'Sorting',
    difficulty: 'Performance',
    flawed: `quickSort(arr, low, high):
    pivot = arr[low]  // Always first
    partition around pivot
    recurse`,
    issue: 'Always choosing the first element as pivot leads to O(n²) time on sorted/reverse-sorted arrays.',
    fix: `quickSort(arr, low, high):
    pivotIndex = random(low, high)
    swap(arr[low], arr[pivotIndex])
    pivot = arr[low]
    partition and recurse`,
    explanation: 'Choosing a random pivot or median-of-three avoids worst-case O(n²) on already sorted data.',
    tip: 'Randomize pivot selection to achieve average O(n log n) performance.'
  },
  {
    id: 'c4',
    title: 'DFS: Missing Visited Check',
    category: 'Graphs',
    difficulty: 'Critical',
    flawed: `DFS(node):
    process(node)
    for each neighbor:
        DFS(neighbor)`,
    issue: 'Without marking nodes as visited, this creates infinite recursion in graphs with cycles.',
    fix: `DFS(node):
    visited[node] = true
    process(node)
    for each neighbor:
        if (!visited[neighbor]):
            DFS(neighbor)`,
    explanation: 'Always mark nodes as visited before processing to prevent infinite loops in cyclic graphs.',
    tip: 'Use a visited set/array to track explored nodes.'
  },
  {
    id: 'c5',
    title: 'Merge Sort: Space Complexity Trap',
    category: 'Sorting',
    difficulty: 'Optimization',
    flawed: `merge(left, right):
    result = new array[left.length + right.length]
    // merge logic
    return result`,
    issue: 'Creating new arrays at each merge step wastes space and causes O(n log n) space instead of O(n).',
    fix: `merge(arr, low, mid, high):
    temp = new array[high - low + 1]
    // merge into temp
    copy temp back to arr[low...high]`,
    explanation: 'Reuse a single temporary array across all merge operations to maintain O(n) space complexity.',
    tip: 'Allocate temp space once and reuse it throughout the recursion.'
  },
  {
    id: 'c6',
    title: 'Dijkstra: Negative Weight Edges',
    category: 'Graphs',
    difficulty: 'Critical',
    flawed: `Use Dijkstra's algorithm on graph with negative edge weights`,
    issue: "Dijkstra's algorithm fails with negative weights because it assumes once a node is finalized, a shorter path won't be found.",
    fix: `// For negative weights, use:
Bellman-Ford algorithm
// Handles negative weights
// Detects negative cycles`,
    explanation: "Dijkstra's greedy approach fails with negative weights. Use Bellman-Ford which relaxes all edges V-1 times.",
    tip: 'Check for negative weights before choosing your shortest path algorithm.'
  },
  {
    id: 'c7',
    title: 'Dynamic Programming: Missing Base Case',
    category: 'DP',
    difficulty: 'Common',
    flawed: `fib(n):
    if (n <= 1): return n
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]`,
    issue: 'Not checking if memo[n] already exists causes redundant recalculation.',
    fix: `fib(n):
    if (n <= 1): return n
    if (memo[n] != null): return memo[n]
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]`,
    explanation: 'Always check memoization cache before computing to avoid redundant work.',
    tip: 'Check memo first: if cached, return; else compute and cache.'
  },
  {
    id: 'c8',
    title: 'Hash Table: Poor Hash Function',
    category: 'Data Structures',
    difficulty: 'Performance',
    flawed: `hash(key):
    return key % tableSize`,
    issue: 'Simple modulo creates clustering with sequential keys, degrading performance to O(n).',
    fix: `hash(key):
    hash = 0
    for char in key:
        hash = (hash * 31 + char) % tableSize
    return hash`,
    explanation: 'Use a proper hash function (e.g., polynomial rolling hash) to distribute keys uniformly and minimize collisions.',
    tip: 'Multiply by a prime (like 31) and combine all key characters for better distribution.'
  }
];

const MisconceptionFixer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFix, setShowFix] = useState(false);
  const [attemptedFix, setAttemptedFix] = useState(false);

  const currentCase = MISCONCEPTION_CASES[currentIndex];
  const progress = ((currentIndex + 1) / MISCONCEPTION_CASES.length) * 100;

  const goNext = () => {
    if (currentIndex < MISCONCEPTION_CASES.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowFix(false);
      setAttemptedFix(false);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowFix(false);
      setAttemptedFix(false);
    }
  };

  const handleRevealFix = () => {
    setShowFix(true);
    setAttemptedFix(true);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Common':
        return 'bg-amber-500/20 text-amber-400 border-amber-500';
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border-red-500';
      case 'Performance':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500';
      case 'Optimization':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Misconception Fixer 🔍
          </h1>
          <p className="text-lg text-indigo-300 mb-6">
            Spot common algorithmic bugs, understand why they fail, and learn the correct approach.
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-indigo-400 font-medium">Progress</span>
              <span className="text-sm text-indigo-400 font-bold">
                {currentIndex + 1} / {MISCONCEPTION_CASES.length}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-indigo-700">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Main Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCase.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
            className="bg-gray-800/80 backdrop-blur-sm border-2 border-indigo-700 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-6 border-b border-indigo-700">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-2xl font-bold text-white">{currentCase.title}</h2>
                <div className="flex gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-indigo-600 text-indigo-100 font-medium border border-indigo-500">
                    {currentCase.category}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium border ${getDifficultyColor(currentCase.difficulty)}`}>
                    {currentCase.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-6">
              {/* Flawed Code Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="text-red-400" size={20} />
                  <h3 className="text-lg font-semibold text-red-400">Flawed Implementation</h3>
                </div>
                <div className="bg-gray-900/80 border-2 border-red-500/50 rounded-lg p-4">
                  <pre className="text-sm text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap">
                    {currentCase.flawed}
                  </pre>
                </div>
              </div>

              {/* Issue Description */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <h4 className="font-semibold text-red-400 mb-1">Why This Fails:</h4>
                    <p className="text-sm text-gray-300">{currentCase.issue}</p>
                  </div>
                </div>
              </div>

              {/* Reveal Button */}
              {!showFix ? (
                <motion.button
                  onClick={handleRevealFix}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Eye size={20} />
                  Reveal the Fix
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  {/* Correct Code */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="text-emerald-400" size={20} />
                      <h3 className="text-lg font-semibold text-emerald-400">Correct Implementation</h3>
                    </div>
                    <div className="bg-gray-900/80 border-2 border-emerald-500/50 rounded-lg p-4">
                      <pre className="text-sm text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap">
                        {currentCase.fix}
                      </pre>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-emerald-400 mt-0.5 flex-shrink-0" size={18} />
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-1">Explanation:</h4>
                        <p className="text-sm text-gray-300">{currentCase.explanation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tip */}
                  <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="text-indigo-400 mt-0.5 flex-shrink-0" size={18} />
                      <div>
                        <h4 className="font-semibold text-indigo-400 mb-1">Pro Tip:</h4>
                        <p className="text-sm text-gray-300">{currentCase.tip}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <motion.button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              currentIndex === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
            whileHover={currentIndex !== 0 ? { scale: 1.05 } : {}}
            whileTap={currentIndex !== 0 ? { scale: 0.95 } : {}}
          >
            <ChevronLeft size={20} />
            Previous
          </motion.button>

          <div className="text-center">
            <div className="text-sm text-indigo-400 font-medium">
              Case {currentIndex + 1} of {MISCONCEPTION_CASES.length}
            </div>
          </div>

          <motion.button
            onClick={goNext}
            disabled={currentIndex === MISCONCEPTION_CASES.length - 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              currentIndex === MISCONCEPTION_CASES.length - 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
            whileHover={currentIndex !== MISCONCEPTION_CASES.length - 1 ? { scale: 1.05 } : {}}
            whileTap={currentIndex !== MISCONCEPTION_CASES.length - 1 ? { scale: 0.95 } : {}}
          >
            Next
            <ChevronRight size={20} />
          </motion.button>
        </div>

        {/* Completion Message */}
        <AnimatePresence>
          {attemptedFix && currentIndex === MISCONCEPTION_CASES.length - 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mt-8 text-center"
            >
              <div className="inline-block bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-8 py-4 rounded-xl shadow-2xl border-2 border-emerald-400">
                <h3 className="text-2xl font-bold mb-2">🎉 All Cases Reviewed!</h3>
                <p className="text-sm">You've explored all common misconceptions. Keep coding carefully!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MisconceptionFixer;
