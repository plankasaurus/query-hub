import { NextRequest, NextResponse } from 'next/server'
import { getRowsCollection } from '@/lib/mongodb'
import { DataJoinOut } from '@/lib/types'
import { querySeedAndKV } from './queryAction'
import { generateWithParts } from '../model'

const transformedResults_PLACEHOLDER: DataJoinOut[] = [
    {
        "filename": "my file.csv",
        "result": "The total number of registered marriages and the crude marriage rate both experienced a decrease from 2019 to 2020, coinciding with the COVID-19 pandemic. There was a rebound in 2021, followed by a further increase in 2022. The pandemic years (2020-2021) show a dip in both metrics, with 2022 showing signs of recovery beyond pre-pandemic levels.",
        "overview": "The analysis focuses on the year-on-year changes in the total number of registered marriages and the crude marriage rate, particularly examining the impact of the COVID-19 pandemic (2020-2021) and subsequent recovery. The analysis calculates the percentage change for both metrics to quantify the impact and recovery.",
        "source": "my file.csv",
        "analysis": {
            "key_findings": [
                "Both the total number of registered marriages and the crude marriage rate decreased from 2019 to 2020, indicating a negative impact from the COVID-19 pandemic.",
                "2021 saw a rebound in both metrics compared to 2020, suggesting an initial recovery phase.",
                "2022 shows a further increase in both the total number of registered marriages and the crude marriage rate, surpassing pre-pandemic levels (2019).",
                "The largest year-on-year decrease in total registered marriages was between 2019 and 2020 (-16.84%).",
                "The largest year-on-year increase in total registered marriages was between 2020 and 2021 (24.64%).",
                "The largest year-on-year decrease in crude marriage rate was between 2019 and 2020 (-16.67%).",
                "The largest year-on-year increase in crude marriage rate was between 2020 and 2021 (24.07%)."
            ],
            "trends": [
                "A downward trend in both total registered marriages and crude marriage rate during the peak of the COVID-19 pandemic (2020).",
                "An upward trend in both metrics following the initial pandemic year, indicating a recovery phase (2021 and 2022)."
            ]
        },
        "data_used": [
            {
                "year": 2019,
                "registered_marriages": 927000,
                "crude_marriage_rate": 6
            },
            {
                "year": 2020,
                "registered_marriages": 771000,
                "crude_marriage_rate": 5
            },
            {
                "year": 2021,
                "registered_marriages": 961000,
                "crude_marriage_rate": 6.2
            },
            {
                "year": 2022,
                "registered_marriages": 1079000,
                "crude_marriage_rate": 6.9
            }
        ]
    },
    {
        "filename": "your file.csv",
        "result": "The total number of registered marriages and the crude marriage rate both experienced a decrease from 2019 to 2020, coinciding with the COVID-19 pandemic. There was a rebound in 2021, followed by a further increase in 2022. The pandemic years (2020-2021) show a dip in both metrics, with 2022 showing signs of recovery beyond pre-pandemic levels.",
        "overview": "The analysis focuses on the year-on-year changes in the total number of registered marriages and the crude marriage rate, particularly examining the impact of the COVID-19 pandemic (2020-2021) and subsequent recovery. The analysis calculates the percentage change for both metrics to quantify the impact and recovery.",
        "source": "your file.csv",
        "analysis": {
            "key_findings": [
                "Both the total number of registered marriages and the crude marriage rate decreased from 2019 to 2020, indicating a negative impact from the COVID-19 pandemic.",
                "2021 saw a rebound in both metrics compared to 2020, suggesting an initial recovery phase.",
                "2022 shows a further increase in both the total number of registered marriages and the crude marriage rate, surpassing pre-pandemic levels (2019).",
                "The largest year-on-year decrease in total registered marriages was between 2019 and 2020 (-16.84%).",
                "The largest year-on-year increase in total registered marriages was between 2020 and 2021 (24.64%).",
                "The largest year-on-year decrease in crude marriage rate was between 2019 and 2020 (-16.67%).",
                "The largest year-on-year increase in crude marriage rate was between 2020 and 2021 (24.07%)."
            ],
            "trends": [
                "A downward trend in both total registered marriages and crude marriage rate during the peak of the COVID-19 pandemic (2020).",
                "An upward trend in both metrics following the initial pandemic year, indicating a recovery phase (2021 and 2022)."
            ]
        },
        "data_used": [
            {
                "year": 2019,
                "registered_marriages": 927000,
                "crude_marriage_rate": 6
            },
            {
                "year": 2020,
                "registered_marriages": 771000,
                "crude_marriage_rate": 5
            },
            {
                "year": 2021,
                "registered_marriages": 961000,
                "crude_marriage_rate": 6.2
            },
            {
                "year": 2022,
                "registered_marriages": 1079000,
                "crude_marriage_rate": 6.9
            }
        ]
    }
]

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { userQuery } = body

        if (!userQuery || typeof userQuery !== 'string') {
            return NextResponse.json(
                { error: 'No user query provided or invalid format' },
                { status: 400 }
            )
        }
        const useableResponse = await generateWithParts(
            `You're an expert data analyst helping answer questions based on datasets. 
            `,
            [
                { text: "Tell me if the following user query makes sense, if it is non sensicale return { useable: False }, if it makes sense return {useable True} as a JSON. " },

                { text: userQuery },


            ]
        );
        console.log("useable response", useableResponse);
        if (!useableResponse.useable) {
            return NextResponse.json({
                success: false,
                message: "Unable to understand query, please try again."
            })
        }

        console.log("hi query route", userQuery);
        console.log(querySeedAndKV);
        let transformedResults;
        try {
            transformedResults = await querySeedAndKV(userQuery);
        } catch (error) {
            console.error('Error calling querySeedAndKV:', error);
            transformedResults = transformedResults_PLACEHOLDER;
        }
        console.log("transformedResults", transformedResults);
        if (transformedResults.length > 1) {
            // Do an aggrate?
          
        }

        return NextResponse.json({
            success: true,
            results: transformedResults,
            count: transformedResults.length,
            userQuery: userQuery,
            executionTime: Date.now() // In real app, measure actual execution time
        })

    } catch (error) {
        console.error('Query execution error:', error)
        return NextResponse.json({
            success: false,
            message: "Unable to process query, please try again."
        })
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
