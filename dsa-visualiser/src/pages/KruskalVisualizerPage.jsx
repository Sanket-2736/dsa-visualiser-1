import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Info, Zap, Settings } from "lucide-react";

const DEFAULT_SPEED = 1500;
const MIN_SPEED = 200;
const MAX_SPEED = 2500;
const NODE_COUNT = 6;
const NODE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

const nodePositions = {
    0: { x: 200, y: 100 },
    1: { x: 350, y: 150 },
    2: { x: 400, y: 300 },
    3: { x: 250, y: 400 },
    4: { x: 100, y: 350 },
    5: { x: 50, y: 200 }
};

const findSet = (parent, i) => {
    if (parent[i] === i) return i;
    parent[i] = findSet(parent, parent[i]);
    return parent[i];
};

const union = (parent, rank, x, y) => {
    const xroot = findSet(parent, x);
    const yroot = findSet(parent, y);
    if (xroot !== yroot) {
        if (rank[xroot] < rank[yroot]) {
            parent[xroot] = yroot;
        } else if (rank[xroot] > rank[yroot]) {
            parent[yroot] = xroot;
        } else {
            parent[yroot] = xroot;
            rank[xroot]++;
        }
        return true;
    }
    return false;
};

const getComponents = (parent, n) => {
    const componentMap = {};
    const parentCopy = [...parent];
    for (let i = 0; i < n; i++) {
        const root = findSet(parentCopy, i);
        if (!componentMap[root]) componentMap[root] = [];
        componentMap[root].push(i);
    }
    return Object.values(componentMap);
};

const kruskalSteps = (edges, n) => {
    const parent = Array(n).fill(0).map((_, i) => i);
    const rank = Array(n).fill(0);
    const mstEdges = [];
    const rejected = [];
    const allSteps = [];

    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

    allSteps.push({
        type: 'start',
        description: `Starting Kruskal's Algorithm with ${n} nodes. Edges are sorted.`,
        mst: [],
        rejected: [],
        currentEdge: null,
        components: getComponents([...parent], n),
        totalCost: 0
    });

    for (let i = 0; i < sortedEdges.length; i++) {
        const edge = sortedEdges[i];
        
        allSteps.push({
            type: 'considering',
            description: `Considering edge ${edge.node1}-${edge.node2} (Weight: ${edge.weight}).`,
            mst: [...mstEdges],
            rejected: [...rejected],
            currentEdge: edge,
            components: getComponents([...parent], n),
            totalCost: mstEdges.reduce((sum, e) => sum + e.weight, 0)
        });

        const xroot = findSet([...parent], edge.node1);
        const yroot = findSet([...parent], edge.node2);

        if (xroot !== yroot) {
            mstEdges.push(edge);
            union(parent, rank, xroot, yroot);
            allSteps.push({
                type: 'accept',
                description: `ACCEPTED! Edge ${edge.node1}-${edge.node2} added to MST. Sets joined.`,
                mst: [...mstEdges],
                rejected: [...rejected],
                currentEdge: edge,
                components: getComponents([...parent], n),
                totalCost: mstEdges.reduce((sum, e) => sum + e.weight, 0)
            });
        } else {
            rejected.push(edge);
            allSteps.push({
                type: 'reject',
                description: `REJECTED! Edge ${edge.node1}-${edge.node2} would create a cycle.`,
                mst: [...mstEdges],
                rejected: [...rejected],
                currentEdge: edge,
                components: getComponents([...parent], n),
                totalCost: mstEdges.reduce((sum, e) => sum + e.weight, 0)
            });
        }

        if (mstEdges.length === n - 1) {
            allSteps.push({
                type: 'complete',
                description: `MST complete! Found ${n - 1} edges. Final Cost: ${mstEdges.reduce((sum, e) => sum + e.weight, 0)}.`,
                mst: [...mstEdges],
                rejected: [...rejected],
                currentEdge: null,
                components: [Array.from({ length: n }, (_, i) => i)],
                totalCost: mstEdges.reduce((sum, e) => sum + e.weight, 0)
            });
            break;
        }
    }

    if (allSteps[allSteps.length - 1].type !== 'complete') {
        allSteps.push({
             type: 'partial',
             description: `Algorithm finished. Graph is disconnected. Total cost: ${mstEdges.reduce((sum, e) => sum + e.weight, 0)}.`,
             mst: [...mstEdges],
             rejected: [...rejected],
             currentEdge: null,
             components: getComponents([...parent], n),
             totalCost: mstEdges.reduce((sum, e) => sum + e.weight, 0)
           });
    }

    return { steps: allSteps, sortedEdges };
};

