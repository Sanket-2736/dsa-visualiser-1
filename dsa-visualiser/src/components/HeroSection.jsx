import { motion } from 'framer-motion';
import { Code2, Rocket, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 to-indigo-900 text-white py-20 px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-400"
            initial={{ 
              x: Math.random() * 100,
              y: Math.random() * 100,
              width: Math.random() * 20 + 5,
              height: Math.random() * 20 + 5,
              opacity: 0
            }}
            animate={{
              x: [null, Math.random() * 100],
              y: [null, Math.random() * 100],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center"
        >
          <div className="mb-6 p-4 bg-blue-700/30 rounded-full backdrop-blur-sm">
            <Code2 className="w-12 h-12 text-cyan-300" strokeWidth={1.5} />
          </div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300"
          >
            CodeVista: The Ultimate DSA Visualizer
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-blue-100 max-w-3xl mb-10"
          >
            Master data structures and algorithms through interactive visualizations and gamified learning experiences
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to='/data-structures' className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/30">
              <Rocket className="w-5 h-5" />
              Start Learning
            </Link>
            
            <button className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-blue-400 hover:bg-blue-800/50 text-white font-medium rounded-lg transition-all duration-300">
              <BookOpen className="w-5 h-5" />
              Explore Topics
            </button>
          </motion.div>
        </motion.div>

        {/* Animated code preview placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 mx-auto max-w-4xl bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-700/50 shadow-xl"
        >
          <div className="p-4 bg-gray-800/50 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="p-6 font-mono text-blue-200">
            <div className="text-cyan-400">// Interactive Java Code Visualizer</div>
            <div className="text-purple-400 mt-2">public class <span className="text-yellow-300">DSAVisualizer</span> {'{'}</div>
            <div className="ml-4 text-green-400">public static void <span className="text-blue-300">main</span>(String[] args) {'{'}</div>
            <div className="ml-8">System.<span className="text-yellow-300">out</span>.<span className="text-blue-300">println</span>(<span className="text-orange-300">"Start your coding journey!"</span>);</div>
            <div className="ml-4 text-green-400">{'}'}</div>
            <div className="text-purple-400">{'}'}</div>
            <div className="mt-4 text-gray-500">// Hover over any structure to see it in action</div>
          </div>
        </motion.div>

        {/* Credit Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-lg md:text-2xl font-semibold text-cyan-300">Made with ❤️ by Sanket K. Belekar, Prathamesh A. Ranade, Ayush A. Shirsat, Tanmay Sonar</p>
          <a
            href="https://www.linkedin.com/in/sanket-belekar-79210228a/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-lg md:text-2xl font-bold text-blue-400 hover:underline"
          >
            Connect with me on LinkedIn
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
