import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Upload, 
  Share2,
  Zap,
  Settings,
  Grid3x3,
  Target,
  Flag,
  Compass,
  Info,
  Camera
} from 'lucide-react';

const DEFAULT_ROWS = 20;
const DEFAULT_COLS = 36;

function makeGrid(rows, cols) {
  return Array.from({ length: rows }, (_, r) => (
    Array.from({ length: cols }, (_, c) => ({ r, c, wall: false, weight: 1 }))
  ));
}

function hManhattan(a, b) {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
}

function neighbors4(r, c, rows, cols) {
  const out = [];
  if (r > 0) out.push([r - 1, c]);
  if (r + 1 < rows) out.push([r + 1, c]);
  if (c > 0) out.push([r, c - 1]);
  if (c + 1 < cols) out.push([r, c + 1]);
  return out;
}

function neighbors8(r, c, rows, cols) {
  const out = neighbors4(r, c, rows, cols);
  if (r > 0 && c > 0) out.push([r - 1, c - 1]);
  if (r > 0 && c + 1 < cols) out.push([r - 1, c + 1]);
  if (r + 1 < rows && c > 0) out.push([r + 1, c - 1]);
  if (r + 1 < rows && c + 1 < cols) out.push([r + 1, c + 1]);
  return out;
}

function reconstructPath(prev, goalKey) {
  const path = [];
  let cur = goalKey;
  while (cur && prev.has(cur)) {
    path.push(cur);
    cur = prev.get(cur);
  }
  if (cur) path.push(cur);
  return path.reverse();
}

function keyOf(r, c) { return `${r},${c}`; }

function runDijkstra(grid, start, goal, opts) {
  const rows = grid.length, cols = grid[0].length;
  const dist = new Map();
  const prev = new Map();
  const visited = new Set();
  const open = new Set();
  const visitOrder = [];
  const sKey = keyOf(start.r, start.c);
  const gKey = keyOf(goal.r, goal.c);
  dist.set(sKey, 0);
  open.add(sKey);

  function extractMin() {
    let best = null, bestD = Infinity;
    for (const k of open) {
      const d = dist.get(k) ?? Infinity;
      if (d < bestD) { bestD = d; best = k; }
    }
    if (best) open.delete(best);
    return best;
  }

  while (open.size) {
    const curKey = extractMin();
    if (!curKey) break;
    if (visited.has(curKey)) continue;
    visited.add(curKey);
    const [r, c] = curKey.split(',').map(Number);
    visitOrder.push(curKey);
    if (curKey === gKey) break;
    const neigh = opts?.diagonals ? neighbors8 : neighbors4;
    for (const [nr, nc] of neigh(r, c, rows, cols)) {
      const cell = grid[nr][nc];
      if (cell.wall) continue;
      const nKey = keyOf(nr, nc);
      const stepCost = (nr !== r && nc !== c) ? Math.SQRT2 : 1;
      const alt = (dist.get(curKey) ?? Infinity) + Math.max(1, cell.weight) * stepCost;
      if (alt < (dist.get(nKey) ?? Infinity)) {
        dist.set(nKey, alt);
        prev.set(nKey, curKey);
        open.add(nKey);
      }
    }
  }

  const path = reconstructPath(prev, gKey);
  return { visitOrder, path };
}

function runAStar(grid, start, goal, heuristic = hManhattan, opts) {
  const rows = grid.length, cols = grid[0].length;
  const sKey = keyOf(start.r, start.c);
  const gKey = keyOf(goal.r, goal.c);
  const gScore = new Map([[sKey, 0]]);
  const fScore = new Map([[sKey, heuristic(start, goal)]]);
  const prev = new Map();
  const open = new Set([sKey]);
  const closed = new Set();
  const visitOrder = [];

  function extractMinF() {
    let best = null, bestF = Infinity;
    for (const k of open) {
      const f = fScore.get(k) ?? Infinity;
      if (f < bestF) { bestF = f; best = k; }
    }
    if (best) open.delete(best);
    return best;
  }

  while (open.size) {
    const curKey = extractMinF();
    if (!curKey) break;
    if (closed.has(curKey)) continue;
    closed.add(curKey);
    const [r, c] = curKey.split(',').map(Number);
    visitOrder.push(curKey);
    if (curKey === gKey) break;
    const neigh = opts?.diagonals ? neighbors8 : neighbors4;
    for (const [nr, nc] of neigh(r, c, rows, cols)) {
      const cell = grid[nr][nc];
      if (cell.wall) continue;
      const nKey = keyOf(nr, nc);
      const stepCost = (nr !== r && nc !== c) ? Math.SQRT2 : 1;
      const tentative = (gScore.get(curKey) ?? Infinity) + Math.max(1, cell.weight) * stepCost;
      if (tentative < (gScore.get(nKey) ?? Infinity)) {
        prev.set(nKey, curKey);
        gScore.set(nKey, tentative);
        const h = heuristic({ r: nr, c: nc }, goal);
        const f = tentative + h + (opts?.tiebreaker ? 1e-4 * (nr + nc) : 0);
        fScore.set(nKey, f);
        open.add(nKey);
      }
    }
  }
  const path = reconstructPath(prev, gKey);
  return { visitOrder, path };
}

