import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/lib/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { StatusIndicator } from '@/components/ui/status-indicator'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'ABS Data Hub - Australian Bureau of Statistics Data Analysis Platform',
    description: 'Access, analyze, and visualize official Australian Bureau of Statistics data with interactive charts and advanced querying tools',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider>
                    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                            <div className="container mx-auto px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <div className="w-12 h-12 bg-gradient-to-br from-spotify-green via-australian-yellow to-spotify-light-green rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-3 transition-all duration-300">
                                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-australian-yellow rounded-full animate-pulse shadow-lg"></div>
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold bg-gradient-to-r from-spotify-green via-australian-yellow to-spotify-light-green bg-clip-text text-transparent">
                                                ABS Data Hub
                                            </h1>
                                            <p className="text-sm text-muted-foreground font-medium">
                                                Making Australian stats accessible
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                                            <StatusIndicator status="online" size="sm" />
                                            <span>Data available</span>
                                        </div>
                                        <ThemeToggle />
                                    </div>
                                </div>
                            </div>
                        </header>
                        <main className="container mx-auto px-6 py-8">
                            {children}
                        </main>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    )
}
