import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, HelpCircle, X, CheckCircle, AlertCircle } from 'lucide-react';

// Supported function patterns with validation
const FUNCTION_PATTERNS = [
  { regex: /^1$/i, label: '1', parse: () => ({ type: 'constant', value: 1 }) },
  { regex: /^log\s*n$/i, label: 'log n', parse: () => ({ type: 'log' }) },
  { regex: /^n$/i, label: 'n', parse: () => ({ type: 'linear' }) },
  { regex: /^n\s*log\s*n$/i, label: 'n log n', parse: () => ({ type: 'nlogn' }) },
  { regex: /^n\^(\d+\.?\d*)$/i, label: 'n^k', parse: (match) => ({ type: 'power', k: parseFloat(match[1]) }) }
];

function parse(rec) {
  const pattern = /^(\d+)\s*T\s*\(\s*n\s*\/\s*(\d+)\s*\)\s*\+\s*(.+)$/i;
  const match = rec.trim().match(pattern);
  
  if (!match) {
    return { error: 'Invalid format. Use: aT(n/b) + f(n)', a: 2, b: 2, f: 'n', fParsed: { type: 'linear' } };
  }
  
  const a = parseInt(match[1], 10);
  const b = parseInt(match[2], 10);
  const fStr = match[3].trim();
  
  if (a < 1 || b < 2) {
    return { error: 'Invalid values: a ≥ 1, b ≥ 2', a: 2, b: 2, f: 'n', fParsed: { type: 'linear' } };
  }
  
  let fParsed = null;
  for (const pattern of FUNCTION_PATTERNS) {
    const fMatch = fStr.match(pattern.regex);
    if (fMatch) {
      fParsed = pattern.parse(fMatch);
      break;
    }
  }
  
  if (!fParsed) {
    return { error: 'Unsupported f(n). Use: 1, log n, n, n log n, or n^k', a, b, f: fStr, fParsed: { type: 'linear' } };
  }
  
  return { a, b, f: fStr, fParsed, error: null };
}

function evaluateF(fParsed, subN) {
  const safeN = Math.max(2, subN);
  
  switch (fParsed.type) {
    case 'constant':
      return 1;
    case 'log':
      return Math.log2(safeN);
    case 'linear':
      return subN;
    case 'nlogn':
      return subN * Math.log2(safeN);
    case 'power':
      return Math.pow(subN, fParsed.k);
    default:
      return subN;
  }
}

function costAtLevel(level, n, a, b, fParsed) {
  const nodes = Math.pow(a, level);
  const subN = n / Math.pow(b, level);
  const base = evaluateF(fParsed, subN);
  return nodes * base;
}

function getMasterTheorem(a, b, fParsed) {
  const logba = Math.log(a) / Math.log(b);
  
  if (fParsed.type === 'constant') {
    return logba > 0 ? `Θ(n^${logba.toFixed(2)})` : 'Θ(1)';
  } else if (fParsed.type === 'linear') {
    if (Math.abs(logba - 1) < 0.01) return 'Θ(n log n)';
    if (logba > 1) return `Θ(n^${logba.toFixed(2)})`;
    return 'Θ(n)';
  } else if (fParsed.type === 'nlogn') {
    if (Math.abs(logba - 1) < 0.01) return 'Θ(n log² n)';
    if (logba > 1) return `Θ(n^${logba.toFixed(2)})`;
    return 'Θ(n log n)';
  } else if (fParsed.type === 'log') {
    return logba > 0 ? `Θ(n^${logba.toFixed(2)})` : 'Θ(log n)';
  } else if (fParsed.type === 'power') {
    if (Math.abs(logba - fParsed.k) < 0.01) return `Θ(n^${fParsed.k} log n)`;
    if (logba > fParsed.k) return `Θ(n^${logba.toFixed(2)})`;
    return `Θ(n^${fParsed.k})`;
  }
  
  return 'Unable to determine';
}

