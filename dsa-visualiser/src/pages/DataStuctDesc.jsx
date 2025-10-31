import React, { useState } from 'react';
import { motion } from "framer-motion";

// Helper function to convert Markdown table string to a renderable JSX table structure
const renderMarkdownTable = (markdown) => {
    if (!markdown) return null;
    
    const lines = markdown.trim().split('\n');
    if (lines.length < 2) return null;

    // Get the header (first line) and filter out the separator line (second line)
    const headerCells = lines[0].split('|').map(s => s.trim()).filter(s => s);
    const bodyLines = lines.slice(2);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/80">
                    <tr>
                        {headerCells.map((cell, index) => (
                            <th 
                                key={index} 
                                scope="col" 
                                className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider"
                            >
                                {cell}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {bodyLines.map((line, rowIndex) => {
                        const bodyCells = line.split('|').map(s => s.trim()).filter(s => s);
                        return (
                            <tr key={rowIndex} className="hover:bg-gray-700/50">
                                {bodyCells.map((cell, cellIndex) => (
                                    <td 
                                        key={cellIndex} 
                                        className={`px-6 py-4 whitespace-nowrap text-sm font-mono ${
                                            cell.includes('O(') ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

function DataStructDesc() {
    const [selectedTab, setSelectedTab] = useState('data-structures'); 

    const dataStructures = [
        {
            title: 'Queue ⏳',
            description:
                'A Queue is a linear data structure that follows the **First In First Out (FIFO)** principle, like a line of people waiting. It is used in scheduling and resource management scenarios.',
            complexity: `| Operation | Average Time | Worst Time |
|---|---|---|
| Enqueue | O(1) | O(1) |
| Dequeue | O(1) | O(1) |
| Peek    | O(1) | O(1) |`,
            adt: `ADT Queue {
  Queue create();
  void enqueue(Queue q, Element e);
  Element dequeue(Queue q);
  bool isEmpty(Queue q);
  Element peek(Queue q);
}`,
            link: '/queue',
        },
        {
            title: 'Stack 🥞',
            description:
                'A Stack is a linear data structure that follows the **Last In First Out (LIFO)** principle, like a pile of plates. It is commonly used in recursion, function call management, and expression evaluation.',
            complexity: `| Operation | Average Time | Worst Time |
|---|---|---|
| Push | O(1) | O(1) |
| Pop  | O(1) | O(1) |
| Peek | O(1) | O(1) |`,
            adt: `ADT Stack {
  Stack create();
  void push(Stack s, Element e);
  Element pop(Stack s);
  bool isEmpty(Stack s);
  Element peek(Stack s);
}`,
            link: '/stack',
        },
        {
            title: 'Linked List ⛓️',
            description:
                'A Linked List is a linear data structure where elements are stored in **nodes**, and each node contains a value and a **pointer** to the next node. It allows efficient insertions and deletions without shifting elements.',
            complexity: `| Operation | Average Time | Worst Time |
|---|---|---|
| Insert   | O(1) (Head) | O(N) (Tail/Index) |
| Delete   | O(1) (Head) | O(N) |
| Search   | O(N) | O(N) |`,
            adt: `ADT LinkedList {
  LinkedList create();
  void insert(LinkedList l, Element e, int position);
  void delete(LinkedList l, int position);
  Element get(LinkedList l, int position);
  bool isEmpty(LinkedList l);
}`,
            link: '/linked-list',
        },
        {
            title: 'Hash Map 🔑',
            description:
                'A Hash Map is a key-value data structure that uses a **hash function** to map keys to an index (bucket) in an array. This provides near-instantaneous average time complexity for operations.',
            complexity: `| Operation | Average Time | Worst Time |
|---|---|---|
| Put/Insert | O(1) | O(N) |
| Get/Search | O(1) | O(N) |
| Remove     | O(1) | O(N) |`,
            adt: `ADT HashMap {
  HashMap create();
  void put(HashMap h, Key k, Value v);
  Value get(HashMap h, Key k);
  void remove(HashMap h, Key k);
  bool containsKey(HashMap h, Key k);
}`,
            link: '/hash-map',
        },
        {
            title: 'Binary Tree 🌲',
            description:
                'A Binary Search Tree (BST) is a hierarchical structure where the left child is less than the parent, and the right child is greater. This property allows for efficient searching.',
            complexity: `| Operation | Average Time | Worst Time |
|---|---|---|
| Insert   | O(log N) | O(N) |
| Search   | O(log N) | O(N) |
| Delete   | O(log N) | O(N) |`,
            adt: `ADT BinaryTree {
  BinaryTree create();
  void insert(BinaryTree t, Element e);
  Element search(BinaryTree t, Element e);
  void delete(BinaryTree t, Element e);
  bool isEmpty(BinaryTree t);
}`,
            link: '/binary-tree',
        },
        {
            title: 'AVL Tree ⚖️',
            description:
                'An AVL Tree is a **self-balancing** binary search tree. It guarantees that the height difference between the left and right subtrees (the **Balance Factor**) is at most one, ensuring $O(\\log N)$ performance.',
            complexity: `| Operation | Average Time | Worst Time |
|---|---|---|
| Insert   | O(log N) | O(log N) |
| Delete   | O(log N) | O(log N) |
| Search   | O(log N) | O(log N) |`,
            adt: `ADT AVLTree {
  AVLTree create();
  void insert(AVLTree t, Element e);
  void delete(AVLTree t, Element e);
  Element search(AVLTree t, Element e);
  bool isBalanced(AVLTree t);
}`,
            link: '/avl-tree',
        },
        {
            title: 'Graph 🌐',
            description:
                'A Graph is a collection of **nodes (vertices)** and **edges (connections)**. It is fundamental for modeling real-world relationships, like networks, social structures, and maps.',
            complexity: `| Operation | Adjacency List | Adjacency Matrix |
|---|---|---|
| Add Vertex | O(1) | O(V^2) |
| Add Edge   | O(1) | O(1) |
| Check Edge | O(deg(V)) | O(1) |`,
            adt: `ADT Graph {
  Graph create();
  void addVertex(Graph g, Vertex v);
  void addEdge(Graph g, Vertex v1, Vertex v2);
  bool hasEdge(Graph g, Vertex v1, Vertex v2);
}`,
            link: '/graph',
        },
    ];

    const algorithms = [
        {
            title: 'Binary Search 🔪',
            description:
                'Binary Search is an **efficient search algorithm** for finding an item from a **sorted list**. It works by repeatedly dividing the search interval in half. Its complexity is logarithmic.',
            complexity: `Worst-Case Time Complexity: O(log N)`,
            adt: `Algorithm BinarySearch {
  low = 0, high = n - 1
  while low <= high
    mid = (low + high) / 2
    if A[mid] == target
      return mid
    else if A[mid] < target
      low = mid + 1
    else
      high = mid - 1
  return -1
}`,
            link: '/binary-search',
        },
        {
            title: 'Insertion Sort 🚶',
            description:
                'Insertion Sort builds the final sorted array one item at a time. It iterates through the input elements and consumes one input element in each iteration to insert it into the correct position in the sorted part.',
            complexity: `Worst-Case Time Complexity: O(N^2)`,
            adt: `Algorithm InsertionSort {
  for i = 1 to n - 1
    key = A[i]
    j = i - 1
    while j >= 0 and A[j] > key
      A[j + 1] = A[j]
      j = j - 1
    A[j + 1] = key
}`,
            link: '/insertion-sort',
        },
        {
            title: 'Selection Sort 💪',
            description:
                'Selection Sort divides the list into a sorted part and an unsorted part. It repeatedly finds the **minimum element** from the unsorted part and swaps it with the leftmost unsorted element.',
            complexity: `Worst-Case Time Complexity: O(N^2)`,
            adt: `Algorithm SelectionSort {
  for i = 0 to n - 2
    min_idx = i
    for j = i + 1 to n - 1
      if A[j] < A[min_idx]
        min_idx = j
    swap A[min_idx] and A[i]
}`,
            link: '/selection-sort',
        },
        {
            title: 'Bubble Sort 💨',
            description:
                'Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares **adjacent elements**, and swaps them if they are in the wrong order. Larger elements "bubble up" to the end.',
            complexity: `Worst-Case Time Complexity: O(N^2)`,
            adt: `Algorithm BubbleSort {
  for i = 0 to n - 1
    for j = 0 to n - i - 1
      if A[j] > A[j + 1]
        swap A[j] and A[j + 1]
}`,
            link: '/bubble-sort',
        },
        
        // --- Graph Algorithms ---
        {
            title: 'DFS (Depth-First Search) ⬇️',
            description:
                'DFS is an algorithm for traversing or searching graph/tree structures. It explores as **far as possible** along each branch before backtracking. Typically implemented with a Stack (implicitly via recursion or explicitly).',
            complexity: `Worst-Case Time Complexity: O(V + E)`,
            adt: `Algorithm DFS(graph, node) {
  visited = set()
  function visit(node) {
    if node not in visited {
      visited.add(node)
      for neighbor in graph[node] {
        visit(neighbor)
      }
    }
  }
  visit(node)
}`,
            link: '/dfs',
        },
        {
            title: 'BFS (Breadth-First Search) ↔️',
            description:
                'BFS is an algorithm for traversing graph/tree structures. It explores the neighbor nodes **level by level**. It is guaranteed to find the shortest path in an unweighted graph. Typically implemented with a Queue.',
            complexity: `Worst-Case Time Complexity: O(V + E)`,
            adt: `Algorithm BFS(graph, start) {
  queue = [start]
  visited = set()
  while queue is not empty {
    node = queue.pop(0)
    if node not in visited {
      visited.add(node)
      for neighbor in graph[node] {
        queue.append(neighbor)
      }
    }
  }
}`,
            link: '/bfs',
        },
        // --- MST Algorithms ---
        {
            title: 'Dijkstra\'s Algorithm 🛣️',
            description:
                'Dijkstra\'s Algorithm is a greedy algorithm used to find the **shortest path** between nodes in a graph, particularly useful for graphs with **non-negative** edge weights.',
            complexity: `Worst-Case Time Complexity: O(E log V) (with Fibonacci Heap) or O(E + V log V) (with Binary Heap)`,
            adt: `Algorithm Dijkstra(graph, start) {
  dist = {start: 0}
  priority_queue = {(0, start)}
  while priority_queue is not empty
    (d, u) = extract_min(priority_queue)
    for neighbor v, weight w in graph[u]
      if d + w < dist[v]
        dist[v] = d + w
        priority_queue.update((dist[v], v))
}`,
            link: '/dijkstras',
        },
        {
            title: 'Prim\'s Algorithm 🪢',
            description:
                'Prim\'s Algorithm is a greedy algorithm that finds the **Minimum Spanning Tree (MST)** for a weighted undirected graph by starting from an arbitrary node and growing the tree edge by edge.',
            complexity: `Worst-Case Time Complexity: O(E log V) or O(E + V log V)`,
            adt: `Algorithm Prims(graph) {
  start = any node
  mst = set()
  while not all nodes in mst {
    add the smallest edge that connects a node in mst to a node outside mst
  }
}`,
            link: '/prims',
        },
        {
            title: 'Kruskal\'s Algorithm ✂️',
            description:
                'Kruskal\'s Algorithm is a greedy algorithm for finding the **Minimum Spanning Tree (MST)** of a graph by sorting all edges by weight and adding them only if they do not form a cycle (using a Disjoint Set structure).',
            complexity: `Worst-Case Time Complexity: O(E log E)`,
            adt: `Algorithm Kruskal(graph) {
  sort edges by weight
  for each edge in sorted edges {
    if the edge connects two disjoint sets {
      add edge to mst
    }
  }
}`,
            link: '/kruskals',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-8 lg:px-32">
            <h1 className="text-4xl font-extrabold text-center text-white mb-12 underline underline-offset-4">
                Data Structures & Algorithms Overview
            </h1>

            {/* Navigation Tabs */}
            <div className="flex justify-center mb-12">
                <button
                    className={`px-6 py-2 rounded-t-lg font-semibold transition-colors duration-200 ${
                        selectedTab === 'data-structures' ? 'bg-cyan-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => setSelectedTab('data-structures')}
                >
                    Data Structures
                </button>
                <button
                    className={`px-6 py-2 rounded-t-lg font-semibold transition-colors duration-200 ${
                        selectedTab === 'algorithms' ? 'bg-cyan-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => setSelectedTab('algorithms')}
                >
                    Algorithms
                </button>
            </div>

            {/* Content based on selected tab */}
            <div className="flex flex-col gap-12">
                {selectedTab === 'data-structures' &&
                    dataStructures.map((ds) => (
                        <motion.div
                            key={ds.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-gray-800 border border-cyan-700/50 rounded-xl p-8 w-full shadow-2xl hover:shadow-cyan-900/50 transition-shadow"
                        >
                            <h2 className="text-3xl font-bold text-cyan-300 mb-4">{ds.title}</h2>
                            <p className="text-gray-300 mb-6">{ds.description}</p>
                            
                            {/* Complexity Table */}
                            <h3 className="text-xl font-semibold text-gray-400 mb-2 mt-4">Time Complexity</h3>
                            <div className="p-4 bg-gray-900/50 rounded-lg overflow-x-auto text-sm">
                                {renderMarkdownTable(ds.complexity)}
                            </div>

                            {/* ADT Code Block */}
                            <h3 className="text-xl font-semibold text-gray-400 mb-2 mt-6">Abstract Data Type (ADT)</h3>
                            <div className="mt-4 bg-gray-900/70 rounded-xl overflow-hidden border border-blue-700/50 shadow-xl">
                                <div className="p-4 bg-gray-800/50 flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="p-6 font-mono text-blue-200 whitespace-pre-wrap text-sm">
                                    {ds.adt}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                {selectedTab === 'algorithms' &&
                    algorithms.map((algo) => (
                        <motion.div
                            key={algo.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-gray-800 border border-cyan-700/50 rounded-xl p-8 w-full shadow-2xl hover:shadow-cyan-900/50 transition-shadow"
                        >
                            <h2 className="text-3xl font-bold text-cyan-300 mb-4">{algo.title}</h2>
                            <p className="text-gray-300 mb-6">{algo.description}</p>
                            
                            {/* Complexity */}
                            <h3 className="text-xl font-semibold text-gray-400 mb-2 mt-4">Time Complexity</h3>
                            <div className="p-4 bg-gray-900/50 rounded-lg text-sm">
                                <p className="text-yellow-400 font-mono whitespace-pre-wrap">{algo.complexity}</p>
                            </div>

                            {/* ADT Code Block */}
                            <h3 className="text-xl font-semibold text-gray-400 mb-2 mt-6">Abstract Algorithm</h3>
                            <div className="mt-4 bg-gray-900/70 rounded-xl overflow-hidden border border-blue-700/50 shadow-xl">
                                <div className="p-4 bg-gray-800/50 flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="p-6 font-mono text-blue-200 whitespace-pre-wrap text-sm">
                                    {algo.adt}
                                </div>
                            </div>
                        </motion.div>
                    ))}
            </div>
        </div>
    );
}

export default DataStructDesc;