import React, { useState } from 'react'

// Shows a flawed step and asks user to spot/correct it
const CASES = [
  {
    id:'c1', title:'Binary Search Off-by-One',
    flawed:'mid = (low + high) / 2; if (A[mid] < target) low = mid; else high = mid;',
    fix:'When discarding lower half, use low = mid + 1; and when discarding upper, use high = mid - 1; otherwise infinite loop on 2 elements.'
  },
  {
    id:'c2', title:'MST Cycle Mistake',
    flawed:'Always pick next cheapest edge and add to tree.',
    fix:'Must check cycle formation (e.g., DSU/Union-Find). Cheapest edge can create a cycle.'
  }
]

export default function MisconceptionFixer(){
  const [i,setI]=useState(0)
  const [show,setShow]=useState(false)
  const c = CASES[i]
  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Misconception Fixer</h1>
      <div className="text-sm text-neutral-600 mb-3">Spot the issue, then reveal the fix.</div>
      <div className="p-4 border rounded-xl bg-white/80 shadow-sm">
        <div className="font-medium mb-2">{c.title}</div>
        <div className="text-sm whitespace-pre-wrap mb-3">{c.flawed}</div>
        {!show ? (
          <button onClick={()=>setShow(true)} className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm">Reveal Fix</button>
        ) : (
          <div className="text-sm text-emerald-700">{c.fix}</div>
        )}
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={()=>{setI(Math.max(0,i-1)); setShow(false)}} className="px-3 py-1 rounded-lg bg-neutral-200">Prev</button>
        <button onClick={()=>{setI(Math.min(CASES.length-1,i+1)); setShow(false)}} className="px-3 py-1 rounded-lg bg-neutral-200">Next</button>
      </div>
    </div>
  )
}


