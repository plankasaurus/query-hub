// GEMINI_API_KEY=your_key_here npx tsx dry-run.ts 

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { generateWithParts } from '../model';
import { createPartFromText } from '@google/genai';

const testDataDir = path.join(__dirname, 'test-data');

const testDataFiles = fs.readdirSync(testDataDir)
    .filter(file => file.endsWith('.json'))
    .map(file => ({
        filename: file,
        filepath: path.join(testDataDir, file)
    }));

console.log(`Found ${testDataFiles.length} test data files:`);

const userQuery = "How has the total number of registered marriages and the crude marriage rate changed year-on-year? What impact did the COVID-19 pandemic (2020-2021) have, and how has recovery progressed?";

async function query() {

    const datasets: string[] = [];
    // Map.
    const mapper = testDataFiles.map(async ({ filename, filepath }) => {
        try {
            const fileContent = fs.readFileSync(filepath, 'utf-8');
            // Assert well formed.
            const data = JSON.parse(fileContent);
            const dataString = JSON.stringify(data);

            const result = await generateWithParts(
                `You're an expert data analyst helping answer questions based on datasets. 

                Respond in a strict JSON format returning if the dataset is useful or not. 

                { "useful": boolean }
                `,
                [
                    { text: userQuery },

                    createPartFromText(dataString)
                ]
            );
            console.log("Is useful", result, dataString.slice(0, 200));
            if (result.useful === true) {
                datasets.push(dataString);
            }
        } catch (error) {
            console.error(`Error processing ${filename}:`, error);
        }
    });
    await Promise.all(mapper);
    console.log("datasets matched", datasets.length);

    const joins = [];
    for (let i = 0; i < datasets.length; i++) {
        const dataset = datasets[i];
        // TODO: add file name.
        const awaiter = async () => {
            try {
                const analysis = await generateWithParts(
                    `You're an expert data analyst. Analyze the dataset and provide a comprehensive answer to the user's question. Include relevant insights, trends, and data points. Do not make up information, only based on answer on what is in the dataset. Format your response clearly with sections and bullet points where appropriate.
                
                Output the data in a strctured JSON response that matches a relational database

                {
                    result: string the result of the user query,
                    overview: string an overview of the analysis,    
                    analysis: {details of your analysis here},
                    data: [the raw data used to drive your analysis] 
                }
                `,
                    [
                        { text: userQuery },
                        createPartFromText(dataset)

                    ]
                );
                return analysis;
            } catch (error) {
                console.error(`Error analyzing dataset ${i + 1}:`, error);
                return null;
            }
        };
        joins.push(awaiter());
    }
    const results = await Promise.all(joins);
    console.log(results);
    console.log(JSON.stringify(results, null, 2));

}
query().catch(console.error);

/**
 [ Promise { { analysis: [Object], data: [Array] } } ]

 Analysis Result:
{
  analysis: {
    overview: 'The analysis focuses on the trends in registered marriages and crude marriage rates in Australia from 2020 to 2024, with a particular emphasis on the impact and recovery from the COVID-19 pandemic (2020-2021).',
    totalRegisteredMarriages: [ [Object], [Object], [Object], [Object], [Object] ],
    crudeMarriageRate: [ [Object], [Object], [Object], [Object], [Object] ],
    covid19ImpactAndRecovery: {
      impact: 'The COVID-19 pandemic in 2020 and 2021 significantly impacted marriage trends. 2020 saw the lowest number of registered marriages (78,987) and a crude marriage rate of 3.8.  Restrictions and uncertainty likely contributed to a decrease in marriages.',
      initialRecovery: 'In 2021, there was an increase in both total registered marriages (89,167) and the crude marriage rate (4.3), indicating an initial recovery phase as restrictions eased.',
      postPandemicPeak: '2022 experienced a significant surge in marriages, with 127,161 registered marriages and a crude marriage rate of 6.1. This could be attributed to couples who had postponed their weddings during the pandemic.',
      stabilization: 'In 2023, the number of marriages decreased to 118,439, and the crude marriage rate dropped to 5.5, suggesting a stabilization after the post-pandemic peak.  In 2024, the number of marriages increased slightly to 120,844, while the crude marriage rate remained at 5.5.'
    },
    summary: 'The number of registered marriages and the crude marriage rate were affected by the COVID-19 pandemic. There was an initial drop in 2020, followed by a recovery and a peak in 2022, and a stabilization in 2023 and 2024. The data suggests that the marriage trends are returning to a more stable pattern after the disruptions caused by the pandemic.'
  },
  data: [
    { year: 2020, allMarriages: [Object] },
    { year: 2021, allMarriages: [Object] },
    { year: 2022, allMarriages: [Object] },
    { year: 2023, allMarriages: [Object] },
    { year: 2024, allMarriages: [Object] }
  ]
}
 */

/**



[
  {
    "analysis": {
      "overview": "The analysis focuses on the changes in the total number of registered marriages and the crude marriage rate in Australia from 2020 to 2024. It specifically examines the impact of the COVID-19 pandemic (2020-2021) and the subsequent recovery.",
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
 */