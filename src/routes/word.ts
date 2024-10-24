import express, { Router } from "express";
import { WordController } from "../controllers/WordController";

const wordRouter: Router = express.Router();

wordRouter.post("/save", WordController.save);
wordRouter.get("/search", WordController.search);

export default wordRouter;
