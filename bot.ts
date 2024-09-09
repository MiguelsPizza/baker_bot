import { Telegraf } from "telegraf";
import { message } from 'telegraf/filters';
import { buildPrompt, generateOpenaiImage, vetInput } from "./prompt-builder.js";
import config from "./config";
import { OpenAI } from "openai";

const bot = new Telegraf(config.telegrafKey);

const queue: OpenAI.Chat.ChatCompletionMessageParam[] = [];
const PROMPT = 'show me baker'
console.log('hello from the api')
bot.on(message("text"), async (ctx) => {

  try {
    const messageText = ctx.message.text.toLowerCase();
    console.log({ messageText })
    if (!messageText) {
      console.warn('Received empty message');
      return;
    }

    if (messageText.trim().startsWith(PROMPT.toLocaleLowerCase())) {
      console.log('test', ctx?.message?.sender_chat)
      const imgPrompt = ctx.message.text.slice(PROMPT.length).trim()
      console.log({ imgPrompt })

      const img = await generateOpenaiImage(imgPrompt)
      await ctx.telegram.sendPhoto(ctx.message!.chat.id, img!)
      return
    }

    console.log(`Received message: ${messageText}`);

    queue.push({ role: "user", content: messageText });

    if (await vetInput(messageText)) {
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

// if (process.env.NODE_ENV === 'LOCAL') {
  bot.launch().then(() => {
    console.log('Bot started');
  }).catch((error) => {
    console.error('Failed to start bot:', error);
  });
// }

export const url = bot.webhookCallback("/telegraf")
console.log({ url })