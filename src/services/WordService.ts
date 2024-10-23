import { Request } from "express";
export default class WordService {
  static createWordVertex(key, value, req: Request) {
    if (!req.session.synonyms) {
      req.session.synonyms = {};
    }

    if (!Object.keys(req.session.synonyms).includes(key)) {
      req.session.synonyms[key] = [value];
    } else {
      req.session.synonyms[key] = [
        ...new Set([...req.session.synonyms[key], value]),
      ];
    }
  }
}
