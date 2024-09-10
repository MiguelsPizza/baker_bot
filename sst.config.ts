/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "bakerBot",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const bucket = new sst.aws.Bucket("MyBucket", {
      public: true,
    });

    new sst.aws.SvelteKit("BakerBot-UI", {
      link: [bucket],
      environment: {
        VITE_BUCKET_NAME: bucket.name,
      }
    });

    const api = new sst.aws.ApiGatewayV2("BakerBot-API");

    api.route("POST /telegraf", {
      handler: "./bot/bot.handler",
      link: [bucket],
      environment: {
        TELEGRAF_KEY: process.env.TELEGRAF_KEY!,
        GCS_ID: process.env.GCS_ID!,
        GCS_API_KEY: process.env.GCS_API_KEY!,
        OPENAI_TOKEN: process.env.OPENAI_TOKEN!,
        BUCKET_NAME: bucket.name!,
      }
    });
  },
});
