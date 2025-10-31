import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Trash2, ListOrdered, Info, ArrowRight } from "lucide-react";

let nextNodeId = 0;

const LinkedListPage = () => {
  const [nodes, setNodes] = useState([]);
  const [value, setValue] = useState("");
  const [removeParam, setRemoveParam] = useState("");
  const [removeType, setRemoveType] = useState('index');
  const [steps, setSteps] = useState([]);

  const updateSteps = (action) => {
    setSteps((prev) => [...prev, { id: Date.now(), text: action }]);
  };

  const handleAdd = () => {
    if (!value.trim()) return;
    const valueNum = parseInt(value);
    
    const newNode = { 
        id: nextNodeId++, 
        value: valueNum,
    };
    
    setNodes((prev) => [...prev, newNode]);
    updateSteps(`Added node with value: ${valueNum} (at the end)`);
    setValue("");
  };

  const handleRemove = () => {
    if (nodes.length === 0) {
        updateSteps(`Error: List is already empty.`);
        return;
    }

    let updatedNodes = [...nodes];
    let removedNode = null;

    if (removeType === 'head') {
        removedNode = updatedNodes.shift();
        updateSteps(`Removed HEAD node with value: ${removedNode.value}`);
        setRemoveParam("");
        
    } else if (!removeParam.trim()) {
        updateSteps(`Error: Please enter a parameter.`);
        return;
    } else {
        const param = parseInt(removeParam);
        
        if (removeType === "index") {
            const index = param;
            if (index >= 0 && index < updatedNodes.length) {
                removedNode = updatedNodes.splice(index, 1)[0];
                updateSteps(`Removed node at index ${index} with value: ${removedNode.value}`);
            } else {
                updateSteps(`Error: Index ${index} is out of bounds.`);
            }
        } else if (removeType === "value") {
            const idx = updatedNodes.findIndex(node => node.value === param);
            if (idx !== -1) {
                removedNode = updatedNodes.splice(idx, 1)[0];
                updateSteps(`Removed first occurrence of value: ${param}`);
            } else {
                updateSteps(`Value ${param} not found.`);
            }
        }
    }
    
    setNodes(updatedNodes);
    setRemoveParam("");
  };
  
  const LinkedListNode = ({ node, index, isHead }) => (
    <motion.div
      layout
      key={node.id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
          opacity: 1, 
          scale: 1, 
          boxShadow: isHead ? '0 0 15px rgba(255, 255, 0, 0.7)' : 'none' 
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`relative p-3 rounded-lg text-white shadow-md flex flex-col items-center justify-center 
          ${isHead ? 'bg-yellow-600/90' : 'bg-purple-700/90'} 
          ring-2 ${isHead ? 'ring-yellow-400' : 'ring-purple-500'} transition-all`}
    >
      <span className="text-xs text-gray-200 font-mono absolute top-0 left-1">idx: {index}</span>
      <span className="text-2xl font-bold mt-2">{node.value}</span>
      <span className="text-xs text-gray-200 mt-1">ID: {node.id}</span>
      {isHead && <span className="absolute -top-6 text-yellow-400 font-bold text-sm">HEAD</span>}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white px-6 py-16">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Linked List Visualizer ⛓️
        </motion.h1>
        <motion.p
          className="text-lg text-purple-300 mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Unlike arrays, a <span className="font-bold">Linked List</span> is a sequence of <span className="font-bold">nodes</span> connected by <span className="font-bold">pointers</span>. Watch nodes rearrange instantly on removal!
        </motion.p>

        {/* --- Controls Panel --- */}
        <div className="flex flex-wrap gap-6 justify-center mb-10 p-6 bg-gray-800/50 rounded-xl shadow-xl">
          
          {/* Add Node */}
          <div className="flex flex-col gap-2 items-center w-64">
            <h4 className="text-purple-400 font-semibold">Add Node (Append to Tail)</h4>
            <div className="flex gap-2 w-full">
              <input
                type="number"
                placeholder="Value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="bg-gray-700 text-white px-3 py-2 rounded-md border border-purple-500 w-full"
              />
              <button
                onClick={handleAdd}
                className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-md flex-shrink-0"
              >
                <PlusCircle size={18} />
              </button>
            </div>
          </div>

          {/* Remove Node */}
          <div className="flex flex-col gap-2 items-center w-96">
            <h4 className="text-red-400 font-semibold">Remove Node</h4>
            <div className="flex gap-2 w-full items-center">
              
              <select
                value={removeType}
                onChange={(e) => {
                    setRemoveType(e.target.value);
                    setRemoveParam("");
                }}
                className="bg-gray-700 text-white px-3 py-2 rounded-md border border-red-500 w-24"
              >
                <option value="index">Index</option>
                <option value="value">Value</option>
                <option value="head">HEAD</option>
              </select>

              {removeType !== 'head' && (
                <input
                  type="number"
                  placeholder={`Enter ${removeType}`}
                  value={removeParam}
                  onChange={(e) => setRemoveParam(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRemove()}
                  className="bg-gray-700 text-white px-3 py-2 rounded-md border border-red-500 w-full"
                />
              )}
              
              <button
                onClick={handleRemove}
                className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-md flex-shrink-0"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* --- Linked List Visualization --- */}
        <motion.div
          className="bg-purple-800/20 p-6 rounded-xl shadow-2xl border border-purple-700/50 backdrop-blur-md mb-10 overflow-x-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-purple-300 mb-6">List Structure</h3>
          
          <div className="flex flex-col items-center w-fit mx-auto">
            {nodes.length === 0 ? (
              <p className="text-lg text-gray-300 py-10">The list is empty. HEAD → null</p>
            ) : (
              <div className="flex gap-4 items-center h-24 relative p-2">
                <AnimatePresence initial={false}>
                  {nodes.map((node, index) => (
                    <div key={node.id} className="flex items-center gap-4">
                      <LinkedListNode 
                          node={node} 
                          index={index} 
                          isHead={index === 0} 
                      />
                      
                      {/* Visual Pointer/Link */}
                      {index < nodes.length - 1 ? (
                        <div className="flex items-center">
                          <ArrowRight size={24} className="text-purple-400" />
                          <span className="text-xs text-gray-400 ml-1">next</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm font-mono ml-2 font-bold">NULL</span>
                      )}
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>

        {/* --- Stats and Log Section --- */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            className="bg-gray-800 p-5 rounded-xl border-l-4 border-purple-500 shadow-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-xl font-semibold text-purple-400 mb-3 flex items-center justify-center gap-2">
              <ListOrdered size={20} /> List Statistics
            </h4>
            <div className="space-y-2 text-center text-md">
              <p className="text-white">Total Nodes: <span className="text-purple-300 font-bold">{nodes.length}</span></p>
              <p className="text-white">Head Value: <span className="font-bold text-yellow-400">{nodes.length > 0 ? nodes[0].value : 'null'}</span></p>
              <p className="text-white">Tail Value: <span className="font-bold text-green-400">{nodes.length > 0 ? nodes[nodes.length - 1].value : 'null'}</span></p>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 p-5 rounded-xl border-l-4 border-gray-500 shadow-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-xl font-semibold text-gray-400 mb-3 flex items-center justify-center gap-2">
              <Info size={20} /> Action Log
            </h4>
            <div className="max-h-32 overflow-y-auto bg-gray-900 p-2 rounded">
              <ul className="space-y-1 text-left text-sm">
                <AnimatePresence initial={false}>
                  {steps.slice(-5).reverse().map((step) => (
                    <motion.li 
                      key={step.id} 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-300 border-l-2 border-purple-500 pl-3 py-0.5"
                    >
                      {step.text}
                    </motion.li>
                  ))}
                </AnimatePresence>
                {steps.length === 0 && <li className="text-gray-400">Start building your list!</li>}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LinkedListPage;