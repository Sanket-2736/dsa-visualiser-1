import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Info, Zap, Settings } from "lucide-react";

const DEFAULT_SPEED = 2000;
const MIN_SPEED = 500;
const MAX_SPEED = 3000;
const NODE_COUNT = 6;

const nodePositions = {
    0: { x: 225, y: 80 },
    1: { x: 380, y: 160 },
    2: { x: 380, y: 310 },
    3: { x: 225, y: 390 },
    4: { x: 70, y: 310 },
    5: { x: 70, y: 160 }
};

const generateRandomGraph = (n) => {
    const adjacencyMatrix = Array.from({ length: n }, () => Array(n).fill(Infinity));
    const edgeList = [];
    
    for (let i = 0; i < n; i++) {
      adjacencyMatrix[i][i] = 0;
    }
    
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.random() > 0.25) {
          const weight = Math.floor(Math.random() * 15) + 1;
          adjacencyMatrix[i][j] = weight;
          adjacencyMatrix[j][i] = weight;
          edgeList.push({
            id: `${Math.min(i, j)}-${Math.max(i, j)}`,
            node1: Math.min(i, j),
            node2: Math.max(i, j),
            weight,
            status: 'unvisited'
          });
        }
      }
    }

    for (let i = 0; i < n; i++) {
      let hasEdge = false;
      for (let j = 0; j < n; j++) {
        if (i !== j && adjacencyMatrix[i][j] !== Infinity) {
          hasEdge = true;
          break;
        }
      }
      if (!hasEdge) {
        const target = (i + 1) % n;
        if (target !== i) {
          const weight = Math.floor(Math.random() * 10) + 1;
          adjacencyMatrix[i][target] = weight;
          adjacencyMatrix[target][i] = weight;
          edgeList.push({
            id: `${Math.min(i, target)}-${Math.max(i, target)}`,
            node1: Math.min(i, target),
            node2: Math.max(i, target),
            weight,
            status: 'unvisited'
          });
        }
      }
    }

    const uniqueEdges = Array.from(new Set(edgeList.map(e => e.id)))
        .map(id => edgeList.find(e => e.id === id));


    return { matrix: adjacencyMatrix, edges: uniqueEdges };
};

