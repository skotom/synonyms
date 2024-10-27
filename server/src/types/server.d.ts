import "express-session";

declare module "express-session" {
  export interface SessionData {
    words: { [key: string]: string };
    synonymGroups: { [key: string]: string[] };
  }
}
