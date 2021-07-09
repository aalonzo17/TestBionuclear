import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { credencialesUsuario, respuestaAutenticacion, usuarioDTO } from './seguridad';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  constructor(private httpClient: HttpClient, private router: Router) { }

  apiURL = environment.apiURL + 'usuarios'
  private readonly llaveToken = 'token';
  private readonly llaveExpiracion = 'token-expiracion';
  private readonly campoRol = 'role';


  obtenerUsuarios(pagina: number, recordsPorPagina: number): Observable<any>{
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', recordsPorPagina.toString());
    return this.httpClient.get<usuarioDTO[]>(`${this.apiURL}/listadousuarios`, 
    {observe: 'response', params})
  }

  hacerAdmin(usuarioId: string){
    const headers = new HttpHeaders('Content-Type: application/json');
    return this.httpClient.post(`${this.apiURL}/hacerAdmin`, JSON.stringify(usuarioId), {headers});
  }

  removerAdmin(usuarioId: string){
    const headers = new HttpHeaders('Content-Type: application/json');
    return this.httpClient.post(`${this.apiURL}/removerAdmin`, JSON.stringify(usuarioId), {headers});
  }

  logueado(): boolean{
    const token = localStorage.getItem(this.llaveToken);

    if (!token){
      return false;
    }

    const expiracion = localStorage.getItem(this.llaveExpiracion);
    const expiracionFecha = new Date(expiracion);

    if (expiracionFecha <= new Date()){
      this.logout();
      return false;
    }

    return true;
  }

  obtenerCampoJWT(campo: string): string{
    const token = localStorage.getItem(this.llaveToken);
    if (!token){return '';}
    var dataToken = JSON.parse(atob(token.split('.')[1]));
    return dataToken[campo];
  }

  obtenerToken(){
    return localStorage.getItem(this.llaveToken);
  }

  logout(){
    localStorage.removeItem(this.llaveToken);
    localStorage.removeItem(this.llaveExpiracion);
    this.router.navigate(['/']);
  }

  obtenerRol(): string {
    return this.obtenerCampoJWT(this.campoRol);
  }

  registrar(credenciales: credencialesUsuario): Observable<respuestaAutenticacion>{
    return this.httpClient.post<respuestaAutenticacion>(this.apiURL + '/crear', credenciales);
  }

  
  guardarToken(respuestaAutenticacion: respuestaAutenticacion){
    localStorage.setItem(this.llaveToken, respuestaAutenticacion.token);
    localStorage.setItem(this.llaveExpiracion, respuestaAutenticacion.expiracion.toString());
  }

  login(credenciales: credencialesUsuario): Observable<respuestaAutenticacion>{
    return this.httpClient.post<respuestaAutenticacion>(this.apiURL + '/login', credenciales);
  }


}
