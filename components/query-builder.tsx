'use client'

import React, { useState } from 'react'
import { Database, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface QueryBuilderProps {
    onQueryChange: (query: string) => void
    onExecute: () => void
    query: string
}

export function QueryBuilder({ onQueryChange, onExecute, query }: QueryBuilderProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            onExecute()
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Database className="h-5 w-5" />
                        <span>Natural Language Query</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Ask questions about your data in plain English. For example: "Show me all employees with salary above 80000" or "What is the average age by department?"
                    </p>

                    <form onSubmit={handleSubmit} className="flex space-x-3">
                        <Input
                            placeholder="Type your query here..."
                            value={query}
                            onChange={(e) => onQueryChange(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit" disabled={!query.trim()}>
                            Execute Query
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