const KruskalVisualizerPage = () => {
    const [edges, setEdges] = useState([]);
    const [mst, setMst] = useState([]);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [currentEdge, setCurrentEdge] = useState(null);
    const [rejectedEdges, setRejectedEdges] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [components, setComponents] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [speed, setSpeed] = useState(DEFAULT_SPEED);
    const [sortedEdgesList, setSortedEdgesList] = useState([]);

    const generateRandomGraph = useCallback((n) => {
        const newEdges = [];
        const nodeList = Array.from({ length: n }, (_, i) => i);
        
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                if (Math.random() > 0.3) {
                    const weight = Math.floor(Math.random() * 15) + 1;
                    newEdges.push({ 
                        id: `${i}-${j}`,
                        node1: i, 
                        node2: j, 
                        weight,
                        status: 'pending'
                    });
                }
            }
        }
        return { edges: newEdges, nodes: nodeList };
    }, []);

    const reset = useCallback(() => {
        const n = NODE_COUNT;
        const { edges: newEdges, nodes: newNodes } = generateRandomGraph(n);
        const { steps: generatedSteps, sortedEdges } = kruskalSteps(newEdges, n);
        
        setEdges(newEdges);
        setNodes(newNodes);
        setSteps(generatedSteps);
        setSortedEdgesList(sortedEdges);
        
        const initialState = generatedSteps[0];
        setMst(initialState.mst);
        setRejectedEdges(initialState.rejected);
        setCurrentEdge(initialState.currentEdge);
        setComponents(initialState.components);
        setTotalCost(initialState.totalCost);
        
        setCurrentStep(0);
        setPlaying(false);
    }, [generateRandomGraph]);

    const executeStep = useCallback((stepIndex) => {
        if (stepIndex >= steps.length) {
            setPlaying(false);
            return;
        }

        const step = steps[stepIndex];
        setMst(step.mst);
        setRejectedEdges(step.rejected);
        setCurrentEdge(step.currentEdge);
        setComponents(step.components);
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
        if (mst.some(e => e.id === edge.id)) return 'accepted';
        if (rejectedEdges.some(e => e.id === edge.id)) return 'rejected';
        return 'pending';
    };

    const getNodeComponent = (nodeId) => {
        return components.findIndex(comp => comp.includes(nodeId));
    };

    const isComplete = currentStep >= steps.length - 1 && steps.length > 0;
    
    const EdgeRow = ({ edge }) => {
        const status = getEdgeStatus(edge);
        let color = 'text-gray-400';
        let statusText = 'Pending';

        if (status === 'current') {
            color = 'text-yellow-400 font-bold bg-yellow-400/10 border-yellow-500';
            statusText = 'CONSIDERING';
        } else if (status === 'accepted') {
            color = 'text-green-400 font-bold bg-green-400/10 border-green-500';
            statusText = 'ACCEPTED (MST)';
        } else if (status === 'rejected') {
            color = 'text-red-400 line-through bg-red-400/10 border-red-500';
            statusText = 'REJECTED (Cycle)';
        }

        return (
            <motion.div 
                key={edge.id}
                className={`flex justify-between items-center px-3 py-2 text-sm rounded transition-all duration-300 border ${color.includes('bg-') ? color : 'border-gray-700 hover:bg-gray-700/50'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                <span className="font-mono">{edge.node1}-{edge.node2}</span>
                <span className="font-extrabold w-8 text-center">{edge.weight}</span>
                <span className={`text-xs ${color}`}>{statusText}</span>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white px-6 py-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Kruskal's Algorithm 🌿
                    </h1>
                    <p className="text-xl text-indigo-300 max-w-3xl mx-auto">
                        A <span className="font-bold">greedy</span> approach: always pick the <span className="font-bold">lightest</span> edge that connects two separate groups (components).
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
                            disabled={isComplete && !playing}
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg"
                        >
                            {playing ? <Pause size={20} /> : <Play size={20} />}
                            {playing ? "Pause" : (isComplete ? "Finished" : "Play")}
                        </button>
                        <button
                            onClick={stepForward}
                            disabled={isComplete || playing}
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
                            <Settings size={14}/> Delay ({speed}ms)
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
                    
                    {/* Column 1: Edge List Panel */}
                    <div className="lg:col-span-1">
                           <motion.div
                                className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-2xl backdrop-blur-md border border-slate-600/30 h-full"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <h3 className="text-2xl font-bold mb-4 text-yellow-400 text-center">Sorted Edges</h3>
                                <div className="text-sm font-semibold text-gray-400 flex justify-between px-3 pb-2 border-b border-gray-700">
                                    <span>Edge</span>
                                    <span>Weight</span>
                                    <span>Status</span>
                                </div>
                                <div className="space-y-1 max-h-96 overflow-y-auto">
                                    <AnimatePresence>
                                        {sortedEdgesList.map((edge) => (
                                            <EdgeRow key={edge.id} edge={edge} />
                                        ))}
                                    </AnimatePresence>
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
                            <h3 className="text-2xl font-bold mb-6 text-center text-indigo-300">Graph Visualization</h3>
                            
                            <div className="relative w-full h-96 mx-auto">
                                <svg viewBox="0 0 450 450" className="w-full h-full">
                                    {/* Edges */}
                                    <AnimatePresence initial={false}>
                                        {edges.map((edge) => {
                                            const pos1 = nodePositions[edge.node1];
                                            const pos2 = nodePositions[edge.node2];
                                            const status = getEdgeStatus(edge);
                                            
                                            let strokeColor = '#64748b';
                                            let strokeWidth = 2;
                                            
                                            if (status === 'current') {
                                                strokeColor = '#fbbf24';
                                                strokeWidth = 4;
                                            } else if (status === 'accepted') {
                                                strokeColor = '#10b981';
                                                strokeWidth = 4;
                                            } else if (status === 'rejected') {
                                                strokeColor = '#ef4444';
                                                strokeWidth = 3;
                                            }
                                            
                                            const midX = (pos1.x + pos2.x) / 2;
                                            const midY = (pos1.y + pos2.y) / 2;
                                            
                                            return (
                                                <motion.g 
                                                    key={edge.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    <motion.line
                                                        x1={pos1.x} y1={pos1.y}
                                                        x2={pos2.x} y2={pos2.y}
                                                        stroke={strokeColor}
                                                        strokeWidth={strokeWidth}
                                                        animate={{ stroke: strokeColor, strokeWidth: strokeWidth }}
                                                        transition={{ duration: 0.5 }}
                                                        style={status === 'rejected' ? { strokeDasharray: 5 } : {}}
                                                    />
                                                    {/* Weight label */}
                                                    <circle
                                                        cx={midX} cy={midY} r="15"
                                                        fill={status === 'current' ? '#fbbf24' : status === 'accepted' ? '#10b981' : '#1e293b'}
                                                        stroke={strokeColor} strokeWidth="2"
                                                    />
                                                    <text
                                                        x={midX} y={midY + 4}
                                                        textAnchor="middle"
                                                        className="text-sm font-bold fill-white"
                                                    >
                                                        {edge.weight}
                                                    </text>
                                                </motion.g>
                                            );
                                        })}
                                    </AnimatePresence>
                                    
                                    {/* Nodes */}
                                    {nodes.map((node) => {
                                        const pos = nodePositions[node];
                                        const componentIndex = getNodeComponent(node);
                                        const color = NODE_COLORS[componentIndex % NODE_COLORS.length];
                                        
                                        return (
                                            <motion.g key={node}>
                                                <circle
                                                    cx={pos.x} cy={pos.y} r="25"
                                                    fill={color} stroke="white" strokeWidth="3"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1, fill: color }}
                                                    transition={{ delay: node * 0.1, type: "spring", stiffness: 200 }}
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
                            className="bg-gradient-to-br from-indigo-800/60 to-indigo-900/60 p-6 rounded-xl backdrop-blur-md border border-indigo-600/30"
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
                                    <span className="text-gray-300">Connected Components:</span>
                                    <span className="text-blue-400 font-bold">{components.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Total Graph Edges:</span>
                                    <span className="text-white font-bold">{edges.length}</span>
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
                                <div className="flex items-center gap-3"><div className="w-4 h-1 bg-gray-500 rounded"></div><span className="text-gray-300">Pending Edge</span></div>
                                <div className="flex items-center gap-3"><div className="w-4 h-1 bg-yellow-400 rounded"></div><span className="text-gray-300">Current Edge</span></div>
                                <div className="flex items-center gap-3"><div className="w-4 h-1 bg-green-500 rounded"></div><span className="text-gray-300">MST Edge (Accepted)</span></div>
                                <div className="flex items-center gap-3"><div className="w-4 h-1 bg-red-500 rounded" style={{ borderStyle: 'dashed' }}></div><span className="text-gray-300">Rejected Edge (Cycle)</span></div>
                                <div className="pt-2 border-t border-slate-600">
                                    <p className="text-xs text-gray-400">Node colors represent connected components (groups of nodes).</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KruskalVisualizerPage;