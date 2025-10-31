import React, { useState, useMemo, useCallback } from 'react'

// ============================================================================
// COMPREHENSIVE DECISION TREE DATABASE
// ============================================================================

const QUESTIONS = [
  {
    id: 'domain',
    step: 1,
    title: 'What type of data are you working with?',
    options: [
      { value: 'array', label: 'Arrays / Lists / Numbers', icon: '📊' },
      { value: 'string', label: 'Strings / Text', icon: '📝' },
      { value: 'graph', label: 'Graphs / Networks', icon: '🕸️' },
      { value: 'tree', label: 'Trees / Hierarchies', icon: '🌳' },
      { value: 'collection', label: 'Collections / Sets', icon: '📦' }
    ]
  },
  {
    id: 'goal',
    step: 2,
    title: 'What is your primary goal?',
    options: [
      { value: 'search', label: 'Find / Search for element', icon: '🔍' },
      { value: 'sort', label: 'Sort / Order data', icon: '⬆️' },
      { value: 'path', label: 'Find path / connection', icon: '🛤️' },
      { value: 'optimize', label: 'Optimize / Minimize cost', icon: '⚡' },
      { value: 'validate', label: 'Validate / Check structure', icon: '✅' },
      { value: 'transform', label: 'Transform / Process data', icon: '🔄' }
    ]
  },
  {
    id: 'constraints',
    step: 3,
    title: 'What constraints matter most?',
    options: [
      { value: 'time', label: 'Speed / Time complexity', icon: '⏱️' },
      { value: 'space', label: 'Memory / Space efficiency', icon: '💾' },
      { value: 'stability', label: 'Preserve order (stable)', icon: '🔒' },
      { value: 'simplicity', label: 'Code simplicity', icon: '🎯' },
      { value: 'balanced', label: 'Balanced performance', icon: '⚖️' }
    ]
  },
  {
    id: 'size',
    step: 4,
    title: 'How large is your dataset?',
    options: [
      { value: 'small', label: 'Small (< 100)', icon: '🔬' },
      { value: 'medium', label: 'Medium (100 - 10K)', icon: '📊' },
      { value: 'large', label: 'Large (10K - 1M)', icon: '🏗️' },
      { value: 'huge', label: 'Huge (1M+)', icon: '🌐' }
    ]
  }
]

const ALGORITHM_DATABASE = {
  // Array/Sorting
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
    learningResources: ['Visualizer: Race Day', 'Lab: What-If Performance']
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
    learningResources: ['Visualizer: Recurrence Tree', 'Museum: 1945 Merge Sort']
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
    learningResources: ['Race Day', 'What-If Lab']
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
    learningResources: ['Debug-the-Bug: Binary Search', 'Playground: Binary Search']
  },
  
  // Graph Algorithms
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
    learningResources: ['Museum: 1956 Dijkstra', 'Drill Coach: Graph Questions']
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
    learningResources: ['Museum: Dynamic Programming', 'Drill Coach']
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
    learningResources: ['Drill Coach: Graph Complexity', 'Museum']
  },
  
  // String Algorithms
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
    learningResources: ['Museum: 1968 KMP', 'Drill Coach']
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
    learningResources: ['Debug-the-Bug: Palindrome', 'Playground']
  },
  
  // Tree Algorithms
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
    learningResources: ['Museum: 1962 AVL Trees', 'Drill Coach: BST']
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
    learningResources: ['Drill Coach: Tree Traversal', 'Museum']
  },
  
  // Collection/Hash
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
    learningResources: ['Debug-the-Bug: Two Sum', 'Drill Coach: Hash Table']
  },
  
  // Default fallback
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
    learningResources: ['Playground', 'Drill Coach']
  }
}

// ============================================================================
// RECOMMENDATION ENGINE
// ============================================================================

function getRecommendation(answers) {
  const { domain, goal, constraints, size } = answers
  
  // Decision tree logic
  if (domain === 'array') {
    if (goal === 'sort') {
      if (size === 'small') return 'array-sort-simplicity-small'
      if (constraints === 'stability') return 'array-sort-stability-medium'
      if (constraints === 'time' || size === 'large' || size === 'huge') return 'array-sort-time-large'
      return 'array-sort-stability-medium'
    }
    if (goal === 'search') {
      return 'array-search-time-large'
    }
  }
  
  if (domain === 'graph') {
    if (goal === 'path') {
      if (constraints === 'optimize' || size === 'large') return 'graph-path-optimize-large'
      return 'graph-path-time-medium'
    }
    if (goal === 'validate') return 'graph-validate-time-medium'
  }
  
  if (domain === 'string') {
    if (goal === 'search') return 'string-search-time-large'
    if (goal === 'transform' || goal === 'validate') return 'string-transform-simplicity-small'
  }
  
  if (domain === 'tree') {
    if (goal === 'search') return 'tree-search-time-medium'
    if (goal === 'validate') return 'tree-validate-time-small'
  }
  
  if (domain === 'collection') {
    if (goal === 'search') return 'collection-search-time-large'
  }
  
  return 'default'
}

