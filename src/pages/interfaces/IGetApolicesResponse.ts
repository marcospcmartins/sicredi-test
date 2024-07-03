import { IApolice } from "./IApolices";

export interface IGetApolicesResponse {
  content: IApolice[];
  page: number;
  totalItens: number;
  totalPages: number;
}