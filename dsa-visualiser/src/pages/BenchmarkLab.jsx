import React, { useMemo, useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'

function genArray(n, kind, seed = 42) {
  let arr = Array.from({ length: n }, (_, i) => i)
  function rng() {
    seed ^= seed << 13; seed ^= seed >> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296
  }
  if (kind === 'random') {
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
  } else if (kind === 'reversed') {
    arr.reverse()
  } else if (kind === 'nearly') {
    // 5% random swaps
    for (let k = 0; k < Math.max(1, Math.floor(n * 0.05)); k++) {
      const i = Math.floor(rng() * n), j = Math.floor(rng() * n)
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }
  return arr
}

// Simple reference algorithms (non-visual) for timing
function bubbleSort(a) {
  const arr = a.slice()
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        const t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t
      }
    }
  }
  return arr
}

function insertionSort(a) {
  const arr = a.slice()
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i]
    let j = i - 1
    while (j >= 0 && arr[j] > key) { arr[j + 1] = arr[j]; j-- }
    arr[j + 1] = key
  }
  return arr
}

function mergeSort(a) {
  const arr = a.slice()
  function ms(l, r) {
    if (r - l <= 1) return arr.slice(l, r)
    const m = (l + r) >> 1
    const L = ms(l, m), R = ms(m, r)
    const out = []
    let i = 0, j = 0
    while (i < L.length || j < R.length) {
      if (j >= R.length || (i < L.length && L[i] <= R[j])) out.push(L[i++])
      else out.push(R[j++])
    }
    return out
  }
  const sorted = ms(0, arr.length)
  return sorted
}

function quickSort(a) {
  const arr = a.slice()
  function qs(l, r){
    if(l>=r) return
    const pivot = arr[Math.floor((l+r)/2)]
    let i=l, j=r
    while(i<=j){
      while(arr[i] < pivot) i++
      while(arr[j] > pivot) j--
      if(i<=j){ const t=arr[i]; arr[i]=arr[j]; arr[j]=t; i++; j-- }
    }
    if(l<j) qs(l,j); if(i<r) qs(i,r)
  }
  qs(0, arr.length-1)
  return arr
}

function heapSort(a){
  const arr=a.slice(); const n=arr.length
  function heapify(n,i){
    let largest=i, l=2*i+1, r=2*i+2
    if(l<n && arr[l]>arr[largest]) largest=l
    if(r<n && arr[r]>arr[largest]) largest=r
    if(largest!==i){ const t=arr[i]; arr[i]=arr[largest]; arr[largest]=t; heapify(n,largest) }
  }
  for(let i=Math.floor(n/2)-1;i>=0;i--) heapify(n,i)
  for(let i=n-1;i>0;i--){ const t=arr[0]; arr[0]=arr[i]; arr[i]=t; heapify(i,0) }
  return arr
}

const SUITE = [
  { id: 'bubble', name: 'Bubble Sort', fn: bubbleSort },
  { id: 'insertion', name: 'Insertion Sort', fn: insertionSort },
  { id: 'merge', name: 'Merge Sort', fn: mergeSort },
  { id: 'quick', name: 'Quick Sort', fn: quickSort },
  { id: 'heap', name: 'Heap Sort', fn: heapSort },
]

