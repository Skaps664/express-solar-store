"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { Trash2 } from "lucide-react"
import { api } from "@/lib/services/api"

export default function ClearCacheButton() {
  const [isClearing, setIsClearing] = useState(false)

  const handleClearCache = async () => {
    if (!confirm("Are you sure you want to clear ALL caches? This will temporarily slow down the site until caches are rebuilt.")) {
      return
    }

    try {
      setIsClearing(true)
      
      const response = await api.post("/api/products/admin/clear-cache")
      const data = response.data as any
      
      if (data.success) {
        toast.success("✅ All caches cleared successfully!")
        toast.success("Changes should now be visible on the frontend")
      } else {
        throw new Error(data.message || "Failed to clear cache")
      }
    } catch (error: any) {
      console.error("Cache clear error:", error)
      toast.error(error.response?.data?.message || "Failed to clear cache")
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <Button
      onClick={handleClearCache}
      disabled={isClearing}
      variant="destructive"
      size="sm"
      className="gap-2"
    >
      <Trash2 className="h-4 w-4" />
      {isClearing ? "Clearing Cache..." : "Clear All Caches"}
    </Button>
  )
}