const primSteps = (graph, edges, n, startNode = 0) => {
    const visited = new Set();
    const mstEdges = [];
    const allSteps = [];
    
    let candidateEdges = [];
    
    visited.add(startNode);
    
    allSteps.push({
        type: 'start',
        description: `Starting Prim's algorithm from node ${startNode}.`,
        visited: new Set([startNode]),
        mst: [],
        candidateEdges: [],
        currentEdge: null,
        totalCost: 0
    });

    for (let i = 0; i < n; i++) {
        if (i !== startNode && graph[startNode][i] !== Infinity) {
            candidateEdges.push({
                node1: startNode,
                node2: i,
                weight: graph[startNode][i],
                id: `${Math.min(startNode, i)}-${Math.max(startNode, i)}`
            });
        }
    }
    
    candidateEdges.sort((a, b) => a.weight - b.weight);

    allSteps.push({
        type: 'candidates_initial',
        description: `Initialized candidate edges from the start node. The MST begins growing.`,
        visited: new Set([startNode]),
        mst: [...mstEdges],
        candidateEdges: [...candidateEdges],
        currentEdge: null,
        totalCost: 0
    });

    while (mstEdges.length < n - 1 && candidateEdges.length > 0) {
        let minEdgeIndex = -1;
        let minEdge = null;
        
        for (let i = 0; i < candidateEdges.length; i++) {
            const edge = candidateEdges[i];
            const node1Visited = visited.has(edge.node1);
            const node2Visited = visited.has(edge.node2);
            
            if (node1Visited !== node2Visited) {
                minEdgeIndex = i;
                minEdge = edge;
                break;
            }
        }
        
        if (minEdge) {
            allSteps.push({
                type: 'considering',
                description: `MINIMUM WEIGHT: Considering edge ${minEdge.node1}-${minEdge.node2} (W: ${minEdge.weight}).`,
                visited: new Set(visited),
                mst: [...mstEdges],
                candidateEdges: [...candidateEdges],
                currentEdge: minEdge,
                totalCost: mstEdges.reduce((sum, e) => sum + e.weight, 0)
            });

            mstEdges.push(minEdge);
            const newNode = visited.has(minEdge.node1) ? minEdge.node2 : minEdge.node1;
            visited.add(newNode);
            
            candidateEdges.splice(minEdgeIndex, 1);
            
            allSteps.push({
                type: 'accept',
                description: `ACCEPTED! Edge ${minEdge.node1}-${minEdge.node2} added. Node ${newNode} is now visited.`,
                visited: new Set(visited),
                mst: [...mstEdges],
                candidateEdges: [...candidateEdges],
                currentEdge: minEdge,
                totalCost: mstEdges.reduce((sum, e) => sum + e.weight, 0)
            });

            for (let i = 0; i < n; i++) {
                if (!visited.has(i) && graph[newNode][i] !== Infinity) {
                    const newEdgeId = `${Math.min(newNode, i)}-${Math.max(newNode, i)}`;
                    
                    const existingCandidateIndex = candidateEdges.findIndex(e => e.node2 === i || e.node1 === i);

                    if (existingCandidateIndex === -1 || candidateEdges[existingCandidateIndex].weight > graph[newNode][i]) {
                        
                        if (existingCandidateIndex !== -1) {
                            candidateEdges.splice(existingCandidateIndex, 1);
                        }

                        candidateEdges.push({
                            node1: newNode,
                            node2: i,
                            weight: graph[newNode][i],
                            id: newEdgeId
                        });
                    }
                }
            }
            
            candidateEdges = candidateEdges.filter(edge => {
                return visited.has(edge.node1) !== visited.has(edge.node2); 
            });
            
            candidateEdges.sort((a, b) => a.weight - b.weight);

            if (mstEdges.length < n - 1) {
                allSteps.push({
                    type: 'update',
                    description: `Candidate list updated. Next minimum: ${candidateEdges[0]?.weight || 'None'}`,
                    visited: new Set(visited),
                    mst: [...mstEdges],
                    candidateEdges: [...candidateEdges],
                    currentEdge: null,
                    totalCost: mstEdges.reduce((sum, e) => sum + e.weight, 0)
                });
            }
        } else {
            break;
        }
    }

    allSteps.push({
        type: 'complete',
        description: `MST complete! Total minimum cost: ${mstEdges.reduce((sum, e) => sum + e.weight, 0)}.`,
        visited: new Set(visited),
        mst: [...mstEdges],
        candidateEdges: [],
        currentEdge: null,
        totalCost: mstEdges.reduce((sum, e) => sum + e.weight, 0)
    });

    return allSteps;
};

