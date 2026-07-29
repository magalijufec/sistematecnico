import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ClienteService } from '../../../core/services/cliente.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { PerfilService } from '../../../core/services/perfil.service';
import { CiudadService } from '../../../core/services/ciudad.service';
import { ProvinciaService } from '../../../core/services/provincia.service';

import { Combo } from '../../../core/models/combo';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.scss'
})
export class UsuarioFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private clienteService = inject(ClienteService);
  private perfilService = inject(PerfilService);
  private usuarioService = inject(UsuarioService);
  private provinciaService = inject(ProvinciaService);
  private ciudadService = inject(CiudadService);


  // ==========================================
  // LISTAS
  // ==========================================

  perfiles: Combo[] = [];

  provincias: Combo[] = [];

  ciudades: Combo[] = [];

  clientes: Combo[] = [];

  clientesFiltrados: Combo[] = [];


  // ==========================================
  // CONTROL
  // ==========================================

  mostrarCliente = false;

  idUsuario = 0;

  esEdicion = false;


  // ==========================================
  // FORMULARIO
  // ==========================================

  form = this.fb.group({

    userName: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],

    nombreApellido: [
      '',
      [
        Validators.required
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      ''
    ],

    idPerfil: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    idProvincia: [
      0,
      Validators.required
    ],

    idCiudad: [
      0,
      Validators.required
    ],

    idCliente: [
      null as number | null
    ],

    numeroCelular: [
      ''
    ],

    activo: [
      true
    ]

  });


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.idUsuario = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.esEdicion =
      this.idUsuario > 0;


    // Cargamos datos base

    this.cargarPerfiles();

    this.cargarProvincias();

    this.detectarCambioPerfil();


    // Si estamos editando

    if (this.esEdicion) {

      // Password NO es obligatorio al editar

      this.form
        .get('password')
        ?.clearValidators();

      this.form
        .get('password')
        ?.updateValueAndValidity();


      this.cargarUsuario();

    }

  }


  // ==========================================
  // CARGAR USUARIO
  // ==========================================

  cargarUsuario(): void {

    this.usuarioService
      .obtenerPorIdInactivoYActivo(this.idUsuario)
      .subscribe({

        next: usuario => {

          console.log(
            'Usuario a editar:',
            usuario
          );


          // Primero cargamos los datos
          // básicos del usuario

          this.form.patchValue({

            userName:
              usuario.userName,

            nombreApellido:
              usuario.nombreApellido,

            email:
              usuario.email,

            numeroCelular:
              usuario.numeroCelular,

            idPerfil:
              usuario.perfilId,

            idProvincia:
              usuario.provinciaId,

            idCiudad:
              usuario.ciudadId,

            idCliente:
              usuario.clienteId,

            activo:
              usuario.activo

          });


          // Mostrar u ocultar cliente

          this.actualizarVisibilidadCliente(
            usuario.perfilId
          );


          // =====================================
          // CARGAR CIUDADES
          // =====================================

          if (usuario.provinciaId) {

            this.ciudadService
              .obtenerPorProvincia(
                usuario.provinciaId
              )
              .subscribe({

                next: ciudades => {

                  this.ciudades =
                    ciudades;


                  // Restauramos la ciudad

                  this.form.patchValue({

                    idCiudad:
                      usuario.ciudadId

                  });


                  // =================================
                  // CARGAR CLIENTES
                  // =================================

                  if (
                    usuario.provinciaId &&
                    usuario.ciudadId
                  ) {

                    this.cargarClientesPorProvinciaCiudad(

                      usuario.provinciaId,

                      usuario.ciudadId,

                      usuario.clienteId

                    );

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

        },

        error: error => {

          console.error(
            'Error al cargar usuario',
            error
          );

        }

      });

  }


  // ==========================================
  // PROVINCIAS
  // ==========================================

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


  // ==========================================
  // CAMBIO DE PROVINCIA
  // ==========================================

  cambioProvincia(): void {

    // IMPORTANTE:
    // El control se llama idProvincia
    // NO provinciaId

    const provinciaId =
      this.form
        .get('idProvincia')
        ?.value;


    console.log(
      'Provincia seleccionada:',
      provinciaId
    );


    // Limpiamos ciudades

    this.ciudades = [];


    // Limpiamos clientes

    this.clientes = [];

    this.clientesFiltrados = [];


    // Reseteamos ciudad y cliente

    this.form.patchValue({

      idCiudad: 0,

      idCliente: null

    });


    // Si no hay provincia,
    // no hacemos nada

    if (
      !provinciaId ||
      provinciaId === 0
    ) {

      return;

    }


    // ==========================================
    // CARGAR CIUDADES
    // ==========================================

    this.ciudadService
      .obtenerPorProvincia(
        provinciaId
      )
      .subscribe({

        next: data => {

          console.log(
            'Ciudades recibidas:',
            data
          );

          this.ciudades =
            data;

        },

        error: error => {

          console.error(
            'Error al cargar ciudades',
            error
          );

        }

      });

  }


  // ==========================================
  // CAMBIO DE CIUDAD
  // ==========================================

  cambioCiudad(): void {

    // IMPORTANTE:
    // Los controles son idProvincia e idCiudad

    const provinciaId =
      this.form
        .get('idProvincia')
        ?.value;

    const ciudadId =
      this.form
        .get('idCiudad')
        ?.value;


    console.log(
      'Provincia:',
      provinciaId
    );

    console.log(
      'Ciudad:',
      ciudadId
    );


    // Limpiamos clientes

    this.clientes = [];

    this.clientesFiltrados = [];


    // Reseteamos cliente

    this.form.patchValue({

      idCliente: null

    });


    if (
      !provinciaId ||
      provinciaId === 0 ||
      !ciudadId ||
      ciudadId === 0
    ) {

      return;

    }


    this.cargarClientesPorProvinciaCiudad(

      provinciaId,

      ciudadId

    );

  }


  // ==========================================
  // CARGAR CLIENTES POR PROVINCIA Y CIUDAD
  // ==========================================

  cargarClientesPorProvinciaCiudad(

    provinciaId: number,

    ciudadId: number,

    clienteSeleccionadoId?: number | null

  ): void {

    this.clienteService
      .obtenerPorProvinciaCiudad(

        provinciaId,

        ciudadId

      )
      .subscribe({

        next: data => {

          console.log(
            'Clientes recibidos:',
            data
          );


          this.clientes =
            data;

          this.clientesFiltrados =
            data;


          // Si estamos editando
          // restauramos el cliente

          if (
            clienteSeleccionadoId
          ) {

            this.form.patchValue({

              idCliente:
                clienteSeleccionadoId

            });

          }

        },

        error: error => {

          console.error(
            'Error al cargar clientes',
            error
          );

        }

      });

  }


  // ==========================================
  // PERFILES
  // ==========================================

  cargarPerfiles(): void {

    this.perfilService
      .obtenerPerfiles()
      .subscribe({

        next: data => {

          this.perfiles =
            data;


          // Si estamos editando,
          // volvemos a evaluar el perfil

          if (this.esEdicion) {

            const idPerfil =
              this.form
                .get('idPerfil')
                ?.value;

            if (idPerfil) {

              this.actualizarVisibilidadCliente(
                idPerfil
              );

            }

          }

        },

        error: error => {

          console.error(
            'Error al cargar perfiles',
            error
          );

        }

      });

  }


  // ==========================================
  // CAMBIO DE PERFIL
  // ==========================================

  detectarCambioPerfil(): void {

    this.form
      .controls
      .idPerfil
      .valueChanges
      .subscribe(idPerfil => {

        if (!idPerfil) {

          this.mostrarCliente =
            false;

          return;

        }


        this.actualizarVisibilidadCliente(
          idPerfil
        );

      });

  }


  // ==========================================
  // MOSTRAR / OCULTAR CLIENTE
  // ==========================================

  actualizarVisibilidadCliente(
    idPerfil: number
  ): void {

    const perfil =
      this.perfiles.find(
        x => x.id === idPerfil
      );


    if (!perfil) {

      return;

    }


    if (
      perfil.nombre
        .trim()
        .toLowerCase() ===
      'farmacia'
    ) {

      this.mostrarCliente =
        true;


      this.form
        .controls
        .idCliente
        .setValidators([
          Validators.required
        ]);

    }

    else {

      this.mostrarCliente =
        false;


      this.form
        .controls
        .idCliente
        .setValue(null);


      this.form
        .controls
        .idCliente
        .clearValidators();

    }


    this.form
      .controls
      .idCliente
      .updateValueAndValidity();

  }


  // ==========================================
  // GUARDAR
  // ==========================================

  guardar(): void {

    if (
      this.form.invalid
    ) {

      this.form.markAllAsTouched();

      console.log(
        'Formulario inválido',
        this.form.value
      );

      return;

    }


    const datos =
      this.form.getRawValue();


    // ==========================================
    // CREAR
    // ==========================================

    if (
      !this.esEdicion
    ) {

      this.usuarioService
        .crear(datos)
        .subscribe({

          next: () => {

            alert(
              'Usuario creado correctamente'
            );

            this.router.navigate([
              '/usuarios'
            ]);

          },

          error: error => {

            console.error(
              'Error al crear usuario',
              error
            );

            alert(
              'No se pudo crear el usuario'
            );

          }

        });

      return;

    }


    // ==========================================
    // ACTUALIZAR
    // ==========================================

    this.usuarioService
      .actualizar(

        this.idUsuario,

        datos

      )
      .subscribe({

        next: () => {

          alert(
            'Usuario actualizado correctamente'
          );

          this.router.navigate([
            '/usuarios'
          ]);

        },

        error: error => {

          console.error(
            'Error al actualizar usuario',
            error
          );

          alert(
            'No se pudo actualizar el usuario'
          );

        }

      });

  }


  // ==========================================
  // CANCELAR
  // ==========================================

  cancelar(): void {

    this.router.navigate([
      '/usuarios'
    ]);

  }


  // ==========================================
  // VALIDACIÓN
  // ==========================================

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