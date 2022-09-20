const { Telegraf } = require("telegraf")
const { getRandomId } = require("./pictures.js")


const regex = new RegExp('baker', 'i')

bot.command("start", (ctx) => {
  console.log(ctx.from)
  bot.telegram.sendMessage(
    ctx.chat.id,
    "oi, cunt.",
    {}
  )
})


bot.hears(regex, async (ctx) => {
  const pictureId = await getRandomId()
  bot.telegram.sendPhoto(ctx.chat.id, { source: `./res/${pictureId}.jpg` })
})

bot.launch()
