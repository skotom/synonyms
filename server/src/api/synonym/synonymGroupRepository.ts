import type { SynonymGroup } from "./synonymGroupModel";

export const synonymGroups: SynonymGroup[] = [
  {
    word: "big",
    synonyms: ["giant", "huge"],
  },
];

export class SynonymGroupRepository {
  async search(searchTerm: string): Promise<SynonymGroup[] | null> {
    return synonymGroups.filter((synonmGroup) => synonmGroup.word.startsWith(searchTerm)) || null;
  }
}
