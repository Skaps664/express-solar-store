"use client"

import { useEffect, useState } from "react"

export default function PriceTicker() {
  const [position, setPosition] = useState(0)

 const solarPrices = [
  "Longi Hi‑Mo 6 575 W Mono/Bifacial – PKR 20,770–21,315",   // typical price range :contentReference[oaicite:1]{index=1}
  "Longi 550 W Mono PERC – ~PKR 19,525",                        
  "Jinko N‑Type 575 W A‑Grade – ~PKR 17,825",                  
  "Jinko 550 W Single‑Glass A‑Grade – PKR 15,400",             
  "Canadian N‑Type Bifacial 575–580 W – PKR 20,700–21,060",    
  "JA N‑Type Bifacial 580–600 W – PKR 17,250–19,200",          
  "Trina N‑Type Bifacial 590–620 W – PKR 19,840",              
];

  const tickerText = solarPrices.join(" • ")

  useEffect(() => {
    const tickerInterval = setInterval(() => {
      setPosition((prevPosition) => {
        if (prevPosition <= -3000) {
          return 0
        }
        return prevPosition - 1
      })
    }, 30)

    return () => clearInterval(tickerInterval)
  }, [])

  return (
    <div className="overflow-hidden whitespace-nowrap bg-[#ff6900] text-white py-1">
      <div className="inline-block" style={{ transform: `translateX(${position}px)` }}>
        {tickerText} • {tickerText}
      </div>
    </div>
  )
}
