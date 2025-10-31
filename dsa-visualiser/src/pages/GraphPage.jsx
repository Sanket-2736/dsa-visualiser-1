import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Trash2, Link, Info, Shuffle } from "lucide-react";

const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;
const NODE_RADIUS = 20;

const GraphPage = () => {
  const [nodes, setNodes] = useState([]); 
  const [edges, setEdges] = useState([]);
  
  const [nodeValue, setNodeValue] = useState("");
  const [edgeStart, setEdgeStart] = useState("");
  const [edgeEnd, setEdgeEnd] = useState("");
  const [steps, setSteps] = useState([]);
  
  const [nodeIdCounter, setNodeIdCounter] = useState(0);

  const updateSteps = (action) => {
    setSteps((prev) => [...prev, action]);
  };

  const handleAddNode = () => {
    const value = nodeValue.trim();
    if (!value || nodes.some(n => n.value === value)) return;

    const x = Math.max(NODE_RADIUS, Math.random() * (SVG_WIDTH - 2 * NODE_RADIUS));
    const y = Math.max(NODE_RADIUS, Math.random() * (SVG_HEIGHT - 2 * NODE_RADIUS));

    const newNode = { id: nodeIdCounter, value, x, y };
    setNodes((prev) => [...prev, newNode]);
    setNodeIdCounter(prev => prev + 1);
    updateSteps(`Added node: ${value}`);
    setNodeValue("");
  };

  const handleAddEdge = () => {
    const start = edgeStart.trim();
    const end = edgeEnd.trim();
    if (!start || !end || start === end) return;

    const startNode = nodes.find(n => n.value === start);
    const endNode = nodes.find(n => n.value === end);
    if (!startNode || !endNode) {
      updateSteps(`Error: Node ${!startNode ? start : end} does not exist.`);
      return;
    }

    if (edges.some(e => e.start === start && e.end === end)) {
          updateSteps(`Error: Edge ${start} → ${end} already exists.`);
          return;
    }
    
    setEdges((prev) => [...prev, { start, end }]);
    updateSteps(`Added edge: ${start} → ${end}`);
    setEdgeStart("");
    setEdgeEnd("");
  };

  const handleRemoveNode = (value) => {
    if (!value.trim()) return;

    const updatedNodes = nodes.filter((n) => n.value !== value);
    const updatedEdges = edges.filter(
      (edge) => edge.start !== value && edge.end !== value
    );

    setNodes(updatedNodes);
    setEdges(updatedEdges);
    updateSteps(`Removed node: ${value} and all connected edges.`);
  };

  const handleRemoveEdge = (edgeString) => {
    if (!edgeString.trim()) return;
    
    const parts = edgeString.split('→').map(s => s.trim());
    if (parts.length !== 2) return;
    const [start, end] = parts;

    const initialLength = edges.length;
    const updatedEdges = edges.filter(
      (e) => !(e.start === start && e.end === end)
    );
    
    if (updatedEdges.length < initialLength) {
        setEdges(updatedEdges);
        updateSteps(`Removed edge: ${start} → ${end}`);
    } else {
        updateSteps(`Error: Edge ${start} → ${end} not found.`);
    }
  };

  const handleShuffle = () => {
    const newNodes = nodes.map(node => ({
        ...node,
        x: Math.max(NODE_RADIUS, Math.random() * (SVG_WIDTH - 2 * NODE_RADIUS)),
        y: Math.max(NODE_RADIUS, Math.random() * (SVG_HEIGHT - 2 * NODE_RADIUS)),
    }));
    setNodes(newNodes);
    updateSteps('Shuffled node positions.');
  };

  const nodeMap = useMemo(() => {
    return nodes.reduce((map, node) => {
      map[node.value] = node;
      return map;
    }, {});
  }, [nodes]);
  
  const adjacencyList = useMemo(() => {
    const adj = {};
    nodes.forEach(node => {
        adj[node.value] = [];
    });
    edges.forEach(edge => {
        if (adj[edge.start]) {
            adj[edge.start].push(edge.end);
        }
    });
    return adj;
  }, [nodes, edges]);

  const stats = useMemo(() => ({
    nodeCount: nodes.length,
    edgeCount: edges.length,
    isDirected: true, 
    density: nodes.length > 1 ? (edges.length / (nodes.length * (nodes.length - 1))).toFixed(2) : 0,
  }), [nodes, edges]);

  const getEdgePoint = useCallback((p1, p2, radius) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) return p1;
    
    const x = p1.x + dx * (distance - radius) / distance;
    const y = p1.y + dy * (distance - radius) / distance;
    
    return { x, y };
  }, []);

  const renderEdges = () => {
    return edges.map(({ start, end }, index) => {
      const startNode = nodeMap[start];
      const endNode = nodeMap[end];

      if (!startNode || !endNode) return null;

      const { x: x1, y: y1 } = getEdgePoint(startNode, endNode, NODE_RADIUS);
      const { x: x2, y: y2 } = getEdgePoint(endNode, startNode, NODE_RADIUS);
      
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const arrowLength = 10;
      
      const arrowX1 = x2 - arrowLength * Math.cos(angle - Math.PI / 6);
      const arrowY1 = y2 - arrowLength * Math.sin(angle - Math.PI / 6);
      const arrowX2 = x2 - arrowLength * Math.cos(angle + Math.PI / 6);
      const arrowY2 = y2 - arrowLength * Math.sin(angle + Math.PI / 6);

      return (
        <g key={index}>
          <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#a855f7"
            strokeWidth="2"
          />
          <polygon
            points={`${x2},${y2} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`}
            fill="#a855f7"
          />
        </g>
      );
    });
  };

  const renderNodes = () => {
    return nodes.map((node) => (
      <motion.g
        key={node.id}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, x: node.x, y: node.y }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        transform={`translate(${node.x}, ${node.y})`}
        className="cursor-pointer"
        whileHover={{ scale: 1.1 }}
      >
        <circle
          r={NODE_RADIUS}
          fill="#7c3aed"
          stroke="#a855f7"
          strokeWidth="3"
        />
        <text
          textAnchor="middle"
          dy="0.35em"
          fill="white"
          fontSize="12"
          fontWeight="bold"
        >
          {node.value}
        </text>
      </motion.g>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white px-6 py-16">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Dynamic Graph Visualizer 🗺️
        </motion.h1>
        <motion.p
          className="text-lg text-purple-300 mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          A <span className="font-bold">Graph</span> is a set of nodes (vertices) connected by links (edges). Add, link, and remove elements to build and visualize your custom structure!
        </motion.p>

        {/* --- Controls Panel --- */}
        <div className="grid md:grid-cols-3 gap-6 mb-10 p-6 bg-gray-800/50 rounded-xl shadow-xl">
          
          {/* Add Node */}
          <div className="flex flex-col gap-2 items-center">
            <h4 className="text-purple-400 font-semibold">Add Node</h4>
            <div className="flex gap-2 w-full">
                <input
                    type="text"
                    placeholder="e.g., A, 1, Home"
                    value={nodeValue}
                    onChange={(e) => setNodeValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNode()}
                    className="bg-gray-700 text-white px-3 py-2 rounded-md border border-purple-500 w-full"
                />
                <button
                    onClick={handleAddNode}
                    className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-md flex-shrink-0"
                >
                    <PlusCircle size={18} />
                </button>
            </div>
          </div>

          {/* Add Edge */}
          <div className="flex flex-col gap-2 items-center">
            <h4 className="text-purple-400 font-semibold">Add Edge (A → B)</h4>
            <div className="flex gap-1 w-full">
                <input
                    type="text"
                    placeholder="Start"
                    value={edgeStart}
                    onChange={(e) => setEdgeStart(e.target.value)}
                    className="bg-gray-700 text-white px-2 py-2 rounded-md border border-purple-500 w-1/2"
                />
                <Link size={20} className="text-gray-400 self-center" />
                <input
                    type="text"
                    placeholder="End"
                    value={edgeEnd}
                    onChange={(e) => setEdgeEnd(e.target.value)}
                    className="bg-gray-700 text-white px-2 py-2 rounded-md border border-purple-500 w-1/2"
                />
                <button
                    onClick={handleAddEdge}
                    className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-md flex-shrink-0"
                >
                    <PlusCircle size={18} />
                </button>
            </div>
          </div>
          
          {/* Remove/Utility */}
          <div className="flex flex-col gap-2 items-center">
            <h4 className="text-purple-400 font-semibold">Utility / Remove</h4>
            <div className="flex gap-2 w-full">
                <select
                    onChange={(e) => handleRemoveNode(e.target.value)}
                    className="bg-gray-700 text-white px-3 py-2 rounded-md border border-red-500 w-1/2"
                    defaultValue=""
                >
                    <option value="" disabled>Remove Node</option>
                    {nodes.map(n => <option key={n.id} value={n.value}>{n.value}</option>)}
                </select>
                <select
                    onChange={(e) => handleRemoveEdge(e.target.value)}
                    className="bg-gray-700 text-white px-3 py-2 rounded-md border border-red-500 w-1/2"
                    defaultValue=""
                >
                    <option value="" disabled>Remove Edge</option>
                    {edges.map((e, i) => <option key={i} value={`${e.start} → ${e.end}`}>{e.start} → {e.end}</option>)}
                </select>
            </div>
            <button
                onClick={handleShuffle}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 w-full transition-all"
            >
                <Shuffle size={18} /> Shuffle Layout
            </button>
          </div>
        </div>
        
        {/* --- Visualization & Adjacency List --- */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Adjacency List (Text Representation) */}
            <motion.div
                className="bg-gray-800/20 p-6 rounded-xl shadow-lg border-l-4 border-purple-500 backdrop-blur-md"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="text-xl font-semibold text-purple-300 mb-3 flex items-center justify-center gap-2">
                    <Info size={20} /> Adjacency List
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                    The <span className="font-bold">Adjacency List</span> is a fundamental way computers store graph data: listing a node and all the nodes it points to.
                </p>
                <div className="max-h-64 overflow-y-auto text-left bg-gray-900 p-3 rounded font-mono text-sm">
                    {nodes.length === 0 ? (
                        <p className="text-gray-500">Add nodes to see the list populate.</p>
                    ) : (
                        Object.entries(adjacencyList).map(([node, neighbors]) => (
                            <div key={node} className="text-white mb-1">
                                <span className="text-purple-400 font-bold">{node}</span> → {neighbors.length > 0 ? neighbors.join(', ') : <span className="text-gray-600">[No neighbors]</span>}
                            </div>
                        ))
                    )}
                </div>
            </motion.div>
            
            {/* Graph Visualization (Diagram) */}
            <motion.div
                className="bg-purple-800/20 p-4 rounded-xl shadow-2xl border border-purple-700/50 backdrop-blur-md"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="text-xl font-semibold text-purple-300 mb-3">Live Diagram</h3>
                {nodes.length === 0 ? (
                    <p className="text-lg text-gray-300 py-16">Start by adding your first node!</p>
                ) : (
                    <svg 
                        width="100%" 
                        height={SVG_HEIGHT} 
                        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} 
                        className="mx-auto"
                    >
                        <g>
                            {renderEdges()}
                        </g>
                        <AnimatePresence initial={false}>
                            {renderNodes()}
                        </AnimatePresence>
                    </svg>
                )}
            </motion.div>
        </div>

        {/* --- Stats and Log Section --- */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            className="bg-gray-800 p-5 rounded-xl border-l-4 border-purple-500 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-xl font-semibold text-purple-400 mb-3 flex items-center justify-center gap-2">
              <Info size={20} /> Graph Summary
            </h4>
            <div className="space-y-2 text-left text-md">
              <p className="text-white">Total Nodes (Vertices): <span className="font-bold text-purple-300">{stats.nodeCount}</span></p>
              <p className="text-white">Total Edges (Links): <span className="font-bold text-purple-300">{stats.edgeCount}</span></p>
              <p className="text-white">Type: <span className="font-bold text-purple-300">Directed Graph</span></p>
              <p className="text-white">Density (Max: 1.0): <span className="font-bold text-purple-300">{stats.density}</span></p>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 p-5 rounded-xl border-l-4 border-gray-500 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-xl font-semibold text-gray-400 mb-3 flex items-center justify-center gap-2">
              <Info size={20} /> Action Log
            </h4>
            <div className="max-h-32 overflow-y-auto bg-gray-900 p-2 rounded">
              <ul className="space-y-1 text-left text-sm">
                <AnimatePresence>
                    {steps.slice(-5).reverse().map((step, index) => (
                      <motion.li 
                        key={steps.length - 1 - index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-300 border-l-2 border-purple-500 pl-3 py-0.5"
                      >
                        {step}
                      </motion.li>
                    ))}
                </AnimatePresence>
                {steps.length === 0 && (
                  <li className="text-gray-400">No actions recorded yet.</li>
                )}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GraphPage;