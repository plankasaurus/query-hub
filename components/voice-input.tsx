'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import '@/lib/speech-types'

interface VoiceInputProps {
    onTranscript: (text: string) => void
    onTranscriptUpdate: (text: string) => void
    isRecording: boolean
    onRecordingChange: (recording: boolean) => void
}

export function VoiceInput({ onTranscript, onTranscriptUpdate, isRecording, onRecordingChange }: VoiceInputProps) {
    const [isSupported, setIsSupported] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [currentTranscript, setCurrentTranscript] = useState('')
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const recognitionRef = useRef<any>(null)

    useEffect(() => {
        // Check if browser supports speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setIsSupported(true)
            // Initialize speech recognition
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            recognitionRef.current = new SpeechRecognition()
            recognitionRef.current.continuous = true
            recognitionRef.current.interimResults = true
            recognitionRef.current.lang = 'en-US'

            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = ''
                let interimTranscript = ''

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript
                    } else {
                        interimTranscript += transcript
                    }
                }

                // Accumulate the transcript and update the input field in real-time
                if (finalTranscript) {
                    const newTranscript = currentTranscript + ' ' + finalTranscript
                    setCurrentTranscript(newTranscript)
                    onTranscriptUpdate(newTranscript.trim())
                }
            }

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error)
                let errorMessage = 'Speech recognition error occurred'

                switch (event.error) {
                    case 'no-speech':
                        errorMessage = 'No speech detected. Please try speaking again.'
                        break
                    case 'audio-capture':
                        errorMessage = 'Microphone access denied. Please check your microphone permissions.'
                        break
                    case 'not-allowed':
                        errorMessage = 'Microphone access denied. Please allow microphone access and try again.'
                        break
                    case 'network':
                        errorMessage = 'Network error. Please check your internet connection.'
                        break
                    case 'service-not-allowed':
                        errorMessage = 'Speech recognition service not available.'
                        break
                }

                // Show error to user (you could add a toast notification here)
                console.warn(errorMessage)
                stopRecording()
            }

            recognitionRef.current.onend = () => {
                if (isRecording && !isPaused) {
                    // Restart if we're still supposed to be recording
                    recognitionRef.current?.start()
                }
            }
        }
    }, [isRecording, isPaused])

    const startRecording = async () => {
        try {
            if (isSupported && recognitionRef.current) {
                setCurrentTranscript('') // Reset transcript when starting new recording
                recognitionRef.current.start()
                onRecordingChange(true)
                setIsPaused(false)
            }
        } catch (error) {
            console.error('Failed to start recording:', error)
        }
    }

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
            // Send the complete accumulated transcript
            if (currentTranscript.trim()) {
                onTranscript(currentTranscript.trim())
            }
        }
        onRecordingChange(false)
        setIsPaused(false)
        setCurrentTranscript('') // Reset transcript
    }

    const pauseRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
            setIsPaused(true)
        }
    }

    const resumeRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.start()
            setIsPaused(false)
        }
    }

    if (!isSupported) {
        return (
            <Button
                variant="outline"
                disabled
                className="px-3"
                title="Voice input not supported in this browser"
            >
                <Mic className="h-4 w-4" />
            </Button>
        )
    }

    return (
        <div className="flex items-center space-x-2">
            {!isRecording ? (
                <Button
                    variant="outline"
                    onClick={startRecording}
                    className="px-3 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-800"
                    title="Start voice recording"
                    aria-label="Start voice recording"
                >
                    <Mic className="h-4 w-4" />
                </Button>
            ) : (
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        onClick={isPaused ? resumeRecording : pauseRecording}
                        className={`px-3 ${isPaused
                            ? 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
                            : 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                            }`}
                        title={isPaused ? "Resume recording" : "Pause recording"}
                        aria-label={isPaused ? "Resume recording" : "Pause recording"}
                    >
                        {isPaused ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={stopRecording}
                        className="px-3 bg-red-50 text-red-600 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-100"
                        title="Stop recording"
                        aria-label="Stop recording"
                    >
                        <Square className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {isRecording && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>{isPaused ? 'Paused' : 'Recording...'}</span>
                    <span className="text-xs text-muted-foreground">
                        {/* {isPaused ? 'Click to resume' : 'Speak now or click to pause'} */}
                    </span>
                </div>
            )}


        </div>
    )
}
