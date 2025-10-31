import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  Grid3x3, 
  List, 
  User, 
  Tag,
  Sparkles,
  Clock,
  Award,
  TrendingUp
} from 'lucide-react';

// ============================================================================
// COMPREHENSIVE ALGORITHM HISTORY DATABASE
// ============================================================================

const TIMELINE_DATA = [
  {
    year: 1843,
    era: 'Origins',
    title: 'First Algorithm',
    person: 'Ada Lovelace',
    description: 'Ada Lovelace writes the first computer algorithm for Charles Babbage\'s Analytical Engine to compute Bernoulli numbers.',
    significance: 'Considered the first computer program in history',
    category: 'foundational',
    imageIcon: '👩‍💻',
    tags: ['computation', 'mathematics'],
    impact: 'Revolutionary'
  },
  {
    year: 1936,
    era: 'Foundations',
    title: 'Turing Machine',
    person: 'Alan Turing',
    description: 'Alan Turing introduces the concept of a universal computing machine, formalizing the notion of algorithm and computability.',
    significance: 'Established theoretical foundations of computer science',
    category: 'theory',
    imageIcon: '🖥️',
    tags: ['theory', 'computation'],
    impact: 'Revolutionary'
  },
  {
    year: 1945,
    era: 'Early Computing',
    title: 'Merge Sort',
    person: 'John von Neumann',
    description: 'John von Neumann develops Merge Sort, one of the first efficient divide-and-conquer sorting algorithms.',
    significance: 'O(n log n) worst-case performance, still widely used',
    category: 'sorting',
    imageIcon: '🔀',
    tags: ['sorting', 'divide-conquer'],
    impact: 'High'
  },
  {
    year: 1956,
    era: 'Graph Algorithms',
    title: 'Dijkstra\'s Algorithm',
    person: 'Edsger Dijkstra',
    description: 'Edsger Dijkstra publishes his shortest path algorithm for finding the shortest paths between nodes in a graph.',
    significance: 'Fundamental to GPS, routing, and network protocols',
    category: 'graph',
    imageIcon: '🗺️',
    tags: ['graph', 'shortest-path'],
    impact: 'Revolutionary'
  },
  {
    year: 1959,
    era: 'Sorting Era',
    title: 'Quick Sort',
    person: 'Tony Hoare',
    description: 'Tony Hoare invents Quick Sort, an efficient in-place sorting algorithm using divide-and-conquer.',
    significance: 'Average O(n log n), widely used in practice',
    category: 'sorting',
    imageIcon: '⚡',
    tags: ['sorting', 'divide-conquer'],
    impact: 'High'
  },
  {
    year: 1962,
    era: 'Trees',
    title: 'AVL Trees',
    person: 'Adelson-Velsky & Landis',
    description: 'First self-balancing binary search tree invented, ensuring O(log n) operations.',
    significance: 'Pioneered balanced tree structures',
    category: 'data-structure',
    imageIcon: '🌳',
    tags: ['trees', 'balanced'],
    impact: 'High'
  },
  {
    year: 1968,
    era: 'Pattern Matching',
    title: 'Knuth-Morris-Pratt (KMP)',
    person: 'Knuth, Morris, Pratt',
    description: 'Efficient string matching algorithm using preprocessing to avoid redundant comparisons.',
    significance: 'O(n + m) pattern matching, used in text editors',
    category: 'string',
    imageIcon: '🔍',
    tags: ['string', 'pattern-matching'],
    impact: 'Medium'
  },
  {
    year: 1970,
    era: 'Dynamic Programming',
    title: 'Floyd-Warshall Algorithm',
    person: 'Robert Floyd',
    description: 'All-pairs shortest path algorithm for weighted graphs with positive or negative edges.',
    significance: 'Dynamic programming classic, O(V³) complexity',
    category: 'graph',
    imageIcon: '🔢',
    tags: ['graph', 'dynamic-programming'],
    impact: 'Medium'
  },
  {
    year: 1972,
    era: 'Trees',
    title: 'B-Trees',
    person: 'Rudolf Bayer & Ed McCreight',
    description: 'Self-balancing tree data structure optimized for systems that read/write large blocks of data.',
    significance: 'Foundation of modern databases and file systems',
    category: 'data-structure',
    imageIcon: '💾',
    tags: ['trees', 'databases'],
    impact: 'Revolutionary'
  },
  {
    year: 1977,
    era: 'Cryptography',
    title: 'RSA Algorithm',
    person: 'Rivest, Shamir, Adleman',
    description: 'First practical public-key cryptosystem for secure data transmission.',
    significance: 'Revolutionized internet security and e-commerce',
    category: 'cryptography',
    imageIcon: '🔐',
    tags: ['cryptography', 'security'],
    impact: 'Revolutionary'
  },
  {
    year: 1983,
    era: 'Network Flow',
    title: 'Ford-Fulkerson Algorithm',
    person: 'L.R. Ford & D.R. Fulkerson',
    description: 'Computes maximum flow in a flow network using augmenting paths.',
    significance: 'Critical for network optimization problems',
    category: 'graph',
    imageIcon: '🌊',
    tags: ['graph', 'network-flow'],
    impact: 'High'
  },
  {
    year: 1987,
    era: 'Advanced Trees',
    title: 'Red-Black Trees',
    person: 'Rudolf Bayer',
    description: 'Self-balancing binary search tree with guaranteed O(log n) operations.',
    significance: 'Used in C++ STL, Java TreeMap, Linux kernel',
    category: 'data-structure',
    imageIcon: '🔴⚫',
    tags: ['trees', 'balanced'],
    impact: 'High'
  },
  {
    year: 1991,
    era: 'Compression',
    title: 'Lempel-Ziv-Welch (LZW)',
    person: 'Lempel, Ziv, Welch',
    description: 'Dictionary-based lossless data compression algorithm.',
    significance: 'Used in GIF, TIFF, and PDF compression',
    category: 'compression',
    imageIcon: '📦',
    tags: ['compression', 'encoding'],
    impact: 'Medium'
  },
  {
    year: 1994,
    era: 'String Algorithms',
    title: 'Suffix Trees',
    person: 'Esko Ukkonen',
    description: 'Linear-time construction of suffix trees for efficient string operations.',
    significance: 'Enables O(m) pattern matching in preprocessed text',
    category: 'string',
    imageIcon: '📝',
    tags: ['string', 'data-structure'],
    impact: 'Medium'
  },
  {
    year: 1997,
    era: 'Machine Learning',
    title: 'PageRank Algorithm',
    person: 'Larry Page & Sergey Brin',
    description: 'Link analysis algorithm used by Google Search to rank web pages.',
    significance: 'Powered Google\'s dominance in web search',
    category: 'graph',
    imageIcon: '🌐',
    tags: ['graph', 'ranking'],
    impact: 'Revolutionary'
  },
  {
    year: 2002,
    era: 'Hybrid Sorting',
    title: 'Timsort',
    person: 'Tim Peters',
    description: 'Hybrid stable sorting algorithm combining merge sort and insertion sort.',
    significance: 'Default sort in Python and Java since 2002',
    category: 'sorting',
    imageIcon: '🐍',
    tags: ['sorting', 'hybrid'],
    impact: 'High'
  },
  {
    year: 2009,
    era: 'Cryptocurrency',
    title: 'Bitcoin Mining (SHA-256)',
    person: 'Satoshi Nakamoto',
    description: 'Proof-of-work algorithm using SHA-256 hashing for blockchain consensus.',
    significance: 'Foundation of cryptocurrency and blockchain technology',
    category: 'cryptography',
    imageIcon: '₿',
    tags: ['cryptography', 'blockchain'],
    impact: 'Revolutionary'
  },
  {
    year: 2012,
    era: 'Deep Learning',
    title: 'AlexNet (Backpropagation)',
    person: 'Alex Krizhevsky',
    description: 'Deep convolutional neural network that revolutionized computer vision.',
    significance: 'Sparked the deep learning revolution',
    category: 'machine-learning',
    imageIcon: '🧠',
    tags: ['ai', 'deep-learning'],
    impact: 'Revolutionary'
  },
  {
    year: 2017,
    era: 'AI',
    title: 'Transformer Architecture',
    person: 'Vaswani et al.',
    description: 'Attention-based neural network architecture for sequence-to-sequence tasks.',
    significance: 'Powers GPT, BERT, and modern LLMs',
    category: 'machine-learning',
    imageIcon: '🤖',
    tags: ['ai', 'nlp'],
    impact: 'Revolutionary'
  }
];