export default function BenchmarkLab() {
  const { unlockAchievement } = useContext(AppContext)
  const [sizes, setSizes] = useState('100,200,400')
  const [dist, setDist] = useState('random')
  const [runs, setRuns] = useState(3)
  const [results, setResults] = useState(null)
  const [logScale, setLogScale] = useState(false)

  const parsedSizes = useMemo(() => sizes.split(',').map(s => parseInt(s.trim(), 10)).filter(Boolean), [sizes])

  function runBench() {
    const out = {}
    for (const alg of SUITE) out[alg.id] = []
    for (const n of parsedSizes) {
      const base = genArray(n, dist, 123)
      for (const alg of SUITE) {
        let total = 0
        for (let r = 0; r < runs; r++) {
          const data = base.slice()
          const t0 = performance.now()
          alg.fn(data)
          total += performance.now() - t0
        }
        out[alg.id].push({ n, ms: total / runs })
      }
    }
    setResults(out)
    unlockAchievement('benchmarker')
  }

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Benchmark Lab</h1>
        <p className="text-sm text-neutral-600 mt-1">Measure algorithm runtimes across sizes and distributions.</p>
      </div>
      <div className="flex flex-wrap gap-3 items-end mb-4 p-4 border rounded-xl bg-white/80 shadow-sm">
        <div>
          <label className="text-sm">Sizes (comma)</label>
          <input value={sizes} onChange={(e)=>setSizes(e.target.value)} className="block border rounded px-2 py-1" />
        </div>
        <div>
          <label className="text-sm">Distribution</label>
          <select value={dist} onChange={(e)=>setDist(e.target.value)} className="block border rounded px-2 py-1">
            <option value="random">Random</option>
            <option value="reversed">Reversed</option>
            <option value="nearly">Nearly-sorted</option>
          </select>
        </div>
        <div>
          <label className="text-sm">Runs per size</label>
          <input type="number" min={1} value={runs} onChange={(e)=>setRuns(parseInt(e.target.value||'1',10))} className="block border rounded px-2 py-1 w-24" />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <label className="text-sm">Log scale</label>
          <input type="checkbox" checked={logScale} onChange={(e)=>setLogScale(e.target.checked)} />
        </div>
        <button onClick={runBench} className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">Run</button>
        <button onClick={()=>exportCsv(results)} disabled={!results} className="px-3 py-2 rounded-lg bg-neutral-200 disabled:opacity-50">Export CSV</button>
      </div>

      {results && (
        <div className="overflow-x-auto">
          <div className="p-3 border rounded-xl bg-white/80 shadow-sm">
            <Chart results={results} sizes={parsedSizes} logScale={logScale} />
          </div>
          <table className="mt-4 w-full text-sm border rounded-xl overflow-hidden bg-white">
            <thead>
              <tr>
                <th className="text-left p-2 bg-neutral-50">Algorithm</th>
                {parsedSizes.map(n => <th key={n} className="text-right p-2 bg-neutral-50">n={n}</th>)}
              </tr>
            </thead>
            <tbody>
              {SUITE.map(alg => (
                <tr key={alg.id} className="odd:bg-white even:bg-neutral-50">
                  <td className="p-2 pr-4">{alg.name}</td>
                  {results[alg.id].map(x => (
                    <td key={x.n} className="p-2 text-right">{x.ms.toFixed(2)} ms</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function Chart({ results, sizes, logScale }) {
  const colors = { bubble: '#ef4444', insertion: '#f59e0b', merge: '#10b981', quick: '#3b82f6', heap: '#a855f7' }
  const all = Object.values(results).flat().map(x=>x.ms)
  const maxY = Math.max(...all, 1)
  const minY = Math.min(...all, 0.1)
  const width = Math.max(360, sizes.length * 140)
  const height = 260
  const pad = 36
  const innerW = width - pad * 2
  const innerH = height - pad * 2
  return (
    <svg width={width} height={height} className="bg-white border rounded">
      <g transform={`translate(${pad},${pad})`}>
        {/* axes */}
        <line x1={0} y1={innerH} x2={innerW} y2={innerH} stroke="#999" />
        <line x1={0} y1={0} x2={0} y2={innerH} stroke="#999" />
        {Object.entries(results).map(([key, arr], i) => {
          const dx = innerW / Math.max(1, sizes.length - 1)
          const scale = (v)=> logScale ? (Math.log10(v) - Math.log10(minY)) / (Math.log10(maxY) - Math.log10(minY)) : (v / maxY)
          const pts = arr.map((p, idx) => [idx * dx, innerH - scale(p.ms) * innerH])
          const d = pts.map((p, j) => (j === 0 ? `M ${p[0]},${p[1]}` : `L ${p[0]},${p[1]}`)).join(' ')
          return (
            <g key={key}>
              <path d={d} fill="none" stroke={colors[key]} strokeWidth={2} />
              {pts.map((p, j) => (
                <circle key={j} cx={p[0]} cy={p[1]} r={3} fill={colors[key]} />
              ))}
            </g>
          )
        })}
        {sizes.map((n, idx) => (
          <text key={n} x={(innerW / Math.max(1, sizes.length - 1)) * idx} y={innerH + 14} fontSize={10}>{n}</text>
        ))}
        <text x={0} y={-8} fontSize={10}>Time (ms)</text>
      </g>
      {/* legend */}
      <g transform={`translate(${pad},${height - 10})`}>
        {[
          ['bubble','Bubble'],
          ['insertion','Insertion'],
          ['merge','Merge'],
          ['quick','Quick'],
          ['heap','Heap'],
        ].map(([k,label], i) => (
          <g key={k} transform={`translate(${i*100},0)`}>
            <rect x={0} y={-8} width={12} height={4} fill={colors[k]} />
            <text x={16} y={-5} fontSize={10}>{label}</text>
          </g>
        ))}
      </g>
    </svg>
  )
}

function exportCsv(results){
  if(!results) return
  const algs=Object.keys(results)
  const sizes = results[algs[0]].map(x=>x.n)
  let rows = [['Algorithm', ...sizes.map(n=>`n=${n}`)]]
  for(const a of algs){ rows.push([a, ...results[a].map(x=>x.ms.toFixed(3))]) }
  const csv = rows.map(r=>r.join(',')).join('\n')
  const blob = new Blob([csv], {type:'text/csv'})
  const url = URL.createObjectURL(blob)
  const a=document.createElement('a'); a.href=url; a.download='benchmarks.csv'; a.click(); URL.revokeObjectURL(url)
}


