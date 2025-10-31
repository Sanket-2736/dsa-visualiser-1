import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Star, Zap, Brain, Target } from 'lucide-react';

const ALGORITHM_CARDS = [
  {
    id: 'merge',
    name: 'Merge Sort',
    icon: '🔀',
    traits: ['Stable', 'Predictable O(n log n)', 'Divide & Conquer'],
    description: 'Splits the array recursively and merges sorted halves.',
    complexity: { time: 'O(n log n)', space: 'O(n)' },
    bestFor: 'Large datasets requiring stability',
    color: 'from-emerald-600 to-emerald-800',
    bgAccent: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500',
  },
  {
    id: 'insertion',
    name: 'Insertion Sort',
    icon: '📌',
    traits: ['Simple', 'Great on nearly-sorted', 'In-place'],
    description: 'Builds sorted array one element at a time.',
    complexity: { time: 'O(n²)', space: 'O(1)' },
    bestFor: 'Small or nearly sorted datasets',
    color: 'from-amber-600 to-amber-800',
    bgAccent: 'bg-amber-500/20',
    borderColor: 'border-amber-500',
  },
  {
    id: 'binary',
    name: 'Binary Search',
    icon: '🎯',
    traits: ['Precise', 'Log-time', 'Requires sorted input'],
    description: 'Divides search space in half each iteration.',
    complexity: { time: 'O(log n)', space: 'O(1)' },
    bestFor: 'Searching in sorted arrays',
    color: 'from-sky-600 to-sky-800',
    bgAccent: 'bg-sky-500/20',
    borderColor: 'border-sky-500',
  },
  {
    id: 'mst',
    name: 'MST (Kruskal)',
    icon: '🌳',
    traits: ['Frugal', 'Spanning', 'Greedy approach'],
    description: 'Finds minimum spanning tree using Union-Find.',
    complexity: { time: 'O(E log E)', space: 'O(V)' },
    bestFor: 'Network design, clustering',
    color: 'from-indigo-600 to-indigo-800',
    bgAccent: 'bg-indigo-500/20',
    borderColor: 'border-indigo-500',
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    icon: '⚡',
    traits: ['Fast average case', 'In-place', 'Cache-friendly'],
    description: 'Picks pivot and partitions around it recursively.',
    complexity: { time: 'O(n log n) avg', space: 'O(log n)' },
    bestFor: 'General purpose sorting',
    color: 'from-purple-600 to-purple-800',
    bgAccent: 'bg-purple-500/20',
    borderColor: 'border-purple-500',
  },
  {
    id: 'dijkstra',
    name: 'Dijkstra',
    icon: '🛤️',
    traits: ['Shortest path', 'Priority queue', 'Non-negative weights'],
    description: 'Finds shortest paths from source to all vertices.',
    complexity: { time: 'O((V+E) log V)', space: 'O(V)' },
    bestFor: 'GPS navigation, routing',
    color: 'from-rose-600 to-rose-800',
    bgAccent: 'bg-rose-500/20',
    borderColor: 'border-rose-500',
  },
  {
    id: 'bfs',
    name: 'BFS',
    icon: '🌊',
    traits: ['Level-order', 'Shortest path unweighted', 'Queue-based'],
    description: 'Explores neighbors level by level.',
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    bestFor: 'Shortest path in unweighted graphs',
    color: 'from-cyan-600 to-cyan-800',
    bgAccent: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500',
  },
  {
    id: 'dfs',
    name: 'DFS',
    icon: '🏔️',
    traits: ['Depth-first', 'Backtracking', 'Stack-based'],
    description: 'Explores as deep as possible before backtracking.',
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    bestFor: 'Cycle detection, topological sort',
    color: 'from-teal-600 to-teal-800',
    bgAccent: 'bg-teal-500/20',
    borderColor: 'border-teal-500',
  },
];

const AlgorithmPersonalityCards = () => {
  const [unlocked, setUnlocked] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);

  // Load from memory variable instead of localStorage
  useEffect(() => {
    // Initialize all as locked
    const initial = {};
    ALGORITHM_CARDS.forEach(card => {
      initial[card.id] = false;
    });
    setUnlocked(initial);
  }, []);

  const toggleCard = (id) => {
    setUnlocked(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const unlockedCount = Object.values(unlocked).filter(Boolean).length;
  const totalCards = ALGORITHM_CARDS.length;
  const progress = (unlockedCount / totalCards) * 100;

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
            Algorithm Personality Cards 🎴
          </h1>
          <p className="text-lg text-indigo-300 mb-6">
            Collect and master algorithmic thinking. Each card reveals unique traits, complexity, and best use cases.
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-indigo-400 font-medium">Collection Progress</span>
              <span className="text-sm text-indigo-400 font-bold">{unlockedCount} / {totalCards}</span>
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

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ALGORITHM_CARDS.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => toggleCard(card.id)}
              className={`
                relative cursor-pointer rounded-xl border-2 
                ${unlocked[card.id] ? card.borderColor : 'border-gray-700'}
                bg-gray-800/80 backdrop-blur-sm
                shadow-lg hover:shadow-2xl transition-all duration-300
                overflow-hidden
              `}
            >
              {/* Card Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-10`} />

              {/* Lock/Unlock Badge */}
              <div className="absolute top-3 right-3 z-10">
                {unlocked[card.id] ? (
                  <div className="flex items-center gap-1 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    <Unlock size={12} />
                    Unlocked
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full font-semibold">
                    <Lock size={12} />
                    Locked
                  </div>
                )}
              </div>

              <div className="relative p-6">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-lg ${card.bgAccent} flex items-center justify-center text-4xl mb-4 border ${card.borderColor}`}>
                  {card.icon}
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold mb-2 text-white">{card.name}</h3>

                {/* Content (shown when unlocked) */}
                <AnimatePresence>
                  {unlocked[card.id] ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Description */}
                      <p className="text-sm text-indigo-200 mb-4 italic">
                        {card.description}
                      </p>

                      {/* Traits */}
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-indigo-400 mb-2 flex items-center gap-1">
                          <Star size={12} /> Key Traits
                        </h4>
                        <ul className="space-y-1">
                          {card.traits.map((trait, i) => (
                            <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                              {trait}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Complexity */}
                      <div className="mb-4 bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                        <h4 className="text-xs font-semibold text-indigo-400 mb-2 flex items-center gap-1">
                          <Zap size={12} /> Complexity
                        </h4>
                        <div className="space-y-1">
                          <div className="text-xs text-gray-300">
                            <span className="text-indigo-400 font-medium">Time:</span> {card.complexity.time}
                          </div>
                          <div className="text-xs text-gray-300">
                            <span className="text-indigo-400 font-medium">Space:</span> {card.complexity.space}
                          </div>
                        </div>
                      </div>

                      {/* Best For */}
                      <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                        <h4 className="text-xs font-semibold text-indigo-400 mb-1 flex items-center gap-1">
                          <Target size={12} /> Best For
                        </h4>
                        <p className="text-xs text-gray-300">{card.bestFor}</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-gray-500 italic"
                    >
                      🔒 Click to unlock and reveal details
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievement Message */}
        <AnimatePresence>
          {unlockedCount === totalCards && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mt-12 text-center"
            >
              <div className="inline-block bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-8 py-4 rounded-xl shadow-2xl border-2 border-emerald-400">
                <h3 className="text-2xl font-bold mb-2">🎉 Collection Complete!</h3>
                <p className="text-sm">You've unlocked all algorithm personality cards!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlgorithmPersonalityCards;
