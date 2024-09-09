/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "BakerBot-API": {
      "type": "sst.aws.ApiGatewayV2"
      "url": string
    }
    "BakerBot-UI": {
      "type": "sst.aws.SvelteKit"
      "url": string
    }
  }
}
export {}
