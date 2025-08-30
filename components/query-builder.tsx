'use client'

import React, { useState } from 'react'
import { Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { VoiceInput } from '@/components/voice-input'

interface QueryBuilderProps {
    onQueryChange: (query: string) => void
    onExecute: () => void
    query: string
    onVoiceInput: (transcript: string) => void
    isVoiceInput: boolean
    onTranscriptUpdate: (transcript: string) => void
    onStopRecording?: () => void
}

export function QueryBuilder({ onQueryChange, onExecute, query, onVoiceInput, isVoiceInput, onTranscriptUpdate, onStopRecording }: QueryBuilderProps) {
    const [isRecording, setIsRecording] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            // Stop recording if it's active
            if (isRecording && onStopRecording) {
                onStopRecording()
            }
            onExecute()
        }
    }

    const handleVoiceTranscript = (transcript: string) => {
        onVoiceInput(transcript)
    }

    const handleTranscriptUpdate = (transcript: string) => {
        onTranscriptUpdate(transcript)
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
                        Ask questions about your data in plain English. You can type your query or use the microphone button for voice input. For example: "Show me all employees with salary above 80000" or "What is the average age by department?"
                    </p>

                    {/* Voice Input Indicator */}
                    {isVoiceInput && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-blue-700 dark:text-blue-300">
                                {/* Voice input detected! You can now execute your query or continue typing to modify it. */}
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex space-x-3">
                        <div className="flex-1 flex space-x-2">
                            <Input
                                placeholder="Type your query here or use voice input (updates in real-time)..."
                                value={query}
                                onChange={(e) => onQueryChange(e.target.value)}
                                className="flex-1"
                            />
                            <VoiceInput
                                onTranscript={handleVoiceTranscript}
                                onTranscriptUpdate={handleTranscriptUpdate}
                                isRecording={isRecording}
                                onRecordingChange={setIsRecording}
                            />
                        </div>
                        <Button type="submit" disabled={!query.trim() || isRecording}>
                            Execute Query
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
