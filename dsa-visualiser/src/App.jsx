import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import DataStuctDesc from './pages/DataStuctDesc'
import QueuePage from './pages/QueuePage'
import StackPage from './pages/StackPage'
import LinkedListPage from './pages/LinkedListPage'
import HashMapPage from './pages/HashMapPage'
import TowerOfHanoiPage from './pages/TowerOfHanoiPage'
import NQueensPage from './pages/NQueensPage'
import AppContextProvider from './context/AppContext'
import BubbleSortPage from './pages/BubbleSortPage'
import BinarySearchPage from './pages/BinarySearchPage'
import InsertionSortPage from './pages/InsertionSort'
import MergeSortPage from './pages/MergeSort'
import PrimVisualizerPage from './pages/PrimVisualizerPage'
import KruskalVisualizerPage from './pages/KruskalVisualizerPage'
import GraphPage from './pages/GraphPage'
import AVLTreePage from './pages/AVLTreePage'
import BinaryTreePage from './pages/BinaryTreePage'
import Playground from './pages/Playground'
import BenchmarkLab from './pages/BenchmarkLab'
import PathfindingLab from './pages/PathfindingLab'
import AlgorithmRecommender from './pages/AlgorithmRecommender'
import Puzzles from './pages/Puzzles'
import StoryMode from './pages/StoryMode'
import RaceDay from './pages/RaceDay'
import WhatIfLab from './pages/WhatIfLab'
import DrillCoach from './pages/DrillCoach'
import PersonalityCards from './pages/PersonalityCards'
import MisconceptionFixer from './pages/MisconceptionFixer'
import Museum from './pages/Museum'
import Course from './pages/Course'
import Gallery from './pages/Gallery'
import ProofMode from './pages/ProofMode'
import RecurrenceTree from './pages/RecurrenceTree'
import Evolver from './pages/Evolver'
import CacheSim from './pages/CacheSim'
import Bracket from './pages/Bracket'
import DSLSandbox from './pages/DSLSandbox'
import Heatmap from './pages/Heatmap'
import DebugBug from './pages/DebugBug'
import StoryBuilder from './pages/StoryBuilder'

function App() {
  return (
    <AppContextProvider>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/data-structures" element={<DataStuctDesc/>}/>
        <Route path="/queue" element={<QueuePage/>}/>
        <Route path="/stack" element={<StackPage/>}/>
        <Route path="/graph" element={<GraphPage/>}/>
        <Route path="/avl-tree" element={<AVLTreePage/>}/>
        <Route path="/binary-tree" element={<BinaryTreePage/>}/>
        <Route path="/linked-list" element={<LinkedListPage/>}/>
        <Route path="/hashmap" element={<HashMapPage/>}/>
        <Route path="/bubble-sort" element={<BubbleSortPage/>}/>
        <Route path="/insertion-sort" element={<InsertionSortPage/>}/>
        <Route path="/merge-sort" element={<MergeSortPage/>}/>
        <Route path="/binary-search" element={<BinarySearchPage/>}/>
        <Route path="/tower-of-hanoi" element={<TowerOfHanoiPage/>}/>
        <Route path="/prims-algo" element={<PrimVisualizerPage/>}/>
        <Route path="/kruskals-sort" element={<KruskalVisualizerPage/>}/>
        <Route path="/n-queens" element={<NQueensPage/>}/>
        <Route path="/playground" element={<Playground/>}/>
        <Route path="/benchmarks" element={<BenchmarkLab/>}/>
        <Route path="/pathfinding-lab" element={<PathfindingLab/>}/>
        <Route path="/recommend" element={<AlgorithmRecommender/>}/>
        <Route path="/puzzles" element={<Puzzles/>}/>
        <Route path="/story" element={<StoryMode/>}/>
        <Route path="/race" element={<RaceDay/>}/>
        <Route path="/what-if" element={<WhatIfLab/>}/>
        <Route path="/drills" element={<DrillCoach/>}/>
        <Route path="/cards" element={<PersonalityCards/>}/>
        <Route path="/fixer" element={<MisconceptionFixer/>}/>
        <Route path="/museum" element={<Museum/>}/>
        <Route path="/course" element={<Course/>}/>
        <Route path="/gallery" element={<Gallery/>}/>
        <Route path="/proof" element={<ProofMode/>}/>
        <Route path="/recurrence" element={<RecurrenceTree/>}/>
        <Route path="/evolver" element={<Evolver/>}/>
        <Route path="/cache" element={<CacheSim/>}/>
        <Route path="/bracket" element={<Bracket/>}/>
        <Route path="/dsl" element={<DSLSandbox/>}/>
        <Route path="/heatmap" element={<Heatmap/>}/>
        <Route path="/debug-bug" element={<DebugBug/>}/>
        <Route path="/story-builder" element={<StoryBuilder/>}/>
      </Routes>
      <Footer/>
    </AppContextProvider>
  )
}

export default App
