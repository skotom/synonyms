import { Request, Response } from "express";
import WordService from "../services/WordService";

export class WordController {
  static async save(req: Request, res: Response) {
    const word = req.body.word;

    // use list of groups and hashmap that maps each word to group
    // that way we won't have more than 2 duplicates
    // hashmap will contain each word once
    // and list of groups will contain all words once
    // this way we'll take up less memory

    let newSynonyms = req.body.synonyms;

    let synonyms =
      req.session.synonyms && Object.keys(req.session.synonyms).includes(word)
        ? req.session.synonyms[word]
        : [];

    if (req.session.synonyms) {
      for (const syn of newSynonyms) {
        if (Object.keys(req.session.synonyms).includes(syn))
          newSynonyms = WordService.getUnique(
            newSynonyms,
            req.session.synonyms[syn]
          );
      }
    }

    synonyms = WordService.getUnique(newSynonyms, synonyms);

    let data: any = {};

    for (const k of [...synonyms, word]) {
      for (const v of [...synonyms, word].filter((val) => val != k)) {
        WordService.createWordVertex(k, v, req);
      }
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

    if (synonyms && word != "") {
      data = Object.keys(synonyms)
        .filter((key) => key.startsWith(word))
        .map((key) => ({ word: key, synonyms: synonyms[key] }));
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
