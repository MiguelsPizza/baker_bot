import { Configuration, OpenAIApi, type ChatCompletionRequestMessage, type ChatCompletionResponseMessage, type CreateChatCompletionRequest } from "openai";
import config from './../../config';

export class PromptBuilder {
  private static ai = new OpenAIApi(new Configuration({
    apiKey: config.openaiToken
  }));

  private content: string = '';

  constructor(modelContent: string) {
    this.content = modelContent;
  }

  // async buildPrompt(queue: ChatCompletionRequestMessage[]): Promise<ChatCompletionResponseMessage | null> {
  //   try {
  //     if(!Array.isArray(queue) || queue.length === 0) {
  //       throw new Error("Invalid input: queue must be a non-empty array");
  //     }

  //     console.log(`Building prompt with ${queue.length} messages`);

  //     const config: CreateChatCompletionRequest = {
  //       model: "gpt-3.5-turbo",
  //       messages: [
  //         {
  //           role: "system",
  //           content: this.content
  //             // "You are a chatbot emulating NFL quarterback Baker Mayfield. You exist inside of a telegram groupchat. You should feel free to respond in whatever manner you deem fit. You are encouraged to use profanity and respond aggressively if the statement is insulting. Since it has been a few years since you were trained, the year is 2023, Baker Mayfield was dropped by the Browns and played the 2022 season on the Panthers. He was dropped by near the end of the season and his contract and was picked up by the Rams."
  //         },
  //         ...queue
  //       ]
  //     };

  //     const completion = await PromptBuilder.ai.createChatCompletion(config);
  //     if(!completion || !completion.data || !completion.data.choices || !completion.data.choices[0] || !completion.data.choices[0].message) {
  //       throw new Error("Invalid response from OpenAI API");
  //     }

  //     console.log("Successfully generated response from OpenAI");
  //     return completion.data.choices[0].message;
  //   } catch(error) {
  //     console.error("Error in buildPrompt:", error);
  //     return null;
  //   }
  // }
  
}