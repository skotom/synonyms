import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type SynonymGroup = z.infer<typeof SynonymGroupSchema>;

export const SynonymGroupSchema = z.object({
  word: z.string(),
  synonyms: z.string().array(),
});

export const UpdateSynonymSchema = z.object({
  body: z.object({ synonyms: z.string().array() }),
});

export const GetSynonymSchema = z.object({
  query: z.object({ searchTerm: z.string() }),
});

export const DeleteSynonymSchema = z.object({
  query: z.object({ synonym: z.string() }),
});
