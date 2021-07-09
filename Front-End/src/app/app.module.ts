import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListadoGenericoComponent } from './utilidades/listado-generico/listado-generico.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material/material.module';
import { MenuComponent } from './menu/menu.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { IndiceClientesComponent } from './clientes/indice-clientes/indice-clientes.component';
import { CrearClienteComponent } from './clientes/crear-cliente/crear-cliente.component';
import { EditarClienteComponent } from './clientes/editar-cliente/editar-cliente.component';
import { MostrarErrorComponent } from './utilidades/mostrar-error/mostrar-error.component';
import { FormularioClienteComponent } from './clientes/formulario-cliente/formulario-cliente.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import { AutorizadoComponent } from './seguridad/autorizado/autorizado.component';
import { LoginComponent } from './seguridad/login/login.component';
import { RegistroComponent } from './seguridad/registro/registro.component';
import { FormularioAutenticacionComponent } from './seguridad/formulario-autenticacion/formulario-autenticacion.component'
import { SeguridadInterceptorService } from './seguridad/seguridad-interceptor.service';
import { IndiceUsuariosComponent } from './seguridad/indice-usuarios/indice-usuarios.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TestComponent } from './test/test.component';


@NgModule({
  declarations: [
    AppComponent,
    ListadoGenericoComponent,
    MenuComponent,
    LandingPageComponent,
    IndiceClientesComponent,
    CrearClienteComponent,
    EditarClienteComponent,
    MostrarErrorComponent,
    FormularioClienteComponent,
    AutorizadoComponent,
    LoginComponent,
    RegistroComponent,
    FormularioAutenticacionComponent,
    IndiceUsuariosComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    SweetAlert2Module.forRoot(),
    ReactiveFormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: SeguridadInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
