import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'
  ]
})
export class RegisterComponent {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    password2: ['', Validators.required],
    terminos: [false, Validators.required]
  }, {
    validators: this.passwordIguales('password', 'password2')
  });

  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router) { }

  crearUsuario() {
    this.formSubmitted = true;

    if (!this.registerForm.valid) {
      return;
    }

    // Realizar el posteo
    this.usuarioService.crearUsuario(this.registerForm.value)
          .subscribe(resp => {
            console.log(resp);
            this.router.navigateByUrl('/');
          }, (err) => {
            // Sí sucede un error
            Swal.fire('Error', err.error.msg, 'error');
          });
  }

  campoNoValido(campo: string): boolean {
    if (this.registerForm.get(campo)?.invalid && this.formSubmitted) {
      return true;
    }

    return false;
  }

  aceptarTerminos(): boolean {
    return !this.registerForm.get('terminos')?.value && this.formSubmitted;
  }

  contrasenasNoValidas(): boolean {
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;

    return pass1 !== pass2 && this.formSubmitted;
  }

  passwordIguales(pass1Name: string, pass2Name: string) {
    return (formGroup: FormGroup) => {
      const passCtrl1 = formGroup.get(pass1Name);
      const passCtrl2 = formGroup.get(pass2Name);

      if (passCtrl1?.value == passCtrl2?.value) {
        passCtrl2?.setErrors(null);
      } else {
        passCtrl2?.setErrors({ noEsIgual: true });
      }
    }
  }

}
