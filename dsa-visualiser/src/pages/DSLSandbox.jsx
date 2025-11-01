import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Zap, Clock } from 'lucide-react';

const SAMPLE = `# Commands: compare i j | swap i j | mark i | sleep ms
compare 0 1
swap 0 1
mark 0
sleep 300
compare 2 3
swap 2 3
mark 2
compare 1 3
swap 1 3
mark 1
`;

const EXAMPLES = {
  'Bubble Sort': `# Bubble Sort - One Pass
compare 0 1
swap 0 1
mark 0
compare 1 2
swap 1 2
mark 1
compare 2 3
swap 2 3
mark 2
compare 3 4
swap 3 4
mark 3`,
  
  'Selection': `# Selection Sort Step
compare 0 1
compare 0 2
compare 0 3
swap 0 3
mark 0
sleep 500
compare 1 2
swap 1 2
mark 1`,
  
  'Quick Partition': `# Partition around pivot
mark 4
compare 0 4
swap 0 4
compare 1 4
compare 2 4
swap 2 4
compare 3 4
mark 2`,
  
  'Custom': SAMPLE
};

export default function DSLSandbox() {
  const [arr, setArr] = useState([5, 3, 8, 1, 4, 2, 9, 6]);
  const [code, setCode] = useState(SAMPLE);
  const [ptr, setPtr] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [highlight, setHighlight] = useState({ compare: null, mark: new Set() });
  const [speed, setSpeed] = useState(400);
  const [error, setError] = useState(null);
  const [selectedExample, setSelectedExample] = useState('Custom');

  useEffect(() => { 
    setPtr(0); 
    setHighlight({ compare: null, mark: new Set() });
    setError(null);
  }, [code]);

  useEffect(() => {
    if (!playing) return;
    let cancelled = false;
    
    async function stepper() {
      const lines = code.split(/\n/).map(s => s.trim()).filter(Boolean);
      if (ptr >= lines.length) { 
        setPlaying(false); 
        return;
      }
      
      const line = lines[ptr];
      
      // Skip comments
      if (line.startsWith('#')) {
        if (!cancelled) setPtr(p => p + 1);
        return;
      }
      
      const [cmd, ...rest] = line.split(/\s+/);
      const toInt = (s) => { 
        const v = parseInt(s, 10); 
        if (Number.isNaN(v)) throw new Error('Invalid number'); 
        return v;
      };
      
      try {
        if (cmd === 'compare') {
          const i = toInt(rest[0]), j = toInt(rest[1]);
          if (i < 0 || i >= arr.length || j < 0 || j >= arr.length) 
            throw new Error('Index out of range');
          setHighlight({ compare: [i, j], mark: new Set(highlight.mark) });
          await new Promise(r => setTimeout(r, speed));
        } else if (cmd === 'swap') {
          const i = toInt(rest[0]), j = toInt(rest[1]);
          if (i < 0 || i >= arr.length || j < 0 || j >= arr.length) 
            throw new Error('Index out of range');
          setArr(prev => { 
            const next = prev.slice(); 
            const t = next[i]; 
            next[i] = next[j]; 
            next[j] = t; 
            return next;
          });
          await new Promise(r => setTimeout(r, speed));
        } else if (cmd === 'mark') {
          const i = toInt(rest[0]); 
          if (i < 0 || i >= arr.length) throw new Error('Index out of range');
          setHighlight(h => ({ compare: null, mark: new Set([...h.mark, i]) }));
          await new Promise(r => setTimeout(r, speed));
        } else if (cmd === 'sleep') {
          const ms = toInt(rest[0]); 
          await new Promise(r => setTimeout(r, Math.max(0, ms)));
        } else {
          throw new Error(`Unknown command: ${cmd}`);
        }
        setError(null);
      } catch (e) {
        setPlaying(false);
        setError(e.message);
        console.warn('DSL error:', e);
        return;
      } finally {
        if (!cancelled) setPtr(p => p + 1);
      }
    }
    
    const id = setTimeout(stepper, 0);
    return () => { cancelled = true; clearTimeout(id); };
  }, [playing, ptr, code, speed, arr.length]);

  const reset = () => {
    setPlaying(false);
    setPtr(0);
    setArr([5, 3, 8, 1, 4, 2, 9, 6]);
    setHighlight({ compare: null, mark: new Set() });
    setError(null);
  };

  const handleExampleSelect = (example) => {
    setSelectedExample(example);
    setCode(EXAMPLES[example]);
    reset();
  };

  const maxValue = Math.max(...arr);
  const totalLines = code.split(/\n/).filter(l => l.trim() && !l.trim().startsWith('#')).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            DSL Animation Sandbox ⚡
          </h1>
          <p className="text-lg text-indigo-300">
            Write <span className="font-bold">pseudo-instructions</span> to visualize sorting algorithms
          </p>
        </motion.div>

        {/* Controls Panel */}
        <motion.div
          className="mb-8 p-6 bg-gray-800/70 backdrop-blur-sm border border-indigo-700 rounded-xl shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <button
              onClick={() => { setPtr(0); setPlaying(true); setError(null); }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md flex items-center gap-2 transition-colors duration-200"
              disabled={playing}
            >
              <Play size={18} /> Play
            </button>
            
            <button
              onClick={() => setPlaying(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center gap-2 transition-colors duration-200"
            >
              <Pause size={18} /> Pause
            </button>
            
            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center gap-2 transition-colors duration-200"
            >
              <RotateCcw size={18} /> Reset
            </button>

            <div className="ml-auto flex items-center gap-3">
              <Clock size={18} className="text-indigo-300" />
              <span className="text-sm text-indigo-300">Speed: <span className="text-yellow-300 font-bold">{speed}ms</span></span>
              <input
                type="range"
                min={100}
                max={1000}
                step={50}
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
                className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-indigo-300 mb-1">
              <span>Progress</span>
              <span>{ptr} / {totalLines} commands</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-teal-400"
                initial={{ width: 0 }}
                animate={{ width: `${totalLines > 0 ? (ptr / totalLines) * 100 : 0}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Example Selector */}
          <div>
            <label className="block text-sm font-medium text-indigo-300 mb-2">
              Load Example
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(EXAMPLES).map((example) => (
                <button
                  key={example}
                  onClick={() => handleExampleSelect(example)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-200 ${
                    selectedExample === example
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-red-400 font-bold">⚠️ Error:</span>
                <span className="text-red-300">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-gray-800/70 backdrop-blur-sm border border-indigo-700 rounded-xl shadow-xl"
          >
            <h3 className="text-xl font-semibold text-indigo-300 mb-4 border-b border-indigo-900 pb-2">
              DSL Commands
            </h3>
            <textarea
              value={code}
              onChange={(e) => { setCode(e.target.value); setSelectedExample('Custom'); }}
              className="w-full min-h-[400px] p-4 bg-gray-900 border border-indigo-500 rounded-lg font-mono text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              placeholder="Write your commands here..."
              spellCheck={false}
            />
            <div className="mt-3 p-3 bg-indigo-900/30 border border-indigo-700 rounded-lg">
              <p className="text-xs text-indigo-300 font-mono">
                <strong className="text-yellow-300">Available Commands:</strong><br />
                • compare i j - Highlight indices<br />
                • swap i j - Swap elements<br />
                • mark i - Mark as sorted<br />
                • sleep ms - Pause execution<br />
                • # comment - Add comments
              </p>
            </div>
          </motion.div>

          {/* Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-gray-800/70 backdrop-blur-sm border border-indigo-700 rounded-xl shadow-xl"
          >
            <h3 className="text-xl font-semibold text-indigo-300 mb-4 border-b border-indigo-900 pb-2">
              Array Visualization
            </h3>
            <div className="flex items-end justify-center gap-2 h-[400px] p-4">
              {arr.map((v, idx) => {
                const isCompare = highlight.compare && (idx === highlight.compare[0] || idx === highlight.compare[1]);
                const isMarked = highlight.mark.has(idx);
                const color = isMarked 
                  ? 'from-green-500 to-emerald-600' 
                  : isCompare 
                  ? 'from-yellow-500 to-amber-600' 
                  : 'from-indigo-500 to-purple-600';
                
                const heightPercent = (v / maxValue) * 100;

                return (
                  <motion.div
                    key={idx}
                    className="relative flex-1 max-w-[60px]"
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className={`absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t ${color} border-2 border-opacity-50 ${
                      isMarked ? 'border-green-400' : isCompare ? 'border-yellow-400' : 'border-indigo-400'
                    }`}
                      style={{ height: '100%' }}
                    >
                      <div className="absolute top-2 left-0 right-0 text-center">
                        <span className="text-xs font-bold text-white drop-shadow-lg">{v}</span>
                      </div>
                      <div className="absolute bottom-1 left-0 right-0 text-center">
                        <span className="text-xs text-white/70">{idx}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-indigo-500 to-purple-600 border border-indigo-400"></div>
                <span className="text-gray-300">Default</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-500 to-amber-600 border border-yellow-400"></div>
                <span className="text-gray-300">Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-green-500 to-emerald-600 border border-green-400"></div>
                <span className="text-gray-300">Marked/Sorted</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
