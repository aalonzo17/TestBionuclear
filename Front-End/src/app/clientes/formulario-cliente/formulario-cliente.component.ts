import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { clientesDTOS } from '../clientes';

@Component({
  selector: 'app-formulario-cliente',
  templateUrl: './formulario-cliente.component.html',
  styleUrls: ['./formulario-cliente.component.css']
})
export class FormularioClienteComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) { }

  form: FormGroup;

  @Input()
  errores: string[] = [];

  @Input()
  accion: string;

  @Input()
  modelo: clientesDTOS;

  @Output()
  onSubmit: EventEmitter<clientesDTOS> = new EventEmitter<clientesDTOS>();

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombres: ['', {
        validators: [Validators.required]
      }],
      direccion: ['', {
        validators: [Validators.required]
      }],
      fechaNacimiento: ['', {
        validators: [Validators.required]
      }]

    });

    if (this.modelo !== undefined){
      this.form.patchValue(this.modelo);
    }
  }

  guardarCambios(){
    this.onSubmit.emit(this.form.value);
  }

  obtenerErrorCampofecha(){
    var campo = this.form.get('fechaNacimiento');
    if (campo.hasError('required')){
      return 'El campo Fecha de nacimiento es requerido'; 
    }
    
    return '';
  }

  obtenerErrorCampoDireccion(){
    var campo = this.form.get('direccion');
    if (campo.hasError('required')){
      return 'El campo direccion es requerido'; 
    }

    return '';
  }

  obtenerErrorCampoNombre(){
    var campo = this.form.get('nombres');
    if (campo.hasError('required')){
      return 'El campo nombre es requerido'; 
    }
    return '';
  }

}
