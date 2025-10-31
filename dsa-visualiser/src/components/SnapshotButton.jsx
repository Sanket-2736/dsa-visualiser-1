import React, { useState } from 'react'

// Lightweight snapshot: dynamically loads html2canvas from CDN to avoid adding build deps
export default function SnapshotButton({ targetSelector = 'body', filename = 'snapshot.png' }){
  const [loading,setLoading]=useState(false)
  async function ensureLib(){
    if(window.html2canvas) return window.html2canvas
    await new Promise((resolve,reject)=>{
      const s=document.createElement('script')
      s.src='https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js'
      s.onload=resolve; s.onerror=reject; document.body.appendChild(s)
    })
    return window.html2canvas
  }
  async function capture(){
    try{
      setLoading(true)
      const h2c = await ensureLib()
      const el = document.querySelector(targetSelector)
      if(!el) return
      const canvas = await h2c(el)
      const url = canvas.toDataURL('image/png')
      const a=document.createElement('a')
      a.href=url; a.download=filename; a.click()
    } finally { setLoading(false) }
  }
  return (
    <button onClick={capture} className="px-3 py-2 rounded bg-neutral-200" disabled={loading}>{loading? 'Capturing…' : 'Postcard Snapshot'}</button>
  )
}


