const { Telegraf } = require("telegraf");
const { getRandomId } = require("./pictures.js")
const imageSearch = require('image-search-google');
const { telegrafKey, gcsId, gcsApiKey } = require("./config.js");
const gcsClient = new imageSearch(gcsId, gcsApiKey);
const bot = new Telegraf(telegrafKey);


const regex = new RegExp('\W*(baker|mayfield|sucks|qb|feces|bot|clown)\W*', 'i')

bot.command("start", (ctx) => {
  console.log(ctx.from)
  bot.telegram.sendMessage(
    ctx.chat.id,
    "oi, cunt",
    {}
  )
})



bot.hears(regex, async (ctx) => {
  gcsClient.search('Baker Mayfield is trash', {page: 1, size: 'large'}).then(async images => {
    const index = Math.floor(Math.random() * (images.length + 1));
    const url = images[index]?.url;
    if(url) {
      try {
        bot.telegram.sendPhoto(ctx.chat.id, {url})
      } catch(e) {
        console.error(e);
      }

    } else {
        const pictureId = await getRandomId()
        try {
          bot.telegram.sendPhoto(ctx.chat.id, { source: `./res/${pictureId}.jpg` })
        } catch(e) {
          console.error(e);
        }
    }
  }).catch(err => console.error(err));
})

bot.launch();
