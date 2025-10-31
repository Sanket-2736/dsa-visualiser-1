import { motion } from 'framer-motion';
import { Eye, Code, Trophy, Sparkles } from 'lucide-react';

const InteractiveLearning = () => {
  const features = [
    {
      icon: <Eye className="w-6 h-6" strokeWidth={1.75} />,
      title: "Visual Exploration",
      description: "Watch data structures come to life with step-by-step visualizations",
      accent: "bg-gradient-to-br from-cyan-400 to-blue-500",
      border: "border-cyan-500/30"
    },
    {
      icon: <Code className="w-6 h-6" strokeWidth={1.75} />,
      title: "Java Implementation",
      description: "See real Java code that implements each concept",
      accent: "bg-gradient-to-br from-purple-400 to-indigo-500",
      border: "border-purple-500/30"
    },
    {
      icon: <Trophy className="w-6 h-6" strokeWidth={1.75} />,
      title: "Earn Achievements",
      description: "Track your progress and earn badges as you master each topic",
      accent: "bg-gradient-to-br from-amber-400 to-orange-500",
      border: "border-amber-500/30"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-blue-900/10 to-indigo-900/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-16"
        >
          <motion.div 
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-800/20 rounded-full border border-blue-700/30"
            whileHover={{ scale: 1.03 }}
          >
            <Sparkles className="w-5 h-5 text-cyan-300" />
            <span className="text-cyan-300 font-medium text-sm">INTERACTIVE LEARNING</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Learn Through <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">Experience</span>
          </h2>
          <p className="text-lg text-gray-800 max-w-2xl mx-auto leading-relaxed">
            Our immersive approach transforms abstract concepts into tangible understanding
          </p>
        </motion.div>

        {/* Features Grid - Keeping original styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className={`h-full p-[1px] rounded-xl ${feature.accent} overflow-hidden`}>
                <div className="h-full bg-blue-900/20 rounded-xl backdrop-blur-sm p-6 flex flex-col border border-blue-800/20 group-hover:border-blue-700/50 transition-all duration-300">
                  <div className={`mb-5 p-3 rounded-lg ${feature.accent} w-fit shadow-md`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-blue-200/80 mb-6 leading-relaxed">{feature.description}</p>
                  <div className="mt-auto pt-4 border-t border-blue-800/30">
                    <div className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 group-hover:text-cyan-200 transition-colors">
                      <span>Discover more</span>
                      <svg 
                        className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteractiveLearning;