const env: string =
  (process.env.ENVIRONMENT as string) || (process.env.NODE_ENV as string);

const port = process.env.PORT;

if (env === "development" && !port) throw new Error("PORT not defined in .env");

export const config = {
  env: env,
  port: port,
  secret: process.env.SECRET,
  corsWhiteList: process.env.CORS_WHITELIST,
};
