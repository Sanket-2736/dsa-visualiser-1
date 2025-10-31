import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const STEPS = [
  { key:'puzzle_novice', title:'Solve a Puzzle', to:'/puzzles' },
  { key:'pathfinder', title:'Complete a Pathfinding Run', to:'/pathfinding-lab' },
  { key:'benchmarker', title:'Run a Benchmark', to:'/benchmarks' },
  { key:'drill_starter', title:'Finish a Drill Set', to:'/drills' },
]

export default function Course(){
  const { achievements } = useContext(AppContext)
  const done = (k)=> Boolean(achievements[k])
  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Guided Course</h1>
      <div className="text-sm text-neutral-600 mb-4">Follow these steps to experience the highlights. Your progress unlocks achievements and your certificate updates automatically.</div>
      <div className="space-y-2">
        {STEPS.map(s => (
          <div key={s.key} className={`p-3 border rounded-xl bg-white/80 shadow-sm flex items-center justify-between ${done(s.key)?'opacity-80':''}`}>
            <div className="text-sm">{s.title}</div>
            <div className="flex items-center gap-2">
              {done(s.key) ? <span className="text-xs text-emerald-600">Done</span> : <Link to={s.to} className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm">Go</Link>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


