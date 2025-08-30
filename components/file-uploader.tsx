'use client'

import React, { useState, useCallback } from 'react'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatBytes, formatDate } from '@/lib/utils'

interface FileUploaderProps {
    onUploadComplete: (fileId: string) => void
}

interface UploadedFile {
    id: string
    name: string
    size: number
    uploadTime: Date
    status: 'uploading' | 'processing' | 'completed' | 'error'
    progress?: number
    error?: string
}

export function FileUploader({ onUploadComplete }: FileUploaderProps) {
    const [isDragOver, setIsDragOver] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
    const [isUploading, setIsUploading] = useState(false)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }, [])

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)

        const files = Array.from(e.dataTransfer.files)
        await processFiles(files)
    }, [])

    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        await processFiles(files)
    }, [])

    const processFiles = async (files: File[]) => {
        setIsUploading(true)

        for (const file of files) {
            if (!file.name.toLowerCase().endsWith('.csv')) continue

            const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

            const uploadedFile: UploadedFile = {
                id: fileId,
                name: file.name,
                size: file.size,
                uploadTime: new Date(),
                status: 'uploading',
                progress: 0
            }

            setUploadedFiles(prev => [...prev, uploadedFile])

            try {
                // Create form data
                const formData = new FormData()
                formData.append('file', file)

                // Use fetch to POST to your /api/upload route
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                })

                if (!res.ok) throw new Error('Upload failed')

                const data = await res.json()

                // Update progress to 100%
                setUploadedFiles(prev =>
                    prev.map(f => f.id === fileId
                        ? { ...f, progress: 100, status: 'completed' }
                        : f
                    )
                )

                // Optionally: pass the saved file path or fileId to callback
                onUploadComplete(data.path || fileId)

            } catch (error) {
                setUploadedFiles(prev =>
                    prev.map(f => f.id === fileId
                        ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
                        : f
                    )
                )
            }
        }

        setIsUploading(false)
    }

    const removeFile = (fileId: string) => {
        setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
    }

    const getStatusIcon = (status: UploadedFile['status']) => {
        switch (status) {
            case 'uploading':
                return <Upload className="h-4 w-4 animate-pulse" />
            case 'processing':
                return <FileText className="h-4 w-4 animate-spin" />
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'error':
                return <AlertCircle className="h-4 w-4 text-red-500" />
        }
    }

    const getStatusText = (status: UploadedFile['status']) => {
        switch (status) {
            case 'uploading':
                return 'Uploading...'
            case 'processing':
                return 'Processing...'
            case 'completed':
                return 'Completed'
            case 'error':
                return 'Error'
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Upload CSV Files</CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${isDragOver
                                ? 'border-primary bg-primary/5'
                                : 'border-muted-foreground/25 hover:border-primary/50'
                            }
            `}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-lg font-medium mb-2">
                            Drag and drop CSV files here
                        </p>
                        <p className="text-muted-foreground mb-4">
                            or click the button below to select files
                        </p>
                        <Button
                            onClick={() => document.getElementById('file-input')?.click()}
                            disabled={isUploading}
                        >
                            Select Files
                        </Button>
                        <input
                            id="file-input"
                            type="file"
                            multiple
                            accept=".csv"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>
                </CardContent>
            </Card>

            {uploadedFiles.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Uploaded Files</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {uploadedFiles.map((file) => (
                                <div
                                    key={file.id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div className="flex items-center space-x-3">
                                        {getStatusIcon(file.status)}
                                        <div>
                                            <p className="font-medium">{file.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatBytes(file.size)} • {formatDate(file.uploadTime)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-muted-foreground">
                                            {getStatusText(file.status)}
                                        </span>

                                        {file.status === 'uploading' && file.progress !== undefined && (
                                            <div className="w-20 bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full transition-width duration-200"
                                                    style={{ width: `${file.progress}%` }}
                                                />
                                            </div>
                                        )}

                                        {file.status === 'completed' && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeFile(file.id)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
