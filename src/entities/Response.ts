import { WsResponse } from "@nestjs/websockets";

interface IErrorResponse {
  status: string;
  message: string;
  data: WsResponse;
}
