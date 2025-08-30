import Link from 'next/link'
import { Upload, BarChart3, Database, FileText } from 'lucide-react'
import { GradientText } from '@/components/ui/gradient-text'
import { FloatingParticles } from '@/components/ui/floating-particles'

export default function HomePage() {
    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-8 relative">
                <FloatingParticles count={30} className="opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-3xl"></div>
                <div className="relative">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-border/50 bg-muted/50 backdrop-blur-sm text-sm text-muted-foreground mb-6">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>AI-Powered Data Intelligence</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
                        <GradientText variant="blue" className="text-6xl md:text-7xl font-bold">
                            Transform Data
                        </GradientText>
                        <br />
                        <GradientText variant="rainbow" className="text-6xl md:text-7xl font-bold">
                            Into Intelligence
                        </GradientText>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                        Experience the future of data analysis with our next-generation platform.
                        Upload, query, and visualize with unprecedented speed and intelligence.
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-border/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                        <div className="text-3xl font-bold text-primary mb-2 animate-float">∞</div>
                        <div className="text-sm text-muted-foreground font-medium">Unlimited Queries</div>
                    </div>
                    <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-border/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                        <div className="text-3xl font-bold text-primary mb-2 animate-float" style={{ animationDelay: '1s' }}>⚡</div>
                        <div className="text-sm text-muted-foreground font-medium">Real-time Processing</div>
                    </div>
                    <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-green-500/10 border border-border/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                        <div className="text-3xl font-bold text-primary mb-2 animate-float" style={{ animationDelay: '2s' }}>🔮</div>
                        <div className="text-sm text-muted-foreground font-medium">AI Insights</div>
                    </div>
                    <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-border/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                        <div className="text-3xl font-bold text-primary mb-2 animate-float" style={{ animationDelay: '3s' }}>🚀</div>
                        <div className="text-sm text-muted-foreground font-medium">Lightning Fast</div>
                    </div>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                <Link href="/upload" className="group">
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-blue-500/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/10 group-hover:-translate-y-1 backdrop-blur-sm">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Upload className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary">Smart Upload</h3>
                        </div>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Drag & drop CSV files with intelligent parsing, automatic column detection, and instant data validation.
                        </p>
                        <div className="mt-6 flex items-center text-blue-500 font-medium group-hover:translate-x-2 transition-transform duration-300">
                            Get Started
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </Link>

                <Link href="/query-builder" className="group">
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-purple-500/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/10 group-hover:-translate-y-1 backdrop-blur-sm">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Database className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary">AI Query Builder</h3>
                        </div>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Build complex queries with natural language, intelligent suggestions, and real-time MongoDB pipeline generation.
                        </p>
                        <div className="mt-6 flex items-center text-purple-500 font-medium group-hover:translate-x-2 transition-transform duration-300">
                            Build Queries
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </Link>

                <Link href="/charts" className="group">
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-cyan-500/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-cyan-500/10 group-hover:-translate-y-1 backdrop-blur-sm">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <BarChart3 className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary">Interactive Visualizations</h3>
                        </div>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Transform data into stunning, interactive charts with AI-powered insights and real-time collaboration.
                        </p>
                        <div className="mt-6 flex items-center text-cyan-500 font-medium group-hover:translate-x-2 transition-transform duration-300">
                            Visualize Data
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </Link>

                <Link href="/files" className="group">
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-green-500/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-green-500/10 group-hover:-translate-y-1 backdrop-blur-sm">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary">Intelligent Management</h3>
                        </div>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Manage your data ecosystem with advanced metadata, version control, and intelligent file organization.
                        </p>
                        <div className="mt-6 flex items-center text-green-500 font-medium group-hover:translate-x-2 transition-transform duration-300">
                            Manage Files
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Bottom CTA */}
            <div className="text-center space-y-6">
                <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full border border-border/50 bg-muted/50 backdrop-blur-sm text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span>Powered by Next.js 14, MongoDB, and Advanced AI</span>
                </div>
                <p className="text-sm text-muted-foreground">
                    Join the future of data intelligence. Start your journey today.
                </p>
            </div>
        </div>
    )
}
