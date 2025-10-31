import React, { useMemo, useState } from 'react'

function bubbleComparisons(arr){
  let comps=0; const a=arr.slice()
  for(let i=0;i<a.length;i++) for(let j=0;j<a.length-i-1;j++){ comps++; if(a[j]>a[j+1]){ const t=a[j]; a[j]=a[j+1]; a[j+1]=t } }
  return comps
}

function mutate(a){
  const b=a.slice(); const i=Math.floor(Math.random()*b.length), j=Math.floor(Math.random()*b.length); [b[i],b[j]]=[b[j],b[i]]; return b
}

export default function Evolver(){
  const [n,setN]=useState(12)
  const [seed,setSeed]=useState(()=>Array.from({length:12},(_,i)=>i))
  const [best,setBest]=useState(null)
  function run(){
    let cur = seed.slice(), curScore=bubbleComparisons(cur)
    for(let gen=0; gen<200; gen++){
      const cand = mutate(cur), score=bubbleComparisons(cand)
      if(score>curScore){ cur=cand; curScore=score }
    }
    setBest({ arr: cur, comps: curScore })
  }
  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Worst‑Case Input Evolver</h1>
      <div className="text-sm text-neutral-600 mb-4">Evolve inputs that maximize comparisons for Bubble Sort.</div>
      <div className="flex items-end gap-3 mb-4 p-4 border rounded-xl bg-white/80 shadow-sm">
        <div>
          <label className="text-sm">Size</label>
          <input type="number" min={5} max={60} value={n} onChange={(e)=>{ const m=parseInt(e.target.value||'5',10); setN(m); setSeed(Array.from({length:m},(_,i)=>i)) }} className="block border rounded px-2 py-1 w-24" />
        </div>
        <button onClick={run} className="px-3 py-2 rounded bg-blue-600 text-white">Evolve</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3 border rounded-xl bg-white/80 shadow-sm">
          <div className="text-sm mb-1">Seed</div>
          <div className="flex gap-1 flex-wrap">{seed.map((x,i)=>(<span key={i} className="px-2 py-1 text-xs border rounded bg-white">{x}</span>))}</div>
        </div>
        <div className="p-3 border rounded-xl bg-white/80 shadow-sm">
          <div className="text-sm mb-1">Best Found</div>
          {best ? (
            <>
              <div className="text-xs">Comparisons: {best.comps}</div>
              <div className="flex gap-1 flex-wrap mt-1">{best.arr.map((x,i)=>(<span key={i} className="px-2 py-1 text-xs border rounded bg-white">{x}</span>))}</div>
            </>
          ) : <div className="text-xs text-neutral-600">Run to see results</div>}
        </div>
      </div>
    </div>
  )
}


