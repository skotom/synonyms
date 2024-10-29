import dotenv from "dotenv";
import { cleanEnv, port, str } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "production", "test"] }),
  PORT: port({ devDefault: 3000 }),
  SECRET: str(),
  CORS_ORIGIN: str({ devDefault: "http://localhost:3001" }),
});
