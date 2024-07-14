import { Telegraf, Context } from "telegraf";
import { buildPrompt, vetInput } from "./prompt-builder.js";
import config from "./config";
import { ChatCompletionRequestMessage } from "openai";

const bot = new Telegraf(config.telegrafKey);

const queue: ChatCompletionRequestMessage[] = [];

bot.on("text", async (ctx: Context) => {
  // @ts-ignore
  const messageText = ctx.message?.text?.toLocaleLowerCase();
  if (!messageText) return;

  queue.push({ role: "user", content: messageText });

  if (true) {
    console.log('here')
    const result = await buildPrompt(queue);
    if (result) {
      await ctx.telegram.sendMessage(ctx.message!.chat.id, result.content!);
      queue.push(result);
    }
  }

  if (queue.length > 10) queue.shift();
});

bot.launch();
