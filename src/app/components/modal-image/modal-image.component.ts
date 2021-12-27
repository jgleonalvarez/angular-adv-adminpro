import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';


@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styles: [
  ]
})
export class ModalImageComponent implements OnInit {

  public imagenUpload!: File;
  public imgTemp: any = null;

  constructor(public modalImgService: ModalImagenService,
    private fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImgService.cerrarModal();
  }

  cambiarImagen(event: any) {
    const file = event.target.files[0];
    this.imagenUpload = file;

    if (!file) {
      this.imgTemp = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {
    const id = this.modalImgService.id;
    const tipo = this.modalImgService.tipo;
    this.fileUploadService.actualizarFoto(this.imagenUpload, tipo, id)
      .then(img => {
        Swal.fire('Success', 'Imagen de perfil actualizada', 'success');
        this.modalImgService.imgUpdated.emit(img);
        this.cerrarModal();
      })
      .catch((err) => {
          Swal.fire('Error', 'No se pudo actualizar la imagen', 'error');
          console.error(err);
      });
  }

}
