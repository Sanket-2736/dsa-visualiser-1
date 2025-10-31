import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Search, Zap, ListOrdered, Info, RotateCcw } from "lucide-react";

const NUM_BUCKETS = 10;

const HashMapPage = () => {
  const [buckets, setBuckets] = useState(Array(NUM_BUCKETS).fill(null).map(() => []));
  const [steps, setSteps] = useState([]);
  
  const [keyInput, setKeyInput] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [searchTarget, setSearchTarget] = useState("");

  const [highlightedBucket, setHighlightedBucket] = useState(null); 
  const [searchResult, setSearchResult] = useState(null);

  const hashFunction = (key) => {
    const intKey = parseInt(key);
    if (isNaN(intKey)) return null;
    return Math.abs(intKey) % NUM_BUCKETS;
  };

  const updateSteps = (action) => {
    setSteps((prev) => [...prev, { id: Date.now(), text: action }]);
  };

  const handlePut = () => {
    if (keyInput.trim() === "" || valueInput.trim() === "") return;

    const intKey = parseInt(keyInput);
    const value = valueInput;
    const index = hashFunction(intKey);
    
    if (index === null) return;

    setHighlightedBucket(index); 

    const newBuckets = buckets.map((chain, i) => {
      if (i === index) {
        const existingIndex = chain.findIndex(entry => entry.key === intKey);
        
        if (existingIndex !== -1) {
          const newChain = [...chain];
          newChain[existingIndex] = { key: intKey, value };
          updateSteps(`Bucket ${index}: Key ${intKey} updated to value ${value}.`);
          return newChain;
        } else {
          updateSteps(`Bucket ${index}: Key ${intKey} added. (Collision: ${chain.length > 0 ? 'Yes' : 'No'})`);
          return [...chain, { key: intKey, value }];
        }
      }
      return chain;
    });

    setBuckets(newBuckets);
    setKeyInput("");
    setValueInput("");
  };

  const handleRemove = () => {
    if (keyInput.trim() === "") return;
    
    const intKey = parseInt(keyInput);
    const index = hashFunction(intKey);
    
    if (index === null) return;
    
    setHighlightedBucket(index);

    const newBuckets = buckets.map((chain, i) => {
      if (i === index) {
        const initialLength = chain.length;
        const newChain = chain.filter(entry => entry.key !== intKey);
        
        if (newChain.length < initialLength) {
          updateSteps(`Bucket ${index}: Key ${intKey} removed.`);
        } else {
          updateSteps(`Bucket ${index}: Key ${intKey} not found.`);
        }
        return newChain;
      }
      return chain;
    });

    setBuckets(newBuckets);
    setKeyInput("");
    setSearchResult(null); 
  };

  const handleSearch = () => {
    if (searchTarget.trim() === "") return;

    const intKey = parseInt(searchTarget);
    const index = hashFunction(intKey);
    
    if (index === null) return;
    
    setHighlightedBucket(index);
    
    const chain = buckets[index];
    const foundEntry = chain.find(entry => entry.key === intKey);
    
    if (foundEntry) {
      setSearchResult({ key: intKey, value: foundEntry.value, status: 'found' });
      updateSteps(`Bucket ${index}: Key ${intKey} found with value ${foundEntry.value}.`);
    } else {
      setSearchResult({ key: intKey, value: null, status: 'not_found' });
      updateSteps(`Bucket ${index}: Key ${intKey} not found.`);
    }
  };
  
  const stats = useMemo(() => {
    const totalEntries = buckets.flat().length;
    const maxChainLength = Math.max(...buckets.map(c => c.length), 0);
    const loadFactor = totalEntries / NUM_BUCKETS;
    
    return {
      totalEntries,
      maxChainLength,
      loadFactor: loadFactor.toFixed(2),
      isOverloaded: loadFactor > 0.7,
    };
  }, [buckets]);

  const ChainEntry = ({ entry, isTarget }) => (
    <motion.div
      layout
      key={entry.key}
      className={`p-2 rounded-md font-mono text-sm shadow-md transition-colors duration-300 ${
        isTarget ? 'bg-yellow-400 text-black font-bold' : 'bg-indigo-600 text-white'
      }`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
    >
      <span className="text-purple-200">{entry.key}:</span> {entry.value}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white px-6 py-16">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Hash Map Visualizer (Chaining) 🔗
        </motion.h1>
        <motion.p
          className="text-lg text-purple-300 mb-10 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Keys are converted to a bucket index using the **Hash Function** ($key \pmod{10}$). **Collisions** are handled by placing multiple entries into a linked list (chain) within the same bucket.
        </motion.p>

        {/* --- Controls --- */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-10 p-6 bg-gray-800/50 rounded-xl shadow-xl">
          
          {/* Put/Remove */}
          <div className="flex gap-2">
            <input
              type="number"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Key"
              className="bg-gray-700 text-white px-3 py-2 rounded-md border border-purple-500 w-24"
            />
            <input
              type="text"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              placeholder="Value"
              className="bg-gray-700 text-white px-3 py-2 rounded-md border border-purple-500 w-24"
            />
            <button
              onClick={handlePut}
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md flex items-center gap-1"
            >
              <Plus size={18} /> Put
            </button>
            <button
              onClick={handleRemove}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-1"
            >
              <Trash2 size={18} /> Remove
            </button>
          </div>
          
          {/* Search */}
          <div className="flex gap-2">
            <input
              type="number"
              value={searchTarget}
              onChange={(e) => setSearchTarget(e.target.value)}
              placeholder="Search Key"
              className="bg-gray-700 text-white px-3 py-2 rounded-md border border-yellow-500 w-32"
            />
            <button
              onClick={handleSearch}
              className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-md flex items-center gap-1"
            >
              <Search size={18} /> Get
            </button>
          </div>
          
          <button
              onClick={() => {
                  setBuckets(Array(NUM_BUCKETS).fill(null).map(() => []));
                  setSteps([]);
                  setSearchResult(null);
              }}
              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md flex items-center gap-1"
          >
              <RotateCcw size={18} /> Clear Map
          </button>
          
        </div>

        {/* --- Visualization Area: Buckets --- */}
        <div className="mb-10 p-4 rounded-xl bg-purple-900/20 border border-purple-700/50 shadow-2xl">
          <h3 className="text-2xl font-semibold text-purple-300 mb-6">Hash Table Buckets (Size: {NUM_BUCKETS})</h3>
          
          <div className="flex flex-wrap justify-center gap-4">
            {buckets.map((chain, index) => (
              <motion.div
                key={index}
                className={`flex flex-col items-center p-3 rounded-lg shadow-inner border transition-all duration-500 ${
                  highlightedBucket === index 
                    ? 'bg-yellow-800/40 border-yellow-500 ring-2 ring-yellow-300' 
                    : 'bg-gray-800 border-indigo-700'
                }`}
                onAnimationEnd={() => setHighlightedBucket(null)}
              >
                {/* Bucket Index */}
                <motion.div 
                    className={`font-bold text-lg mb-2 p-1 rounded ${
                        highlightedBucket === index ? 'text-yellow-300' : 'text-purple-400'
                    }`}
                >
                    [{index}]
                </motion.div>
                
                {/* Chain (Linked List) */}
                <div className="flex flex-col gap-1 w-32 min-h-[50px]">
                  <AnimatePresence>
                    {chain.length > 0 ? (
                      chain.map(entry => (
                        <ChainEntry 
                            key={entry.key} 
                            entry={entry} 
                            isTarget={searchResult?.key === entry.key} 
                        />
                      ))
                    ) : (
                      <span className="text-gray-500 text-xs mt-2">Empty</span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- Stats and Result --- */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Result Panel */}
          <motion.div
            className={`p-5 rounded-xl shadow-lg border-l-4 ${
                stats.totalEntries === 0 ? 'bg-gray-800 border-gray-500' :
                searchResult?.status === 'found' ? 'bg-green-800/30 border-green-500' :
                searchResult?.status === 'not_found' ? 'bg-red-800/30 border-red-500' :
                'bg-gray-800 border-gray-500'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-xl font-semibold text-white mb-3 flex items-center justify-center gap-2">
              <Zap size={20} /> Result
            </h4>
            <div className="text-left font-mono text-lg">
                <p>Key: <span className="text-yellow-400">{searchResult?.key ?? 'N/A'}</span></p>
                <p>Value: <span className="text-white">{searchResult?.value ?? '---'}</span></p>
                <p>Status: <span className={`font-bold ${searchResult?.status === 'found' ? 'text-green-400' : searchResult?.status === 'not_found' ? 'text-red-400' : 'text-gray-400'}`}>
                    {searchResult?.status ? searchResult.status.toUpperCase().replace('_', ' ') : 'PENDING'}
                </span></p>
            </div>
          </motion.div>
          
          {/* Stats Panel */}
          <motion.div
            className={`p-5 rounded-xl shadow-lg border-l-4 ${stats.isOverloaded ? 'bg-red-800/30 border-red-500' : 'bg-gray-800 border-purple-500'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-xl font-semibold text-purple-400 mb-3 flex items-center justify-center gap-2">
              <ListOrdered size={20} /> Performance Metrics
            </h4>
            <div className="space-y-2 text-left text-md">
              <p className="text-white">Total Entries: <span className="font-bold text-purple-300">{stats.totalEntries}</span></p>
              <p className="text-white">Max Chain Length: <span className="font-bold text-yellow-400">{stats.maxChainLength}</span></p>
              <p className="text-white">Load Factor: <span className={`font-bold ${stats.isOverloaded ? 'text-red-400' : 'text-green-400'}`}>{stats.loadFactor}</span></p>
              <p className="text-gray-400 text-xs">(Optimal Load Factor is usually $\le 0.7$)</p>
            </div>
          </motion.div>
          
          {/* Action Log */}
          <motion.div
            className="p-5 rounded-xl bg-gray-800 border-l-4 border-gray-500 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-xl font-semibold text-gray-400 mb-3 flex items-center justify-center gap-2">
              <Info size={20} /> Action Log
            </h4>
            <div className="max-h-32 overflow-y-auto bg-gray-900 p-2 rounded text-left">
              <ul className="space-y-1 text-sm">
                <AnimatePresence initial={false}>
                  {steps.slice(-5).reverse().map((step) => (
                    <motion.li 
                      key={step.id} 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-300 border-l-2 border-indigo-500 pl-3 py-0.5"
                    >
                      {step.text}
                    </motion.li>
                  ))}
                </AnimatePresence>
                {steps.length === 0 && <li className="text-gray-400">Start adding keys (numbers) and values!</li>}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HashMapPage;