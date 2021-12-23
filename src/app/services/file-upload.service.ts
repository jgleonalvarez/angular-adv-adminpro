import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioService } from './usuario.service';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private usuarioService: UsuarioService) { }

  async actualizarFoto(archivo: File,
    tipo: 'usuarios' | 'medicos' | 'hospitales', id: string) {

    try {

      const url = `${base_url}/uploads/${tipo}/${id}`;
      const formData = new FormData();
      formData.append('imagen', archivo);

      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': this.usuarioService.token
        },
        body: formData
      });

      const data = await resp.json();

      if (data.ok) {
        return data.nombreArchivo;
      } else {
        console.log(data);
        return false;
      }

    } catch (error) {
      console.warn(error);
      return false;
    }
  }
}
