import { ICobertura } from "../../interfaces/ICobertura";
import { IApoliceForm } from "../interfaces/IApoliceForm";
import { IApoliceToSave } from "../interfaces/IApoliceToSave";

export const getApoliceDataToSave = (apolice: IApoliceForm) => {
  const coverages: ICobertura[] = [];
  const apoliceToSave: IApoliceToSave = {
    numero: apolice.apoliceNumber,
    valor_premio: apolice.prizeValue,
    segurado: {
      nome: apolice.insured.name,
      email: apolice.insured.email,
      cpfCnpj: apolice.insured.cpfCnpj
    },
    coberturas: coverages
  };

  apolice.coverages.forEach((coverage) => {
    const coverageToSave: ICobertura = { nome: coverage.name, valor: coverage.value, id: coverage.id}
    coverages.push(coverageToSave)
  })
  
  apoliceToSave.coberturas = coverages

  return apoliceToSave;
  
}