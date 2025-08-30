import { GoogleGenAI, ContentListUnion } from "@google/genai";

export interface PromptConfig {
    model: string;
    temperature: number;
    maxOutputTokens: number;
    apiKey: string;
}

const DEFAULT_CONFIG = {
    model: "gemini-2.0-flash",
    temperature: 0.1,
    maxOutputTokens: 10000,
    apiKey: process.env.GEMINI_API_KEY || '',
}

console.log(process.env.GEMINI_API_KEY, "api key");

const SYSTEM_INSTRUCTION = "You are a helpful data analyst";

export async function generateWithParts(
    systemInstruction: string = SYSTEM_INSTRUCTION,
    contents: ContentListUnion,
    config: Partial<PromptConfig> = DEFAULT_CONFIG) {
    const callConfig = { ...DEFAULT_CONFIG, ...config };
    const ai = new GoogleGenAI({
        apiKey: callConfig.apiKey
    });

    const response = await ai.models.generateContent({
        model: callConfig.model,
        contents: contents,
        config: {
            systemInstruction: systemInstruction,
            maxOutputTokens: callConfig.maxOutputTokens,
            temperature: callConfig.temperature,
        },
    });
    const modelOut = response.text || "";
    console.log("modelOut", modelOut);
    const content = modelOut.match(/```json\s*([\s\S]*?)\s*```/);
    if (!content || content.length < 1) throw new Error("No valid JSON in response");
    try {
        const data = JSON.parse(content[1]);
        return data;
    } catch (e) {
        console.error(e);
        throw e;
    }
}
