import React from 'react'
import { Link } from 'react-router-dom'

const DEMOS = [
  { title:'Maze A* Showcase', to:'/pathfinding-lab?state='+encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify({rows:20,cols:36,start:{r:1,c:1},goal:{r:18,c:34},algo:'astar',walls:[],weights:[]}))))), desc:'Auto-loaded state for a quick A* demo' },
  { title:'Benchmark Quick vs Merge', to:'/benchmarks', desc:'Open lab and run with defaults' },
  { title:'Puzzle: Five shuffle', to:'/puzzles', desc:'Try the p5 level' },
]

export default function Gallery(){
  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Gallery</h1>
      <div className="text-sm text-neutral-600 mb-4">One-click demos to show off the best parts.</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {DEMOS.map((d,i)=>(
          <Link key={i} to={d.to} className="p-4 border rounded-xl bg-white/80 shadow-sm hover:shadow">
            <div className="font-medium">{d.title}</div>
            <div className="text-xs text-neutral-600">{d.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}


