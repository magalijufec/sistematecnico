import {
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Subject,
  takeUntil
} from 'rxjs';

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
  MatIconModule
} from '@angular/material/icon';

import {
  NgxMatSelectSearchModule
} from 'ngx-mat-select-search';

import {
  ClienteService
} from '../../../core/services/cliente.service';

import {
  TareaService
} from '../../../core/services/tarea.service';

import {
  TrabajoService
} from '../../../core/services/trabajo.service';

import {
  SectorService
} from '../../../core/services/sector.service';

import {
  UsuarioService
} from '../../../core/services/usuario.service';

import {
  AuthService
} from '../../../core/services/auth.service';

import {
  ToastService
} from '../../../core/services/toast.service';

import {
  Combo
} from '../../../core/models/combo';

import {
  ClienteCombo
} from '../../../core/models/cliente-combo';

import {
  TecnicoCombo
} from '../../../core/models/tecnico-combo';

import {
  TrabajoCreate
} from '../../../core/models/trabajo-create';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-trabajo-form',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    NgxMatSelectSearchModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],

  templateUrl: './trabajo-form.html',
  styleUrl: './trabajo-form.scss'
})
export class TrabajoFormComponent
  implements OnInit, OnDestroy {

  private readonly fb =
    inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly clienteService =
    inject(ClienteService);

  private readonly tareaService =
    inject(TareaService);

  private readonly trabajoService =
    inject(TrabajoService);

  private readonly sectorService =
    inject(SectorService);

  private readonly usuarioService =
    inject(UsuarioService);

  private readonly authService =
    inject(AuthService);

  private readonly toastService =
    inject(ToastService);

  private readonly destroy$ =
    new Subject<void>();


  idTrabajo = 0;

  esEdicion = false;

  guardando = false;

  cargandoTareas = false;

  cargandoTecnicos = false;

  rolUsuario = '';


  clientes: ClienteCombo[] = [];

  clientesFiltrados: ClienteCombo[] = [];

  sectores: Combo[] = [];

  tareas: Combo[] = [];

  tecnicos: TecnicoCombo[] = [];

  tecnicosFiltrados: TecnicoCombo[] = [];

  archivos: File[] = [];


  clienteFiltro =
    new FormControl<string>(
      '',
      {
        nonNullable: true
      }
    );

  tecnicoFiltro =
    new FormControl<string>(
      '',
      {
        nonNullable: true
      }
    );


  form = this.fb.nonNullable.group({

    idCliente: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    idSector: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    idTarea: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    idsTecnicos: [
      [] as number[]
    ],

    comentarios: [
      ''
    ]

  });


  ngOnInit(): void {

    this.idTrabajo =
      Number(
        this.route.snapshot
          .paramMap
          .get('id')
      );

    this.esEdicion =
      this.idTrabajo > 0;

    this.cargarContextoUsuario();

    this.configurarFiltros();

    this.configurarCambiosFormulario();

    this.cargarDatosIniciales();
  }


  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();
  }


  // ==========================================
  // CONTEXTO DEL USUARIO
  // ==========================================

  private cargarContextoUsuario(): void {

    this.rolUsuario =
      this.authService.obtenerRol() ?? '';

  }


  esRol(...roles: string[]): boolean {

    const rolActual =
      this.rolUsuario
        .trim()
        .toLowerCase();

    return roles.some(
      rol =>
        rol.trim().toLowerCase() ===
        rolActual
    );
  }


  get esFarmacia(): boolean {

    return this.esRol(
      'Farmacia'
    );
  }


  get puedeSeleccionarCliente(): boolean {

    return this.esRol(
      'Administrador',
      'Sistemas',
      'Mantenimiento',
      'Monitoreo'
    );
  }


  get puedeAsignarTecnicos(): boolean {

    return this.esRol(
      'Administrador',
      'Sistemas',
      'Mantenimiento',
      'Monitoreo'
    );
  }


  get sectorRestringido(): boolean {

    return this.esRol(
      'Mantenimiento',
      'Monitoreo'
    );
  }


  // ==========================================
  // CONFIGURACIÓN INICIAL
  // ==========================================

  private configurarFiltros(): void {

    this.clienteFiltro
      .valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(texto => {

        const filtro =
          this.normalizarTexto(
            texto
          );

        this.clientesFiltrados =
          this.clientes.filter(
            cliente =>
              this.normalizarTexto(
                cliente.nombre
              ).includes(filtro)
          );

      });


    this.tecnicoFiltro
      .valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(texto => {

        const filtro =
          this.normalizarTexto(
            texto
          );

        this.tecnicosFiltrados =
          this.tecnicos.filter(
            tecnico =>
              this.normalizarTexto(
                tecnico.nombre
              ).includes(filtro)
          );

      });

  }


  private configurarCambiosFormulario(): void {

    this.form.controls.idCliente
      .valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(clienteId => {

        this.form.controls
          .idsTecnicos
          .setValue(
            [],
            {
              emitEvent: false
            }
          );

        this.tecnicos = [];

        this.tecnicosFiltrados = [];

        if (
          clienteId > 0 &&
          this.puedeAsignarTecnicos
        ) {
          this.cargarTecnicos(
            clienteId
          );
        }

      });


    this.form.controls.idSector
      .valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(sectorId => {

        this.form.controls
          .idTarea
          .setValue(
            0,
            {
              emitEvent: false
            }
          );

        this.tareas = [];

        if (sectorId > 0) {

          this.cargarTareasPorSector(
            sectorId
          );

        }

      });

  }


  private cargarDatosIniciales(): void {

    this.cargarSectores();

    if (this.puedeSeleccionarCliente) {

      this.cargarClientes();

    }

    /*
     * Para Farmacia, el cliente debería venir del usuario
     * autenticado o desde el backend.
     *
     * Como tu AuthService por ahora solo expone obtenerRol(),
     * todavía no fijamos automáticamente idCliente aquí.
     */

    if (this.esEdicion) {

      this.cargarTrabajo();

    }

  }


  // ==========================================
  // CLIENTES
  // ==========================================

  cargarClientes(): void {

    this.clienteService
      .obtenerCombo()
      .subscribe({

        next: data => {

          this.clientes =
            data ?? [];

          this.clientesFiltrados =
            [...this.clientes];

        },

        error: error => {

          console.error(
            'Error al cargar clientes',
            error
          );

          this.toastService.error(
            'No se pudieron cargar los clientes.'
          );

        }

      });

  }


  cambioCliente(): void {

    const clienteId =
      this.form.controls
        .idCliente
        .value;

    if (clienteId <= 0) {

      this.tecnicos = [];

      this.tecnicosFiltrados = [];

      this.form.controls
        .idsTecnicos
        .setValue([]);

      return;

    }

    if (this.puedeAsignarTecnicos) {

      this.cargarTecnicos(
        clienteId
      );

    }

  }


  // ==========================================
  // SECTORES
  // ==========================================

  cargarSectores(): void {

    this.sectorService
      .obtenerTodas()
      .subscribe({

        next: data => {

          const sectoresRecibidos =
            data ?? [];

          if (
            this.esRol('Mantenimiento')
          ) {

            this.aplicarSectorDelRol(
              sectoresRecibidos,
              'Mantenimiento'
            );

            return;

          }

          if (
            this.esRol('Monitoreo')
          ) {

            this.aplicarSectorDelRol(
              sectoresRecibidos,
              'Monitoreo'
            );

            return;

          }

          this.sectores =
            sectoresRecibidos;

        },

        error: error => {

          console.error(
            'Error al cargar sectores',
            error
          );

          this.toastService.error(
            'No se pudieron cargar los sectores.'
          );

        }

      });

  }


  private aplicarSectorDelRol(
    sectores: Combo[],
    nombreSector: string
  ): void {

    const sector =
      sectores.find(
        item =>
          this.normalizarTexto(
            item.nombre
          ) ===
          this.normalizarTexto(
            nombreSector
          )
      );

    if (!sector) {

      this.sectores = [];

      this.toastService.error(
        `No se encontró el sector ${nombreSector}.`
      );

      return;

    }

    this.sectores = [
      sector
    ];

    this.form.controls
      .idSector
      .setValue(
        sector.id,
        {
          emitEvent: false
        }
      );

    this.form.controls
      .idSector
      .disable(
        {
          emitEvent: false
        }
      );

    this.cargarTareasPorSector(
      sector.id
    );

  }


  // ==========================================
  // TAREAS POR SECTOR
  // ==========================================

  cargarTareasPorSector(
    sectorId: number
  ): void {

    if (sectorId <= 0) {

      this.tareas = [];

      return;

    }

    this.cargandoTareas = true;

    this.tareaService
      .obtenerPorSector(
        sectorId
      )
      .subscribe({

        next: data => {

          this.tareas =
            data ?? [];

          this.cargandoTareas =
            false;

        },

        error: error => {

          this.cargandoTareas =
            false;

          this.tareas = [];

          console.error(
            'Error al cargar tareas por sector',
            error
          );

          this.toastService.error(
            'No se pudieron cargar las tareas del sector.'
          );

        }

      });

  }


  // ==========================================
  // TÉCNICOS
  // ==========================================

  cargarTecnicos(
    clienteId?: number
  ): void {

    const idCliente =
      clienteId ??
      this.form.controls
        .idCliente
        .value;

    if (idCliente <= 0) {

      this.tecnicos = [];

      this.tecnicosFiltrados = [];

      return;

    }

    this.cargandoTecnicos = true;

    this.usuarioService
      .obtenerTecnicos(
        idCliente
      )
      .subscribe({

        next: data => {

          this.tecnicos =
            data ?? [];

          this.tecnicosFiltrados =
            [...this.tecnicos];

          this.cargandoTecnicos =
            false;

        },

        error: error => {

          this.cargandoTecnicos =
            false;

          this.tecnicos = [];

          this.tecnicosFiltrados = [];

          console.error(
            'Error al cargar técnicos',
            error
          );

          this.toastService.error(
            'No se pudieron cargar los técnicos.'
          );

        }

      });

  }


  // ==========================================
  // CARGAR TRABAJO EN EDICIÓN
  // ==========================================

  cargarTrabajo(): void {

    this.trabajoService
      .obtenerPorId(
        this.idTrabajo
      )
      .subscribe({

        next: trabajo => {

          this.form.patchValue(
            {
              idCliente:
                trabajo.idCliente,

              idSector:
                trabajo.idSector,

              idTarea:
                trabajo.idTarea,

              idsTecnicos:
                trabajo.idsTecnicos ?? [],

              comentarios:
                trabajo.comentarios ?? ''
            },
            {
              emitEvent: false
            }
          );


          if (
            trabajo.idSector &&
            trabajo.idSector > 0
          ) {

            this.cargarTareasPorSector(
              trabajo.idSector
            );

          }


          if (
            trabajo.idCliente &&
            trabajo.idCliente > 0 &&
            this.puedeAsignarTecnicos
          ) {

            this.cargarTecnicos(
              trabajo.idCliente
            );

          }

        },

        error: error => {

          console.error(
            'Error al cargar el trabajo',
            error
          );

          this.toastService.error(
            'No se pudo cargar el trabajo.'
          );

        }

      });

  }


  // ==========================================
  // IMÁGENES
  // ==========================================

  seleccionarArchivos(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    if (!input.files) {
      return;
    }

    const nuevosArchivos =
      Array.from(
        input.files
      );

    const archivosValidos =
      nuevosArchivos.filter(
        archivo =>
          archivo.type.startsWith(
            'image/'
          )
      );


    const archivosCombinados = [
      ...this.archivos,
      ...archivosValidos
    ];


    this.archivos =
      archivosCombinados.filter(
        (
          archivo,
          indice,
          lista
        ) =>
          lista.findIndex(
            item =>
              item.name ===
              archivo.name &&
              item.size ===
              archivo.size &&
              item.lastModified ===
              archivo.lastModified
          ) === indice
      );


    input.value = '';

  }


  quitarArchivo(
    indice: number
  ): void {

    this.archivos =
      this.archivos.filter(
        (_, posicion) =>
          posicion !== indice
      );

  }


  // ==========================================
  // GUARDAR
  // ==========================================

  guardar(): void {

    if (this.guardando) {
      return;
    }

    const valores = this.form.getRawValue();

    // valores.idCliente = this.authService.obtenerClienteId() ?? 0;

    // this.form.controls.idCliente.setValue(valores.idCliente);

    if (valores.idCliente <= 0) {

      this.form.controls
        .idCliente
        .markAsTouched();

      this.toastService.warning(
        'Debe seleccionar un cliente.'
      );

      return;

    }


    if (valores.idSector <= 0) {

      this.form.controls
        .idSector
        .markAsTouched();

      this.toastService.warning(
        'Debe seleccionar un sector.'
      );

      return;

    }


    if (valores.idTarea <= 0) {

      this.form.controls
        .idTarea
        .markAsTouched();

      this.toastService.warning(
        'Debe seleccionar una tarea.'
      );

      return;

    }


    if (this.puedeAsignarTecnicos && valores.idsTecnicos.length === 0) {

      this.form.controls.idsTecnicos.markAsTouched();

      this.toastService.warning(
        'Debe asignar al menos un técnico.'
      );

      return;

    }


    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }


    const trabajo: TrabajoCreate = {

      idCliente: valores.idCliente,
      idSector: valores.idSector,

      idTarea:
        valores.idTarea,

      idsTecnicos:
        valores.idsTecnicos,

      comentarios:
        valores.comentarios.trim() ||
        null,

      archivos:
        this.archivos,
      idUsuarioCreacion:
        this.authService
          .obtenerUsuarioId()
        ?? 0

    };


    this.guardando = true;


    if (!this.esEdicion) {

      this.crearTrabajo(
        trabajo
      );

      return;

    }


    this.actualizarTrabajo(
      trabajo
    );

  }


  private crearTrabajo(
    trabajo: TrabajoCreate
  ): void {

    this.trabajoService
      .crear(
        trabajo
      )
      .subscribe({

        next: () => {

          this.guardando = false;

          this.toastService.success(
            'Solicitud de trabajo creada correctamente.'
          );

          this.router.navigate(
            ['/trabajos']
          );

        },

        error: error => {

          this.guardando = false;

          console.error(
            'Error al crear trabajo',
            error
          );

          console.error(
            'Respuesta del backend',
            error.error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudo crear la solicitud.'
          );

        }

      });

  }


  private actualizarTrabajo(
    trabajo: TrabajoCreate
  ): void {

    this.trabajoService
      .actualizar(
        this.idTrabajo,
        trabajo
      )
      .subscribe({

        next: () => {

          this.guardando = false;

          this.toastService.success(
            'Trabajo actualizado correctamente.'
          );

          this.router.navigate(
            ['/trabajos']
          );

        },

        error: error => {

          this.guardando = false;

          console.error(
            'Error al actualizar trabajo',
            error
          );

          console.error(
            'Respuesta del backend',
            error.error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudo actualizar el trabajo.'
          );

        }

      });

  }


  // ==========================================
  // CANCELAR
  // ==========================================

  cancelar(): void {

    this.router.navigate(
      ['/trabajos']
    );

  }


  // ==========================================
  // UTILIDADES
  // ==========================================

  private normalizarTexto(
    valor: string | null | undefined
  ): string {

    return (valor ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .trim();

  }

}