import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import {
  MatTableDataSource,
  MatTableModule
} from '@angular/material/table';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatTooltipModule
} from '@angular/material/tooltip';

import {
  MatPaginator,
  MatPaginatorModule
} from '@angular/material/paginator';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatSelectModule
} from '@angular/material/select';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatDatepickerModule
} from '@angular/material/datepicker';

import {
  MatNativeDateModule
} from '@angular/material/core';

import { Router } from '@angular/router';

import * as XLSX from 'xlsx';

import {
  IncidenciasService
} from '../../../core/services/incidencia.service';

import {
  IncidenciaFinalizada
} from '../../../core/models/incidencia-finalizada';

import {
  VerTrabajoRealizadoDialogComponent
} from '../ver-trabajo-realizado-dialog/ver-trabajo-realizado-dialog';
import { FormControl } from '@angular/forms';
import { NgxMatSelectSearchModule }
from 'ngx-mat-select-search';

@Component({
  selector: 'app-incidencias-finalizadas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatSelectSearchModule
  ],
  templateUrl: './incidencias-finalizadas.html',
  styleUrl: './incidencias-finalizadas.scss'
})
export class IncidenciasFinalizadasComponent
  implements OnInit, AfterViewInit {

  dataSource =
    new MatTableDataSource<IncidenciaFinalizada>([]);

  incidenciasOriginales: IncidenciaFinalizada[] = [];

  formularioFiltros!: FormGroup;

  clienteFiltro = new FormControl('');

  clientesOriginales: string[] = [];

  clientes: string[] = [];
  usuarios: string[] = [];
  tiposIncidencia: string[] = [];
  asistencias: string[] = [];

  displayedColumns: string[] = [
    'id',
    'fecha',
    'usuario',
    'cliente',
    'asistencia',
    'destino',
    'incidencia',
    'guardia',
    'accion'
  ];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private incidenciasService: IncidenciasService,
    private dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.crearFormularioFiltros();
    this.configurarFiltro();
    this.cargar();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  private crearFormularioFiltros(): void {
    this.formularioFiltros = this.fb.group({
      cliente: [null],
      fechaDesde: [null],
      fechaHasta: [null],
      usuario: [null],
      incidencia: [null],
      asistencia: [null]
    });

    this.formularioFiltros.valueChanges
      .subscribe(() => {
        this.aplicarFiltros();
      });
  }

  cargar(): void {
    this.incidenciasService
      .obtenerFinalizadas()
      .subscribe({
        next: incidencias => {
          this.incidenciasOriginales = incidencias;
          this.dataSource.data = incidencias;

          this.cargarOpcionesFiltros(incidencias);

          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
        },
        error: error => {
          console.error(
            'Error al obtener incidencias finalizadas:',
            error
          );
        }
      });
  }

  private cargarOpcionesFiltros(
    incidencias: IncidenciaFinalizada[]
  ): void {

    this.clientesOriginales =
      this.obtenerValoresUnicos(
        incidencias.map(x => x.cliente)
      );

    this.clientes =
      [...this.clientesOriginales];

    this.usuarios =
      this.obtenerValoresUnicos(
        incidencias.map(x => x.usuario)
      );

    this.tiposIncidencia =
      this.obtenerValoresUnicos(
        incidencias.map(x => x.incidencia)
      );

    this.asistencias =
      this.obtenerValoresUnicos(
        incidencias.map(x => x.asistencia)
      );

    this.configurarFiltroClientes();
  }

  private configurarFiltroClientes(): void {

    this.clienteFiltro.valueChanges
      .subscribe(texto => {

        const filtro =
          this.normalizarTexto(texto ?? '');

        this.clientes =
          this.clientesOriginales.filter(
            cliente =>

              this.normalizarTexto(
                cliente
              ).includes(filtro)

          );

      });

  }

  private normalizarTexto(
    texto: string
  ): string {

    return (texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  }

  private obtenerValoresUnicos(
    valores: Array<string | null | undefined>
  ): string[] {

    return [
      ...new Set(
        valores.filter(
          (valor): valor is string =>
            !!valor && valor.trim() !== ''
        )
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

  private configurarFiltro(): void {
    this.dataSource.filterPredicate =
      (
        item: IncidenciaFinalizada,
        filtroJson: string
      ): boolean => {

        const filtros = JSON.parse(filtroJson);

        const coincideCliente =
          !filtros.cliente ||
          item.cliente === filtros.cliente;

        const coincideUsuario =
          !filtros.usuario ||
          item.usuario === filtros.usuario;

        const coincideIncidencia =
          !filtros.incidencia ||
          item.incidencia === filtros.incidencia;

        const coincideAsistencia =
          !filtros.asistencia ||
          item.asistencia === filtros.asistencia;

        /*
         * Si fechaFinalizado viene nula porque fue creada
         * directamente como finalizada, usamos fecha.
         */
        const fechaReferencia =
          item.fechaFinalizado ?? item.fecha;

        const fechaItem =
          this.convertirFechaLocal(fechaReferencia);

        const fechaDesde =
          filtros.fechaDesde
            ? this.inicioDelDia(
              new Date(filtros.fechaDesde)
            )
            : null;

        const fechaHasta =
          filtros.fechaHasta
            ? this.finDelDia(
              new Date(filtros.fechaHasta)
            )
            : null;

        const coincideFechaDesde =
          !fechaDesde ||
          (
            fechaItem !== null &&
            fechaItem >= fechaDesde
          );

        const coincideFechaHasta =
          !fechaHasta ||
          (
            fechaItem !== null &&
            fechaItem <= fechaHasta
          );

        return (
          coincideCliente &&
          coincideUsuario &&
          coincideIncidencia &&
          coincideAsistencia &&
          coincideFechaDesde &&
          coincideFechaHasta
        );
      };
  }

  aplicarFiltros(): void {
    const filtros = this.formularioFiltros.value;

    this.dataSource.filter = JSON.stringify({
      cliente: filtros.cliente ?? null,

      fechaDesde:
        filtros.fechaDesde
          ? new Date(filtros.fechaDesde).toISOString()
          : null,

      fechaHasta:
        filtros.fechaHasta
          ? new Date(filtros.fechaHasta).toISOString()
          : null,

      usuario: filtros.usuario ?? null,

      incidencia: filtros.incidencia ?? null,

      asistencia: filtros.asistencia ?? null
    });

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  limpiarFiltros(): void {

    this.formularioFiltros.reset();

    this.clienteFiltro.setValue('');

    this.clientes =
      [...this.clientesOriginales];

    this.dataSource.filter = '';

    if (this.dataSource.paginator) {

      this.dataSource.paginator.firstPage();

    }

  }

  private convertirFechaLocal(
    valor: string | Date | null | undefined
  ): Date | null {

    if (!valor) {
      return null;
    }

    const fecha = new Date(valor);

    if (isNaN(fecha.getTime())) {
      return null;
    }

    return fecha;
  }

  private inicioDelDia(fecha: Date): Date {
    const resultado = new Date(fecha);
    resultado.setHours(0, 0, 0, 0);

    return resultado;
  }

  private finDelDia(fecha: Date): Date {
    const resultado = new Date(fecha);
    resultado.setHours(23, 59, 59, 999);

    return resultado;
  }

  nuevaIncidencia(): void {
    this.router.navigate(
      ['/incidencias/nueva-incidencia'],
      {
        queryParams: {
          estado: 'finalizado'
        }
      }
    );
  }

  verTrabajoRealizado(
    incidencia: IncidenciaFinalizada
  ): void {

    this.dialog.open(
      VerTrabajoRealizadoDialogComponent,
      {
        width: '650px',
        maxWidth: '95vw',
        data: incidencia
      }
    );
  }

  exportarExcel(): void {
    const registros =
      this.dataSource.filteredData;

    if (registros.length === 0) {
      return;
    }

    const datosExcel = registros.map(item => ({
      'Fecha creación':
        this.formatearFechaHora(item.fecha),

      'Usuario':
        item.usuario ?? '-',

      'Cliente':
        item.cliente ?? '-',

      'Asistencia':
        item.asistencia ?? '-',

      'Destino':
        item.destino ?? '-',

      'Incidencia':
        item.incidencia ?? '-',

      'Otro':
        item.otro ?? '-',

      'Trabajo realizado':
        item.trabajoRealizado ?? '-',

      'Guardia':
        item.guardia ? 'Sí' : 'No',

      'Usuario finalizó':
        item.usuarioFinalizado ?? '-',

      'Fecha finalización':
        item.fechaFinalizado
          ? this.formatearFechaHora(
            item.fechaFinalizado
          )
          : '-'
    }));

    const hoja =
      XLSX.utils.json_to_sheet(datosExcel);

    hoja['!cols'] = [
      { wch: 20 },
      { wch: 25 },
      { wch: 35 },
      { wch: 18 },
      { wch: 18 },
      { wch: 30 },
      { wch: 40 },
      { wch: 70 },
      { wch: 12 },
      { wch: 25 },
      { wch: 20 }
    ];

    const libro =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      libro,
      hoja,
      'Incidencias finalizadas'
    );

    const fechaActual =
      this.formatearFechaArchivo(new Date());

    XLSX.writeFile(
      libro,
      `incidencias-finalizadas-${fechaActual}.xlsx`
    );
  }

  private formatearFechaHora(
    valor: string | Date | null | undefined
  ): string {

    if (!valor) {
      return '-';
    }

    const fecha = new Date(valor);

    if (isNaN(fecha.getTime())) {
      return '-';
    }

    return new Intl.DateTimeFormat(
      'es-AR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(fecha);
  }

  private formatearFechaArchivo(
    fecha: Date
  ): string {

    const anio = fecha.getFullYear();

    const mes =
      String(fecha.getMonth() + 1)
        .padStart(2, '0');

    const dia =
      String(fecha.getDate())
        .padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }
}