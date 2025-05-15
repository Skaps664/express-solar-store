"use client"

import { useEffect, useState } from "react"

export default function PriceTicker() {
  const [position, setPosition] = useState(0)

  const solarPrices = [
    "Jinko 550W Mono PERC Solar Panel - PKR 42,500",
    "Canadian Solar 540W Bifacial - PKR 45,000",
    "Longi 500W Half-Cut Module - PKR 39,999",
    "JA Solar 530W Mono Panel - PKR 41,200",
    "Inverex 5kW Hybrid Inverter - PKR 185,000",
    "Growatt 8kW Three Phase Inverter - PKR 275,000",
    "Tesla Powerwall 13.5kWh - PKR 950,000",
    "Pylontech 3.5kWh Lithium Battery - PKR 225,000",
    "Mounting Structure (per kW) - PKR 15,000",
    "Complete 5kW Solar System - PKR 750,000",
  ]

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
    <div className="overflow-hidden whitespace-nowrap bg-[#0e4a8a] text-white py-1">
      <div className="inline-block" style={{ transform: `translateX(${position}px)` }}>
        {tickerText} • {tickerText}
      </div>
    </div>
  )
}
