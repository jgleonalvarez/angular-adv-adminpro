import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu: any[] = [];
  // [
  //   {
  //     title: 'Dashboard',
  //     icono: 'mdi mdi-gauge',
  //     submenu: [
  //       { title: 'Main', url: '/' },
  //       { title: 'ProgressBar', url: 'progress' },
  //       { title: 'Gráficas', url: 'grafica1' },
  //       { title: 'Promesas', url: 'promesas' },
  //       { title: 'Rxjs', url: 'rxjs' },
  //     ]
  //   },
  //   {
  //     title: 'Mantenimiento',
  //     icono: 'mdi mdi-folder-lock-open',
  //     submenu: [
  //       { title: 'Usuarios', url: 'usuarios' },
  //       { title: 'Hospitales', url: 'hospitales' },
  //       { title: 'Médicos', url: 'medicos' },
  //     ]
  //   }
  // ];

  cargarMenu() {
    this.menu = JSON.parse(localStorage.getItem('menu') || '');
  }
}