export default function RecurrenceTreeVisualizer() {
  const [rec, setRec] = useState('2T(n/2) + n');
  const [n, setN] = useState(1024);
  const [showHelp, setShowHelp] = useState(false);
  
  const parsed = useMemo(() => parse(rec), [rec]);
  const { a, b, fParsed, error } = parsed;
  
  const levels = useMemo(() => {
    if (error || b < 2 || n < 1) return [];
    
    const L = [];
    const maxL = Math.min(20, Math.ceil(Math.log(n) / Math.log(b)));
    
    for (let i = 0; i <= maxL; i++) {
      const cost = costAtLevel(i, n, a, b, fParsed);
      if (!isFinite(cost)) break;
      L.push({ level: i, cost });
    }
    
    return L;
  }, [a, b, fParsed, n, error]);
  
  const total = useMemo(() => 
    levels.reduce((sum, l) => sum + l.cost, 0),
    [levels]
  );
  
  const maxCost = useMemo(() => 
    Math.max(...levels.map(l => l.cost), 1),
    [levels]
  );
  
  const complexity = useMemo(() => 
    error ? null : getMasterTheorem(a, b, fParsed),
    [a, b, fParsed, error]
  );
  
  const handleNChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 1000000) {
      setN(value);
    }
  };
  
  const examples = [
    { label: 'Merge Sort', value: '2T(n/2) + n' },
    { label: 'Binary Search', value: '1T(n/2) + 1' },
    { label: 'Karatsuba', value: '3T(n/2) + n' },
    { label: 'Strassen', value: '7T(n/2) + n^2' }
  ];

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
            Recurrence Tree Visualizer 🌳
          </h1>
          <p className="text-lg text-indigo-300">
            Analyze divide-and-conquer recurrences using the <span className="font-bold">Master Theorem</span>
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          className="mb-8 p-6 bg-gray-800/70 backdrop-blur-sm border border-indigo-700 rounded-xl shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-wrap items-end gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="recurrence-input" className="block text-sm font-medium text-indigo-300 mb-2">
                Recurrence Relation
              </label>
              <input
                id="recurrence-input"
                type="text"
                value={rec}
                onChange={(e) => setRec(e.target.value)}
                placeholder="e.g., 2T(n/2) + n"
                className="w-full bg-gray-900 border border-indigo-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            
            <div className="w-40">
              <label htmlFor="n-input" className="block text-sm font-medium text-indigo-300 mb-2">
                Input Size (n)
              </label>
              <input
                id="n-input"
                type="number"
                value={n}
                onChange={handleNChange}
                min="1"
                max="1000000"
                className="w-full bg-gray-900 border border-indigo-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md flex items-center gap-2 transition-colors duration-200"
            >
              <HelpCircle size={18} />
              {showHelp ? 'Hide' : 'Show'} Help
            </button>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg flex items-start gap-2"
              >
                <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-300">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Help Section */}
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-indigo-900/50 border border-indigo-700 rounded-lg space-y-3"
              >
                <div>
                  <h3 className="text-sm font-semibold text-indigo-300 mb-1">Supported f(n) Functions:</h3>
                  <p className="text-xs text-indigo-200">1, log n, n, n log n, n^k (e.g., n^2, n^3)</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-indigo-300 mb-2">Examples:</h3>
                  <div className="flex flex-wrap gap-2">
                    {examples.map((ex) => (
                      <button
                        key={ex.label}
                        onClick={() => setRec(ex.value)}
                        className="px-3 py-1.5 text-xs bg-gray-800 border border-indigo-600 rounded-md hover:bg-indigo-600 transition-colors"
                      >
                        {ex.label}: <code className="font-mono">{ex.value}</code>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Complexity Result */}
          <AnimatePresence>
            {!error && complexity && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-teal-900/50 border border-teal-500 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-teal-400" />
                  <span className="text-sm text-teal-200">
                    <strong>Asymptotic Complexity:</strong>{' '}
                    <code className="font-mono bg-teal-800/50 px-2 py-0.5 rounded text-yellow-300 text-base">
                      {complexity}
                    </code>
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Visualization Section */}
        <AnimatePresence>
          {!error && levels.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-6 bg-gray-800/70 backdrop-blur-sm border border-indigo-700 rounded-xl shadow-xl"
            >
              <h2 className="text-2xl font-semibold text-indigo-300 mb-6 border-b border-indigo-900 pb-2">
                Level-by-Level Cost Analysis
              </h2>
              
              <div className="space-y-3 mb-6">
                {levels.map((l, index) => (
                  <motion.div
                    key={l.level}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-24 text-sm font-medium text-indigo-300">
                      Level {l.level}
                    </div>
                    <div className="flex-1 h-8 bg-gray-900 rounded-lg overflow-hidden relative border border-indigo-900">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (100 * l.cost) / maxCost)}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="h-full bg-gradient-to-r from-indigo-600 to-teal-500 rounded-lg group-hover:from-indigo-500 group-hover:to-teal-400 transition-all"
                      />
                    </div>
                    <div className="w-36 text-right text-sm font-mono text-yellow-300">
                      {l.cost >= 1000 ? l.cost.toExponential(2) : l.cost.toFixed(2)}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Total Cost */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: levels.length * 0.05 + 0.2 }}
                className="pt-4 border-t border-indigo-700"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-indigo-300">Total Cost Estimate:</span>
                  <span className="text-2xl font-bold font-mono text-yellow-300">
                    {total >= 1000 ? total.toExponential(2) : total.toFixed(2)}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!error && levels.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-12 border-2 border-dashed border-indigo-700 rounded-xl bg-gray-800/30 text-center"
          >
            <div className="text-6xl mb-4">📊</div>
            <p className="text-indigo-300 text-lg">Enter a valid recurrence to visualize the tree</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
