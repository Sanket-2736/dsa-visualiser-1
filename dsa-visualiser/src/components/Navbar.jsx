import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileDrawer from './ProfileDrawer';
import { 
  Home, 
  LayoutList, 
  ListTree, 
  TowerControl, 
  Menu,
  X,
  ChevronDown // Use a distinct icon for the dropdown arrow
} from 'lucide-react';

const Navbar = () => {
  const { pathname } = useLocation();
  const { setDataStructure, explainLevel, setExplainLevel } = useContext(AppContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Refactored state: tracks the path of the currently open dropdown (null if none)
  const [openDropdownPath, setOpenDropdownPath] = useState(null); 
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="w-5 h-5" /> },
    {
      name: 'Data Structures',
      path: '/data-structures',
      icon: <ListTree className="w-5 h-5" />,
      children: [
        { name: 'Queue', path: '/queue' },
        { name: 'Stack', path: '/stack' },
        { name: 'Linked List', path: '/linked-list' },
        { name: 'Hash Map', path: '/hashmap' },
        { name: 'Binary Tree', path: '/binary-tree' },
        { name: 'AVL Tree', path: '/avl-tree' },
        { name: 'Graph', path: '/graph' },
      ]
    },
    {
      name: 'Algorithms',
      path: '/algorithms',
      icon: <TowerControl className="w-5 h-5" />,
      children: [
        { name: 'Tower of Hanoi', path: '/tower-of-hanoi' },
        { name: 'N-Queens', path: '/n-queens' },
        { name: 'Bubble Sort', path: '/bubble-sort' },
        { name: 'Insertion Sort', path: '/insertion-sort' },
        { name: 'Merge Sort', path: '/merge-sort' },
        { name: "Prim's Algorithm", path: '/prims-algo' },
        { name: "Kruskal's Algorithm", path: '/kruskals-sort' },
        { name: 'Binary Search', path: '/binary-search' }
      ]
    },
    {
      name: 'Explore',
      path: '/explore',
      icon: <LayoutList className="w-5 h-5" />,
      children: [
        { name: 'Recommender', path: '/recommend' },
        { name: 'Puzzles', path: '/puzzles' },
        { name: 'Story Mode', path: '/story' },
        { name: 'Race Day', path: '/race' },
        { name: 'What‑If Lab', path: '/what-if' },
        { name: 'Drill Coach', path: '/drills' },
        { name: 'Personality Cards', path: '/cards' },
        { name: 'Misconception Fixer', path: '/fixer' },
        { name: 'Museum', path: '/museum' },
      ]
    },
    {
      name: 'Labs',
      path: '/labs',
      icon: <LayoutList className="w-5 h-5" />,
      children: [
        { name: 'Pathfinding Lab', path: '/pathfinding-lab' },
        { name: 'Benchmark Lab', path: '/benchmarks' },
        { name: 'Playground (OJ)', path: '/playground' },
      ]
    }
  ];
  

  const isActive = (path) => pathname === path;
  
  const toggleDropdown = (path) => {
    setOpenDropdownPath(openDropdownPath === path ? null : path);
  };
  
  const handleMobileLinkClick = (childName, isParent) => {
    if (!isParent) {
      scrollTo(0, 0);
      setDataStructure(childName);
      setOpenDropdownPath(null);
      setMobileMenuOpen(false);
    }
  };


  const mobileMenuVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        staggerChildren: 0.05,
        when: "beforeChildren",
        type: "tween"
      }
    },
    exit: { opacity: 0, x: '100%', transition: { duration: 0.2 } }
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 }
  };
  
  const dropdownMenuVariants = {
    hidden: { opacity: 0, y: -10, transition: { duration: 0.15 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.15 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
  };
  
  const mobileDropdownVariants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.2 } },
    visible: { 
        opacity: 1, 
        height: 'auto',
        transition: {
            duration: 0.3,
            staggerChildren: 0.05,
            when: "beforeChildren"
        }
    },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } }
  };


  return (
    <nav className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
          DSA Visualizer
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-2 items-center">
          {navItems.map((item) => (
            <li key={item.path} className="relative">
              {item.children ? (
                <>
                  <button 
                    onMouseEnter={() => toggleDropdown(item.path)} // Open on hover
                    // onMouseLeave={() => setOpenDropdownPath(null)} // Close on leave (optional)
                    onClick={() => toggleDropdown(item.path)} // Toggle on click
                    className={`px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm
                      ${openDropdownPath === item.path || isActive(item.path) ? 'bg-blue-600 text-white font-medium' : 'hover:bg-blue-800/50'}
                    `}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                    <motion.span
                      animate={{ rotate: openDropdownPath === item.path ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs ml-1"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {openDropdownPath === item.path && (
                      <motion.div 
                        variants={dropdownMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute left-0 mt-2 w-48 bg-blue-900 rounded-lg shadow-xl z-50 border border-blue-700 overflow-hidden"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`flex items-center gap-3 px-4 py-2 hover:bg-blue-700 transition-colors m-1 text-sm rounded-md
                              ${isActive(child.path) ? 'bg-blue-600 font-medium' : ''}
                            `}
                            onClick={() => {
                              scrollTo(0, 0);
                              setDataStructure(child.name);
                              setOpenDropdownPath(null); // Close dropdown on click
                            }}
                          >
                            <LayoutList className="w-4 h-4 opacity-70" />
                            {child.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm
                    ${isActive(item.path) ? 'bg-blue-600 text-white font-medium' : 'hover:bg-blue-800/50'}
                  `}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Explain level toggle (desktop) */}
        <div className="hidden md:flex items-center gap-2 ml-4">
          <label className="text-xs opacity-80">Explain:</label>
          <select
            value={explainLevel}
            onChange={(e)=>setExplainLevel(e.target.value)}
            className="text-sm text-blue-900 bg-white rounded px-2 py-1"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>
        {/* <button onClick={()=>setProfileOpen(true)} className="hidden md:inline-flex ml-2 px-3 py-2 rounded-lg bg-white text-blue-900 text-sm">Profile</button> */}

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-blue-800/50 transition-colors"
          onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setOpenDropdownPath(null); // Close dropdown on menu toggle
          }}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="md:hidden fixed inset-0 bg-blue-900/95 backdrop-blur-sm pt-20 px-6 z-40"
          >
            <motion.ul className="flex flex-col gap-2">
              {navItems.map((item, index) => (
                <motion.li 
                  key={item.path}
                  variants={mobileItemVariants}
                  custom={index}
                >
                  {item.children ? (
                    <>
                      {/* Parent button for mobile dropdown */}
                      <button 
                        onClick={() => toggleDropdown(item.path)}
                        className={`w-full px-4 py-3 rounded-lg flex items-center justify-between gap-4 text-lg transition-colors
                          ${openDropdownPath === item.path ? 'bg-blue-600 text-white' : 'hover:bg-blue-800/50'}
                        `}
                      >
                        <div className="flex items-center gap-4">
                            {item.icon}
                            <span>{item.name}</span>
                        </div>
                        <motion.span
                          animate={{ rotate: openDropdownPath === item.path ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-auto"
                        >
                          <ChevronDown className="w-5 h-5" />
                        </motion.span>
                      </button>
                      
                      {/* Mobile Dropdown */}
                      <AnimatePresence>
                        {openDropdownPath === item.path && (
                          <motion.div 
                            variants={mobileDropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="pl-4 overflow-hidden mt-1 border-l-2 border-blue-500"
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.path}
                                to={child.path}
                                className={`block px-4 py-3 rounded-lg flex items-center gap-4 transition-colors
                                  ${isActive(child.path) ? 'bg-blue-600 font-medium' : 'hover:bg-blue-800/50'}
                                `}
                                onClick={() => handleMobileLinkClick(child.name, false)}
                              >
                                <LayoutList className="w-5 h-5 opacity-70" />
                                <span>{child.name}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`px-4 py-3 rounded-lg flex items-center gap-4 text-lg transition-colors
                        ${isActive(item.path) ? 'bg-blue-600 text-white font-medium' : 'hover:bg-blue-800/50'}
                      `}
                      onClick={() => handleMobileLinkClick(item.name, false)}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  )}
                </motion.li>
              ))}
            </motion.ul>

            {/* Explain level (mobile) */}
            <div className="mt-4">
              <div className="text-xs mb-1 opacity-80">Explain level</div>
              <select
                value={explainLevel}
                onChange={(e)=>setExplainLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-blue-800/50"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            {/* Explain level (mobile) */}
            <div className="mt-4">
              <div className="text-xs mb-1 opacity-80">Explain level</div>
              <select
                value={explainLevel}
                onChange={(e)=>setExplainLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-blue-800/50"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            {/* <button onClick={()=>{ setProfileOpen(true); setMobileMenuOpen(false) }} className="mt-4 w-full px-4 py-3 rounded-lg bg-white text-blue-900">Profile</button> */}
          </motion.div>
        )}
      </AnimatePresence>
      <ProfileDrawer open={profileOpen} onClose={()=>setProfileOpen(false)} />
    </nav>
  );
};

export default Navbar;