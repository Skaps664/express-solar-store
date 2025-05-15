import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"

export default function ProductVideos({ videos }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {videos.map((video) => (
        <Link
          key={video.id}
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group border border-gray-200 rounded-lg overflow-hidden hover:border-[#1a5ca4] hover:shadow-md transition-all"
        >
          <div className="relative h-48 bg-gray-100">
            <Image src={video.thumbnail || "/placeholder.svg"} alt={video.title} fill className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all">
              <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                <Play className="h-6 w-6 text-[#1a5ca4] ml-1" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-medium group-hover:text-[#1a5ca4] transition-colors">{video.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  )
}
