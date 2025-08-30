// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure uploads folder exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    // Sanitize filename (optional)
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 255)

    const filePath = path.join(uploadDir, safeName)
    await writeFile(filePath, buffer)

    return NextResponse.json({
      success: true,
      path: `/uploads/${safeName}`,
      name: file.name,
      size: file.size
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    const files = await fs.readdir(uploadDir)

    const fileData = await Promise.all(
      files.map(async (filename) => {
        const filePath = path.join(uploadDir, filename)
        const stats = await fs.stat(filePath)

        return {
          id: filename, // use filename as ID
          name: filename,
          size: stats.size,
          uploadTime: stats.mtime, // last modified time
          rowCount: 0, // optional: could parse CSV to get row count
          columns: [], // optional: could parse CSV to get columns
          status: 'processed',
          path: `/uploads/${filename}`
        }
      })
    )

    return NextResponse.json({ success: true, files: fileData })
  } catch (error) {
    console.error('Error reading uploads folder:', error)
    return NextResponse.json({ success: false, error: 'Failed to list files' }, { status: 500 })
  }
}
