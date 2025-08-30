'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Database, Filter, BarChart3, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FilterCondition, GroupByConfig, AggregationConfig, SortConfig, QueryConfig } from '@/lib/query-builder'

interface QueryBuilderProps {
    availableColumns: string[]
    onQueryChange: (query: QueryConfig) => void
    onExecute: () => void
}

export function QueryBuilder({ availableColumns, onQueryChange, onExecute }: QueryBuilderProps) {
    const [query, setQuery] = useState<QueryConfig>({
        filters: [],
        groupBy: [],
        aggregations: [],
        sort: [],
        limit: 100
    })

    const [selectedFile, setSelectedFile] = useState<string>('')

    useEffect(() => {
        onQueryChange(query)
    }, [query, onQueryChange])

    const addFilter = () => {
        setQuery(prev => ({
            ...prev,
            filters: [...prev.filters, { field: '', operator: 'eq', value: '' }]
        }))
    }

    const updateFilter = (index: number, field: keyof FilterCondition, value: any) => {
        setQuery(prev => ({
            ...prev,
            filters: prev.filters.map((filter, i) =>
                i === index ? { ...filter, [field]: value } : filter
            )
        }))
    }

    const removeFilter = (index: number) => {
        setQuery(prev => ({
            ...prev,
            filters: prev.filters.filter((_, i) => i !== index)
        }))
    }

    const addGroupBy = () => {
        setQuery(prev => ({
            ...prev,
            groupBy: [...prev.groupBy, { field: '', alias: '' }]
        }))
    }

    const updateGroupBy = (index: number, field: keyof GroupByConfig, value: string) => {
        setQuery(prev => ({
            ...prev,
            groupBy: prev.groupBy.map((group, i) =>
                i === index ? { ...group, [field]: value } : group
            )
        }))
    }

    const removeGroupBy = (index: number) => {
        setQuery(prev => ({
            ...prev,
            groupBy: prev.groupBy.filter((_, i) => i !== index)
        }))
    }

    const addAggregation = () => {
        setQuery(prev => ({
            ...prev,
            aggregations: [...prev.aggregations, { field: '', operation: 'sum', alias: '' }]
        }))
    }

    const updateAggregation = (index: number, field: keyof AggregationConfig, value: any) => {
        setQuery(prev => ({
            ...prev,
            aggregations: prev.aggregations.map((agg, i) =>
                i === index ? { ...agg, [field]: value } : agg
            )
        }))
    }

    const removeAggregation = (index: number) => {
        setQuery(prev => ({
            ...prev,
            aggregations: prev.aggregations.filter((_, i) => i !== index)
        }))
    }

    const addSort = () => {
        setQuery(prev => ({
            ...prev,
            sort: [...prev.sort, { field: '', direction: 1 }]
        }))
    }

    const updateSort = (index: number, field: keyof SortConfig, value: any) => {
        setQuery(prev => ({
            ...prev,
            sort: prev.sort.map((sort, i) =>
                i === index ? { ...sort, [field]: value } : sort
            )
        }))
    }

    const removeSort = (index: number) => {
        setQuery(prev => ({
            ...prev,
            sort: prev.sort.filter((_, i) => i !== index)
        }))
    }

    const updateLimit = (value: string) => {
        const limit = parseInt(value) || 100
        setQuery(prev => ({ ...prev, limit }))
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Database className="h-5 w-5" />
                        <span>Query Builder</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Filters Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium flex items-center space-x-2">
                                <Filter className="h-4 w-4" />
                                <span>Filters</span>
                            </h3>
                            <Button onClick={addFilter} size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Filter
                            </Button>
                        </div>

                        {query.filters.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No filters applied</p>
                        ) : (
                            <div className="space-y-3">
                                {query.filters.map((filter, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <Select
                                            value={filter.field}
                                            onValueChange={(value) => updateFilter(index, 'field', value)}
                                        >
                                            <SelectTrigger className="w-40">
                                                <SelectValue placeholder="Select field" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableColumns.map(column => (
                                                    <SelectItem key={column} value={column}>
                                                        {column}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Select
                                            value={filter.operator}
                                            onValueChange={(value) => updateFilter(index, 'operator', value)}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="eq">Equals</SelectItem>
                                                <SelectItem value="ne">Not equals</SelectItem>
                                                <SelectItem value="gt">Greater than</SelectItem>
                                                <SelectItem value="gte">Greater than or equal</SelectItem>
                                                <SelectItem value="lt">Less than</SelectItem>
                                                <SelectItem value="lte">Less than or equal</SelectItem>
                                                <SelectItem value="in">In</SelectItem>
                                                <SelectItem value="nin">Not in</SelectItem>
                                                <SelectItem value="regex">Regex</SelectItem>
                                                <SelectItem value="exists">Exists</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Input
                                            placeholder="Value"
                                            value={filter.value}
                                            onChange={(e) => updateFilter(index, 'value', e.target.value)}
                                            className="flex-1"
                                        />

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeFilter(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Group By Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium flex items-center space-x-2">
                                <BarChart3 className="h-4 w-4" />
                                <span>Group By</span>
                            </h3>
                            <Button onClick={addGroupBy} size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Group
                            </Button>
                        </div>

                        {query.groupBy.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No grouping applied</p>
                        ) : (
                            <div className="space-y-3">
                                {query.groupBy.map((group, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <Select
                                            value={group.field}
                                            onValueChange={(value) => updateGroupBy(index, 'field', value)}
                                        >
                                            <SelectTrigger className="w-40">
                                                <SelectValue placeholder="Select field" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableColumns.map(column => (
                                                    <SelectItem key={column} value={column}>
                                                        {column}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Input
                                            placeholder="Alias (optional)"
                                            value={group.alias || ''}
                                            onChange={(e) => updateGroupBy(index, 'alias', e.target.value)}
                                            className="flex-1"
                                        />

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeGroupBy(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Aggregations Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium flex items-center space-x-2">
                                <BarChart3 className="h-4 w-4" />
                                <span>Aggregations</span>
                            </h3>
                            <Button onClick={addAggregation} size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Aggregation
                            </Button>
                        </div>

                        {query.aggregations.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No aggregations applied</p>
                        ) : (
                            <div className="space-y-3">
                                {query.aggregations.map((agg, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <Select
                                            value={agg.field}
                                            onValueChange={(value) => updateAggregation(index, 'field', value)}
                                        >
                                            <SelectTrigger className="w-40">
                                                <SelectValue placeholder="Select field" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableColumns.map(column => (
                                                    <SelectItem key={column} value={column}>
                                                        {column}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Select
                                            value={agg.operation}
                                            onValueChange={(value) => updateAggregation(index, 'operation', value)}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sum">Sum</SelectItem>
                                                <SelectItem value="avg">Average</SelectItem>
                                                <SelectItem value="min">Minimum</SelectItem>
                                                <SelectItem value="max">Maximum</SelectItem>
                                                <SelectItem value="count">Count</SelectItem>
                                                <SelectItem value="countDistinct">Count Distinct</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Input
                                            placeholder="Alias"
                                            value={agg.alias}
                                            onChange={(e) => updateAggregation(index, 'alias', e.target.value)}
                                            className="flex-1"
                                        />

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeAggregation(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sort Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium flex items-center space-x-2">
                                <ArrowUpDown className="h-4 w-4" />
                                <span>Sort</span>
                            </h3>
                            <Button onClick={addSort} size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Sort
                            </Button>
                        </div>

                        {query.sort.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No sorting applied</p>
                        ) : (
                            <div className="space-y-3">
                                {query.sort.map((sort, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <Select
                                            value={sort.field}
                                            onValueChange={(value) => updateSort(index, 'field', value)}
                                        >
                                            <SelectTrigger className="w-40">
                                                <SelectValue placeholder="Select field" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableColumns.map(column => (
                                                    <SelectItem key={column} value={column}>
                                                        {column}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Select
                                            value={sort.direction.toString()}
                                            onValueChange={(value) => updateSort(index, 'direction', parseInt(value))}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Ascending</SelectItem>
                                                <SelectItem value="-1">Descending</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSort(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Limit */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Result Limit</label>
                        <Input
                            type="number"
                            placeholder="100"
                            value={query.limit || 100}
                            onChange={(e) => updateLimit(e.target.value)}
                            className="w-32"
                        />
                    </div>

                    {/* Execute Button */}
                    <Button onClick={onExecute} className="w-full">
                        Execute Query
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
