import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule,
  DatePipe
} from '@angular/common';

import {
  MatTableModule
} from '@angular/material/table';

import {
  MatCardModule
} from '@angular/material/card';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatSelectModule
} from '@angular/material/select';

import {
  Router,
  RouterModule
} from '@angular/router';

import {
  FormsModule
} from '@angular/forms';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatTooltipModule
} from '@angular/material/tooltip';

import {
  TrabajoService
} from '../../../core/services/trabajo.service';

import {
  TrabajoFinalizado
} from '../../../core/models/trabajo-finalizado';

@Component({
  selector: 'app-trabajos-finalizados',
  standalone: true,

  imports: [
    CommonModule,
    DatePipe,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule    
  ],

  templateUrl: './trabajos-finalizados.html',

  styleUrl: './trabajos-finalizados.scss'
})
export class TrabajosFinalizadosComponent implements OnInit {

  private trabajoService = inject(TrabajoService);
  private router = inject(Router);

  trabajos: TrabajoFinalizado[] = [];
  trabajosFiltrados: TrabajoFinalizado[] = [];

  /*
   * Filtros generales
   */
  buscar = '';

  provinciaSeleccionada = '';
  ciudadSeleccionada = '';
  clienteSeleccionado = '';
  tecnicoSeleccionado = '';
  tareaSeleccionada = '';

  /*
   * Filtros por fecha exacta
   * El input type="date" devuelve yyyy-MM-dd
   */
  fechaSolicitudSeleccionada = '';
  fechaInicioSeleccionada = '';
  fechaFinalizadoSeleccionada = '';
  fechaPagadoSeleccionada = '';

  /*
   * Opciones para los selects
   */
  provincias: string[] = [];
  ciudades: string[] = [];
  clientes: string[] = [];
  tecnicos: string[] = [];
  tareas: string[] = [];

  displayedColumns = [
    'id',
    'fechaSolicitud',
    'fechaInicio',
    'fechaFinalizado',
    'cliente',
    'provincia',
    'ciudad',
    'tecnico',
    'tarea',
    'fechaPagado',
    'acciones'
  ];

  ngOnInit(): void {
    this.cargarTrabajos();
  }

  cargarTrabajos(): void {

    this.trabajoService
      .obtenerFinalizados()
      .subscribe({

        next: data => {

          this.trabajos = data ?? [];
          this.trabajosFiltrados = [...this.trabajos];

          this.cargarOpcionesFiltros();
        },

        error: error => {

          console.error(
            'Error al cargar trabajos finalizados',
            error
          );

        }

      });
  }

  cargarOpcionesFiltros(): void {

    this.provincias = this.obtenerValoresUnicos(
      this.trabajos.map(trabajo => trabajo.provincia)
    );

    this.clientes = this.obtenerValoresUnicos(
      this.trabajos.map(trabajo => trabajo.cliente)
    );

    this.tecnicos = this.obtenerValoresUnicos(
      this.trabajos.map(trabajo => trabajo.tecnico)
    );

    this.tareas = this.obtenerValoresUnicos(
      this.trabajos.map(trabajo => trabajo.tarea)
    );

    /*
     * Inicialmente se muestran todas las ciudades.
     */
    this.actualizarCiudades();
  }

  obtenerValoresUnicos(
    valores: Array<string | null | undefined>
  ): string[] {

    return [
      ...new Set(
        valores
          .filter(
            (valor): valor is string =>
              valor !== null &&
              valor !== undefined &&
              valor.trim() !== ''
          )
          .map(valor => valor.trim())
      )
    ].sort((a, b) =>
      a.localeCompare(
        b,
        'es',
        {
          sensitivity: 'base'
        }
      )
    );
  }

  cambiarProvincia(): void {

    /*
     * Al cambiar la provincia se limpia la ciudad seleccionada.
     */
    this.ciudadSeleccionada = '';

    this.actualizarCiudades();
    this.filtrar();
  }

  actualizarCiudades(): void {

    let trabajosParaCiudades = this.trabajos;

    if (this.provinciaSeleccionada) {

      trabajosParaCiudades = this.trabajos.filter(
        trabajo =>
          trabajo.provincia === this.provinciaSeleccionada
      );

    }

    this.ciudades = this.obtenerValoresUnicos(
      trabajosParaCiudades.map(
        trabajo => trabajo.ciudad
      )
    );
  }

