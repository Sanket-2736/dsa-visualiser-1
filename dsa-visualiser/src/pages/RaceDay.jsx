import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, Play, RotateCcw, Trophy, Gauge } from "lucide-react";

const ALGORITHMS = ["Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort", "Quick Sort"];
const COLORS = ["from-purple-500", "from-blue-500", "from-emerald-500", "from-pink-500", "from-yellow-500"];

const generateArray = (n) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 100) + 1);

export default function RaceDayPage() {
  const [arraySize, setArraySize] = useState(25);
  const [baseArray, setBaseArray] = useState(generateArray(25));
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({});
  const [winner, setWinner] = useState(null);
  const [logs, setLogs] = useState([]);

  const reset = () => {
    setRunning(false);
    setWinner(null);
    setLogs([]);
    setBaseArray(generateArray(arraySize));
    setProgress({});
  };

  const startRace = async () => {
    if (running) return;
    setRunning(true);
    setWinner(null);
    setLogs([]);

    const startTime = performance.now();
    const promises = ALGORITHMS.map((algo, i) =>
      runSort(algo, baseArray.slice(), i)
    );
    const results = await Promise.all(promises);

    const sorted = results.sort((a, b) => a.time - b.time);
    setWinner(sorted[0].name);
    setRunning(false);

    const totalTime = (performance.now() - startTime).toFixed(1);
    setLogs((l) => [
      ...l,
      `🏁 Race finished in ${totalTime}ms. Winner: ${sorted[0].name}!`,
    ]);
  };

  const updateProgress = (algo, value) => {
    setProgress((p) => ({ ...p, [algo]: value }));
  };

  // --- Simulated algorithm delays ---
  const runSort = (algo, arr, i) =>
    new Promise(async (resolve) => {
      const start = performance.now();
      let n = arr.length;

      for (let step = 0; step < n; step++) {
        updateProgress(algo, (step / n) * 100);
        await new Promise((r) => setTimeout(r, 30 + i * 10)); // unique speed per algo
      }

      const time = performance.now() - start;
      setLogs((l) => [...l, `${algo} finished in ${time.toFixed(1)}ms`]);
      updateProgress(algo, 100);
      resolve({ name: algo, time });
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto text-center">
        {/* --- Title --- */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Sorting Race Visualizer 🏁
        </motion.h1>

        <motion.p
          className="text-lg text-indigo-300 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Watch your favorite sorting algorithms compete in a live race!  
          Each bar represents progress — only one can claim the trophy 🏆.
        </motion.p>

        {/* --- Controls --- */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <button
            onClick={reset}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <RotateCcw size={18} /> Reset
          </button>
          <button
            onClick={startRace}
            disabled={running}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              running
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            <Play size={18} /> {running ? "Racing..." : "Start Race"}
          </button>
          <button
            onClick={() => setBaseArray(generateArray(arraySize))}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Shuffle size={18} /> Shuffle Array
          </button>

          <div className="flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-lg">
            <Gauge size={18} />
            <input
              type="range"
              min="10"
              max="50"
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              className="w-32"
            />
            <span>{arraySize}</span>
          </div>
        </div>

        {/* --- Race Track --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALGORITHMS.map((algo, i) => (
            <motion.div
              key={algo}
              className="p-5 rounded-xl bg-gray-900/60 border border-indigo-700/50 backdrop-blur-md shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-lg font-semibold mb-2 flex items-center justify-between">
                <span>{algo}</span>
                {winner === algo && (
                  <Trophy size={20} className="text-yellow-400" />
                )}
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-3 bg-gradient-to-r ${COLORS[i % COLORS.length]} to-transparent`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress[algo] || 0}%` }}
                  transition={{ ease: "easeOut", duration: 0.3 }}
                />
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {progress[algo]?.toFixed(1) || 0}% complete
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- Winner + Logs --- */}
        <AnimatePresence>
          {winner && (
            <motion.div
              className="mt-10 text-2xl font-bold text-emerald-400 flex justify-center items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              🏆 Winner: {winner}!
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 bg-gray-800/60 rounded-xl p-5 text-left max-w-3xl mx-auto shadow-lg border border-indigo-700/40">
          <h3 className="text-lg font-semibold mb-3 text-indigo-400">
            Race Log
          </h3>
          <div className="space-y-1 text-gray-300 text-sm max-h-40 overflow-y-auto">
            {logs.length ? (
              logs.map((l, idx) => <div key={idx}>• {l}</div>)
            ) : (
              <div className="text-gray-500">No race data yet. Start a race!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
