import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiChat = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

export const geminiEmbedding = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

export { genAI };
