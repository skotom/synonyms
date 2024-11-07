import express, { Application } from "express";
import cors from "cors";
import session from "express-session";
import { v4 as uuidv4 } from "uuid";

import { env } from "./common/utils/envConfig";
import { synonymRouter } from "./api/synonym/synonymRouter";
import pino from "pino";
import requestLogger from "./common/middleware/requestLogger";

const logger = pino({ name: "server start" });

const app: Application = express();

const DAY_IN_MILISECONDS: number = 24 * 60 * 60 * 1000;

app.use(
  session({
    genid: function () {
      return uuidv4();
    },
    secret: env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: DAY_IN_MILISECONDS,
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(requestLogger);

app.use("/synonym", synonymRouter);

export { app, logger };
