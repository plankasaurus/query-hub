import { NextRequest, NextResponse } from 'next/server'
import { buildMongoPipeline, validateQueryConfig, QueryConfig } from '@/lib/query-builder'
import { getRowsCollection } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const queryConfig: QueryConfig = body.query

        if (!queryConfig) {
            return NextResponse.json(
                { error: 'No query configuration provided' },
                { status: 400 }
            )
        }

        // Validate query configuration
        const validation = validateQueryConfig(queryConfig)
        if (!validation.valid) {
            return NextResponse.json(
                { error: 'Invalid query configuration', details: validation.errors },
                { status: 400 }
            )
        }

        // Build MongoDB aggregation pipeline
        const pipeline = buildMongoPipeline(queryConfig)

        // Execute query
        const rowsCollection = await getRowsCollection()
        const results = await rowsCollection.aggregate(pipeline).toArray()

        // Transform results for frontend consumption
        const transformedResults = results.map(result => {
            // If there's grouping, flatten the _id structure
            if (result._id && typeof result._id === 'object') {
                return { ...result._id, ...result }
            }
            return result
        })

        return NextResponse.json({
            success: true,
            results: transformedResults,
            count: transformedResults.length,
            pipeline: pipeline,
            executionTime: Date.now() // In real app, measure actual execution time
        })

    } catch (error) {
        console.error('Query execution error:', error)
        return NextResponse.json(
            { error: 'Failed to execute query' },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        // Return available columns from all files
        const rowsCollection = await getRowsCollection()

        // Get a sample of documents to extract column information
        const sampleDocs = await rowsCollection
            .aggregate([
                { $limit: 1000 },
                { $sample: { size: 10 } }
            ])
            .toArray()

        // Extract unique columns from sample documents
        const columns = new Set<string>()
        sampleDocs.forEach(doc => {
            if (doc.data) {
                Object.keys(doc.data).forEach(key => columns.add(key))
            }
        })

        return NextResponse.json({
            success: true,
            columns: Array.from(columns)
        })

    } catch (error) {
        console.error('Get columns error:', error)
        return NextResponse.json(
            { error: 'Failed to retrieve columns' },
            { status: 500 }
        )
    }
}
