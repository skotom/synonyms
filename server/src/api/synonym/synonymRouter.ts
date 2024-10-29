import express, { Router } from "express";
import { synonymController } from "./synonymController";

export const synonymRouter: Router = express.Router();

synonymRouter.post("/save", synonymController.save);
synonymRouter.get("/search", synonymController.search);
synonymRouter.delete("/delete", synonymController.delete);
