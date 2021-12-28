import { delay } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { Hospital } from './../../../models/hospital.model';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public total: number = 0;
  public hospitales: Hospital[] = [];
  public page: number = 0;
  public limit: number = 3;
  public cargando = true;
  private subs?: Subscription[];

  constructor(private hospitalService: HospitalService,
    private modalImgService: ModalImagenService,
    private busquedaService: BusquedasService) { }

  ngOnInit(): void {

    const s = this.modalImgService.imgUpdated
    .pipe(delay(100)).subscribe(() => this.cargarData());
    this.subs?.push(s);

    this.cargarData();
  }

  cargarData() {
    this.cargando = true;
    const s = this.hospitalService.cargarHospitales(this.page, this.limit).subscribe(resp => {
      this.hospitales = resp.hospitales;
      this.total = resp.total;
      this.cargando = false;
    });
    this.subs?.push(s);
  }

  ngOnDestroy(): void {
    this.subs?.forEach(s => s.unsubscribe());
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

  buscar(termino: string) {
    if (termino.length === 0) {
      this.cargarData();
      return;
    }

    this.busquedaService
      .buscar('hospitales', termino)
      .subscribe((resp) => (this.hospitales = resp));
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService.guardarHospital(hospital)
      .subscribe(resp => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      });
  }

  eliminarHospital(hospital: Hospital) {
    Swal.fire({
      title: `Are you sure to delete to ${hospital.nombre}?`,
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.eliminarHospital(hospital).subscribe((resp) => {
          Swal.fire('Deleted!', 'The hospital has been deleted.', 'success');
        });
        this.cargarData();
      }
    });
  }

  async agregarHospital() {
    const { value } = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    });

    if (value && value.trim().length > 0) {
      const hospital = new Hospital(value);
      this.hospitalService.crearHospital(hospital)
        .subscribe(resp => this.cargarData());
    }
  }

  cargarImagen(hospital: Hospital) {
    this.modalImgService.abrirModal('hospitales', hospital._id || '', hospital.img);
  }
}
