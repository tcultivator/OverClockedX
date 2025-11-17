import { pineconeIndex } from './pinecone'
import { embedText } from './embeddings'

export async function queryPinecone(query: string, topK = 3) {
    try {
        const queryEmbedding = await embedText(query);

        const results = await pineconeIndex.query({
            vector: queryEmbedding,
            topK,
            includeMetadata: true,
        });

        const chunks = results.matches?.map((match) => ({
            productId: match.metadata?.productId,
            productName: match.metadata?.productName,
            brand: match.metadata?.brand,
            category: match.metadata?.category,
            price: match.metadata?.price,
            stocks: match.metadata?.stocks,
            salesCount: match.metadata?.salesCount,
            chunk: match.metadata?.chunk,
            score: match.score,
        }));

        return chunks || [];
    } catch (err) {
        console.error('error!', err)
    }


}