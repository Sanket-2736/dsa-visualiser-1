import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Trash2, Search, List, RotateCcw, ArrowLeft } from "lucide-react";

let nextItemId = 0;

const QueuePage = () => {
  const [queue, setQueue] = useState([]);
  const [value, setValue] = useState("");
  const [steps, setSteps] = useState([]);
  
  const [size, setSize] = useState(0);
  const [error, setError] = useState(null);

  const updateQueueInfo = (newQueue, action) => {
    // We don't clear the error here since Dequeue/Peek now use native alerts
    setQueue(newQueue);
    setSize(newQueue.length);
    
    setSteps((prev) => [
      ...prev,
      { id: Date.now(), text: action }
    ]);
  };

  const handleEnqueue = () => {
    if (value.trim() === "") return;
    const val = value.trim();
    
    const newItem = { id: nextItemId++, value: val };
    const newQueue = [...queue, newItem];
    
    updateQueueInfo(newQueue, `Enqueued ${val} (ID: ${newItem.id})`);
    setValue("");
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
        alert("Cannot Dequeue: The queue is empty (Underflow)."); // Display native alert
        updateQueueInfo(queue, `Attempted Dequeue (Failed: Empty)`);
        return;
    }
    
    const removedItem = queue[0];
    const newQueue = queue.slice(1);
    
    updateQueueInfo(newQueue, `Dequeued ${removedItem.value} (ID: ${removedItem.id})`);
  };
  
  const handlePeek = () => {
    if (queue.length === 0) {
        alert("Cannot Peek: The queue is empty."); // Display native alert
        updateQueueInfo(queue, `Attempted Peek (Failed: Empty)`);
        return;
    }
    const frontValue = queue[0].value;
    updateQueueInfo(queue, `Peeked at Front: ${frontValue}`);
  };
  
  const handleClear = () => {
      setQueue([]);
      setSize(0);
      setSteps([]);
      setError(null);
  };

  const frontValue = queue.length > 0 ? queue[0].value : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white px-6 py-16">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Queue Simulation (FIFO) ⏳
        </motion.h1>
        <motion.p
          className="text-lg text-indigo-300 mb-10 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          A <span className="font-bold">Queue</span> follows the <span className="font-bold">First-In, First-Out</span> (FIFO) rule, like people waiting in line. Elements enter at the <span className="font-bold">Rear</span> and leave at the <span className="font-bold">Front</span>.
        </motion.p>

        {/* --- Controls --- */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-10 p-6 bg-gray-800/50 rounded-xl shadow-xl">
          
          {/* Enqueue */}
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleEnqueue()}
            placeholder="Enter value"
            className="bg-gray-700 text-white px-4 py-2 rounded-md border border-indigo-500 w-32"
          />
          <button
            onClick={handleEnqueue}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-all"
          >
            <ArrowRight size={18} /> Enqueue (Rear)
          </button>
          
          {/* Dequeue / Peek */}
          <button
            onClick={handleDequeue}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-all"
          >
            <Trash2 size={18} /> Dequeue (Front)
          </button>
          <button
            onClick={handlePeek}
            className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-all"
          >
            <Search size={18} /> Peek Front
          </button>
          
          {/* Clear */}
          <button
            onClick={handleClear}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-all"
          >
            <RotateCcw size={18} /> Clear Queue
          </button>
        </div>

        {/* --- Visualization --- */}
        <motion.div
          className="bg-indigo-800/20 p-6 rounded-xl shadow-2xl border border-indigo-700/50 backdrop-blur-md mb-10 overflow-x-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-indigo-300 mb-6">Queue Line</h3>
          
          {/* Visual Pointers */}
          <div className="flex justify-between max-w-4xl mx-auto px-4">
              <span className="text-red-400 font-bold text-lg flex items-center gap-1">
                  <ArrowLeft size={20} /> FRONT (Exit)
              </span>
              <span className="text-indigo-400 font-bold text-lg flex items-center gap-1">
                  REAR (Entry) <ArrowRight size={20} />
              </span>
          </div>

          {queue.length === 0 ? (
            <p className="text-lg text-gray-300 py-10">The queue is empty.</p>
          ) : (
            <div className="flex gap-2 justify-center py-6">
              <AnimatePresence initial={false}>
                {queue.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0, y: 10 }}
                    animate={{ 
                        scale: 1, 
                        opacity: 1, 
                        y: 0, 
                        x: 0,
                        transition: { type: "spring", stiffness: 400, damping: 30 }
                    }}
                    exit={{ 
                        opacity: 0, 
                        x: index === 0 ? -100 : 0,
                        scale: 0.5,
                        transition: { duration: 0.3 }
                    }}
                    className={`bg-indigo-700 px-6 py-3 rounded-xl text-white shadow-lg flex flex-col items-center justify-center 
                                 ring-2 ${index === 0 ? 'ring-red-400' : 'ring-indigo-500'}`}
                  >
                    <span className="text-xl font-bold">{item.value}</span>
                    <span className="text-xs text-gray-300 mt-1">ID: {item.id}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Error Message: Only renders if setError is called for a non-pop/peek reason (e.g., if we added a separate error trigger) */}
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

        {/* Stats and Log */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            className="bg-gray-800 p-5 rounded-xl border-l-4 border-red-500 shadow-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-xl font-semibold text-red-400 mb-3 flex items-center justify-center gap-2">
              <Search size={20} /> Front (Peek)
            </h4>
            <p className="text-white text-3xl font-bold">
              {frontValue !== null ? frontValue : "N/A"}
            </p>
          </motion.div>

          <motion.div
            className="bg-gray-800 p-5 rounded-xl border-l-4 border-indigo-500 shadow-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-xl font-semibold text-indigo-400 mb-3 flex items-center justify-center gap-2">
              <List size={20} /> Queue Size
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
                <li className="text-gray-400">Add an item to the queue to see the history.</li>
              )}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QueuePage;