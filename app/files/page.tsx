'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Calendar, Hash, Database, Eye, Trash2, Download, BarChart3 } from 'lucide-react'
import { formatBytes, formatDate } from '@/lib/utils'
import Link from 'next/link'

// Mock data for demonstration - in real app this would come from API
// const mockFiles = [
//     {
//         id: 'file_1',
//         name: 'employee_data.csv',
//         size: 245760,
//         uploadTime: new Date('2024-01-15T10:30:00'),
//         rowCount: 1250,
//         columns: ['id', 'name', 'email', 'department', 'salary', 'hire_date'],
//         status: 'processed'
//     },
//     {
//         id: 'file_2',
//         name: 'sales_data.csv',
//         size: 512000,
//         uploadTime: new Date('2024-01-14T14:20:00'),
//         rowCount: 3200,
//         columns: ['order_id', 'customer_id', 'product_id', 'quantity', 'price', 'date'],
//         status: 'processed'
//     },
//     {
//         id: 'file_3',
//         name: 'customer_feedback.csv',
//         size: 128000,
//         uploadTime: new Date('2024-01-13T09:15:00'),
//         rowCount: 850,
//         columns: ['customer_id', 'rating', 'comment', 'date', 'category'],
//         status: 'processing'
//     },
//     {
//         id: 'file_4',
//         name: 'inventory_data.csv',
//         size: 89000,
//         uploadTime: new Date('2024-01-12T16:45:00'),
//         rowCount: 450,
//         columns: ['product_id', 'name', 'category', 'stock', 'price'],
//         status: 'processed'
//     }
// ]


interface FileData {
    id: string
    name: string
    size: number
    uploadTime: Date
    rowCount: number
    columns: string[]
    status: string
}

export default function FilesPage() {
    const [files, setFiles] = useState<FileData[]>([])
    const [selectedFile, setSelectedFile] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const res = await fetch('/api/files')
                const data = await res.json()
                if (res.ok) {
                    setFiles(data.files)
                }
            } catch (error) {
                console.error('Failed to fetch files:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchFiles()
    }, [])

    // TODO: create a DELETE /api/files/[filename] to properly delete a file
    const deleteFile = (fileId: string) => {
        setFiles(prev => prev.filter(f => f.id !== fileId))
        if (selectedFile === fileId) setSelectedFile(null)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'processed':
                return 'text-green-600 bg-green-100'
            case 'processing':
                return 'text-yellow-600 bg-yellow-100'
            case 'error':
                return 'text-red-600 bg-red-100'
            default:
                return 'text-gray-600 bg-gray-100'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'processed':
                return <Database className="h-4 w-4" />
            case 'processing':
                return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
            case 'error':
                return <Database className="h-4 w-4" />
            default:
                return <FileText className="h-4 w-4" />
        }
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-primary">File Management</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Browse uploaded CSV files, view metadata, and manage your data sources.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* File List */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Uploaded Files</span>
                                <Link href="/upload">
                                    <Button size="sm">
                                        <FileText className="h-4 w-4 mr-2" />
                                        Upload New
                                    </Button>
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {files.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No files uploaded yet.</p>
                                    <Link href="/upload">
                                        <Button className="mt-4">Upload Your First File</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {files.map((file) => (
                                        <div
                                            key={file.id}
                                            className={`
                        p-4 border rounded-lg cursor-pointer transition-colors
                        ${selectedFile === file.id
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-muted hover:border-primary/50'
                                                }
                      `}
                                            onClick={() => setSelectedFile(file.id)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <FileText className="h-5 w-5 text-primary" />
                                                        <h3 className="font-medium">{file.name}</h3>
                                                        <span className={`
                              px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1
                              ${getStatusColor(file.status)}
                            `}>
                                                            {getStatusIcon(file.status)}
                                                            <span className="capitalize">{file.status}</span>
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                                                        {/* <div className="flex items-center space-x-1">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>{formatDate(file.uploadTime)}</span>
                                                        </div> */}
                                                        <div className="flex items-center space-x-1">
                                                            <Hash className="h-3 w-3" />
                                                            <span>{file.rowCount.toLocaleString()} rows</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Database className="h-3 w-3" />
                                                            <span>{file.columns.length} columns</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <span>{formatBytes(file.size)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex space-x-2">
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            deleteFile(file.id)
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* File Details */}
                <div className="space-y-4">
                    {selectedFile ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>File Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {(() => {
                                    const file = files.find(f => f.id === selectedFile)
                                    if (!file) return null

                                    return (
                                        <>
                                            <div>
                                                <h3 className="font-medium mb-2">Columns</h3>
                                                <div className="space-y-1">
                                                    {file.columns.map((column, index) => (
                                                        <div key={index} className="text-sm bg-muted px-2 py-1 rounded">
                                                            {column}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span>Total Rows:</span>
                                                    <span className="font-medium">{file.rowCount.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>File Size:</span>
                                                    <span className="font-medium">{formatBytes(file.size)}</span>
                                                </div>
                                                {/* <div className="flex justify-between text-sm">
                                                    <span>Upload Date:</span>
                                                    <span className="font-medium">{formatDate(file.uploadTime)}</span>
                                                </div> */}
                                            </div>

                                            <div className="flex space-x-2">
                                                <Link href="/query-builder" className="flex-1">
                                                    <Button className="w-full" size="sm">
                                                        <Database className="h-4 w-4 mr-2" />
                                                        Query Data
                                                    </Button>
                                                </Link>
                                                <Link href="/charts" className="flex-1">
                                                    <Button variant="outline" className="w-full" size="sm">
                                                        <BarChart3 className="h-4 w-4 mr-2" />
                                                        Visualize
                                                    </Button>
                                                </Link>
                                            </div>
                                        </>
                                    )
                                })()}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>File Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Select a file to view details</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span>Total Files:</span>
                                <span className="font-medium">{files.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Total Rows:</span>
                                <span className="font-medium">
                                    {files.reduce((sum, f) => sum + f.rowCount, 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Total Size:</span>
                                <span className="font-medium">
                                    {formatBytes(files.reduce((sum, f) => sum + f.size, 0))}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Processed:</span>
                                <span className="font-medium">
                                    {files.filter(f => f.status === 'processed').length}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