const PrimVisualizerPage = () => {
    const [graph, setGraph] = useState([]);
    const [edges, setEdges] = useState([]);
    const [mst, setMst] = useState([]);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [visited, setVisited] = useState(new Set());
    const [currentEdge, setCurrentEdge] = useState(null);
    const [candidateEdges, setCandidateEdges] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [speed, setSpeed] = useState(DEFAULT_SPEED);

    const reset = useCallback(() => {
        const { matrix, edges: newEdges } = generateRandomGraph(NODE_COUNT);
        const generatedSteps = primSteps(matrix, newEdges, NODE_COUNT);
        
        setGraph(matrix);
        setEdges(newEdges);
        setSteps(generatedSteps);
        
        const initialState = generatedSteps[0];
        setVisited(initialState.visited);
        setMst(initialState.mst);
        setCandidateEdges(initialState.candidateEdges);
        setCurrentEdge(initialState.currentEdge);
        setTotalCost(initialState.totalCost);

        setCurrentStep(0);
        setPlaying(false);
    }, []);

    const executeStep = useCallback((stepIndex) => {
        if (stepIndex >= steps.length || stepIndex < 0) return;

        const step = steps[stepIndex];
        setVisited(step.visited);
        setMst(step.mst);
        setCandidateEdges(step.candidateEdges);
        setCurrentEdge(step.currentEdge);
        setTotalCost(step.totalCost);
    }, [steps]);

    const stepForward = useCallback(() => {
        setCurrentStep(prev => {
            const newStep = prev + 1;
            if (newStep < steps.length) {
                executeStep(newStep);
                return newStep;
            }
            setPlaying(false);
            return prev;
        });
    }, [steps.length, executeStep]);

    const stepBackward = useCallback(() => {
        setCurrentStep(prev => {
            const newStep = Math.max(0, prev - 1);
            executeStep(newStep);
            return newStep;
        });
    }, [executeStep]);

    useEffect(() => {
        reset();
    }, [reset]);

    useEffect(() => {
        if (!playing || currentStep >= steps.length - 1) {
            setPlaying(false);
            return;
        }
        const timer = setTimeout(() => {
            stepForward();
        }, speed);
        return () => clearTimeout(timer);
    }, [playing, currentStep, steps.length, speed, stepForward]);

    const getEdgeStatus = (edge) => {
        if (currentEdge && edge.id === currentEdge.id) return 'current';
        if (mst.some(e => e.id === edge.id)) return 'mst';
        if (candidateEdges.some(e => e.id === edge.id)) return 'candidate';
        
        const isInternal = visited.has(edge.node1) && visited.has(edge.node2);
        if (isInternal && !mst.some(e => e.id === edge.id)) return 'internal';
        
        return 'unvisited';
    };

    const getNodeStatus = (nodeId) => {
        if (visited.has(nodeId)) return 'visited';
        return 'unvisited';
    };
    
    const CandidateEdgeList = useMemo(() => {
        return candidateEdges.map((edge, index) => (
            <motion.div
                key={edge.id}
                className={`text-sm px-3 py-2 rounded flex justify-between font-mono transition-all duration-300 ${
                    index === 0 ? 'bg-yellow-500/20 border border-yellow-500/50 font-bold' : 'bg-blue-500/20'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
            >
                <span>{edge.node1} → {edge.node2}</span>
                <span>W: {edge.weight}</span>
                {index === 0 && <Zap size={14} className="text-yellow-400" title="Next Minimum" />}
            </motion.div>
        ));
    }, [candidateEdges]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white px-6 py-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                        Prim's Algorithm 🌳
                    </h1>
                    <p className="text-xl text-green-300 max-w-3xl mx-auto">
                        A <span className="font-bold">greedy</span> approach: always expand the tree from its current boundary using the <span className="font-bold">cheapest</span> connecting edge.
                    </p>
                </motion.div>

                {/* --- Controls & Speed --- */}
                <motion.div
                    className="flex flex-wrap justify-center items-center gap-6 mb-8 p-4 bg-gray-800/50 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex gap-4">
                        <button
                            onClick={stepBackward}
                            disabled={currentStep === 0 || playing}
                            className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-lg flex items-center gap-2 transition-all"
                        >
                            <SkipBack size={18} /> Prev
                        </button>
                        <button
                            onClick={() => setPlaying(!playing)}
                            disabled={currentStep >= steps.length - 1 && !playing}
                            className="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg"
                        >
                            {playing ? <Pause size={20} /> : <Play size={20} />}
                            {playing ? "Pause" : (currentStep >= steps.length - 1 ? "Complete" : "Play")}
                        </button>
                        <button
                            onClick={stepForward}
                            disabled={currentStep >= steps.length - 1 || playing}
                            className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-lg flex items-center gap-2 transition-all"
                        >
                            Next <SkipForward size={18} />
                        </button>
                    </div>
                    
                    <button
                        onClick={reset}
                        className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg flex items-center gap-2 transition-all"
                    >
                        <RotateCcw size={18} /> New Graph
                    </button>

                    {/* Speed Control */}
                    <div className="flex flex-col items-center w-36">
                        <label htmlFor="speed" className="text-sm text-gray-300 mb-1 flex items-center gap-1">
                            <Settings size={14}/> Speed ({speed}ms)
                        </label>
                        <input
                            type="range"
                            id="speed"
                            min={MIN_SPEED}
                            max={MAX_SPEED}
                            step="100"
                            value={speed}
                            onChange={(e) => setSpeed(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg"
                        />
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-4 gap-8">
                    
                    {/* Column 1: Candidate Edge List (The Priority Queue) */}
                    <div className="lg:col-span-1">
                        <motion.div
                            className="bg-gradient-to-br from-blue-800/60 to-blue-900/60 p-6 rounded-2xl backdrop-blur-md border border-blue-600/30 h-full"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h3 className="text-2xl font-bold mb-4 text-blue-300 text-center">Priority Queue</h3>
                            <p className="text-sm text-gray-400 mb-4">
                                Edges connecting the MST to unvisited nodes, sorted by weight.
                            </p>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                <AnimatePresence>{CandidateEdgeList}</AnimatePresence>
                                {candidateEdges.length === 0 && <p className="text-gray-500 text-sm">Queue empty.</p>}
                            </div>
                        </motion.div>
                    </div>
                    
                    {/* Column 2 & 3: Graph Visualization */}
                    <div className="lg:col-span-2">
                        <motion.div
                            className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-8 rounded-2xl backdrop-blur-md border border-slate-600/30"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h3 className="text-2xl font-bold mb-6 text-center text-green-300">Graph Visualization</h3>
                            
                            <div className="relative w-full h-96 mx-auto">
                                <svg viewBox="0 0 450 470" className="w-full h-full">
                                    {/* Edges */}
                                    {edges.map((edge) => {
                                        const pos1 = nodePositions[edge.node1];
                                        const pos2 = nodePositions[edge.node2];
                                        const status = getEdgeStatus(edge);
                                        
                                        let strokeColor = '#64748b';
                                        let strokeWidth = 2;
                                        
                                        if (status === 'current') {
                                            strokeColor = '#fbbf24';
                                            strokeWidth = 5;
                                        } else if (status === 'mst') {
                                            strokeColor = '#10b981';
                                            strokeWidth = 4;
                                        } else if (status === 'candidate') {
                                            strokeColor = '#3b82f6';
                                            strokeWidth = 3;
                                        } else if (status === 'internal') {
                                            strokeColor = '#64748b';
                                            strokeWidth = 1;
                                        }
                                        
                                        const midX = (pos1.x + pos2.x) / 2;
                                        const midY = (pos1.y + pos2.y) / 2;
                                        
                                        return (
                                            <g key={edge.id}>
                                                <motion.line
                                                    x1={pos1.x} y1={pos1.y}
                                                    x2={pos2.x} y2={pos2.y}
                                                    stroke={strokeColor}
                                                    strokeWidth={strokeWidth}
                                                    opacity={status === 'internal' ? 0.4 : 1}
                                                    animate={{ stroke: strokeColor, strokeWidth: strokeWidth }}
                                                    transition={{ duration: 0.5 }}
                                                    className={status === 'candidate' ? 'stroke-dasharray-[8,4]' : ''}
                                                />
                                                {/* Weight label */}
                                                <motion.circle
                                                    cx={midX} cy={midY} r="18"
                                                    fill={status === 'current' ? '#fbbf24' : status === 'mst' ? '#10b981' : status === 'candidate' ? '#3b82f6' : '#1e293b'}
                                                    stroke={strokeColor} strokeWidth="2"
                                                />
                                                <text
                                                    x={midX} y={midY + 4}
                                                    textAnchor="middle"
                                                    className="text-sm font-bold fill-white"
                                                >
                                                    {edge.weight}
                                                </text>
                                            </g>
                                        );
                                    })}
                                    
                                    {/* Nodes */}
                                    {Array.from({ length: NODE_COUNT }, (_, i) => i).map((node) => {
                                        const pos = nodePositions[node];
                                        const status = getNodeStatus(node);
                                        const isStartNode = node === 0 && visited.size >= 1;
                                        const isNewNode = currentStep > 0 && steps[currentStep].type === 'accept' && 
                                                            (steps[currentStep].currentEdge.node1 === node || steps[currentStep].currentEdge.node2 === node) && 
                                                            !steps[currentStep - 1].visited.has(node);
                                        
                                        return (
                                            <motion.g key={node}>
                                                <motion.circle
                                                    cx={pos.x} cy={pos.y} r="28"
                                                    fill={status === 'visited' ? (isStartNode ? '#f59e0b' : '#10b981') : '#64748b'}
                                                    stroke={isNewNode ? '#fbbf24' : 'white'}
                                                    strokeWidth={isNewNode ? 4 : 3}
                                                    animate={{ 
                                                        fill: status === 'visited' ? (isStartNode ? '#f59e0b' : '#10b981') : '#64748b',
                                                        scale: isNewNode ? 1.2 : 1
                                                    }}
                                                    transition={{ type: "spring", stiffness: 200 }}
                                                />
                                                <text
                                                    x={pos.x} y={pos.y + 5}
                                                    textAnchor="middle"
                                                    className="text-lg font-bold fill-white"
                                                >
                                                    {node}
                                                </text>
                                            </motion.g>
                                        );
                                    })}
                                </svg>
                            </div>
                        </motion.div>
                    </div>

                    {/* Column 4: Statistics & Legend */}
                    <div className="space-y-6 lg:col-span-1">
                        
                        {/* Current Step Info */}
                        <motion.div
                            className="bg-gradient-to-br from-green-800/60 to-green-900/60 p-6 rounded-xl backdrop-blur-md border border-green-600/30"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <h4 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                                <Info size={20} /> Status
                            </h4>
                            <div className="space-y-3">
                                <div className="text-sm text-gray-300">
                                    Step {currentStep + 1} of {steps.length}
                                </div>
                                <div className="bg-slate-700/50 p-3 rounded-lg min-h-[50px] flex items-center">
                                    <p className="text-white font-medium text-lg">
                                        {steps[currentStep]?.description || 'Ready to start...'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Statistics */}
                        <motion.div
                            className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-xl backdrop-blur-md border border-slate-600/30"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 }}
                        >
                            <h4 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
                                <Zap size={18} /> MST Metrics
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">MST Edges:</span>
                                    <span className="text-green-400 font-bold">{mst.length} / {NODE_COUNT - 1}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Visited Nodes:</span>
                                    <span className="text-yellow-400 font-bold">{visited.size} / {NODE_COUNT}</span>
                                </div>
                                <div className="pt-3 border-t border-slate-600">
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Total MST Cost:</span>
                                        <span className="text-yellow-400 font-bold text-2xl">{totalCost}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Legend */}
                        <motion.div
                            className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-xl backdrop-blur-md border border-slate-600/30"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1 }}
                        >
                            <h4 className="text-lg font-semibold text-gray-300 mb-4">Legend</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3"><div className="w-6 h-6 bg-amber-500 rounded-full border-2 border-white"></div><span className="text-gray-300">Start Node / Newly Visited</span></div>
                                <div className="flex items-center gap-3"><div className="w-4 h-1 bg-green-500 rounded"></div><span className="text-gray-300">MST Edge (Accepted)</span></div>
                                <div className="flex items-center gap-3"><div className="w-4 h-1 bg-blue-500 rounded border-dashed border"></div><span className="text-gray-300">Candidate Edge (Queue)</span></div>
                                <div className="flex items-center gap-3"><div className="w-4 h-1 bg-yellow-400 rounded"></div><span className="text-gray-300">Current Selection</span></div>
                                <div className="pt-2 border-t border-slate-600">
                                    <p className="text-xs text-gray-400">Prim's grows the MST from a single visited component.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrimVisualizerPage;