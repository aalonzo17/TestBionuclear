import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parsearErroresAPI } from 'src/app/utilidades/utilidades';
import { clientesDTOS } from '../clientes';
import { ClientesService } from '../clientes.service';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.css']
})
export class CrearClienteComponent  {

  errores: string[] = [];

  constructor(private router: Router, private clienteService: ClientesService) {}

  guardarCambios(cliente: clientesDTOS) {
    this.clienteService.crear(cliente).subscribe(
      () => {
        this.router.navigate(['/clientes']);
      },
      (error) => this.errores = parsearErroresAPI(error)
    );
  }

}
