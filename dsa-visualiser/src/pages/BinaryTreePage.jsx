import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Trash2, ListOrdered, Info, ArrowRightCircle } from "lucide-react";

const BinaryTreePage = () => {
  const [value, setValue] = useState("");
  const [removeValue, setRemoveValue] = useState("");
  const [steps, setSteps] = useState([]);
  const [root, setRoot] = useState(null);
  const [traversalResult, setTraversalResult] = useState([]);
  const [currentTraversalStep, setCurrentTraversalStep] = useState(-1);
  const [traversalType, setTraversalType] = useState(null);

  const highlightedValue = traversalResult[currentTraversalStep];

  const updateSteps = (action) => {
    setSteps((prev) => [...prev, action]);
  };
  
  const TreeNode = ({ node, x, y, isHighlighted }) => (
    <motion.g 
      key={`node-${node.value}`}
      initial={{ opacity: 0, scale: 0.5, x, y }} 
      animate={{ 
        opacity: 1, 
        scale: 1, 
        x, 
        y, 
        transition: { type: "spring", stiffness: 300, damping: 30 }
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      whileHover={{ scale: 1.1 }}
      transform={`translate(${x}, ${y})`}
    >
      <circle
        r="25"
        fill={isHighlighted ? "#FCD34D" : "#7c3aed"}
        stroke="#a855f7"
        strokeWidth="3"
        transition={{ duration: 0.15 }}
      />
      <text
        textAnchor="middle"
        dy="0.35em"
        fill={isHighlighted ? "black" : "white"}
        fontSize="14"
        fontWeight="bold"
      >
        {node.value}
      </text>
    </motion.g>
  );

  const renderTree = (node, x, y, spacing) => {
    if (node === null) return null;

    const nodeSpacing = Math.max(70, spacing / 2);
    
    const leftX = x - nodeSpacing;
    const leftY = y + 70;
    const rightX = x + nodeSpacing;
    const rightY = y + 70;

    return (
      <g key={node.value}>
        {node.left && (
          <line
            x1={x} y1={y}
            x2={leftX} y2={leftY}
            stroke="#a855f7" strokeWidth="2"
          />
        )}
        {node.right && (
          <line
            x1={x} y1={y}
            x2={rightX} y2={rightY}
            stroke="#a855f7" strokeWidth="2"
          />
        )}
        
        <TreeNode 
            node={node} 
            x={x} 
            y={y} 
            isHighlighted={node.value === highlightedValue}
        />

        {renderTree(node.left, leftX, leftY, nodeSpacing)}
        {renderTree(node.right, rightX, rightY, nodeSpacing)}
      </g>
    );
  };
  
  const handleAddNode = () => {
    const valueNum = parseInt(value);
    if (!value.trim() || isNaN(valueNum)) return;
    
    const newRoot = insertNode(JSON.parse(JSON.stringify(root)), valueNum);
    setRoot(newRoot);
    updateSteps(`Added node: ${valueNum}`);
    setValue("");
  };

  const handleRemoveNode = () => {
    const valueNum = parseInt(removeValue);
    if (!removeValue.trim() || isNaN(valueNum)) return;

    const newRoot = removeNode(JSON.parse(JSON.stringify(root)), valueNum);
    
    if (newRoot !== root || root !== null) {
      setRoot(newRoot);
      updateSteps(`Removed node: ${valueNum}`);
    } else {
      updateSteps(`Node ${valueNum} not found.`);
    }
    setRemoveValue("");
  };
  
  const insertNode = (node, value) => {
    if (node === null) return { value, left: null, right: null };
    if (value < node.value) node.left = insertNode(node.left, value);
    else if (value > node.value) node.right = insertNode(node.right, value);
    return node;
  };
  
  const findMin = (node) => {
    while (node.left !== null) node = node.left;
    return node;
  };

  const removeNode = (node, value) => {
    if (node === null) return null;

    if (value < node.value) node.left = removeNode(node.left, value);
    else if (value > node.value) node.right = removeNode(node.right, value);
    else {
      if (node.left === null && node.right === null) return null;
      if (node.left === null) return node.right;
      if (node.right === null) return node.left;

      let minNode = findMin(node.right);
      node.value = minNode.value;
      node.right = removeNode(node.right, minNode.value);
    }
    return node;
  };
  
  const inorderTraversal = useCallback((node) => {
    if (node === null) return [];
    return [...inorderTraversal(node.left), node.value, ...inorderTraversal(node.right)];
  }, []);

  const preorderTraversal = useCallback((node) => {
    if (node === null) return [];
    return [node.value, ...preorderTraversal(node.left), ...preorderTraversal(node.right)];
  }, []);

  const postorderTraversal = useCallback((node) => {
    if (node === null) return [];
    return [...postorderTraversal(node.left), ...postorderTraversal(node.right), node.value];
  }, []);

  const levelOrderTraversal = useCallback((node) => {
    if (node === null) return [];
    let result = [];
    let queue = [node];
    while (queue.length > 0) {
      let currentNode = queue.shift();
      result.push(currentNode.value);
      if (currentNode.left) queue.push(currentNode.left);
      if (currentNode.right) queue.push(currentNode.right);
    }
    return result;
  }, []);

  const handleTraversal = (type) => {
    let result = [];
    if (type === "inorder") result = inorderTraversal(root);
    else if (type === "preorder") result = preorderTraversal(root);
    else if (type === "postorder") result = postorderTraversal(root);
    else if (type === "levelorder") result = levelOrderTraversal(root);

    setTraversalResult(result);
    setCurrentTraversalStep(0);
    setTraversalType(type);
    updateSteps(`Started ${type} Traversal`);
  };

  const handleNextStep = () => {
    if (currentTraversalStep < traversalResult.length - 1) {
      setCurrentTraversalStep((prev) => prev + 1);
    }
  };
  
  const treeStats = useMemo(() => {
    const getTreeHeight = (node) => {
      if (node === null) return 0;
      return Math.max(getTreeHeight(node.left), getTreeHeight(node.right)) + 1;
    };
    
    const countNodes = (node) => {
      if (node === null) return 0;
      return countNodes(node.left) + countNodes(node.right) + 1;
    };
    
    const getTreeWidth = (node) => {
        if (node === null) return 0;
        const leftWidth = getTreeWidth(node.left);
        const rightWidth = getTreeWidth(node.right);
        return Math.max(1, leftWidth + rightWidth);
    };

    return {
      height: getTreeHeight(root),
      nodes: countNodes(root),
      width: getTreeWidth(root),
    };
  }, [root]);
  
  const SVG_WIDTH = Math.max(400, treeStats.width * 160);
  const SVG_HEIGHT = Math.max(200, treeStats.height * 70 + 50);
  const SVG_VIEWBOX = `${-SVG_WIDTH / 2} -20 ${SVG_WIDTH} ${SVG_HEIGHT}`;


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Binary Search Tree Visualizer 🌳
        </motion.h1>
        <motion.p
          className="text-lg text-purple-300 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          A <span className="font-bold">Binary Search Tree</span> is a sorted structure where the left child is smaller and the right child is larger than its parent.
        </motion.p>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-4 justify-center mb-10 p-4 bg-gray-800/40 rounded-xl">
          <input
            type="number"
            placeholder="Value to Add (e.g., 50)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddNode()}
            className="bg-gray-700 text-white px-4 py-2 rounded-md border border-purple-500 w-36 sm:w-48"
          />
          <button
            onClick={handleAddNode}
            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all"
          >
            <PlusCircle size={18} /> Add
          </button>
          
          <input
            type="number"
            placeholder="Value to Remove"
            value={removeValue}
            onChange={(e) => setRemoveValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRemoveNode()}
            className="bg-gray-700 text-white px-4 py-2 rounded-md border border-red-500 w-36 sm:w-48"
          />
          <button
            onClick={handleRemoveNode}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all"
          >
            <Trash2 size={18} /> Remove
          </button>
        </div>

        {/* Binary Tree Visualization with SVG */}
        <motion.div
          className="bg-purple-800/20 p-6 rounded-xl shadow-2xl border border-purple-700/50 backdrop-blur-md mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Tree Structure</h3>
          {root === null ? (
            <p className="text-lg text-gray-300 py-8">Start by adding your first node!</p>
          ) : (
            <div className="overflow-x-auto overflow-y-hidden">
              <svg 
                width="100%" 
                height={SVG_HEIGHT} 
                className="mx-auto"
                viewBox={SVG_VIEWBOX}
              >
                <AnimatePresence>
                  {renderTree(root, 0, 20, 150)}
                </AnimatePresence>
              </svg>
            </div>
          )}
        </motion.div>

        {/* Traversal Controls */}
        <div className="mb-8">
            <h3 className="text-2xl font-semibold text-white mb-4 flex items-center justify-center gap-2">
                <ListOrdered size={22} className="text-blue-400" /> Traversal Methods
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {["inorder", "preorder", "postorder", "levelorder"].map((type) => (
                <button
                  key={type}
                  onClick={() => handleTraversal(type)}
                  className={`px-4 py-2 rounded-lg transition-all capitalize font-medium ${
                    traversalType === type && currentTraversalStep < traversalResult.length
                      ? "bg-blue-400 text-gray-900 shadow-md ring-2 ring-blue-200"
                      : "bg-blue-600 hover:bg-blue-500 text-white"
                  }`}
                  disabled={root === null}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
        </div>

        {/* Step-by-step Visualization */}
        {traversalResult.length > 0 && (
          <motion.div 
            className="bg-gray-800/80 p-5 rounded-xl mb-10 shadow-lg border-l-4 border-blue-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-xl font-semibold text-blue-400 mb-3">
              {traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} Traversal Live
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="text-lg text-gray-300 font-mono">
                {traversalResult.map((val, index) => (
                    <span 
                        key={index}
                        className={`mx-1 p-1 rounded transition-colors duration-300 ${
                            index === currentTraversalStep ? "bg-yellow-400 text-gray-900 font-bold scale-110" : 
                            index < currentTraversalStep ? "text-green-400" : 
                            "text-gray-400"
                        }`}
                    >
                        {val}
                    </span>
                ))}
              </div>
              <button
                onClick={handleNextStep}
                disabled={currentTraversalStep >= traversalResult.length - 1}
                className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md flex items-center gap-2 transition-all"
              >
                {currentTraversalStep >= traversalResult.length - 1 ? "Finished" : "Next Step"}
                <ArrowRightCircle size={18} />
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-400">
                <span className="text-yellow-400">Yellow: Current Node.</span> <span className="text-green-400">Green: Visited.</span>
            </p>
          </motion.div>
        )}

        {/* Stats and Log Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Tree Stats */}
          <motion.div
            className="bg-gray-800 p-5 rounded-xl border border-purple-700/40"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-xl font-semibold text-purple-400 mb-3 flex items-center justify-center gap-2">
              <ListOrdered size={20} /> Tree Statistics
            </h4>
            <div className="space-y-2 text-center text-md">
              <p className="text-white">Height (levels): <span className="text-purple-300 font-bold">{treeStats.height}</span></p>
              <p className="text-white">Total Nodes: <span className="text-purple-300 font-bold">{treeStats.nodes}</span></p>
              <p className="text-white">Is Empty: <span className="text-purple-300 font-bold">{root === null ? "Yes" : "No"}</span></p>
            </div>
          </motion.div>

          {/* Recent Actions Log */}
          <motion.div
            className="bg-gray-800 p-5 rounded-xl border border-purple-700/40"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-xl font-semibold text-purple-400 mb-3 flex items-center justify-center gap-2">
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
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BinaryTreePage;