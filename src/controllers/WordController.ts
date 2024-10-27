import { Request, Response } from "express";
import WordService from "../services/WordService";

export class WordController {
  static async save(req: Request, res: Response) {
    let synonyms = req.body.synonyms;

    WordService.updateSynonyms(synonyms, req);

    res.json();
  }

  static async search(req: Request, res: Response) {
    const searchTerm = req.query.searchTerm as string;

    const data = WordService.search(searchTerm, req);

    res.json(data);
  }

  static async delete(req: Request, res: Response) {
    const wordToDelete = req.query.wordToDelete as string;

    WordService.deleteWord(wordToDelete, req);

    res.json();
  }
}
