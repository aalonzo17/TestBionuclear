import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { clientesDTOS } from './clientes';

@Injectable({
  providedIn: 'root'
})
//Servicio para el manejo de la peticiones http de la entidad cliente
export class ClientesService {

  //Contructor injectando httpclient para en manejo de la peticione http
  constructor(private http: HttpClient) { }

  //DEFINICION DE LAS URL DE LOS METODOS DE MI API DE CLIENTES
  private apiURL = environment.apiURL + 'clientes';
  private apiURLReporte = environment.apiURL + 'clientes' +"/reporte";
  private apiURLFiltro = environment.apiURL + 'clientes' +"/filtro";

  /*METODO DEL SERVICIO DEL CLIENTE QUE ME PREMITE HACER UN PETICION TIPO POST A MI API PARA LA CREACION 
  DE UN CLIENTE*/
  public crear(cliente: clientesDTOS) {
    return this.http.post(this.apiURL, cliente);
  }
  /*METODO DEL SERVICIO DEL CLIENTE QUE ME PREMITE HACER UN PETICION TIPO GET A MI API OBTENER EL PAGINADO
  DEL TODOS LOS CLIENTES*/
  public obtenerPaginado(pagina: number, cantidadRegistrosAMostrar: number): Observable<any>{
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', cantidadRegistrosAMostrar.toString());
    return this.http.get<clientesDTOS[]>(this.apiURL, {observe: 'response', params});
  }
  /*METODO DEL SERVICIO DEL CLIENTE QUE ME PREMITE HACER UN PETICION TIPO GET A MI API OBTENER EL PAGINADO
  DEL FILTRADO DE CLIENTES*/
  public obtenerPaginadofiltro(pagina: number, cantidadRegistrosAMostrar: number, search: string): Observable<any>{
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', cantidadRegistrosAMostrar.toString());
    params = params.append('search', search);
    return this.http.get<clientesDTOS[]>(this.apiURLFiltro, {observe: 'response', params});
  }

  /*METODO DEL SERVICIO DEL CLIENTE QUE ME PREMITE HACER UN PETICION TIPO GET A MI API OBTENER TODOS LOS CLIENTES
  CON UN LIMITE DE 25000 DEFINIDO EN EL METODO DEL API CLIENTES*/
  public obtenertodos(): Observable<any> {

    return this.http.get<clientesDTOS[]>(this.apiURL,{observe: 'response'});

  }


  /*METODO DEL SERVICIO DEL CLIENTE QUE ME PREMITE HACER UN PETICION TIPO GET A MI API OBTENER UN CLIENTE
  POR SU ID*/
  public obtenerPorId(id: number): Observable<clientesDTOS>{
    return this.http.get<clientesDTOS>(`${this.apiURL}/${id}`);
  }

   /*METODO DEL SERVICIO DEL CLIENTE QUE ME PREMITE HACER UN PETICION TIPO PUT A MI API ACTUALIZAR UN CLIENTE
  POR SU ID*/
  public editar(id: number, cliente: clientesDTOS){
    return this.http.put(`${this.apiURL}/${id}`, cliente);
  }

     /*METODO DEL SERVICIO DEL CLIENTE QUE ME PREMITE HACER UN PETICION A MI API LE GENERACION DE ESTADO DE CUENTA DE UN CLIENTE
      POR SU ID Y LO DESPLIEGA EN UNA NUEVA PESTANA*/
  public reporte(id: number) {  

    const httpOptions = {
      responseType: 'blob' as 'json',
    };
  
    return this.http.get(`${this.apiURLReporte}/${id}`, httpOptions);  
    //window.open(`${this.apiURLReporte}/${id}`, '_blank');
  }

 
 /*METODO DEL SERVICIO DEL CLIENTE QUE ME PREMITE HACER UN PETICION A MI API TIPO DELETE PARA LA ELIMINACION DE UN CLEINTE POR SU ID*/
  public borrar(id: number) {
    return this.http.delete(`${this.apiURL}/${id}`);
  }
}
