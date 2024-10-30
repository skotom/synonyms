import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import { ServiceResponse } from "../../common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { logger } from "../../server";
import { SynonymGroup } from "./synonymGroupModel";

class SynonymService {
  public updateSynonyms(synonyms: string[], req: Request): ServiceResponse {
    try {
      let newSynonyms: string[] = [];
      let oldSynonyms: string[] = [];

      // init words
      if (!req.session?.words) {
        req.session.words = {};
      }
      // init synonymGroups object
      if (!req.session?.synonymGroups) {
        req.session.synonymGroups = {};
      }

      // find out if any synonyms are already stored in session
      for (const synonym of synonyms) {
        if (req.session.words.hasOwnProperty(synonym)) {
          oldSynonyms.push(synonym);
        } else {
          newSynonyms.push(synonym);
        }
      }

      const synonymGroupKeys: string[] = [];

      for (const oldSynonym of oldSynonyms) {
        const groupKey = req.session.words[oldSynonym];

        if (!synonymGroupKeys.includes(groupKey)) {
          synonymGroupKeys.push(groupKey);
        }
      }

      // if we received synonyms from more than 1 existing group
      // we need to merge their groups
      if (synonymGroupKeys.length > 1) {
        this.mergeSynonymGroups(synonymGroupKeys, req);
      }

      if (synonymGroupKeys.length > 0) {
        const index = synonymGroupKeys[0];

        // add all new synonyms to existing group
        for (const newSynonym of newSynonyms) {
          req.session.words[newSynonym] = index;
          req.session.synonymGroups[index].push(newSynonym);
        }
      } else if (newSynonyms.length > 0) {
        // all of the synonyms are new so we need to add them for the first time
        const randomKey = uuidv4();
        req.session.synonymGroups[randomKey] = [...new Set(newSynonyms)];

        // point each of the words to synonym group
        for (const newSynonym of newSynonyms) {
          req.session.words[newSynonym] = randomKey;
        }
      }
      return ServiceResponse.success("Added new synonyms", null);
    } catch (ex) {
      const errorMessage = `Error adding new synonyms:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while adding new synonyms.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  mergeSynonymGroups(groupKeys: string[], req: Request) {
    if (!req.session?.words || !req.session?.synonymGroups) {
      return;
    }

    const mainKey = groupKeys[0];

    for (let i = 1; i < groupKeys.length; i++) {
      const groupKey = groupKeys[i];

      // merge to main group
      req.session.synonymGroups[mainKey] = req.session.synonymGroups[mainKey].concat(
        req.session.synonymGroups[groupKey],
      );

      // update group pointers in words object
      req.session.synonymGroups[groupKey].forEach((word) => (req.session.words![word] = mainKey));

      // after we merge into main group we remove the old group
      delete req.session.synonymGroups[groupKey];
    }
  }

  public deleteSynonym(synonym: string, req: Request): ServiceResponse {
    try {
      if (!req.session?.words || !req.session?.synonymGroups || !req.session.words[synonym]) {
        return ServiceResponse.failure("Synonym not found", null, StatusCodes.NOT_FOUND);
      }

      const groupKey = req.session.words[synonym];

      const synonyms = req.session?.synonymGroups ? req.session.synonymGroups[groupKey] : [];

      req.session.synonymGroups[groupKey] = synonyms.filter((s) => s != synonym);

      delete req.session.words[synonym];

      // clean group if no more words in it
      if (req.session.synonymGroups[groupKey].length == 0) {
        delete req.session.synonymGroups[groupKey];
      }

      return ServiceResponse.success("Synonym deleted", null);
    } catch (ex) {
      const errorMessage = `Error deleting synonym ${synonym}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting synonym.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public search(searchTerm: string, req: Request): ServiceResponse<SynonymGroup[] | null> {
    try {
      const synonymGroups = searchTerm !== "" ? this.getSynonymGroupsBySearchTerm(searchTerm, req) : [];
      return ServiceResponse.success("Found synonyms", synonymGroups);
    } catch (ex) {
      const errorMessage = `Error finding synonyms for ${searchTerm}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while seraching for synonyms.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getSynonymGroupsBySearchTerm(searchTerm: string, req: Request): SynonymGroup[] {
    if (!req.session?.words) {
      return [];
    }

    const result = Object.keys(req.session.words)
      .filter((key) => key.startsWith(searchTerm))
      .map((key) => ({
        word: key,
        synonyms: this.getSynonymsForWord(key, req),
      }))
      .sort((a, b) => a.word.localeCompare(b.word));

    return result;
  }

  getSynonymsForWord = (word: string, req: Request): string[] => {
    if (!req.session?.words || !req.session?.synonymGroups) {
      return [];
    }

    const res = [...req.session.synonymGroups[req.session.words[word]]]
      .filter((synonym) => synonym != word)
      .sort((a, b) => a.localeCompare(b));

    return res;
  };
}

export const synonymService = new SynonymService();
