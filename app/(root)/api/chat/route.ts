// app/api/chat/route.ts
import { NextResponse, NextRequest } from 'next/server';
import OpenAI from 'openai';


const token = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
    const { message } = await req.json();

    const client = new OpenAI({
        baseURL: "https://models.github.ai/inference",
        apiKey: token
    });

    const result = await client.chat.completions.create({
        model: "openai/gpt-4o",
        messages: [
            {
                role: "system",
                content: `
               You are a helpful AI assistant for a computer retail store. 
                Your job is to help customers with:
                - recommending PC parts (CPU, GPU, RAM, SSD, PSU, motherboard)
                - helping them choose laptops, desktops, accessories
                - explaining specifications in simple terms
                - comparing products and giving pros/cons
                - suggesting alternatives based on budget
                - answering store-related questions (availability, compatibility, performance)
                - keeping responses short, friendly, and easy to understand
                - avoiding overly technical jargon unless the customer asks for it

                Always ask helpful follow-up questions such as:
                "What's your budget?"
                "What will you use the computer for?"
                "Do you prefer Intel or AMD?"

                `
            },
            {
                role: "user",
                content: message
            }
        ]
    });

    return Response.json({ reply: result.choices[0].message.content });
}
