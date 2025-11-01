import { motion } from 'framer-motion';
import { Link, ArrowRight, List, Layers, ListOrdered, Hash, TreePine, Link2, Swords, Component, Code } from 'lucide-react';

// --- Data Definition: Separated into two distinct groups ---

const DATA_STRUCTURES = [
  {
    icon: <List className="w-5 h-5" />,
    title: "Linked List",
    description: "Nodes connected sequentially. Excellent for insertions and deletions.",
    difficulty: "Easy",
    operations: ["Insert", "Delete", "Traverse", "Search"],
    path: "/linked-list",
    color: "text-cyan-400",
    bg: "bg-cyan-800/20"
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: "Stack",
    description: "Last In, First Out (LIFO) collection. Think of a stack of plates.",
    difficulty: "Easy",
    operations: ["Push", "Pop", "Peek", "isEmpty"],
    path: "/stack",
    color: "text-purple-400",
    bg: "bg-purple-800/20"
  },
  {
    icon: <ListOrdered className="w-5 h-5" />,
    title: "Queue",
    description: "First In, First Out (FIFO) collection. Models waiting lines.",
    difficulty: "Easy",
    operations: ["Enqueue", "Dequeue", "Front", "isEmpty"],
    path: "/queue",
    color: "text-amber-400",
    bg: "bg-amber-800/20"
  },
  {
    icon: <Hash className="w-5 h-5" />,
    title: "Hash Map",
    description: "Key-value pairs for near-instant $O(1)$ average time lookups.",
    difficulty: "Medium",
    operations: ["Put", "Get", "Remove", "ContainsKey"],
    path: "/hashmap",
    color: "text-emerald-400",
    bg: "bg-emerald-800/20"
  },
  {
    icon: <TreePine className="w-5 h-5" />,
    title: "Binary Tree",
    description: "Hierarchical structure where each node has at most two children.",
    difficulty: "Medium",
    operations: ["Insert", "Search", "Traverse (In/Pre/Post)"],
    path: "/binary-tree",
    color: "text-green-400",
    bg: "bg-green-800/20"
  },
  {
    icon: <Link2 className="w-5 h-5" />,
    title: "AVL Tree",
    description: "A self-balancing Binary Search Tree. Guarantees fast $O(\log n)$ performance.",
    difficulty: "Hard",
    operations: ["Insert", "Delete", "Rotations", "Balance Factor"],
    path: "/avl-tree",
    color: "text-red-400",
    bg: "bg-red-800/20"
  },
  {
    icon: <Component className="w-5 h-5" />,
    title: "Graph",
    description: "Nodes and edges representing connections. Great for networks/maps.",
    difficulty: "Medium",
    operations: ["Add Node/Edge", "Adjacency List", "Traverse (BFS/DFS)"],
    path: "/graph",
    color: "text-indigo-400",
    bg: "bg-indigo-800/20"
  }
];

