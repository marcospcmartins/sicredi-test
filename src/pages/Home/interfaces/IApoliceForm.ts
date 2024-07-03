export interface IApoliceForm {
  id: number;
  apoliceNumber: number;
  prizeValue: number;
  insured: IInsured;
  coverages: ICoverage[]
}

export interface IInsured {
  name: string;
  email: string;
  cpfCnpj: string;
}

export interface ICoverage {
  name: string;
  value: number;
  id: number;
}