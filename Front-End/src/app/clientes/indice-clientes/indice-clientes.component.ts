import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { clientesDTOS } from '../clientes';
import { ClientesService } from '../clientes.service';

@Component({
  selector: 'app-indice-clientes',
  templateUrl: './indice-clientes.component.html',
  styleUrls: ['./indice-clientes.component.css']
})
export class IndiceClientesComponent implements OnInit {

  
  constructor(private clientesService: ClientesService, private formBuilder: FormBuilder) { }

  form: FormGroup;

  
  clientes: clientesDTOS[];
  columnasAMostrar = ['id', 'nombres', 'fechaNacimiento', 'acciones'];
  cantidadTotalRegistros;
  paginaActual = 1;
  cantidadRegistrosAMostrar = 10;


  formularioOriginal = {
    buscar: ''
  };
 


  ngOnInit(): void {
    this.form = this.formBuilder.group(this.formularioOriginal);
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }

  
  cargarRegistros(pagina: number, cantidadElementosAMostrar)
  {
    this.clientesService.obtenerPaginado(pagina, cantidadElementosAMostrar)
    .subscribe((respuesta: HttpResponse<clientesDTOS[]>) => {
      this.clientes = respuesta.body;
      this.cantidadTotalRegistros = respuesta.headers.get("cantidadTotalRegistros");
    }, error => console.error(error));
  }
  actualizarPaginacion(datos: PageEvent){
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrar = datos.pageSize;
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }

  public doFilter = (target: Partial<HTMLInputElement>) => {
    if(target.value != ""){
      this.Filter(this.paginaActual,this.cantidadRegistrosAMostrar,target.value);
    }
    else{

    }
     this.cargarRegistros(this.paginaActual,this.cantidadRegistrosAMostrar);
  }

  Filter(pagina: number, cantidadElementosAMostrar, search: string)
  {
    this.clientesService.obtenerPaginadofiltro(pagina, cantidadElementosAMostrar,search)
    .subscribe((respuesta: HttpResponse<clientesDTOS[]>) => {
      this.clientes = respuesta.body;
      this.cantidadTotalRegistros = respuesta.headers.get("cantidadTotalRegistros");
    }, error => console.error(error));
  }

  borrar(id: number){
    this.clientesService.borrar(id)
    .subscribe(() => {
      this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
    }, error => console.error(error));
  }

  reporte(id: number){
    this.clientesService.reporte(id);
  }
}
