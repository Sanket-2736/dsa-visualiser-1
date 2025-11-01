import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Play, 
  Download, 
  Upload, 
  Trash2,
  Edit3,
  Check,
  X,
  BookOpen,
  Clock,
  Film
} from 'lucide-react';

export default function DataStoryTourBuilder() {
  const [captions, setCaptions] = useState([]);
  const [text, setText] = useState('');
  const [playing, setPlaying] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');

  const add = useCallback(() => {
    if (!text.trim()) return;
    setCaptions(prev => [...prev, { t: Date.now(), text: text.trim() }]);
    setText('');
  }, [text]);

  const remove = useCallback((idx) => {
    setCaptions(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const startEdit = useCallback((idx) => {
    setEditingIndex(idx);
    setEditText(captions[idx].text);
  }, [captions]);

  const saveEdit = useCallback(() => {
    if (editText.trim()) {
      setCaptions(prev => prev.map((c, i) => 
        i === editingIndex ? { ...c, text: editText.trim() } : c
      ));
    }
    setEditingIndex(null);
    setEditText('');
  }, [editingIndex, editText]);

  const cancelEdit = useCallback(() => {
    setEditingIndex(null);
    setEditText('');
  }, []);

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(captions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'story.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [captions]);

  const importJson = useCallback((f) => {
    const r = new FileReader();
    r.onload = () => {
      try {
        const arr = JSON.parse(r.result);
        if (Array.isArray(arr)) setCaptions(arr);
      } catch (e) {
        console.error('Invalid JSON file');
      }
    };
    r.readAsText(f);
  }, []);

  const play = useCallback(async () => {
    if (captions.length === 0 || playing) return;
    
    setPlaying(true);
    
    for (let i = 0; i < captions.length; i++) {
      const c = captions[i];
      const box = document.createElement('div');
      box.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl bg-gray-900/95 backdrop-blur-sm text-white text-base z-50 border-2 border-cyan-500 shadow-2xl max-w-2xl';
      box.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="text-2xl">📖</span>
          <div>
            <div class="text-xs text-cyan-400 mb-1">Caption ${i + 1} of ${captions.length}</div>
            <div>${c.text}</div>
          </div>
        </div>
      `;
      document.body.appendChild(box);
      
      await new Promise(r => setTimeout(r, 2500));
      
      box.style.transition = 'opacity 300ms';
      box.style.opacity = '0';
      await new Promise(r => setTimeout(r, 300));
      document.body.removeChild(box);
      
      if (i < captions.length - 1) {
        await new Promise(r => setTimeout(r, 500));
      }
    }
    
    setPlaying(false);
  }, [captions, playing]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      add();
    }
  }, [add]);

  const handleEditKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  }, [saveEdit, cancelEdit]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            📖 Data Story Tour Builder
          </h1>
          <p className="text-lg text-indigo-300">
            Craft narrated timelines with interactive captions
          </p>
        </motion.div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={16} className="text-cyan-400" />
              <span className="text-xs text-indigo-300">Total Captions</span>
            </div>
            <div className="text-2xl font-bold text-cyan-400">{captions.length}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} className="text-purple-400" />
              <span className="text-xs text-indigo-300">Story Duration</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {captions.length > 0 ? `${(captions.length * 2.5).toFixed(1)}s` : '—'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <Film size={16} className="text-emerald-400" />
              <span className="text-xs text-indigo-300">Status</span>
            </div>
            <div className="text-lg font-bold text-emerald-400">
              {playing ? 'Playing...' : 'Ready'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <Edit3 size={16} className="text-yellow-400" />
              <span className="text-xs text-indigo-300">Editing</span>
            </div>
            <div className="text-lg font-bold text-yellow-400">
              {editingIndex !== null ? `#${editingIndex + 1}` : 'None'}
            </div>
          </motion.div>
        </div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
        >
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Plus size={20} />
            Add New Caption
          </h3>
          
          <div className="flex gap-3 mb-4">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your caption text..."
              className="flex-1 bg-gray-900 border border-indigo-600 text-white rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <motion.button
              onClick={add}
              disabled={!text.trim()}
              whileHover={text.trim() ? { scale: 1.05 } : {}}
              whileTap={text.trim() ? { scale: 0.95 } : {}}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Add
            </motion.button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <motion.button
              onClick={play}
              disabled={captions.length === 0 || playing}
              whileHover={captions.length > 0 && !playing ? { scale: 1.05 } : {}}
              whileTap={captions.length > 0 && !playing ? { scale: 0.95 } : {}}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Play size={20} />
              {playing ? 'Playing...' : 'Play Story'}
            </motion.button>

            <motion.button
              onClick={exportJson}
              disabled={captions.length === 0}
              whileHover={captions.length > 0 ? { scale: 1.05 } : {}}
              whileTap={captions.length > 0 ? { scale: 0.95 } : {}}
              className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Download size={20} />
              Export JSON
            </motion.button>

            <motion.label
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg cursor-pointer transition-all"
            >
              <Upload size={20} />
              Import JSON
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) importJson(e.target.files[0]); }}
              />
            </motion.label>
          </div>
        </motion.div>

        {/* Caption List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/80 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 shadow-lg"
        >
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen size={20} />
            Story Timeline ({captions.length} captions)
          </h3>

          {captions.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm">No captions yet. Add your first caption to start building your story!</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {captions.map((c, idx) => (
                  <motion.div
                    key={c.t}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-indigo-600 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                        {idx + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {editingIndex === idx ? (
                          <div className="flex gap-2">
                            <input
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyDown={handleEditKeyPress}
                              autoFocus
                              className="flex-1 bg-gray-800 border border-indigo-500 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <motion.button
                              onClick={saveEdit}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                            >
                              <Check size={18} />
                            </motion.button>
                            <motion.button
                              onClick={cancelEdit}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                            >
                              <X size={18} />
                            </motion.button>
                          </div>
                        ) : (
                          <>
                            <p className="text-white text-sm mb-2">{c.text}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Clock size={12} />
                              <span>{new Date(c.t).toLocaleTimeString()}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {editingIndex !== idx && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            onClick={() => startEdit(idx)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                          >
                            <Edit3 size={16} />
                          </motion.button>
                          <motion.button
                            onClick={() => remove(idx)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Info Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-blue-900/30 border border-blue-700 rounded-xl p-6"
        >
          <h3 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
            <Film size={18} />
            How It Works
          </h3>
          <div className="text-sm text-blue-200 space-y-2">
            <p>
              • <strong>Add Captions:</strong> Type and click "Add" or press Enter to create story points
            </p>
            <p>
              • <strong>Edit/Delete:</strong> Hover over captions to reveal edit and delete buttons
            </p>
            <p>
              • <strong>Play Story:</strong> Click "Play Story" to see captions animate on screen (2.5s each)
            </p>
            <p>
              • <strong>Export/Import:</strong> Save your story as JSON and share or reload later
            </p>
            <p>
              • <strong>Keyboard Shortcuts:</strong> Enter to add, Escape to cancel edit
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
