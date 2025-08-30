'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, FileText, BarChart, Download, BarChart3 } from 'lucide-react'
import { DataJoinOut } from '@/lib/types'

interface SourceFileResultsProps {
    results: DataJoinOut[]
    onExport: () => void
    onVisualize: () => void
}

export function SourceFileResults({ results, onExport, onVisualize }: SourceFileResultsProps) {
    const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set())

    // Group results by source file
    const groupedResults = results.reduce((acc, result) => {
        const source = result.source
        if (!acc[source]) {
            acc[source] = []
        }
        acc[source].push(result)
        return acc
    }, {} as Record<string, DataJoinOut[]>)

    const toggleSource = (source: string) => {
        const newExpanded = new Set(expandedSources)
        if (newExpanded.has(source)) {
            newExpanded.delete(source)
        } else {
            newExpanded.add(source)
        }
        setExpandedSources(newExpanded)
    }

    // Helper function to render analysis content recursively
    const renderAnalysisContent = (content: any, depth: number = 0): React.ReactNode => {
        if (typeof content === 'string') {
            return <p className="text-base leading-relaxed">{content}</p>
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
                            <h4 className="font-medium text-base capitalize mb-2 text-green-600 dark:text-green-400">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            {renderAnalysisContent(value, depth + 1)}
                        </div>
                    ))}
                </div>
            )
        }

        return <span className="text-base">{String(content)}</span>
    }

    // Helper function to render data content recursively
    const renderDataContent = (data: any, depth: number = 0): React.ReactNode => {
        if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
            return <span className="text-base">{String(data)}</span>
        }

        if (data === null || data === undefined) {
            return <span className="text-base text-muted-foreground">-</span>
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
                        <div key={key} className="text-base">
                            <span className="font-medium text-muted-foreground">{key}: </span>
                            {renderDataContent(value, depth + 1)}
                        </div>
                    ))}
                </div>
            )
        }

        return <span className="text-base">{String(data)}</span>
    }

    return (
        <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400">Query Results</h2>
                    <div className="flex items-center space-x-4 text-base text-muted-foreground">
                        <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
                        <span>•</span>
                        <span>{Object.keys(groupedResults).length} source file{Object.keys(groupedResults).length !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                <div className="flex space-x-3">
                    <div className="flex flex-col items-end">
                        <Button variant="outline" onClick={onExport}>
                            <Download className="h-4 w-4 mr-2" />
                            Export Files
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">
                        </p>
                    </div>
                    <Button onClick={onVisualize}>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Visualize
                    </Button>
                </div>
            </div>

            {/* Source File Results */}
            <div className="space-y-6">
                {Object.entries(groupedResults).map(([source, sourceResults]) => (
                    <Card key={source} className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <CardContent className="p-0">
                            {/* Source File Header - Always Visible */}
                            <div
                                className="p-6 cursor-pointer hover:bg-muted/30 transition-colors border-b border-muted/20"
                                onClick={() => toggleSource(source)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                                                {source}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {sourceResults.length} result{sourceResults.length !== 1 ? 's' : ''} from this file
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {expandedSources.has(source) ? (
                                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                        ) : (
                                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Collapsible Content */}
                            {expandedSources.has(source) && (
                                <div className="p-6 space-y-8">
                                    {sourceResults.map((result, resultIndex) => (
                                        <div key={resultIndex} className="space-y-6">
                                            {/* Analysis Section */}
                                            <div className="space-y-6">
                                                <div className="flex items-center space-x-3 mb-4">
                                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                        <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <h4 className="text-lg font-semibold text-green-600 dark:text-green-400">Analysis</h4>
                                                </div>

                                                {/* Result */}
                                                {result.result && (
                                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                                                        <h5 className="font-semibold text-base mb-2 text-green-600 dark:text-green-400">Result</h5>
                                                        <p className="text-sm leading-relaxed">{result.result}</p>
                                                    </div>
                                                )}

                                                {/* Overview */}
                                                {result.overview && (
                                                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                                        <h5 className="font-semibold text-base mb-2 text-yellow-600 dark:text-yellow-400">Overview</h5>
                                                        <p className="text-sm leading-relaxed">{result.overview}</p>
                                                    </div>
                                                )}

                                                {/* Key Findings */}
                                                {result.analysis?.key_findings && result.analysis.key_findings.length > 0 && (
                                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                                                        <h5 className="font-semibold text-base mb-2 text-green-600 dark:text-green-400">Key Findings</h5>
                                                        <ul className="space-y-1">
                                                            {result.analysis.key_findings.map((finding, index) => (
                                                                <li key={index} className="flex items-start space-x-2">
                                                                    <span className="mt-1 text-green-600 dark:text-green-400">•</span>
                                                                    <span className="text-sm leading-relaxed">{finding}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Trends */}
                                                {result.analysis?.trends && result.analysis.trends.length > 0 && (
                                                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                                        <h5 className="font-semibold text-base mb-2 text-yellow-600 dark:text-yellow-400">Trends</h5>
                                                        <ul className="space-y-1">
                                                            {result.analysis.trends.map((trend, index) => (
                                                                <li key={index} className="flex items-start space-x-2">
                                                                    <span className="text-yellow-600 dark:text-yellow-400 mt-1">•</span>
                                                                    <span className="text-sm leading-relaxed">{trend}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Data Used Section */}
                                            <div className="space-y-4">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                                        <BarChart className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                                    </div>
                                                    <h4 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">Data Used</h4>
                                                </div>

                                                {result.data_used && result.data_used.length > 0 ? (
                                                    <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-sm">
                                                                <thead className="bg-muted/50">
                                                                    <tr>
                                                                        {Object.keys(result.data_used[0]).map(column => (
                                                                            <th key={column} className="px-4 py-3 text-left font-semibold text-foreground">
                                                                                {column}
                                                                            </th>
                                                                        ))}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {result.data_used.slice(0, 10).map((row: any, index: number) => (
                                                                        <tr key={index} className="border-t hover:bg-muted/30 transition-colors">
                                                                            {Object.values(row).map((value, colIndex) => (
                                                                                <td key={colIndex} className="px-4 py-3">
                                                                                    {renderDataContent(value)}
                                                                                </td>
                                                                            ))}
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        {result.data_used.length > 10 && (
                                                            <div className="px-4 py-3 text-sm text-muted-foreground border-t bg-muted/30">
                                                                Showing first 10 of {result.data_used.length} data points
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8 text-muted-foreground">
                                                        <BarChart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                                        <p className="text-base">No data used in analysis</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
