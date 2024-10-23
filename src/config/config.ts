const env: string =
  (process.env.ENVIRONMENT as string) || (process.env.NODE_ENV as string);

const apiPort = process.env.PORT;

if (env === "development" && !apiPort)
  throw new Error("PORT not defined in .env");

const clientPort = process.env.CLIENT_PORT;

if (env === "development" && !clientPort)
  throw new Error("CLIENT_PORT not defined in .env");

const port = {
  api: apiPort,
  client: clientPort,
};

export const config = {
  env: env,
  port: port,
  secret: process.env.SECRET,
};
