
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { generateWithParts } from "../model"
import { createPartFromText } from '@google/genai';
import XLSX from 'xlsx';

const SI = `You are a data ingestion assistant. 
        Your job is to analyze a sample dataset (CSV, JSON, Excel workbooks, or other structured text), clean, 
        and standardize it and and produce structured metadata and standardized data:

       1. For each table in the dataset (including each sheet in an Excel workbook), produce a cleaned and standardized version of the table.
       2. Add a metadata field for each table, including the source of the dataset and short description of the table’s contents.
       3. Normalize column/field names to snake_case.
       4. Specify the datatype for each field (string, integer, float, boolean, date, datetime, categorical, etc.).
       5. Provide a short description of each field, inferred from the data if possible.

        Rules:
        - If a workbook contains multiple sheets or tables, treat each sheet/table separately and include them all in the output.
        - Never hallucinate fields that don’t exist in the data.
        - Output must be in strict JSON format, with a clear structure separating each table’s cleaned data and metadata.
        
        Suggested JSON output structure for Excel workbooks with multiple sheets:
        {
              metadata: {
                source: 'Australian Bureau of Statistics, Temporary visa holders in Australia 2021',
                description: 'Visa types of temporary visa holders in Australia in 2021, including the number of persons and their proportion.'
            },
            "tables": [
                {
                "sheet_name": "Sheet1",
                "metadata": {
                    "source": "example.xlsx",
                    "description": "Description of Sheet1"
                },
                "fields": [
                    {
                    "name": "column_name",
                    "datatype": "string",
                    "description": "Description of column"
                    }
                ],
                "data": [
                    {"column_name": "value1", "another_column": 123}
                ]
                },
                {
                "sheet_name": "Sheet2",
                "metadata": {
                    "source": "example.xlsx",
                    "description": "Description of Sheet2"
                },
                "fields": [...],
                "data": [...]
                }
            ]
        }
        `;

async function parse() {

    const testDataDir = path.join(__dirname, 'test-data');

    const testDataFiles = fs.readdirSync(testDataDir)
        .filter(file => file.endsWith('.csv'))
        .map(file => ({
            filename: file,
            filepath: path.join(testDataDir, file)
        }));

    for (const f of testDataFiles) {

        // 1. Read workbook
        const workbook = XLSX.readFile(f.filepath);

        // 2. Convert each sheet to JSON
        const sheetsData: Record<string, any[]> = {}; 
        workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            // Convert sheet to JSON array of rows
            sheetsData[sheetName] = XLSX.utils.sheet_to_json(sheet, { defval: null });
        });
        
    // const originalContent = fs.readFileSync(f.filepath, 'utf-8');
        

    const promptContents = [
      {text: "Parse this file, return the output as a JSON"},
        createPartFromText(JSON.stringify(sheetsData)),
    ]

    const standardizedData = await generateWithParts(SI, promptContents);
    console.log(standardizedData)
    }
}

parse();