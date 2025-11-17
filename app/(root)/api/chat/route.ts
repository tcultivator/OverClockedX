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
            You are a helpful AI assistant for a computer retail store.
            Use the following product information to answer the customer question:

            ${contextText}

            - Use the database info where available.
            - If some details are missing, fill them in based on your general knowledge of computer products.
            - Keep answers short, friendly, and easy to understand.
            - Always ask helpful follow-up questions if needed.

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
