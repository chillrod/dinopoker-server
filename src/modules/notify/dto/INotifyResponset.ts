import { WsResponse } from "@nestjs/websockets";

export interface INotifyResponse {
  status: string;
  session: string;
  message: any;
}
