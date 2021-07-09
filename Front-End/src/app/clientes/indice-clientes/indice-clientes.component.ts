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
//CLASE DEL COMPONENTE INDICE-CLIENTE
export class IndiceClientesComponent implements OnInit {
  blob: Blob;

  
  constructor(private clientesService: ClientesService, private formBuilder: FormBuilder) { }

  //INICIALIZACION DEL FORMULARIO DE CLIENTES
  form: FormGroup;

  
  clientes: clientesDTOS[];
  columnasAMostrar = ['id', 'nombres', 'fechaNacimiento', 'acciones'];
  cantidadTotalRegistros;
  paginaActual = 1;
  cantidadRegistrosAMostrar = 10;


  //DEFINICION DEL CAMPO EN EL FORMULARIO PARA RELIZAR EL FILTRO
  formularioOriginal = {
    buscar: ''
  };
 

  //SE CARGAN TODOS LOS CLIENTES EN EL ONINIT DEL COMPONENTE
  ngOnInit(): void {
    this.form = this.formBuilder.group(this.formularioOriginal);
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }

  //METODO PARA CARGAR TODOS LOS CLIENTES EN EL COMPONENETE CON SU PAGINACION
  cargarRegistros(pagina: number, cantidadElementosAMostrar)
  {
    this.clientesService.obtenerPaginado(pagina, cantidadElementosAMostrar)
    .subscribe((respuesta: HttpResponse<clientesDTOS[]>) => {
      this.clientes = respuesta.body;
      this.cantidadTotalRegistros = respuesta.headers.get("cantidadTotalRegistros");
    }, error => console.error(error));
  }

  //METODO QUE ACUTALIZA LA PAGINACION EN EL LISTADO DE CLIENTES
  actualizarPaginacion(datos: PageEvent){
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrar = datos.pageSize;
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }

  //METODO PARA EL FILTRO DEL CLIENTES
  public doFilter = (target: Partial<HTMLInputElement>) => {
    if(target.value != ""){
      this.Filter(this.paginaActual,this.cantidadRegistrosAMostrar,target.value);
    }
    else{

    }
     this.cargarRegistros(this.paginaActual,this.cantidadRegistrosAMostrar);
  }

  //METODO QUE REALIZA EL FILTRO DEL CLIENTES
  Filter(pagina: number, cantidadElementosAMostrar, search: string)
  {
    this.clientesService.obtenerPaginadofiltro(pagina, cantidadElementosAMostrar,search)
    .subscribe((respuesta: HttpResponse<clientesDTOS[]>) => {
      this.clientes = respuesta.body;
      this.cantidadTotalRegistros = respuesta.headers.get("cantidadTotalRegistros");
    }, error => console.error(error));
  }

  //METODO QUE BORRA UN CLIENTE POR SU ID
  borrar(id: number){
    this.clientesService.borrar(id)
    .subscribe(() => {
      this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
    }, error => console.error(error));
  }

  //METODO QUE GENERA EL REPORTE DE ESTADO DE CUENTA
  reporte(id: number){
    
    this.clientesService.reporte(id).subscribe((data:any) => {

    this.blob = new Blob([data], {type: 'application/pdf'});
  
    var downloadURL = window.URL.createObjectURL(data);
    window.open(downloadURL, '_blank');
  
  });
    this.clientesService.reporte(id);
  }
}
