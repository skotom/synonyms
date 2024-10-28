import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

import { config } from "./config/config";
import router from "./routes/main";

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
app.use(cors({ origin: config.corsWhiteList, credentials: true }));

app.use("/", router);

app.listen(config.port, () =>
  console.log(`API listening on port ${config.port}`)
);
