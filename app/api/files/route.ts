import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

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
