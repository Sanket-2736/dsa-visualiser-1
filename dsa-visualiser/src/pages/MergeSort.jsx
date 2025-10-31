import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Settings } from "lucide-react";

const DEFAULT_SPEED = 300;
const MIN_SPEED = 100;
const MAX_SPEED = 800;
const ARRAY_SIZE = 20;

const generateRandomArray = (n) =>
    Array.from({ length: n }, (_, id) => ({
        id: id,
        value: Math.floor(Math.random() * 90) + 10,
    }));

const MergeSortPage = () => {
    const [arr, setArr] = useState([]);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(DEFAULT_SPEED);
    
    const [highlightIndices, setHighlightIndices] = useState([]); 
    const [scope, setScope] = useState({ left: null, right: null, mid: null }); 

    const mergeSortSteps = useCallback((initialArray) => {
        const s = [];
        const a = initialArray.map(item => ({...item}));

        const captureStep = (type, currentLeft, currentMid, currentRight, highlight) => {
            s.push({ 
                type: type, 
                arr: a.map(item => ({...item})),
                scope: { left: currentLeft, right: currentRight, mid: currentMid }, 
                highlight: highlight 
            });
        };

        const merge = (left, mid, right) => {
            captureStep('merging', left, mid, right, [left, mid + 1]);

            const temp = [];
            let i = left, j = mid + 1;
            const originalArray = a.map(item => ({...item}));
            
            while (i <= mid && j <= right) {
                if (originalArray[i].value <= originalArray[j].value) {
                    temp.push(originalArray[i]);
                    i++;
                } else {
                    temp.push(originalArray[j]);
                    j++;
                }
                captureStep('compare', left, mid, right, [i <= mid ? i : j - 1, j <= right ? j : i - 1]);
            }
            
            while (i <= mid) {
                temp.push(originalArray[i]);
                i++;
                captureStep('remaining', left, mid, right, [i-1]);
            }
            while (j <= right) {
                temp.push(originalArray[j]);
                j++;
                captureStep('remaining', left, mid, right, [j-1]);
            }
            
            for (let k = left; k <= right; k++) {
                a[k] = temp[k - left];
                captureStep('place', left, mid, right, [k]); 
            }
            captureStep('merged', left, mid, right, []);
        };

        const mergeSort = (left, right) => {
            if (left >= right) {
                captureStep('base', left, null, right, [left]);
                return;
            }
            
            const mid = Math.floor((left + right) / 2);
            
            captureStep('divide', left, mid, right, []);
            
            mergeSort(left, mid);
            mergeSort(mid + 1, right);
            merge(left, mid, right);
        };

        mergeSort(0, a.length - 1);
        return s;
    }, []);

    const reset = useCallback(() => {
        const newArray = generateRandomArray(ARRAY_SIZE);
        const generatedSteps = mergeSortSteps(newArray);
        
        setArr(newArray);
        setSteps(generatedSteps);
        setCurrentStep(0);
        setHighlightIndices([]);
        setScope({ left: null, right: null, mid: null });
        setPlaying(false);
    }, [mergeSortSteps]);

    const executeStep = useCallback((stepIndex) => {
        if (stepIndex < 0 || stepIndex >= steps.length) return;

        const step = steps[stepIndex];
        setArr(step.arr);
        setHighlightIndices(step.highlight);
        setScope(step.scope);
    }, [steps]);

    const stepForward = () => {
        setCurrentStep(prev => {
            const nextStep = prev + 1;
            if (nextStep < steps.length) {
                executeStep(nextStep);
                return nextStep;
            } else {
                setPlaying(false);
                return prev;
            }
        });
    };
    
    const stepBackward = () => {
        setCurrentStep(prev => {
            const nextStep = Math.max(0, prev - 1);
            executeStep(nextStep);
            return nextStep;
        });
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
    }, [playing, currentStep, steps.length, speed]);
    
    const getBarColor = (idx) => {
        if (scope.left !== null && idx >= scope.left && idx <= scope.right) {
            if (steps[currentStep] && steps[currentStep].type === 'compare' && highlightIndices.includes(idx)) {
                return "bg-red-500";
            }
            if (steps[currentStep] && steps[currentStep].type === 'place' && highlightIndices.includes(idx)) {
                return "bg-green-500";
            }
            if (steps[currentStep] && steps[currentStep].type === 'remaining' && highlightIndices.includes(idx)) {
                return "bg-orange-500";
            }
            if (idx <= scope.mid) return "bg-indigo-500";
            if (idx > scope.mid) return "bg-purple-500";
        }
        if (currentStep === steps.length - 1) return "bg-green-600";
        return "bg-gray-700";
    };
    
    const currentStatusMessage = steps[currentStep] ? steps[currentStep].type : 'Ready';
    const isFinished = currentStep === steps.length - 1 && steps.length > 0;


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white px-6 py-16">
            <div className="max-w-6xl mx-auto text-center">
                <motion.h1
                    className="text-4xl md:text-5xl font-bold mb-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    Merge Sort Visualizer 📐
                </motion.h1>
                <motion.p
                    className="text-xl text-indigo-300 mb-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <span className="font-bold">Divide and Conquer:</span> The array is split, then sorted halves are merged back together.
                </motion.p>
                
                {/* --- Controls Panel --- */}
                <div className="flex flex-wrap justify-center items-center gap-4 mb-10 p-4 bg-gray-800/50 rounded-lg shadow-xl">
                    
                    {/* Step Controls */}
                    <div className="flex gap-2 mx-4">
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
                    <div className="flex flex-col items-center w-36">
                        <label htmlFor="speed" className="text-sm text-gray-300 mb-1 flex items-center gap-1">
                            <Settings size={14}/> Delay ({speed}ms)
                        </label>
                        <input
                            type="range"
                            id="speed"
                            min={MIN_SPEED}
                            max={MAX_SPEED}
                            step="50"
                            value={speed}
                            onChange={(e) => setSpeed(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg"
                        />
                    </div>
                </div>

                {/* --- Visualization Area --- */}
                <div className="flex justify-center items-end gap-1 h-72 mx-auto max-w-4xl px-2 relative border-b-4 border-gray-700">
                    {/* Dynamic Bar Rendering */}
                    {arr.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            layout
                            className={`w-4 md:w-6 rounded-t-sm flex justify-center items-end text-[0.6rem] font-bold text-gray-900 ${getBarColor(idx)}`}
                            style={{ height: `${item.value * 2}px` }}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <span className="mb-1">{item.value}</span>
                        </motion.div>
                    ))}
                    
                    {/* Scope Indicator Line */}
                    {scope.left !== null && (
                            <div className="absolute top-0 w-full flex justify-between px-2 text-sm font-bold text-white">
                                <span className="text-red-400 absolute left-0 transform -translate-x-1/2">
                                    L:{scope.left}
                                </span>
                                {scope.mid !== null && (
                                    <span className="text-yellow-400 absolute" style={{left: `${(scope.mid + 0.5) * (100 / ARRAY_SIZE)}%`, transform: 'translateX(-50%)'}}>
                                        M:{scope.mid}
                                    </span>
                                )}
                                <span className="text-green-400 absolute right-0 transform translate-x-1/2">
                                    R:{scope.right}
                                </span>
                            </div>
                    )}
                </div>

                {/* --- Status & Footer --- */}
                <div className="mt-8 flex justify-between items-center max-w-2xl mx-auto p-4 bg-gray-800 rounded-lg">
                    <p className="text-lg font-semibold text-indigo-300">
                        Status: <span className="text-white capitalize">{currentStatusMessage}</span>
                    </p>
                    <p className="text-lg font-semibold text-indigo-300">
                        Step {currentStep} / {steps.length - 1}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MergeSortPage;