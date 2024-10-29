import { Request, RequestHandler, Response } from "express";
import { synonymService } from "./synonymService";
import { handleServiceResponse } from "../../common/utils/httpHandlers";

class SynonymController {
  public save: RequestHandler = async (req: Request, res: Response) => {
    let synonyms = req.body.synonyms;

    const serviceResponse = synonymService.updateSynonyms(synonyms, req);
    handleServiceResponse(serviceResponse, res);
  };

  public delete: RequestHandler = async (req: Request, res: Response) => {
    const synonym = req.query.synonym as string;

    const serviceResponse = synonymService.deleteSynonym(synonym, req);
    handleServiceResponse(serviceResponse, res);
  };

  public search: RequestHandler = async (req: Request, res: Response) => {
    const searchTerm = req.query.searchTerm as string;

    const serviceResponse = synonymService.search(searchTerm, req);
    handleServiceResponse(serviceResponse, res);
  };
}

export const synonymController = new SynonymController();
