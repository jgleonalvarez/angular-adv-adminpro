import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, delay, distinctUntilChanged } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [],
})
export class MedicoComponent implements OnInit {
  public medicoForm!: FormGroup;
  public medicoSelected?: Medico;
  public hospitales: Hospital[] = [];
  public hospitalSelected?: Hospital;

  constructor(
    private fb: FormBuilder,
    private medicoService: MedicoService,
    private hospitalService: HospitalService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => this.cargarMedico(id));

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.cargarHospitales();

    this.medicoForm.get('hospital')?.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(value => {
        this.hospitalSelected = this.hospitales.find(h => h._id === value);
      });
  }

  cargarMedico(id: string) {
    if (id === 'nuevo') return;

    this.medicoService.cargarMedico(id)
      .pipe(delay(100))
      .subscribe(medico => {
        const { nombre, hospital: { _id } } = medico;
        this.medicoSelected = medico;
        this.medicoForm.setValue({ nombre, hospital: _id });
      }, () => {
        this.router.navigateByUrl('/dashboard/medicos');
      });
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales().subscribe((resp) => {
      this.hospitales = resp.hospitales;
    });
  }

  guardarMedico() {
    const { nombre } = this.medicoForm.getRawValue();

    if (this.medicoSelected) {
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSelected._id
      };
      this.medicoService.guardarMedico(data).subscribe((resp: any) => {
        Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');
      });
    } else {
      this.medicoService.crearHospital(this.medicoForm.getRawValue())
        .subscribe((resp: any) => {
          Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
        });
    }
  }
}
