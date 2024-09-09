import OpenAI from "openai";
import config from "./config";

const openai = new OpenAI({
  apiKey: config.openaiToken
});

export async function buildPrompt(queue: OpenAI.Chat.ChatCompletionMessageParam[]): Promise<OpenAI.Chat.ChatCompletionMessage | null> {
  try {
    if (!Array.isArray(queue) || queue.length === 0) {
      throw new Error("Invalid input: queue must be a non-empty array");
    }

    console.log(`Building prompt with ${queue.length} messages`);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a chatbot emulating NFL quarterback Baker Mayfield. You exist inside of a telegram groupchat. You should feel free to respond in whatever manner you deem fit. You are encouraged to use profanity and respond aggressively if the statement is insulting. Since it has been a few years since you were trained, the year is 2023, Baker Mayfield was dropped by the Browns and played the 2022 season on the Panthers. He was dropped by near the end of the season and his contract and was picked up by the Rams."
        },
        ...queue
      ]
    });

    if (!completion.choices[0]?.message) {
      throw new Error("Invalid response from OpenAI API");
    }

    console.log("Successfully generated response from OpenAI");
    return completion.choices[0].message;
  } catch (error) {
    console.error("Error in buildPrompt:", error);
    return null;
  }
}

export async function vetInput(input: string): Promise<boolean> {
  try {
    if (typeof input !== "string" || input.trim() === "") {
      throw new Error("Invalid input: input must be a non-empty string");
    }

    console.log("Vetting input using GPT-4");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that determines if a message is related to football and if Baker Mayfield should respond to it."
        },
        {
          role: "user",
          content: input
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "shouldRespond",
            description: "Determine if Baker Mayfield should respond to the message",
            parameters: {
              type: "object",
              properties: {
                shouldRespond: {
                  type: "boolean",
                  description: "True if the message is related to football and Baker Mayfield should respond, false otherwise"
                },
                reason: {
                  type: "string",
                  description: "A brief explanation of why Baker Mayfield should or should not respond"
                }
              },
              required: ["shouldRespond", "reason"]
            }
          }
        }
      ],
      tool_choice: { type: "function", function: { name: "shouldRespond" } }
    });
    console.log({response: JSON.stringify(response)})
    if (!response.choices[0].message.tool_calls) {
      throw new Error("Invalid response from GPT-4");
    }

    const toolCall = response.choices[0].message.tool_calls[0];
    const result = JSON.parse(toolCall.function.arguments);
    console.log(`Should respond: ${result.shouldRespond}, Reason: ${result.reason}`);
    return result.shouldRespond;
  } catch (error) {
    console.error("Error in vetInput:", error);
    return false;
  }
}

export const generateOpenaiImage = async (promptString: string) => {
  try {
    const prompt: string = `NFL quarterback Baker Mayfield Doing the following: ${promptString}`;
    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: prompt ?? "Baker mayfield doing some dumb shit",
      n: 1,
     });
    // console.log(response)
    return response.data[0]?.url;
  } catch (error) {
    console.error(error.message);
  }
}