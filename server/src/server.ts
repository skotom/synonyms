import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

import { config } from "./config/config";
import word from "./routes/word";

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: config.corsWhiteList, credentials: true }));

app.use("/word", word);

app.listen(config.port, () =>
  console.log(`API listening on port ${config.port}`)
);
