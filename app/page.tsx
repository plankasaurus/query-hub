import Link from 'next/link'
import { Upload, BarChart3, Database, FileText } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-primary">Welcome to Query Hub</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Upload CSV files, build powerful queries, and visualize your data with interactive charts.
                    Transform raw data into actionable insights.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <Link href="/upload" className="group">
                    <div className="p-6 border rounded-lg hover:border-primary transition-colors group-hover:shadow-lg">
                        <div className="flex items-center space-x-3 mb-4">
                            <Upload className="h-8 w-8 text-primary" />
                            <h3 className="text-lg font-semibold">Upload CSV</h3>
                        </div>
                        <p className="text-muted-foreground">
                            Drag and drop CSV files to upload and process them. Files are automatically parsed and stored in MongoDB.
                        </p>
                    </div>
                </Link>

                <Link href="/query-builder" className="group">
                    <div className="p-6 border rounded-lg hover:border-primary transition-colors group-hover:shadow-lg">
                        <div className="flex items-center space-x-3 mb-4">
                            <Database className="h-8 w-8 text-primary" />
                            <h3 className="text-lg font-semibold">Query Builder</h3>
                        </div>
                        <p className="text-muted-foreground">
                            Build complex queries with filters, grouping, and aggregations. Convert your logic into MongoDB pipelines.
                        </p>
                    </div>
                </Link>

                <Link href="/charts" className="group">
                    <div className="p-6 border rounded-lg hover:border-primary transition-colors group-hover:shadow-lg">
                        <div className="flex items-center space-x-3 mb-4">
                            <BarChart3 className="h-8 w-8 text-primary" />
                            <h3 className="text-lg font-semibold">Data Visualization</h3>
                        </div>
                        <p className="text-muted-foreground">
                            View your query results as interactive charts and graphs. Export data and share insights.
                        </p>
                    </div>
                </Link>

                <Link href="/files" className="group">
                    <div className="p-6 border rounded-lg hover:border-primary transition-colors group-hover:shadow-lg">
                        <div className="flex items-center space-x-3 mb-4">
                            <FileText className="h-8 w-8 text-primary" />
                            <h3 className="text-lg font-semibold">File Management</h3>
                        </div>
                        <p className="text-muted-foreground">
                            Browse uploaded files, view metadata, and manage your data sources.
                        </p>
                    </div>
                </Link>
            </div>

            <div className="text-center text-sm text-muted-foreground">
                <p>Built with Next.js 14, MongoDB, and Recharts</p>
            </div>
        </div>
    )
}
