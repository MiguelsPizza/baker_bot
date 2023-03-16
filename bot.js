import { Telegraf } from "telegraf";
import { buildPrompt, vetInput } from "./prompt-builder.js"
import config from "./config.js"
const bot = new Telegraf(process?.env?.telegrafKey ?? config.telegrafKey)

const queue = []

bot.on("text", async (ctx) => {
  // Explicit usage
  queue.push({ role: "user", content: ctx.message.text })
  //old test ctx.message.text?.toLocaleLowerCase().includes("hey baker")
  if (vetInput(ctx.message.text?.toLocaleLowerCase())) {
    const result = await buildPrompt(queue)
    await ctx.telegram.sendMessage(ctx.message.chat.id, result.content)
    queue.push(result)
  }

  if (queue.length > 10) queue.shift()
})


bot.launch();
