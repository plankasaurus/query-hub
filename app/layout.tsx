import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Query Hub - CSV Data Analysis Platform',
    description: 'Upload CSV files, build queries, and visualize data with interactive charts',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="min-h-screen bg-background">
                    <header className="border-b">
                        <div className="container mx-auto px-4 py-4">
                            <h1 className="text-2xl font-bold text-primary">Query Hub</h1>
                            <p className="text-muted-foreground">CSV Data Analysis Platform</p>
                        </div>
                    </header>
                    <main className="container mx-auto px-4 py-8">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    )
}
