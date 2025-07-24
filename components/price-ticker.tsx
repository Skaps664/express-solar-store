"use client"

import { StepForward } from "lucide-react"
import { useEffect, useState } from "react"
import { client } from "@/lib/sanity"

interface PriceData {
  page: string
  one: string
  two: string
  three: string
  four: string
  five: string
  six: string
  seven: string
}

export default function PriceTicker() {
  const [position, setPosition] = useState(0)
  const [prices, setPrices] = useState<string[]>([])

  // Fetch prices from Sanity
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        console.log("Fetching ticker content...")
        const data: PriceData = await client.fetch(`
          *[_type == "tickerContent"][0] {
            page,
            one,
            two,
            three,
            four,
            five,
            six,
            seven
          }
        `)
        
        console.log("Received data from Sanity:", data)
        
        if (data) {
          const pricesArray = [
            data.one,
            data.two,
            data.three,
            data.four,
            data.five,
            data.six,
            data.seven,
          ].filter(Boolean) // Remove any null/undefined values
          
          setPrices(pricesArray)
          console.log("Processed prices array:", pricesArray)
        }
      } catch (error) {
        console.error("Failed to fetch prices from Sanity:", error)
        setPrices([])
      }
    }

    fetchPrices()
  }, [])

  const tickerText = prices.join(" | ")

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

  // Don't render if no prices are loaded
  if (prices.length === 0) {
    return null
  }

  return (
    <div className="overflow-hidden whitespace-nowrap bg-[#ff6900] text-white py-1">
      <div className="inline-block" style={{ transform: `translateX(${position}px)` }}>
        {tickerText} • {tickerText}
      </div>
    </div>
  )
}
