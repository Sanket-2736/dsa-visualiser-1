import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Trash2, Search, List, RotateCcw } from "lucide-react";

let nextItemId = 0;

const StackPage = () => {
  const [stack, setStack] = useState([]);
  const [value, setValue] = useState("");
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState(null); // Keeping this for now, but not used for pop/peek errors

  const updateStackInfo = (newStack, action) => {
    // We don't clear the error here since Pop/Peek now use native alerts
    setStack(newStack);
    
    setSteps((prev) => [
      ...prev,
      { id: Date.now(), text: action }
    ]);
  };
  
  const handlePush = () => {
    if (value.trim() === "") return;

    const val = value.trim();
    const newItem = { id: nextItemId++, value: val };
    
    const updatedStack = [...stack, newItem]; 

    updateStackInfo(updatedStack, `Pushed ${val} (ID: ${newItem.id})`);
    setValue("");
  };

  const handlePop = () => {
    if (stack.length === 0) {
        alert("Cannot Pop: The stack is empty (Underflow)."); // Display native alert
        updateStackInfo(stack, `Attempted Pop (Failed: Empty)`);
        return;
    }
    
    const popped = stack[stack.length - 1]; 
    const updatedStack = stack.slice(0, -1);

    updateStackInfo(updatedStack, `Popped ${popped.value} (ID: ${popped.id})`);
  };

  const handlePeek = () => {
    if (stack.length === 0) {
        alert("Cannot Peek: The stack is empty."); // Display native alert
        updateStackInfo(stack, `Attempted Peek (Failed: Empty)`);
        return;
    }
    const topValue = stack[stack.length - 1].value;
    updateStackInfo(stack, `Peeked at Top: ${topValue}`);
  };

  const handleClear = () => {
      setStack([]);
      setSteps([]);
      setError(null);
  };

  const topItem = stack.length > 0 ? stack[stack.length - 1] : null;
  const size = stack.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white px-6 py-16">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Stack Simulation (LIFO) 📚
        </motion.h1>
        <motion.p
          className="text-lg text-indigo-300 mb-10 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          A <span className="font-bold">Stack</span> follows the <span className="font-bold">Last-In, First-Out</span> (LIFO) rule, like a pile of plates. Elements are always added and removed from the <span className="font-bold">TOP</span>.
        </motion.p>
        
        {/* --- Controls --- */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-10 p-6 bg-gray-800/50 rounded-xl shadow-xl">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePush()}
            placeholder="Enter value"
            className="bg-gray-700 text-white px-4 py-2 rounded-md border border-indigo-500 w-32"
          />
          <button
            onClick={handlePush}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-all"
          >
            <ArrowUp size={18} /> Push
          </button>
          <button
            onClick={handlePop}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-all"
          >
            <Trash2 size={18} /> Pop
          </button>
          <button
            onClick={handlePeek}
            className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-all"
          >
            <Search size={18} /> Peek Top
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-all"
          >
            <RotateCcw size={18} /> Clear
          </button>
        </div>

        {/* --- Visualization Area --- */}
        <motion.div
          className="bg-indigo-800/20 p-6 rounded-xl shadow-2xl border border-indigo-700/50 backdrop-blur-md mb-10 overflow-hidden flex justify-center"
          style={{ minHeight: '350px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex flex-col items-center justify-end relative h-full w-48">
            {/* TOP Pointer Label */}
            <div className="absolute top-0 w-full flex items-center justify-center -translate-y-full mb-2">
                <span className="text-yellow-400 font-bold text-lg flex items-center gap-1">
                    TOP <ArrowUp size={18} />
                </span>
            </div>
            
            {/* The Stack Container */}
            <motion.div 
                className="w-full bg-gray-800/50 border-4 border-b-0 border-indigo-500/50 p-1 flex flex-col-reverse items-center" 
                style={{ height: '300px' }}
            >
              <AnimatePresence initial={false}>
                {stack.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0, y: 50 }}
                    animate={{ 
                        scale: 1, 
                        opacity: 1, 
                        y: 0, 
                        transition: { type: "spring", stiffness: 400, damping: 30 }
                    }}
                    exit={{ 
                        opacity: 0, 
                        scale: 0.8, 
                        y: -50,
                        transition: { duration: 0.3 }
                    }}
                    className={`w-11/12 my-1 p-2 rounded-lg text-white shadow-lg flex flex-col items-center 
                        ${index === stack.length - 1 ? 'bg-red-600 ring-2 ring-red-400' : 'bg-indigo-700'}`}
                  >
                    <span className="text-lg font-bold">{item.value}</span>
                    <span className="text-xs text-gray-300">ID: {item.id}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            {/* Bottom Base */}
            <div className="w-full h-2 bg-indigo-500/80"></div>
          </div>
        </motion.div>

        {/* Error Message: Only handles non-pop/peek errors if any were added later */}
        <AnimatePresence>
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-red-800/50 text-red-300 p-3 rounded-lg border border-red-500 mb-4 font-semibold max-w-md mx-auto"
                >
                    {error}
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- Stats and Log --- */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            className="bg-gray-800 p-5 rounded-xl border-l-4 border-red-500 shadow-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-xl font-semibold text-red-400 mb-3 flex items-center justify-center gap-2">
              <Search size={20} /> Top Element
            </h4>
            <p className="text-white text-3xl font-bold">
              {topItem !== null ? topItem.value : "N/A"}
            </p>
          </motion.div>

          <motion.div
            className="bg-gray-800 p-5 rounded-xl border-l-4 border-indigo-500 shadow-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-xl font-semibold text-indigo-400 mb-3 flex items-center justify-center gap-2">
              <List size={20} /> Stack Size
            </h4>
            <p className="text-white text-3xl font-bold">{size}</p>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 bg-indigo-800/10 border border-indigo-700/30 p-6 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-indigo-400 mb-4">Action History</h3>
          <div className="max-h-32 overflow-y-auto">
            <ul className="text-indigo-200 text-sm list-disc list-inside space-y-1 text-left">
              <AnimatePresence initial={false}>
                {steps.slice(-5).reverse().map((step) => (
                  <motion.li 
                      key={step.id} 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-300 border-l-2 border-indigo-500 pl-3 py-0.5"
                  >
                    {step.text}
                  </motion.li>
                ))}
              </AnimatePresence>
              {steps.length === 0 && (
                <li className="text-gray-400">Add an item to the stack to see the history.</li>
              )}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StackPage;