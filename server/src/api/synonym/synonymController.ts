import { Request, RequestHandler, Response } from "express";
import { synonymService } from "./synonymService";

class SynonymController {
  public save: RequestHandler = async (req: Request, res: Response) => {
    let synonyms = req.body.synonyms;

    synonymService.updateSynonyms(synonyms, req);

    res.json();
  };

  public search: RequestHandler = async (req: Request, res: Response) => {
    const searchTerm = req.query.searchTerm as string;

    const data = synonymService.search(searchTerm, req);

    res.json(data);
  };

  public delete: RequestHandler = async (req: Request, res: Response) => {
    const wordToDelete = req.query.wordToDelete as string;

    synonymService.deleteWord(wordToDelete, req);

    res.json();
  };
}

export const synonymController = new SynonymController();
