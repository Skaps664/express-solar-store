"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ZoomIn, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function ProductImageGallery({ images }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })

  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleThumbnailClick = (index) => {
    setCurrentImage(index)
  }

  const handleMouseMove = (e) => {
    if (!isZoomed) return

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    setZoomPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setIsZoomed(false)
  }

  return (
    <div>
      {/* Main Image */}
      <div className="relative mb-4 rounded-lg overflow-hidden bg-white border border-gray-200 h-[400px] md:h-[500px]">
        <div
          className={`w-full h-full relative cursor-zoom-in transition-transform duration-200 ${
            isZoomed ? "scale-150" : ""
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }
              : {}
          }
        >
          <Image
            src={images[currentImage].src || "/placeholder.svg"}
            alt={images[currentImage].alt}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
          onClick={handlePrevImage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
          onClick={handleNextImage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Zoom and Fullscreen buttons */}
        <div className="absolute bottom-2 right-2 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/80 hover:bg-white rounded-full h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              setIsZoomed(!isZoomed)
            }}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/80 hover:bg-white rounded-full h-8 w-8"
                onClick={(e) => e.stopPropagation()}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{images[currentImage].alt}</DialogTitle>
              </DialogHeader>
              <div className="relative h-[70vh]">
                <Image
                  src={images[currentImage].src || "/placeholder.svg"}
                  alt={images[currentImage].alt}
                  fill
                  className="object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative h-20 w-20 flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 ${
              currentImage === index ? "border-[#1a5ca4]" : "border-gray-200"
            }`}
            onClick={() => handleThumbnailClick(index)}
          >
            <Image src={image.src || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}
