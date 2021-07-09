import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { parsearErroresAPI } from 'src/app/utilidades/utilidades';
import { clientesDTOS } from '../clientes';
import { ClientesService } from '../clientes.service';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.css']
})
export class EditarClienteComponent implements OnInit {

  constructor(
    private router: Router,
    private clientesService: ClientesService,
    private activatedRoute: ActivatedRoute
  ) {}

  modelo: clientesDTOS;
  errores: string[] = [];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.clientesService.obtenerPorId(params.id)
      .subscribe(cliente => {
        this.modelo = cliente;
        console.log(this.modelo);
      }, () => this.router.navigate(['/clientes']))
    });
  }

  guardarCambios(cliente: clientesDTOS) {
    this.clientesService.editar(this.modelo.id, cliente)
    .subscribe(() => {
      this.router.navigate(['/clientes']);
    }, error => this.errores = parsearErroresAPI(error))
  }

}
