import { Request } from "express";
import { v4 as uuidv4 } from "uuid";

class SynonymService {
  public updateSynonyms(synonyms: string[], req: Request) {
    let newSynonyms = [];
    let oldSynonyms = [];

    // init words
    if (!req.session.words) {
      req.session.words = {};
    }

    // find out if any synonyms are already stored in session
    for (const synonym of synonyms) {
      if (req.session.words.hasOwnProperty(synonym)) {
        oldSynonyms.push(synonym);
      } else {
        newSynonyms.push(synonym);
      }
    }

    // find existing synonym group keys
    const synonymGroupKeys = [
      ...new Set(oldSynonyms.map((synonym) => req.session.words[synonym])),
    ];

    // if we received synonyms from more than 1 existing group
    // we need to merge their groups
    if (synonymGroupKeys.length > 1) {
      this.mergeSynonymGroups(synonymGroupKeys, req);
    }

    if (synonymGroupKeys.length > 0) {
      const index = synonymGroupKeys[0];

      // add all new synonyms to existing group
      newSynonyms.forEach((synonym) => {
        req.session.words[synonym] = index;
        req.session.synonymGroups[index].push(synonym);
      });
    } else if (newSynonyms.length > 0) {
      // init synonymGroups object
      if (!req.session.synonymGroups) {
        req.session.synonymGroups = {};
      }

      // all of the synonyms are new so we need to add them for the first time
      // we should probably use something else but this will do for now
      const randomKey = uuidv4();
      req.session.synonymGroups[randomKey] = [...new Set(newSynonyms)];

      // point each of the words to synonym group
      newSynonyms.forEach((synonym) => {
        req.session.words[synonym] = randomKey;
      });
    }
  }

  mergeSynonymGroups(groupKeys: string[], req: Request) {
    const mainKey = groupKeys[0];

    for (let i = 1; i < groupKeys.length; i++) {
      const groupKey = groupKeys[i];

      // merge to main group
      req.session.synonymGroups[mainKey] = req.session.synonymGroups[
        mainKey
      ].concat(req.session.synonymGroups[groupKey]);

      // update group pointers in words object
      req.session.synonymGroups[groupKey].forEach(
        (word) => (req.session.words[word] = mainKey)
      );

      // after we merge into main group we remove the old group
      delete req.session.synonymGroups[groupKey];
    }
  }

  public deleteWord(word, req: Request) {
    const groupKey = req.session.words[word];
    const synonyms = req.session.synonymGroups[groupKey];

    req.session.synonymGroups[groupKey] = synonyms.filter(
      (synonym) => synonym != word
    );

    delete req.session.words[word];

    // clean group if no more words in it
    if (req.session.synonymGroups[groupKey].length == 0) {
      delete req.session.synonymGroups[groupKey];
    }
  }

  public search(searchTerm: string, req: Request) {
    if (!req.session.words || searchTerm === "") {
      return {};
    }

    return Object.keys(req.session.words)
      .filter((key) => key.startsWith(searchTerm))
      .map((key) => this.getSynonymsForWord(key, req));
  }

  getSynonymsForWord = (word: string, req: Request) => {
    return {
      word: word,
      synonyms: [...req.session.synonymGroups[req.session.words[word]]].filter(
        (synonym) => synonym != word
      ),
    };
  };
}

export const synonymService = new SynonymService();
