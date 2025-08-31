import { NextRequest, NextResponse } from 'next/server'
import { getRowsCollection } from '@/lib/mongodb'
import { DataJoinOut } from '@/lib/types'
import { querySeedAndKV } from './queryAction'
import { generateWithParts } from '../model'

console.log("logging for err", process.env.GEMINI_API_KEY, process.env);

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
        let aggregateAnswer: Record<string, string> | undefined = undefined;

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
        const transformedResults = await querySeedAndKV(userQuery);
        console.log("transformedResults", transformedResults);
        if (transformedResults.length >= 1) {
            try {
                aggregateAnswer = await generateWithParts(
                    `
    You are an expert data analyst and an insightful AI strategist. Your purpose is to synthesize complex information from multiple, distinct data sources into a single, coherent, and data-driven response. You must ground every assertion in the provided data, building a clear narrative that directly answers the user's question.
    Keep it informative, but also concise, give the answer in bullet points.
    
    **Core Principles:**
    - **Data-First:** Your analysis and conclusions must be derived *exclusively* from the provided data.
    - **Clarity and Precision:** Communicate findings in clear, unambiguous language. Quantify insights wherever possible.
    - **Synthesis, Not Summary:** Do not simply list findings from each source. Your value is in weaving them together, highlighting connections, contrasts, and overarching trends.

    **CRITICAL JSON FORMATTING REQUIREMENTS:**
    - You MUST return ONLY valid JSON wrapped in \`\`\`json\`\`\` code blocks
    - All special characters in your answer text MUST be properly escaped for JSON
    - Use \\\\n for line breaks, \\\\" for quotes, and escape any other special characters
    - The JSON must be parseable by JSON.parse() without errors
    `,

                    [
                        {
                            text: JSON.stringify({
                                // 1. INPUT SCHEMA: The data you will receive.
                                "user_question": userQuery,
                                "associated_data_results": transformedResults,

                                // 2. PRIMARY OBJECTIVE: What you must accomplish.
                                "objective": "Based *only* on the provided 'associated_data_results', construct a comprehensive answer to the 'user_question'.",

                                // 3. STEP-BY-STEP EXECUTION PLAN: How to think through the problem.
                                "execution_plan": {
                                    "step_1_Deconstruct": "First, fully comprehend the 'user_question'. Identify its core components and the specific information being requested.",
                                    "step_2_Analyze_Evidence": "Methodically examine each object in the 'associated_data_results' array. For each source, internalize its 'overview', 'key_findings', 'trends', and the specific 'data_used'.",
                                    "step_3_Synthesize_Narrative": "This is the most critical step. Identify the narrative that connects the different data sources. Look for a central dataset that can anchor the story. Find corroborating evidence, reveal tensions or contradictions between sources, and map out dependencies or causal links suggested by the combined data.",
                                    "step_4_Construct_Answer": "Using your synthesized insights, build the final answer by following the 'Output Requirements' below."
                                },

                                // 4. OUTPUT REQUIREMENTS & CONSTRAINTS: The rules your final output must follow.
                                "output_requirements": {
                                    "structure": "Begin with a direct, top-line summary of the main finding. Then, elaborate on the key points in a logical sequence, using markdown for structure if needed.",
                                    "grounding": "Explicitly cite which findings or data points from the 'associated_data_results' support each part of your answer.",
                                    "quantification": "Use specific figures, percentages, and dates from the data whenever possible (e.g., 'Sales increased by 15% in Q3, driven by the Alpha Project, as shown in the 'sales_report.csv' findings.').",
                                    "tone": "Maintain a neutral, objective, and analytical tone.",
                                    "limitations": "If the provided data is insufficient to answer a part of the question, clearly state this and explain what information is missing.",
                                    "prohibitions": [
                                        "DO NOT introduce any external information, personal knowledge, or assumptions.",
                                        "DO NOT speculate beyond what the data directly supports.",
                                        "DO NOT provide generic or vague statements; be specific."
                                    ]
                                },

                                // 5. RESPONSE FORMAT: The required final output format.
                                "response_format": {
                                    "type": "JSON",
                                    "schema": {
                                        "answer": "string"
                                    },
                                    "formatting_rules": [
                                        "Return ONLY valid JSON wrapped in ```json``` code blocks",
                                        "Escape all special characters properly for JSON parsing",
                                        "Use \\\\n for line breaks, \\\\\" for quotes",
                                        "Ensure the JSON is parseable by JSON.parse()"
                                    ]
                                }
                            })
                        }
                    ], {
                    model: "gemini-2.5-pro",
                }
                );
                console.log("response", aggregateAnswer);
            } catch (aggregateError) {
                console.error("Failed to generate aggregate answer:", aggregateError);
                // Continue without aggregate answer - the query results are still valid
                aggregateAnswer = undefined;
            }
        }
        const response = {
            success: true,
            results: transformedResults,
            count: transformedResults.length,
            userQuery: userQuery,
            aggregate: '',
            executionTime: Date.now() // In real app, measure actual execution time
        };
        if (aggregateAnswer && aggregateAnswer.answer) {
            response["aggregate"] = aggregateAnswer.answer;
        }
        if (transformedResults.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No data found, please try another query."
            })
        }
        return NextResponse.json(response);

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
