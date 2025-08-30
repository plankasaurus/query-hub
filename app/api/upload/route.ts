// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      return NextResponse.json({ error: 'Only CSV files are supported' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure uploads folder exists (in project root)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    // Save file
    const filePath = path.join(uploadDir, file.name)
    await writeFile(filePath, buffer)

    return NextResponse.json({
      success: true,
      path: `/uploads/${file.name}`, // can be accessed in browser
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 })
  }
}

// optional: GET for latest files
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
      files: files.map((file) => ({
        id: file._id.toString(),
        name: file.name,
        size: file.size,
        uploadTime: file.uploadTime,
        rowCount: file.rowCount,
        columns: file.columns,
        status: file.status,
      })),
    })
  } catch (err) {
    console.error('Get files error:', err)
    return NextResponse.json(
      { error: 'Failed to retrieve files' },
      { status: 500 }
    )
  }
}
