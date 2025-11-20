// app/api/chat/route.ts
import { NextResponse, NextRequest } from 'next/server';
import OpenAI from 'openai';
import { queryPinecone } from '@/lib/queryPinecone'

const token = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
    const { message } = await req.json();

    const client = new OpenAI({
        baseURL: "https://models.github.ai/inference",
        apiKey: token
    });

    const relevantChunks = (await queryPinecone(message, 5)) || [];
    const contextText = relevantChunks.map(c => c.chunk).join("\n\n");

    const prompt = `
        You are "TechMate", an AI assistant for OverClockedX, a computer retail store.
        Your role is to help customers with product information, recommendations, and store-related questions for OverClockedX.

        Rules:
        - Only answer questions related to OverClockedX, its products, or related services.
        - If a question is unrelated to computers or OverClockedX, politely redirect the customer back to store-related topics.
        - Use the provided product information where available.
        - If some details are missing, provide answers based on general knowledge of computer products.
        - Keep answers short, friendly, and easy to understand.
        - Always ask helpful follow-up questions if needed.

        Product Information:
        ${contextText}

        Customer Question: ${message}
`;

    const result = await client.chat.completions.create({
        model: "openai/gpt-4o",
        messages: [
            {
                role: "system",
                content: prompt
            },
            {
                role: "user",
                content: message
            }
        ]
    });

    return Response.json({ reply: result.choices[0].message.content });
}
