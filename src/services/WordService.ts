import { Request } from "express";
export default class WordService {
  static mergeGroups(groupIndexes: number[], req: Request) {
    const mainIndex = groupIndexes[0];

    for (let i = 1; i < groupIndexes.length; i++) {
      const groupIndex = groupIndexes[i];

      req.session.synonymGroups[mainIndex] = req.session.synonymGroups[
        mainIndex
      ].concat(req.session.synonymGroups[groupIndex]);

      req.session.synonymGroups[groupIndex].forEach(
        (word) => (req.session.words[word] = mainIndex)
      );

      req.session.synonymGroups.splice(groupIndex, 1);
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

    const synonymGroupIndexes = [
      ...new Set(oldSynonyms.map((synonym) => req.session.words[synonym])),
    ];

    if (synonymGroupIndexes.length > 1) {
      WordService.mergeGroups(synonymGroupIndexes, req);
    }

    if (synonymGroupIndexes.length > 0) {
      // add to existing synonym group
      const index = synonymGroupIndexes[0];

      newSynonyms.forEach((synonym) => {
        req.session.words[synonym] = index;
        req.session.synonymGroups[index].push(synonym);
      });
    } else if (newSynonyms.length > 0) {
      // create new synonym group
      if (!req.session.synonymGroups) {
        req.session.synonymGroups = [];
      }

      const index = req.session.synonymGroups.length;
      req.session.synonymGroups.push([...new Set(newSynonyms)]);

      newSynonyms.forEach((synonym) => {
        req.session.words[synonym] = index;
      });
    }
  }

  static deleteWord(word, req: Request) {}

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
