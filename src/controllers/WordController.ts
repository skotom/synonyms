import { Request, Response } from "express";
import WordService from "../services/WordService";

export class WordController {
  static async save(req: Request, res: Response) {
    const word = req.body.word;

    const synonyms = [
      ...new Set<string>(
        req.body.synonyms.map((synonym: string) => synonym.toLowerCase())
      ),
    ];

    let data: any = {};

    for (const synonym of synonyms) {
      WordService.createWordVertex(word, synonym, req);
      WordService.createWordVertex(synonym, word, req);
    }
    // TODO(tome): if synonym is missing then we remove it...
    // check if there is some synonym that exists in synonyms but not in params
    // and remove it

    data = { status: "OK" };

    res.json(data);
  }

  static async search(req: Request, res: Response) {
    // we need to return all matches here
    // so not just synonyms but everything that matches our search query

    let data: any = {};

    const word = req.query.word as string;

    const synonyms = req.session.synonyms;

    if (synonyms && Object.keys(synonyms).includes(word)) {
      data = Object.keys(synonyms)
        .filter((key) => key.startsWith(word))
        .map((key) => ({ word: key, synonyms: synonyms[key] }));
      // data = Object.fromEntries(
      //   Object.entries(synonyms).filter(([k, v]) => k.startsWith(word))
      // );
      // maybe it would be better if we return it as a list
    } else {
      data = {};
    }

    console.log(data);

    res.json(data);
  }

  static async all(req: Request, res: Response) {
    const synonyms = req.session.synonyms ? req.session.synonyms : {};
    console.log(synonyms);
    res.json(synonyms);
  }
}
