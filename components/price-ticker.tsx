"use client"

import { StepForward } from "lucide-react"
import { useEffect, useState, useRef } from "react"
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
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

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
            data?.one,
            data?.two,
            data?.three,
            data?.four,
            data?.five,
            data?.six,
            data?.seven,
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
    if (!containerRef.current || !contentRef.current) return

    const contentWidth = contentRef.current.offsetWidth
    const animate = () => {
      setPosition((prevPosition) => {
        // Reset position when content has moved its full width
        if (prevPosition <= -contentWidth/2) {
          return 0
        }
        return prevPosition - 1
      })
    }

    const tickerInterval = setInterval(animate, 30)
    return () => clearInterval(tickerInterval)
  }, [prices]) // Depend on prices to recalculate when content changes

  // Don't render if no prices are loaded
  if (prices.length === 0) {
    return null
  }

  return (
    <div 
      ref={containerRef}
      className="overflow-hidden whitespace-nowrap bg-[#ff6900] text-white py-1"
    >
      <div 
        ref={contentRef}
        className="inline-block"
        style={{ transform: `translateX(${position}px)` }}
      >
        {/* Duplicate content multiple times to ensure continuous flow */}
        {tickerText} | {tickerText} | {tickerText} | {tickerText}
      </div>
    </div>
  )
}
