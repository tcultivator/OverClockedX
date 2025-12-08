// app/api/chat/route.ts
import { NextResponse, NextRequest } from 'next/server';
import OpenAI from 'openai';
import { queryPinecone } from '@/lib/queryPinecone'

const token = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
    const { message, product_name } = await req.json();

    const client = new OpenAI({
        baseURL: "https://models.github.ai/inference",
        apiKey: token
    });

    const relevantChunks = (await queryPinecone(message, 5)) || [];
    const contextText = relevantChunks.map(c => c.chunk).join("\n\n");

    const prompt = `
       You are **TechMate**, AI assistant for OverClockedX, a computer retail store.

Help customers with a specific product.

- Answer only about OverClockedX, computers, or the given product.
- Focus on the product name provided.
- Use the reference info below when needed.
- If info is missing, use general computer knowledge.
- Keep answers short, friendly, and easy to understand.
- Cover specs, performance, compatibility, upgrades, comparisons, and alternatives.
- Format replies with clear headings and bullet points.
- Use short paragraphs and highlight key details.
- Ask helpful follow-up questions if needed.

Product:  
${product_name}

Reference info:  
${contextText}

Customer question:  
${message}

Format your response clearly with:

- Use Markdown headings (e.g., ### Specs) followed by a blank line
- Use bullet points (- or *) for lists, each on its own line
- Use real line breaks (press Enter) between sections
- Do NOT use "---" or other inline separators for new paragraphs
- Keep each bullet short and to the point
- Use bold for headings and key terms only
- End with a friendly follow-up question if applicable

Example:

### Specs

- Display: 15.6-inch Full HD (1920x1080) IPS panel, 144Hz refresh rate
- Processor: AMD Ryzen 7 7435HS
- Graphics: NVIDIA RTX 2050
- Memory: 8GB DDR4
- Storage: 512GB SSD
- Operating System: Windows 11 Home
- Design: Graphite Black, durable TUF series construction
- Extras: Comes with an Asus Backpack

Would you like information on **performance** or **upgrade options**?


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
