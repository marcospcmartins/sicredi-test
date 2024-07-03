import { IApolice } from "../../interfaces/IApolices";
import { IApolicesTableData } from "../interfaces/IApolicesTableData";

export const getApoliceTableData = (apolices: IApolice[]) => {
  const rows: IApolicesTableData[] = [];

  apolices.forEach(apolice => {
    const row: IApolicesTableData = { id: Number(apolice.id), apoliceNumber: apolice.numero, prizeValue: apolice.valor_premio, nameOfInsured: apolice.segurado.nome, emailOfInsured: apolice.segurado.email, cpfCnpjOfInsured: apolice.segurado.cpfCnpj, coverages: apolice.coberturas }
    rows.push(row);
  });

  return rows;
}