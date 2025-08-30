'use client'

import React, { useState } from 'react'
import { ChartViewer } from '@/components/chart-viewer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Upload, Database, Download } from 'lucide-react'
import Link from 'next/link'

// Realistic ABS data for demonstration
const mockData = [
    { state: 'New South Wales', population: 8166000, median_age: 38.4, median_income: 85000, unemployment_rate: 4.2 },
    { state: 'Victoria', population: 6681000, median_age: 37.8, median_income: 82000, unemployment_rate: 4.1 },
    { state: 'Queensland', population: 5265000, median_age: 37.2, median_income: 78000, unemployment_rate: 4.5 },
    { state: 'Western Australia', population: 2752000, median_age: 36.9, median_income: 88000, unemployment_rate: 3.8 },
    { state: 'South Australia', population: 1771000, median_age: 40.1, median_income: 75000, unemployment_rate: 4.3 },
    { state: 'Tasmania', population: 541000, median_age: 42.3, median_income: 68000, unemployment_rate: 4.7 },
    { state: 'ACT', population: 456000, median_age: 35.7, median_income: 95000, unemployment_rate: 3.2 },
    { state: 'Northern Territory', population: 249000, median_age: 32.8, median_income: 72000, unemployment_rate: 4.9 },
]

const mockColumns = ['state', 'population', 'median_age', 'median_income', 'unemployment_rate']

export default function ChartsPage() {
    const [selectedDataset, setSelectedDataset] = useState('state-stats')

    const datasets = [
        {
            id: 'state-stats',
            name: 'State Overview',
            description: 'Population, demographics, and economic indicators by state/territory',
            data: mockData,
            columns: mockColumns
        },
        {
            id: 'population-distribution',
            name: 'Population Spread',
            description: 'How Australia\'s population is distributed across states and territories',
            data: [
                { state: 'NSW', population: 8166000, percentage: 32.1 },
                { state: 'VIC', population: 6681000, percentage: 26.3 },
                { state: 'QLD', population: 5265000, percentage: 20.7 },
                { state: 'WA', population: 2752000, percentage: 10.8 },
                { state: 'SA', population: 1771000, percentage: 7.0 },
                { state: 'TAS', population: 541000, percentage: 2.1 },
                { state: 'ACT', population: 456000, percentage: 1.8 },
                { state: 'NT', population: 249000, percentage: 1.0 }
            ],
            columns: ['state', 'population', 'percentage']
        },
        {
            id: 'economic-indicators',
            name: 'Economic Health',
            description: 'Income levels and employment rates across different states',
            data: [
                { state: 'ACT', median_income: 95000, unemployment_rate: 3.2, economic_rating: 'Excellent' },
                { state: 'WA', median_income: 88000, unemployment_rate: 3.8, economic_rating: 'Very Good' },
                { state: 'NSW', median_income: 85000, unemployment_rate: 4.2, economic_rating: 'Good' },
                { state: 'VIC', median_income: 82000, unemployment_rate: 4.1, economic_rating: 'Good' },
                { state: 'QLD', median_income: 78000, unemployment_rate: 4.5, economic_rating: 'Good' },
                { state: 'SA', median_income: 75000, unemployment_rate: 4.3, economic_rating: 'Fair' },
                { state: 'NT', median_income: 72000, unemployment_rate: 4.9, economic_rating: 'Fair' },
                { state: 'TAS', median_income: 68000, unemployment_rate: 4.7, economic_rating: 'Fair' }
            ],
            columns: ['state', 'median_income', 'unemployment_rate', 'economic_rating']
        }
    ]

    const currentDataset = datasets.find(d => d.id === selectedDataset) || datasets[0]

    return (
        <div className="space-y-6">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-abs-orange">Turn Numbers Into Stories</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Charts that actually make sense. See patterns, spot trends, and understand what your data is really telling you.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Dataset Selector */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-abs-blue">Pick your dataset</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {datasets.map((dataset) => (
                                <button
                                    key={dataset.id}
                                    onClick={() => setSelectedDataset(dataset.id)}
                                    className={`
                    w-full text-left p-3 rounded-lg border transition-colors
                    ${selectedDataset === dataset.id
                                            ? 'border-abs-blue bg-abs-blue/5'
                                            : 'border-muted hover:border-abs-blue/50'
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
                            <CardTitle className="text-abs-green">What next?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link href="/upload">
                                <Button variant="outline" className="w-full justify-start border-abs-blue text-abs-blue hover:bg-abs-blue/10">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Add more data
                                </Button>
                            </Link>
                            <Link href="/query-builder">
                                <Button variant="outline" className="w-full justify-start border-abs-green text-abs-green hover:bg-abs-green/10">
                                    <Database className="h-4 w-4 mr-2" />
                                    Build a query
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
                    <CardTitle className="text-abs-dark-blue">Chart types explained</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-abs-blue/10 rounded-lg flex items-center justify-center mx-auto">
                                <BarChart3 className="h-8 w-8 text-abs-blue" />
                            </div>
                            <h3 className="font-semibold text-abs-blue">Bar Charts</h3>
                            <p className="text-sm text-muted-foreground">
                                Compare states, territories, or categories side by side
                            </p>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-abs-green/10 rounded-lg flex items-center justify-center mx-auto">
                                <BarChart3 className="h-8 w-8 text-abs-green" />
                            </div>
                            <h3 className="font-semibold text-abs-green">Line Charts</h3>
                            <p className="text-sm text-muted-foreground">
                                Watch how things change over time - perfect for trends
                            </p>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-abs-orange/10 rounded-lg flex items-center justify-center mx-auto">
                                <BarChart3 className="h-8 w-8 text-abs-orange" />
                            </div>
                            <h3 className="font-semibold text-abs-orange">Pie Charts</h3>
                            <p className="text-sm text-muted-foreground">
                                See how the whole picture breaks down into parts
                            </p>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-abs-red/10 rounded-lg flex items-center justify-center mx-auto">
                                <BarChart3 className="h-8 w-8 text-abs-red" />
                            </div>
                            <h3 className="font-semibold text-abs-red">Area Charts</h3>
                            <p className="text-sm text-muted-foreground">
                                Show volume and how things stack up over time
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
