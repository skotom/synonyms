import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

import { config } from "./config/config";
import router from "./routes/main";

async function init() {
  const app: Application = express();

  app.use(
    session({
      genid: function () {
        return uuidv4();
      },
      secret: config.secret,
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const whitelist = ["http://localhost:3000", "http://localhost:3001"];

  app.use(
    cors({
      credentials: true,
      origin: function (origin: string | undefined, callback: any) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    })
  );

  app.use("/", router);

  app.listen(config.port.api, () =>
    console.log(`API listening on port ${config.port.api}`)
  );
}

init();