// ============================================================================
// STORAGE
// ============================================================================

const STORAGE_KEY = 'algo_recommender_history'

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveHistory(entry) {
  try {
    const history = getHistory()
    history.unshift({ ...entry, timestamp: new Date().toISOString(), id: Date.now() })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 30)))
  } catch (e) {
    console.warn('Failed to save history:', e)
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AlgorithmRecommender() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [history, setHistory] = useState(getHistory())
  
  const currentQuestion = QUESTIONS[currentStep]
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100
  
  const recommendation = useMemo(() => {
    if (!showResult) return null
    const key = getRecommendation(answers)
    return ALGORITHM_DATABASE[key]
  }, [showResult, answers])
  
  const handleAnswer = useCallback((value) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value }
    setAnswers(newAnswers)
    
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setShowResult(true)
      const key = getRecommendation(newAnswers)
      saveHistory({
        answers: newAnswers,
        recommendation: ALGORITHM_DATABASE[key].name,
        category: ALGORITHM_DATABASE[key].category
      })
      setHistory(getHistory())
    }
  }, [currentStep, currentQuestion, answers])
  
  const restart = useCallback(() => {
    setCurrentStep(0)
    setAnswers({})
    setShowResult(false)
  }, [])
  
  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])
  
  const loadFromHistory = useCallback((entry) => {
    setAnswers(entry.answers)
    setCurrentStep(QUESTIONS.length - 1)
    setShowResult(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-600">
            🧭 Algorithm Recommender
          </h1>
          <p className="text-sm text-slate-600">
            Answer a few questions to find the perfect algorithm for your problem
          </p>
        </div>

        {!showResult ? (
          <>
            {/* Progress Bar */}
            <div className="mb-6 p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Step {currentStep + 1} of {QUESTIONS.length}
                </span>
                <span className="text-sm text-slate-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="mb-6 p-8 border border-slate-200 rounded-xl bg-white shadow-lg">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                {currentQuestion.title}
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className="p-5 border-2 border-slate-300 rounded-xl text-left hover:border-purple-500 hover:bg-purple-50 transition-all active:scale-95 group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl group-hover:scale-110 transition-transform">
                        {option.icon}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={goBack}
                  className="px-6 py-3 rounded-lg border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 active:scale-95 transition-all"
                >
                  ← Back
                </button>
              )}
              <button
                onClick={restart}
                className="px-6 py-3 rounded-lg border-2 border-red-300 text-red-700 font-semibold hover:bg-red-50 active:scale-95 transition-all"
              >
                🔄 Restart
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Recommendation Result */}
            <div className="mb-6 p-8 border-2 border-purple-300 rounded-xl bg-white shadow-xl">
              <div className="text-center mb-6">
                <div className="text-6xl mb-3">🎯</div>
                <h2 className="text-3xl font-bold text-purple-600 mb-2">
                  {recommendation.name}
                </h2>
                <span className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {recommendation.category}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-1">Description</h3>
                  <p className="text-slate-600">{recommendation.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-sm font-semibold text-blue-900 mb-1">Time Complexity</h3>
                    <code className="text-blue-700">{recommendation.complexity.time}</code>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="text-sm font-semibold text-green-900 mb-1">Space Complexity</h3>
                    <code className="text-green-700">{recommendation.complexity.space}</code>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-amber-900 mb-1">When to Use</h3>
                  <p className="text-sm text-amber-800">{recommendation.whenToUse}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Code Example</h3>
                  <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-xs font-mono">
                    {recommendation.codeSnippet}
                  </pre>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Alternatives to Consider</h3>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.alternatives.map((alt, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-purple-900 mb-2">📚 Learn More</h3>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.learningResources.map((resource, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white border border-purple-300 text-purple-700 rounded-lg text-xs">
                        {resource}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={restart}
                  className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 shadow-md active:scale-95 transition-all"
                >
                  🔄 Try Another Problem
                </button>
              </div>
            </div>

            {/* Your Answers */}
            <div className="mb-6 p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-3">Your Answers</h3>
              <div className="space-y-2">
                {QUESTIONS.map((q) => {
                  const answer = answers[q.id]
                  const option = q.options.find(o => o.value === answer)
                  return (
                    <div key={q.id} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{q.title}</span>
                      <span className="font-medium text-slate-800">
                        {option?.icon} {option?.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* History */}
        {history.length > 0 && !showResult && (
          <div className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">📊 Recent Recommendations</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => loadFromHistory(entry)}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">{entry.recommendation}</span>
                      {' · '}
                      <span className="text-slate-600">{entry.category}</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
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
