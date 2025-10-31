import React from 'react'
import { Link } from 'react-router-dom'

const FEATURES = [
  { title: 'Algorithm Recommender', desc: 'Get tailored suggestions.', to: '/recommend' },
  { title: 'Puzzle Mode', desc: 'Beat the algorithm with minimal moves.', to: '/puzzles' },
  { title: 'Story Mode', desc: 'Memorable narratives for core ideas.', to: '/story' },
  { title: 'Race Day', desc: 'Side-by-side visual races.', to: '/race' },
  { title: 'What‑If Lab', desc: 'Tweak inputs; see recommendations.', to: '/what-if' },
  { title: 'Drill Coach', desc: 'Timed interview micro‑drills.', to: '/drills' },
  { title: 'Personality Cards', desc: 'Collect strengths and quirks.', to: '/cards' },
  { title: 'Misconception Fixer', desc: 'Spot and fix common pitfalls.', to: '/fixer' },
  { title: 'Algorithm Museum', desc: 'Scroll a short timeline.', to: '/museum' },
  { title: 'Pathfinding Lab', desc: 'A*/Dijkstra on your grid.', to: '/pathfinding-lab' },
  { title: 'Benchmark Lab', desc: 'Measure and compare runtimes.', to: '/benchmarks' },
  { title: 'Playground (OJ)', desc: 'Run code against tests.', to: '/playground' },
  { title: 'Proof Mode', desc: 'Drag invariants onto steps.', to: '/proof' },
  { title: 'Recurrence Tree', desc: 'Animate T(n)=aT(n/b)+f(n).', to: '/recurrence' },
  { title: 'Worst‑Case Evolver', desc: 'Evolve adversarial inputs.', to: '/evolver' },
  { title: 'Cache Simulator', desc: 'Visualize cache hits/misses.', to: '/cache' },
  { title: 'Bracket Tournament', desc: 'Head‑to‑head winners.', to: '/bracket' },
  { title: 'DSL Sandbox', desc: 'Type commands → animate.', to: '/dsl' },
  { title: 'Performance Heatmap', desc: 'Disorder × duplicates grid.', to: '/heatmap' },
  { title: 'Debug‑the‑Bug', desc: 'Fix minimal code errors.', to: '/debug-bug' },
  { title: 'Story Builder', desc: 'Create narrated tours.', to: '/story-builder' },
]

export default function FeatureHub(){
  return (
    <section className="py-10 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-semibold mb-4">Explore More</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <Link key={i} to={f.to} className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow">
              <div className="font-medium">{f.title}</div>
              <div className="text-sm text-neutral-600 mt-1">{f.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}


