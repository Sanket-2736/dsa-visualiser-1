import React, { useMemo, useState } from 'react'

// Supported function patterns with validation
const FUNCTION_PATTERNS = [
  { regex: /^1$/i, label: '1', parse: () => ({ type: 'constant', value: 1 }) },
  { regex: /^log\s*n$/i, label: 'log n', parse: () => ({ type: 'log' }) },
  { regex: /^n$/i, label: 'n', parse: () => ({ type: 'linear' }) },
  { regex: /^n\s*log\s*n$/i, label: 'n log n', parse: () => ({ type: 'nlogn' }) },
  { regex: /^n\^(\d+\.?\d*)$/i, label: 'n^k', parse: (match) => ({ type: 'power', k: parseFloat(match[1]) }) }
]

function parse(rec) {
  // Pattern: aT(n/b) + f(n)
  const pattern = /^(\d+)\s*T\s*\(\s*n\s*\/\s*(\d+)\s*\)\s*\+\s*(.+)$/i
  const match = rec.trim().match(pattern)
  
  if (!match) {
    return { error: 'Invalid format. Use: aT(n/b) + f(n)', a: 2, b: 2, f: 'n', fParsed: { type: 'linear' } }
  }
  
  const a = parseInt(match[1], 10)
  const b = parseInt(match[2], 10)
  const fStr = match[3].trim()
  
  // Validate a and b
  if (a < 1 || b < 2) {
    return { error: 'Invalid values: a ≥ 1, b ≥ 2', a: 2, b: 2, f: 'n', fParsed: { type: 'linear' } }
  }
  
  // Parse f(n)
  let fParsed = null
  for (const pattern of FUNCTION_PATTERNS) {
    const fMatch = fStr.match(pattern.regex)
    if (fMatch) {
      fParsed = pattern.parse(fMatch)
      break
    }
  }
  
  if (!fParsed) {
    return { error: 'Unsupported f(n). Use: 1, log n, n, n log n, or n^k', a, b, f: fStr, fParsed: { type: 'linear' } }
  }
  
  return { a, b, f: fStr, fParsed, error: null }
}

function evaluateF(fParsed, subN) {
  // Prevent negative/zero for log operations
  const safeN = Math.max(2, subN)
  
  switch (fParsed.type) {
    case 'constant':
      return 1
    case 'log':
      return Math.log2(safeN)
    case 'linear':
      return subN
    case 'nlogn':
      return subN * Math.log2(safeN)
    case 'power':
      return Math.pow(subN, fParsed.k)
    default:
      return subN
  }
}

function costAtLevel(level, n, a, b, fParsed) {
  const nodes = Math.pow(a, level)
  const subN = n / Math.pow(b, level)
  const base = evaluateF(fParsed, subN)
  return nodes * base
}

function getMasterTheorem(a, b, fParsed) {
  const logba = Math.log(a) / Math.log(b)
  
  if (fParsed.type === 'constant') {
    return logba > 0 ? `Θ(n^${logba.toFixed(2)})` : 'Θ(1)'
  } else if (fParsed.type === 'linear') {
    if (Math.abs(logba - 1) < 0.01) return 'Θ(n log n)'
    if (logba > 1) return `Θ(n^${logba.toFixed(2)})`
    return 'Θ(n)'
  } else if (fParsed.type === 'nlogn') {
    if (Math.abs(logba - 1) < 0.01) return 'Θ(n log² n)'
    if (logba > 1) return `Θ(n^${logba.toFixed(2)})`
    return 'Θ(n log n)'
  } else if (fParsed.type === 'log') {
    return logba > 0 ? `Θ(n^${logba.toFixed(2)})` : 'Θ(log n)'
  } else if (fParsed.type === 'power') {
    if (Math.abs(logba - fParsed.k) < 0.01) return `Θ(n^${fParsed.k} log n)`
    if (logba > fParsed.k) return `Θ(n^${logba.toFixed(2)})`
    return `Θ(n^${fParsed.k})`
  }
  
  return 'Unable to determine'
}

