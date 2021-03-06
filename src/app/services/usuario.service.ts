import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { environment } from './../../environments/environment';

import { RegisterForm } from './../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';

import { Usuario } from './../models/usuario.model';
import { UsuarioPage } from '../interfaces/usuario.interface';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario = new Usuario('','');

  constructor(private http: HttpClient,
    private router: Router,
    private ngZone: NgZone) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid() : string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role || 'USER_ROLE';
  }

  googleInit() {

    return new Promise(resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '231104442123-8a5k8kn5js98so48j9vu280lp3fgg306.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve(true);
      });
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.auth2.signOut().then(() => {
      console.log('User signed out.');
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
    });
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/renew`, this.headers).pipe(
      map((resp: any) => {
        const {nombre, email, google, role, img, uid } =resp.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
        this.guardarLocalStorage(resp);

        return true;
      }),
      catchError(error => of(false))
    );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((res: any) => {
          this.guardarLocalStorage(res);
        })
      );
  }

  private guardarLocalStorage(res: any) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('menu', JSON.stringify(res.menu));
  }

  actualizarPerfil(data: { email: string, nombre: string, role: string}) {
    data.role = this.usuario.role || '';

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((res: any) => {
          this.guardarLocalStorage(res);
        })
      );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((res: any) => {
          this.guardarLocalStorage(res);
        })
      );
  }

  cargarUsuarios(page: number = 0, limit: number = 5) {
    const url = `${base_url}/usuarios/?page=${page}&limit=${limit}`;
    return this.http.get<UsuarioPage>(url, this.headers)
    .pipe(
      delay(100),
      map(resp => {
        const usuarios = resp.usuarios
              .map(u => new Usuario(u.nombre, u.email, '', u.img, u.google, u.role, u.uid));

        return {
          total: resp.total,
          usuarios
        };
      })
    );
  }

  eliminarUsuario(usuario: Usuario) {
    return this.http.delete(`${base_url}/usuarios/${usuario.uid}`, this.headers);
  }

  guardarUsuario(usuario: Usuario) {

    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers);
  }
}
