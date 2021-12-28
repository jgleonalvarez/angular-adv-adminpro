import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { Medico } from './../../../models/medico.model';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public total: number = 0;
  public medicos: Medico[] = [];
  public page: number = 0;
  public limit: number = 3;
  public cargando = true;
  private subs?: Subscription[];

  constructor(private medicoService: MedicoService,
    private modalImgService: ModalImagenService,
    private busquedaService: BusquedasService) { }

  ngOnInit(): void {

    const s = this.modalImgService.imgUpdated
    .pipe(delay(200)).subscribe(() => this.cargarData());
    this.subs?.push(s);

    this.cargarData();
  }

  ngOnDestroy(): void {
    this.subs?.forEach(s => s.unsubscribe());
  }

  cargarData() {
    this.cargando = true;
    const s = this.medicoService.cargarMedicos(this.page, this.limit).subscribe(resp => {
      this.medicos = resp.medicos;
      this.total = resp.total;
      this.cargando = false;
    });
    this.subs?.push(s);
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      this.cargarData();
      return;
    }

    this.busquedaService
      .buscar('medicos', termino)
      .subscribe((resp) => (this.medicos = resp));
  }

  paginar(valor: number) {
    const v = this.limit * valor;
    this.page += v;

    if (this.page < 0) {
      this.page = 0;
      return;
    } else if (this.page > this.total) {
      this.page -= v;
      return;
    }

    this.cargarData();
  }

  eliminarMedico(medico: Medico) {
    Swal.fire({
      title: `Are you sure to delete to ${medico.nombre}?`,
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.eliminarMedico(medico).subscribe((resp) => {
          Swal.fire('Deleted!', 'The doctor has been deleted.', 'success');
        });
        this.cargarData();
      }
    });
  }

  cargarImagen(medico: Medico) {
    this.modalImgService.abrirModal('medicos', medico._id || '', medico.img);
  }

}
