import { IApoliceForm, ICoverage } from "../interfaces/IApoliceForm";
import { IApolicesTableData } from "../interfaces/IApolicesTableData";

export const getApoliceForm = (apolice: IApolicesTableData) => {
  const coverages: ICoverage[] = []
  
  const apoliceForm: IApoliceForm = {
    apoliceNumber: apolice.apoliceNumber,
    id: apolice.id,
    prizeValue: apolice.prizeValue,
    insured: {
      name: apolice.nameOfInsured,
      email: apolice.emailOfInsured,
      cpfCnpj: apolice.cpfCnpjOfInsured
    },
    coverages
  }

  apolice.coverages.forEach((apolice) => {
    const coverage: ICoverage = { name: apolice.nome, value: apolice.valor, id: apolice.id };
    coverages.push(coverage); 
  })

  apoliceForm.coverages = coverages;

  return apoliceForm;
}