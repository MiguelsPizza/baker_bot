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
    new sst.aws.SvelteKit("BakerBot-UI");
    const api = new sst.aws.ApiGatewayV2("BakerBot-API");
    api.route("GET /telegraf", {
      handler: "bot.url",
    });
  },
});


