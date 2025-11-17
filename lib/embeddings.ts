
import OpenAI from "openai";
const token = process.env.OPENAI_API_KEY;
const client = new OpenAI({
    baseURL: "https://models.github.ai/inference",
    apiKey: token,
});

export async function embedText(text: string) {
    const response = await client.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
    });

    return response.data[0].embedding;
}
