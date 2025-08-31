'use client'

import React, { useState } from 'react'
import { QueryBuilder } from '@/components/query-builder'
import { SourceFileResults } from '@/components/source-file-results'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AnimatedLoading } from '@/components/ui/animated-loading'
import { Database, BarChart3, Download, History, ChevronDown, Sparkles, SearchCheck } from 'lucide-react'
import { DataJoinOut } from '@/lib/types'
import { Toast, useToast } from '@/components/ui/toast'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function QueryBuilderPage() {
    const [query, setQuery] = useState<string>('')
    const [queryResults, setQueryResults] = useState<DataJoinOut[]>([])
    const [aggregateAnswer, setAggregateAnswer] = useState<string>('')
    const [isExecuting, setIsExecuting] = useState(false)
    const [executionTime, setExecutionTime] = useState<number | null>(null)
    const [queryHistory, setQueryHistory] = useState<Array<{ query: string, results: DataJoinOut[], timestamp: Date, aggregateAnswer?: string }>>([])
    const [isVoiceInput, setIsVoiceInput] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast, showToast, hideToast } = useToast()

    const handleQueryChange = (newQuery: string) => {
        setQuery(newQuery)
    }

    const handleVoiceInput = (transcript: string) => {
        setQuery(transcript)
        setIsVoiceInput(true)
        // Clear previous results when starting a new voice input
        setQueryResults([])
        setAggregateAnswer('')
        setError(null)
        // Reset the flag after a short delay
        setTimeout(() => setIsVoiceInput(false), 3000)
    }

    const handleTranscriptUpdate = (transcript: string) => {
        // This handles real-time transcript updates during voice recording
        // Update the query field in real-time so user can see transcription happening
        setQuery(transcript)
        console.log('Real-time transcript update:', transcript)
    }

    const executeQuery = async () => {
        if (!query.trim()) return

        // Clear previous results and show loading state immediately
        setQueryResults([])
        setAggregateAnswer('')
        setError(null)
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

                if (data.success) {
                    setQueryResults(data.results || [])
                    setAggregateAnswer(data.aggregate || '')
                    setExecutionTime(Date.now() - startTime)

                    // Add to query history
                    setQueryHistory(prev => [{
                        query: query,
                        results: data.results || [],
                        timestamp: new Date(),
                        aggregateAnswer: data.aggregate || ''
                    }, ...prev.slice(0, 4)]) // Keep last 5 queries
                } else {
                    setError(data.message || 'Query failed - no relevant data found')
                    setQueryResults([])
                    setAggregateAnswer('')
                }
            } else {
                const errorData = await response.json().catch(() => ({}))
                const errorMessage = errorData.message || errorData.error || `Query failed with status: ${response.status}`
                setError(errorMessage)

                // Check for API key missing error and show toast
                if (errorMessage.includes('API_KEY_MISSING')) {
                    showToast('API key is missing. Please check configuration in deployment environment.', 'error')
                }

                console.error('Query execution failed:', response.statusText, errorData)
                setQueryResults([])
                setAggregateAnswer('')
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Network error occurred'
            setError(errorMessage)
            
            // Check if this might be an API key related error
            if (errorMessage.includes('API') || errorMessage.includes('key') || errorMessage.includes('authentication')) {
                showToast('API key configuration issue detected. Please check deployment settings.', 'error')
            }
            
            console.error('Query execution failed:', error)
            setQueryResults([])
            setAggregateAnswer('')
        } finally {
            setIsExecuting(false)
        }
    }

    const loadQueryFromHistory = (historyItem: { query: string, results: DataJoinOut[], timestamp: Date, aggregateAnswer?: string }) => {
        setQuery(historyItem.query)
        setQueryResults(historyItem.results)
        setAggregateAnswer(historyItem.aggregateAnswer || '')
        setExecutionTime(null) // Reset execution time when loading from history
    }

    const exportResults = () => {
        if (queryResults.length === 0) return

        // Group results by source file
        const groupedResults = queryResults.reduce((acc, result) => {
            const source = result.source
            if (!acc[source]) {
                acc[source] = []
            }
            acc[source].push(result)
            return acc
        }, {} as Record<string, DataJoinOut[]>)

        let exportedCount = 0

        // Export each source file as a separate CSV
        Object.entries(groupedResults).forEach(([source, sourceResults]) => {
            // Get all data from this source file
            const allData = sourceResults.flatMap(result => result.data_used)
            if (allData.length === 0) return

            try {
                // Create CSV content
                const csvContent = [
                    Object.keys(allData[0]).join(','),
                    ...allData.map(row => Object.values(row).map(value =>
                        typeof value === 'object' ? JSON.stringify(value) : String(value)
                    ).join(','))
                ].join('\n')

                // Create and download the file
                const blob = new Blob([csvContent], { type: 'text/csv' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url

                // Create a clean filename from the source
                const cleanSource = source.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_')
                a.download = `${cleanSource}_data.csv`

                a.click()
                window.URL.revokeObjectURL(url)
                exportedCount++
            } catch (error) {
                console.error(`Error exporting ${source}:`, error)
            }
        })

        // Show user feedback
        if (exportedCount > 0) {
            alert(`Successfully exported ${exportedCount} CSV file${exportedCount !== 1 ? 's' : ''}!`)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header Section */}
                <div className="text-center space-y-6 mb-12">
                    <h1 className="text-5xl font-bold">
                        Query Builder
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Ask questions about your data in natural language and get instant, intelligent answers with comprehensive analysis.
                    </p>
                </div>

                {/* Query Input Section - Full Width */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold">Natural Language Query</h2>

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
                                        <h3 className="font-medium text-base mb-2 text-muted-foreground">Recent Queries</h3>
                                        <div className="space-y-2">
                                            {queryHistory.map((item, index) => (
                                                <DropdownMenuItem
                                                    key={index}
                                                    onClick={() => loadQueryFromHistory(item)}
                                                    className="flex flex-col items-start p-3 cursor-pointer hover:bg-muted rounded-lg"
                                                >
                                                    <p className="text-base font-medium text-left line-clamp-2 mb-1">
                                                        {item.query}
                                                    </p>
                                                    <div className="flex items-center space-x-2 text-base text-muted-foreground">
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
                        onVoiceInput={handleVoiceInput}
                        isVoiceInput={isVoiceInput}
                        onTranscriptUpdate={handleTranscriptUpdate}
                    />

                    {/* Error Display */}
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-sm text-red-700 dark:text-red-300 font-medium">
                                    Error: {error}
                                </span>
                            </div>
                            {error.includes('API_KEY_MISSING') && (
                                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                                    The GEMINI_API_KEY environment variable is not set. Please check your deployment configuration.
                                </p>
                            )}
                            {error.includes('GEMINI_API_KEY') && !error.includes('API_KEY_MISSING') && (
                                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                                    Please set the GEMINI_API_KEY environment variable. See env.example for details.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Aggregate Answer Section */}
                {aggregateAnswer && (
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <SearchCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                                            Answer to Your Question
                                        </h3>
                                    </div>
                                </div>

                            </div>
                            <div className="bg-white dark:bg-slate-800/50 rounded-lg p-4 border">
                                <div className="prose prose-blue dark:prose-invert max-w-none dleading-relaxed text-base">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            // Custom styling for different markdown elements
                                            h1: ({ node, ...props }) => <h1 className="text-lg font-semibold mb-3 " {...props} />,
                                            h2: ({ node, ...props }) => <h2 className="text-base font-semibold mb-2 " {...props} />,
                                            h3: ({ node, ...props }) => <h3 className="text-sm font-semibold mb-2 " {...props} />,
                                            p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc list-outside mb-3 space-y-1 ml-4" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal list-outside mb-3 space-y-1 ml-4" {...props} />,
                                            li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                            strong: ({ node, ...props }) => <strong className="font-semibold " {...props} />,
                                            em: ({ node, ...props }) => <em className="italic" {...props} />,
                                            code: ({ node, ...props }) => <code className="bg-blue-50 dark:bg-blue-900/30 px-1 py-0.5 rounded text-xs font-mono" {...props} />,
                                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 pl-4 italic" {...props} />
                                        }}
                                    >
                                        {aggregateAnswer.replace(/\\n\\n/g, '\n\n')}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Section - Full Width */}
                {queryResults.length > 0 && (
                    <SourceFileResults
                        results={queryResults}
                        onExport={exportResults}
                        onVisualize={() => {
                            // Store query results in localStorage for charts page
                            localStorage.setItem('queryResults', JSON.stringify(queryResults))
                            window.location.href = '/charts'
                        }}
                    />
                )}

                {/* Empty State */}
                {!isExecuting && queryResults.length === 0 && (
                    <div className="text-center py-20">
                        <div className="max-w-md mx-auto space-y-6">
                            <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto">
                                <Database className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-semibold">Ready to Query Your Data</h3>
                                <p className="text-base text-muted-foreground">
                                    Type a natural language question above and click "Execute Query" to get started.
                                    Get insights, analysis, and data visualization.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isExecuting && (
                    <div className="text-center py-20">
                        <div className="max-w-md mx-auto space-y-6">
                            <LoadingSpinner size="xl" variant="spinner" className="mx-auto" />
                            <h3 className="text-2xl font-semibold">Processing Your Query</h3>
                            <AnimatedLoading />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
