import React, { useMemo, useState } from 'react'

function gen(n, kind){
  const a=Array.from({length:n},(_,i)=>i)
  if(kind==='reversed') return a.reverse()
  if(kind==='nearly'){ const b=a.slice(); for(let k=0;k<Math.max(1,Math.floor(n*0.05));k++){ const i=Math.floor(Math.random()*n), j=Math.floor(Math.random()*n); [b[i],b[j]]=[b[j],b[i]] } return b }
  for(let i=n-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] }
  return a
}
function time(fn, a){ const arr=a.slice(); const t0=performance.now(); fn(arr); return performance.now()-t0 }
function insertion(a){ const arr=a.slice(); for(let i=1;i<arr.length;i++){ const k=arr[i]; let j=i-1; while(j>=0&&arr[j]>k){ arr[j+1]=arr[j]; j-- } arr[j+1]=k } return arr }
function merge(a){ const arr=a.slice(); function ms(l,r){ if(r-l<=1) return arr.slice(l,r); const m=(l+r)>>1; const L=ms(l,m), R=ms(m,r); const out=[]; let i=0,j=0; while(i<L.length||j<R.length){ if(j>=R.length||(i<L.length&&L[i]<=R[j])) out.push(L[i++]); else out.push(R[j++]) } return out } return ms(0,arr.length) }
function quick(a){ const arr=a.slice(); function qs(l,r){ if(l>=r) return; const p=arr[Math.floor((l+r)/2)]; let i=l,j=r; while(i<=j){ while(arr[i]<p)i++; while(arr[j]>p)j--; if(i<=j){ const t=arr[i]; arr[i]=arr[j]; arr[j]=t; i++; j-- } } if(l<j) qs(l,j); if(i<r) qs(i,r) } qs(0,arr.length-1); return arr }

const ALGOS = [ ['Insertion', insertion], ['Merge', merge], ['Quick', quick] ]

export default function Bracket(){
  const [n,setN]=useState(200)
  const [kind,setKind]=useState('random')
  const [tree,setTree]=useState(null)
  function run(){
    const base = gen(n, kind)
    const [a,b,c] = ALGOS
    const r1a = time(a[1], base), r1b = time(b[1], base)
    const semiWinner = r1a<r1b ? a[0] : b[0]
    const semiTime = Math.min(r1a, r1b)
    const r2a = time(c[1], base), r2b = semiTime
    const finalWinner = r2a<r2b ? c[0] : semiWinner
    setTree({ matches:[
      { A:a[0], B:b[0], tA:r1a, tB:r1b, win: semiWinner },
      { A:c[0], B:semiWinner, tA:r2a, tB:r2b, win: finalWinner }
    ], champion: finalWinner })
  }
  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Algorithm Bracket Tournament</h1>
      <div className="text-sm text-neutral-600 mb-4">Head‑to‑head matchups on the same input; fastest advances.</div>
      <div className="flex items-end gap-3 mb-4 p-4 border rounded-xl bg-white/80 shadow-sm">
        <div>
          <label className="text-sm">Size</label>
          <input type="number" value={n} onChange={(e)=>setN(parseInt(e.target.value||'10',10))} className="block border rounded px-2 py-1 w-24" />
        </div>
        <div>
          <label className="text-sm">Distribution</label>
          <select value={kind} onChange={(e)=>setKind(e.target.value)} className="block border rounded px-2 py-1">
            <option value="random">Random</option>
            <option value="reversed">Reversed</option>
            <option value="nearly">Nearly‑sorted</option>
          </select>
        </div>
        <button onClick={run} className="px-3 py-2 rounded bg-blue-600 text-white">Run Tournament</button>
      </div>
      {tree && (
        <div className="p-4 border rounded-xl bg-white/80 shadow-sm text-sm">
          <div className="font-medium mb-2">Champion: {tree.champion}</div>
          <div className="space-y-2">
            {tree.matches.map((m,i)=>(
              <div key={i} className="flex items-center justify-between">
                <div>Match {i+1}: {m.A} vs {m.B}</div>
                <div>{m.tA.toFixed(2)} ms vs {m.tB.toFixed(2)} ms → <span className="font-medium">{m.win}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


