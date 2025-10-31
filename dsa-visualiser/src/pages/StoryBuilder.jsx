import React, { useState } from 'react'

export default function StoryBuilder(){
  const [captions,setCaptions]=useState([])
  const [text,setText]=useState('')
  function add(){ if(!text.trim()) return; setCaptions([...captions, { t: Date.now(), text }]); setText('') }
  function exportJson(){ const blob=new Blob([JSON.stringify(captions)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='story.json'; a.click(); URL.revokeObjectURL(url) }
  function importJson(f){ const r=new FileReader(); r.onload=()=>{ try{ const arr=JSON.parse(r.result); if(Array.isArray(arr)) setCaptions(arr) }catch(e){} }; r.readAsText(f) }
  async function play(){
    for(const c of captions){
      const box = document.createElement('div')
      box.className='fixed bottom-4 left-1/2 -translate-x-1/2 px-3 py-2 rounded bg-black/80 text-white text-sm z-50'
      box.textContent=c.text
      document.body.appendChild(box)
      await new Promise(r=>setTimeout(r, 1200))
      document.body.removeChild(box)
    }
  }
  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Data Story Tour Builder</h1>
      <div className="text-sm text-neutral-600 mb-4">Add captions to craft a narrated timeline; export as JSON.</div>
      <div className="p-3 border rounded-xl bg-white/80 shadow-sm">
        <div className="flex gap-2">
          <input value={text} onChange={(e)=>setText(e.target.value)} className="flex-1 border rounded px-2 py-1" placeholder="Add a caption" />
          <button onClick={add} className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm">Add</button>
          <button onClick={exportJson} className="px-3 py-1.5 rounded bg-neutral-200 text-sm">Export</button>
          <label className="px-3 py-1.5 rounded bg-neutral-200 text-sm cursor-pointer">Import<input type="file" accept="application/json" className="hidden" onChange={(e)=>{ if(e.target.files?.[0]) importJson(e.target.files[0]) }} /></label>
          <button onClick={play} className="px-3 py-1.5 rounded bg-emerald-600 text-white text-sm">Play</button>
        </div>
        <div className="mt-3 space-y-2 text-sm">
          {captions.map((c,i)=>(<div key={i} className="p-2 border rounded bg-white">{c.text}</div>))}
        </div>
      </div>
    </div>
  )
}


