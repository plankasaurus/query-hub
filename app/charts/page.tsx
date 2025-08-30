'use client'

import React, { useState, useEffect } from 'react'
import { ChartViewer } from '@/components/chart-viewer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Upload, Database, Download, AlertCircle } from 'lucide-react'
import Link from 'next/link'

import { DataJoinOut } from '@/lib/types'

// Fallback mock data when no query results are available
const fallbackData = [
    { name: 'Engineering', count: 45, avgSalary: 85000, totalBudget: 3825000 },
    { name: 'Marketing', count: 32, avgSalary: 72000, totalBudget: 2304000 },
    { name: 'Sales', count: 28, avgSalary: 78000, totalBudget: 2184000 },
    { name: 'HR', count: 15, avgSalary: 65000, totalBudget: 975000 },
    { name: 'Finance', count: 22, avgSalary: 82000, totalBudget: 1804000 },
    { name: 'Operations', count: 18, avgSalary: 70000, totalBudget: 1260000 },
]

const fallbackColumns = ['name', 'count', 'avgSalary', 'totalBudget']

export default function ChartsPage() {
    const [selectedDataset, setSelectedDataset] = useState('query-results')
    const [queryResults, setQueryResults] = useState<DataJoinOut[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Parse query results from localStorage
    useEffect(() => {
        try {
            const storedData = localStorage.getItem('queryResults')
            if (storedData) {
                const parsedData = JSON.parse(storedData)

                // Validate that the parsed data has the expected structure
                if (Array.isArray(parsedData) && parsedData.length > 0) {
                    // Check if it's a valid DataJoinOut[] structure
                    const isValidStructure = parsedData.every(item =>
                        item &&
                        typeof item === 'object' &&
                        'data_used' in item &&
                        Array.isArray(item.data_used)
                    )

                    if (isValidStructure) {
                        setQueryResults(parsedData)
                        console.log(`Loaded ${parsedData.length} query results with data_used`)
                    } else {
                        console.warn('Stored data does not have valid DataJoinOut structure')
                    }
                }

                // Clear the stored data after retrieving it
                localStorage.removeItem('queryResults')
            }
        } catch (error) {
            console.error('Failed to parse stored query data:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Generate datasets from query results using DataJoinOut.data_used
    const generateDatasetsFromQuery = (): Array<{
        id: string
        name: string
        description: string
        data: any[]
        columns: string[]
        source?: string
    }> => {
        if (!queryResults || queryResults.length === 0) {
            return []
        }

        return queryResults.map((result, index) => {
            // Only use results that have data_used with actual data
            if (!result.data_used || !Array.isArray(result.data_used) || result.data_used.length === 0) {
                return null
            }

            // Extract columns from the first data item
            const firstDataItem = result.data_used[0]
            if (!firstDataItem || typeof firstDataItem !== 'object') {
                return null
            }

            const columns = Object.keys(firstDataItem)
            if (columns.length === 0) {
                return null
            }

            return {
                id: `query-result-${index}`,
                name: `Query Result ${index + 1}`,
                description: result.result || `Data from query result ${index + 1}`,
                data: result.data_used,
                columns: columns,
                source: result.source || `Query ${index + 1}`
            }
        }).filter(Boolean) as Array<{
            id: string
            name: string
            description: string
            data: any[]
            columns: string[]
            source: string
        }>
    }

    // Combine query datasets with fallback datasets
    const queryDatasets = generateDatasetsFromQuery()
    const allDatasets: Array<{
        id: string
        name: string
        description: string
        data: any[]
        columns: string[]
        source?: string
    }> = [
            ...queryDatasets,
            // {
            //     id: 'department-stats',
            //     name: 'Department Statistics (Sample)',
            //     description: 'Employee count, average salary, and total budget by department',
            //     data: fallbackData,
            //     columns: fallbackColumns
            // },
            {
                id: 'salary-distribution',
                name: 'Salary Distribution (Sample)',
                description: 'Salary ranges and employee distribution',
                data: [
                    { range: '50k-60k', count: 12, percentage: 15 },
                    { range: '60k-70k', count: 25, percentage: 31 },
                    { range: '70k-80k', count: 28, percentage: 35 },
                    { range: '80k-90k', count: 15, percentage: 19 }
                ],
                columns: ['range', 'count', 'percentage'],
                source: 'Sample Data'
            },
            // {
            //     id: 'city-breakdown',
            //     name: 'City Breakdown (Sample)',
            //     description: 'Employee distribution across different cities',
            //     data: [
            //         { city: 'New York', count: 35, percentage: 25 },
            //         { city: 'San Francisco', count: 28, percentage: 20 },
            //         { city: 'Chicago', count: 22, percentage: 16 },
            //         { city: 'Boston', count: 18, percentage: 13 },
            //         { city: 'Seattle', count: 15, percentage: 11 },
            //         { city: 'Other', count: 20, percentage: 15 }
            //     ],
            //     columns: ['city', 'count', 'percentage']
            // }
        ]

    // Auto-select first query result if available, otherwise fallback to sample data
    useEffect(() => {
        if (queryDatasets.length > 0 && (selectedDataset === 'query-results' || !allDatasets.find(d => d.id === selectedDataset))) {
            setSelectedDataset(queryDatasets[0].id)
        } else if (queryDatasets.length === 0 && selectedDataset.startsWith('query-result')) {
            setSelectedDataset('department-stats')
        }
    }, [queryDatasets, selectedDataset, allDatasets])

    const currentDataset = allDatasets.find(d => d.id === selectedDataset) || allDatasets[0]

    // Show loading state
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold text-primary">Data Visualization</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Loading your query results...
                    </p>
                </div>
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-primary">Data Visualization</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {queryDatasets.length > 0
                        ? `Visualize your query results with interactive charts and graphs. ${queryDatasets.length} dataset${queryDatasets.length !== 1 ? 's' : ''} available from your query.`
                        : 'Transform your data into interactive charts and graphs. Choose from multiple chart types and customize your visualizations.'
                    }
                </p>

                {/* Query Results Notification */}
                {queryDatasets.length > 0 ? (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center space-x-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-medium text-green-800 dark:text-green-200">
                                    Query Results Available
                                </h3>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    Your query returned {queryDatasets.length} dataset{queryDatasets.length !== 1 ? 's' : ''}. Select a dataset above to start visualizing.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-medium text-blue-800 dark:text-blue-200">
                                    No Query Results
                                </h3>
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    No query results available. Using sample datasets for demonstration. Go to the Query Builder to run a query and visualize real data.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Action Button */}
                {queryDatasets.length === 0 && (
                    <div className="flex justify-center">
                        <Link href="/query-builder">
                            <Button className="bg-primary hover:bg-primary/90">
                                <Database className="h-4 w-4 mr-2" />
                                Go to Query Builder
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Debug Info - Remove in production */}
                {process.env.NODE_ENV === 'development' && queryResults.length > 0 && (
                    <div className="max-w-4xl mx-auto">
                        <details className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                            <summary className="cursor-pointer font-medium text-sm text-gray-700 dark:text-gray-300">
                                Debug: Query Results Structure
                            </summary>
                            <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 space-y-2">
                                <div>Total Results: {queryResults.length}</div>
                                {queryResults.map((result, index) => (
                                    <div key={index} className="ml-4">
                                        <div>Result {index + 1}:</div>
                                        <div className="ml-4">
                                            <div>• Has data_used: {Array.isArray(result.data_used) ? 'Yes' : 'No'}</div>
                                            <div>• data_used length: {Array.isArray(result.data_used) ? result.data_used.length : 'N/A'}</div>
                                            <div>• data_used type: {Array.isArray(result.data_used) ? 'Array' : typeof result.data_used}</div>
                                            {Array.isArray(result.data_used) && result.data_used.length > 0 && (
                                                <div>• First item keys: {Object.keys(result.data_used[0]).join(', ')}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </details>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Dataset Selector */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Datasets</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {allDatasets.map((dataset) => (
                                <button
                                    key={dataset.id}
                                    onClick={() => setSelectedDataset(dataset.id)}
                                    className={`
                    w-full text-left p-3 rounded-lg border transition-colors
                    ${selectedDataset === dataset.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-muted hover:border-primary/50'
                                        }
                  `}
                                >
                                    <h3 className="font-medium text-sm">{dataset.name}</h3>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {dataset.description}
                                    </p>
                                    {dataset.id.startsWith('query-result') && (
                                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                                            <span>{dataset.data.length} records</span>
                                            <span>{dataset.columns.length} columns</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link href="/upload">
                                <Button variant="outline" className="w-full justify-start">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload New Data
                                </Button>
                            </Link>
                            <Link href="/query-builder">
                                <Button variant="outline" className="w-full justify-start">
                                    <Database className="h-4 w-4 mr-2" />
                                    Build Query
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Chart Viewer */}
                <div className="lg:col-span-3">
                    {/* Data Preview for Query Results */}
                    {currentDataset.id.startsWith('query-result') && (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Database className="h-5 w-5" />
                                    <span>Data Preview</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">Records:</span> {currentDataset.data.length}
                                        </div>
                                        <div>
                                            <span className="font-medium">Columns:</span> {currentDataset.columns.join(', ')}
                                        </div>
                                    </div>
                                    {currentDataset.source && (
                                        <div className="text-sm text-muted-foreground">
                                            <span className="font-medium">Source:</span> {currentDataset.source}
                                        </div>
                                    )}
                                    {currentDataset.description && (
                                        <div className="text-sm text-muted-foreground">
                                            <span className="font-medium">Description:</span> {currentDataset.description}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <ChartViewer
                        data={currentDataset.data}
                        columns={currentDataset.columns}
                    />
                </div>
            </div>

            {/* Chart Types Guide */}
            <Card>
                <CardHeader>
                    <CardTitle>Chart Types Guide</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                                <BarChart3 className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="font-semibold">Bar Charts</h3>
                            <p className="text-sm text-muted-foreground">
                                Compare categories with rectangular bars
                            </p>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                                <BarChart3 className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="font-semibold">Line Charts</h3>
                            <p className="text-sm text-muted-foreground">
                                Show trends and changes over time
                            </p>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                                <BarChart3 className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="font-semibold">Pie Charts</h3>
                            <p className="text-sm text-muted-foreground">
                                Display parts of a whole as percentages
                            </p>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto">
                                <BarChart3 className="h-8 w-8 text-orange-600" />
                            </div>
                            <h3 className="font-semibold">Area Charts</h3>
                            <p className="text-sm text-muted-foreground">
                                Show volume and cumulative data
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
