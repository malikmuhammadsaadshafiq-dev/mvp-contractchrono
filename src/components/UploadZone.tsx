'use client';

import { useState, useCallback } from "react";
import { Upload, FileText, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onUpload: (file: File) => Promise<void>;
  isProcessing?: boolean;
}

export function UploadZone({ onUpload, isProcessing }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === "application/pdf") {
      setSelectedFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      await onUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  const clearFile = () => setSelectedFile(null);

  return (
    <div className="space-y-12px">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-8px p-24px text-center interactive cursor-pointer",
          "bg-bg-raised border-border-default",
          isDragging && "border-accent bg-accent/5",
          selectedFile && "border-success bg-success/5"
        )}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          id="pdf-upload"
          disabled={isProcessing}
        />
        
        <label htmlFor="pdf-upload" className="cursor-pointer block">
          {selectedFile ? (
            <div className="flex items-center justify-center gap-12px">
              <FileText className="w-24px h-24px text-success" />
              <div className="text-left">
                <p className="text-sm text-text-primary font-medium">{selectedFile.name}</p>
                <p className="text-xs text-text-secondary">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  clearFile();
                }}
                className="p-4px hover:bg-bg-hover rounded-4px interactive"
              >
                <X className="w-16px h-16px text-text-tertiary" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-32px h-32px text-text-tertiary mx-auto mb-12px" />
              <p className="text-sm text-text-primary font-medium mb-4px">
                Drop your contract PDF here
              </p>
              <p className="text-xs text-text-secondary">
                or click to browse (max 10MB)
              </p>
            </>
          )}
        </label>
      </div>

      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={isProcessing}
          className={cn(
            "w-full py-12px px-16px rounded-6px text-sm font-medium text-white",
            "bg-accent hover:bg-accent-hover interactive",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "flex items-center justify-center gap-8px"
          )}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-16px h-16px animate-spin" />
              Processing with AI...
            </>
          ) : (
            "Extract Dates & Analyze"
          )}
        </button>
      )}
    </div>
  );
}