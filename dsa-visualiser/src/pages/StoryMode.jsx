import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const CHAPTERS = [
  {
    title: 'The Tournament (Merge Sort)',
    levels: {
      beginner: 'Teams line up. Each round, winners pair and move on. Fewer mistakes when pairing equals.',
      intermediate: 'Divide array into halves, conquer by sorting those, and merge in linear time. Stable and predictable.',
      expert: 'Use recursion depth O(log n), merge in O(n). Great for linked lists and external sorting due to sequential access.'
    },
    link: '/merge-sort'
  },
  {
    title: 'The Treasure Map (Binary Search)',
    levels: {
      beginner: 'Fold the map in half each time until the treasure is under your finger.',
      intermediate: 'Maintain low/high bounds; pick mid; discard half. O(log n) for sorted data.',
      expert: 'Beware overflow on mid and off-by-one. Works on monotonic predicates with binary lifting.'
    },
    link: '/binary-search'
  },
  {
    title: 'The Network Builder (MST)',
    levels: {
      beginner: 'Connect islands with rope without loops, spending as little rope as possible.',
      intermediate: 'Choose cheapest edges that don’t make cycles (Kruskal) or grow from a node by cheapest connection (Prim).',
      expert: 'Cut and cycle properties. Dense vs sparse graph tradeoffs. Fibonacci heaps and complexity nuances.'
    },
    link: '/prims-algo'
  }
]

export default function StoryMode() {
  const { explainLevel } = useContext(AppContext)
  const [i, setI] = useState(0)
  const ch = CHAPTERS[i]
  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Story Mode</h1>
      <div className="text-neutral-600 text-sm mb-4">Short narratives that make concepts stick. Explain level adapts to your preference.</div>
      <div className="p-4 border rounded-xl bg-white/80 shadow-sm">
        <div className="text-lg font-medium mb-2">{ch.title}</div>
        <div className="text-sm mb-3">{ch.levels[explainLevel] || ch.levels.beginner}</div>
        <Link to={ch.link} className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm">See it in action</Link>
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={()=>setI(Math.max(0, i-1))} className="px-3 py-1 rounded-lg bg-neutral-200">Prev</button>
        <button onClick={()=>setI(Math.min(CHAPTERS.length-1, i+1))} className="px-3 py-1 rounded-lg bg-neutral-200">Next</button>
      </div>
    </div>
  )
}


