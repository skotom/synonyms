import "express-session";

declare module "express-session" {
  export interface SessionData {
    words: { [key: string]: number };
    synonymGroups: Array<Array<string>>;
  }
}
