import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Maximize } from "lucide-react";

const generateRandomArray = (n) =>
  Array.from({ length: n }, (_, id) => ({
    id: id,
    value: Math.floor(Math.random() * 90) + 10,
  }));

const DEFAULT_SPEED = 200;

const insertionSortSteps = (array) => {
  const a = [...array];
  const steps = [];
  const N = a.length;
  
  steps.push({ arr: [...a], compare: [], swap: [], sortedEnd: 1, message: "Starting with the first element considered sorted." }); 
  
  for (let i = 1; i < N; i++) {
    let j = i;
    const currentVal = a[i].value;

    steps.push({ arr: [...a], compare: [i], swap: [], sortedEnd: i, message: `Inserting element ${currentVal} into the sorted section.` }); 
    
    while (j > 0 && a[j - 1].value > currentVal) {
      
      steps.push({ arr: [...a], compare: [j, j - 1], swap: [], sortedEnd: i, message: `Comparing ${a[j].value} with ${a[j-1].value}.` }); 
      
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      
      steps.push({ arr: [...a], compare: [], swap: [j, j - 1], sortedEnd: i, message: `Swapping ${a[j-1].value} and ${a[j].value}.` }); 

      j--;
    }
    
    steps.push({ arr: [...a], compare: [], swap: [], sortedEnd: i + 1, message: `Element ${currentVal} is placed. Extending sorted section.` });
  }
  
  steps.push({ arr: [...a], compare: [], swap: [], sortedEnd: N, message: "Sorting Complete!" }); 
  return steps;
};