const CATEGORIES = {
  foundational: { name: 'Foundational', gradient: 'from-purple-600 to-purple-800', bg: 'bg-purple-500/20', border: 'border-purple-500' },
  theory: { name: 'Theory', gradient: 'from-indigo-600 to-indigo-800', bg: 'bg-indigo-500/20', border: 'border-indigo-500' },
  sorting: { name: 'Sorting', gradient: 'from-blue-600 to-blue-800', bg: 'bg-blue-500/20', border: 'border-blue-500' },
  graph: { name: 'Graph', gradient: 'from-green-600 to-green-800', bg: 'bg-green-500/20', border: 'border-green-500' },
  'data-structure': { name: 'Data Structures', gradient: 'from-cyan-600 to-cyan-800', bg: 'bg-cyan-500/20', border: 'border-cyan-500' },
  string: { name: 'String', gradient: 'from-teal-600 to-teal-800', bg: 'bg-teal-500/20', border: 'border-teal-500' },
  cryptography: { name: 'Cryptography', gradient: 'from-red-600 to-red-800', bg: 'bg-red-500/20', border: 'border-red-500' },
  compression: { name: 'Compression', gradient: 'from-orange-600 to-orange-800', bg: 'bg-orange-500/20', border: 'border-orange-500' },
  'machine-learning': { name: 'Machine Learning', gradient: 'from-pink-600 to-pink-800', bg: 'bg-pink-500/20', border: 'border-pink-500' }
};