export default function RecurrenceTree() {
  const [rec, setRec] = useState('2T(n/2) + n')
  const [n, setN] = useState(1024)
  const [showHelp, setShowHelp] = useState(false)
  
  const parsed = useMemo(() => parse(rec), [rec])
  const { a, b, fParsed, error } = parsed
  
  const levels = useMemo(() => {
    if (error || b < 2 || n < 1) return []
    
    const L = []
    const maxL = Math.min(20, Math.ceil(Math.log(n) / Math.log(b))) // Cap at 20 levels
    
    for (let i = 0; i <= maxL; i++) {
      const cost = costAtLevel(i, n, a, b, fParsed)
      if (!isFinite(cost)) break
      L.push({ level: i, cost })
    }
    
    return L
  }, [a, b, fParsed, n, error])
  
  const total = useMemo(() => 
    levels.reduce((sum, l) => sum + l.cost, 0),
    [levels]
  )
  
  const maxCost = useMemo(() => 
    Math.max(...levels.map(l => l.cost), 1),
    [levels]
  )
  
  const complexity = useMemo(() => 
    error ? null : getMasterTheorem(a, b, fParsed),
    [a, b, fParsed, error]
  )
  
  const handleNChange = (e) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 1 && value <= 1000000) {
      setN(value)
    }
  }
  
  const examples = [
    { label: 'Merge Sort', value: '2T(n/2) + n' },
    { label: 'Binary Search', value: '1T(n/2) + 1' },
    { label: 'Karatsuba', value: '3T(n/2) + n' },
    { label: 'Strassen', value: '7T(n/2) + n^2' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
            Recurrence Tree Visualizer
          </h1>
          <p className="text-sm text-slate-600">
            Analyze divide-and-conquer recurrences T(n) = aT(n/b) + f(n)
          </p>
        </div>

        {/* Input Section */}
        <div className="mb-6 p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
          <div className="flex flex-wrap items-end gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="recurrence-input" className="block text-sm font-medium text-slate-700 mb-1">
                Recurrence Relation
              </label>
              <input
                id="recurrence-input"
                type="text"
                value={rec}
                onChange={(e) => setRec(e.target.value)}
                placeholder="e.g., 2T(n/2) + n"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-describedby="recurrence-help"
                aria-invalid={!!error}
              />
            </div>
            
            <div className="w-32">
              <label htmlFor="n-input" className="block text-sm font-medium text-slate-700 mb-1">
                Input Size (n)
              </label>
              <input
                id="n-input"
                type="number"
                value={n}
                onChange={handleNChange}
                min="1"
                max="1000000"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Input size n"
              />
            </div>
            
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-expanded={showHelp}
              aria-controls="help-section"
            >
              {showHelp ? 'Hide' : 'Show'} Help
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2" role="alert">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-red-800">{error}</span>
            </div>
          )}

          {/* Help Section */}
          {showHelp && (
            <div id="help-section" className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-blue-900 mb-1">Supported f(n) Functions:</h3>
                <p className="text-xs text-blue-800">1, log n, n, n log n, n^k (e.g., n^2, n^3)</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Examples:</h3>
                <div className="flex flex-wrap gap-2">
                  {examples.map((ex) => (
                    <button
                      key={ex.label}
                      onClick={() => setRec(ex.value)}
                      className="px-3 py-1 text-xs bg-white border border-blue-300 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      {ex.label}: <code className="font-mono">{ex.value}</code>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Complexity Result */}
          {!error && complexity && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-emerald-900">
                  <strong>Asymptotic Complexity:</strong> <code className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded">{complexity}</code>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Visualization Section */}
        {!error && levels.length > 0 && (
          <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Level-by-Level Cost Analysis</h2>
            
            <div className="space-y-2 mb-5" role="list" aria-label="Recurrence tree levels">
              {levels.map((l) => (
                <div key={l.level} className="flex items-center gap-3 group" role="listitem">
                  <div className="w-20 text-xs font-medium text-slate-600">
                    Level {l.level}
                  </div>
                  <div className="flex-1 h-6 bg-slate-100 rounded-lg overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg transition-all duration-300 group-hover:from-blue-600 group-hover:to-cyan-600"
                      style={{ width: `${Math.min(100, (100 * l.cost) / maxCost)}%` }}
                      role="progressbar"
                      aria-valuenow={l.cost}
                      aria-valuemin="0"
                      aria-valuemax={maxCost}
                      aria-label={`Level ${l.level} cost`}
                    />
                  </div>
                  <div className="w-32 text-right text-xs font-mono text-slate-700">
                    {l.cost >= 1000 ? l.cost.toExponential(2) : l.cost.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Cost */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-700">Total Cost Estimate:</span>
                <span className="text-lg font-bold font-mono text-blue-600">
                  {total >= 1000 ? total.toExponential(2) : total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && levels.length === 0 && (
          <div className="p-10 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-center">
            <svg className="w-12 h-12 mx-auto mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-slate-600 text-sm">Enter a valid recurrence to visualize the tree</p>
          </div>
        )}
      </div>
    </div>
  )
}