const PathfindingLab = () => {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [grid, setGrid] = useState(() => makeGrid(DEFAULT_ROWS, DEFAULT_COLS));
  const [mode, setMode] = useState('wall');
  const [start, setStart] = useState({ r: 10, c: 4 });
  const [goal, setGoal] = useState({ r: 10, c: 30 });
  const [algo, setAlgo] = useState('astar');
  const [heuristic, setHeuristic] = useState('manhattan');
  const [diagonals, setDiagonals] = useState(false);
  const [tiebreaker, setTiebreaker] = useState(true);
  const [speedMs, setSpeedMs] = useState(12);
  const [paused, setPaused] = useState(false);
  const [running, setRunning] = useState(false);
  const [visited, setVisited] = useState(new Set());
  const [path, setPath] = useState(new Set());
  const [showControls, setShowControls] = useState(true);
  const dragging = useRef(false);
  const lastRunRef = useRef(null);
  const runnerRef = useRef({ timer: null });

  const gridKey = useMemo(() => `${rows}x${cols}`, [rows, cols]);

  function resetGrid() {
    setGrid(makeGrid(rows, cols));
    setVisited(new Set());
    setPath(new Set());
  }

  function resize() {
    setGrid(makeGrid(rows, cols));
    setVisited(new Set());
    setPath(new Set());
  }

  const applyCell = useCallback((r, c) => {
    setGrid(prev => {
      const nxt = prev.map(row => row.slice());
      const cell = { ...nxt[r][c] };
      if (mode === 'wall') cell.wall = !cell.wall;
      if (mode === 'weight') cell.weight = cell.weight === 1 ? 5 : 1;
      nxt[r][c] = cell;
      return nxt;
    });
  }, [mode]);

  function onCellMouseDown(r, c) {
    dragging.current = true;
    if (mode === 'start') setStart({ r, c });
    else if (mode === 'goal') setGoal({ r, c });
    else applyCell(r, c);
  }

  function onCellEnter(r, c) {
    if (!dragging.current) return;
    if (mode === 'start') setStart({ r, c });
    else if (mode === 'goal') setGoal({ r, c });
    else applyCell(r, c);
  }

  function onMouseUp() { dragging.current = false; }

  function selectHeuristic() {
    if (heuristic === 'euclidean') return (a, b) => Math.hypot(a.r - b.r, a.c - b.c);
    if (heuristic === 'diagonal') return (a, b) => Math.max(Math.abs(a.r - b.r), Math.abs(a.c - b.c));
    return hManhattan;
  }

  function run() {
    setRunning(true);
    setPaused(false);
    setVisited(new Set());
    setPath(new Set());
    const g = grid;
    const result = algo === 'astar' 
      ? runAStar(g, start, goal, selectHeuristic(), { diagonals, tiebreaker }) 
      : runDijkstra(g, start, goal, { diagonals });
    const vOrder = result.visitOrder;
    const p = result.path;
    
    let i = 0;
    const visitSet = new Set();
    const pathSet = new Set();
    if (runnerRef.current.timer) clearInterval(runnerRef.current.timer);
    
    const tick = () => {
      if (i < vOrder.length) {
        visitSet.add(vOrder[i]);
        setVisited(new Set(visitSet));
        i++;
      } else if (i < vOrder.length + p.length) {
        const idx = i - vOrder.length;
        pathSet.add(p[idx]);
        setPath(new Set(pathSet));
        i++;
      } else {
        clearInterval(runnerRef.current.timer);
        setRunning(false);
      }
    };
    runnerRef.current.timer = setInterval(tick, Math.max(4, speedMs));
  }

  function pauseResume() {
    if (!running) return;
    if (!paused) {
      setPaused(true);
      if (runnerRef.current.timer) clearInterval(runnerRef.current.timer);
    } else {
      setPaused(false);
      run();
    }
  }

  function generateMaze() {
    const rCount = rows, cCount = cols;
    const g = makeGrid(rCount, cCount);
    for (let r = 0; r < rCount; r++) 
      for (let c = 0; c < cCount; c++) 
        g[r][c].wall = true;
    
    function carve(r, c) {
      g[r][c].wall = false;
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]].sort(() => Math.random() - 0.5);
      for (const [dr, dc] of dirs) {
        const r2 = r + dr * 2, c2 = c + dc * 2;
        if (r2 > 0 && r2 < rCount - 1 && c2 > 0 && c2 < cCount - 1 && g[r2][c2].wall) {
          g[r + dr][c + dc].wall = false;
          carve(r2, c2);
        }
      }
    }
    carve(1, 1);
    setGrid(g);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white select-none" onMouseLeave={onMouseUp}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            🗺️ Pathfinding Lab
          </h1>
          <p className="text-lg text-indigo-300">
            Visualize A* and Dijkstra pathfinding algorithms in action
          </p>
        </motion.div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <Grid3x3 size={16} className="text-cyan-400" />
              <span className="text-xs text-indigo-300">Grid Size</span>
            </div>
            <div className="text-2xl font-bold text-cyan-400">{rows} × {cols}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <Compass size={16} className="text-yellow-400" />
              <span className="text-xs text-indigo-300">Visited</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{visited.size}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <Target size={16} className="text-emerald-400" />
              <span className="text-xs text-indigo-300">Path Length</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">{path.size}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} className="text-purple-400" />
              <span className="text-xs text-indigo-300">Algorithm</span>
            </div>
            <div className="text-lg font-bold text-purple-400">{algo === 'astar' ? 'A*' : 'Dijkstra'}</div>
          </motion.div>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-4 bg-indigo-900/30 border-b border-indigo-700 flex items-center justify-between">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Settings size={20} />
              Configuration
            </h3>
            <motion.button
              onClick={() => setShowControls(!showControls)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-indigo-300 hover:text-white"
            >
              {showControls ? '▼' : '▶'}
            </motion.button>
          </div>

          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {/* Algorithm */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-300 mb-2">Algorithm</label>
                    <select 
                      value={algo} 
                      onChange={(e) => setAlgo(e.target.value)}
                      className="w-full bg-gray-900 border border-indigo-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="astar">A* Search</option>
                      <option value="dijkstra">Dijkstra's Algorithm</option>
                    </select>
                  </div>

                  {/* Heuristic */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-300 mb-2">Heuristic</label>
                    <select 
                      value={heuristic} 
                      onChange={(e) => setHeuristic(e.target.value)}
                      className="w-full bg-gray-900 border border-indigo-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="manhattan">Manhattan</option>
                      <option value="euclidean">Euclidean</option>
                      <option value="diagonal">Chebyshev (Diagonal)</option>
                    </select>
                  </div>

                  {/* Mode */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-300 mb-2">Drawing Mode</label>
                    <select 
                      value={mode} 
                      onChange={(e) => setMode(e.target.value)}
                      className="w-full bg-gray-900 border border-indigo-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="wall">Toggle Walls</option>
                      <option value="weight">Toggle Weights (5×)</option>
                      <option value="start">Move Start</option>
                      <option value="goal">Move Goal</option>
                    </select>
                  </div>

                  {/* Speed */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-300 mb-2">
                      Speed: {speedMs}ms
                    </label>
                    <input 
                      type="range" 
                      min={4} 
                      max={60} 
                      step={2} 
                      value={speedMs} 
                      onChange={(e) => setSpeedMs(parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  {/* Rows */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-300 mb-2">Rows: {rows}</label>
                    <input 
                      type="range" 
                      min={5} 
                      max={40} 
                      value={rows} 
                      onChange={(e) => setRows(parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>

                  {/* Cols */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-300 mb-2">Cols: {cols}</label>
                    <input 
                      type="range" 
                      min={5} 
                      max={60} 
                      value={cols} 
                      onChange={(e) => setCols(parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 text-sm text-indigo-300 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={diagonals} 
                        onChange={(e) => setDiagonals(e.target.checked)}
                        className="w-4 h-4 accent-indigo-500"
                      />
                      Allow Diagonals
                    </label>
                    <label className="flex items-center gap-2 text-sm text-indigo-300 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={tiebreaker} 
                        onChange={(e) => setTiebreaker(e.target.checked)}
                        className="w-4 h-4 accent-indigo-500"
                      />
                      Tiebreaker
                    </label>
                  </div>

                  {/* Apply Resize */}
                  <div className="flex items-end">
                    <motion.button
                      onClick={resize}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Apply Resize
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action Buttons */}
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          <motion.button
            onClick={run}
            disabled={running && !paused}
            whileHover={!(running && !paused) ? { scale: 1.05 } : {}}
            whileTap={!(running && !paused) ? { scale: 0.95 } : {}}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Play size={20} />
            {running && !paused ? 'Running...' : 'Run Algorithm'}
          </motion.button>

          <motion.button
            onClick={pauseResume}
            disabled={!running}
            whileHover={running ? { scale: 1.05 } : {}}
            whileTap={running ? { scale: 0.95 } : {}}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {paused ? <Play size={20} /> : <Pause size={20} />}
            {paused ? 'Resume' : 'Pause'}
          </motion.button>

          <motion.button
            onClick={resetGrid}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
          >
            <RotateCcw size={20} />
            Reset Grid
          </motion.button>

          <motion.button
            onClick={generateMaze}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-all"
          >
            <Grid3x3 size={20} />
            Generate Maze
          </motion.button>
        </div>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6 inline-block"
        >
          <div 
            style={{ lineHeight: 0 }} 
            onMouseUp={onMouseUp}
            className="p-4 bg-gray-800/80 backdrop-blur-sm border-2 border-indigo-700 rounded-xl shadow-2xl inline-block"
          >
            {grid.map((row, r) => (
              <div key={`${gridKey}-r-${r}`} className="flex">
                {row.map((cell, c) => {
                  const k = keyOf(r, c);
                  const isStart = r === start.r && c === start.c;
                  const isGoal = r === goal.r && c === goal.c;
                  const isVisited = visited.has(k);
                  const isPath = path.has(k);
                  
                  let bgClass = 'bg-gray-900';
                  if (cell.wall) bgClass = 'bg-gray-700';
                  else if (isPath) bgClass = 'bg-gradient-to-r from-emerald-500 to-green-500';
                  else if (isStart) bgClass = 'bg-gradient-to-r from-blue-500 to-cyan-500';
                  else if (isGoal) bgClass = 'bg-gradient-to-r from-red-500 to-pink-500';
                  else if (isVisited) bgClass = 'bg-yellow-400';
                  else if (cell.weight > 1) bgClass = 'bg-orange-400';

                  return (
                    <motion.div
                      key={`${gridKey}-c-${c}`}
                      onMouseDown={() => onCellMouseDown(r, c)}
                      onMouseEnter={() => onCellEnter(r, c)}
                      whileHover={{ scale: 1.1, zIndex: 10 }}
                      className={`border border-gray-700 cursor-pointer transition-all ${bgClass}`}
                      style={{ width: 20, height: 20 }}
                      title={`${r},${c}${cell.weight > 1 ? ' (weight=5)' : ''}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6"
        >
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Info size={18} />
            Legend & Tips
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded border border-gray-700" />
              <span className="text-gray-300">Start Point</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded border border-gray-700" />
              <span className="text-gray-300">Goal Point</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-700 rounded border border-gray-700" />
              <span className="text-gray-300">Walls (obstacles)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-orange-400 rounded border border-gray-700" />
              <span className="text-gray-300">Weighted (5× cost)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-yellow-400 rounded border border-gray-700" />
              <span className="text-gray-300">Visited cells</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded border border-gray-700" />
              <span className="text-gray-300">Final path</span>
            </div>
          </div>
          <div className="mt-4 text-xs text-indigo-300 space-y-1">
            <p>• Click and drag to draw walls or weights based on selected mode</p>
            <p>• Use "Move Start/Goal" mode to relocate endpoints</p>
            <p>• Try "Generate Maze" for instant complex scenarios</p>
            <p>• Enable diagonals for 8-directional movement</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PathfindingLab;
