import { Telegraf } from "telegraf";
import { buildPrompt } from './prompt-builder.js'
const bot = new Telegraf(process.env.TELEGRAF_KEY);

bot.on('text', async (ctx) => {
  // Explicit usage
  if (ctx.message.text?.toLocaleLowerCase().includes('hey baker')) {
    const index = ctx.message.text.indexOf('hey baker')
    const question = ctx.message.text.slice(index + 9).trim()
    const prompt = `respond as Baker Mayfield to this: ${question}`
    const result = await buildPrompt(prompt, 0.9);
    console.log(result)
    await ctx.telegram.sendMessage(ctx.message.chat.id, result)
  }
});

bot.launch();
