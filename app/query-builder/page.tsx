'use client'

import React, { useState, useEffect } from 'react'
import { QueryBuilder } from '@/components/query-builder'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Database, Play, BarChart3, Download } from 'lucide-react'
import { QueryConfig } from '@/lib/query-builder'
import Link from 'next/link'

// Define the type for our row data
type DataRow = {
    name: string
    age: number
    city: string
    salary: number
    department: string
    hire_date: string
}

// Mock data for demonstration - in real app this would come from API
const mockColumns = ['name', 'age', 'city', 'salary', 'department', 'hire_date'] as const
const mockData: DataRow[] = [
    { name: 'John Doe', age: 30, city: 'New York', salary: 75000, department: 'Engineering', hire_date: '2020-01-15' },
    { name: 'Jane Smith', age: 28, city: 'San Francisco', salary: 80000, department: 'Marketing', hire_date: '2019-06-20' },
    { name: 'Bob Johnson', age: 35, city: 'Chicago', salary: 90000, department: 'Sales', hire_date: '2018-03-10' },
    { name: 'Alice Brown', age: 32, city: 'Boston', salary: 85000, department: 'Engineering', hire_date: '2021-02-28' },
    { name: 'Charlie Wilson', age: 29, city: 'Seattle', salary: 78000, department: 'Engineering', hire_date: '2020-08-15' },
]

export default function QueryBuilderPage() {
    const [currentQuery, setCurrentQuery] = useState<QueryConfig>({
        filters: [],
        groupBy: [],
        aggregations: [],
        sort: [],
        limit: 100
    })

    const [queryResults, setQueryResults] = useState<DataRow[]>([])
    const [queryResults, setQueryResults] = useState<DataRow[]>([])
    const [isExecuting, setIsExecuting] = useState(false)
    const [executionTime, setExecutionTime] = useState<number | null>(null)

    const handleQueryChange = (query: QueryConfig) => {
        setCurrentQuery(query)
    }

    const executeQuery = async () => {
        setIsExecuting(true)
        const startTime = Date.now()

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Mock query execution - in real app this would call the API
            let results = [...mockData]

            // Apply filters
            currentQuery.filters.forEach(filter => {
                if (filter.field && filter.value) {
                    results = results.filter(row => {
                        // Type-safe access to row properties
                        const fieldValue = row[filter.field as keyof DataRow]
                        switch (filter.operator) {
                            case 'eq':
                                return fieldValue == filter.value
                            case 'ne':
                                return fieldValue != filter.value
                            case 'gt':
                                return fieldValue > filter.value
                            case 'gte':
                                return fieldValue >= filter.value
                            case 'lt':
                                return fieldValue < filter.value
                            case 'lte':
                                return fieldValue <= filter.value
                            case 'regex':
                                return String(fieldValue).toLowerCase().includes(String(filter.value).toLowerCase())
                            default:
                                return true
                        }
                    })
                }
            })

            // Apply sorting
            if (currentQuery.sort.length > 0) {
                results.sort((a, b) => {
                    for (const sort of currentQuery.sort) {
                        if (sort.field) {
                            const aVal = a[sort.field as keyof DataRow]
                            const bVal = b[sort.field as keyof DataRow]
                            const aVal = a[sort.field as keyof DataRow]
                            const bVal = b[sort.field as keyof DataRow]
                            if (aVal < bVal) return sort.direction === 1 ? -1 : 1
                            if (aVal > bVal) return sort.direction === 1 ? 1 : -1
                        }
                    }
                    return 0
                })
            }

            // Apply limit
            if (currentQuery.limit) {
                results = results.slice(0, currentQuery.limit)
            }

            setQueryResults(results)
            setExecutionTime(Date.now() - startTime)

        } catch (error) {
            console.error('Query execution failed:', error)
            setQueryResults([])
        } finally {
            setIsExecuting(false)
        }
    }

    const exportResults = () => {
        if (queryResults.length === 0) return

        const csvContent = [
            Object.keys(queryResults[0]).join(','),
            ...queryResults.map(row => Object.values(row).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'abs-query-results.csv'
        a.click()
        window.URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-abs-green">Find the Stories in Your Data</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Ask questions, filter by what matters, and see what patterns emerge.
                    Whether you're comparing states or tracking trends, this is where the insights happen.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Query Builder Panel */}
                <div>
                    <QueryBuilder
                        availableColumns={mockColumns}
                        onQueryChange={handleQueryChange}
                        onExecute={executeQuery}
                    />
                </div>

                {/* Results Panel */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center space-x-2">
                                    <Database className="h-5 w-5 text-abs-blue" />
                                    <span>What we found</span>
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
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-abs-green"></div>
                                </div>
                            ) : queryResults.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            {queryResults.length} results
                                        </span>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm" onClick={exportResults} className="border-abs-blue text-abs-blue hover:bg-abs-blue/10">
                                                <Download className="h-4 w-4 mr-2" />
                                                Export
                                            </Button>
                                            <Link href="/charts">
                                                <Button size="sm" className="bg-abs-orange hover:bg-abs-orange/90">
                                                    <BarChart3 className="h-4 w-4 mr-2" />
                                                    Visualize
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="border rounded-lg overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-muted">
                                                    <tr>
                                                        {Object.keys(queryResults[0]).map(column => (
                                                            <th key={column} className="px-3 py-2 text-left font-medium">
                                                                {column}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {queryResults.slice(0, 10).map((row, index) => (
                                                        <tr key={index} className="border-t">
                                                            {Object.values(row).map((value, colIndex) => (
                                                                <td key={colIndex} className="px-3 py-2">
                                                                    {String(value)}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {queryResults.length > 10 && (
                                            <div className="px-3 py-2 text-sm text-muted-foreground border-t">
                                                Showing first 10 of {queryResults.length} results
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No results yet. Build a query and hit Execute to see what we find.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Query Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-abs-dark-blue">Your query breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span>Filters:</span>
                                <span className="font-medium">{currentQuery.filters.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Group By:</span>
                                <span className="font-medium">{currentQuery.groupBy.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Aggregations:</span>
                                <span className="font-medium">{currentQuery.aggregations.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Sort:</span>
                                <span className="font-medium">{currentQuery.sort.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Limit:</span>
                                <span className="font-medium">{currentQuery.limit || 'None'}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
