import express, { Router } from "express";
import { synonymController } from "./synonymController";
import { validateRequest } from "../../common/utils/httpHandlers";
import { DeleteSynonymSchema, GetSynonymSchema, UpdateSynonymSchema } from "./synonymGroupModel";

export const synonymRouter: Router = express.Router();

synonymRouter.post("/save", validateRequest(UpdateSynonymSchema), synonymController.save);
synonymRouter.delete("/delete", validateRequest(DeleteSynonymSchema), synonymController.delete);
synonymRouter.get("/search", validateRequest(GetSynonymSchema), synonymController.search);
