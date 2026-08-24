import {
  Component,
  OnInit,
  inject
} from '@angular/core';
import {
  CommonModule,
  DatePipe
} from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TrabajoService } from '../../../core/services/trabajo.service';
import { TrabajoFinalizado } from '../../../core/models/trabajo-finalizado';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../environments/environment';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-trabajos-pendiente-pago',
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
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule
  ],
  templateUrl: './trabajos-pendiente-pago.html',
  styleUrl: './trabajos-pendiente-pago.scss'
})
export class TrabajosPendientePagoComponent implements OnInit {

  private trabajoService = inject(TrabajoService);
  private toastService = inject(ToastService);
  trabajos: TrabajoFinalizado[] = [];
  trabajosFiltrados: TrabajoFinalizado[] = [];
  buscar = '';
  provinciaSeleccionada = '';
  ciudadSeleccionada = '';
  clienteSeleccionado = '';
  tecnicoSeleccionado = '';
  tareaSeleccionada = '';

  fechaSolicitudSeleccionada = '';
  fechaInicioSeleccionada = '';
  fechaFinalizadoSeleccionada = '';

  provincias: string[] = [];
  ciudades: string[] = [];
  clientes: string[] = [];
  tecnicos: string[] = [];
  tareas: string[] = [];
  apiUrl = environment.apiUrl;
  api = environment.api;

  columnas = [
  'id',
  'cliente',
  'tecnico',
  'fechaFinalizado',
  'factura',
  'acciones'
];

  ngOnInit(): void {
    this.cargarTrabajos();
  }

  verFactura(rutaFactura: string): void {
    const url = this.api + rutaFactura;

    window.open(
      url,
      '_blank'
    );
  }

  descargarFactura(rutaFactura: string): void {
    const url = this.api + rutaFactura;
    const enlace = document.createElement('a');

    enlace.href = url;
    enlace.target = '_blank';
    enlace.download = '';

    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
  }

  pagarTrabajo(trabajo: TrabajoFinalizado): void {

    if (
      !confirm(
        `¿Confirma registrar el pago del trabajo #${trabajo.id}?`
      )
    ) {
      return;
    }

    this.trabajoService
      .registrarPago(trabajo.id)
      .subscribe({

        next: response => {

          this.toastService.success(
            response?.mensaje ??
            'Pago registrado correctamente.'
          );

          this.cargarTrabajos();

        },

        error: error => {

          console.error(
            'Error al registrar pago',
            error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudo registrar el pago.'
          );

        }

      });

  }

  cargarTrabajos(): void {

    this.trabajoService
      .obtenerPendientePago()
      .subscribe({

        next: data => {

          this.trabajos = data ?? [];

          this.trabajosFiltrados = [
            ...this.trabajos
          ];

          this.cargarOpcionesFiltros();

        },

        error: error => {

          console.error(
            'Error al cargar trabajos pendientes de pago',
            error
          );

        }

      });

  }

  cargarOpcionesFiltros(): void {

    this.provincias = this.obtenerValoresUnicos(
      this.trabajos.map(
        trabajo => trabajo.provincia
      )
    );

    this.clientes = this.obtenerValoresUnicos(
      this.trabajos.map(
        trabajo => trabajo.cliente
      )
    );

    this.tecnicos = this.obtenerValoresUnicos(
      this.trabajos.map(
        trabajo => trabajo.tecnico
      )
    );

    this.tareas = this.obtenerValoresUnicos(
      this.trabajos.map(
        trabajo => trabajo.tarea
      )
    );

    this.actualizarCiudades();

  }

  cambiarProvincia(): void {

    /*
     * Limpiamos la ciudad porque posiblemente
     * no pertenezca a la nueva provincia.
     */
    this.ciudadSeleccionada = '';
    this.actualizarCiudades();

    this.filtrar();

  }


  actualizarCiudades(): void {

    let trabajosParaCiudades = this.trabajos;

    if (this.provinciaSeleccionada) {

      trabajosParaCiudades =
        this.trabajos.filter(
          trabajo =>
            trabajo.provincia ===
            this.provinciaSeleccionada);

    }

    this.ciudades = this.obtenerValoresUnicos(
      trabajosParaCiudades.map(
        trabajo => trabajo.ciudad
      )
    );

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
    ].sort(
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

  filtrar(): void {

    const texto =
      this.normalizarTexto(this.buscar);

    this.trabajosFiltrados =
      this.trabajos.filter(trabajo => {

        const coincideTexto =
          !texto ||

          trabajo.id
            .toString()
            .includes(texto) ||

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
          ).includes(texto);

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

        return (
          coincideTexto &&
          coincideProvincia &&
          coincideCiudad &&
          coincideCliente &&
          coincideTecnico &&
          coincideTarea &&
          coincideFechaSolicitud &&
          coincideFechaInicio &&
          coincideFechaFinalizado
        );

      });

  }

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

    /*
     * Permite comparar fechas recibidas como:
     *
     * 2026-08-24
     * 2026-08-24T14:30:00
     * 2026-08-24T14:30:00Z
     */
    return fechaTrabajo.substring(0, 10) === fechaFiltro;

  }


  normalizarTexto(
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
      this.fechaFinalizadoSeleccionada
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

    this.actualizarCiudades();

    this.trabajosFiltrados = [
      ...this.trabajos
    ];

  }

}