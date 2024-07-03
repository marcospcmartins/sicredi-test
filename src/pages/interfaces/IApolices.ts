import { ICobertura } from "./ICobertura";
import { ISegurado } from "./ISegurado";

export interface IApolice {
  id: string;
  numero: number;
  valor_premio: number;
  segurado: ISegurado;
  coberturas: ICobertura[];
}