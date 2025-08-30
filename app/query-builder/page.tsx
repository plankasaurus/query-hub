'use client'

import React, { useState } from 'react'
import { QueryBuilder } from '@/components/query-builder'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Database, BarChart3, Download, MessageSquare, FileText, BarChart, ChevronDown, History } from 'lucide-react'
import Link from 'next/link'
import { DataJoinOut } from '@/lib/types'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function QueryBuilderPage() {
    const [query, setQuery] = useState<string>('')
    const [queryResults, setQueryResults] = useState<DataJoinOut[]>([])
    const [isExecuting, setIsExecuting] = useState(false)
    const [executionTime, setExecutionTime] = useState<number | null>(null)
    const [queryHistory, setQueryHistory] = useState<Array<{ query: string, results: DataJoinOut[], timestamp: Date }>>([])

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

    const loadQueryFromHistory = (historyItem: { query: string, results: DataJoinOut[], timestamp: Date }) => {
        setQuery(historyItem.query)
        setQueryResults(historyItem.results)
        setExecutionTime(historyItem.timestamp.getTime())
    }

    const exportResults = () => {
        if (queryResults.length === 0) return

        // Export the data arrays from all results
        const allData = queryResults.flatMap(result => result.data_used)
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header Section */}
                <div className="text-center space-y-6 mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Query Builder
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Ask questions about your data in natural language and get instant, intelligent answers with comprehensive analysis.
                    </p>
                </div>

                {/* Query Input Section - Full Width */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-foreground">Natural Language Query</h2>

                        {/* Recent Queries Dropdown */}
                        {queryHistory.length > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="flex items-center space-x-2">
                                        <History className="h-4 w-4" />
                                        <span>Recent Queries</span>
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80">
                                    <div className="p-2">
                                        <h3 className="font-medium text-sm mb-2 text-muted-foreground">Recent Queries</h3>
                                        <div className="space-y-2">
                                            {queryHistory.map((item, index) => (
                                                <DropdownMenuItem
                                                    key={index}
                                                    onClick={() => loadQueryFromHistory(item)}
                                                    className="flex flex-col items-start p-3 cursor-pointer hover:bg-muted rounded-lg"
                                                >
                                                    <p className="text-sm font-medium text-left line-clamp-2 mb-1">
                                                        {item.query}
                                                    </p>
                                                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                                        <span>{item.timestamp.toLocaleDateString()}</span>
                                                        <span>•</span>
                                                        <span>{item.timestamp.toLocaleTimeString()}</span>
                                                        <span>•</span>
                                                        <span>{item.results.length} result{item.results.length !== 1 ? 's' : ''}</span>
                                                    </div>
                                                </DropdownMenuItem>
                                            ))}
                                        </div>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    <QueryBuilder
                        onQueryChange={handleQueryChange}
                        onExecute={executeQuery}
                        query={query}
                    />
                </div>

                {/* Results Section - Full Width */}
                {queryResults.length > 0 && (
                    <div className="space-y-8">
                        {/* Results Header */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-semibold text-foreground">Query Results</h2>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    <span>{queryResults.length} result{queryResults.length !== 1 ? 's' : ''}</span>
                                    {executionTime && (
                                        <>
                                            <span>•</span>
                                            <span>Executed in {executionTime}ms</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <Button variant="outline" onClick={exportResults}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Export Data
                                </Button>
                                <Link href="/charts">
                                    <Button>
                                        <BarChart3 className="h-4 w-4 mr-2" />
                                        Visualize
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Results Content */}
                        <div className="space-y-8">
                            {queryResults.map((result, resultIndex) => (
                                <Card key={resultIndex} className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                                    <CardContent className="p-8">
                                        {/* Analysis Section */}
                                        <div className="space-y-6 mb-8">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <h3 className="text-2xl font-semibold text-foreground">Analysis</h3>
                                            </div>

                                            {/* Result */}
                                            {result.result && (
                                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                                                    <h4 className="font-semibold text-lg mb-3 text-green-800 dark:text-green-200">Result</h4>
                                                    <p className="text-base leading-relaxed text-green-700 dark:text-green-300">{result.result}</p>
                                                </div>
                                            )}

                                            {/* Overview */}
                                            {result.overview && (
                                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                                                    <h4 className="font-semibold text-lg mb-3 text-blue-800 dark:text-blue-200">Overview</h4>
                                                    <p className="text-base leading-relaxed text-blue-700 dark:text-blue-300">{result.overview}</p>
                                                </div>
                                            )}

                                            {/* Key Findings */}
                                            {result.analysis?.key_findings && result.analysis.key_findings.length > 0 && (
                                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
                                                    <h4 className="font-semibold text-lg mb-3 text-amber-800 dark:text-amber-200">Key Findings</h4>
                                                    <ul className="space-y-2">
                                                        {result.analysis.key_findings.map((finding, index) => (
                                                            <li key={index} className="flex items-start space-x-2">
                                                                <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
                                                                <span className="text-base leading-relaxed text-amber-700 dark:text-amber-300">{finding}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Trends */}
                                            {result.analysis?.trends && result.analysis.trends.length > 0 && (
                                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                                                    <h4 className="font-semibold text-lg mb-3 text-purple-800 dark:text-purple-200">Trends</h4>
                                                    <ul className="space-y-2">
                                                        {result.analysis.trends.map((trend, index) => (
                                                            <li key={index} className="flex items-start space-x-2">
                                                                <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                                                                <span className="text-base leading-relaxed text-purple-700 dark:text-purple-300">{trend}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Source */}
                                            {result.source && (
                                                <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                                                    <h4 className="font-semibold text-lg mb-3 text-slate-800 dark:text-slate-200">Source</h4>
                                                    <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">{result.source}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Data Used Section */}
                                        <div className="space-y-6">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                                    <BarChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <h3 className="text-2xl font-semibold text-foreground">Data Used</h3>
                                            </div>

                                            {result.data_used && result.data_used.length > 0 ? (
                                                <div className="border rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-sm">
                                                            <thead className="bg-muted/50">
                                                                <tr>
                                                                    {Object.keys(result.data_used[0]).map(column => (
                                                                        <th key={column} className="px-6 py-4 text-left font-semibold text-foreground">
                                                                            {column}
                                                                        </th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {result.data_used.slice(0, 10).map((row: any, index: number) => (
                                                                    <tr key={index} className="border-t hover:bg-muted/30 transition-colors">
                                                                        {Object.values(row).map((value, colIndex) => (
                                                                            <td key={colIndex} className="px-6 py-4">
                                                                                {renderDataContent(value)}
                                                                            </td>
                                                                        ))}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    {result.data_used.length > 10 && (
                                                        <div className="px-6 py-4 text-sm text-muted-foreground border-t bg-muted/30">
                                                            Showing first 10 of {result.data_used.length} data points
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 text-muted-foreground">
                                                    <BarChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                                    <p className="text-lg">No data used in analysis</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isExecuting && queryResults.length === 0 && (
                    <div className="text-center py-20">
                        <div className="max-w-md mx-auto space-y-6">
                            <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto">
                                <Database className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-semibold text-foreground">Ready to Query Your Data</h3>
                                <p className="text-muted-foreground">
                                    Type a natural language question above and click "Execute Query" to get started.
                                    Get instant insights, analysis, and data visualization.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isExecuting && (
                    <div className="text-center py-20">
                        <div className="max-w-md mx-auto space-y-6">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-semibold text-foreground">Processing Your Query</h3>
                                <p className="text-muted-foreground">
                                    Analyzing your data and generating insights...
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
