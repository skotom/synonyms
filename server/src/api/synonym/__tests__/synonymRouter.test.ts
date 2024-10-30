import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { SynonymGroup } from "../synonymGroupModel";
import { synonymGroups } from "../synonymGroupRepository";
import type { ServiceResponse } from "../../../common/models/serviceResponse";
import { app } from "../../../server";

const agent = request.agent(app);

describe("Synonym API", () => {
  describe("POST /save", () => {
    it("return ok", async () => {
      const synonyms = ["big", "giant", "huge"];
      const response = await agent.post(`/synonym/save`).send({ synonyms: synonyms });
      const responseBody: ServiceResponse = response.body;

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
    });
  });

  describe("GET /search", () => {
    it("should return a list synonym groups", async () => {
      const searchTerm = "big";
      const expectedSynonymGroups = synonymGroups.filter((synonymGroup) => synonymGroup.word === searchTerm);
      await checkSearch(expectedSynonymGroups, searchTerm);
    });
  });

  describe("DELETE /delete", () => {
    it("return ok", async () => {
      const synonym = "big";
      const response = await agent.delete(`/synonym/delete?${new URLSearchParams({ synonym: synonym })}`);

      const responseBody: ServiceResponse = response.body;

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
    });
  });

  describe("GET /search", () => {
    it("should return an empty list", async () => {
      const searchTerm = "big";
      const expectedSynonymGroups: SynonymGroup[] = [];
      await checkSearch(expectedSynonymGroups, searchTerm);
    });
  });
});

async function checkSearch(expectedSynonymGroups: SynonymGroup[], searchTerm: string) {
  const response = await agent.get(`/synonym/search?${new URLSearchParams({ searchTerm: searchTerm })}`);
  const responseBody: ServiceResponse<SynonymGroup[]> = response.body;

  console.log(responseBody);

  expect(response.statusCode).toEqual(StatusCodes.OK);
  expect(responseBody.success).toBeTruthy();
  expect(responseBody.responseObject.length).toEqual(expectedSynonymGroups.length);
  responseBody.responseObject.forEach((synonmGroup, index) =>
    compareSynonymGroup(expectedSynonymGroups[index] as SynonymGroup, synonmGroup),
  );
}

function compareSynonymGroup(mockSynonymGroup: SynonymGroup, responseSynonymGroup: SynonymGroup) {
  if (!mockSynonymGroup || !responseSynonymGroup) {
    throw new Error("Invalid test data: mockSynonymGroup or responseSynonymGroup is undefined");
  }

  expect(responseSynonymGroup.word).toEqual(mockSynonymGroup.word);

  responseSynonymGroup.synonyms.forEach((synonym, index) =>
    compareSynonynms(mockSynonymGroup.synonyms[index], synonym),
  );
}

function compareSynonynms(mockSynonym: string, responseSynonym: string) {
  if (!mockSynonym || !responseSynonym) {
    throw new Error("Invalid test data: mockSynonym or responseSynonym is undefined");
  }

  expect(responseSynonym).toEqual(mockSynonym);
}
