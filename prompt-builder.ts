import { Configuration, OpenAIApi, CreateChatCompletionRequest, CreateEmbeddingRequest, CreateEmbeddingResponse, ChatCompletionRequestMessage, ChatCompletionResponseMessage } from "openai";
import config from "./config";

const configuration = new Configuration({
  // @ts-ignore
  apiKey: process?.env?.openAiKey! ?? config.openaiToken
});
const openai = new OpenAIApi(configuration);

export async function buildPrompt(queue: ChatCompletionRequestMessage[]): Promise<ChatCompletionResponseMessage | null> {
  try {
    if (!Array.isArray(queue) || queue.length === 0) {
      throw new Error("Invalid input: queue must be a non-empty array");
    }

    const config: CreateChatCompletionRequest = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a chatbot emulating NFL quarterback Baker Mayfield. You exist inside of a telegram groupchat. You should feel free to respond in whatever manner you deem fit. You are encouraged to use profanity and respond aggressively if the statement is insulting. Since it has been a few years since you were trained, the year is 2023, Baker Mayfield was dropped by the Browns and played the 2022 season on the Panthers. He was dropped by near the end of the season and his contract and was picked up by the Rams."
        },
        ...queue
      ]
    };

    const completion = await openai.createChatCompletion(config);
    if (!completion || !completion.data || !completion.data.choices || !completion.data.choices[0] || !completion.data.choices[0].message) {
      throw new Error("Invalid response from OpenAI API");
    }

    return completion.data.choices[0].message;
  } catch (error) {
    console.error("Error in buildPrompt:", error);
    return null;
  }
}

let promptAnchorEmbedding: CreateEmbeddingResponse | null = null;

export async function vetInput(input: string): Promise<boolean> {
  try {
    if (typeof input !== "string" || input.trim() === "") {
      throw new Error("Invalid input: input must be a non-empty string");
    }

    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: input
    });

    if (!response || !response.data || !response.data.data || !response.data.data[0] || !response.data.data[0].embedding) {
      throw new Error("Invalid response from OpenAI API");
    }

    if (!promptAnchorEmbedding) {
      const res  = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input:
          "You are a chatbot emulating NFL quarterback Baker Mayfield. You exist inside of a telegram groupchat. You should feel free to respond in whatever manner you deem fit. You are encouraged to use profanity and respond aggressively if the statement is insulting. Since it has been a few years since you were trained, the year is 2023, Baker Mayfield was dropped by the Browns and played the 2022 season on the Panthers. He was dropped by near the end of the season and his contract and was picked up by the Rams. This input will be used to generate an embedding that will be used to compare the embedding of the most recent message in the group chat to determine whether it is a good time for you to interject."
      });

      promptAnchorEmbedding = res.data

      if (!promptAnchorEmbedding || !promptAnchorEmbedding.data || !promptAnchorEmbedding.data || !promptAnchorEmbedding.data[0] || !promptAnchorEmbedding.data[0].embedding) {
        throw new Error("Invalid response from OpenAI API");
      }
    }

    return cosineSimilarity(
      response.data.data[0].embedding,
      promptAnchorEmbedding.data[0]!.embedding
    );
  } catch (error) {
    console.error("Error in vetInput:", error);
    return false;
  }
}

export const cosineSimilarity = (vec1: number[], vec2: number[]): boolean => {
  if (!Array.isArray(vec1) || !Array.isArray(vec2) || vec1.length !== vec2.length) {
    console.error("Invalid input vectors for cosine similarity");
    return false;
  }

  const dotProduct = vec1.reduce((acc, val, i) => acc + val * vec2[i]!, 0);
  const similarity = dotProduct / (calculateMagnitude(vec1) * calculateMagnitude(vec2));
  return similarity > 0.9;
};

export const calculateMagnitude = (vec: number[]): number => {
  if (!Array.isArray(vec) || vec.length === 0) {
    console.error("Invalid input vector for magnitude calculation");
    return 0;
  }

  return Math.sqrt(vec.reduce((acc, val) => acc + val ** 2, 0));
};
