import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class BusquedasService {

  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  private transformarUsuarios(resultados: any[]): Usuario[] {
    const usuarios = resultados.map(u => new Usuario(u.nombre, u.email, '', u.img, u.google, u.role, u.uid));
    return usuarios;
  }

  private transformarHospitales(resultados: any[]): Hospital[] {
    return resultados;
  }

  private transformarMedicos(resultados: any[]): any[] {
    return resultados;
  }

  buscar(tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string = '') {
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this.http
      .get<{ ok: boolean; resultados: any[] }>(url, this.headers)
      .pipe(
        map((resp) => {
          switch (tipo) {
            case 'usuarios':
              return this.transformarUsuarios(resp.resultados);

            case 'hospitales':
              return this.transformarHospitales(resp.resultados);

            case 'medicos':
              return this.transformarMedicos(resp.resultados);

              default:
                return resp.resultados;
          }
        })
      );
  }

  busquedaGlobal(termino: any) {
    const url = `${base_url}/todo/${termino}`;
    return this.http
      .get(url, this.headers);
  }
}
