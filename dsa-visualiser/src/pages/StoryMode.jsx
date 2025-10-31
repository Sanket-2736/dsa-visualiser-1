import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const CHAPTERS = [
  {
    title: 'The Maze Explorer (BFS)',
    levels: {
      beginner: 'You move level by level — visiting all nearby rooms before going deeper. Perfect for finding the shortest way in a maze.',
      intermediate: 'Use a queue to explore neighbors in layers. Ideal for shortest paths in unweighted graphs.',
      expert: 'O(V + E) time. Essential for bipartite checks, shortest unweighted paths, and multi-source propagation.'
    },
    link: '/bfs'
  },
  {
    title: 'The Deep Diver (DFS)',
    levels: {
      beginner: 'You dive deep into one tunnel until a dead end, then backtrack. You explore before returning.',
      intermediate: 'Use recursion or a stack. Useful for connected components, cycles, and topological sorting.',
      expert: 'O(V + E) time. Understand entry/exit times, recursion stack implications, and graph traversal trees.'
    },
    link: '/dfs'
  },
  {
    title: 'The Pathfinder (Dijkstra’s Algorithm)',
    levels: {
      beginner: 'You walk through roads, always picking the nearest unvisited city first.',
      intermediate: 'Use a priority queue (min-heap) to expand shortest distance nodes. Works for positive edge weights.',
      expert: 'O(E log V) with binary heap. Compare with Bellman-Ford and A*, analyze optimization with Fibonacci heap.'
    },
    link: '/dijkstra'
  }
]

export default function GraphStories() {
  const { explainLevel } = useContext(AppContext)
  const [i, setI] = useState(0)
  const ch = CHAPTERS[i]

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
        Graph Adventures
      </h1>
      <div className="text-neutral-600 text-sm mb-4">
        Explore how explorers, divers, and pathfinders reveal the secrets of graphs. Explain level adapts to your preference.
      </div>
      <div className="p-4 border rounded-xl bg-white/80 shadow-sm">
        <div className="text-lg font-medium mb-2">{ch.title}</div>
        <div className="text-sm mb-3">{ch.levels[explainLevel] || ch.levels.beginner}</div>
        <Link
          to={ch.link}
          className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm"
        >
          See it in action
        </Link>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setI(Math.max(0, i - 1))}
          className="px-3 py-1 rounded-lg bg-neutral-200"
        >
          Prev
        </button>
        <button
          onClick={() => setI(Math.min(CHAPTERS.length - 1, i + 1))}
          className="px-3 py-1 rounded-lg bg-neutral-200"
        >
          Next
        </button>
      </div>
    </div>
  )
}
