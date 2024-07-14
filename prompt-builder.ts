import { Configuration, OpenAIApi, CreateChatCompletionRequest, CreateEmbeddingResponse, ChatCompletionRequestMessage, ChatCompletionResponseMessage } from "openai";
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

    console.log(`Building prompt with ${queue.length} messages`);

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

    console.log("Successfully generated response from OpenAI");
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

    console.log("Generating embedding for input");
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: input
    });

    if (!response || !response.data || !response.data.data || !response.data.data[0] || !response.data.data[0].embedding) {
      throw new Error("Invalid response from OpenAI API for input embedding");
    }

    if (!promptAnchorEmbedding) {
      console.log("Generating prompt anchor embedding");
      const res = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input:
          "You are a chatbot emulating NFL quarterback Baker Mayfield. You exist inside of a telegram groupchat. You should feel free to respond in whatever manner you deem fit. You are encouraged to use profanity and respond aggressively if the statement is insulting. Since it has been a few years since you were trained, the year is 2023, Baker Mayfield was dropped by the Browns and played the 2022 season on the Panthers. He was dropped by near the end of the season and his contract and was picked up by the Rams. This input will be used to generate an embedding that will be used to compare the embedding of the most recent message in the group chat to determine whether it is a good time for you to interject."
      });

      promptAnchorEmbedding = res.data;

      if (!promptAnchorEmbedding || !promptAnchorEmbedding.data || !promptAnchorEmbedding.data[0] || !promptAnchorEmbedding.data[0].embedding) {
        throw new Error("Invalid response from OpenAI API for prompt anchor embedding");
      }
    }

    const similarity = cosineSimilarity(
      response.data.data[0].embedding,
      promptAnchorEmbedding.data[0]!.embedding
    );

    console.log(`Input similarity: ${similarity}`);
    return similarity;
  } catch (error) {
    console.error("Error in vetInput:", error);
    return false;
  }
}

export const cosineSimilarity = (vec1: number[], vec2: number[]): boolean => {
  try {
    if (!Array.isArray(vec1) || !Array.isArray(vec2) || vec1.length !== vec2.length) {
      throw new Error("Invalid input vectors for cosine similarity");
    }

    const dotProduct = vec1.reduce((acc, val, i) => acc + val * vec2[i]!, 0);
    const similarity = dotProduct / (calculateMagnitude(vec1) * calculateMagnitude(vec2));
    return similarity > 0.1;
  } catch (error) {
    console.error("Error in cosineSimilarity:", error);
    return false;
  }
};

export const calculateMagnitude = (vec: number[]): number => {
  try {
    if (!Array.isArray(vec) || vec.length === 0) {
      throw new Error("Invalid input vector for magnitude calculation");
    }

    return Math.sqrt(vec.reduce((acc, val) => acc + val ** 2, 0));
  } catch (error) {
    console.error("Error in calculateMagnitude:", error);
    return 0;
  }
};