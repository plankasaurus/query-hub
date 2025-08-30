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
                <h1 className="text-3xl font-bold text-abs-blue">Drop Your ABS Data Here</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Got census data? Economic surveys? Population estimates? We'll take whatever ABS datasets you throw at us
                    and make them ready for analysis.
                </p>
            </div>

            <FileUploader onUploadComplete={handleUploadComplete} />

            {uploadedFileId && (
                <Card className="border-abs-green/20 bg-abs-green/5">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-abs-green">
                            <CheckCircle className="h-5 w-5" />
                            <span>Nice! Your data's ready</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-abs-green/80 mb-4">
                            Your dataset made it through processing. Now you can start digging into the numbers:
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link href="/query-builder">
                                <Button className="w-full sm:w-auto bg-abs-green hover:bg-abs-green/90">
                                    <Database className="h-4 w-4 mr-2" />
                                    Start analyzing
                                </Button>
                            </Link>
                            <Link href="/files">
                                <Button variant="outline" className="w-full sm:w-auto border-abs-blue text-abs-blue hover:bg-abs-blue/10">
                                    <Upload className="h-4 w-4 mr-2" />
                                    See all datasets
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="text-abs-dark-blue">What happens to your data?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-abs-blue/10 rounded-lg flex items-center justify-center mx-auto">
                                <Upload className="h-6 w-6 text-abs-blue" />
                            </div>
                            <h3 className="font-semibold text-abs-blue">1. Upload</h3>
                            <p className="text-sm text-muted-foreground">
                                Drag and drop your CSV files or click to browse. We handle the rest.
                            </p>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-abs-green/10 rounded-lg flex items-center justify-center mx-auto">
                                <Database className="h-6 w-6 text-abs-green" />
                            </div>
                            <h3 className="font-semibold text-abs-green">2. Process</h3>
                            <p className="text-sm text-muted-foreground">
                                We figure out what your data contains and store it properly.
                            </p>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-abs-orange/10 rounded-lg flex items-center justify-center mx-auto">
                                <CheckCircle className="h-6 w-6 text-abs-orange" />
                            </div>
                            <h3 className="font-semibold text-abs-orange">3. Ready</h3>
                            <p className="text-sm text-muted-foreground">
                                Start querying, visualizing, and finding insights in your data.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-abs-dark-blue">Tips for better data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>• Make sure your CSV has headers in the first row</p>
                    <p>• Use consistent date formats (YYYY-MM-DD works best)</p>
                    <p>• Keep file sizes under 100MB for faster processing</p>
                    <p>• Include state/territory codes if you're working with geographic data</p>
                </CardContent>
            </Card>
        </div>
    )
}
