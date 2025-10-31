import React, { useCallback, useMemo, useRef, useState, useContext } from 'react'
import SnapshotButton from '../components/SnapshotButton'
import { AppContext } from '../context/AppContext'

const DEFAULT_ROWS = 20
const DEFAULT_COLS = 36

function makeGrid(rows, cols) {
  return Array.from({ length: rows }, (_, r) => (
    Array.from({ length: cols }, (_, c) => ({ r, c, wall: false, weight: 1 }))
  ))
}

function hManhattan(a, b) {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c)
}

function neighbors4(r, c, rows, cols) {
  const out = []
  if (r > 0) out.push([r - 1, c])
  if (r + 1 < rows) out.push([r + 1, c])
  if (c > 0) out.push([r, c - 1])
  if (c + 1 < cols) out.push([r, c + 1])
  return out
}

function neighbors8(r, c, rows, cols) {
  const out = neighbors4(r, c, rows, cols)
  if (r > 0 && c > 0) out.push([r - 1, c - 1])
  if (r > 0 && c + 1 < cols) out.push([r - 1, c + 1])
  if (r + 1 < rows && c > 0) out.push([r + 1, c - 1])
  if (r + 1 < rows && c + 1 < cols) out.push([r + 1, c + 1])
  return out
}

function reconstructPath(prev, goalKey) {
  const path = []
  let cur = goalKey
  while (cur && prev.has(cur)) {
    path.push(cur)
    cur = prev.get(cur)
  }
  if (cur) path.push(cur)
  return path.reverse()
}

function keyOf(r, c) { return `${r},${c}` }

function runDijkstra(grid, start, goal, opts) {
  const rows = grid.length, cols = grid[0].length
  const dist = new Map()
  const prev = new Map()
  const visited = new Set()
  const open = new Set()
  const visitOrder = []
  const sKey = keyOf(start.r, start.c)
  const gKey = keyOf(goal.r, goal.c)
  dist.set(sKey, 0)
  open.add(sKey)

  function extractMin() {
    let best = null, bestD = Infinity
    for (const k of open) {
      const d = dist.get(k) ?? Infinity
      if (d < bestD) { bestD = d; best = k }
    }
    if (best) open.delete(best)
    return best
  }

  while (open.size) {
    const curKey = extractMin()
    if (!curKey) break
    if (visited.has(curKey)) continue
    visited.add(curKey)
    const [r, c] = curKey.split(',').map(Number)
    visitOrder.push(curKey)
    if (curKey === gKey) break
    const neigh = opts?.diagonals ? neighbors8 : neighbors4
    for (const [nr, nc] of neigh(r, c, rows, cols)) {
      const cell = grid[nr][nc]
      if (cell.wall) continue
      const nKey = keyOf(nr, nc)
      const stepCost = (nr!==r && nc!==c) ? Math.SQRT2 : 1
      const alt = (dist.get(curKey) ?? Infinity) + Math.max(1, cell.weight) * stepCost
      if (alt < (dist.get(nKey) ?? Infinity)) {
        dist.set(nKey, alt)
        prev.set(nKey, curKey)
        open.add(nKey)
      }
    }
  }

  const path = reconstructPath(prev, gKey)
  return { visitOrder, path }
}

function runAStar(grid, start, goal, heuristic = hManhattan, opts) {
  const rows = grid.length, cols = grid[0].length
  const sKey = keyOf(start.r, start.c)
  const gKey = keyOf(goal.r, goal.c)
  const gScore = new Map([[sKey, 0]])
  const fScore = new Map([[sKey, heuristic(start, goal)]])
  const prev = new Map()
  const open = new Set([sKey])
  const closed = new Set()
  const visitOrder = []

  function extractMinF() {
    let best = null, bestF = Infinity
    for (const k of open) {
      const f = fScore.get(k) ?? Infinity
      if (f < bestF) { bestF = f; best = k }
    }
    if (best) open.delete(best)
    return best
  }

  while (open.size) {
    const curKey = extractMinF()
    if (!curKey) break
    if (closed.has(curKey)) continue
    closed.add(curKey)
    const [r, c] = curKey.split(',').map(Number)
    visitOrder.push(curKey)
    if (curKey === gKey) break
    const neigh = opts?.diagonals ? neighbors8 : neighbors4
    for (const [nr, nc] of neigh(r, c, rows, cols)) {
      const cell = grid[nr][nc]
      if (cell.wall) continue
      const nKey = keyOf(nr, nc)
      const stepCost = (nr!==r && nc!==c) ? Math.SQRT2 : 1
      const tentative = (gScore.get(curKey) ?? Infinity) + Math.max(1, cell.weight) * stepCost
      if (tentative < (gScore.get(nKey) ?? Infinity)) {
        prev.set(nKey, curKey)
        gScore.set(nKey, tentative)
        const h = heuristic({ r: nr, c: nc }, goal)
        const f = tentative + h + (opts?.tiebreaker ? 1e-4 * (nr + nc) : 0)
        fScore.set(nKey, f)
        open.add(nKey)
      }
    }
  }
  const path = reconstructPath(prev, gKey)
  return { visitOrder, path }
}

