// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { generateWithParts } from '../model';
import { createPartFromText } from '@google/genai';

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

    // Convert to text for LLM
    const originalContent = buffer.toString('utf-8')

    // Call LLM to clean/standardize
    const promptContents = [
      {text: "Parse this file, return the output as a JSON"},
        createPartFromText(originalContent),
    ]

    const SI = `You are a data ingestion assistant. 
        Your job is to analyze a sample dataset (CSV, JSON, Excel workbooks, or other structured text), clean, and standardize it and produce:
        1. A cleaned and standardized the data.
        2. Add a metadata field that includes the source of this dataset and a description of the dataset contents
        3. Column/field names normalized to snake_case.
        4. Datatypes for each field (string, integer, float, boolean, date, datetime, categorical, etc.).
        5. A short description of each field, based on the data if possible.

        Rules:
        - Never hallucinate fields that don’t exist in the data.
        - Output must be in strict JSON format.`;

    const standardizedData = await generateWithParts(SI, promptContents);

    // Ensure uploads folder exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    // Sanitize filename (optional)
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 255)

    const filePath = path.join(uploadDir, safeName)
    await writeFile(filePath, JSON.stringify(standardizedData, null, 2), 'utf-8')

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
