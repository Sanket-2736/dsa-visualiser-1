import { Github, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-[#0f172a] to-[#1e293b] py-10 px-6 border-t border-slate-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Branding */}
        <div className="text-center md:text-left">
          <h1 className="text-xl font-semibold text-white tracking-wide">DSA Visualizer</h1>
          <p className="text-sm text-slate-400 mt-1">Interactive learning made simple.</p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6">
          <a href="/linked-list" className="text-slate-300 hover:text-cyan-400 transition-colors text-sm">Linked List</a>
          <a href="/stack" className="text-slate-300 hover:text-cyan-400 transition-colors text-sm">Stack</a>
          <a href="/queue" className="text-slate-300 hover:text-cyan-400 transition-colors text-sm">Queue</a>
          <a href="/hash-map" className="text-slate-300 hover:text-cyan-400 transition-colors text-sm">HashMap</a>
        </div>

        {/* Social */}
        <div className="flex items-center gap-4">
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
            <Instagram className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center text-slate-600 text-xs mt-6">
        © {new Date().getFullYear()} DSA Visualizer. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
