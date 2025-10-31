import React from 'react'

const CARDS = [
  { id:'merge', name:'Merge Sort', traits:['Stable','Predictable','Divide & Conquer'], color:'bg-emerald-500' },
  { id:'insertion', name:'Insertion Sort', traits:['Simple','Great on nearly-sorted'], color:'bg-amber-500' },
  { id:'binary', name:'Binary Search', traits:['Precise','Log-time'], color:'bg-sky-500' },
  { id:'mst', name:'MST', traits:['Frugal','Spanning'], color:'bg-indigo-500' },
]

export default function PersonalityCards(){
  const [unlocked, setUnlocked] = React.useState(()=>{
    return JSON.parse(localStorage.getItem('cardsUnlocked')||'{}')
  })
  function toggle(id){
    const next={...unlocked, [id]: !unlocked[id]}
    setUnlocked(next)
    localStorage.setItem('cardsUnlocked', JSON.stringify(next))
  }
  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Algorithm Personality Cards</h1>
      <div className="text-sm text-neutral-600 mb-4">Collect and learn: strengths, quirks, best use-cases.</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {CARDS.map(c => (
          <button key={c.id} onClick={()=>toggle(c.id)} className="p-4 border rounded-xl bg-white/80 shadow-sm text-left hover:shadow">
            <div className={`w-10 h-10 rounded ${c.color} mb-2`} />
            <div className="font-medium flex items-center gap-2">
              {unlocked[c.id] ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Unlocked</span> : <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">Locked</span>}
              {c.name}
            </div>
            {unlocked[c.id] ? (
              <ul className="mt-2 text-xs text-neutral-700 list-disc list-inside">
                {c.traits.map((t,i)=>(<li key={i}>{t}</li>))}
              </ul>
            ) : (
              <div className="mt-2 text-xs text-neutral-500">Click to unlock preview</div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}


