import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1655298514311_9001',
  koa: {
    port: 7001,
  },

  jwt: {
    secret: '8E2FEB9C16A74257ADE9CA8E9E327EB2', // fs.readFileSync('xxxxx.key')
    expiresIn: '2d'   // https://github.com/vercel/ms
  },

  cors: {
    credentials: true,
  },
} as MidwayConfig;
