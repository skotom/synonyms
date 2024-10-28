import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
export default class WordService {
  static mergeGroups(groupKeys: string[], req: Request) {
    const mainKey = groupKeys[0];

    for (let i = 1; i < groupKeys.length; i++) {
      const groupKey = groupKeys[i];

      req.session.synonymGroups[mainKey] = req.session.synonymGroups[
        mainKey
      ].concat(req.session.synonymGroups[groupKey]);

      req.session.synonymGroups[groupKey].forEach(
        (word) => (req.session.words[word] = mainKey)
      );

      delete req.session.synonymGroups[groupKey];
    }
  }

  static updateSynonyms(synonyms: string[], req: Request) {
    let newSynonyms = [];
    let oldSynonyms = [];

    if (!req.session.words) {
      req.session.words = {};
    }

    for (const synonym of synonyms) {
      if (req.session.words.hasOwnProperty(synonym)) {
        oldSynonyms.push(synonym);
      } else {
        newSynonyms.push(synonym);
      }
    }

    const synonymGroupKeys = [
      ...new Set(oldSynonyms.map((synonym) => req.session.words[synonym])),
    ];

    if (synonymGroupKeys.length > 1) {
      WordService.mergeGroups(synonymGroupKeys, req);
    }

    if (synonymGroupKeys.length > 0) {
      // add to existing synonym group
      const index = synonymGroupKeys[0];

      newSynonyms.forEach((synonym) => {
        req.session.words[synonym] = index;
        req.session.synonymGroups[index].push(synonym);
      });
    } else if (newSynonyms.length > 0) {
      // create new synonym group
      if (!req.session.synonymGroups) {
        req.session.synonymGroups = {};
      }

      const randomKey = uuidv4();
      req.session.synonymGroups[randomKey] = [...new Set(newSynonyms)];

      newSynonyms.forEach((synonym) => {
        req.session.words[synonym] = randomKey;
      });
    }
  }

  static deleteWord(word, req: Request) {
    const groupKey = req.session.words[word];
    const synonyms = req.session.synonymGroups[groupKey];

    req.session.synonymGroups[groupKey] = synonyms.filter(
      (synonym) => synonym != word
    );

    if (req.session.synonymGroups[groupKey].length == 0) {
      delete req.session.synonymGroups[groupKey];
    }

    delete req.session.words[word];
  }

  static getSynonymsForWord = (word: string, req: Request) => {
    return {
      word: word,
      synonyms: [...req.session.synonymGroups[req.session.words[word]]].filter(
        (synonym) => synonym != word
      ),
    };
  };

  static search(searchTerm: string, req: Request) {
    if (!req.session.words || searchTerm == "") {
      return {};
    }

    return Object.keys(req.session.words)
      .filter((key) => key.startsWith(searchTerm))
      .map((key) => WordService.getSynonymsForWord(key, req));
  }
}
