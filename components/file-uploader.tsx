"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { UploadCloud } from "lucide-react"

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number // in MB
  label?: string
  buttonText?: string
  className?: string
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  accept = "image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  maxSize = 10, // 10MB default
  label = "Upload a file",
  buttonText = "Select File",
  className = "",
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`)
      return false
    }

    // Check file type if accept is specified
    if (accept && accept !== "*") {
      const acceptedTypes = accept.split(",")
      let isValidType = false
      
      // Check if file type matches any of the accepted types
      for (const type of acceptedTypes) {
        if (type.includes("/*")) {
          // Handle wildcard types like "image/*"
          const baseType = type.split("/")[0]
          if (file.type.startsWith(`${baseType}/`)) {
            isValidType = true
            break
          }
        } else if (file.type === type) {
          isValidType = true
          break
        }
      }

      if (!isValidType) {
        setError("File type not supported")
        return false
      }
    }

    setError(null)
    return true
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
        onFileSelect(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
        onFileSelect(file)
      }
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className={className}>
      {label && <p className="text-sm mb-2">{label}</p>}
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center ${
          dragActive ? "border-primary bg-primary/10" : "border-gray-300"
        } ${error ? "border-red-500" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center justify-center py-4">
          <UploadCloud className="h-8 w-8 mb-2 text-gray-400" />
          <p className="text-sm font-medium mb-1">
            {selectedFile ? selectedFile.name : "Drag and drop your file here"}
          </p>
          <p className="text-xs text-gray-500 mb-3">
            {!selectedFile && `Supports various file types up to ${maxSize}MB`}
          </p>
          <Button type="button" variant="outline" onClick={handleButtonClick}>
            {buttonText}
          </Button>
        </div>
      </div>
      
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {selectedFile && !error && (
        <p className="text-xs text-green-500 mt-1">
          File selected: {selectedFile.name}
        </p>
      )}
    </div>
  )
}
