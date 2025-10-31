import React, { useEffect, useState, useCallback, useMemo } from 'react'

// ============================================================================
// COMPREHENSIVE QUESTION BANK
// ============================================================================

const QUESTION_BANK = [
  // Time Complexity Questions
  {
    id: 'tc-binary-search',
    category: 'time-complexity',
    difficulty: 'easy',
    prompt: 'What is the average time complexity of Binary Search?',
    choices: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
    answer: 1,
    hint: 'Halves the search space each step',
    explanation: 'Binary search divides the array in half at each step, leading to O(log n) time.'
  },
  {
    id: 'tc-quick-sort',
    category: 'time-complexity',
    difficulty: 'medium',
    prompt: 'What is the average time complexity of Quick Sort?',
    choices: ['O(n log n)', 'O(n²)', 'O(log n)', 'O(n)'],
    answer: 0,
    hint: 'Divide-and-conquer with partitioning',
    explanation: 'Quick Sort recursively partitions the array, averaging O(n log n) comparisons.'
  },
  {
    id: 'tc-bubble-sort',
    category: 'time-complexity',
    difficulty: 'easy',
    prompt: 'What is the worst-case time complexity of Bubble Sort?',
    choices: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    answer: 2,
    hint: 'Nested loops over the array',
    explanation: 'Bubble Sort uses nested loops, resulting in O(n²) in the worst case.'
  },
  
  // Stability Questions
  {
    id: 'stable-merge',
    category: 'stability',
    difficulty: 'easy',
    prompt: 'Which of these sorts is stable?',
    choices: ['Quick Sort', 'Merge Sort', 'Heap Sort', 'Selection Sort'],
    answer: 1,
    hint: 'Merges preserve equal order',
    explanation: 'Merge Sort maintains relative order of equal elements, making it stable.'
  },
  {
    id: 'stable-insertion',
    category: 'stability',
    difficulty: 'easy',
    prompt: 'Is Insertion Sort stable?',
    choices: ['Yes', 'No', 'Only if optimized', 'Depends on input'],
    answer: 0,
    hint: 'Equal elements are not reordered',
    explanation: 'Insertion Sort only swaps when strictly necessary, preserving stability.'
  },
  
  // Data Structure Questions
  {
    id: 'ds-fifo',
    category: 'data-structures',
    difficulty: 'easy',
    prompt: 'Best data structure for FIFO (First In First Out)?',
    choices: ['Stack', 'Queue', 'Heap', 'Hash Table'],
    answer: 1,
    hint: 'First In First Out',
    explanation: 'Queue implements FIFO: enqueue at rear, dequeue from front.'
  },
  {
    id: 'ds-lifo',
    category: 'data-structures',
    difficulty: 'easy',
    prompt: 'Best data structure for LIFO (Last In First Out)?',
    choices: ['Queue', 'Stack', 'Array', 'Linked List'],
    answer: 1,
    hint: 'Last In First Out',
    explanation: 'Stack implements LIFO: push and pop from the same end.'
  },
  {
    id: 'ds-bst-search',
    category: 'data-structures',
    difficulty: 'medium',
    prompt: 'Average search time in a balanced BST?',
    choices: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    answer: 1,
    hint: 'Binary tree property divides space',
    explanation: 'Balanced BST height is O(log n), so search takes O(log n).'
  },
  
  // Graph Questions
  {
    id: 'graph-dijkstra',
    category: 'graphs',
    difficulty: 'medium',
    prompt: 'Dijkstra algorithm finds what?',
    choices: ['Minimum spanning tree', 'Shortest path', 'Maximum flow', 'Topological order'],
    answer: 1,
    hint: 'Single-source shortest paths',
    explanation: 'Dijkstra computes shortest paths from a source to all vertices.'
  },
  {
    id: 'graph-bfs-complexity',
    category: 'graphs',
    difficulty: 'medium',
    prompt: 'Time complexity of BFS on a graph with V vertices and E edges?',
    choices: ['O(V)', 'O(E)', 'O(V + E)', 'O(V × E)'],
    answer: 2,
    hint: 'Visit all vertices and edges once',
    explanation: 'BFS visits each vertex and edge exactly once: O(V + E).'
  },
  
  // Space Complexity
  {
    id: 'sc-merge-sort',
    category: 'space-complexity',
    difficulty: 'medium',
    prompt: 'Space complexity of Merge Sort?',
    choices: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    answer: 2,
    hint: 'Requires auxiliary array for merging',
    explanation: 'Merge Sort needs O(n) extra space for temporary arrays during merge.'
  },
  {
    id: 'sc-quick-sort',
    category: 'space-complexity',
    difficulty: 'medium',
    prompt: 'Space complexity of in-place Quick Sort?',
    choices: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    answer: 1,
    hint: 'Recursion stack depth',
    explanation: 'Quick Sort uses O(log n) stack space for recursion on average.'
  },
  
  // Advanced Algorithms
  {
    id: 'adv-dynamic-programming',
    category: 'advanced',
    difficulty: 'hard',
    prompt: 'Dynamic Programming is based on which principle?',
    choices: ['Divide and Conquer', 'Greedy Choice', 'Optimal Substructure', 'Backtracking'],
    answer: 2,
    hint: 'Stores solutions to subproblems',
    explanation: 'DP relies on optimal substructure and overlapping subproblems.'
  },
  {
    id: 'adv-greedy',
    category: 'advanced',
    difficulty: 'hard',
    prompt: 'Which problem is NOT solved by Greedy?',
    choices: ['Huffman Coding', 'Dijkstra', '0/1 Knapsack', 'Prim\'s MST'],
    answer: 2,
    hint: 'Greedy fails when subproblems overlap',
    explanation: '0/1 Knapsack requires DP; greedy doesn\'t guarantee optimal.'
  },
  
  // Practical Applications
  {
    id: 'app-hash-table',
    category: 'applications',
    difficulty: 'easy',
    prompt: 'Average lookup time in a hash table?',
    choices: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    answer: 0,
    hint: 'Direct index access',
    explanation: 'Hash tables provide O(1) average-case lookup via hash function.'
  },
  {
    id: 'app-tree-traversal',
    category: 'applications',
    difficulty: 'medium',
    prompt: 'Which traversal visits root between left and right subtrees?',
    choices: ['Preorder', 'Inorder', 'Postorder', 'Level-order'],
    answer: 1,
    hint: 'Left → Root → Right',
    explanation: 'Inorder traversal: left subtree, root, right subtree.'
  }
]

