import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { ProgressComponent } from './progress/progress.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';

import { PerfilComponent } from './perfil/perfil.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
// Mantenimientos
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AdminGuard } from '../guards/admin.guard';
import { RouterModule } from '@angular/router';

const childRoutes = [
  { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },
  { path: 'account-settings', component: AccountSettingsComponent, data: { title: 'Account Settings' } },
  { path: 'busqueda/:termino', component: BusquedaComponent, data: { title: 'Búsquedas Generales' } },
  { path: 'grafica1', component: Grafica1Component, data: { title: 'Grafica1' } },
  { path: 'perfil', component: PerfilComponent, data: { title: 'Perfil de Usuario' } },
  { path: 'progress', component: ProgressComponent, data: { title: 'Progress' } },
  { path: 'promesas', component: PromesasComponent, data: { title: 'Promesas' } },
  { path: 'rxjs', component: RxjsComponent, data: { title: 'Rxjs' } },

  // Mantenimientos
  { path: 'hospitales', component: HospitalesComponent, data: { title: 'Mantenimiento de Hospitales' } },
  { path: 'medicos', component: MedicosComponent, data: { title: 'Mantenimiento de Médicos' } },
  { path: 'medicos/:id', component: MedicoComponent, data: { title: 'Mantenimiento de Médicos' } },

  // ROLES ADMIN
  {
    path: 'usuarios', component: UsuariosComponent, data: { title: 'Mantenimiento de Usuarios' },
    canActivate: [AdminGuard]
  },
]

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class ChildRoutesModule { }
