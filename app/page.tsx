import Link from 'next/link'
import { Upload, BarChart3, Database, FileText, MapPin, TrendingUp, Users, Globe } from 'lucide-react'
import { GradientText } from '@/components/ui/gradient-text'
import { FloatingParticles } from '@/components/ui/floating-particles'

export default function HomePage() {
    return (
        <div className="space-y-12">
            {/* Hero Section - the main attraction */}
            <div className="text-center space-y-8 relative">
                <FloatingParticles count={30} className="opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-r from-spotify-green/10 via-australian-yellow/10 to-spotify-light-green/10 rounded-3xl blur-3xl"></div>
                <div className="relative">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-border/50 bg-muted/50 backdrop-blur-sm text-sm text-muted-foreground mb-6">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Data stuff, but smarter</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
                        <GradientText variant="blue" className="text-6xl md:text-7xl font-bold">
                            Make Sense of
                        </GradientText>
                        <br />
                        <GradientText variant="rainbow" className="text-6xl md:text-7xl font-bold">
                            Your Messy Data
                        </GradientText>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                        Tired of staring at spreadsheets? Upload your CSV files, ask questions in plain English,
                        and get answers that actually make sense. No more Excel nightmares.
                    </p>
                </div>
            </div>

            {/* Stats Section - some fun numbers */}
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-border/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                        <div className="text-3xl font-bold text-primary mb-2 " style={{ animationDelay: '1s' }}>⚡</div>
                        <div className="text-sm text-muted-foreground font-medium">Fast-ish Processing</div>
                    </div>
                    <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-green-500/10 border border-border/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                        <div className="text-3xl font-bold text-primary mb-2 " style={{ animationDelay: '2s' }}>🔮</div>
                        <div className="text-sm text-muted-foreground font-medium">Query Naturally</div>
                    </div>
                </div>
            </div>

            {/* Feature Cards - what this thing actually does */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                <Link href="/upload" className="group">
                    <div className="p-8 rounded-2xl spotify-card hover:shadow-2xl hover:shadow-spotify-green/20 group-hover:-translate-y-2 transition-all duration-500">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-spotify-green to-spotify-light-green rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Upload className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary">Drop Your Files</h3>
                        </div>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Drag & drop those CSV files you've been meaning to analyze. We'll figure out what's in them
                            and make sure they're not completely broken.
                        </p>
                        <div className="mt-6 flex items-center text-blue-500 font-medium group-hover:translate-x-2 transition-transform duration-300">
                            Let's Go
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </Link>

                <Link href="/query-builder" className="group">
                    <div className="p-8 rounded-2xl spotify-card hover:shadow-2xl hover:shadow-australian-yellow/20 group-hover:-translate-y-2 transition-all duration-500">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-australian-yellow to-australian-gold rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Database className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary">Ask Questions</h3>
                        </div>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Build queries without remembering SQL syntax. Just tell us what you want to know
                            and we'll figure out how to get it from your data.
                        </p>
                        <div className="mt-6 flex items-center text-purple-500 font-medium group-hover:translate-x-2 transition-transform duration-300">
                            Start Querying
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </Link>

                <Link href="/charts" className="group">
                    <div className="p-8 rounded-2xl spotify-card hover:shadow-2xl hover:shadow-australian-gold/20 group-hover:-translate-y-2 transition-all duration-500">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-australian-gold to-australian-red rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <BarChart3 className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary">Make Pretty Charts</h3>
                        </div>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Turn your boring data into charts that actually look good. Perfect for presentations
                            when you need to impress your boss.
                        </p>
                        <div className="mt-6 flex items-center text-cyan-500 font-medium group-hover:translate-x-2 transition-transform duration-300">
                            Visualize Stuff
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </Link>

                <Link href="/files" className="group">
                    <div className="p-8 rounded-2xl spotify-card hover:shadow-2xl hover:shadow-australian-red/20 group-hover:-translate-y-2 transition-all duration-500">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-australian-red to-australian-blue rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <FileText className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary">Keep Track</h3>
                        </div>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Manage all your uploaded files in one place. Because who remembers where they put
                            that important dataset from last month?
                        </p>
                        <div className="mt-6 flex items-center text-australian-red font-medium group-hover:translate-x-2 transition-transform duration-300">
                            Manage datasets
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Bottom CTA - the sales pitch */}
            <div className="text-center space-y-6">
                <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full border border-border/50 bg-muted/50 backdrop-blur-sm text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span>Built with Next.js, MongoDB, and probably some AI</span>
                </div>
                <p className="text-sm text-muted-foreground">
                    Ready to stop fighting with your data? Let's do this.
                </p>
            </div>
        </div>
    )
}
