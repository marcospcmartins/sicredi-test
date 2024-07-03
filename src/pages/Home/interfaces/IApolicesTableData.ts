import { ICobertura } from "../../interfaces/ICobertura";

export interface IApolicesTableData {
  id: number;
  apoliceNumber: number;
  prizeValue: number;
  nameOfInsured: string;
  emailOfInsured: string;
  cpfCnpjOfInsured: string;
  coverages: ICobertura[]
}