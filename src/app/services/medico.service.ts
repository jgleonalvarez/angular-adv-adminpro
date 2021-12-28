import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MedicoPage } from '../interfaces/medico.interface';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  cargarMedicos(page: number, limit: number) {
    const url = `${base_url}/medicos/?page=${page}&limit=${limit}`;
    return this.http.get<MedicoPage>(url, this.headers)
      .pipe(
        map(resp => { return { medicos: resp.medicos, total: resp.total }; })
      );
  }

  cargarMedico(id: string) {
    const url = `${base_url}/medicos/${id}`;
    return this.http.get(url, this.headers)
    .pipe(
      map((resp:any) => resp.medico)
    );
  }

  crearHospital(medico: { nombre: string, hospital: string}) {
    return this.http.post(`${base_url}/medicos/`, medico, this.headers);
  }

  guardarMedico(medico: { _id: string, nombre: string, hospital: string}) {
    return this.http.put(`${base_url}/medicos/${medico._id}`, medico, this.headers);
  }

  eliminarMedico(medico: Medico) {
    return this.http.delete(`${base_url}/medicos/${medico._id}`, this.headers);
  }
}
