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
        // TOOD: add file name.
        const awaiter = async () => {
            try {
                const analysis = await generateWithParts(
                    `You're an expert data analyst. Analyze the dataset and provide a comprehensive answer to the user's question. Include relevant insights, trends, and data points. Do not make up information, only based on answer on what is in the dataset. Format your response clearly with sections and bullet points where appropriate.
                
                Output the data in a strctured JSON response that matches a relational database

                {
                    analysis: {your analysis here}
                    data: [the raw data used to drive your analysis] 
                }
                `,
                    [
                        { text: userQuery },
                        createPartFromText(dataset)

                    ]
                );
                return analysis;
                console.log('Analysis Result:');
                console.log(analysis);
                console.log('\n' + '='.repeat(80));
            } catch (error) {
                console.error(`Error analyzing dataset ${i + 1}:`, error);
            }
        };
        joins.push(awaiter());
    }
    await Promise.all(joins);
    console.log(joins);

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