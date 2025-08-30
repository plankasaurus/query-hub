import { NextRequest, NextResponse } from 'next/server'
import { getRowsCollection } from '@/lib/mongodb'
import { DataJoinOut } from '@/lib/types'

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

        const transformedResults: DataJoinOut[] = [
            {
                "analysis": {
                    "overview": "The analysis focuses on the changes in the total number of registered marriages and the crude marriage rate in Australia from 2020 to 2024. It specifically examines the impact of the COVID-19 pandemic (2020-2021) and the subsequent recovery.",
                    "answer": "The COVID-19 pandemic significantly impacted marriage rates in Australia. In 2020, there was a decrease in marriages due to restrictions. 2021 saw partial recovery, but the most substantial rebound occurred in 2022 as restrictions eased, leading to a surge in marriages due to backlog clearing. By 2023, numbers decreased from the 2022 peak, suggesting normalization. 2024 shows stabilization with a slight increase.",
                    "totalRegisteredMarriages": [
                        {
                            "year": 2020,
                            "totalRegistered": 78987,
                            "yearOnYearChange": null,
                            "percentageChange": null,
                            "impact": "Start of COVID-19 pandemic; restrictions likely reduced marriages."
                        },
                        {
                            "year": 2021,
                            "totalRegistered": 89167,
                            "yearOnYearChange": 10180,
                            "percentageChange": "12.89%",
                            "impact": "Continued pandemic conditions; some recovery or deferred marriages."
                        },
                        {
                            "year": 2022,
                            "totalRegistered": 127161,
                            "yearOnYearChange": 37994,
                            "percentageChange": "42.61%",
                            "impact": "Significant increase post-lockdowns; backlog of marriages."
                        },
                        {
                            "year": 2023,
                            "totalRegistered": 118439,
                            "yearOnYearChange": -8722,
                            "percentageChange": "-6.86%",
                            "impact": "Decline from peak in 2022; normalization after the pandemic backlog."
                        },
                        {
                            "year": 2024,
                            "totalRegistered": 120844,
                            "yearOnYearChange": 2405,
                            "percentageChange": "2.03%",
                            "impact": "Slight increase, indicating stabilization."
                        }
                    ],
                    "crudeMarriageRate": [
                        {
                            "year": 2020,
                            "crudeMarriageRate": 3.8,
                            "yearOnYearChange": null,
                            "percentageChange": null,
                            "impact": "Start of COVID-19 pandemic; restrictions likely reduced marriages."
                        },
                        {
                            "year": 2021,
                            "crudeMarriageRate": 4.3,
                            "yearOnYearChange": 0.5,
                            "percentageChange": "13.16%",
                            "impact": "Continued pandemic conditions; some recovery or deferred marriages."
                        },
                        {
                            "year": 2022,
                            "crudeMarriageRate": 6.1,
                            "yearOnYearChange": 1.8,
                            "percentageChange": "41.86%",
                            "impact": "Significant increase post-lockdowns; backlog of marriages."
                        },
                        {
                            "year": 2023,
                            "crudeMarriageRate": 5.5,
                            "yearOnYearChange": -0.6,
                            "percentageChange": "-9.84%",
                            "impact": "Decline from peak in 2022; normalization after the pandemic backlog."
                        },
                        {
                            "year": 2024,
                            "crudeMarriageRate": 5.5,
                            "yearOnYearChange": 0,
                            "percentageChange": "0%",
                            "impact": "Stabilization."
                        }
                    ],
                    "covid19ImpactAndRecovery": {
                        "initialImpact": "The COVID-19 pandemic in 2020 led to a significant decrease in both the total number of registered marriages and the crude marriage rate due to restrictions and uncertainty.",
                        "recoveryPhase": "2021 saw a partial recovery, but the most substantial rebound occurred in 2022 as restrictions eased, leading to a surge in marriages, likely due to the clearing of backlogs.",
                        "normalization": "By 2023, the numbers decreased from the 2022 peak, suggesting a normalization of marriage patterns. 2024 shows a slight increase, indicating stabilization.",
                        "note": "Comparisons to other years should be treated with caution due to the administrative factors that affect the timeliness of marriages being registered in a given year."
                    },
                    "sameGenderMarriages": "Same-sex marriages consistently account for around 3-4% of all marriages, with a slight increase to 3.9% in 2024."
                },
                "data": [
                    {
                        "year": 2020,
                        "allMarriages": {
                            "totalRegistered": {
                                "unit": "no.",
                                "value": 78987
                            },
                            "crudeMarriageRate": {
                                "unit": "rate",
                                "value": 3.8
                            }
                        },
                        "sameAndNonBinaryGenderMarriages": {
                            "maleSameGender": {
                                "unit": "no.",
                                "value": 1116
                            },
                            "femaleSameGender": {
                                "unit": "no.",
                                "value": 1785
                            },
                            "includingNonBinary": {
                                "unit": "no.",
                                "value": null
                            },
                            "total": {
                                "unit": "no.",
                                "value": 2901
                            },
                            "proportionOfAllMarriages": {
                                "unit": "%",
                                "value": 3.7
                            }
                        }
                    },
                    {
                        "year": 2021,
                        "allMarriages": {
                            "totalRegistered": {
                                "unit": "no.",
                                "value": 89167
                            },
                            "crudeMarriageRate": {
                                "unit": "rate",
                                "value": 4.3
                            }
                        },
                        "sameAndNonBinaryGenderMarriages": {
                            "maleSameGender": {
                                "unit": "no.",
                                "value": 1075
                            },
                            "femaleSameGender": {
                                "unit": "no.",
                                "value": 1770
                            },
                            "includingNonBinary": {
                                "unit": "no.",
                                "value": null
                            },
                            "total": {
                                "unit": "no.",
                                "value": 2845
                            },
                            "proportionOfAllMarriages": {
                                "unit": "%",
                                "value": 3.2
                            }
                        }
                    },
                    {
                        "year": 2022,
                        "allMarriages": {
                            "totalRegistered": {
                                "unit": "no.",
                                "value": 127161
                            },
                            "crudeMarriageRate": {
                                "unit": "rate",
                                "value": 6.1
                            }
                        },
                        "sameAndNonBinaryGenderMarriages": {
                            "maleSameGender": {
                                "unit": "no.",
                                "value": 1767
                            },
                            "femaleSameGender": {
                                "unit": "no.",
                                "value": 2667
                            },
                            "includingNonBinary": {
                                "unit": "no.",
                                "value": 159
                            },
                            "total": {
                                "unit": "no.",
                                "value": 4593
                            },
                            "proportionOfAllMarriages": {
                                "unit": "%",
                                "value": 3.6
                            }
                        }
                    },
                    {
                        "year": 2023,
                        "allMarriages": {
                            "totalRegistered": {
                                "unit": "no.",
                                "value": 118439
                            },
                            "crudeMarriageRate": {
                                "unit": "rate",
                                "value": 5.5
                            }
                        },
                        "sameAndNonBinaryGenderMarriages": {
                            "maleSameGender": {
                                "unit": "no.",
                                "value": 1735
                            },
                            "femaleSameGender": {
                                "unit": "no.",
                                "value": 2619
                            },
                            "includingNonBinary": {
                                "unit": "no.",
                                "value": 204
                            },
                            "total": {
                                "unit": "no.",
                                "value": 4558
                            },
                            "proportionOfAllMarriages": {
                                "unit": "%",
                                "value": 3.8
                            }
                        }
                    },
                    {
                        "year": 2024,
                        "allMarriages": {
                            "totalRegistered": {
                                "unit": "no.",
                                "value": 120844
                            },
                            "crudeMarriageRate": {
                                "unit": "rate",
                                "value": 5.5
                            }
                        },
                        "sameAndNonBinaryGenderMarriages": {
                            "maleSameGender": {
                                "unit": "no.",
                                "value": 1893
                            },
                            "femaleSameGender": {
                                "unit": "no.",
                                "value": 2622
                            },
                            "includingNonBinary": {
                                "unit": "no.",
                                "value": 231
                            },
                            "total": {
                                "unit": "no.",
                                "value": 4746
                            },
                            "proportionOfAllMarriages": {
                                "unit": "%",
                                "value": 3.9
                            }
                        }
                    }
                ]
            }
        ]

        return NextResponse.json({
            success: true,
            results: transformedResults,
            count: transformedResults.length,
            userQuery: userQuery,
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
