import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router,
  RouterModule
} from '@angular/router';

import {
  MatTableModule
} from '@angular/material/table';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatIconModule
} from '@angular/material/icon';

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
  MatTooltipModule
} from '@angular/material/tooltip';

import {
  TrabajoService
} from '../../../core/services/trabajo.service';

import {
  AuthService
} from '../../../core/services/auth.service';

import {
  TrabajoSolicitud
} from '../../../core/models/trabajo-solicitud';


@Component({
  selector: 'app-trabajos-solicitud-list',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule
  ],

  templateUrl:
    './trabajos-solicitud-list.html',

  styleUrl:
    './trabajos-solicitud-list.scss'
})
export class TrabajosSolicitudListComponent
  implements OnInit {

  private readonly trabajoService =
    inject(TrabajoService);

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);


  trabajos: TrabajoSolicitud[] = [];

  trabajosFiltrados: TrabajoSolicitud[] = [];


  cargando = false;

  errorCarga = false;


  /*
   * Filtros
   */

  idSeleccionado: number | null = null;

  clienteSeleccionado = '';

  sectorSeleccionado = '';

  tareaSeleccionada = '';

  estadoSeleccionado: number | null = null;


  /*
   * Opciones de filtros obtenidas de los
   * trabajos devueltos por el backend.
   */

  clientes: string[] = [];

  sectores: string[] = [];

  tareas: string[] = [];

  estados: Array<{
    id: number;
    nombre: string;
  }> = [];


  displayedColumns: string[] = [
    'id',
    'cliente',
    'provincia',
    'ciudad',
    'sector',
    'tarea',
    'estado',
    'acciones'
  ];


  ngOnInit(): void {

    this.cargarTrabajos();

  }


  // ==========================================
  // ROLES
  // ==========================================

  esRol(...roles: string[]): boolean {

    return this.authService.tieneRol(
      ...roles
    );

  }


  get puedeCrearTrabajo(): boolean {

    return this.esRol(
      'Farmacia',
      'Sistemas',
      'Mantenimiento',
      'Monitoreo',
      'Administrador'
    );

  }

  // NAVEGACIÓN
  nuevoTrabajo(): void {
    if (!this.puedeCrearTrabajo) {
      return;
    }
    this.router.navigate([
      '/trabajos',
      'nuevo'
    ]);
  }

  verTrabajo(idTrabajo: number): void {
    this.router.navigate(['/trabajo-solicitud', idTrabajo]);
  }

  // CARGA
  cargarTrabajos(): void {
    this.cargando = true;
    this.errorCarga = false;
    this.trabajoService
      .obtenerSolicitudesDeTrabajo()
      .subscribe({
        next: data => {
          this.trabajos =
            (data ?? [])
              .filter(
                trabajo =>
                  trabajo.idEstado >= 1 &&
                  trabajo.idEstado <= 8
              );
          this.cargarOpcionesFiltros();
          this.filtrar();
          this.cargando = false;
        },

        error: error => {
          this.cargando = false;
          this.errorCarga = true;
          this.trabajos = [];
          this.trabajosFiltrados = [];
          console.error('Error al cargar solicitudes de trabajo', error);
        }
      });
  }

  // OPCIONES DE FILTROS

  private cargarOpcionesFiltros(): void {

    this.clientes =
      this.obtenerValoresUnicos(
        this.trabajos.map(
          trabajo =>
            trabajo.cliente
        )
      );


    this.sectores =
      this.obtenerValoresUnicos(
        this.trabajos.map(
          trabajo =>
            trabajo.sector
        )
      );


    this.tareas =
      this.obtenerValoresUnicos(
        this.trabajos.map(
          trabajo =>
            trabajo.tarea
        )
      );


    const mapaEstados =
      new Map<
        number,
        string
      >();


    this.trabajos.forEach(
      trabajo => {

        if (
          trabajo.idEstado &&
          trabajo.estado
        ) {

          mapaEstados.set(
            trabajo.idEstado,
            trabajo.estado
          );

        }

      }
    );


    this.estados =
      Array.from(
        mapaEstados.entries()
      )
        .map(
          ([id, nombre]) => ({
            id,
            nombre
          })
        )
        .sort(
          (a, b) =>
            a.id - b.id
        );

  }


  private obtenerValoresUnicos(
    valores: Array<
      string |
      null |
      undefined
    >
  ): string[] {

    return [
      ...new Set(
        valores
          .filter(
            (
              valor
            ): valor is string =>
              valor !== null &&
              valor !== undefined &&
              valor.trim() !== ''
          )
          .map(
            valor =>
              valor.trim()
          )
      )
    ]
      .sort(
        (a, b) =>
          a.localeCompare(
            b,
            'es',
            {
              sensitivity: 'base'
            }
          )
      );

  }

  // FILTROS

  filtrar(): void {

    this.trabajosFiltrados =
      this.trabajos.filter(
        trabajo => {

          const coincideId =
            this.idSeleccionado === null ||
            this.idSeleccionado === undefined ||
            this.idSeleccionado.toString().trim() === '' ||
            trabajo.id ===
              Number(
                this.idSeleccionado
              );


          const coincideCliente =
            !this.clienteSeleccionado ||
            this.normalizarTexto(
              trabajo.cliente
            ) ===
            this.normalizarTexto(
              this.clienteSeleccionado
            );


          const coincideSector =
            !this.sectorSeleccionado ||
            this.normalizarTexto(
              trabajo.sector
            ) ===
            this.normalizarTexto(
              this.sectorSeleccionado
            );


          const coincideTarea =
            !this.tareaSeleccionada ||
            this.normalizarTexto(
              trabajo.tarea
            ) ===
            this.normalizarTexto(
              this.tareaSeleccionada
            );


          const coincideEstado =
            this.estadoSeleccionado ===
              null ||
            this.estadoSeleccionado ===
              undefined ||
            trabajo.idEstado ===
              Number(
                this.estadoSeleccionado
              );


          return (
            coincideId &&
            coincideCliente &&
            coincideSector &&
            coincideTarea &&
            coincideEstado
          );

        }
      );

  }


  hayFiltrosAplicados(): boolean {

    return Boolean(
      this.idSeleccionado ||
      this.clienteSeleccionado ||
      this.sectorSeleccionado ||
      this.tareaSeleccionada ||
      this.estadoSeleccionado
    );

  }


  limpiarFiltros(): void {

    this.idSeleccionado = null;

    this.clienteSeleccionado = '';

    this.sectorSeleccionado = '';

    this.tareaSeleccionada = '';

    this.estadoSeleccionado = null;

    this.filtrar();

  }


  private normalizarTexto(
    valor: string |
      null |
      undefined
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