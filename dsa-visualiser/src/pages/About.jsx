import { motion } from 'framer-motion';

const team = [
  {
    name: "Rohan Mehta",
    role: "Frontend Developer",
    image: "/team/rohan.jpg",
    bio: "Specializes in creating responsive UIs using React, TailwindCSS, and Framer Motion.",
  },
  {
    name: "Anjali Sharma",
    role: "Backend Developer",
    image: "/team/anjali.jpg",
    bio: "Enjoys building robust REST APIs and managing databases with Node.js and MongoDB.",
  },
  {
    name: "Kunal Verma",
    role: "UI/UX Designer",
    image: "/team/kunal.jpg",
    bio: "Designs user experiences that are intuitive, elegant, and engaging.",
  },
  {
    name: "Sneha Kapoor",
    role: "DevOps Engineer",
    image: "/team/sneha.jpg",
    bio: "Focuses on infrastructure automation and CI/CD workflows for seamless deployment.",
  },
];

const About = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-blue-950 to-indigo-950 text-white">
      <div className="max-w-6xl mx-auto">

        {/* Project Intro */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">About Our Project</h2>
          <p className="text-blue-200/90 text-lg max-w-3xl mx-auto leading-relaxed">
            This project is built to make learning Data Structures fun and interactive. 
            From visualizing linked lists to understanding stacks, queues, and maps — 
            we combine code, design, and animation to create an engaging experience for learners of all levels.
          </p>
        </motion.div>

        {/* Team Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h3 className="text-3xl font-semibold mb-2">Meet the Team</h3>
          <p className="text-blue-200/80">The minds behind the code and creativity</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="h-full p-[1px] rounded-xl bg-gradient-to-br from-blue-600/30 to-indigo-600/30 overflow-hidden">
                <div className="h-full bg-blue-900/20 rounded-xl backdrop-blur-sm p-6 border border-blue-800/20 group-hover:border-blue-700/50 transition-all duration-300">
                  <h4 className="text-xl font-semibold text-white text-center">{member.name}</h4>
                  <p className="text-cyan-300 text-sm text-center mb-2">{member.role}</p>
                  <p className="text-blue-200/80 text-sm text-center">{member.bio}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
