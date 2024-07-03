import { IApolice } from "../../interfaces/IApolices";

export type IApoliceToSave = Omit<IApolice, 'id'>;