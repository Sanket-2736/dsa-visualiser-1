import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  CheckCircle, 
  Code, 
  Clock, 
  Database,
  Target,
  Lightbulb,
  BookOpen,
  History,
  Sparkles,
  TrendingUp
} from 'lucide-react';

// ============================================================================
// COMPREHENSIVE DECISION TREE DATABASE
// ============================================================================

const QUESTIONS = [
  {
    id: 'domain',
    step: 1,
    title: 'What type of data are you working with?',
    options: [
      { value: 'array', label: 'Arrays / Lists / Numbers', icon: '📊', color: 'from-blue-600 to-cyan-600' },
      { value: 'string', label: 'Strings / Text', icon: '📝', color: 'from-green-600 to-emerald-600' },
      { value: 'graph', label: 'Graphs / Networks', icon: '🕸️', color: 'from-purple-600 to-pink-600' },
      { value: 'tree', label: 'Trees / Hierarchies', icon: '🌳', color: 'from-amber-600 to-orange-600' },
      { value: 'collection', label: 'Collections / Sets', icon: '📦', color: 'from-indigo-600 to-violet-600' }
    ]
  },
  {
    id: 'goal',
    step: 2,
    title: 'What is your primary goal?',
    options: [
      { value: 'search', label: 'Find / Search for element', icon: '🔍', color: 'from-blue-600 to-cyan-600' },
      { value: 'sort', label: 'Sort / Order data', icon: '⬆️', color: 'from-green-600 to-teal-600' },
      { value: 'path', label: 'Find path / connection', icon: '🛤️', color: 'from-purple-600 to-pink-600' },
      { value: 'optimize', label: 'Optimize / Minimize cost', icon: '⚡', color: 'from-yellow-600 to-orange-600' },
      { value: 'validate', label: 'Validate / Check structure', icon: '✅', color: 'from-emerald-600 to-green-600' },
      { value: 'transform', label: 'Transform / Process data', icon: '🔄', color: 'from-indigo-600 to-blue-600' }
    ]
  },
  {
    id: 'constraints',
    step: 3,
    title: 'What constraints matter most?',
    options: [
      { value: 'time', label: 'Speed / Time complexity', icon: '⏱️', color: 'from-red-600 to-pink-600' },
      { value: 'space', label: 'Memory / Space efficiency', icon: '💾', color: 'from-blue-600 to-cyan-600' },
      { value: 'stability', label: 'Preserve order (stable)', icon: '🔒', color: 'from-purple-600 to-indigo-600' },
      { value: 'simplicity', label: 'Code simplicity', icon: '🎯', color: 'from-green-600 to-emerald-600' },
      { value: 'balanced', label: 'Balanced performance', icon: '⚖️', color: 'from-amber-600 to-yellow-600' }
    ]
  },
  {
    id: 'size',
    step: 4,
    title: 'How large is your dataset?',
    options: [
      { value: 'small', label: 'Small (< 100)', icon: '🔬', color: 'from-cyan-600 to-blue-600' },
      { value: 'medium', label: 'Medium (100 - 10K)', icon: '📊', color: 'from-blue-600 to-indigo-600' },
      { value: 'large', label: 'Large (10K - 1M)', icon: '🏗️', color: 'from-purple-600 to-pink-600' },
      { value: 'huge', label: 'Huge (1M+)', icon: '🌐', color: 'from-red-600 to-orange-600' }
    ]
  }
];