// ============================================================================
// STORAGE
// ============================================================================

const STORAGE_KEYS = {
  HIGH_SCORE: 'drill_coach_high_score',
  STREAK: 'drill_coach_streak',
  HISTORY: 'drill_coach_history'
}

function getHighScore() {
  return parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE) || '0', 10)
}

function saveHighScore(score) {
  const current = getHighScore()
  if (score > current) {
    localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString())
    return true
  }
  return false
}

function getStreak() {
  return parseInt(localStorage.getItem(STORAGE_KEYS.STREAK) || '0', 10)
}

function saveStreak(streak) {
  localStorage.setItem(STORAGE_KEYS.STREAK, streak.toString())
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]')
  } catch {
    return []
  }
}

function saveHistory(entry) {
  try {
    const history = getHistory()
    history.unshift({ ...entry, timestamp: new Date().toISOString(), id: Date.now() })
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 50)))
  } catch (e) {
    console.warn('Failed to save history:', e)
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DrillCoach() {
  const [gameState, setGameState] = useState('menu') // menu, playing, finished
  const [difficulty, setDifficulty] = useState('mixed')
  const [timeLimit, setTimeLimit] = useState(60)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [showHint, setShowHint] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState([])
  const [highScore, setHighScore] = useState(getHighScore())
  const [history, setHistory] = useState(getHistory())
  
  const questions = useMemo(() => {
    let filtered = QUESTION_BANK
    if (difficulty !== 'mixed') {
      filtered = QUESTION_BANK.filter(q => q.difficulty === difficulty)
    }
    // Shuffle questions
    return [...filtered].sort(() => Math.random() - 0.5)
  }, [difficulty])
  
  const currentQuestion = questions[currentQuestionIdx]
  
  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [gameState])
  
  const startGame = useCallback(() => {
    setGameState('playing')
    setCurrentQuestionIdx(0)
    setScore(0)
    setStreak(0)
    setTimeRemaining(timeLimit)
    setShowHint(false)
    setAnsweredQuestions([])
  }, [timeLimit])
  
  const endGame = useCallback(() => {
    setGameState('finished')
    
    const isNewHighScore = saveHighScore(score)
    if (isNewHighScore) {
      setHighScore(score)
    }
    
    saveHistory({
      score,
      totalQuestions: answeredQuestions.length,
      correct: answeredQuestions.filter(a => a.correct).length,
      difficulty,
      timeLimit
    })
    
    setHistory(getHistory())
  }, [score, answeredQuestions, difficulty, timeLimit])
  
  const handleAnswer = useCallback((choiceIdx) => {
    const isCorrect = choiceIdx === currentQuestion.answer
    const points = isCorrect ? (showHint ? 5 : 10) : 0
    const newStreak = isCorrect ? streak + 1 : 0
    
    setScore(prev => prev + points + (newStreak >= 3 ? 5 : 0)) // Streak bonus
    setStreak(newStreak)
    
    setAnsweredQuestions(prev => [...prev, {
      questionId: currentQuestion.id,
      correct: isCorrect,
      points,
      usedHint: showHint
    }])
    
    // Move to next question
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1)
      setShowHint(false)
    } else {
      endGame()
    }
  }, [currentQuestion, showHint, streak, currentQuestionIdx, questions.length, endGame])
  
  const skipQuestion = useCallback(() => {
    setAnsweredQuestions(prev => [...prev, {
      questionId: currentQuestion.id,
      correct: false,
      points: 0,
      skipped: true
    }])
    
    setStreak(0)
    
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1)
      setShowHint(false)
    } else {
      endGame()
    }
  }, [currentQuestion, currentQuestionIdx, questions.length, endGame])

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-300">
              🎯 Drill Coach
            </h1>
            <p className="text-sm text-gray-300">
              Test your algorithm knowledge against the clock
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-6 border border-gray-800 rounded-xl bg-gradient-to-b from-gray-800/60 to-gray-800/30 shadow-md">
              <div className="text-3xl font-bold text-cyan-300">{highScore}</div>
              <div className="text-xs text-gray-400">High Score</div>
            </div>
            <div className="p-6 border border-gray-800 rounded-xl bg-gradient-to-b from-gray-800/60 to-gray-800/30 shadow-md">
              <div className="text-3xl font-bold text-indigo-300">{history.length}</div>
              <div className="text-xs text-gray-400">Games Played</div>
            </div>
          </div>

          {/* Settings */}
          <div className="mb-8 p-6 border border-gray-800 rounded-xl bg-gradient-to-b from-gray-850/60 to-gray-850/30 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">Game Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Difficulty
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['easy', 'medium', 'hard', 'mixed'].map(diff => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        difficulty === diff
                          ? 'bg-indigo-500 text-white shadow'
                          : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      }`}
                    >
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Time Limit: <span className="font-semibold text-indigo-300">{timeLimit}</span> seconds
                </label>
                <input
                  type="range"
                  min="30"
                  max="180"
                  step="30"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-400"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>30s</span>
                  <span>180s</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full px-8 py-4 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-black font-bold text-lg hover:from-indigo-600 hover:to-cyan-300 shadow-2xl active:scale-95 transition-all"
          >
            🚀 Start Drill
          </button>

          {/* History */}
          {history.length > 0 && (
            <div className="mt-8 p-6 border border-gray-800 rounded-xl bg-gradient-to-b from-gray-800/60 to-gray-800/30 shadow-md">
              <h3 className="font-semibold text-gray-100 mb-4">Recent Games</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.slice(0, 10).map((game) => (
                  <div
                    key={game.id}
                    className="p-3 border border-gray-800 rounded-lg flex items-center justify-between hover:bg-gray-800/40 transition-colors"
                  >
                    <div className="text-sm">
                      <span className="font-medium text-gray-100">{game.score} points</span>
                      {' · '}
                      <span className="text-gray-400">
                        {game.correct}/{game.totalQuestions} correct
                      </span>
                      {' · '}
                      <span className="text-gray-400">{game.difficulty}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(game.timestamp).toLocaleDateString()}
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

  // Game Screen
  if (gameState === 'playing') {
    const progress = ((currentQuestionIdx + 1) / questions.length) * 100
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white px-6 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 p-5 border border-gray-800 rounded-xl bg-gradient-to-b from-gray-850/60 to-gray-850/30 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-300">{score}</div>
                  <div className="text-xs text-gray-400">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">
                    {streak >= 3 ? '🔥' : ''} {streak}
                  </div>
                  <div className="text-xs text-gray-400">Streak</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className={`text-3xl font-bold ${timeRemaining <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-100'}`}>
                  {timeRemaining}s
                </div>
                <div className="text-xs text-gray-400">Time Left</div>
              </div>
            </div>
            
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-gray-400 text-center">
              Question {currentQuestionIdx + 1} of {questions.length}
            </div>
          </div>

          {/* Question Card */}
          <div className="mb-6 p-6 border border-gray-800 rounded-xl bg-gradient-to-b from-gray-850/50 to-gray-850/20 shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-indigo-700 text-indigo-100 rounded text-xs font-medium">
                    {currentQuestion.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    currentQuestion.difficulty === 'easy'
                      ? 'bg-emerald-700 text-emerald-100'
                      : currentQuestion.difficulty === 'medium'
                      ? 'bg-yellow-600 text-yellow-100'
                      : 'bg-red-700 text-red-100'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-100">
                  {currentQuestion.prompt}
                </h2>
              </div>
              
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-3 py-1.5 text-sm border border-gray-700 text-gray-200 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                {showHint ? 'Hide' : 'Show'} Hint (-5 pts)
              </button>
            </div>

            {showHint && (
              <div className="mb-4 p-3 bg-gray-800/60 border border-gray-700 rounded-lg">
                <p className="text-sm text-gray-300">💡 {currentQuestion.hint}</p>
              </div>
            )}

            <div className="space-y-3">
              {currentQuestion.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="w-full p-4 border-2 border-gray-700 rounded-lg text-left hover:border-cyan-400 hover:bg-gray-800/50 transition-all active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-gray-200 font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-gray-100">{choice}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 flex justify-between">
              <button
                onClick={skipQuestion}
                className="px-4 py-2 text-sm text-gray-300 hover:text-gray-100 transition-colors"
              >
                Skip Question →
              </button>
              <button
                onClick={endGame}
                className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                End Game
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Finished Screen
  if (gameState === 'finished') {
    const correct = answeredQuestions.filter(a => a.correct).length
    const accuracy = ((correct / answeredQuestions.length) * 100) || 0
    const isNewHighScore = score === highScore && score > 0
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-300">
              {isNewHighScore ? '🏆 New High Score!' : 'Game Over'}
            </h1>
          </div>

          {/* Final Score */}
          <div className="mb-6 p-8 border-2 border-gray-800 rounded-xl bg-gradient-to-b from-gray-850/60 to-gray-850/30 shadow-lg text-center">
            <div className="text-6xl font-bold text-cyan-300 mb-2">{score}</div>
            <div className="text-gray-300">Final Score</div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 border border-gray-800 rounded-xl bg-gradient-to-b from-gray-850/60 to-gray-850/30 text-center">
              <div className="text-2xl font-bold text-emerald-300">{correct}</div>
              <div className="text-xs text-gray-400">Correct</div>
            </div>
            <div className="p-4 border border-gray-800 rounded-xl bg-gradient-to-b from-gray-850/60 to-gray-850/30 text-center">
              <div className="text-2xl font-bold text-indigo-300">{accuracy.toFixed(0)}%</div>
              <div className="text-xs text-gray-400">Accuracy</div>
            </div>
            <div className="p-4 border border-gray-800 rounded-xl bg-gradient-to-b from-gray-850/60 to-gray-850/30 text-center">
              <div className="text-2xl font-bold text-purple-300">{answeredQuestions.length}</div>
              <div className="text-xs text-gray-400">Questions</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={startGame}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-black font-semibold hover:from-indigo-600 hover:to-cyan-300 shadow-md active:scale-95 transition-all"
            >
              🔄 Play Again
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-800 text-gray-200 font-semibold hover:bg-gray-800/40 active:scale-95 transition-all"
            >
              🏠 Main Menu
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
