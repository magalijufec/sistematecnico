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
  ActivatedRoute
} from '@angular/router';

import {
  FormsModule
} from '@angular/forms';

import {
  MatCardModule
} from '@angular/material/card';

import {
  MatDividerModule
} from '@angular/material/divider';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatIconModule
} from '@angular/material/icon';

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
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
  QuillModule
} from 'ngx-quill';

import {
  TrabajoService
} from '../../../core/services/trabajo.service';

import {
  TrabajoDetalle
} from '../../../core/models/trabajo-detalle';

import {
  TrabajoImagenComparacion
} from '../../../core/models/imagen';

import {
  TrabajoImagenComparacionService
} from '../../../core/services/trabajo.imagen.comparacion.service';

import {
  AuthService
} from '../../../core/services/auth.service';

import {
  ToastService
} from '../../../core/services/toast.service';

import {
  environment
} from '../../../environments/environment';


@Component({
  selector: 'app-trabajo-detalle',

  standalone: true,

  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    QuillModule
  ],

  templateUrl: './trabajo-detalle.html',

  styleUrl: './trabajo-detalle.scss'
})
export class TrabajoDetalleComponent
  implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly trabajoService =
    inject(TrabajoService);

  private readonly comparacionService =
    inject(TrabajoImagenComparacionService);

  private readonly authService =
    inject(AuthService);

  private readonly toastService =
    inject(ToastService);


  readonly api =
    environment.api;


  // ==========================================
  // ESTADOS DEL TRABAJO
  // ==========================================

  readonly ESTADO_EN_PROCESO = 9;

  readonly ESTADO_PENDIENTE_APROBACION_TRABAJO = 10;

  readonly ESTADO_MEJORA_SOLICITADA = 11;

  readonly ESTADO_APROBADO = 12;

  readonly ESTADO_PENDIENTE_FACTURACION = 13;

  readonly ESTADO_PENDIENTE_PAGO = 14;

  readonly ESTADO_FINALIZADO = 15;

  readonly ESTADO_CANCELADO = 16;


  // ==========================================
  // DATOS
  // ==========================================

  idTrabajo = 0;

  trabajo?: TrabajoDetalle;

  comparaciones: TrabajoImagenComparacion[] = [];

  comentariosMejora = '';

  mostrarSolicitudMejora = false;


  /*
   * Inputs datetime-local.
   *
   * El formato esperado es:
   * yyyy-MM-ddTHH:mm
   */
  fechaInicioInput = '';

  fechaFinInput = '';


  // ==========================================
  // ESTADOS DE PANTALLA
  // ==========================================

  cargando = false;

  cargandoComparaciones = false;

  guardandoTrabajo = false;

  procesandoRevision = false;

  subiendoFactura = false;

  registrandoPago = false;

  descargandoInforme = false;


  quillConfig = {

    toolbar: [

      [
        'bold',
        'italic',
        'underline'
      ],

      [
        {
          list: 'ordered'
        },

        {
          list: 'bullet'
        }
      ],

      [
        'link'
      ],

      [
        'clean'
      ]

    ]

  };


  ngOnInit(): void {

    this.idTrabajo =
      Number(
        this.route.snapshot
          .paramMap
          .get('id')
      );

    if (
      !this.idTrabajo ||
      this.idTrabajo <= 0
    ) {

      this.toastService.error(
        'El identificador del trabajo no es válido.'
      );

      return;

    }

    this.cargarTrabajo();

  }


  // ==========================================
  // ROLES
  // ==========================================

  esRol(
    ...roles: string[]
  ): boolean {

    return this.authService.tieneRol(
      ...roles
    );

  }


  get esTecnico(): boolean {

    return this.esRol(
      'Tecnico'
    );

  }


  get esResponsableSector(): boolean {

    return this.esRol(
      'Administrador',
      'Sistemas',
      'Mantenimiento',
      'Monitoreo'
    );

  }


  get puedeRegistrarPago(): boolean {

    return this.esRol(
      'Administrador',
      'Pagos',
      'Farmacia'
    );

  }


  // ==========================================
  // ESTADOS
  // ==========================================

  get estaEnProceso(): boolean {

    return (
      this.trabajo?.idEstado ===
      this.ESTADO_EN_PROCESO
    );

  }


  get estaPendienteAprobacionTrabajo(): boolean {

    return (
      this.trabajo?.idEstado ===
      this.ESTADO_PENDIENTE_APROBACION_TRABAJO
    );

  }


  get tieneMejoraSolicitada(): boolean {

    return (
      this.trabajo?.idEstado ===
      this.ESTADO_MEJORA_SOLICITADA
    );

  }


  get estaAprobado(): boolean {

    return (
      this.trabajo?.idEstado ===
      this.ESTADO_APROBADO
    );

  }


  get estaPendienteFacturacion(): boolean {

    return (
      this.trabajo?.idEstado ===
      this.ESTADO_PENDIENTE_FACTURACION
    );

  }


  get estaPendientePago(): boolean {

    return (
      this.trabajo?.idEstado ===
      this.ESTADO_PENDIENTE_PAGO
    );

  }


  get estaFinalizado(): boolean {

    return (
      this.trabajo?.idEstado ===
      this.ESTADO_FINALIZADO
    );

  }


  get estaCancelado(): boolean {

    return (
      this.trabajo?.idEstado ===
      this.ESTADO_CANCELADO
    );

  }


  // ==========================================
  // PERMISOS
  // ==========================================

  get tecnicoPuedeEditarTrabajo(): boolean {

    return (
      this.esTecnico &&
      (
        this.estaEnProceso ||
        this.tieneMejoraSolicitada
      )
    );

  }


  get responsablePuedeRevisarTrabajo(): boolean {

    return (
      this.esResponsableSector &&
      this.estaPendienteAprobacionTrabajo
    );

  }


  get tecnicoPuedeCargarFacturas(): boolean {

    return (
      this.esTecnico &&
      (
        this.estaAprobado ||
        this.estaPendienteFacturacion
      )
    );

  }


  get mostrarFacturas(): boolean {

    return (
      this.estaAprobado ||
      this.estaPendienteFacturacion ||
      this.estaPendientePago ||
      this.estaFinalizado
    );

  }


  get mostrarInforme(): boolean {

    return (
      this.estaPendienteAprobacionTrabajo ||
      this.estaAprobado ||
      this.estaPendienteFacturacion ||
      this.estaPendientePago ||
      this.estaFinalizado
    );

  }


  get mostrarTrabajoRealizadoLectura(): boolean {

    return Boolean(
      (
        this.trabajo?.trabajoRealizado ||
        this.comparaciones.length > 0
      ) &&
      !this.tecnicoPuedeEditarTrabajo
    );

  }


  // ==========================================
  // CARGA
  // ==========================================

  cargarTrabajo(): void {

    this.cargando = true;

    this.trabajoService
      .obtenerDetalle(
        this.idTrabajo
      )
      .subscribe({

        next: data => {

          this.trabajo =
            data;

          this.cargando =
            false;

          this.cargarFechasEnFormulario();

          this.cargarComparaciones();

        },

        error: error => {

          this.cargando =
            false;

          console.error(
            'Error al cargar trabajo',
            error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudo cargar el trabajo.'
          );

        }

      });

  }

  private cargarFechasEnFormulario(): void {

    if (!this.trabajo) {
      return;
    }

    this.fechaInicioInput =
      this.convertirFechaParaInput(
        this.trabajo.fechaInicio
      );

    this.fechaFinInput =
      this.convertirFechaParaInput(
        this.trabajo.fechaFinalizado
      );

  }


  private convertirFechaParaInput(
    fecha: string | null | undefined
  ): string {

    if (!fecha) {
      return '';
    }

    const fechaConvertida =
      new Date(fecha);

    if (
      Number.isNaN(
        fechaConvertida.getTime()
      )
    ) {
      return '';
    }

    /*
     * Ajuste para que datetime-local muestre
     * la hora local correcta.
     */
    const offset =
      fechaConvertida.getTimezoneOffset();

    const fechaLocal =
      new Date(
        fechaConvertida.getTime() -
        offset * 60_000
      );

    return fechaLocal
      .toISOString()
      .slice(0, 16);

  }


  cargarComparaciones(): void {

    if (!this.trabajo) {
      return;
    }

    this.cargandoComparaciones =
      true;

    this.comparacionService
      .obtenerPorTrabajo(
        this.trabajo.id
      )
      .subscribe({

        next: data => {

          this.comparaciones =
            data ?? [];

          this.cargandoComparaciones =
            false;

        },

        error: error => {

          this.cargandoComparaciones =
            false;

          this.comparaciones = [];

          console.error(
            'Error al cargar comparaciones',
            error
          );

        }

      });

  }

  // COMPARACIONES
  agregarComparacion(): void {

    if (
      !this.trabajo ||
      !this.tecnicoPuedeEditarTrabajo
    ) {
      return;
    }

    this.comparacionService
      .crear(
        this.trabajo.id
      )
      .subscribe({

        next: comparacion => {

          this.comparaciones = [
            ...this.comparaciones,
            comparacion
          ];

          this.toastService.success(
            'Comparación agregada correctamente.'
          );

        },

        error: error => {

          console.error(
            'Error al crear comparación',
            error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudo agregar la comparación.'
          );

        }

      });

  }

  subirAntes(
    event: Event,
    comparacion: TrabajoImagenComparacion
  ): void {

    if (!this.tecnicoPuedeEditarTrabajo) {
      return;
    }

    const input =
      event.target as HTMLInputElement;

    if (
      !input.files ||
      input.files.length === 0
    ) {
      return;
    }

    const archivo =
      input.files[0];

    this.comparacionService
      .subirAntes(
        comparacion.id,
        archivo
      )
      .subscribe({

        next: () => {

          input.value = '';

          this.toastService.success(
            'Imagen anterior cargada correctamente.'
          );

          this.cargarComparaciones();

        },

        error: error => {

          console.error(
            'Error al subir imagen anterior',
            error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudo cargar la imagen anterior.'
          );

        }

      });

  }


  subirDespues(
    event: Event,
    comparacion: TrabajoImagenComparacion
  ): void {

    if (!this.tecnicoPuedeEditarTrabajo) {
      return;
    }

    const input =
      event.target as HTMLInputElement;

    if (
      !input.files ||
      input.files.length === 0
    ) {
      return;
    }

    const archivo =
      input.files[0];

    this.comparacionService
      .subirDespues(
        comparacion.id,
        archivo
      )
      .subscribe({

        next: () => {

          input.value = '';

          this.toastService.success(
            'Imagen posterior cargada correctamente.'
          );

          this.cargarComparaciones();

        },

        error: error => {

          console.error(
            'Error al subir imagen posterior',
            error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudo cargar la imagen posterior.'
          );

        }

      });

  }

  eliminarComparacion(
    comparacion: TrabajoImagenComparacion
  ): void {

    if (!this.tecnicoPuedeEditarTrabajo) {
      return;
    }

    if (
      !confirm(
        '¿Desea eliminar esta comparación?'
      )
    ) {
      return;
    }

    this.comparacionService
      .eliminar(
        comparacion.id
      )
      .subscribe({

        next: () => {

          this.comparaciones =
            this.comparaciones.filter(
              item =>
                item.id !== comparacion.id
            );

          this.toastService.success(
            'Comparación eliminada correctamente.'
          );

        },

        error: error => {

          console.error(
            'Error al eliminar comparación',
            error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudo eliminar la comparación.'
          );

        }

      });

  }

  // FINALIZAR TRABAJO
  finalizarTrabajo(): void {

    if (
      !this.trabajo ||
      !this.tecnicoPuedeEditarTrabajo ||
      this.guardandoTrabajo
    ) {
      return;
    }

    const trabajoRealizado =
      this.trabajo.trabajoRealizado
        ?.trim() ?? '';

    if (!this.fechaInicioInput) {

      this.toastService.warning(
        'Debe indicar la fecha y hora de inicio.'
      );

      return;

    }

    if (!this.fechaFinInput) {

      this.toastService.warning(
        'Debe indicar la fecha y hora de finalización.'
      );

      return;

    }

    const fechaInicio =
      new Date(
        this.fechaInicioInput
      );

    const fechaFin =
      new Date(
        this.fechaFinInput
      );

    if (
      Number.isNaN(
        fechaInicio.getTime()
      ) ||
      Number.isNaN(
        fechaFin.getTime()
      )
    ) {

      this.toastService.warning(
        'Las fechas ingresadas no son válidas.'
      );

      return;

    }

    if (
      fechaFin.getTime() <
      fechaInicio.getTime()
    ) {

      this.toastService.warning(
        'La fecha de finalización no puede ser anterior a la fecha de inicio.'
      );

      return;

    }

    if (!trabajoRealizado) {

      this.toastService.warning(
        'Debe indicar el trabajo realizado.'
      );

      return;

    }

    if (
      !confirm(
        this.tieneMejoraSolicitada
          ? '¿Confirma que desea volver a enviar el trabajo para aprobación?'
          : '¿Confirma que desea finalizar y enviar el trabajo para aprobación?'
      )
    ) {
      return;
    }

    this.guardandoTrabajo =
      true;

    this.trabajoService
      .finalizarTrabajo(
        this.trabajo.id,
        trabajoRealizado,
        fechaInicio.toISOString(),
        fechaFin.toISOString()
      )
      .subscribe({

        next: response => {

          this.guardandoTrabajo =
            false;

          this.toastService.success(
            response?.mensaje ??
            'Trabajo enviado a aprobación correctamente.'
          );

          this.cargarTrabajo();

        },

        error: error => {

          this.guardandoTrabajo =
            false;

          console.error(
            'Error al finalizar trabajo',
            error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudo enviar el trabajo para aprobación.'
          );

        }

      });

  }

  // REVISIÓN DEL SECTOR
  aprobarTrabajo(): void {

    if (
      !this.trabajo ||
      !this.responsablePuedeRevisarTrabajo ||
      this.procesandoRevision
    ) {
      return;
    }

    if (
      !confirm(
        '¿Confirma que desea aprobar este trabajo?'
      )
    ) {
      return;
    }

    this.procesandoRevision =
      true;

    this.trabajoService
      .aprobarTrabajo(
        this.trabajo.id
      )
      .subscribe({

        next: response => {

          this.procesandoRevision =
            false;

          this.toastService.success(
            response?.mensaje ??
            'Trabajo aprobado correctamente.'
          );

          this.cargarTrabajo();

        },

        error: error => {

          this.procesandoRevision =
            false;

          console.error(
            'Error al aprobar trabajo',
            error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudo aprobar el trabajo.'
          );

        }

      });

  }

  mostrarFormularioMejora(): void {

    if (!this.responsablePuedeRevisarTrabajo) {
      return;
    }

    this.comentariosMejora = '';

    this.mostrarSolicitudMejora =
      true;

  }

  cancelarSolicitudMejora(): void {

    this.mostrarSolicitudMejora =
      false;

    this.comentariosMejora = '';

  }

  solicitarMejora(): void {

    if (
      !this.trabajo ||
      !this.responsablePuedeRevisarTrabajo ||
      this.procesandoRevision
    ) {
      return;
    }

    const comentario =
      this.comentariosMejora.trim();

    if (!comentario) {

      this.toastService.warning(
        'Debe indicar qué mejora debe realizar el técnico.'
      );

      return;

    }

    this.procesandoRevision =
      true;

    this.trabajoService
      .solicitarMejora(
        this.trabajo.id,
        comentario
      )
      .subscribe({

        next: response => {

          this.procesandoRevision =
            false;

          this.mostrarSolicitudMejora =
            false;

          this.comentariosMejora = '';

          this.toastService.success(
            response?.mensaje ??
            'Se solicitó la mejora correctamente.'
          );

          this.cargarTrabajo();

        },

        error: error => {

          this.procesandoRevision =
            false;

          console.error(
            'Error al solicitar mejora',
            error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudo solicitar la mejora.'
          );

        }

      });

  }

  // FACTURAS
  subirFactura(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    if (
      !input.files ||
      input.files.length === 0 ||
      !this.trabajo ||
      !this.tecnicoPuedeCargarFacturas ||
      this.subiendoFactura
    ) {
      return;
    }

    const archivos =
      Array.from(
        input.files
      );

    const tieneArchivoInvalido =
      archivos.some(
        archivo =>
          archivo.type !==
            'application/pdf' &&
          !archivo.name
            .toLowerCase()
            .endsWith('.pdf')
      );

    if (tieneArchivoInvalido) {

      input.value = '';

      this.toastService.warning(
        'Todos los archivos deben ser PDF.'
      );

      return;

    }

    this.subiendoFactura =
      true;

    this.trabajoService
      .subirFacturas(
        this.trabajo.id,
        archivos
      )
      .subscribe({

        next: response => {

          this.subiendoFactura =
            false;

          input.value = '';

          this.toastService.success(
            response?.mensaje ??
            (
              archivos.length === 1
                ? 'Factura cargada correctamente.'
                : `${archivos.length} facturas cargadas correctamente.`
            )
          );

          this.cargarTrabajo();

        },

        error: error => {

          this.subiendoFactura =
            false;

          console.error(
            'Error al cargar facturas',
            error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudieron cargar las facturas.'
          );

        }

      });

  }


  // ==========================================
  // PAGO
  // ==========================================

  registrarPago(): void {

    if (
      !this.trabajo ||
      !this.puedeRegistrarPago ||
      !this.estaPendientePago ||
      this.registrandoPago
    ) {
      return;
    }

    if (
      !confirm(
        `¿Confirma que las facturas del trabajo #${this.trabajo.id} fueron pagadas?`
      )
    ) {
      return;
    }

    this.registrandoPago =
      true;

    this.trabajoService
      .registrarPago(
        this.trabajo.id
      )
      .subscribe({

        next: response => {

          this.registrandoPago =
            false;

          this.toastService.success(
            response?.mensaje ??
            'Pago registrado correctamente.'
          );

          this.cargarTrabajo();

        },

        error: error => {

          this.registrandoPago =
            false;

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


  // ==========================================
  // INFORME
  // ==========================================

  descargarInforme(
    idTrabajo: number
  ): void {

    if (this.descargandoInforme) {
      return;
    }

    this.descargandoInforme =
      true;

    this.trabajoService
      .descargarInformePdf(
        idTrabajo
      )
      .subscribe({

        next: (
          blob: Blob
        ) => {

          this.descargandoInforme =
            false;

          const url =
            window.URL
              .createObjectURL(blob);

          const link =
            document.createElement('a');

          link.href =
            url;

          link.download =
            `Informe-Trabajo-${idTrabajo}.pdf`;

          document.body
            .appendChild(link);

          link.click();

          document.body
            .removeChild(link);

          window.URL
            .revokeObjectURL(url);

        },

        error: error => {

          this.descargandoInforme =
            false;

          console.error(
            'Error al descargar informe PDF',
            error
          );

          this.toastService.error(
            'No se pudo descargar el informe.'
          );

        }

      });

  }


  // ==========================================
  // URLS
  // ==========================================

  obtenerUrlArchivo(
    ruta: string
  ): string {

    if (
      ruta.startsWith('http://') ||
      ruta.startsWith('https://')
    ) {
      return ruta;
    }

    return (
      this.api +
      ruta
    );

  }


  obtenerUrlImagen(
    ruta: string
  ): string {

    return this.obtenerUrlArchivo(
      ruta
    );

  }


  obtenerUrlFactura(
    ruta: string
  ): string {

    return this.obtenerUrlArchivo(
      ruta
    );

  }

}