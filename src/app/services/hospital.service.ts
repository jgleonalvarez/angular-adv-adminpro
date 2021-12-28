import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HospitalPage } from '../interfaces/hospital.interface';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

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

  cargarHospitales(page: number = 0, limit: number = 1000) {
    const url = `${base_url}/hospitales/?page=${page}&limit=${limit}`;
    return this.http.get<HospitalPage>(url, this.headers)
      .pipe(
        map(resp => { return { hospitales: resp.hospitales, total: resp.total }; })
      );
  }

  crearHospital(hospital: Hospital) {
    return this.http.post(`${base_url}/hospitales/`, hospital, this.headers);
  }

  guardarHospital(hospital: Hospital) {
    return this.http.put(`${base_url}/hospitales/${hospital._id}`, hospital, this.headers);
  }

  eliminarHospital(hospital: Hospital) {
    return this.http.delete(`${base_url}/hospitales/${hospital._id}`, this.headers);
  }
}
