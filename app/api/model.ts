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
    
    // Check if API key is provided
    if (!callConfig.apiKey || callConfig.apiKey.trim() === '') {
        throw new Error('API_KEY_MISSING: Gemini API key is not configured');
    }
    
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

    // Try to extract JSON from the response
    const content = modelOut.match(/```json\s*([\s\S]*?)\s*```/);
    if (!content || content.length < 1) {
        // If no JSON code block found, try to find any JSON-like content
        const jsonMatch = modelOut.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const data = JSON.parse(jsonMatch[0]);
                return data;
            } catch (e) {
                console.error("Failed to parse JSON-like content:", e);
                throw new Error("Response contains JSON-like content but it's not valid JSON");
            }
        }
        throw new Error("No valid JSON found in response. Expected response wrapped in ```json``` code blocks.");
    }

    try {
        const data = JSON.parse(content[1]);
        return data;
    } catch (e) {
        console.error("JSON parsing error:", e);
        console.error("Raw content that failed to parse:", content[1]);

        // Try to clean up common JSON issues
        let cleanedContent = content[1];

        // Replace unescaped newlines with escaped newlines
        cleanedContent = cleanedContent.replace(/\n/g, '\\n');

        // Replace unescaped quotes with escaped quotes (but be careful not to break the JSON structure)
        cleanedContent = cleanedContent.replace(/(?<!\\)"/g, '\\"');

        try {
            const data = JSON.parse(cleanedContent);
            console.log("Successfully parsed after cleaning");
            return data;
        } catch (cleanError) {
            console.error("Still failed after cleaning:", cleanError);
            throw new Error(`JSON parsing failed: ${e instanceof Error ? e.message : 'Unknown error'}. The AI model returned malformed JSON.`);
        }
    }
}
