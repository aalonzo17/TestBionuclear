import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { clientesDTOS } from './clientes';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient) { }

  private apiURL = environment.apiURL + 'clientes';
  private apiURLReporte = environment.apiURL + 'clientes' +"/reporte";
  private apiURLFiltro = environment.apiURL + 'clientes' +"/filtro";

  public crear(cliente: clientesDTOS) {
    return this.http.post(this.apiURL, cliente);
  }

  public obtenerPaginado(pagina: number, cantidadRegistrosAMostrar: number): Observable<any>{
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', cantidadRegistrosAMostrar.toString());
    return this.http.get<clientesDTOS[]>(this.apiURL, {observe: 'response', params});
  }

  public obtenerPaginadofiltro(pagina: number, cantidadRegistrosAMostrar: number, search: string): Observable<any>{
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', cantidadRegistrosAMostrar.toString());
    params = params.append('search', search);
    return this.http.get<clientesDTOS[]>(this.apiURLFiltro, {observe: 'response', params});
  }

  public obtenertodos(): Observable<any> {

    return this.http.get<clientesDTOS[]>(this.apiURL,{observe: 'response'});

  }

    public obtenerPorId(id: number): Observable<clientesDTOS>{
    return this.http.get<clientesDTOS>(`${this.apiURL}/${id}`);
  }

  public editar(id: number, cliente: clientesDTOS){
    return this.http.put(`${this.apiURL}/${id}`, cliente);
  }

  public reporte(id: number) {    
    window.open(`${this.apiURLReporte}/${id}`, '_blank');
  }

 

  public borrar(id: number) {
    return this.http.delete(`${this.apiURL}/${id}`);
  }
}
