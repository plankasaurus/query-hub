'use client'

import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Download, BarChart3, TrendingUp, PieChart as PieChartIcon, Square } from 'lucide-react'

interface ChartViewerProps {
    data: any[]
    columns: string[]
}

type ChartType = 'bar' | 'line' | 'pie' | 'area'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function ChartViewer({ data, columns }: ChartViewerProps) {
    const [chartType, setChartType] = useState<ChartType>('bar')
    const [xAxis, setXAxis] = useState<string>('')
    const [yAxis, setYAxis] = useState<string>('')
    const [pieField, setPieField] = useState<string>('')

    // Validate data structure and provide helpful error messages
    const validateDataStructure = () => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return { isValid: false, message: 'No data available' }
        }

        const firstItem = data[0]
        if (!firstItem || typeof firstItem !== 'object') {
            return { isValid: false, message: 'Data items must be objects' }
        }

        const keys = Object.keys(firstItem)
        if (keys.length === 0) {
            return { isValid: false, message: 'Data objects must have properties' }
        }

        // Check if all items have the same structure
        const hasConsistentStructure = data.every(item =>
            item && typeof item === 'object' &&
            Object.keys(item).length === keys.length &&
            keys.every(key => key in item)
        )

        if (!hasConsistentStructure) {
            return { isValid: false, message: 'Data items have inconsistent structure' }
        }

        return { isValid: true, message: 'Data structure is valid' }
    }

    // Auto-select first two columns if available
    React.useEffect(() => {
        if (columns.length >= 2 && !xAxis && !yAxis) {
            setXAxis(columns[0])
            setYAxis(columns[1])
        }
        if (columns.length >= 1 && !pieField) {
            setPieField(columns[0])
        }
    }, [columns, xAxis, yAxis, pieField])

    const renderChart = () => {
        const validation = validateDataStructure()

        if (!validation.isValid) {
            return (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                        <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>Data Validation Failed</p>
                        <p className="text-sm mt-2">{validation.message}</p>
                        <p className="text-xs mt-2 text-muted-foreground">
                            Expected: Array of objects with consistent properties
                        </p>
                    </div>
                </div>
            )
        }

        switch (chartType) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={xAxis} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey={yAxis} fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                )

            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={xAxis} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey={yAxis} stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                )

            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey={pieField}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                )

            case 'area':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={xAxis} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey={yAxis} stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                        </AreaChart>
                    </ResponsiveContainer>
                )

            default:
                return null
        }
    }

    const exportData = () => {
        const csvContent = [
            Object.keys(data[0] || {}).join(','),
            ...data.map(row => Object.values(row).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'chart-data.csv'
        a.click()
        window.URL.revokeObjectURL(url)
    }

    const getChartIcon = (type: ChartType) => {
        switch (type) {
            case 'bar':
                return <BarChart3 className="h-4 w-4" />
            case 'line':
                return <TrendingUp className="h-4 w-4" />
            case 'pie':
                return <PieChartIcon className="h-4 w-4" />
            case 'area':
                return <Square className="h-4 w-4" />
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Data Visualization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Chart Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Chart Type</label>
                            <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bar">
                                        <div className="flex items-center space-x-2">
                                            <BarChart3 className="h-4 w-4" />
                                            <span>Bar Chart</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="line">
                                        <div className="flex items-center space-x-2">
                                            <TrendingUp className="h-4 w-4" />
                                            <span>Line Chart</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="pie">
                                        <div className="flex items-center space-x-2">
                                            <PieChartIcon className="h-4 w-4" />
                                            <span>Pie Chart</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="area">
                                        <div className="flex items-center space-x-2">
                                            <Square className="h-4 w-4" />
                                            <span>Area Chart</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {chartType !== 'pie' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2">X Axis</label>
                                    <Select value={xAxis} onValueChange={setXAxis}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select X axis" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {columns.map(column => (
                                                <SelectItem key={column} value={column}>
                                                    {column}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Y Axis</label>
                                    <Select value={yAxis} onValueChange={setYAxis}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Y axis" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {columns.map(column => (
                                                <SelectItem key={column} value={column}>
                                                    {column}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}

                        {chartType === 'pie' && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Data Field</label>
                                <Select value={pieField} onValueChange={setPieField}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select data field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {columns.map(column => (
                                            <SelectItem key={column} value={column}>
                                                {column}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    {/* Chart Display */}
                    <div className="border rounded-lg p-4 bg-background">
                        {renderChart()}
                    </div>

                    {/* Data Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="font-semibold">Total Records</div>
                            <div className="text-2xl font-bold text-primary">{data.length}</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="font-semibold">Columns</div>
                            <div className="text-2xl font-bold text-primary">{columns.length}</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="font-semibold">Chart Type</div>
                            <div className="text-lg font-medium text-primary capitalize">{chartType}</div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={exportData}>
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
