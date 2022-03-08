import { IClient } from "./Client";

export interface IPlayer extends IClient {
  id: string;
  name: string;
  character: number;
  vote: number | null;
  voteStatus: string;
}
