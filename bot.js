import { Telegraf } from "telegraf";
import { getRandomId } from "./pictures.js";
import imageSearch from 'image-search-google';
import { telegrafKey, gcsId, gcsApiKey } from "./config.js";
import { promptBuilder } from './prompt-builder'
const bot = new Telegraf(telegrafKey);


bot.on('text', async (ctx) => {
  // Explicit usage
  if (ctx.message.text.includes('hey baker')) {
    const index = ctx.message.text.indexOf('hey baker')
    const question = ctx.message.text.slice(index + 9).trim()
    const prompt = `respond as baker mayfield to this: ${question}`
    const result = await promptBuilder(prompt, 0.5);
    //make OPEN API CALL HERE WITH THE PROMP VARIBALE
    await ctx.telegram.sendMessage(ctx.message.chat.id, result)
  }
});

bot.hears(regex, async (ctx) => {
  gcsClient.search('Baker Mayfield is trash', { page: 1, size: 'large' }).then(async images => {
    const index = Math.floor(Math.random() * (images.length + 1));
    const url = images[index]?.url;
    if (url) {
      try {
        bot.telegram.sendPhoto(ctx.chat.id, { url })
      } catch (e) {
        console.error(e);
      }

    } else {
      const pictureId = await getRandomId()
      try {
        bot.telegram.sendPhoto(ctx.chat.id, { source: `./ res / ${pictureId}.jpg` })
      } catch (e) {
        console.error(e);
      }
    }
  }).catch(err => console.error(err));
})

bot.launch();
