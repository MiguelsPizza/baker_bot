import { Telegraf } from "telegraf";
import Env from '../config'

const bot = new Telegraf(Env.telegrafKey);

(async () => {
  try {
    console.log("Setting webhook...");

    // set webhook
    await bot.telegram.setWebhook('https://te4wmw3yvh.execute-api.us-east-1.amazonaws.com/telegraf');
    console.log("Webhook set successfully.");

    // delete webhook
    // console.log("Deleting webhook...");
    // await bot.telegram.deleteWebhook();
    // console.log("Webhook deleted successfully.");

    console.log("Getting webhook info...");
    // get webhook info
    const webhookInfo = await bot.telegram.getWebhookInfo();
    console.log("Webhook info:", JSON.stringify(webhookInfo, null, 2));
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();