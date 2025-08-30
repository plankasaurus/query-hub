'use client'

import React, { useState } from 'react'
import { ChartViewer } from '@/components/chart-viewer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Upload, Database, Download } from 'lucide-react'
import Link from 'next/link'

// Mock data for demonstration - in real app this would come from query results or API
const mockData = [
    { name: 'Engineering', count: 45, avgSalary: 85000, totalBudget: 3825000 },
    { name: 'Marketing', count: 32, avgSalary: 72000, totalBudget: 2304000 },
    { name: 'Sales', count: 28, avgSalary: 78000, totalBudget: 2184000 },
    { name: 'HR', count: 15, avgSalary: 65000, totalBudget: 975000 },
    { name: 'Finance', count: 22, avgSalary: 82000, totalBudget: 1804000 },
    { name: 'Operations', count: 18, avgSalary: 70000, totalBudget: 1260000 },
]

const mockColumns = ['name', 'count', 'avgSalary', 'totalBudget']

export default function ChartsPage() {
    const [selectedDataset, setSelectedDataset] = useState('department-stats')

    const datasets = [
        {
            id: 'department-stats',
            name: 'Department Statistics',
            description: 'Employee count, average salary, and total budget by department',
            data: mockData,
            columns: mockColumns
        },
        {
            id: 'salary-distribution',
            name: 'Salary Distribution',
            description: 'Salary ranges and employee distribution',
            data: [
                { range: '50k-60k', count: 12, percentage: 15 },
                { range: '60k-70k', count: 25, percentage: 31 },
                { range: '70k-80k', count: 28, percentage: 35 },
                { range: '80k-90k', count: 15, percentage: 19 }
            ],
            columns: ['range', 'count', 'percentage']
        },
        {
            id: 'city-breakdown',
            name: 'City Breakdown',
            description: 'Employee distribution across different cities',
            data: [
                { city: 'New York', count: 35, percentage: 25 },
                { city: 'San Francisco', count: 28, percentage: 20 },
                { city: 'Chicago', count: 22, percentage: 16 },
                { city: 'Boston', count: 18, percentage: 13 },
                { city: 'Seattle', count: 15, percentage: 11 },
                { city: 'Other', count: 20, percentage: 15 }
            ],
            columns: ['city', 'count', 'percentage']
        }
    ]

    const currentDataset = datasets.find(d => d.id === selectedDataset) || datasets[0]

    return (
        <div className="space-y-6">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-primary">Data Visualization</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Transform your data into interactive charts and graphs. Choose from multiple chart types and customize your visualizations.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Dataset Selector */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Datasets</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {datasets.map((dataset) => (
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
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {dataset.description}
                                    </p>
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