export default function PathfindingLab() {
  const { unlockAchievement } = useContext(AppContext)
  const [rows, setRows] = useState(DEFAULT_ROWS)
  const [cols, setCols] = useState(DEFAULT_COLS)
  const [grid, setGrid] = useState(() => makeGrid(DEFAULT_ROWS, DEFAULT_COLS))
  const [mode, setMode] = useState('wall') // wall | weight | start | goal
  const [start, setStart] = useState({ r: 10, c: 4 })
  const [goal, setGoal] = useState({ r: 10, c: 30 })
  const [algo, setAlgo] = useState('astar') // astar | dijkstra
  const [heuristic, setHeuristic] = useState('manhattan') // manhattan | euclidean | diagonal
  const [diagonals, setDiagonals] = useState(false)
  const [tiebreaker, setTiebreaker] = useState(true)
  const [speedMs, setSpeedMs] = useState(12)
  const [paused, setPaused] = useState(false)
  const [running, setRunning] = useState(false)
  const [visited, setVisited] = useState(new Set())
  const [path, setPath] = useState(new Set())
  const dragging = useRef(false)
  const lastRunRef = useRef(null)

  const gridKey = useMemo(() => `${rows}x${cols}`, [rows, cols])

  function resetGrid() {
    setGrid(makeGrid(rows, cols))
    setVisited(new Set())
    setPath(new Set())
  }

  function resize() {
    setGrid(makeGrid(rows, cols))
    setVisited(new Set())
    setPath(new Set())
  }

  const applyCell = useCallback((r, c) => {
    setGrid(prev => {
      const nxt = prev.map(row => row.slice())
      const cell = { ...nxt[r][c] }
      if (mode === 'wall') cell.wall = !cell.wall
      if (mode === 'weight') cell.weight = cell.weight === 1 ? 5 : 1
      nxt[r][c] = cell
      return nxt
    })
  }, [mode])

  function onCellMouseDown(r, c) {
    dragging.current = true
    if (mode === 'start') setStart({ r, c })
    else if (mode === 'goal') setGoal({ r, c })
    else applyCell(r, c)
  }
  function onCellEnter(r, c) {
    if (!dragging.current) return
    if (mode === 'start') setStart({ r, c })
    else if (mode === 'goal') setGoal({ r, c })
    else applyCell(r, c)
  }
  function onMouseUp() { dragging.current = false }

  const runnerRef = useRef({ timer: null })

  function selectHeuristic() {
    if (heuristic === 'euclidean') return (a,b)=>Math.hypot(a.r-b.r, a.c-b.c)
    if (heuristic === 'diagonal') return (a,b)=>Math.max(Math.abs(a.r-b.r), Math.abs(a.c-b.c))
    return hManhattan
  }

  function run() {
    setRunning(true)
    setPaused(false)
    setVisited(new Set())
    setPath(new Set())
    const g = grid
    const result = algo === 'astar' ? runAStar(g, start, goal, selectHeuristic(), { diagonals, tiebreaker }) : runDijkstra(g, start, goal, { diagonals })
    const vOrder = result.visitOrder
    const p = result.path
    // store last run for export/share
    lastRunRef.current = {
      meta: serializeState(grid, rows, cols, start, goal, algo),
      visitOrder: vOrder,
      path: p,
      timestamp: Date.now(),
    }
    // animate visit then path
    let i = 0
    const visitSet = new Set()
    const pathSet = new Set()
    if (runnerRef.current.timer) clearInterval(runnerRef.current.timer)
    const tick = () => {
      if (i < vOrder.length) {
        visitSet.add(vOrder[i])
        setVisited(new Set(visitSet))
        i++
      } else if (i < vOrder.length + p.length) {
        const idx = i - vOrder.length
        pathSet.add(p[idx])
        setPath(new Set(pathSet))
        i++
      } else {
        clearInterval(runnerRef.current.timer)
        setRunning(false)
        unlockAchievement('pathfinder')
      }
    }
    runnerRef.current.timer = setInterval(tick, Math.max(4, speedMs))
  }

  function pauseResume() {
    if (!running) return
    if (!paused) {
      setPaused(true)
      if (runnerRef.current.timer) clearInterval(runnerRef.current.timer)
    } else {
      setPaused(false)
      run()
    }
  }

  function generateMaze() {
    const rCount = rows, cCount = cols
    const g = makeGrid(rCount, cCount)
    for (let r=0;r<rCount;r++) for (let c=0;c<cCount;c++) g[r][c].wall = true
    function carve(r,c){
      g[r][c].wall=false
      const dirs=[[1,0],[-1,0],[0,1],[0,-1]].sort(()=>Math.random()-0.5)
      for(const [dr,dc] of dirs){
        const r2=r+dr*2, c2=c+dc*2
        if(r2>0 && r2<rCount-1 && c2>0 && c2<cCount-1 && g[r2][c2].wall){
          g[r+dr][c+dc].wall=false
          carve(r2,c2)
        }
      }
    }
    carve(1,1)
    setGrid(g)
  }

  // Recording and sharing
  function serializeState(g, rCount, cCount, s, g2, a) {
    // compress walls and weights to coordinate lists
    const walls = []
    const weights = []
    for (let r = 0; r < rCount; r++) {
      for (let c = 0; c < cCount; c++) {
        const cell = g[r][c]
        if (cell.wall) walls.push([r, c])
        if (cell.weight > 1) weights.push([r, c, cell.weight])
      }
    }
    return { rows: rCount, cols: cCount, start: s, goal: g2, algo: a, walls, weights }
  }

  function restoreState(state) {
    setRows(state.rows)
    setCols(state.cols)
    const g = makeGrid(state.rows, state.cols)
    for (const [r, c] of state.walls || []) g[r][c].wall = true
    for (const [r, c, w] of state.weights || []) g[r][c].weight = w || 5
    setGrid(g)
    setStart(state.start)
    setGoal(state.goal)
    setAlgo(state.algo || 'astar')
    setVisited(new Set())
    setPath(new Set())
  }

  function exportRun() {
    const run = lastRunRef.current || { meta: serializeState(grid, rows, cols, start, goal, algo), visitOrder: [], path: [] }
    const blob = new Blob([JSON.stringify(run)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pathfinding-run.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function importRun(file) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (data && data.meta) {
          restoreState(data.meta)
          replayFromData(data)
        } else if (data && data.rows) {
          // state only
          restoreState(data)
        }
      } catch (e) { /* ignore */ }
    }
    reader.readAsText(file)
  }

  function replayFromData(data) {
    const vOrder = data.visitOrder || []
    const p = data.path || []
    setVisited(new Set())
    setPath(new Set())
    setRunning(true)
    let i = 0
    const visitSet = new Set()
    const pathSet = new Set()
    const t = setInterval(() => {
      if (i < vOrder.length) {
        visitSet.add(vOrder[i])
        setVisited(new Set(visitSet))
        i++
      } else if (i < vOrder.length + p.length) {
        const idx = i - vOrder.length
        pathSet.add(p[idx])
        setPath(new Set(pathSet))
        i++
      } else {
        clearInterval(t)
        setRunning(false)
      }
    }, 12)
  }

  function copyShareLink() {
    const meta = serializeState(grid, rows, cols, start, goal, algo)
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(meta))))
    const url = new URL(window.location.href)
    url.pathname = '/pathfinding-lab'
    url.searchParams.set('state', encoded)
    navigator.clipboard.writeText(url.toString())
  }

  // On load: decode state param
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const s = params.get('state')
    if (s) {
      try {
        const json = JSON.parse(decodeURIComponent(escape(atob(s))))
        if (json && json.rows) restoreState(json)
      } catch (e) { /* ignore */ }
    }
  }, [])

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto select-none" onMouseLeave={onMouseUp}>
      <h1 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Pathfinding Lab</h1>
      <div className="flex flex-wrap items-end gap-3 mb-4 p-4 border rounded-xl bg-white/80 shadow-sm">
        <div>
          <label className="text-sm">Algorithm</label>
          <select value={algo} onChange={(e)=>setAlgo(e.target.value)} className="block border rounded px-2 py-1">
            <option value="astar">A*</option>
            <option value="dijkstra">Dijkstra</option>
          </select>
        </div>
        <div>
          <label className="text-sm">Heuristic</label>
          <select value={heuristic} onChange={(e)=>setHeuristic(e.target.value)} className="block border rounded px-2 py-1">
            <option value="manhattan">Manhattan</option>
            <option value="euclidean">Euclidean</option>
            <option value="diagonal">Chebyshev</option>
          </select>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <label className="text-sm">Diagonals</label>
          <input type="checkbox" checked={diagonals} onChange={(e)=>setDiagonals(e.target.checked)} />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <label className="text-sm">Tiebreaker</label>
          <input type="checkbox" checked={tiebreaker} onChange={(e)=>setTiebreaker(e.target.checked)} />
        </div>
        <div>
          <label className="text-sm">Mode</label>
          <select value={mode} onChange={(e)=>setMode(e.target.value)} className="block border rounded px-2 py-1">
            <option value="wall">Toggle Walls</option>
            <option value="weight">Toggle Weights (5)</option>
            <option value="start">Move Start</option>
            <option value="goal">Move Goal</option>
          </select>
        </div>
        <div>
          <label className="text-sm">Rows</label>
          <input type="number" min={5} max={60} value={rows} onChange={(e)=>setRows(parseInt(e.target.value||'5',10))} className="block border rounded px-2 py-1 w-24" />
        </div>
        <div>
          <label className="text-sm">Cols</label>
          <input type="number" min={5} max={80} value={cols} onChange={(e)=>setCols(parseInt(e.target.value||'5',10))} className="block border rounded px-2 py-1 w-24" />
        </div>
        <div>
          <label className="text-sm">Speed: {speedMs}ms</label>
          <input type="range" min={4} max={60} step={2} value={speedMs} onChange={(e)=>setSpeedMs(parseInt(e.target.value,10))} />
        </div>
        <button onClick={resize} className="px-3 py-2 rounded bg-neutral-200">Resize</button>
        <button disabled={running && !paused} onClick={run} className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-60">{running && !paused ? 'Running…' : 'Run'}</button>
        <button disabled={!running} onClick={pauseResume} className="px-3 py-2 rounded bg-neutral-200">{paused ? 'Resume' : 'Pause'}</button>
        <button onClick={resetGrid} className="px-3 py-2 rounded bg-neutral-200">Reset Grid</button>
        <button onClick={generateMaze} className="px-3 py-2 rounded bg-neutral-200">Generate Maze</button>
        <button onClick={exportRun} className="px-3 py-2 rounded bg-neutral-200">Export</button>
        <label className="px-3 py-2 rounded bg-neutral-200 cursor-pointer">
          Import
          <input type="file" accept="application/json" onChange={(e)=>{ if(e.target.files?.[0]) importRun(e.target.files[0]) }} className="hidden" />
        </label>
        <button onClick={copyShareLink} className="px-3 py-2 rounded bg-neutral-200">Copy Share Link</button>
        <SnapshotButton targetSelector=".grid-capture" filename="pathfinding.png" />
      </div>

      <div style={{ lineHeight: 0 }} onMouseUp={onMouseUp} className="grid-capture p-2 border rounded-xl bg-white shadow-sm inline-block">
        {grid.map((row, r) => (
          <div key={`${gridKey}-r-${r}`} className="flex">
            {row.map((cell, c) => {
              const k = keyOf(r, c)
              const isStart = r === start.r && c === start.c
              const isGoal = r === goal.r && c === goal.c
              const isVisited = visited.has(k)
              const isPath = path.has(k)
              const bg = cell.wall ? 'bg-neutral-800' : isPath ? 'bg-emerald-500' : isStart ? 'bg-blue-500' : isGoal ? 'bg-red-500' : isVisited ? 'bg-yellow-300' : cell.weight > 1 ? 'bg-neutral-300' : 'bg-white'
              return (
                <div
                  key={`${gridKey}-c-${c}`}
                  onMouseDown={()=>onCellMouseDown(r,c)}
                  onMouseEnter={()=>onCellEnter(r,c)}
                  className={`border border-neutral-200 ${bg}`}
                  style={{ width: 22, height: 22 }}
                  title={`${r},${c}${cell.weight>1?' (w=5)':''}`}
                />
              )
            })}
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-neutral-600">
        Tip: Use Mode → Toggle Walls to draw obstacles. Toggle Weights creates cost-5 tiles. Move Start/Goal to relocate endpoints.
      </div>
    </div>
  )
}


