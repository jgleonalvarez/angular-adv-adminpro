import { delay } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [],
})
export class UsuariosComponent implements OnInit, OnDestroy {
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  private usuariosTemp: Usuario[] = [];
  public page: number = 0;
  public limit: number = 3;
  public cargando = true;
  private subs?: Subscription;

  constructor(
    private usuarioService: UsuarioService,
    private busquedaService: BusquedasService,
    private modalImgService: ModalImagenService
  ) {}

  ngOnInit(): void {
    this.cargarData();

    this.subs = this.modalImgService.imgUpdated
      .pipe(delay(200))
      .subscribe((img) => this.cargarData());
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  cargarData() {
    this.cargando = true;
    this.usuarioService
      .cargarUsuarios(this.page, this.limit)
      .subscribe(({ total, usuarios }) => {
        // console.log(usuarios);
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.cargando = false;
        this.usuariosTemp = usuarios;
      });
  }

  paginar(valor: number) {
    const v = this.limit * valor;
    this.page += v;

    if (this.page < 0) {
      this.page = 0;
      return;
    } else if (this.page > this.totalUsuarios) {
      this.page -= v;
      return;
    }

    this.cargarData();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      this.usuarios = this.usuariosTemp;
      return;
    }

    this.busquedaService
      .buscar('usuarios', termino)
      .subscribe((resp) => (this.usuarios = resp));
  }

  borrarUsuario(usuario: Usuario) {
    if (usuario.uid === this.usuarioService.uid) {
      Swal.fire('Warning', 'No puede borrarse asimismo', 'error');
      return;
    }
    Swal.fire({
      title: `Are you sure to delete to ${usuario.nombre}?`,
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario).subscribe((resp) => {
          Swal.fire('Deleted!', 'The user has been deleted.', 'success');
        });
        this.cargarData();
      }
    });
  }

  cambiarRole(usuario: Usuario) {
    this.usuarioService.guardarUsuario(usuario).subscribe(
      (resp) => {},
      (error) => {
        console.error(error);
        if (error.error?.msg) {
          Swal.fire('Error', error.error?.msg, 'error');
        } else {
          Swal.fire('Error', 'Ocurrió un error', 'error');
        }
      }
    );
  }

  cargarImagen(usuario: Usuario) {
    this.modalImgService.abrirModal('usuarios', usuario.uid || '', usuario.img);
  }
}