const AlgorithmHistoryMuseum = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEra, setSelectedEra] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [viewMode, setViewMode] = useState('timeline');

  const eras = useMemo(() => {
    const unique = new Set(TIMELINE_DATA.map(e => e.era));
    return ['all', ...Array.from(unique)];
  }, []);

  const filteredEvents = useMemo(() => {
    return TIMELINE_DATA.filter(event => {
      const categoryMatch = selectedCategory === 'all' || event.category === selectedCategory;
      const eraMatch = selectedEra === 'all' || event.era === selectedEra;
      const searchMatch = searchQuery === '' || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.person.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return categoryMatch && eraMatch && searchMatch;
    });
  }, [selectedCategory, selectedEra, searchQuery]);

  const toggleFavorite = (year, title) => {
    const key = `${year}-${title}`;
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(key)) {
        newFavorites.delete(key);
      } else {
        newFavorites.add(key);
      }
      return newFavorites;
    });
  };

  const getImpactBadge = (impact) => {
    const badges = {
      'Revolutionary': { color: 'from-red-500 to-pink-500', icon: '🌟' },
      'High': { color: 'from-orange-500 to-amber-500', icon: '⚡' },
      'Medium': { color: 'from-blue-500 to-cyan-500', icon: '💫' }
    };
    return badges[impact] || badges.Medium;
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
            🏛️ Algorithm History Museum
          </h1>
          <p className="text-lg text-indigo-300">
            Journey through the evolution of computer science's greatest algorithms
          </p>
        </motion.div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Historic Events', value: TIMELINE_DATA.length, icon: Calendar, gradient: 'from-violet-600 to-purple-600' },
            { label: 'Eras Covered', value: eras.length - 1, icon: Clock, gradient: 'from-blue-600 to-cyan-600' },
            { label: 'Categories', value: Object.keys(CATEGORIES).length, icon: Tag, gradient: 'from-pink-600 to-rose-600' },
            { label: 'Favorites', value: favorites.size, icon: Star, gradient: 'from-amber-600 to-orange-600' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <stat.icon size={20} className="text-white" />
                </div>
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
              </div>
              <div className="text-xs text-indigo-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg mb-8"
        >
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2 flex items-center gap-2">
                <Search size={16} />
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search algorithms, people..."
                className="w-full bg-gray-900 border border-indigo-600 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2 flex items-center gap-2">
                <Filter size={16} />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-900 border border-indigo-600 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Era Filter */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2 flex items-center gap-2">
                <Clock size={16} />
                Era
              </label>
              <select
                value={selectedEra}
                onChange={(e) => setSelectedEra(e.target.value)}
                className="w-full bg-gray-900 border border-indigo-600 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {eras.map(era => (
                  <option key={era} value={era}>
                    {era === 'all' ? 'All Eras' : era}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-3">
            <motion.button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'timeline'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <List size={18} />
              Timeline View
            </motion.button>
            <motion.button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Grid3x3 size={18} />
              Grid View
            </motion.button>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-indigo-400 flex items-center gap-2">
          <TrendingUp size={16} />
          Showing {filteredEvents.length} of {TIMELINE_DATA.length} events
        </div>

        {/* Timeline View */}
        {viewMode === 'timeline' && filteredEvents.length > 0 && (
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-indigo-500 to-purple-500 rounded-full opacity-30" />
            
            <div className="space-y-8">
              {filteredEvents.map((event, idx) => {
                const isFavorite = favorites.has(`${event.year}-${event.title}`);
                const categoryData = CATEGORIES[event.category];
                const impactBadge = getImpactBadge(event.impact);
                
                return (
                  <motion.div
                    key={`${event.year}-${event.title}`}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="relative pl-24"
                  >
                    {/* Year Marker */}
                    <div className={`absolute left-0 top-0 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${categoryData.gradient} text-white font-bold shadow-2xl border-4 border-gray-900 z-10`}>
                      <span className="text-sm">{event.year}</span>
                    </div>
                    
                    {/* Event Card */}
                    <motion.div
                      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                      className="bg-gray-800/80 backdrop-blur-sm border-2 border-indigo-700 rounded-xl p-6 shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-16 h-16 rounded-lg ${categoryData.bg} border ${categoryData.border} flex items-center justify-center text-4xl`}>
                            {event.imageIcon}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-1">{event.title}</h3>
                            <p className="text-sm text-indigo-300 flex items-center gap-2">
                              <User size={14} />
                              {event.person}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => toggleFavorite(event.year, event.title)}
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-3xl"
                        >
                          {isFavorite ? '⭐' : '☆'}
                        </motion.button>
                      </div>
                      
                      <p className="text-sm text-gray-300 mb-4 leading-relaxed">{event.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryData.bg} ${categoryData.border} text-white`}>
                          {categoryData.name}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600">
                          {event.era}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${impactBadge.color} text-white flex items-center gap-1`}>
                          {impactBadge.icon} {event.impact} Impact
                        </span>
                      </div>
                      
                      <div className="p-4 bg-indigo-900/30 border border-indigo-700 rounded-lg mb-4">
                        <p className="text-xs font-semibold text-indigo-300 flex items-center gap-2">
                          <Sparkles size={14} />
                          Significance:
                        </p>
                        <p className="text-sm text-gray-300 mt-1">{event.significance}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-purple-600/30 text-purple-300 rounded-md text-xs border border-purple-500/30 flex items-center gap-1">
                            <Tag size={10} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && filteredEvents.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, idx) => {
              const isFavorite = favorites.has(`${event.year}-${event.title}`);
              const categoryData = CATEGORIES[event.category];
              const impactBadge = getImpactBadge(event.impact);
              
              return (
                <motion.div
                  key={`${event.year}-${event.title}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-gray-800/80 backdrop-blur-sm border-2 border-indigo-700 rounded-xl p-5 shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{event.imageIcon}</span>
                      <div className={`text-2xl font-bold bg-gradient-to-r ${categoryData.gradient} bg-clip-text text-transparent`}>
                        {event.year}
                      </div>
                    </div>
                    <motion.button
                      onClick={() => toggleFavorite(event.year, event.title)}
                      whileHover={{ scale: 1.2, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-2xl"
                    >
                      {isFavorite ? '⭐' : '☆'}
                    </motion.button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                  <p className="text-sm text-indigo-300 mb-3 flex items-center gap-1">
                    <User size={12} />
                    {event.person}
                  </p>
                  <p className="text-xs text-gray-300 mb-3 line-clamp-3 leading-relaxed">{event.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${categoryData.bg} ${categoryData.border} text-white`}>
                      {categoryData.name}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${impactBadge.color} text-white`}>
                      {impactBadge.icon}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        <AnimatePresence>
          {filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="py-20 text-center"
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-indigo-300 mb-2">No events found</p>
              <p className="text-sm text-gray-400 mb-6">Try adjusting your filters</p>
              <motion.button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedEra('all');
                  setSearchQuery('');
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg"
              >
                Clear All Filters
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlgorithmHistoryMuseum;
