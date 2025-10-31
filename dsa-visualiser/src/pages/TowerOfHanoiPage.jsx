import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, ListOrdered, Layers } from "lucide-react";

const TowerOfHanoiPage = () => {
  const [disks, setDisks] = useState(3);
  const [moves, setMoves] = useState([]);
  const [rods, setRods] = useState([[], [], []]);
  const [currentMove, setCurrentMove] = useState(0);
  const [playing, setPlaying] = useState(false);

  const generateMoves = (n, from, to, aux, list = []) => {
    if (n === 0) return;
    generateMoves(n - 1, from, aux, to, list);
    list.push([from, to]);
    generateMoves(n - 1, aux, to, from, list);
    return list;
  };

  const reset = () => {
    const d = Math.max(1, Math.min(8, disks)); // Clamp value
    const initial = [];
    for (let i = d; i >= 1; i--) initial.push(i);
    setRods([initial, [], []]);
    setMoves(generateMoves(d, 0, 2, 1));
    setCurrentMove(0);
    setPlaying(false);
  };

  const stepForward = () => {
    setRods((prevRods) => {
      if (currentMove >= moves.length) return prevRods;
      const [from, to] = moves[currentMove];
      if (!prevRods[from]?.length) return prevRods;

      const newRods = prevRods.map((rod) => [...rod]);
      const disk = newRods[from].pop();
      newRods[to].push(disk);
      return newRods;
    });
    setCurrentMove((prev) => prev + 1);
  };

  // Reset rods and moves on disk count change
  useEffect(() => {
    reset();
  }, [disks]);

  // Animation loop based on playing + move state
  useEffect(() => {
    if (!playing || currentMove >= moves.length) return;

    const timeout = setTimeout(() => {
      stepForward();
    }, 600);

    return () => clearTimeout(timeout);
  }, [playing, currentMove]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white px-6 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Tower of Hanoi
        </motion.h1>
        <motion.p
          className="text-lg text-purple-300 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Visualize the classic recursive puzzle in real time.
        </motion.p>

        <div className="flex justify-center gap-4 mb-10">
          <input
            type="number"
            min="1"
            max="8"
            value={disks}
            onChange={(e) => setDisks(Number(e.target.value))}
            className="bg-gray-800 border border-purple-500 text-white px-4 py-2 rounded-md w-32 text-center"
          />
          <button
            onClick={() => setPlaying(!playing)}
            className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-md flex items-center gap-2"
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}{" "}
            {playing ? "Pause" : "Play"}
          </button>
          <button
            onClick={reset}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md flex items-center gap-2"
          >
            <RotateCcw size={18} /> Reset
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-12">
          {rods.map((rod, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <h4 className="text-purple-400 font-semibold mb-2">Rod {idx + 1}</h4>
              <div className="h-64 w-full flex flex-col-reverse items-center justify-end relative">
                {/* Rod pole */}
                <div className="absolute bottom-0 w-1 h-full bg-purple-700" />
                {rod.map((disk, i) => (
                  <motion.div
                    key={i}
                    className="h-6 rounded-md bg-purple-500 mb-1"
                    style={{ width: `${disk * 20 + 40}px` }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="sr-only">Disk {disk}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-5 rounded-xl border border-purple-700/40">
            <h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
              <ListOrdered size={18} /> Total Moves
            </h4>
            <p className="text-white">{moves.length}</p>
          </div>

          <div className="bg-gray-800 p-5 rounded-xl border border-purple-700/40 overflow-auto max-h-60">
            <h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
              <Layers size={18} /> Steps
            </h4>
            <ul className="list-decimal list-inside text-gray-300 text-sm text-left">
              {moves.map(([from, to], i) => (
                <li key={i}>
                  Move disk from Rod {from + 1} to Rod {to + 1}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TowerOfHanoiPage;