const ALGORITHMS = [
    {
      icon: <Swords className="w-5 h-5" />,
      title: "Bubble Sort",
      description: "Simple sorting: repeatedly swapping adjacent elements that are out of order.",
      difficulty: "Easy",
      operations: ["Swap", "Compare", "Passes"],
      path: "/bubble-sort",
      color: "text-pink-400",
      bg: "bg-pink-800/20"
    },
    {
      icon: <Swords className="w-5 h-5" />,
      title: "Merge Sort",
      description: "Efficient $O(n \log n)$ sorting using a divide-and-conquer strategy.",
      difficulty: "Medium",
      operations: ["Divide", "Merge", "Recursion"],
      path: "/merge-sort",
      color: "text-orange-400",
      bg: "bg-orange-800/20"
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "Binary Search",
      description: "Fastest way to find elements in a sorted array by halving the search space.",
      difficulty: "Easy",
      operations: ["Low/High Pointers", "Midpoint", "Compare"],
      path: "/binary-search",
      color: "text-blue-400",
      bg: "bg-blue-800/20"
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "N Queens",
      description: "Find valid placements for N queens on an $N \times N$ board using backtracking.",
      difficulty: "Hard",
      operations: ["Backtrack", "Check Safety", "Place Queen"],
      path: "/n-queens",
      color: "text-red-400",
      bg: "bg-red-800/20"
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "Tower of Hanoi",
      description: "A classic recursive puzzle. Understand the power of recursive calls.",
      difficulty: "Medium",
      operations: ["Move Disk", "Recursion", "Minimum Moves ($2^n - 1$)"],
      path: "/tower-of-hanoi",
      color: "text-yellow-400",
      bg: "bg-yellow-800/20"
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "Prim's Algorithm",
      description: "Greedy algorithm to find the Minimum Spanning Tree (MST) by growing a single tree.",
      difficulty: "Hard",
      operations: ["Priority Queue", "Visited Set", "MST Cost"],
      path: "/prims-algo",
      color: "text-teal-400",
      bg: "bg-teal-800/20"
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "Kruskal's Algorithm",
      description: "Greedy algorithm for MST using Disjoint Set Union to check for cycles.",
      difficulty: "Hard",
      operations: ["Sort Edges", "Find/Union", "Cycle Check"],
      path: "/kruskals-sort",
      color: "text-fuchsia-400",
      bg: "bg-fuchsia-800/20"
    }
];

// --- Card Component (Extracted for reuse) ---

const StructureCard = ({ structure, index }) => (
    <motion.div
        key={structure.title}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true, margin: "-50px" }}
        whileHover={{ y: -5 }}
        className="group"
    >
        <Link to={structure.path} className="h-full block">
            <div className={`h-full p-[1px] rounded-xl ${structure.bg} overflow-hidden border border-gray-700`}>
                <div className="h-full bg-gray-900 rounded-xl backdrop-blur-sm p-5 flex flex-col transition-all duration-300 group-hover:bg-gray-800">
                    <div className={`mb-4 p-2.5 rounded-lg ${structure.bg} w-fit text-white`}>
                        {structure.icon}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">{structure.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                            structure.difficulty === "Easy" 
                                ? "bg-green-800/40 text-green-300" 
                                : structure.difficulty === "Medium"
                                ? "bg-yellow-800/40 text-yellow-300"
                                : "bg-red-800/40 text-red-300"
                        }`}>
                            {structure.difficulty}
                        </span>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-4 flex-grow">{structure.description}</p>
                    
                    <div className="mb-5">
                        <div className="text-xs text-gray-500 mb-2">KEY OPERATIONS</div>
                        <div className="flex flex-wrap gap-1.5">
                            {structure.operations.slice(0, 4).map(op => (
                                <span key={op} className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-300">
                                    {op}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mt-auto pt-3 border-t border-gray-700">
                        <span
                            className="inline-flex items-center gap-1 text-sm font-medium text-cyan-300 group-hover:text-cyan-200 transition-colors"
                        >
                            <span>Explore Visualization</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    </motion.div>
);


// --- Main Component ---

const DataStructuresSection = () => {
    
    // Combine data structures and algorithms into a single array for easier mapping
    const allItems = [...DATA_STRUCTURES, ...ALGORITHMS];

    return (
        <section className="py-16 px-4 bg-gradient-to-b from-gray-950 to-gray-900">
            <div className="max-w-7xl mx-auto">
                
                {/* --- DATA STRUCTURES SECTION --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                        Data Structures 💾
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        These are the <b>building blocks</b> of programming. Master how data is organized to write powerful, efficient code.
                    </p>
                </motion.div>

                <div className="h-0.5 bg-gray-800 max-w-4xl mx-auto my-16" />

                {/* --- ALGORITHMS SECTION --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                        Algorithms ⚔️
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        These are the <b>recipes</b> to solve problems. See the step-by-step logic behind sorting, searching, and complex puzzles.
                    </p>
                </motion.div>                
            </div>
        </section>
    );
};

export default DataStructuresSection;