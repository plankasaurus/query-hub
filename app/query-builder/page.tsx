'use client'

import React, { useState } from 'react'
import { QueryBuilder } from '@/components/query-builder'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Database, Play, BarChart3, Download, MessageSquare } from 'lucide-react'
import Link from 'next/link'

// Define the type for our mock data
type MockDataRow = {
    name: string
    age: number
    city: string
    salary: number
    department: string
    hire_date: string
}

// Mock data for demonstration - in real app this would come from API
const mockData: MockDataRow[] = [
    { name: 'John Doe', age: 30, city: 'New York', salary: 75000, department: 'Engineering', hire_date: '2020-01-15' },
    { name: 'Jane Smith', age: 28, city: 'San Francisco', salary: 80000, department: 'Marketing', hire_date: '2019-06-20' },
    { name: 'Bob Johnson', age: 35, city: 'Chicago', salary: 90000, department: 'Sales', hire_date: '2018-03-10' },
    { name: 'Alice Brown', age: 32, city: 'Boston', salary: 85000, department: 'Engineering', hire_date: '2021-02-28' },
    { name: 'Charlie Wilson', age: 29, city: 'Seattle', salary: 78000, department: 'Engineering', hire_date: '2020-08-15' },
]

export default function QueryBuilderPage() {
    const [query, setQuery] = useState<string>('')
    const [queryResults, setQueryResults] = useState<MockDataRow[]>([])
    const [isExecuting, setIsExecuting] = useState(false)
    const [executionTime, setExecutionTime] = useState<number | null>(null)
    const [queryHistory, setQueryHistory] = useState<Array<{ query: string, results: MockDataRow[], timestamp: Date }>>([])

    const handleQueryChange = (newQuery: string) => {
        setQuery(newQuery)
    }

    const executeQuery = async () => {
        if (!query.trim()) return

        setIsExecuting(true)
        const startTime = Date.now()

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Mock query execution - in real app this would call the API
            let results = [...mockData]

            // Simple mock logic based on query content
            if (query.toLowerCase().includes('salary') && query.toLowerCase().includes('above')) {
                const salaryMatch = query.match(/\d+/)
                if (salaryMatch) {
                    const threshold = parseInt(salaryMatch[0])
                    results = results.filter(row => row.salary > threshold)
                }
            } else if (query.toLowerCase().includes('department')) {
                const deptMatch = query.match(/engineering|marketing|sales/i)
                if (deptMatch) {
                    const dept = deptMatch[0].toLowerCase()
                    results = results.filter(row => row.department.toLowerCase() === dept)
                }
            } else if (query.toLowerCase().includes('age')) {
                if (query.toLowerCase().includes('average')) {
                    const avgAge = results.reduce((sum, row) => sum + row.age, 0) / results.length
                    results = [{ name: 'Average Age', age: Math.round(avgAge), city: '', salary: 0, department: '', hire_date: '' }]
                }
            }

            setQueryResults(results)
            setExecutionTime(Date.now() - startTime)

            // Add to query history
            setQueryHistory(prev => [{
                query: query,
                results: results,
                timestamp: new Date()
            }, ...prev.slice(0, 4)]) // Keep last 5 queries

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
        a.download = 'query-results.csv'
        a.click()
        window.URL.revokeObjectURL(url)
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
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            {queryResults.length} results
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
                                    <p>No results yet. Type a query and click Ask to see results.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
