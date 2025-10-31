import React, { useState, useMemo } from 'react'

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
    tags: ['computation', 'mathematics']
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
    tags: ['theory', 'computation']
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
    tags: ['sorting', 'divide-conquer']
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
    tags: ['graph', 'shortest-path']
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
    tags: ['sorting', 'divide-conquer']
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
    tags: ['trees', 'balanced']
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
    tags: ['string', 'pattern-matching']
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
    tags: ['graph', 'dynamic-programming']
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
    tags: ['trees', 'databases']
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
    tags: ['cryptography', 'security']
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
    tags: ['graph', 'network-flow']
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
    tags: ['trees', 'balanced']
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
    tags: ['compression', 'encoding']
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
    tags: ['string', 'data-structure']
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
    tags: ['graph', 'ranking']
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
    tags: ['sorting', 'hybrid']
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
    tags: ['cryptography', 'blockchain']
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
    tags: ['ai', 'deep-learning']
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
    tags: ['ai', 'nlp']
  }
]

const CATEGORIES = {
  foundational: { name: 'Foundational', color: 'purple' },
  theory: { name: 'Theory', color: 'indigo' },
  sorting: { name: 'Sorting', color: 'blue' },
  graph: { name: 'Graph', color: 'green' },
  'data-structure': { name: 'Data Structures', color: 'cyan' },
  string: { name: 'String', color: 'teal' },
  cryptography: { name: 'Cryptography', color: 'red' },
  compression: { name: 'Compression', color: 'orange' },
  'machine-learning': { name: 'Machine Learning', color: 'pink' }
}

// ============================================================================
// STORAGE
// ============================================================================

const STORAGE_KEY = 'museum_favorites'

function getFavorites() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
  } catch {
    return new Set()
  }
}

function saveFavorites(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(favorites)))
  } catch (e) {
    console.warn('Failed to save favorites:', e)
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Museum() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedEra, setSelectedEra] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState(getFavorites())
  const [viewMode, setViewMode] = useState('timeline') // timeline or grid
  
  const eras = useMemo(() => {
    const unique = new Set(TIMELINE_DATA.map(e => e.era))
    return ['all', ...Array.from(unique)]
  }, [])
  
  const filteredEvents = useMemo(() => {
    return TIMELINE_DATA.filter(event => {
      const categoryMatch = selectedCategory === 'all' || event.category === selectedCategory
      const eraMatch = selectedEra === 'all' || event.era === selectedEra
      const searchMatch = searchQuery === '' || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.person.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      return categoryMatch && eraMatch && searchMatch
    })
  }, [selectedCategory, selectedEra, searchQuery])
  
  const toggleFavorite = (year, title) => {
    const key = `${year}-${title}`
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(key)) {
        newFavorites.delete(key)
      } else {
        newFavorites.add(key)
      }
      saveFavorites(newFavorites)
      return newFavorites
    })
  }
  
  const getCategoryColor = (category) => {
    const colors = {
      purple: 'bg-purple-100 text-purple-700 border-purple-300',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
      blue: 'bg-blue-100 text-blue-700 border-blue-300',
      green: 'bg-green-100 text-green-700 border-green-300',
      cyan: 'bg-cyan-100 text-cyan-700 border-cyan-300',
      teal: 'bg-teal-100 text-teal-700 border-teal-300',
      red: 'bg-red-100 text-red-700 border-red-300',
      orange: 'bg-orange-100 text-orange-700 border-orange-300',
      pink: 'bg-pink-100 text-pink-700 border-pink-300'
    }
    return colors[CATEGORIES[category]?.color] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-600">
            🏛️ Algorithm History Museum
          </h1>
          <p className="text-sm text-slate-600">
            Journey through the evolution of computer science's greatest algorithms
          </p>
        </div>

        {/* Stats Bar */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border border-violet-200 rounded-xl bg-white shadow-sm">
            <div className="text-2xl font-bold text-violet-600">{TIMELINE_DATA.length}</div>
            <div className="text-xs text-slate-600">Historic Events</div>
          </div>
          <div className="p-4 border border-purple-200 rounded-xl bg-white shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{eras.length - 1}</div>
            <div className="text-xs text-slate-600">Eras Covered</div>
          </div>
          <div className="p-4 border border-pink-200 rounded-xl bg-white shadow-sm">
            <div className="text-2xl font-bold text-pink-600">{Object.keys(CATEGORIES).length}</div>
            <div className="text-xs text-slate-600">Categories</div>
          </div>
          <div className="p-4 border border-blue-200 rounded-xl bg-white shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{favorites.size}</div>
            <div className="text-xs text-slate-600">Favorites</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search algorithms, people..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">All Categories</option>
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Era Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Era
              </label>
              <select
                value={selectedEra}
                onChange={(e) => setSelectedEra(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
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
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'timeline'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              📅 Timeline View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              🎴 Grid View
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-slate-600">
          Showing {filteredEvents.length} of {TIMELINE_DATA.length} events
        </div>

        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-300 via-purple-300 to-pink-300" />
            
            <div className="space-y-8">
              {filteredEvents.map((event, idx) => {
                const isFavorite = favorites.has(`${event.year}-${event.title}`)
                
                return (
                  <div key={`${event.year}-${event.title}`} className="relative pl-20">
                    {/* Year Marker */}
                    <div className="absolute left-0 top-0 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold shadow-lg">
                      {event.year}
                    </div>
                    
                    {/* Event Card */}
                    <div className="p-6 border-2 border-slate-200 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{event.imageIcon}</span>
                          <div>
                            <h3 className="text-xl font-bold text-slate-800">{event.title}</h3>
                            <p className="text-sm text-slate-600">{event.person}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavorite(event.year, event.title)}
                          className="text-2xl hover:scale-110 transition-transform"
                        >
                          {isFavorite ? '⭐' : '☆'}
                        </button>
                      </div>
                      
                      <p className="text-sm text-slate-700 mb-3">{event.description}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(event.category)}`}>
                          {CATEGORIES[event.category]?.name}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {event.era}
                        </span>
                      </div>
                      
                      <div className="p-3 bg-violet-50 border border-violet-200 rounded-lg">
                        <p className="text-xs font-semibold text-violet-900">
                          💡 Significance: <span className="font-normal">{event.significance}</span>
                        </p>
                      </div>
                      
                      <div className="mt-3 flex flex-wrap gap-1">
                        {event.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const isFavorite = favorites.has(`${event.year}-${event.title}`)
              
              return (
                <div
                  key={`${event.year}-${event.title}`}
                  className="p-5 border-2 border-slate-200 rounded-xl bg-white shadow-md hover:shadow-lg transition-all hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{event.imageIcon}</span>
                      <div className="text-lg font-bold text-violet-600">{event.year}</div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(event.year, event.title)}
                      className="text-xl hover:scale-110 transition-transform"
                    >
                      {isFavorite ? '⭐' : '☆'}
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{event.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">{event.person}</p>
                  <p className="text-xs text-slate-700 mb-3 line-clamp-3">{event.description}</p>
                  
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(event.category)}`}>
                    {CATEGORIES[event.category]?.name}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="py-20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-slate-600">No events found matching your filters</p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedEra('all')
                setSearchQuery('')
              }}
              className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
