import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mostrar-error',
  templateUrl: './mostrar-error.component.html',
  styleUrls: ['./mostrar-error.component.css']
})
export class MostrarErrorComponent implements OnInit {

  @Input()
  errores: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
