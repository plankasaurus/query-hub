import Link from 'next/link'
import { Upload, BarChart3, Database, FileText, MapPin, TrendingUp, Users, Globe } from 'lucide-react'
import { GradientText } from '@/components/ui/gradient-text'
import { FloatingParticles } from '@/components/ui/floating-particles'

export default function HomePage() {
    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-8 relative">
                <FloatingParticles count={30} className="opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-r from-spotify-green/10 via-australian-yellow/10 to-spotify-light-green/10 rounded-3xl blur-3xl"></div>
                <div className="relative">
                    <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full border border-border/50 bg-muted/50 backdrop-blur-sm text-sm text-muted-foreground mb-6 shadow-lg">
                        <div className="w-2 h-2 bg-australian-yellow rounded-full animate-pulse"></div>
                        <span>Trusted by researchers and policymakers</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
                        <GradientText variant="blue" className="text-6xl md:text-7xl font-bold">
                            Australia's
                        </GradientText>
                        <br />
                        <GradientText variant="rainbow" className="text-6xl md:text-7xl font-bold">
                            Statistical Backbone
                        </GradientText>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                        From population trends to economic indicators, explore the data that shapes our understanding of Australia. 
                        Built for researchers, analysts, and anyone who needs reliable statistics.
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-spotify-green/10 to-spotify-dark-green/10 border border-border/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300 shadow-lg">
                        <div className="text-3xl font-bold text-spotify-green mb-2 animate-float">25.7M</div>
                        <div className="text-sm text-muted-foreground font-medium">Australians counted</div>
                    </div>
                    <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-australian-yellow/10 to-spotify-green/10 border border-border/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300 shadow-lg">
                        <div className="text-3xl font-bold text-australian-yellow mb-2 animate-float" style={{ animationDelay: '1s' }}>8</div>
                        <div className="text-sm text-muted-foreground font-medium">States & territories</div>
                    </div>
                    <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-australian-gold/10 to-australian-red/10 border border-border/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300 shadow-lg">
                        <div className="text-3xl font-bold text-australian-gold mb-2 animate-float" style={{ animationDelay: '2s' }}>1905</div>
                        <div className="text-sm text-muted-foreground font-medium">ABS established</div>
                    </div>
                    <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-australian-red/10 to-spotify-green/10 border border-border/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300 shadow-lg">
                        <div className="text-3xl font-bold text-australian-red mb-2 animate-float" style={{ animationDelay: '3s' }}>🇦🇺</div>
                        <div className="text-sm text-muted-foreground font-medium">National coverage</div>
                    </div>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                <Link href="/upload" className="group">
                    <div className="p-8 rounded-2xl spotify-card hover:shadow-2xl hover:shadow-spotify-green/20 group-hover:-translate-y-2 transition-all duration-500">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-spotify-green to-spotify-light-green rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Upload className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-spotify-green">Get Your Data In</h3>
                        </div>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Whether it's the latest census data or economic surveys, upload your ABS datasets and we'll handle the rest. 
                            No more wrestling with spreadsheets.
                        </p>
                        <div className="mt-6 flex items-center text-spotify-green font-medium group-hover:translate-x-2 transition-transform duration-300">
                            Start uploading
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
                            <h3 className="text-2xl font-bold text-australian-yellow">Ask the Right Questions</h3>
                        </div>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Find the stories hidden in your data. Compare states, track trends over time, or dig into specific demographics. 
                            It's like having a conversation with your data.
                        </p>
                        <div className="mt-6 flex items-center text-australian-yellow font-medium group-hover:translate-x-2 transition-transform duration-300">
                            Start querying
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
                            <h3 className="text-2xl font-bold text-australian-gold">See What You're Missing</h3>
                        </div>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Turn numbers into insights. Our charts reveal patterns you might miss in raw data. 
                            Perfect for reports, presentations, or just understanding what's really happening.
                        </p>
                        <div className="mt-6 flex items-center text-australian-gold font-medium group-hover:translate-x-2 transition-transform duration-300">
                            Explore charts
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
                            <h3 className="text-2xl font-bold text-australian-red">Keep It Organized</h3>
                        </div>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            No more hunting through folders. All your datasets in one place with clear metadata, 
                            processing history, and quick access to what you need.
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

            {/* Bottom CTA */}
            <div className="text-center space-y-6">
                <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full border border-border/50 bg-muted/50 backdrop-blur-sm text-sm text-muted-foreground shadow-lg">
                    <div className="w-2 h-2 bg-spotify-green rounded-full animate-pulse"></div>
                    <span>Built with Next.js, MongoDB, and a lot of coffee</span>
                </div>
                <p className="text-sm text-muted-foreground">
                    Ready to dive into Australia's data? Your first dataset is just a click away.
                </p>
            </div>
        </div>
    )
}
