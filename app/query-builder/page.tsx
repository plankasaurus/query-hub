'use client'

import React, { useState } from 'react'
import { QueryBuilder } from '@/components/query-builder'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Database, BarChart3, Download, MessageSquare, FileText, BarChart } from 'lucide-react'
import Link from 'next/link'

export default function QueryBuilderPage() {
    const [query, setQuery] = useState<string>('')
    const [queryResults, setQueryResults] = useState<any[]>([])
    const [isExecuting, setIsExecuting] = useState(false)
    const [executionTime, setExecutionTime] = useState<number | null>(null)
    const [queryHistory, setQueryHistory] = useState<Array<{ query: string, results: any[], timestamp: Date }>>([])

    const handleQueryChange = (newQuery: string) => {
        setQuery(newQuery)
    }

    const executeQuery = async () => {
        if (!query.trim()) return

        setIsExecuting(true)
        const startTime = Date.now()

        try {
            const response = await fetch('/api/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userQuery: query }),
            })

            if (response.ok) {
                const data = await response.json()
                setQueryResults(data.results || [])
                setExecutionTime(Date.now() - startTime)

                // Add to query history
                setQueryHistory(prev => [{
                    query: query,
                    results: data.results || [],
                    timestamp: new Date()
                }, ...prev.slice(0, 4)]) // Keep last 5 queries
            } else {
                console.error('Query execution failed:', response.statusText)
                setQueryResults([])
            }
        } catch (error) {
            console.error('Query execution failed:', error)
            setQueryResults([])
        } finally {
            setIsExecuting(false)
        }
    }

    const exportResults = () => {
        if (queryResults.length === 0) return

        // Export the data arrays from all results
        const allData = queryResults.flatMap(result => result.data)
        if (allData.length === 0) return

        const csvContent = [
            Object.keys(allData[0]).join(','),
            ...allData.map(row => Object.values(row).map(value =>
                typeof value === 'object' ? JSON.stringify(value) : String(value)
            ).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'query-results.csv'
        a.click()
        window.URL.revokeObjectURL(url)
    }

    // Helper function to render analysis content recursively
    const renderAnalysisContent = (content: any, depth: number = 0): React.ReactNode => {
        if (typeof content === 'string') {
            return <p className="text-sm leading-relaxed">{content}</p>
        }

        if (Array.isArray(content)) {
            return (
                <div className="space-y-2">
                    {content.map((item, index) => (
                        <div key={index} className="ml-4">
                            {renderAnalysisContent(item, depth + 1)}
                        </div>
                    ))}
                </div>
            )
        }

        if (typeof content === 'object' && content !== null) {
            return (
                <div className="space-y-3">
                    {Object.entries(content).map(([key, value]) => (
                        <div key={key} className="border-l-2 border-muted pl-4">
                            <h4 className="font-medium text-sm capitalize mb-2">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            {renderAnalysisContent(value, depth + 1)}
                        </div>
                    ))}
                </div>
            )
        }

        return <span className="text-sm">{String(content)}</span>
    }

    // Helper function to render data content recursively
    const renderDataContent = (data: any, depth: number = 0): React.ReactNode => {
        if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
            return <span className="text-sm">{String(data)}</span>
        }

        if (data === null || data === undefined) {
            return <span className="text-sm text-muted-foreground">-</span>
        }

        if (Array.isArray(data)) {
            return (
                <div className="space-y-1">
                    {data.map((item, index) => (
                        <div key={index} className="ml-2">
                            {renderDataContent(item, depth + 1)}
                        </div>
                    ))}
                </div>
            )
        }

        if (typeof data === 'object') {
            return (
                <div className="space-y-1">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="text-xs">
                            <span className="font-medium text-muted-foreground">{key}: </span>
                            {renderDataContent(value, depth + 1)}
                        </div>
                    ))}
                </div>
            )
        }

        return <span className="text-sm">{String(data)}</span>
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-primary">Query Builder</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Ask questions about your data in natural language and get instant answers.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Query Input Panel */}
                <div className="space-y-6">
                    <QueryBuilder
                        onQueryChange={handleQueryChange}
                        onExecute={executeQuery}
                        query={query}
                    />

                    {/* Query History */}
                    {queryHistory.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <MessageSquare className="h-5 w-5" />
                                    <span>Recent Queries</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {queryHistory.map((item, index) => (
                                    <div key={index} className="p-3 bg-muted rounded-lg">
                                        <p className="text-sm font-medium mb-1">{item.query}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.timestamp.toLocaleTimeString()} • {item.results.length} results
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Results Panel */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center space-x-2">
                                    <Database className="h-5 w-5" />
                                    <span>Query Results</span>
                                </span>
                                {executionTime && (
                                    <span className="text-sm text-muted-foreground">
                                        {executionTime}ms
                                    </span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isExecuting ? (
                                <div className="flex items-center justify-center h-32">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : queryResults.length > 0 ? (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            {queryResults.length} result{queryResults.length !== 1 ? 's' : ''}
                                        </span>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm" onClick={exportResults}>
                                                <Download className="h-4 w-4 mr-2" />
                                                Export
                                            </Button>
                                            <Link href="/charts">
                                                <Button size="sm">
                                                    <BarChart3 className="h-4 w-4 mr-2" />
                                                    Visualize
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Render each result with analysis and data */}
                                    {queryResults.map((result, resultIndex) => (
                                        <div key={resultIndex} className="space-y-4 border rounded-lg p-4">
                                            {/* Analysis Section */}
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-2">
                                                    <FileText className="h-4 w-4 text-blue-600" />
                                                    <h3 className="font-semibold text-lg">Analysis</h3>
                                                </div>

                                                {/* Overview */}
                                                {result.analysis?.overview && (
                                                    <div className="bg-blue-50 p-3 rounded-lg">
                                                        <h4 className="font-medium text-sm mb-2 text-blue-800">Overview</h4>
                                                        <p className="text-sm text-blue-700">{result.analysis.overview}</p>
                                                    </div>
                                                )}

                                                {/* Answer */}
                                                {result.analysis?.answer && (
                                                    <div className="bg-green-50 p-3 rounded-lg">
                                                        <h4 className="font-medium text-sm mb-2 text-green-800">Answer</h4>
                                                        <p className="text-sm text-green-700">{result.analysis.answer}</p>
                                                    </div>
                                                )}

                                                {/* Other analysis fields */}
                                                {result.analysis && Object.entries(result.analysis).map(([key, value]) => {
                                                    if (key === 'overview' || key === 'answer') return null;
                                                    return (
                                                        <div key={key} className="bg-muted p-3 rounded-lg">
                                                            <h4 className="font-medium text-sm mb-2 capitalize">
                                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                                            </h4>
                                                            {renderAnalysisContent(value)}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Data Section */}
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-2">
                                                    <BarChart className="h-4 w-4 text-purple-600" />
                                                    <h3 className="font-semibold text-lg">Data</h3>
                                                </div>

                                                {result.data && result.data.length > 0 ? (
                                                    <div className="border rounded-lg overflow-hidden">
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-sm">
                                                                <thead className="bg-muted">
                                                                    <tr>
                                                                        {Object.keys(result.data[0]).map(column => (
                                                                            <th key={column} className="px-3 py-2 text-left font-medium">
                                                                                {column}
                                                                            </th>
                                                                        ))}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {result.data.slice(0, 10).map((row: any, index: number) => (
                                                                        <tr key={index} className="border-t">
                                                                            {Object.values(row).map((value, colIndex) => (
                                                                                <td key={colIndex} className="px-3 py-2">
                                                                                    {renderDataContent(value)}
                                                                                </td>
                                                                            ))}
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        {result.data.length > 10 && (
                                                            <div className="px-3 py-2 text-sm text-muted-foreground border-t">
                                                                Showing first 10 of {result.data.length} data points
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-4 text-muted-foreground">
                                                        <p>No data available</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No results yet. Type a query and click Execute Query to see results.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
