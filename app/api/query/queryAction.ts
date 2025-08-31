import fs from 'fs';
import path from 'path';
import { generateWithParts } from '../model';
import { createPartFromText } from '@google/genai';

const dataDir = path.join(process.cwd(), 'public/uploads');

const dataSourceFiles = fs.readdirSync(dataDir)
    .filter(file => file.endsWith('.json'))
    .map(file => ({
        filename: file,
        filepath: path.join(dataDir, file)
    }));

console.log(`Found ${dataSourceFiles.length} test data files:`);

const userQuery = "How has the total number of registered marriages and the crude marriage rate changed year-on-year? What impact did the COVID-19 pandemic (2020-2021) have, and how has recovery progressed?";

export async function querySeedAndKV(userQuery: string) {

    console.log("hi querySeedAndKV");
    console.log("Starting querySeedAndKV with query:", userQuery);

    // TODO: read from KV
    const datasets: any[] = [];
    // Map.
    const mapper = dataSourceFiles.map(async ({ filename, filepath }) => {
        try {
            console.log(`Processing test data file: ${filename}`);
            const fileContent = fs.readFileSync(filepath, 'utf-8');
            // Assert well formed.
            const data = JSON.parse(fileContent);
            const dataString = JSON.stringify(data);

            console.log(`Analyzing if ${filename} is useful for query...`);
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
            // console.log("Is useful", result, dataString.slice(0, 200));
            if (result.useful === true) {
                datasets.push(data);
                console.log(`Dataset ${filename} is useful, added to analysis list`);
            } else {
                // console.log(`Dataset ${filename} is not useful for this query`);
            }
        } catch (error) {
            console.error(`Error processing ${filename}:`, error);

            // Check if this is an API key error and re-throw it
            if (error instanceof Error && error.message.includes('API_KEY_MISSING')) {
                throw error;
            }
        }
    });

    try {
        await Promise.all(mapper);
    } catch (error) {
        // Re-throw API key errors
        if (error instanceof Error && error.message.includes('API_KEY_MISSING')) {
            throw error;
        }
        console.error('Error during dataset processing:', error);
    }

    console.log("datasets matched", datasets.length);

    if (datasets.length === 0) {
        console.log("No datasets found that are useful for the query");
        return [];
    }

    const joins = [];
    for (let i = 0; i < datasets.length; i++) {
        const dataset = datasets[i];
        // TODO: add file name.
        const awaiter = async () => {
            try {
                console.log(`Analyzing dataset ${i + 1}/${datasets.length}...`);

                const analysis = await generateWithParts(
                    `You are an expert data analyst. Your task is to analyze the provided dataset to answer the user's question.
                
                    **Instructions:**
                    1.  Provide a comprehensive analysis based ONLY on the data provided. Do not invent or infer information that isn't present in the dataset.
                    2.  Identify relevant insights, trends, and key data points to support your answer.
                    3.  Your entire output must be a single, valid JSON object. Do not include any text before or after the JSON.
                    4.  Within the JSON string values (like 'result' and 'overview'), you may use Markdown for clear formatting (e.g., bullet points with '*').
                
                    **JSON Output Structure:**
                    {
                        "result": "A concise, direct answer to the user's query.",
                        "overview": "A high-level summary of the analysis performed and the main findings.",
                        "analysis": {
                            "key_findings": [
                                "A bulleted list of the most important insights discovered.",
                                "Finding 2.",
                                "Finding 3."
                            ],
                            "trends": [
                                "A bulleted list of any notable trends observed in the data."
                            ]
                        },
                        "data_used": [
                            // The specific subset of raw data points used to drive your analysis
                        ]
                    }
                    `,
                    [
                        { text: `User Question: ${userQuery}` },
                        createPartFromText(JSON.stringify(dataset))

                    ]
                );
                console.log(`Analysis completed for dataset ${i + 1}`);
                console.log(dataset.metadata, "metadata???");
                analysis["source"] = dataset.metadata?.source || "Unknown source";
                analysis["filename"] = dataset.metadata?.filename || "Unknown dataset_name";
                if ((analysis["filename"] === "Unknown dataset_name") || (analysis["source"] === "Unknown source")) {
                    console.error(`Error analyzing dataset ${i + 1}:`, analysis);
                    return null;
                }
                console.log("Analysis", analysis);
                return analysis;
            } catch (error) {
                console.error(`Error analyzing dataset ${i + 1}:`, error);

                // Check if this is an API key error and re-throw it
                if (error instanceof Error && error.message.includes('API_KEY_MISSING')) {
                    throw error;
                }

                return null;
            }
        };
        joins.push(awaiter());
    }
    try {
        const results = await Promise.all(joins);
        console.log(`Completed analysis of ${results.length} datasets`);
        // console.log(results);
        // console.log(JSON.stringify(results, null, 2));
        return results.filter(result => result !== null);
    } catch (error) {
        // Re-throw API key errors
        if (error instanceof Error && error.message.includes('API_KEY_MISSING')) {
            throw error;
        }
        console.error('Error during final analysis:', error);
        return [];
    }
}
// query().catch(console.error);
