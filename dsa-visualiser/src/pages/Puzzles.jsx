import React, { useMemo, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import { Brain, Shuffle, RotateCcw, Star, Trophy } from "lucide-react";
import SnapshotButton from "../components/SnapshotButton";

const PUZZLES = [
  { id: "p1", title: "Warmup: 3 elements", start: [3, 1, 2], optimal: 2 },
  { id: "p2", title: "Mind the Middle", start: [2, 3, 1, 4], optimal: 2 },
  { id: "p3", title: "Near-sorted Trap", start: [1, 4, 3, 2, 5], optimal: 2 },
  { id: "p4", title: "Duplicates Allowed", start: [4, 2, 2, 3, 1], optimal: 3 },
  { id: "p5", title: "Five Shuffle", start: [5, 1, 4, 2, 3], optimal: 3 },
];

function isSorted(arr) {
  for (let i = 1; i < arr.length; i++) if (arr[i - 1] > arr[i]) return false;
  return true;
}

export default function PuzzlePage() {
  const { unlockAchievement } = useContext(AppContext);
  const [index, setIndex] = useState(0);
  const puzzle = PUZZLES[index];
  const [state, setState] = useState(puzzle.start.slice());
  const [moves, setMoves] = useState(0);
  const [selected, setSelected] = useState(null);
  const [won, setWon] = useState(false);
  const [best, setBest] = useState(
    () => JSON.parse(localStorage.getItem("puzzleBest") || "{}")
  );

  const optimal = useMemo(() => puzzle.optimal, [puzzle]);

  const resetCurrent = () => {
    setState(puzzle.start.slice());
    setMoves(0);
    setSelected(null);
    setWon(false);
  };

  const switchPuzzle = (dir) => {
    const nextIndex = Math.min(
      PUZZLES.length - 1,
      Math.max(0, index + dir)
    );
    const nextPuzzle = PUZZLES[nextIndex];
    setIndex(nextIndex);
    setState(nextPuzzle.start.slice());
    setMoves(0);
    setSelected(null);
    setWon(false);
  };

  const onPick = (i) => {
    if (won) return;
    if (selected === null) setSelected(i);
    else if (selected === i) setSelected(null);
    else {
      const next = [...state];
      [next[selected], next[i]] = [next[i], next[selected]];
      const newMoves = moves + 1;
      setState(next);
      setMoves(newMoves);
      setSelected(null);

      if (isSorted(next)) {
        setWon(true);
        setBest((prev) => {
          const updated = { ...prev };
          updated[puzzle.id] = Math.min(
            updated[puzzle.id] ?? Infinity,
            newMoves
          );
          localStorage.setItem("puzzleBest", JSON.stringify(updated));
          return updated;
        });
        unlockAchievement("puzzle_novice");
        if (newMoves === optimal) unlockAchievement("puzzle_perfect");
      }
    }
  };

  const scoreNote = won
    ? moves === optimal
      ? "Perfect!"
      : moves < optimal
      ? "Genius!"
      : `Optimal was ${optimal}`
    : "";
  const bestFor = best[puzzle.id];
  const stars = won
    ? Math.max(1, 3 - Math.max(0, moves - optimal))
    : bestFor
    ? Math.max(1, 3 - Math.max(0, bestFor - optimal))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Dynamic Puzzle Challenge 🧩
        </motion.h1>
        <motion.p
          className="text-lg text-blue-300 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Sort the numbers in ascending order with the **fewest swaps** possible.
          Outsmart the algorithm — or match its perfection!
        </motion.p>

        {/* --- Controls --- */}
        <div className="grid md:grid-cols-3 gap-6 mb-10 p-6 bg-gray-800/50 rounded-xl shadow-xl">
          <div className="flex flex-col gap-2 items-center">
            <h4 className="text-blue-400 font-semibold">Puzzle Selector</h4>
            <div className="flex gap-3 w-full justify-center">
              <button
                onClick={() => switchPuzzle(-1)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md"
              >
                ◀ Prev
              </button>
              <span className="text-white font-medium">{puzzle.title}</span>
              <button
                onClick={() => switchPuzzle(1)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md"
              >
                Next ▶
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-center">
            <h4 className="text-blue-400 font-semibold">Controls</h4>
            <div className="flex gap-2 w-full justify-center">
              <button
                onClick={resetCurrent}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <RotateCcw size={18} /> Reset
              </button>
              <Link
                to="/merge-sort"
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
              >
                <Brain size={18} /> Merge Sort Demo
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-center">
            <h4 className="text-blue-400 font-semibold">Snapshot</h4>
            <SnapshotButton
              targetSelector=".puzzle-board"
              filename="puzzle.png"
            />
          </div>
        </div>

        {/* --- Puzzle Board --- */}
        <motion.div
          className="bg-gray-900/60 p-6 rounded-xl border border-blue-700/50 backdrop-blur-md shadow-2xl puzzle-board"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-blue-300 mb-4 flex items-center justify-center gap-2">
            <Shuffle size={20} /> Arrange the Numbers
          </h3>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {state.map((v, i) => (
              <motion.button
                key={i}
                onClick={() => onPick(i)}
                className={`w-16 h-16 text-xl font-bold rounded-lg border-2 transition-all ${
                  selected === i
                    ? "border-blue-400 bg-blue-600/30"
                    : "border-gray-600 bg-gray-800 hover:border-blue-400"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {v}
              </motion.button>
            ))}
          </div>

          {won && (
            <motion.div
              className="text-emerald-400 font-semibold text-lg mt-4 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Trophy size={20} /> {scoreNote}
            </motion.div>
          )}
        </motion.div>

        {/* --- Stats --- */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <motion.div
            className="bg-gray-800 p-5 rounded-xl border-l-4 border-blue-500 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="text-xl font-semibold text-blue-400 mb-3 flex items-center justify-center gap-2">
              <Brain size={20} /> Puzzle Stats
            </h4>
            <div className="text-left text-md space-y-2">
              <p>
                Moves Taken:{" "}
                <span className="font-bold text-blue-300">{moves}</span>
              </p>
              <p>
                Optimal Moves:{" "}
                <span className="font-bold text-blue-300">{optimal}</span>
              </p>
              {bestFor && (
                <p>
                  Best Record:{" "}
                  <span className="font-bold text-blue-300">{bestFor}</span>
                </p>
              )}
              <p>
                Puzzle:{" "}
                <span className="font-bold text-blue-300">{puzzle.title}</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 p-5 rounded-xl border-l-4 border-gray-500 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="text-xl font-semibold text-gray-400 mb-3 flex items-center justify-center gap-2">
              <Star size={20} /> Star Rating
            </h4>
            <div className="flex justify-center items-center text-amber-400 text-3xl">
              {Array.from({ length: stars }).map((_, i) => (
                <span key={i}>★</span>
              ))}
              {Array.from({ length: Math.max(0, 3 - stars) }).map((_, i) => (
                <span key={i}>☆</span>
              ))}
            </div>
            {!won && (
              <p className="text-gray-400 text-sm mt-2">
                Tip: Select two tiles to swap them. Aim for minimal swaps.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