const InsertionSortPage = () => {
  const [size, setSize] = useState(20);
  const [arr, setArr] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED); 

  const currentStepData = steps[currentStep] || {};
  const currentArr = currentStepData.arr || arr;
  const compare = currentStepData.compare || [];
  const swap = currentStepData.swap || [];
  const sortedEnd = currentStepData.sortedEnd || 0;
  const message = currentStepData.message || "Initializing...";
  
  const reset = useCallback(() => {
    const clampedSize = Math.max(5, Math.min(50, size));
    const newArray = generateRandomArray(clampedSize);
    const generatedSteps = insertionSortSteps(newArray);
    
    setArr(newArray);
    setSteps(generatedSteps);
    setCurrentStep(0);
    setPlaying(false);
  }, [size]);

  const stepForward = () => {
    setCurrentStep((prev) => {
        const nextStep = prev + 1;
        if (nextStep < steps.length) {
            return nextStep;
        } else {
            setPlaying(false);
            return prev;
        }
    });
  };
  
  const stepBackward = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    setPlaying(false);
  };

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
  }, [playing, currentStep, steps, speed]);

  const isFinished = currentStep >= steps.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white px-6 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Insertion Sort Visualizer 🚶
        </motion.h1>
        
        <motion.p
          className="text-lg text-indigo-300 mb-10 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {message}
        </motion.p>
        
        {/* --- Controls Section --- */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10 bg-gray-800/50 p-4 rounded-lg shadow-xl">
          	
          	{/* Array Size Input */}
          	<div className="flex flex-col items-center">
          		<label htmlFor="size" className="text-sm text-gray-300 mb-1">Array Size (5-50)</label>
          		<input
          			type="number"
          			id="size"
          			min="5"
          			max="50"
          			value={size}
          			onChange={(e) => setSize(Number(e.target.value))}
          			onBlur={reset} 
          			className="bg-gray-900 border border-indigo-500 text-white px-2 py-1 rounded-md w-20 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
          		/>
          	</div>

          	{/* Playback Controls */}
          	<div className="flex gap-2">
          		<button
          			onClick={stepBackward}
          			disabled={currentStep === 0 || playing}
          			className="bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded-md transition-colors disabled:opacity-50"
          			title="Step Backward"
          		>
          			<SkipBack size={18} />
          		</button>
          		<button
          			onClick={() => setPlaying(!playing)}
          			disabled={isFinished && !playing}
          			className={`px-4 py-2 rounded-md flex items-center gap-2 ${playing ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-indigo-600 hover:bg-indigo-500'} transition-colors disabled:opacity-50`}
          		>
          			{playing ? <Pause size={18} /> : <Play size={18} />}{" "}
          			{playing ? "Pause" : (isFinished ? "Finished" : "Play")}
          		</button>
          		<button
          			onClick={stepForward}
          			disabled={isFinished || playing}
          			className="bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded-md transition-colors disabled:opacity-50"
          			title="Step Forward"
          		>
          			<SkipForward size={18} />
          		</button>
          	</div>
          	
          	{/* Reset Button */}
          	<button
          		onClick={reset}
          		className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          	>
          		<RotateCcw size={18} /> New Array
          	</button>

          	{/* Speed Control */}
          	<div className="flex flex-col items-center w-32">
          		<label htmlFor="speed" className="text-sm text-gray-300 mb-1">Delay ({speed}ms)</label>
          		<input
          			type="range"
          			id="speed"
          			min="50"
          			max="500"
          			step="50"
          			value={speed}
          			onChange={(e) => setSpeed(Number(e.target.value))}
          			className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg"
          		/>
          	</div>
        </div>

        {/* --- Visualization Bars --- */}
        <div 
          	className="flex justify-center items-end h-64 mx-auto max-w-4xl p-2 border-b-2 border-indigo-700"
          	style={{ width: `${size * 28}px`, minWidth: '100%' }} 
        >
          {currentArr.map((item, index) => {
            const isSorted = index < sortedEnd;
            const isComparing = compare.includes(index);
            const isSwapping = swap.includes(index);

            let barColor = isSorted ? "bg-green-500/80" : "bg-indigo-500";
            if (isSwapping) barColor = "bg-red-500";
            else if (isComparing) barColor = "bg-yellow-400";
            
            if (sortedEnd <= index && currentStepData.sortedEnd < arr.length && compare.length > 0 && compare.includes(index)) {
             		barColor = "bg-orange-500"; 
            }
            
            return (
              <motion.div
                key={item.id}
                layout
                className={`flex-shrink-0 w-6 mx-0.5 rounded-t-sm flex justify-center items-end text-[0.6rem] font-bold text-gray-900 
                  ${barColor} shadow-md`}
                style={{ height: `${item.value * 2}px` }}
                initial={{ scaleY: 0.2 }}
                animate={{ 
                    scaleY: 1, 
                    color: (isComparing || isSwapping) ? "#000" : "#fff" 
                }}
                transition={{ 
                  duration: 0.3,
                  layout: { type: "spring", stiffness: 300, damping: 25 },
                }}
              >
                	<span className="mb-1">{item.value}</span>
              </motion.div>
            );
          })}
        </div>
        
        {/* --- Footer Information --- */}
        <div className="mt-8 flex justify-between items-center max-w-3xl mx-auto p-3 border-t border-indigo-800">
          	<p className="text-sm text-indigo-300">
          		Sorted Section Length: <span className="text-green-400 font-bold">{sortedEnd}</span>
          	</p>
          	<p className="text-sm text-indigo-300">
          		Step <span className="font-bold">{currentStep}</span> / {steps.length - 1}
          	</p>
        </div>
        
        {/* --- Legend --- */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm p-3 bg-gray-800/50 rounded-lg">
          	<div className="flex items-center gap-2">
          		<div className="w-4 h-4 rounded-full bg-green-500"></div>
          		<span><span className="font-bold">Sorted</span> Section</span>
          	</div>
          	<div className="flex items-center gap-2">
          		<div className="w-4 h-4 rounded-full bg-orange-500"></div>
          		<span><span className="font-bold">Element</span> to Insert</span>
          	</div>
          	<div className="flex items-center gap-2">
          		<div className="w-4 h-4 rounded-full bg-yellow-400"></div>
          		<span><span className="font-bold">Comparison</span></span>
          	</div>
          	<div className="flex items-center gap-2">
          		<div className="w-4 h-4 rounded-full bg-red-500"></div>
          		<span><span className="font-bold">Swap/Move</span></span>
          	</div>
        </div>
      </div>
    </div>
  );
};

export default InsertionSortPage;