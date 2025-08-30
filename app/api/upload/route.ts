import { NextRequest, NextResponse } from 'next/server'
import { parseCSVBuffer, inferColumnTypes } from '@/lib/csv-parser'
import { getFilesCollection, getRowsCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        if (!file.name.toLowerCase().endsWith('.csv')) {
            return NextResponse.json(
                { error: 'Only CSV files are supported' },
                { status: 400 }
            )
        }

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer())

        // Parse CSV
        const { rows, metadata } = await parseCSVBuffer(buffer)
        const columnTypes = inferColumnTypes(rows)

        // Generate file ID
        const fileId = new ObjectId()

        // Store file metadata
        const filesCollection = await getFilesCollection()
        const fileMetadata = {
            _id: fileId,
            name: file.name,
            size: file.size,
            uploadTime: new Date(),
            rowCount: metadata.rowCount,
            columns: metadata.columns,
            columnTypes,
            sampleRows: metadata.sampleRows,
            status: 'processed'
        }

        await filesCollection.insertOne(fileMetadata)

        // Store rows in batches
        const rowsCollection = await getRowsCollection()
        const rowDocuments = rows.map((row, index) => ({
            fileId,
            rowIndex: index,
            data: row
        }))

        // Insert rows in batches of 1000
        const batchSize = 1000
        for (let i = 0; i < rowDocuments.length; i += batchSize) {
            const batch = rowDocuments.slice(i, i + batchSize)
            await rowsCollection.insertMany(batch)
        }

        return NextResponse.json({
            success: true,
            fileId: fileId.toString(),
            metadata: {
                name: file.name,
                size: file.size,
                rowCount: metadata.rowCount,
                columns: metadata.columns,
                columnTypes
            }
        })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Failed to process file' },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const filesCollection = await getFilesCollection()
        const files = await filesCollection
            .find({})
            .sort({ uploadTime: -1 })
            .limit(100)
            .toArray()

        return NextResponse.json({
            success: true,
            files: files.map(file => ({
                id: file._id.toString(),
                name: file.name,
                size: file.size,
                uploadTime: file.uploadTime,
                rowCount: file.rowCount,
                columns: file.columns,
                status: file.status
            }))
        })

    } catch (error) {
        console.error('Get files error:', error)
        return NextResponse.json(
            { error: 'Failed to retrieve files' },
            { status: 500 }
        )
    }
}
