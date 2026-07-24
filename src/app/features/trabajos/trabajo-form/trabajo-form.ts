import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute
} from '@angular/router';

import {
  ClienteService
} from '../../../core/services/cliente.service';

import {
  UsuarioService
} from '../../../core/services/usuario.service';

import {
  TareaService
} from '../../../core/services/tarea.service';

import {
  TrabajoService
} from '../../../core/services/trabajo.service';

import {
  Combo
} from '../../../core/models/combo';

import {
  TrabajoCreate
} from '../../../core/models/trabajo-create';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatSelectModule
} from '@angular/material/select';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatCardModule
} from '@angular/material/card';

import {
  NgxMatSelectSearchModule
} from 'ngx-mat-select-search';


@Component({
  selector: 'app-trabajo-form',

  standalone: true,

  imports: [

    ReactiveFormsModule,

    CommonModule,

    MatFormFieldModule,

    MatInputModule,

    MatSelectModule,

    MatButtonModule,

    MatCardModule,

    NgxMatSelectSearchModule

  ],

  templateUrl: './trabajo-form.html',

  styleUrl: './trabajo-form.scss'

})
export class TrabajoFormComponent
  implements OnInit {


  private fb =
    inject(FormBuilder);


  private route =
    inject(ActivatedRoute);


  private clienteService =
    inject(ClienteService);


  private usuarioService =
    inject(UsuarioService);


  private tareaService =
    inject(TareaService);


  private trabajoService =
    inject(TrabajoService);


  // ============================
  // CLIENTES
  // ============================

  clienteFiltro =
    new FormControl('');


  clientesFiltrados: Combo[] = [];


  clientes: Combo[] = [];


  // ============================
  // COMBOS
  // ============================

  tecnicos: Combo[] = [];


  tareas: Combo[] = [];


  // ============================
  // FORMULARIO
  // ============================

  form = this.fb.nonNullable.group({

    idCliente: [
      0,
      Validators.required
    ],

    idTecnico: [
      0,
      Validators.required
    ],

    idTarea: [
      0,
      Validators.required
    ],

    comentarios: [
      ''
    ]

  });


  // ============================
  // EDICIÓN
  // ============================

  idTrabajo = 0;


  esEdicion = false;


  // ============================
  // INIT
  // ============================

  ngOnInit(): void {


    this.cargarClientes();


    this.cargarTecnicos();


    this.cargarTareas();


    this.idTrabajo =
      Number(
        this.route.snapshot
          .paramMap
          .get('id')
      );


    this.esEdicion =
      this.idTrabajo > 0;


    if (this.esEdicion) {

      this.cargarTrabajo();

    }

  }


  // ============================
  // CARGAR TRABAJO
  // ============================

  cargarTrabajo(): void {


    this.trabajoService
      .obtenerPorId(this.idTrabajo)
      .subscribe({

        next: trabajo => {


          this.form.patchValue({

            idCliente:
              trabajo.idCliente,

            idTecnico:
              trabajo.idTecnico,

            idTarea:
              trabajo.idTarea,

            comentarios:
              trabajo.comentarios

          });


        },

        error: error => {

          console.error(
            'Error al cargar el trabajo',
            error
          );

        }

      });

  }


  // ============================
  // CARGAR CLIENTES
  // ============================

  cargarClientes(): void {


    this.clienteService
      .obtenerCombo()
      .subscribe({

        next: data => {


          this.clientes =
            data;


          this.clientesFiltrados =
            data;


        },

        error: error => {

          console.error(
            'Error al cargar clientes',
            error
          );

        }

      });


    this.clienteFiltro
      .valueChanges
      .subscribe(texto => {


        const filtro =
          (
            texto ?? ''
          )
          .toLowerCase();


        this.clientesFiltrados =
          this.clientes.filter(
            cliente =>

              cliente.nombre
                .toLowerCase()
                .includes(filtro)

          );


      });

  }


  // ============================
  // CARGAR TÉCNICOS
  // ============================

  cargarTecnicos(): void {


    this.usuarioService
      .obtenerTecnicos()
      .subscribe({

        next: data => {

          this.tecnicos =
            data;

        },

        error: error => {

          console.error(
            'Error al cargar técnicos',
            error
          );

        }

      });

  }


  // ============================
  // CARGAR TAREAS
  // ============================

  cargarTareas(): void {


    this.tareaService
      .obtenerTodas()
      .subscribe({

        next: data => {

          this.tareas =
            data;

        },

        error: error => {

          console.error(
            'Error al cargar tareas',
            error
          );

        }

      });

  }


  // ============================
  // GUARDAR
  // ============================

  guardar(): void {


    if (this.form.invalid) {


      this.form.markAllAsTouched();


      return;

    }


    const trabajo:
      TrabajoCreate =
        this.form.getRawValue();


    // ============================
    // CREAR
    // ============================

    if (!this.esEdicion) {


      this.trabajoService
        .crear(trabajo)
        .subscribe({

          next: () => {


            alert(
              'Trabajo creado correctamente'
            );


          },

          error: error => {


            console.error(
              'Error al crear trabajo',
              error
            );


          }

        });


      return;

    }


    // ============================
    // EDITAR
    // ============================

    this.trabajoService
      .actualizar(
        this.idTrabajo,
        trabajo
      )
      .subscribe({

        next: () => {


          alert(
            'Trabajo actualizado correctamente'
          );


        },

        error: error => {


          console.error(
            'Error al actualizar trabajo',
            error
          );


        }

      });

  }

}