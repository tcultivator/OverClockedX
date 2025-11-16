
import { create } from 'zustand'
type Message = {
    user: string;
    bot?: string;
}
type Chatbot = {
    messages: Message[],
    addUserMessage: (userMessage: string) => void,
    addBotMessage: (botMessage: string) => void,

}
export const useChatBotStore = create<Chatbot>((set) => ({
    messages: [],
    addUserMessage: (userMessage: string) => {
        set((state) => ({
            messages: [...state.messages, { user: userMessage }],
        }))
    },

    addBotMessage: (botMessage: string) => {
        set((state) => ({
            messages: state.messages.map((msg, i) =>
                i === state.messages.length - 1 ? { ...msg, bot: botMessage } : msg
            ),
        }))
    },

}))