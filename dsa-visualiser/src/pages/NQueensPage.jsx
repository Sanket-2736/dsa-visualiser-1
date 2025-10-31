import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Copy } from "lucide-react";

const deepCloneBoard = (board) => board.map((row) => [...row]);

const NQueensPage = () => {
  const [size, setSize] = useState(4);
  const [board, setBoard] = useState([]);
  const [allSteps, setAllSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [capturedSolutions, setCapturedSolutions] = useState([]);
  const [copyError, setCopyError] = useState(false);

  const isFinalSolution = useCallback((currentBoard) => {
    const N = currentBoard.length;
    let queenCount = 0;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (currentBoard[i][j] === 1) {
          queenCount++;
        }
      }
    }
    return queenCount === N;
  }, []);

  const solveNQueensSteps = (n) => {
    const steps = [];
    const currentBoard = Array(n).fill().map(() => Array(n).fill(0));

    const isSafe = (row, col) => {
      for (let i = 0; i < row; i++) {
        if (currentBoard[i][col] === 1) return false;
      }
      for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
        if (currentBoard[i][j] === 1) return false;
      }
      for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
        if (currentBoard[i][j] === 1) return false;
      }
      return true;
    };

    const placeQueens = (row) => {
      if (row === n) {
        steps.push(deepCloneBoard(currentBoard)); 
        return;
      }

      for (let col = 0; col < n; col++) {
        if (isSafe(row, col)) {
          currentBoard[row][col] = 1;
          steps.push(deepCloneBoard(currentBoard));
          placeQueens(row + 1);
          currentBoard[row][col] = 0;
          steps.push(deepCloneBoard(currentBoard));
        }
      }
    };

    placeQueens(0);
    return steps;
  };
  
  const reset = () => {
    const clampedSize = Math.max(4, Math.min(8, size));
    const steps = solveNQueensSteps(clampedSize);

    const initialBoard = Array(clampedSize).fill().map(() => Array(clampedSize).fill(0));
    setBoard(initialBoard);
    
    setAllSteps(steps);
    setCapturedSolutions([]);
    setCurrentStep(0);
    setPlaying(false);
    setCopyError(false);
  };

  const isDuplicateSolution = useCallback((newSolution) => {
    const newSolutionStr = JSON.stringify(newSolution);
    return capturedSolutions.some(sol => JSON.stringify(sol) === newSolutionStr);
  }, [capturedSolutions]);


  const stepForward = () => {
    const nextStep = currentStep + 1;
    if (nextStep < allSteps.length) {
      const nextBoard = allSteps[nextStep];
      setBoard(nextBoard);
      setCurrentStep(nextStep);

      if (isFinalSolution(nextBoard) && !isDuplicateSolution(nextBoard)) {
          setCapturedSolutions(prev => [...prev, nextBoard]);
      }
      
    } else {
      setPlaying(false);
    }
  };


  useEffect(() => {
    reset();
  }, [size]);

  useEffect(() => {
    if (!playing || currentStep >= allSteps.length) {
      setPlaying(false);
      return;
    }
    
    const timer = setTimeout(() => {
      stepForward(); 
    }, 600);

    return () => clearTimeout(timer);
  }, [playing, currentStep, allSteps]);

  const formatBoardForDisplay = (board) => {
    return board.map(row => row.map(cell => cell === 1 ? 'Q' : '.').join(' ')).join('\n');
  };

  const SolutionPreview = ({ solution, index }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      const textToCopy = `Solution ${index + 1} (${solution.length}x${solution.length}):\n${formatBoardForDisplay(solution)}`;
      
      const el = document.createElement('textarea');
      el.value = textToCopy;
      document.body.appendChild(el);
      el.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          setCopied(true);
          setCopyError(false);
          setTimeout(() => setCopied(false), 2000);
        } else {
          setCopyError(true);
        }
      } catch (err) {
        setCopyError(true);
      } finally {
        document.body.removeChild(el);
      }
    };

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 p-3 rounded-lg shadow-xl border border-indigo-700 space-y-2 mb-4"
      >
        <h3 className="text-sm font-semibold text-indigo-300 flex justify-between items-center">
          Solution {index + 1}
          <button 
            onClick={handleCopy}
            className={`text-xs p-1 rounded transition-colors ${copied ? 'bg-green-600 text-white' : 'text-indigo-400 hover:text-white hover:bg-indigo-600'}`}
            title="Copy to clipboard"
          >
            {copied ? 'Copied!' : <Copy size={14} />}
          </button>
        </h3>
        <div className="grid border-2 border-gray-600 mx-auto" style={{ 
          gridTemplateColumns: `repeat(${solution.length}, 1rem)`,
          width: `${solution.length * 1.05}rem`
        }}>
          {solution.flatMap((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={`w-4 h-4 text-[0.6rem] flex items-center justify-center font-bold
                  ${(r + c) % 2 === 0 ? "bg-indigo-700" : "bg-indigo-900"}
                  ${cell === 1 ? 'text-yellow-300' : 'text-transparent'}
                `}
              >
                {cell === 1 ? "Q" : ""}
              </div>
            ))
          )}
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto flex">
        <div className="flex-1 px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              N-Queens Visualizer 👑
            </motion.h1>
            <motion.p
              className="text-lg text-indigo-300 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Visualize step-by-step queen placements using <span className="font-bold">backtracking</span>.
            </motion.p>

            <div className="flex justify-center gap-4 mb-10">
              <input
                type="number"
                min="4"
                max="8"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="bg-gray-800 border border-indigo-500 text-white px-4 py-2 rounded-md w-32 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => setPlaying(!playing)}
                className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
                disabled={currentStep >= allSteps.length && playing}
              >
                {playing ? <Pause size={18} /> : <Play size={18} />}{" "}
                {playing ? "Pause" : (currentStep >= allSteps.length ? "Finished" : "Play")}
              </button>
              <button
                onClick={reset}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
              >
                <RotateCcw size={18} /> Reset
              </button>
            </div>

            <div className="flex justify-center mb-8 overflow-x-auto">
              <div className="grid shadow-2xl shadow-indigo-900/50" 
                    style={{ gridTemplateColumns: `repeat(${size}, 2.5rem)` }}>
                {board.flatMap((row, i) =>
                  row.map((cell, j) => (
                    <motion.div
                      key={`${i}-${j}`}
                      className={`w-10 h-10 flex items-center justify-center text-3xl font-bold 
                        ${(i + j) % 2 === 0 ? "bg-indigo-600/70" : "bg-indigo-900/70"}
                        border border-gray-700 transition-colors duration-100 ease-in-out`}
                      initial={false}
                      animate={{ 
                          scale: cell === 1 ? 1.1 : 1, 
                          color: cell === 1 ? "#FCD34D" : "transparent"
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {cell === 1 ? "♕" : ""}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
            
            <AnimatePresence>
              {copyError && (
                  <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="bg-red-800/50 text-red-300 p-3 rounded-lg border border-red-500 mb-4 font-semibold max-w-md mx-auto"
                  >
                      Failed to copy. Please try again or copy manually.
                  </motion.div>
              )}
            </AnimatePresence>

            <p className="text-2xl text-indigo-300">
              Step <span className="font-bold">{currentStep}</span> / {allSteps.length}
            </p>
          </div>
        </div>

        <div className="w-80 bg-gray-900/80 backdrop-blur-sm border-l border-indigo-900 p-6 pt-16 h-screen sticky top-0 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-indigo-400 border-b border-indigo-900 pb-2">
            Captured Solutions ({capturedSolutions.length})
          </h2>
          {capturedSolutions.length > 0 ? (
            <AnimatePresence>
              {capturedSolutions.map((solution, index) => (
                <SolutionPreview key={index} solution={solution} index={index} />
              ))}
            </AnimatePresence>
          ) : (
            <p className="text-gray-400 text-sm">
              Solutions will be captured here as the visualization finds them.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NQueensPage;