const ALGORITHM_DATABASE = {
  'array-sort-time-large': {
    name: 'Quick Sort',
    category: 'Sorting',
    complexity: { time: 'O(n log n) avg', space: 'O(log n)' },
    description: 'Fast in-place divide-and-conquer sorting with good cache performance.',
    whenToUse: 'Large datasets where average O(n log n) is acceptable and memory is limited',
    alternatives: ['Merge Sort', 'Heap Sort'],
    codeSnippet: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}`,
    learningResources: ['Visualizer: Race Day', 'Lab: What-If Performance'],
    gradient: 'from-blue-600 to-cyan-600'
  },
  
  'array-sort-stability-medium': {
    name: 'Merge Sort',
    category: 'Sorting',
    complexity: { time: 'O(n log n)', space: 'O(n)' },
    description: 'Stable divide-and-conquer sort with guaranteed O(n log n) performance.',
    whenToUse: 'When stability is required or worst-case O(n log n) is critical',
    alternatives: ['Tim Sort', 'Quick Sort'],
    codeSnippet: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`,
    learningResources: ['Visualizer: Recurrence Tree', 'Museum: 1945 Merge Sort'],
    gradient: 'from-emerald-600 to-green-600'
  },
  
  'array-sort-simplicity-small': {
    name: 'Insertion Sort',
    category: 'Sorting',
    complexity: { time: 'O(n²) worst, O(n) best', space: 'O(1)' },
    description: 'Simple sorting algorithm, efficient for small or nearly sorted data.',
    whenToUse: 'Small datasets (< 50 elements) or nearly sorted arrays',
    alternatives: ['Selection Sort', 'Bubble Sort'],
    codeSnippet: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i], j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    learningResources: ['Race Day', 'What-If Lab'],
    gradient: 'from-amber-600 to-orange-600'
  },
  
  'array-search-time-large': {
    name: 'Binary Search',
    category: 'Searching',
    complexity: { time: 'O(log n)', space: 'O(1)' },
    description: 'Efficient search in sorted arrays by halving the search space.',
    whenToUse: 'Searching in sorted arrays, requires preprocessing',
    alternatives: ['Interpolation Search', 'Hash Table'],
    codeSnippet: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    learningResources: ['Debug-the-Bug: Binary Search', 'Playground: Binary Search'],
    gradient: 'from-cyan-600 to-blue-600'
  },
  
  'graph-path-time-medium': {
    name: 'Dijkstra\'s Algorithm',
    category: 'Graph',
    complexity: { time: 'O((V + E) log V)', space: 'O(V)' },
    description: 'Finds shortest paths from a source to all vertices in weighted graphs.',
    whenToUse: 'Shortest path with non-negative edge weights',
    alternatives: ['Bellman-Ford', 'A* Search'],
    codeSnippet: `function dijkstra(graph, start) {
  const dist = {}, pq = new MinPriorityQueue();
  dist[start] = 0;
  pq.enqueue(start, 0);
  
  while (!pq.isEmpty()) {
    const { element: u } = pq.dequeue();
    for (const [v, weight] of graph[u]) {
      const alt = dist[u] + weight;
      if (alt < (dist[v] ?? Infinity)) {
        dist[v] = alt;
        pq.enqueue(v, alt);
      }
    }
  }
  return dist;
}`,
    learningResources: ['Museum: 1956 Dijkstra', 'Drill Coach: Graph Questions'],
    gradient: 'from-purple-600 to-pink-600'
  },
  
  'graph-path-optimize-large': {
    name: 'Bellman-Ford Algorithm',
    category: 'Graph',
    complexity: { time: 'O(VE)', space: 'O(V)' },
    description: 'Finds shortest paths, handles negative weights, detects negative cycles.',
    whenToUse: 'Shortest path with negative edge weights or cycle detection',
    alternatives: ['Dijkstra (if no negatives)', 'Floyd-Warshall'],
    codeSnippet: `function bellmanFord(graph, V, start) {
  const dist = Array(V).fill(Infinity);
  dist[start] = 0;
  
  for (let i = 0; i < V - 1; i++) {
    for (const [u, v, weight] of graph.edges) {
      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
      }
    }
  }
  return dist;
}`,
    learningResources: ['Museum: Dynamic Programming', 'Drill Coach'],
    gradient: 'from-red-600 to-orange-600'
  },
  
  'graph-validate-time-medium': {
    name: 'DFS (Depth-First Search)',
    category: 'Graph',
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    description: 'Explores graph depth-first, useful for cycle detection and topological sort.',
    whenToUse: 'Cycle detection, topological sorting, pathfinding',
    alternatives: ['BFS', 'Tarjan\'s Algorithm'],
    codeSnippet: `function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
  return visited;
}`,
    learningResources: ['Drill Coach: Graph Complexity', 'Museum'],
    gradient: 'from-indigo-600 to-purple-600'
  },
  
  'string-search-time-large': {
    name: 'KMP (Knuth-Morris-Pratt)',
    category: 'String',
    complexity: { time: 'O(n + m)', space: 'O(m)' },
    description: 'Efficient pattern matching using preprocessing to avoid redundant comparisons.',
    whenToUse: 'Pattern matching in large texts, single pattern',
    alternatives: ['Boyer-Moore', 'Rabin-Karp'],
    codeSnippet: `function kmp(text, pattern) {
  const lps = computeLPS(pattern);
  let i = 0, j = 0, matches = [];
  
  while (i < text.length) {
    if (text[i] === pattern[j]) { i++; j++; }
    if (j === pattern.length) {
      matches.push(i - j);
      j = lps[j - 1];
    } else if (i < text.length && text[i] !== pattern[j]) {
      j !== 0 ? j = lps[j - 1] : i++;
    }
  }
  return matches;
}`,
    learningResources: ['Museum: 1968 KMP', 'Drill Coach'],
    gradient: 'from-green-600 to-teal-600'
  },
  
  'string-transform-simplicity-small': {
    name: 'Two Pointers',
    category: 'String',
    complexity: { time: 'O(n)', space: 'O(1)' },
    description: 'Simple pattern using two pointers to traverse from both ends.',
    whenToUse: 'Palindrome checks, reversals, partitioning',
    alternatives: ['Hash Table', 'Sliding Window'],
    codeSnippet: `function isPalindrome(s) {
  let left = 0, right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
    learningResources: ['Debug-the-Bug: Palindrome', 'Playground'],
    gradient: 'from-teal-600 to-cyan-600'
  },
  
  'tree-search-time-medium': {
    name: 'Binary Search Tree (BST)',
    category: 'Tree',
    complexity: { time: 'O(log n) avg, O(n) worst', space: 'O(1)' },
    description: 'Tree structure where left < parent < right, enables binary search.',
    whenToUse: 'Dynamic sorted data with insert/delete/search operations',
    alternatives: ['AVL Tree', 'Red-Black Tree', 'B-Tree'],
    codeSnippet: `function bstSearch(root, key) {
  if (!root || root.val === key) return root;
  if (key < root.val) return bstSearch(root.left, key);
  return bstSearch(root.right, key);
}`,
    learningResources: ['Museum: 1962 AVL Trees', 'Drill Coach: BST'],
    gradient: 'from-orange-600 to-red-600'
  },
  
  'tree-validate-time-small': {
    name: 'Tree Traversal (Inorder/Preorder/Postorder)',
    category: 'Tree',
    complexity: { time: 'O(n)', space: 'O(h)' },
    description: 'Systematic ways to visit all nodes in a tree.',
    whenToUse: 'Processing/validating tree structures, expression evaluation',
    alternatives: ['Level-order (BFS)', 'Morris Traversal'],
    codeSnippet: `function inorder(root, result = []) {
  if (root) {
    inorder(root.left, result);
    result.push(root.val);
    inorder(root.right, result);
  }
  return result;
}`,
    learningResources: ['Drill Coach: Tree Traversal', 'Museum'],
    gradient: 'from-yellow-600 to-amber-600'
  },
  
  'collection-search-time-large': {
    name: 'Hash Table',
    category: 'Data Structure',
    complexity: { time: 'O(1) avg', space: 'O(n)' },
    description: 'Key-value store with constant-time average operations.',
    whenToUse: 'Fast lookups, counting, caching, deduplication',
    alternatives: ['Binary Search', 'Trie'],
    codeSnippet: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    learningResources: ['Debug-the-Bug: Two Sum', 'Drill Coach: Hash Table'],
    gradient: 'from-violet-600 to-purple-600'
  },
  
  'default': {
    name: 'Linear Search / Brute Force',
    category: 'Basic',
    complexity: { time: 'O(n)', space: 'O(1)' },
    description: 'Simple sequential search through all elements.',
    whenToUse: 'Small datasets, unsorted data, prototyping',
    alternatives: ['Binary Search (if sorted)', 'Hash Table'],
    codeSnippet: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
    learningResources: ['Playground', 'Drill Coach'],
    gradient: 'from-gray-600 to-slate-600'
  }
};

// ============================================================================
// RECOMMENDATION ENGINE
// ============================================================================

function getRecommendation(answers) {
  const { domain, goal, constraints, size } = answers;
  
  if (domain === 'array') {
    if (goal === 'sort') {
      if (size === 'small') return 'array-sort-simplicity-small';
      if (constraints === 'stability') return 'array-sort-stability-medium';
      if (constraints === 'time' || size === 'large' || size === 'huge') return 'array-sort-time-large';
      return 'array-sort-stability-medium';
    }
    if (goal === 'search') return 'array-search-time-large';
  }
  
  if (domain === 'graph') {
    if (goal === 'path') {
      if (constraints === 'optimize' || size === 'large') return 'graph-path-optimize-large';
      return 'graph-path-time-medium';
    }
    if (goal === 'validate') return 'graph-validate-time-medium';
  }
  
  if (domain === 'string') {
    if (goal === 'search') return 'string-search-time-large';
    if (goal === 'transform' || goal === 'validate') return 'string-transform-simplicity-small';
  }
  
  if (domain === 'tree') {
    if (goal === 'search') return 'tree-search-time-medium';
    if (goal === 'validate') return 'tree-validate-time-small';
  }
  
  if (domain === 'collection') {
    if (goal === 'search') return 'collection-search-time-large';
  }
  
  return 'default';
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AlgorithmRecommender = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState([]);
  
  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;
  
  const recommendation = useMemo(() => {
    if (!showResult) return null;
    const key = getRecommendation(answers);
    return ALGORITHM_DATABASE[key];
  }, [showResult, answers]);
  
  const handleAnswer = useCallback((value) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
    
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResult(true);
      const key = getRecommendation(newAnswers);
      const newEntry = {
        answers: newAnswers,
        recommendation: ALGORITHM_DATABASE[key].name,
        category: ALGORITHM_DATABASE[key].category,
        timestamp: new Date().toISOString(),
        id: Date.now()
      };
      setHistory(prev => [newEntry, ...prev].slice(0, 30));
    }
  }, [currentStep, currentQuestion, answers]);
  
  const restart = useCallback(() => {
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
  }, []);
  
  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);
  
  const loadFromHistory = useCallback((entry) => {
    setAnswers(entry.answers);
    setCurrentStep(QUESTIONS.length - 1);
    setShowResult(true);
  }, []);

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
            🧭 Algorithm Recommender
          </h1>
          <p className="text-lg text-indigo-300">
            Answer a few questions to find the perfect algorithm for your problem
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="questionnaire"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Progress Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-indigo-300 flex items-center gap-2">
                    <TrendingUp size={16} />
                    Step {currentStep + 1} of {QUESTIONS.length}
                  </span>
                  <span className="text-sm font-bold text-indigo-400">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-indigo-800">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>

              {/* Question Card */}
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4 }}
                className="mb-8 bg-gray-800/80 backdrop-blur-sm border-2 border-indigo-700 rounded-xl p-8 shadow-2xl"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-xl font-bold">
                    {currentStep + 1}
                  </div>
                  {currentQuestion.title}
                </h2>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      onClick={() => handleAnswer(option.value)}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      className="group relative p-6 bg-gray-900/50 border-2 border-indigo-600 rounded-xl text-left overflow-hidden transition-all hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                      
                      <div className="relative flex items-center gap-4 mb-2">
                        <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform`}>
                          {option.icon}
                        </div>
                        <span className="font-semibold text-lg text-white group-hover:text-cyan-300 transition-colors">
                          {option.label}
                        </span>
                      </div>
                      
                      <ChevronRight className="absolute top-1/2 right-4 transform -translate-y-1/2 text-indigo-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={24} />
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Navigation */}
              <div className="flex gap-4">
                {currentStep > 0 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={goBack}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-all"
                  >
                    <ChevronLeft size={20} />
                    Back
                  </motion.button>
                )}
                <motion.button
                  onClick={restart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500 text-red-400 font-semibold transition-all"
                >
                  <RotateCcw size={20} />
                  Restart
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              {/* Recommendation Result */}
              <div className="mb-8 bg-gray-800/80 backdrop-blur-sm border-2 border-indigo-700 rounded-xl p-8 shadow-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="text-7xl mb-4"
                  >
                    🎯
                  </motion.div>
                  <h2 className={`text-4xl font-bold mb-3 bg-gradient-to-r ${recommendation.gradient} bg-clip-text text-transparent`}>
                    {recommendation.name}
                  </h2>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${recommendation.gradient} rounded-full text-white font-semibold shadow-lg`}>
                    <Sparkles size={16} />
                    {recommendation.category}
                  </span>
                </motion.div>

                <div className="space-y-6">
                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 bg-indigo-900/30 border border-indigo-700 rounded-lg"
                  >
                    <h3 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                      <BookOpen size={16} />
                      Description
                    </h3>
                    <p className="text-gray-300">{recommendation.description}</p>
                  </motion.div>

                  {/* Complexity */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid md:grid-cols-2 gap-4"
                  >
                    <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
                      <h3 className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-2">
                        <Clock size={16} />
                        Time Complexity
                      </h3>
                      <code className="text-lg text-blue-400 font-mono">{recommendation.complexity.time}</code>
                    </div>
                    <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
                      <h3 className="text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
                        <Database size={16} />
                        Space Complexity
                      </h3>
                      <code className="text-lg text-green-400 font-mono">{recommendation.complexity.space}</code>
                    </div>
                  </motion.div>

                  {/* When to Use */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-4 bg-amber-900/30 border border-amber-700 rounded-lg"
                  >
                    <h3 className="text-sm font-semibold text-amber-300 mb-2 flex items-center gap-2">
                      <Target size={16} />
                      When to Use
                    </h3>
                    <p className="text-gray-300">{recommendation.whenToUse}</p>
                  </motion.div>

                  {/* Code Example */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="text-sm font-semibold text-indigo-300 mb-3 flex items-center gap-2">
                      <Code size={16} />
                      Code Example
                    </h3>
                    <pre className="p-4 bg-gray-900 border border-gray-700 rounded-lg overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono">
                        {recommendation.codeSnippet}
                      </code>
                    </pre>
                  </motion.div>

                  {/* Alternatives */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h3 className="text-sm font-semibold text-indigo-300 mb-3 flex items-center gap-2">
                      <CheckCircle size={16} />
                      Alternatives to Consider
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.alternatives.map((alt, idx) => (
                        <span key={idx} className="px-3 py-2 bg-gray-700 border border-gray-600 text-gray-300 rounded-lg text-sm">
                          {alt}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Learning Resources */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="p-4 bg-purple-900/30 border border-purple-700 rounded-lg"
                  >
                    <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                      <Lightbulb size={16} />
                      Learn More
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.learningResources.map((resource, idx) => (
                        <span key={idx} className="px-3 py-1 bg-purple-600/30 border border-purple-500/50 text-purple-300 rounded-md text-xs">
                          {resource}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  onClick={restart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-8 px-6 py-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2"
                >
                  <RotateCcw size={20} />
                  Try Another Problem
                </motion.button>
              </div>

              {/* Your Answers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
              >
                <h3 className="font-semibold text-indigo-300 mb-4 flex items-center gap-2">
                  <CheckCircle size={18} />
                  Your Answers
                </h3>
                <div className="space-y-3">
                  {QUESTIONS.map((q) => {
                    const answer = answers[q.id];
                    const option = q.options.find(o => o.value === answer);
                    return (
                      <div key={q.id} className="flex items-center justify-between text-sm p-3 bg-gray-900/50 rounded-lg">
                        <span className="text-gray-400">{q.title}</span>
                        <span className="font-medium text-white flex items-center gap-2">
                          <span className="text-xl">{option?.icon}</span>
                          {option?.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        {history.length > 0 && !showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
          >
            <h3 className="font-semibold text-indigo-300 mb-4 flex items-center gap-2">
              <History size={18} />
              Recent Recommendations ({history.length})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.slice(0, 10).map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 4 }}
                  onClick={() => loadFromHistory(entry)}
                  className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-indigo-600 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-semibold text-white">{entry.recommendation}</span>
                      <span className="text-gray-500 mx-2">·</span>
                      <span className="text-indigo-400">{entry.category}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmRecommender;
