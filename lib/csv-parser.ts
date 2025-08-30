import { parse } from 'fast-csv'
import { Readable } from 'stream'

export interface CSVRow {
    [key: string]: string | number | boolean | null
}

export interface CSVMetadata {
    columns: string[]
    rowCount: number
    sampleRows: CSVRow[]
}

export async function parseCSVBuffer(buffer: Buffer): Promise<{ rows: CSVRow[], metadata: CSVMetadata }> {
    return new Promise((resolve, reject) => {
        const rows: CSVRow[] = []
        const sampleRows: CSVRow[] = []
        let columns: string[] = []
        let rowCount = 0

        const stream = Readable.from(buffer)

        stream
            .pipe(parse({ headers: true }))
            .on('data', (row: CSVRow) => {
                rows.push(row)
                rowCount++

                // Keep first 5 rows as sample
                if (sampleRows.length < 5) {
                    sampleRows.push(row)
                }

                // Extract columns from first row
                if (columns.length === 0) {
                    columns = Object.keys(row)
                }
            })
            .on('end', () => {
                resolve({
                    rows,
                    metadata: {
                        columns,
                        rowCount,
                        sampleRows
                    }
                })
            })
            .on('error', (error) => {
                reject(error)
            })
    })
}

export function inferColumnTypes(rows: CSVRow[]): Record<string, string> {
    if (rows.length === 0) return {}

    const columnTypes: Record<string, string> = {}
    const columns = Object.keys(rows[0])

    columns.forEach(column => {
        const values = rows.map(row => row[column]).filter(val => val !== null && val !== '')

        if (values.length === 0) {
            columnTypes[column] = 'string'
            return
        }

        // Check if all values are numbers
        const allNumbers = values.every(val => !isNaN(Number(val)) && val !== '')
        if (allNumbers) {
            columnTypes[column] = 'number'
            return
        }

        // Check if all values are booleans
        const allBooleans = values.every(val =>
            val === 'true' || val === 'false' || val === true || val === false
        )
        if (allBooleans) {
            columnTypes[column] = 'boolean'
            return
        }

        // Check if all values are dates
        const allDates = values.every(val => {
            const date = new Date(val as string)
            return !isNaN(date.getTime())
        })
        if (allDates) {
            columnTypes[column] = 'date'
            return
        }

        // Default to string
        columnTypes[column] = 'string'
    })

    return columnTypes
}
