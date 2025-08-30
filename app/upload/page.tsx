'use client'

import React, { useState } from 'react'
import { FileUploader } from '@/components/file-uploader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Database, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function UploadPage() {
    const [uploadedFileId, setUploadedFileId] = useState<string | null>(null)

    const handleUploadComplete = (fileId: string) => {
        setUploadedFileId(fileId)
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-primary">Upload Data Files</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Upload your data files to start analyzing data. Files are automatically parsed and stored in MongoDB for querying.
                </p>
            </div>

            <FileUploader onUploadComplete={handleUploadComplete} />

            {uploadedFileId && (
                <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-green-800">
                            <CheckCircle className="h-5 w-5" />
                            <span>Upload Successful!</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-green-700 mb-4">
                            Your data file has been successfully uploaded and processed. You can now:
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link href="/query-builder">
                                <Button className="w-full sm:w-auto">
                                    <Database className="h-4 w-4 mr-2" />
                                    Build Queries
                                </Button>
                            </Link>
                            <Link href="/files">
                                <Button variant="outline" className="w-full sm:w-auto">
                                    <Upload className="h-4 w-4 mr-2" />
                                    View All Files
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                                <Upload className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold">1. Upload</h3>
                            <p className="text-sm text-muted-foreground">
                                Drag and drop your data files or click to browse
                            </p>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                                <Database className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold">2. Process</h3>
                            <p className="text-sm text-muted-foreground">
                                Files are parsed and stored in MongoDB with metadata
                            </p>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                                <CheckCircle className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold">3. Ready</h3>
                            <p className="text-sm text-muted-foreground">
                                Start building queries and visualizing your data
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
