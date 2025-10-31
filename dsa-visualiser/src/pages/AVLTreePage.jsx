import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Trash2, Info, RotateCcw, Activity } from "lucide-react";

const rotateLeft = (node) => {
	const newRoot = node.right;
	node.right = newRoot.left;
	newRoot.left = node;
	node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
	newRoot.height = Math.max(getHeight(newRoot.left), getHeight(newRoot.right)) + 1;
	return newRoot;
};

const rotateRight = (node) => {
	const newRoot = node.left;
	node.left = newRoot.right;
	newRoot.right = node;
	node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
	newRoot.height = Math.max(getHeight(newRoot.left), getHeight(newRoot.right)) + 1;
	return newRoot;
};

const getHeight = (node) => (node ? node.height : 0);

const getBalance = (node) => getHeight(node.left) - getHeight(node.right);

const insertNode = (node, value, rotations = []) => {
	if (!node) return { value, left: null, right: null, height: 1 };

	if (value < node.value) {
		node.left = insertNode(node.left, value, rotations);
	} else if (value > node.value) {
		node.right = insertNode(node.right, value, rotations);
	} else {
		return node;
	}

	node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;

	const balance = getBalance(node);

	if (balance > 1 && value < node.left.value) {
		rotations.push(`Right rotation at node ${node.value}`);
		return rotateRight(node);
	}

	if (balance < -1 && value > node.right.value) {
		rotations.push(`Left rotation at node ${node.value}`);
		return rotateLeft(node);
	}

	if (balance > 1 && value > node.left.value) {
		rotations.push(`Left-Right rotation at node ${node.value}`);
		node.left = rotateLeft(node.left);
		return rotateRight(node);
	}

	if (balance < -1 && value < node.right.value) {
		rotations.push(`Right-Left rotation at node ${node.value}`);
		node.right = rotateRight(node.right);
		return rotateLeft(node);
	}

	return node;
};

const deleteNode = (node, value, rotations = []) => {
	if (!node) return node;

	if (value < node.value) {
		node.left = deleteNode(node.left, value, rotations);
	} else if (value > node.value) {
		node.right = deleteNode(node.right, value, rotations);
	} else {
		if (!node.left || !node.right) {
			node = node.left || node.right;
		} else {
			let temp = getMinValueNode(node.right);
			node.value = temp.value;
			node.right = deleteNode(node.right, temp.value, rotations);
		}
	}

	if (!node) return node;

	node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;

	const balance = getBalance(node);

	if (balance > 1 && getBalance(node.left) >= 0) {
		rotations.push(`Right rotation at node ${node.value}`);
		return rotateRight(node);
	}
	if (balance > 1 && getBalance(node.left) < 0) {
		rotations.push(`Left-Right rotation at node ${node.value}`);
		node.left = rotateLeft(node.left);
		return rotateRight(node);
	}
	if (balance < -1 && getBalance(node.right) <= 0) {
		rotations.push(`Left rotation at node ${node.value}`);
		return rotateLeft(node);
	}
	if (balance < -1 && getBalance(node.right) > 0) {
		rotations.push(`Right-Left rotation at node ${node.value}`);
		node.right = rotateRight(node.right);
		return rotateLeft(node);
	}

	return node;
};

const getMinValueNode = (node) => {
	let current = node;
	while (current.left) {
		current = current.left;
	}
	return current;
};

