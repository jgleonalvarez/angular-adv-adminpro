import { Hospital } from '../models/hospital.model';

export interface HospitalPage {
  total: number;
  hospitales: Hospital[]
}
