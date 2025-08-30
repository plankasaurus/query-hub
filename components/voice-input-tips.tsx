'use client'

import React, { useState } from 'react'
import { Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function VoiceInputTips() {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                        <h4 className="font-medium text-blue-900 dark:text-blue-100">
                            Voice Input Tips
                        </h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <li>• Speak clearly and at a normal pace</li>
                            <li>• Use natural language: "Show me employees with salary above 50000"</li>
                            <li>• Click the microphone button to start, then speak your query</li>
                            <li>• Click the stop button when you're finished speaking</li>
                            <li>• You can edit the transcribed text before executing</li>
                        </ul>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVisible(false)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 p-1 h-auto"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
