import React, { useMemo, useState } from 'react'

function genArray(n, disorder, dupes){
  const a=Array.from({length:n},(_,i)=>i)
  if(dupes>0){ for(let i=0;i<n;i++) if(Math.random()<dupes) a[i]=a[Math.floor(Math.random()*i)]||a[i] }
  const swaps=Math.floor(n*disorder); for(let k=0;k<swaps;k++){ const i=Math.floor(Math.random()*n), j=Math.floor(Math.random()*n); [a[i],a[j]]=[a[j],a[i]] }
  return a
}
function time(fn,a){ const b=a.slice(); const t0=performance.now(); fn(b); return performance.now()-t0 }
function insertion(a){ const arr=a.slice(); for(let i=1;i<arr.length;i++){ const k=arr[i]; let j=i-1; while(j>=0&&arr[j]>k){ arr[j+1]=arr[j]; j-- } arr[j+1]=k } return arr }
function merge(a){ const arr=a.slice(); function ms(l,r){ if(r-l<=1) return arr.slice(l,r); const m=(l+r)>>1; const L=ms(l,m), R=ms(m,r); const out=[]; let i=0,j=0; while(i<L.length||j<R.length){ if(j>=R.length||(i<L.length&&L[i]<=R[j])) out.push(L[i++]); else out.push(R[j++]) } return out } return ms(0,arr.length) }
function quick(a){ const arr=a.slice(); function qs(l,r){ if(l>=r) return; const p=arr[Math.floor((l+r)/2)]; let i=l,j=r; while(i<=j){ while(arr[i]<p)i++; while(arr[j]>p)j--; if(i<=j){ const t=arr[i]; arr[i]=arr[j]; arr[j]=t; i++; j-- } } if(l<j) qs(l,j); if(i<r) qs(i,r) } qs(0,arr.length-1); return arr }

export default function Heatmap(){
  const [n,setN]=useState(100)
  const [grid,setGrid]=useState(5)
  const [algos,setAlgos]=useState({ insertion:true, merge:true, quick:false })
  const stepsD=Array.from({length:grid},(_,i)=> i/(grid-1))
  const stepsU=Array.from({length:grid},(_,i)=> i/(grid-1))
  const [data,setData]=useState(null)
  function run(){
    const rows=[]
    for(const d of stepsD){ const row=[]; for(const u of stepsU){ const base=genArray(n,d,u); row.push({ d,u,
      ins: algos.insertion? time(insertion,base):0,
      mer: algos.merge? time(merge,base):0,
      qk: algos.quick? time(quick,base):0
    }) } rows.push(row) }
    setData(rows)
  }
  const max = data ? Math.max(...data.flat().map(x=>Math.max(x.ins,x.mer))) : 1
  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Performance Heatmap</h1>
      <div className="text-sm text-neutral-600 mb-4">See performance across disorder and duplicates.</div>
      <div className="mb-3 flex items-center gap-3">
        <div className="text-sm">Size</div>
        <input type="number" value={n} onChange={(e)=>setN(parseInt(e.target.value||'10',10))} className="w-24 border rounded px-2 py-1" />
        <div className="text-sm">Grid</div>
        <input type="number" min={3} max={9} value={grid} onChange={(e)=>setGrid(parseInt(e.target.value||'5',10))} className="w-20 border rounded px-2 py-1" />
        <label className="text-sm flex items-center gap-1"><input type="checkbox" checked={algos.insertion} onChange={(e)=>setAlgos(a=>({...a, insertion:e.target.checked}))}/>Insertion</label>
        <label className="text-sm flex items-center gap-1"><input type="checkbox" checked={algos.merge} onChange={(e)=>setAlgos(a=>({...a, merge:e.target.checked}))}/>Merge</label>
        <label className="text-sm flex items-center gap-1"><input type="checkbox" checked={algos.quick} onChange={(e)=>setAlgos(a=>({...a, quick:e.target.checked}))}/>Quick</label>
        <button onClick={run} className="ml-auto px-3 py-2 rounded bg-blue-600 text-white">Generate</button>
      </div>
      {data && (
        <div className="overflow-auto">
          <div className="text-xs mb-1">Heatmap per algorithm</div>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${stepsU.length * (algos.insertion+algos.merge+algos.quick)}, 18px)` }}>
            {data.map((row,ri)=> row.flatMap((cell,ci)=> {
              const cells=[]
              if(algos.insertion) cells.push(<div key={`i-${ri}-${ci}`} style={{width:18,height:18,background:`rgba(239,68,68,${(cell.ins||0)/max})`}} />)
              if(algos.merge) cells.push(<div key={`m-${ri}-${ci}`} style={{width:18,height:18,background:`rgba(16,185,129,${(cell.mer||0)/max})`}} />)
              if(algos.quick) cells.push(<div key={`q-${ri}-${ci}`} style={{width:18,height:18,background:`rgba(59,130,246,${(cell.qk||0)/max})`}} />)
              return cells
            }))}
          </div>
        </div>
      )}
    </div>
  )
}


