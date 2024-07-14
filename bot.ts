import { Telegraf, Context } from "telegraf";
import { message } from 'telegraf/filters';
import { ChatCompletionRequestMessage } from "openai";
import { buildPrompt, vetInput } from "./prompt-builder.js";
import config from "./config";

const bot = new Telegraf(config.telegrafKey);

const queue: ChatCompletionRequestMessage[] = [];

bot.on(message("text"), async (ctx) => {
  try {
    const messageText = ctx.message.text.toLowerCase();
    if (!messageText) {
      console.warn('Received empty message');
      return;
    }

    console.log(`Received message: ${messageText}`);

    queue.push({ role: "user", content: messageText });

    if (true) {  // Consider replacing this condition with a meaningful check
      console.debug('Processing message');
      const result = await buildPrompt(queue);
      if (result) {
        await ctx.telegram.sendMessage(ctx.message.chat.id, result.content!);
        queue.push(result);
        console.log(`Sent response: ${result.content}`);
      } else {
        console.warn('No result from buildPrompt');
      }
    }

    if (queue.length > 10) {
      queue.shift();
      console.debug('Removed oldest message from queue');
    }
  } catch (error) {
    console.error('Error processing message:', error);
    await ctx.reply('Sorry, an error occurred while processing your message.');
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

bot.launch().then(() => {
  console.log('Bot started');
}).catch((error) => {
  console.error('Failed to start bot:', error);
});