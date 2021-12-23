import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public usuario: Usuario;
  public perfilForm!: FormGroup;
  public imagenUpload!: File;
  public imgTemp: any;

  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService) {
    this.usuario = this.usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });
  }

  actualizarPerfil() {
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
      .subscribe(() => {
        const { nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;

        Swal.fire('Success', 'Perfil actualizado', 'success');
      }, (err) => {
        if (err.error) {
          Swal.fire('Error', err.error.msg, 'error');
        } else {
          console.error(err);
        }
      });
  }

  cambiarImagen(event: any) {
    console.log(event.target.files[0]);

    const file = event.target.files[0];
    this.imagenUpload = file;

    if (!file) {
      this.imgTemp = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      console.log(reader.result);
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {
    this.fileUploadService.actualizarFoto(this.imagenUpload, "usuarios", this.usuario.uid || '')
      .then(img => {
        console.log(img);
        this.usuario.img = img;
        Swal.fire('Success', 'Imagen de perfil actualizada', 'success');
      })
      .catch((err) => {
          Swal.fire('Error', 'No se pudo actualizar la imagen', 'error');
          console.error(err);
      });
  }

}
