import React from 'react'
import { AppContext } from '../context/AppContext'

const ACHIEVEMENT_META = {
  pathfinder: { title: 'Pathfinder', desc: 'Completed a pathfinding run' },
  benchmarker: { title: 'Benchmark Runner', desc: 'Ran a benchmark suite' },
  puzzle_novice: { title: 'Puzzle Novice', desc: 'Solved a puzzle' },
  puzzle_perfect: { title: 'Puzzle Perfect', desc: 'Matched optimal moves' },
  drill_starter: { title: 'Drill Starter', desc: 'Finished a drill set' },
  drill_streak: { title: 'On a Roll', desc: '3+ perfect streak' },
}

export default function ProfileDrawer({ open, onClose }){
  const { achievements } = React.useContext(AppContext)

  async function downloadCertificate(){
    if(!window.html2canvas){
      await new Promise((res,rej)=>{ const s=document.createElement('script'); s.src='https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js'; s.onload=res; s.onerror=rej; document.body.appendChild(s) })
    }
    const node = document.querySelector('#certificate-card')
    if(!node) return
    const canvas = await window.html2canvas(node)
    const url = canvas.toDataURL('image/png'); const a=document.createElement('a'); a.href=url; a.download='certificate.png'; a.click()
  }

  return open ? (
    <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose}>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-4 shadow-xl" onClick={(e)=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Your Profile</div>
          <button onClick={onClose} className="px-2 py-1 rounded bg-neutral-100">Close</button>
        </div>
        <div id="certificate-card" className="p-4 border rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50">
          <div className="text-sm text-neutral-600">Certificate of Progress</div>
          <div className="text-xl font-semibold">DSA Journey</div>
          <div className="mt-1 text-xs">Achievements unlocked: {Object.keys(achievements||{}).length}</div>
        </div>
        <button onClick={downloadCertificate} className="mt-2 px-3 py-2 rounded bg-blue-600 text-white text-sm">Download Certificate</button>

        <div className="mt-4">
          <div className="font-medium mb-2">Achievements</div>
          <div className="grid grid-cols-1 gap-2 max-h-[50vh] overflow-auto">
            {Object.keys(ACHIEVEMENT_META).map(key => (
              <div key={key} className={`p-3 border rounded ${achievements[key]? 'bg-emerald-50 border-emerald-200' : 'bg-neutral-50'}`}>
                <div className="text-sm font-medium">{ACHIEVEMENT_META[key].title}</div>
                <div className="text-xs text-neutral-600">{ACHIEVEMENT_META[key].desc}</div>
                {achievements[key] ? <div className="text-[10px] text-emerald-600 mt-1">Unlocked</div> : <div className="text-[10px] text-neutral-500 mt-1">Locked</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : null
}


