import { Request, Response } from "express";
import WordService from "../services/WordService";

export class WordController {
  static async save(req: Request, res: Response) {
    let synonyms = req.body.synonyms;

    WordService.updateSynonyms(synonyms, req);

    res.json();
  }

  static async search(req: Request, res: Response) {
    const searchTerm = req.query.word as string;

    const data = WordService.search(searchTerm, req);

    res.json(data);
  }

  static async delete(req: Request, res: Response) {
    let data: any = {};

    const wordToDelete = req.body.wordToDelete;
    const word = req.body.word;

    WordService.deleteWord(wordToDelete, req);

    res.json(data);
  }
}