  filtrar(): void {

    const texto = this.normalizarTexto(this.buscar);

    this.trabajosFiltrados = this.trabajos.filter(
      trabajo => {

        const coincideTexto =
          !texto ||
          this.normalizarTexto(
            trabajo.cliente
          ).includes(texto) ||
          this.normalizarTexto(
            trabajo.tecnico
          ).includes(texto) ||
          this.normalizarTexto(
            trabajo.tarea
          ).includes(texto) ||
          this.normalizarTexto(
            trabajo.provincia
          ).includes(texto) ||
          this.normalizarTexto(
            trabajo.ciudad
          ).includes(texto) ||
          trabajo.id.toString().includes(texto);

        const coincideProvincia =
          !this.provinciaSeleccionada ||
          trabajo.provincia ===
            this.provinciaSeleccionada;

        const coincideCiudad =
          !this.ciudadSeleccionada ||
          trabajo.ciudad ===
            this.ciudadSeleccionada;

        const coincideCliente =
          !this.clienteSeleccionado ||
          trabajo.cliente ===
            this.clienteSeleccionado;

        const coincideTecnico =
          !this.tecnicoSeleccionado ||
          trabajo.tecnico ===
            this.tecnicoSeleccionado;

        const coincideTarea =
          !this.tareaSeleccionada ||
          trabajo.tarea ===
            this.tareaSeleccionada;

        const coincideFechaSolicitud =
          this.coincideFecha(
            trabajo.fechaSolicitud,
            this.fechaSolicitudSeleccionada
          );

        const coincideFechaInicio =
          this.coincideFecha(
            trabajo.fechaInicio,
            this.fechaInicioSeleccionada
          );

        const coincideFechaFinalizado =
          this.coincideFecha(
            trabajo.fechaFinalizado,
            this.fechaFinalizadoSeleccionada
          );

        const coincideFechaPagado =
          this.coincideFecha(
            trabajo.fechaPagado,
            this.fechaPagadoSeleccionada
          );

        return (
          coincideTexto &&
          coincideProvincia &&
          coincideCiudad &&
          coincideCliente &&
          coincideTecnico &&
          coincideTarea &&
          coincideFechaSolicitud &&
          coincideFechaInicio &&
          coincideFechaFinalizado &&
          coincideFechaPagado
        );
      }
    );
  }

  /**
   * Compara solamente año, mes y día.
   *
   * Funciona si la API devuelve:
   * 2026-08-24
   * 2026-08-24T11:30:00
   */
  coincideFecha(
    fechaTrabajo: string | null | undefined,
    fechaFiltro: string
  ): boolean {

    if (!fechaFiltro) {
      return true;
    }

    if (!fechaTrabajo) {
      return false;
    }

    return fechaTrabajo.substring(0, 10) === fechaFiltro;
  }

  normalizarTexto(
    valor: string | null | undefined
  ): string {

    return (valor ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  hayFiltrosAplicados(): boolean {

    return Boolean(
      this.buscar ||
      this.provinciaSeleccionada ||
      this.ciudadSeleccionada ||
      this.clienteSeleccionado ||
      this.tecnicoSeleccionado ||
      this.tareaSeleccionada ||
      this.fechaSolicitudSeleccionada ||
      this.fechaInicioSeleccionada ||
      this.fechaFinalizadoSeleccionada ||
      this.fechaPagadoSeleccionada
    );
  }

  limpiarFiltros(): void {

    this.buscar = '';

    this.provinciaSeleccionada = '';
    this.ciudadSeleccionada = '';
    this.clienteSeleccionado = '';
    this.tecnicoSeleccionado = '';
    this.tareaSeleccionada = '';

    this.fechaSolicitudSeleccionada = '';
    this.fechaInicioSeleccionada = '';
    this.fechaFinalizadoSeleccionada = '';
    this.fechaPagadoSeleccionada = '';

    this.actualizarCiudades();

    this.trabajosFiltrados = [
      ...this.trabajos
    ];
  }

  verTrabajo(id: number): void {

    this.router.navigate([
      '/trabajos',
      id
    ]);

  }
}