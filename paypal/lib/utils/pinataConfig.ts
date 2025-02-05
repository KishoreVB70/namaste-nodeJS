import "server-only";

import { PinataSDK } from "pinata-web3";

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JSON_WEB_TOKEN}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}`,
});
