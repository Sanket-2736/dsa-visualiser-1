import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Search, SkipBack, SkipForward } from "lucide-react";

const generateSortedArray = (n) =>
    Array.from({ length: n }, (_, i) => i * 5 + 10);

const BinarySearchPage = () => {
    const [arr, setArr] = useState([]);
    const [target, setTarget] = useState(0);
    const [inputTarget, setInputTarget] = useState("");
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [searchResult, setSearchResult] = useState(null);

    const [low, setLow] = useState(null);
    const [high, setHigh] = useState(null);
    const [mid, setMid] = useState(null);

    const binarySearchSteps = (array, target) => {
        let l = 0,
            r = array.length - 1;
        const s = [];
        let foundIndex = -1;

        while (l <= r) {
            let m = Math.floor((l + r) / 2);
            s.push({ low: l, high: r, mid: m });

            if (array[m] === target) {
                foundIndex = m;
                break;
            } else if (array[m] < target) {
                l = m + 1;
            } else {
                r = m - 1;
            }
        }

        if (foundIndex !== -1) {
            s.push({ low: foundIndex, high: foundIndex, mid: foundIndex, status: 'found' });
        } else {
            s.push({ low: l, high: r, mid: null, status: 'not_found' });
        }
        
        return s;
    };

    const generateNewArray = () => generateSortedArray(20);

    const reset = useCallback((newArr = null) => {
        const freshArray = newArr || generateNewArray();
        const initialTarget = freshArray[Math.floor(Math.random() * freshArray.length)];
        
        setArr(freshArray);
        setTarget(initialTarget);
        setInputTarget(initialTarget.toString());
        
        const searchSteps = binarySearchSteps(freshArray, initialTarget);
        setSteps(searchSteps);
        setCurrentStep(0);
        setPlaying(false);
        setSearchResult(null);
        
        setLow(0);
        setHigh(freshArray.length - 1);
        setMid(null);
    }, []);
    
    const handleSearch = () => {
        const targetVal = parseInt(inputTarget);
        if (isNaN(targetVal)) return;

        const searchSteps = binarySearchSteps(arr, targetVal);
        
        setTarget(targetVal);
        setSteps(searchSteps);
        setCurrentStep(0);
        setPlaying(false);
        setSearchResult(null);
        
        setLow(0);
        setHigh(arr.length - 1);
        setMid(null);
    };

    const stepForward = () => {
        if (currentStep >= steps.length - 1) {
            setPlaying(false);
            const finalStep = steps[steps.length - 1];
            setSearchResult(finalStep.status);
            
            if (finalStep.status === 'found') {
                setLow(finalStep.low);
                setHigh(finalStep.high);
                setMid(finalStep.mid);
            } else {
                const lastCheck = steps[steps.length - 2];
                setLow(lastCheck.low); 
                setHigh(lastCheck.high);
                setMid(lastCheck.mid);
            }
            return;
        }
        
        const nextStep = currentStep + 1;
        const step = steps[nextStep];
        
        setLow(step.low);
        setHigh(step.high);
        setMid(step.mid);
        setCurrentStep(nextStep);
    };
    
    const stepBackward = () => {
        if (currentStep <= 0) return;
        
        const prevStep = currentStep - 1;
        
        if (prevStep === 0) {
            setLow(0);
            setHigh(arr.length - 1);
            setMid(null);
        } else {
            const step = steps[prevStep];
            setLow(step.low);
            setHigh(step.high);
            setMid(step.mid);
        }
        setSearchResult(null);
        setCurrentStep(prevStep);
    };

    useEffect(() => {
        reset();
    }, [reset]);

    useEffect(() => {
        if (!playing || currentStep >= steps.length - 1) {
            setPlaying(false);
            if (currentStep === steps.length - 1) stepForward();
            return;
        }
        
        const timer = setTimeout(() => {
            stepForward();
        }, 800);
        return () => clearTimeout(timer);
    }, [playing, currentStep, steps]);

    const getCellClassName = (idx) => {
        if (searchResult === 'found' && idx === mid) {
            return "bg-green-500 text-black shadow-lg ring-4 ring-green-300";
        }
        if (searchResult === 'not_found' && arr[idx] === steps[steps.length - 2]?.arr[steps[steps.length - 2]?.mid]) {
            return "bg-red-500 text-white shadow-lg";
        }
        if (idx === mid) {
            return "bg-yellow-400 text-black font-extrabold shadow-lg ring-2 ring-yellow-200";
        }
        if (idx >= low && idx <= high) {
            return "bg-indigo-500 text-white";
        }
        return "bg-gray-700 text-gray-400 opacity-50";
    };
    
    const isFinished = searchResult !== null;
    const isFound = searchResult === 'found';

    const statusMessage = useMemo(() => {
        if (isFound) return `SUCCESS! Target ${target} found at index ${mid}.`;
        if (searchResult === 'not_found') return `FAILURE! Target ${target} is not in the array.`;
        if (currentStep === 0 && !playing) return `Ready to search for ${target}. Press Play or Step!`;
        if (currentStep > 0 && mid !== null) {
            if (arr[mid] === target) return `Midpoint (${arr[mid]}) matches target! FOUND!`;
            if (arr[mid] < target) return `Midpoint (${arr[mid]}) is LESS than target (${target}). Search RIGHT!`;
            if (arr[mid] > target) return `Midpoint (${arr[mid]}) is GREATER than target (${target}). Search LEFT!`;
        }
        return 'Analyzing the search space...';
    }, [searchResult, target, currentStep, playing, mid, arr]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white px-6 py-16">
            <div className="max-w-5xl mx-auto text-center">
                <motion.h1
                    className="text-4xl md:text-5xl font-bold mb-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    Binary Search Visualizer 🎯
                </motion.h1>
                
                <motion.p
                    className={`text-xl font-semibold mb-10 transition-colors duration-500 ${isFound ? 'text-green-400' : searchResult === 'not_found' ? 'text-red-400' : 'text-indigo-300'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    {statusMessage}
                </motion.p>
                
                {/* --- Controls Section --- */}
                <div className="flex flex-wrap justify-center items-center gap-4 mb-10 p-4 bg-gray-800/50 rounded-lg shadow-xl">
                    
                    {/* Target Input */}
                    <input
                        type="number"
                        placeholder="New Target"
                        value={inputTarget}
                        onChange={(e) => setInputTarget(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="bg-gray-700 text-white px-4 py-2 rounded-md border border-indigo-500 w-32 text-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                        disabled={playing}
                    >
                        <Search size={18} /> Search
                    </button>
                    
                    <div className="flex gap-2 mx-4">
                        <button
                            onClick={stepBackward}
                            disabled={currentStep <= 0 || playing}
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
                    
                    <button
                        onClick={() => reset()}
                        className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                    >
                        <RotateCcw size={18} /> New Array
                    </button>
                </div>

                {/* --- Visualization Bars --- */}
                <div className="flex flex-col items-center">
                    
                    {/* Index Display */}
                    <div className="flex justify-center items-end gap-1 mx-auto max-w-4xl px-2">
                        {arr.map((_, idx) => (
                            <div key={`idx-${idx}`} className="w-6 h-4 text-[0.6rem] text-gray-400 font-mono">
                                {idx}
                            </div>
                        ))}
                    </div>

                    {/* Array Cells */}
                    <div className="flex justify-center items-end gap-1 mx-auto max-w-4xl px-2 mb-20">
                        {arr.map((value, idx) => (
                            <motion.div
                                key={idx}
                                layout
                                className={`w-6 h-14 flex flex-col items-center justify-center rounded-md text-sm font-bold shadow-md ${getCellClassName(idx)}`}
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {value}
                            </motion.div>
                        ))}
                    </div>
                    
                    {/* Pointers Display */}
                    <div className="relative bottom-16 w-full max-w-4xl flex justify-center">
                        {arr.map((_, idx) => (
                            <div key={`ptr-${idx}`} className="w-7">
                                {idx === low && low !== mid && (
                                    <div className="absolute top-0 transform -translate-y-full text-blue-400 font-bold">
                                        Low
                                    </div>
                                )}
                                {idx === high && high !== mid && (
                                    <div className="absolute top-8 transform translate-y-full text-pink-400 font-bold">
                                        High
                                    </div>
                                )}
                                {idx === mid && mid !== null && (
                                    <div className="absolute top-4 transform -translate-y-full text-yellow-400 font-bold">
                                        Mid
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>


                {/* --- Footer Information --- */}
                <div className="text-sm text-indigo-300 mt-8 flex justify-between max-w-sm mx-auto p-3 border-t border-indigo-800">
                    <p>
                        Target: <span className="text-white font-semibold">{target}</span>
                    </p>
                    <p>
                        Step <span className="font-bold">{currentStep}</span> / {steps.length - 1}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BinarySearchPage;