import { Telegraf } from "telegraf";
import { buildPrompt } from './prompt-builder.js'
const bot = new Telegraf(
  process?.env?.telegrafKey ?? "5573440835:AAE8vQwwLQQw6ovO00Yskz_V00F5MluStb8"
)

const queue = []

bot.on("text", async (ctx) => {
  // Explicit usage
  queue.push({ role: "user", content: ctx.message.text })

  if (ctx.message.text?.toLocaleLowerCase().includes("hey baker")) {
    const result = await buildPrompt(queue)
    await ctx.telegram.sendMessage(ctx.message.chat.id, result.content)
    queue.push(result)
  }

  if (queue.length > 10) queue.shift()
})


bot.launch();
