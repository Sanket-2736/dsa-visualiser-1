import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Aarya Sharma",
    title: "Frontend Developer",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    quote:
      "This platform made learning data structures incredibly intuitive and fun! I loved the interactive visualizations and the clean UI.",
  },
  {
    name: "Ravi Patel",
    title: "Computer Engineering Student",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    quote:
      "The visual explanations really helped me understand how stacks and queues work. Highly recommended for beginners!",
  },
  {
    name: "Sneha Kulkarni",
    title: "Software Engineer Intern",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
    quote:
      "Elegant UI, smooth animations, and a dark theme that feels premium. This is how learning platforms should look!",
  }
];

const TestimonialSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#1e293b] to-[#0f172a]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            What Learners Say
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Hear from students and professionals who’ve experienced our platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <div className="h-full p-[1px] rounded-xl bg-gradient-to-br from-cyan-500/30 to-indigo-500/30 shadow-lg shadow-indigo-900/10">
                <div className="bg-[#0f172a]/80 backdrop-blur-md p-6 rounded-xl h-full flex flex-col border border-slate-700/50 group-hover:border-indigo-400/40 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full border-2 border-indigo-500/50 shadow shadow-indigo-400/20"
                    />
                    <div>
                      <h4 className="text-white font-semibold text-base">{testimonial.name}</h4>
                      <p className="text-slate-400 text-xs">{testimonial.title}</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed italic">
                    “{testimonial.quote}”
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
