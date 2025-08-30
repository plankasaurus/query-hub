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
    const isInitializedRef = useRef(false)
    const currentTranscriptRef = useRef('')

    useEffect(() => {
        // Check if browser supports speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setIsSupported(true)
            initializeSpeechRecognition()
        }
    }, []) // Only run once on mount

    const initializeSpeechRecognition = () => {
        if (isInitializedRef.current) return

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onstart = () => {
            console.log('Speech recognition started successfully')
        }

        recognitionRef.current.onresult = (event: any) => {
            console.log('Speech recognition result event:', event)
            let finalTranscript = ''
            let interimTranscript = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript
                console.log(`Result ${i}: transcript="${transcript}", isFinal=${event.results[i].isFinal}`)
                if (event.results[i].isFinal) {
                    finalTranscript += transcript
                } else {
                    interimTranscript += transcript
                }
            }

            console.log('Final transcript:', finalTranscript)
            console.log('Interim transcript:', interimTranscript)

            // Accumulate the transcript and update the input field in real-time
            if (finalTranscript) {
                const newTranscript = currentTranscriptRef.current + ' ' + finalTranscript
                currentTranscriptRef.current = newTranscript
                setCurrentTranscript(newTranscript)
                console.log('Calling onTranscriptUpdate with:', newTranscript.trim())
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
            console.log('Speech recognition ended')
            if (isRecording && !isPaused) {
                // Restart if we're still supposed to be recording
                try {
                    console.log('Attempting to restart speech recognition...')
                    recognitionRef.current?.start()
                } catch (error) {
                    console.error('Failed to restart speech recognition:', error)
                    stopRecording()
                }
            }
        }

        isInitializedRef.current = true
    }

    const startRecording = async () => {
        console.log('=== START RECORDING ===')
        console.log('isSupported:', isSupported)
        console.log('recognitionRef.current:', !!recognitionRef.current)

        try {
            if (isSupported && recognitionRef.current) {
                console.log('Speech recognition instance found')

                // Reset transcript when starting new recording
                setCurrentTranscript('')
                currentTranscriptRef.current = ''
                console.log('Transcript state reset')

                // Try to start speech recognition directly
                console.log('Starting speech recognition...')
                recognitionRef.current.start()

                onRecordingChange(true)
                setIsPaused(false)
                console.log('Recording state updated')
            } else {
                console.log('Speech recognition not available')
                console.log('isSupported:', isSupported)
                console.log('recognitionRef.current:', !!recognitionRef.current)
            }
        } catch (error) {
            console.error('Failed to start recording:', error)
            // If there's an error, try to reinitialize
            isInitializedRef.current = false
            initializeSpeechRecognition()
        }
    }

    const stopRecording = () => {
        console.log('=== STOP RECORDING ===')
        console.log('currentTranscriptRef.current:', currentTranscriptRef.current)

        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop()
                console.log('Speech recognition stopped')
                // Send the complete accumulated transcript
                if (currentTranscriptRef.current.trim()) {
                    console.log('Sending final transcript:', currentTranscriptRef.current.trim())
                    onTranscript(currentTranscriptRef.current.trim())
                } else {
                    console.log('No transcript to send')
                }
            } catch (error) {
                console.error('Error stopping recording:', error)
            }
        }
        onRecordingChange(false)
        setIsPaused(false)
        setCurrentTranscript('') // Reset transcript
        currentTranscriptRef.current = ''
        console.log('Recording stopped')
    }

    const pauseRecording = () => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop()
                setIsPaused(true)
            } catch (error) {
                console.error('Error pausing recording:', error)
            }
        }
    }

    const resumeRecording = () => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start()
                setIsPaused(false)
            } catch (error) {
                console.error('Error resuming recording:', error)
            }
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

