import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearClienteComponent } from './clientes/crear-cliente/crear-cliente.component';
import { EditarClienteComponent } from './clientes/editar-cliente/editar-cliente.component';
import { IndiceClientesComponent } from './clientes/indice-clientes/indice-clientes.component';
import { IsAdminGuard } from './is-admin.guard';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { IndiceUsuariosComponent } from './seguridad/indice-usuarios/indice-usuarios.component';
import { LoginComponent } from './seguridad/login/login.component';
import { RegistroComponent } from './seguridad/registro/registro.component';

const routes: Routes = [
  {path:'',component : LoginComponent},
  {path:'clientes',component : IndiceClientesComponent, canActivate:[IsAdminGuard]},
  {path:'cliente/crear',component : CrearClienteComponent,canActivate:[IsAdminGuard]},
  {path:'cliente/editar/:id',component : EditarClienteComponent,canActivate:[IsAdminGuard]},
  {path:'Login',component : LoginComponent},
  {path:'landing',component : LandingPageComponent},
  {path:'registro',component : RegistroComponent},
  {path:'usuarios',component : IndiceUsuariosComponent,canActivate:[IsAdminGuard]},
  {path:'**', redirectTo:''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
