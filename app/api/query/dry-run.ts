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