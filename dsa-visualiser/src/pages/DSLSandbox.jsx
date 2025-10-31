import React, { useEffect, useMemo, useState } from 'react'

const SAMPLE = `# Commands: compare i j | swap i j | mark i | sleep ms
compare 0 1
swap 0 1
mark 0
sleep 300
compare 2 3
`

export default function DSLSandbox(){
  const [arr,setArr]=useState([5,3,1,4,2])
  const [code,setCode]=useState(SAMPLE)
  const [ptr,setPtr]=useState(0)
  const [playing,setPlaying]=useState(false)
  const [highlight,setHighlight]=useState({ compare: null, mark: new Set() })
  const [speed,setSpeed]=useState(400)

  useEffect(()=>{ setPtr(0); setHighlight({ compare:null, mark:new Set() }) }, [code])

  useEffect(()=>{
    if(!playing) return
    let cancelled=false
    async function stepper(){
      const lines = code.split(/\n/).map(s=>s.trim()).filter(Boolean)
      if(ptr>=lines.length){ setPlaying(false); return }
      const line = lines[ptr]
      const [cmd,...rest]=line.split(/\s+/)
      const toInt = (s)=>{ const v=parseInt(s,10); if(Number.isNaN(v)) throw new Error('Invalid number'); return v }
      try{
        if(cmd==='compare'){
          const i=toInt(rest[0]), j=toInt(rest[1])
          if(i<0||i>=arr.length||j<0||j>=arr.length) throw new Error('Index out of range')
          setHighlight({ compare:[i,j], mark: new Set(highlight.mark) })
          await new Promise(r=>setTimeout(r, speed))
        } else if(cmd==='swap'){
          const i=toInt(rest[0]), j=toInt(rest[1])
          if(i<0||i>=arr.length||j<0||j>=arr.length) throw new Error('Index out of range')
          setArr(prev=>{ const next=prev.slice(); const t=next[i]; next[i]=next[j]; next[j]=t; return next })
          await new Promise(r=>setTimeout(r, speed))
        } else if(cmd==='mark'){
          const i=toInt(rest[0]); if(i<0||i>=arr.length) throw new Error('Index out of range')
          setHighlight(h=>({ compare:null, mark: new Set([...h.mark, i]) }))
          await new Promise(r=>setTimeout(r, speed))
        } else if(cmd==='sleep'){
          const ms=toInt(rest[0]); await new Promise(r=>setTimeout(r, Math.max(0,ms)))
        } else if(cmd?.startsWith('#')){
          // comment, skip
        } else {
          throw new Error(`Unknown command: ${cmd}`)
        }
      } catch (e) {
        setPlaying(false)
        // leave error visible via console and a quick alert without blocking
        console.warn('DSL error:', e)
      } finally {
        if(!cancelled) setPtr(p=>p+1)
      }
    }
    const id=setTimeout(stepper, 0)
    return ()=>{ cancelled=true; clearTimeout(id) }
  }, [playing, ptr, code, speed, arr.length])
  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">DSL → Animation Sandbox</h1>
      <div className="text-sm text-neutral-600 mb-4">Write tiny pseudo‑instructions to animate operations.</div>
      <div className="mb-3 p-3 border rounded-xl bg-white/80 shadow-sm flex items-center gap-3">
        <button onClick={()=>{ setPtr(0); setPlaying(true) }} className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm">Play</button>
        <button onClick={()=>setPlaying(false)} className="px-3 py-1.5 rounded bg-neutral-200 text-sm">Pause</button>
        <button onClick={()=>{ setPlaying(false); setPtr(0); setArr([5,3,1,4,2]); setHighlight({ compare:null, mark:new Set() }) }} className="px-3 py-1.5 rounded bg-neutral-200 text-sm">Reset</button>
        <div className="ml-auto text-xs">Speed: {speed}ms</div>
        <input type="range" min={100} max={1000} step={50} value={speed} onChange={(e)=>setSpeed(parseInt(e.target.value,10))} />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <textarea value={code} onChange={(e)=>setCode(e.target.value)} className="min-h-[260px] p-3 border rounded-xl bg-white/80 shadow-sm font-mono text-sm" />
        <div className="p-3 border rounded-xl bg-white/80 shadow-sm flex items-end gap-1">
          {arr.map((v,idx)=>{
            const isCompare = highlight.compare && (idx===highlight.compare[0] || idx===highlight.compare[1])
            const isMarked = highlight.mark.has(idx)
            const color = isMarked ? 'bg-emerald-500' : isCompare ? 'bg-amber-500' : 'bg-indigo-500'
            return (<div key={idx} className={`w-6 ${color}`} style={{height:6+v*6}} />)
          })}
        </div>
      </div>
    </div>
  )
}


