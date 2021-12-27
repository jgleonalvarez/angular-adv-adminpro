import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal = true;
  public tipo: 'usuarios' | 'medicos' | 'hospitales' = "usuarios";
  public id: string = '';
  public img?: string;

  public imgUpdated: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  get ocultarModal(): boolean {
    return this._ocultarModal;
  }

  abrirModal(tipo: 'usuarios' | 'medicos' | 'hospitales', id: string, img: string = 'no-image') {
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    this.img = img;
    if (img.includes('http')) {
      this.img = img;
    } else {
      this.img = `${base_url}/uploads/${tipo}/${img}`;
    }
    console.log(this.img, img);
  }

  cerrarModal() {
    this._ocultarModal = true;
  }
}
