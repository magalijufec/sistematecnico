import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  ActivatedRoute
} from '@angular/router';

import {
  MatCardModule
} from '@angular/material/card';

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
  ClienteService
} from '../../../core/services/cliente.service';

import {
  ProvinciaService
} from '../../../core/services/provincia.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

import {
  CiudadService
} from '../../../core/services/ciudad.service';

import {
  Combo
} from '../../../core/models/combo';

import {
  ClienteDetalle
} from '../../../core/models/cliente';
import { ToastService } from '../../../core/services/toast.service';


@Component({
  selector: 'app-cliente-form',

  standalone: true,

  imports: [

    CommonModule,

    ReactiveFormsModule,
    MatCheckboxModule,

    MatCardModule,

    MatFormFieldModule,

    MatInputModule,

    MatSelectModule,

    MatButtonModule

  ],

  templateUrl:
    './cliente-form.html',

  styleUrl:
    './cliente-form.scss'

})
export class ClienteFormComponent
  implements OnInit {


  private fb =
    inject(FormBuilder);

  private router =
    inject(Router);

  private route =
    inject(ActivatedRoute);

  private clienteService =
    inject(ClienteService);

  private provinciaService =
    inject(ProvinciaService);

  private ciudadService =
    inject(CiudadService);
  private toastService = inject(ToastService);


  // ============================
  // DATOS
  // ============================

  provincias: Combo[] = [];

  ciudades: Combo[] = [];


  // ============================
  // EDICIÓN
  // ============================

  idCliente = 0;

  esEdicion = false;


  // ============================
  // FORMULARIO
  // ============================

  form = this.fb.nonNullable.group({
    nroCliente: [
      '',
      Validators.required
    ],

    nombre: [
      '',
      Validators.required
    ],

    email: [
      '',
      Validators.email
    ],

    direccion: [
      ''
    ],

    provinciaId: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    ciudadId: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],
    activo: [true]
  });

  ngOnInit(): void {


    this.idCliente = Number(

      this.route
        .snapshot
        .paramMap
        .get('id')

    );


    this.esEdicion =
      this.idCliente > 0;


    this.cargarProvincias();


    if (this.esEdicion) {

      this.cargarCliente();

    }

  }


  // ============================
  // PROVINCIAS
  // ============================

  cargarProvincias(): void {

    this.provinciaService
      .obtenerCombo()
      .subscribe({

        next: data => {

          this.provincias =
            data;

        },

        error: error => {

          console.error(

            'Error al cargar provincias',

            error

          );

        }

      });

  }


  // ============================
  // CARGAR CLIENTE
  // ============================

  cargarCliente(): void {

    this.clienteService
      .obtenerPorId(this.idCliente)
      .subscribe({

        next: cliente => {

          console.log(
            'Cliente recibido del backend:',
            cliente
          );

          console.log(
            'Provincia recibida:',
            cliente.provinciaId
          );

          console.log(
            'Ciudad recibida:',
            cliente.ciudadId
          );


          // Primero cargamos los datos básicos

          this.form.patchValue({

            nroCliente:
              cliente.nroCliente,

            nombre:
              cliente.nombre,

            email:
              cliente.email ?? '',

            direccion:
              cliente.direccion ?? '',

            provinciaId:
              cliente.provinciaId,
            activo: cliente.activo

          });


          // Luego cargamos las ciudades

          if (
            cliente.provinciaId &&
            cliente.provinciaId > 0
          ) {

            this.cargarCiudades(

              cliente.provinciaId,

              cliente.ciudadId

            );

          }

        },

        error: error => {

          console.error(
            'Error al cargar cliente',
            error
          );

        }

      });

  }



  // ============================
  // CAMBIO PROVINCIA
  // ============================

  cambioProvincia(): void {

    const provinciaId =

      this.form
        .get('provinciaId')
        ?.value;


    // Limpiamos ciudad

    this.ciudades = [];


    this.form.patchValue({

      ciudadId: 0

    });


    if (

      !provinciaId ||

      provinciaId === 0

    ) {

      return;

    }


    this.cargarCiudades(

      provinciaId

    );

  }

  cargarCiudades(
    provinciaId: number,
    ciudadSeleccionada?: number
  ): void {

    console.log(
      'Cargando ciudades de provincia:',
      provinciaId
    );

    this.ciudadService
      .obtenerPorProvincia(provinciaId)
      .subscribe({

        next: data => {

          console.log(
            'Ciudades recibidas:',
            data
          );

          this.ciudades = data;


          if (
            ciudadSeleccionada &&
            ciudadSeleccionada > 0
          ) {

            console.log(
              'Seleccionando ciudad:',
              ciudadSeleccionada
            );

            this.form.patchValue({

              ciudadId:
                ciudadSeleccionada

            });

          }

        },

        error: error => {

          console.error(
            'Error al cargar ciudades',
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
      console.log('Formulario inválido:', this.form.getRawValue());
      return;
    } const datos = this.form.getRawValue();
    console.log('Datos que se envían al backend:', datos);
    console.log('Provincia:', datos.provinciaId);
    console.log('Ciudad:', datos.ciudadId);
    // ============================ // CREAR // ============================ 
    if (!this.esEdicion) {
      this.clienteService.crear({
        nroCliente: datos.nroCliente,
        nombre: datos.nombre,
        email: datos.email || null,
        direccion: datos.direccion || null,
        provinciaId: datos.provinciaId,
        ciudadId: datos.ciudadId,
        activo: datos.activo
      }).subscribe({
        next: () => {
          this.toastService.success(
            'Cliente creado correctamente'
          );
          this.router.navigate(['/clientes']);
        },
        error: error => {
          console.error('Error al crear cliente', error);
          this.toastService.error(
            'No se pudo crear el cliente'
          );

        }
      });
      return;
    }
    // ============================ 
    // // ACTUALIZAR // 
    // ============================ 
    this.clienteService.actualizar(this.idCliente, {
      nroCliente: datos.nroCliente,
      nombre: datos.nombre,
      email: datos.email || null,
      direccion: datos.direccion || null,
      provinciaId: datos.provinciaId,
      ciudadId: datos.ciudadId,
      activo: datos.activo
    }).subscribe({
      next: () => {
        this.toastService.success(
          'Cliente actualizado correctamente'
        );
        this.router.navigate(['/clientes']);
      },
      error: error => {
        console.error('Error al actualizar cliente', error);
        this.toastService.error(
          'No se pudo actualizar el cliente'
        );
      }
    });
  }


  // ============================
  // CANCELAR
  // ============================

  cancelar(): void {

    this.router.navigate(

      ['/clientes']

    );

  }


  // ============================
  // VALIDACIÓN
  // ============================

  campoInvalido(

    nombreCampo: string

  ): boolean {


    const campo =
      this.form.get(
        nombreCampo
      );


    return !!(

      campo &&

      campo.invalid &&

      campo.touched

    );

  }

}

