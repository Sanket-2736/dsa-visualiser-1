import React, { useMemo, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import SnapshotButton from '../components/SnapshotButton'
import { AppContext } from '../context/AppContext'

// Puzzle Mode (Beat the Algorithm):
// Users are given a start array and a goal condition (sorted ascending).
// They can perform limited operations (swaps) to reach the goal in minimal steps.
// We ship curated puzzles with known optimal moves, so no heavy solver is needed.

const PUZZLES = [
  { id: 'p1', title: 'Warmup: 3 elements', start: [3,1,2], optimal: 2 },
  { id: 'p2', title: 'Mind the middle', start: [2,3,1,4], optimal: 2 },
  { id: 'p3', title: 'Near-sorted trap', start: [1,4,3,2,5], optimal: 2 },
  { id: 'p4', title: 'Duplicates allowed', start: [4,2,2,3,1], optimal: 3 },
  { id: 'p5', title: 'Five shuffle', start: [5,1,4,2,3], optimal: 3 },
]

function isSorted(arr) {
  for (let i=1;i<arr.length;i++) if (arr[i-1] > arr[i]) return false
  return true
}

export default function Puzzles() {
  const { unlockAchievement } = useContext(AppContext)
  const [index, setIndex] = useState(0)
  const puzzle = PUZZLES[index]
  const [state, setState] = useState(puzzle.start.slice())
  const [moves, setMoves] = useState(0)
  const [selected, setSelected] = useState(null)
  const [won, setWon] = useState(false)
  const [best, setBest] = useState(() => {
    const m = JSON.parse(localStorage.getItem('puzzleBest')||'{}');
    return m
  })

  const optimal = useMemo(()=>puzzle.optimal, [puzzle])

  function resetCurrent() {
    setState(puzzle.start.slice())
    setMoves(0)
    setSelected(null)
    setWon(false)
  }

  function nextPuzzle() {
    const ni = Math.min(PUZZLES.length - 1, index + 1)
    setIndex(ni)
    setState(PUZZLES[ni].start.slice())
    setMoves(0)
    setSelected(null)
    setWon(false)
  }

  function prevPuzzle() {
    const pi = Math.max(0, index - 1)
    setIndex(pi)
    setState(PUZZLES[pi].start.slice())
    setMoves(0)
    setSelected(null)
    setWon(false)
  }

  function onPick(i) {
    if (won) return
    if (selected === null) setSelected(i)
    else if (selected === i) setSelected(null)
    else {
      const a = Math.min(selected, i), b = Math.max(selected, i)
      const next = state.slice()
      const t = next[a]; next[a] = next[b]; next[b] = t
      const nm = moves + 1
      setState(next)
      setMoves(nm)
      setSelected(null)
      if (isSorted(next)) {
        setWon(true)
        setBest(prev => {
          const updated = { ...prev }
          const id = puzzle.id
          updated[id] = Math.min(updated[id] ?? Infinity, nm)
          localStorage.setItem('puzzleBest', JSON.stringify(updated))
          return updated
        })
        unlockAchievement('puzzle_novice')
        if (nm === optimal) unlockAchievement('puzzle_perfect')
      }
    }
  }

  const scoreNote = won ? (moves === optimal ? 'Perfect!' : moves < optimal ? 'Genius!' : `Optimal was ${optimal}`) : ''
  const bestFor = best[puzzle.id]
  const stars = won ? Math.max(1, 3 - Math.max(0, moves - optimal)) : (bestFor ? Math.max(1, 3 - Math.max(0, bestFor - optimal)) : 0)

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Puzzles — Beat the Algorithm</h1>
      <div className="text-sm text-neutral-600 mb-4">Sort the numbers in ascending order using the fewest swaps. Try to match or beat the optimal!</div>

      <div className="flex items-center gap-2 mb-3 p-3 border rounded-xl bg-white/80 shadow-sm">
        <button onClick={prevPuzzle} className="px-3 py-1 rounded bg-neutral-200">Prev</button>
        <div className="text-sm">{puzzle.title}</div>
        <button onClick={nextPuzzle} className="px-3 py-1 rounded bg-neutral-200">Next</button>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <div>Moves: <span className="font-medium">{moves}</span></div>
          <div>Optimal: <span className="font-medium">{optimal}</span></div>
          {bestFor && <div>Best: <span className="font-medium">{bestFor}</span></div>}
          {won && <div className="text-emerald-600 font-medium">{scoreNote}</div>}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 p-3 border rounded-xl bg-white/80 shadow-sm">
        <button onClick={resetCurrent} className="px-3 py-1 rounded bg-neutral-200">Reset</button>
        <Link to="/merge-sort" className="px-3 py-1 rounded bg-blue-600 text-white text-sm">See how Merge Sort does it</Link>
        <div className="ml-auto">
          <SnapshotButton targetSelector=".puzzle-capture" filename="puzzle.png" />
        </div>
      </div>

      <div className="flex gap-2 mt-2 puzzle-capture p-3 border rounded-xl bg-white/80 shadow-sm">
        {state.map((v, i) => (
          <button
            key={i}
            onClick={() => onPick(i)}
            className={`w-16 h-16 rounded-lg border text-xl font-semibold shadow-sm ${selected===i? 'bg-blue-50 border-blue-400' : 'bg-white'}`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="mt-3 text-sm">
        {stars>0 && (
          <div className="flex items-center gap-1 text-amber-500">
            {Array.from({length: stars}).map((_,i)=>(<span key={i}>★</span>))}
            {Array.from({length: Math.max(0,3-stars)}).map((_,i)=>(<span key={i}>☆</span>))}
          </div>
        )}
      </div>

      {!won && (
        <div className="mt-3 text-xs text-neutral-600">Tip: Select two tiles to swap them. Aim for the minimum number of swaps.</div>
      )}
    </div>
  )
}