const AVLTreePage = () => {
	const [root, setRoot] = useState(null);
	const [value, setValue] = useState("");
	const [removeValue, setRemoveValue] = useState("");
	const [steps, setSteps] = useState([]);
	const [rotations, setRotations] = useState([]);

	const updateSteps = (action) => {
		setSteps((prev) => [...prev, action]);
	};

	const handleAdd = () => {
		if (!value.trim()) return;
		const newValue = parseInt(value);
		const currentRotations = [];
		const newRoot = insertNode(root, newValue, currentRotations);
		setRoot(newRoot);
		setRotations(prev => [...prev, ...currentRotations]);
		
		if (currentRotations.length > 0) {
			updateSteps(`Inserted ${newValue} - Rotations applied: ${currentRotations.join(', ')}`);
		} else {
			updateSteps(`Inserted ${newValue} - No rotation needed`);
		}
		setValue("");
	};

	const handleRemove = () => {
		if (!removeValue.trim()) return;
		const newValue = parseInt(removeValue);
		const currentRotations = [];
		const newRoot = deleteNode(root, newValue, currentRotations);
		setRoot(newRoot);
		setRotations(prev => [...prev, ...currentRotations]);
		
		if (currentRotations.length > 0) {
			updateSteps(`Deleted ${newValue} - Rotations applied: ${currentRotations.join(', ')}`);
		} else {
			updateSteps(`Deleted ${newValue} - No rotation needed`);
		}
		setRemoveValue("");
	};

	const reset = () => {
		setRoot(null);
		setSteps([]);
		setRotations([]);
	};

	const getTreeWidth = (node) => {
		if (node === null) return 0;
		const leftWidth = getTreeWidth(node.left);
		const rightWidth = getTreeWidth(node.right);
		return Math.max(1, leftWidth + rightWidth);
	};

	const renderTree = (node, x = 0, y = 0, spacing = 120) => {
		if (node === null) {
			return null;
		}

		const nodeSpacing = Math.max(80, spacing / 2);
		const balance = getBalance(node);
		
		let nodeColor = "#7c3aed";
		let strokeColor = "#a855f7";
		
		if (balance > 1) {
			nodeColor = "#dc2626";
			strokeColor = "#ef4444";
		} else if (balance < -1) {
			nodeColor = "#dc2626";
			strokeColor = "#ef4444";
		} else if (Math.abs(balance) === 1) {
			nodeColor = "#f59e0b";
			strokeColor = "#fbbf24";
		} else {
			nodeColor = "#059669";
			strokeColor = "#10b981";
		}

		return (
			<g key={`node-${node.value}-${x}-${y}`}>
				{/* Connection lines */}
				{node.left && (
					<line
						x1={x}
						y1={y}
						x2={x - nodeSpacing}
						y2={y + 100}
						stroke="#a855f7"
						strokeWidth="2"
					/>
				)}
				{node.right && (
					<line
						x1={x}
						y1={y}
						x2={x + nodeSpacing}
						y2={y + 80}
						stroke="#a855f7"
						strokeWidth="2"
					/>
				)}
				
				{/* Current node */}
				<motion.g
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.5 }}
					whileHover={{ scale: 1.1 }}
				>
					<circle
						cx={x}
						cy={y}
						r="30"
						fill={nodeColor}
						stroke={strokeColor}
						strokeWidth="3"
					/>
					<text
						x={x}
						y={y - 5}
						textAnchor="middle"
						dy="0.35em"
						fill="white"
						fontSize="14"
						fontWeight="bold"
					>
						{node.value}
					</text>
					{/* Balance factor display */}
					<text
						x={x}
						y={y + 8}
						textAnchor="middle"
						dy="0.35em"
						fill="white"
						fontSize="10"
					>
						BF:{balance}
					</text>
					{/* Height display */}
					<text
						x={x + 35}
						y={y - 10}
						textAnchor="middle"
						dy="0.35em"
						fill="#a855f7"
						fontSize="10"
					>
						h:{node.height}
					</text>
				</motion.g>

				{/* Recursive rendering for children */}
				{node.left && renderTree(node.left, x - nodeSpacing, y + 80, nodeSpacing)}
				{node.right && renderTree(node.right, x + nodeSpacing, y + 80, nodeSpacing)}
			</g>
		);
	};

	const countNodes = (node) => {
		if (node === null) return 0;
		return countNodes(node.left) + countNodes(node.right) + 1;
	};

	const getTreeHeight = (node) => {
		if (node === null) return 0;
		return Math.max(getTreeHeight(node.left), getTreeHeight(node.right)) + 1;
	};

	const isBalanced = (node) => {
		if (node === null) return true;
		const balance = getBalance(node);
		return Math.abs(balance) <= 1 && isBalanced(node.left) && isBalanced(node.right);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white px-6 py-16">
			<div className="max-w-6xl mx-auto text-center">
				<motion.h1
					className="text-4xl md:text-5xl font-bold mb-6"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
				>
					AVL Tree Visualization
				</motion.h1>
				<motion.p
					className="text-lg text-purple-300 mb-12"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.6 }}
				>
					<span className="font-bold">Self-balancing</span> binary search tree with automatic rotations. Watch the tree maintain perfect balance!
				</motion.p>

				{/* Add Node */}
				<div className="flex flex-wrap gap-4 justify-center mb-6">
					<input
						type="number"
						placeholder="Value to Add"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						className="bg-gray-800 text-white px-4 py-2 rounded-md border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
					/>
					<button
						onClick={handleAdd}
						className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-all"
					>
						<PlusCircle size={18} /> Add Node
					</button>
				</div>

				{/* Remove Node */}
				<div className="flex flex-wrap gap-4 justify-center mb-8">
					<input
						type="number"
						placeholder="Value to Remove"
						value={removeValue}
						onChange={(e) => setRemoveValue(e.target.value)}
						className="bg-gray-800 text-white px-4 py-2 rounded-md border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
					/>
					<button
						onClick={handleRemove}
						className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-all"
						disabled={root === null}
					>
						<Trash2 size={18} /> Remove Node
					</button>
					<button
						onClick={reset}
						className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-all"
					>
						<RotateCcw size={18} /> Reset Tree
					</button>
				</div>

				{/* Color Legend */}
				<div className="flex flex-wrap gap-4 justify-center mb-8 text-sm">
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded-full bg-green-600"></div>
						<span>Balanced (BF: 0)</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded-full bg-yellow-500"></div>
						<span>Slightly Unbalanced (BF: ±1)</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded-full bg-red-600"></div>
						<span>Needs Rotation (BF: &gt;1 or &lt;-1)</span>
					</div>
				</div>

				{/* AVL Tree Visualization with SVG */}
				<motion.div
					className="bg-purple-800/20 p-6 rounded-xl shadow-lg border border-purple-700/30 backdrop-blur-md mb-8"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
				>
					<h3 className="text-xl font-semibold text-purple-300 mb-4">AVL Tree Structure</h3>
					<p className="text-sm text-gray-300 mb-4">BF = Balance Factor | h = Height</p>
					{root === null ? (
						<p className="text-sm text-gray-300 py-8">The tree is empty. Add some nodes to get started!</p>
					) : (
						<div className="overflow-x-auto">
							<svg 
								width="900" 
								height={Math.max(200, getTreeHeight(root) * 100)} 
								className="mx-auto"
								viewBox="-450 -20 900 500"
							>
								{renderTree(root, 0, 30, 180)}
							</svg>
						</div>
					)}
				</motion.div>

				{/* Stats Section */}
				<div className="grid lg:grid-cols-3 gap-6 mb-8">
					<motion.div
						className="bg-gray-800 p-5 rounded-xl border border-purple-700/40"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						<h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
							<Activity size={18} /> Tree Stats
						</h4>
						<div className="space-y-2 text-left">
							<p className="text-white">Height: <span className="text-purple-300">{getTreeHeight(root)}</span></p>
							<p className="text-white">Total Nodes: <span className="text-purple-300">{countNodes(root)}</span></p>
							<p className="text-white">Is Balanced: <span className={isBalanced(root) ? "text-green-400" : "text-red-400"}>{isBalanced(root) ? "Yes" : "No"}</span></p>
							<p className="text-white">Total Rotations: <span className="text-yellow-400">{rotations.length}</span></p>
						</div>
					</motion.div>

					<motion.div
						className="bg-gray-800 p-5 rounded-xl border border-purple-700/40"
						initial={{ opacity: 0, x: 0 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
							<RotateCcw size={18} /> Recent Rotations
						</h4>
						<div className="max-h-32 overflow-y-auto">
							<ul className="space-y-1 text-left text-sm">
								{rotations.slice(-4).map((rotation, index) => (
									<li key={index} className="text-yellow-300 border-l-2 border-yellow-500 pl-3">
										{rotation}
									</li>
								))}
								{rotations.length === 0 && (
									<li className="text-gray-400">No rotations performed yet</li>
								)}
							</ul>
						</div>
					</motion.div>

					<motion.div
						className="bg-gray-800 p-5 rounded-xl border border-purple-700/40"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
					>
						<h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
							<Info size={18} /> Recent Actions
						</h4>
						<div className="max-h-32 overflow-y-auto">
							<ul className="space-y-1 text-left text-sm">
								{steps.slice(-4).map((step, index) => (
									<li key={index} className="text-gray-300 border-l-2 border-purple-500 pl-3">
										{step}
									</li>
								))}
								{steps.length === 0 && (
									<li className="text-gray-400">No actions performed yet</li>
								)}
							</ul>
						</div>
					</motion.div>
				</div>

				{/* AVL Properties Info */}
				<motion.div
					className="bg-gray-800/50 p-6 rounded-xl border border-purple-700/40 text-left"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
				>
					<h4 className="text-lg font-semibold text-purple-400 mb-3 text-center">AVL Tree Properties</h4>
					<div className="grid md:grid-cols-2 gap-4 text-sm">
						<div>
							<h5 className="font-semibold text-white mb-2">Balance Factor (BF)</h5>
							<p className="text-gray-300">BF = Height(Left Subtree) - Height(Right Subtree)</p>
							<p className="text-gray-300">Must be -1, 0, or 1 for all nodes</p>
						</div>
						<div>
							<h5 className="font-semibold text-white mb-2">Rotation Types</h5>
							<p className="text-gray-300">• Left Rotation: Right-heavy case</p>
							<p className="text-gray-300">• Right Rotation: Left-heavy case</p>
							<p className="text-gray-300">• Left-Right & Right-Left: Double rotations</p>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default AVLTreePage;