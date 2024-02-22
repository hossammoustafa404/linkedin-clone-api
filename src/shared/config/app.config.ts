import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  developmentURL: process.env.DEVELOPMENT_URL,
  productionURL: process.env.PRODUCTION_URL,
}));
