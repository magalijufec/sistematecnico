import {Component,OnInit,inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute,Router} from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';
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
  PresupuestoService
} from '../../../core/services/presupuesto.service';

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
  TrabajoDetalle
} from '../../../core/models/trabajo-detalle';

import {
  PresupuestoDetalle
} from '../../../core/models/presupuesto-detalle';

import {
  TecnicoCombo
} from '../../../core/models/tecnico-combo';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-trabajo-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './trabajo-solicitud.html',
  styleUrl: './trabajo-solicitud.scss'
})
export class TrabajoSolicitudComponent
  implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly trabajoService = inject(TrabajoService);
  private readonly presupuestoService = inject(PresupuestoService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  readonly api = environment.api;

  // ESTADOS DEL TRABAJO
  readonly PENDIENTE_REVISION_SECTOR = 1;
  readonly SOLICITUD_RECHAZADA = 2;
  readonly PENDIENTE_ASIGNACION_TECNICOS = 3;
  readonly PENDIENTE_PRESUPUESTOS = 4;
  readonly PENDIENTE_APROBACION_PRESUPUESTO = 5;
  readonly PRESUPUESTO_APROBADO = 6;
  readonly PENDIENTE_MATERIALES = 7;
  readonly MATERIALES_ENVIADOS = 8;
  readonly EN_PROCESO = 9;

  // ESTADOS DEL PRESUPUESTO
  readonly PRESUPUESTO_EN_REVISION = 1;
  readonly PRESUPUESTO_ESTADO_APROBADO = 2;
  readonly PRESUPUESTO_RECHAZADO = 3;
  readonly PRESUPUESTO_APROBACION_REVOCADA = 4;
  readonly PRESUPUESTO_RETIRADO = 5;

  // DATOS
  idTrabajo = 0;
  usuarioIdActual: number | null = null;
  trabajo?: TrabajoDetalle;
  tecnicos: TecnicoCombo[] = [];
  presupuestos: PresupuestoDetalle[] = [];
  presupuestoUsuario?: PresupuestoDetalle;
  archivoPresupuesto: File | null = null;
  presupuestoARechazar: PresupuestoDetalle | null = null;

  // ESTADOS DE PANTALLA
  cargando = false;
  procesando = false;
  cargandoTecnicos = false;
  cargandoPresupuestos = false;
  guardandoPresupuesto = false;
  guardandoMateriales = false;
  enviandoMateriales = false;
  aprobandoPresupuestoId: number | null = null;
  mostrarFormularioRechazo = false;
  mostrarFormularioPresupuesto = false;
  mostrarFormularioRechazoPresupuesto = false;

  // FORMULARIOS
  rechazoForm =
    this.fb.nonNullable.group({
      motivoRechazo: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(1000)
        ]
      ]
    });


  tecnicosForm =
    this.fb.nonNullable.group({
      idsTecnicos: [
        [] as number[]
      ]
    });

  presupuestoForm =
    this.fb.nonNullable.group({
      descripcion: [
        '',
        [
          Validators.maxLength(2000)
        ]
      ]
    });

  materialesForm =
    this.fb.nonNullable.group({
      materiales: [
        '',
        [
          Validators.maxLength(5000)
        ]
      ]
    });


  rechazoPresupuestoForm =
    this.fb.nonNullable.group({
      motivo: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(1000)
        ]
      ]
    });

  ngOnInit(): void {
    this.idTrabajo =
      Number(
        this.route.snapshot
          .paramMap
          .get('id')
      );
    this.usuarioIdActual =
      this.authService.obtenerUsuarioId();
    if (!this.idTrabajo || this.idTrabajo <= 0) {
      this.toastService.error(
        'El identificador del trabajo no es válido.'
      );
      this.volver();
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


  get puedeGestionarSector(): boolean {

    return this.esResponsableSector;
  }


  get tecnicoAsignadoAlTrabajo(): boolean {

    if (
      !this.esTecnico ||
      this.usuarioIdActual == null ||
      !this.trabajo?.idsTecnicos
    ) {
      return false;
    }

    return this.trabajo
      .idsTecnicos
      .map(id => Number(id))
      .includes(
        Number(this.usuarioIdActual)
      );
  }


  // ==========================================
  // ESTADOS DEL TRABAJO
  // ==========================================

  get estaPendienteRevision(): boolean {

    return (
      this.trabajo?.idEstado ===
      this.PENDIENTE_REVISION_SECTOR
    );
  }


  get estaRechazada(): boolean {

    return (
      this.trabajo?.idEstado ===
      this.SOLICITUD_RECHAZADA
    );
  }


  get estaPendienteAsignacion(): boolean {

    return (
      this.trabajo?.idEstado ===
      this.PENDIENTE_ASIGNACION_TECNICOS
    );
  }


  get estaPendientePresupuestos(): boolean {

    return (
      this.trabajo?.idEstado ===
      this.PENDIENTE_PRESUPUESTOS ||
      this.trabajo?.idEstado ===
      this.PENDIENTE_APROBACION_PRESUPUESTO
    );
  }


  get estaPresupuestoAprobado(): boolean {

    return (
      this.trabajo?.idEstado ===
      this.PRESUPUESTO_APROBADO
    );
  }


  get estaPendienteMateriales(): boolean {

    return (
      this.trabajo?.idEstado ===
      this.PENDIENTE_MATERIALES
    );
  }


  get estaMaterialesEnviados(): boolean {

    return (
      this.trabajo?.idEstado ===
      this.MATERIALES_ENVIADOS
    );
  }


  get estaEnProceso(): boolean {

    return (
      this.trabajo?.idEstado ===
      this.EN_PROCESO
    );
  }


  // ==========================================
  // PRESUPUESTOS
  // ==========================================

  get tienePresupuestoAprobado(): boolean {

    return this.presupuestos.some(
      presupuesto =>
        Number(presupuesto.estadoId) ===
        this.PRESUPUESTO_ESTADO_APROBADO
    );
  }


  get presupuestoAprobado():
    PresupuestoDetalle | undefined {

    return this.presupuestos.find(
      presupuesto =>
        Number(presupuesto.estadoId) ===
        this.PRESUPUESTO_ESTADO_APROBADO
    );
  }


  get mostrarSeccionPresupuestoTecnico(): boolean {

    if (
      !this.trabajo ||
      !this.esTecnico ||
      !this.tecnicoAsignadoAlTrabajo
    ) {
      return false;
    }

    return (
      this.trabajo.idEstado >=
      this.PENDIENTE_PRESUPUESTOS &&
      this.trabajo.idEstado <=
      this.MATERIALES_ENVIADOS
    );
  }


  get mostrarPresupuestoAprobado(): boolean {

    return (
      this.presupuestoAprobado != null &&
      (
        this.estaPresupuestoAprobado ||
        this.estaPendienteMateriales ||
        this.estaMaterialesEnviados ||
        this.estaEnProceso
      )
    );
  }


  get mostrarListadoPresupuestosSector(): boolean {

    if (
      !this.trabajo ||
      !this.puedeGestionarSector
    ) {
      return false;
    }

    return (
      this.trabajo.idEstado >=
      this.PENDIENTE_PRESUPUESTOS &&
      this.trabajo.idEstado <=
      this.MATERIALES_ENVIADOS
    );
  }


  // ==========================================
  // PERMISOS
  // ==========================================

  get mostrarAccionesRevision(): boolean {

    return (
      this.estaPendienteRevision &&
      this.puedeGestionarSector
    );
  }


  get puedeAsignarTecnicos(): boolean {

    return (
      this.estaPendienteAsignacion &&
      this.puedeGestionarSector
    );
  }


  get puedeCargarPresupuesto(): boolean {

    return (
      this.esTecnico &&
      this.tecnicoAsignadoAlTrabajo &&
      this.estaPendientePresupuestos &&
      !this.presupuestoUsuario &&
      !this.tienePresupuestoAprobado
    );
  }


  get puedeAprobarPresupuestos(): boolean {

    return (
      this.puedeGestionarSector &&
      this.estaPendientePresupuestos &&
      !this.tienePresupuestoAprobado
    );
  }


  get puedeCargarMateriales(): boolean {

    return (
      this.esTecnico &&
      this.tecnicoAsignadoAlTrabajo &&
      this.estaPresupuestoAprobado &&
      Number(
        this.presupuestoUsuario?.estadoId
      ) ===
      this.PRESUPUESTO_ESTADO_APROBADO
    );
  }


  get puedeEnviarMateriales(): boolean {

    return (
      this.puedeGestionarSector &&
      this.estaPendienteMateriales
    );
  }


  // ==========================================
  // CARGAR TRABAJO
  // ==========================================

  cargarTrabajo(): void {

    this.cargando =
      true;

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

          this.mostrarFormularioRechazo =
            false;

          this.rechazoForm.reset({
            motivoRechazo: ''
          });

          this.materialesForm.patchValue({

            materiales:
              data.materiales ?? ''

          });

          this.cargarInformacionSegunEstado();
        },

        error: error => {

          this.cargando =
            false;

          console.error(
            'Error al cargar la solicitud',
            error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudo cargar la solicitud.'
          );
        }

      });
  }


  private cargarInformacionSegunEstado(): void {

    if (!this.trabajo) {
      return;
    }

    if (
      this.trabajo.idEstado >=
      this.PENDIENTE_PRESUPUESTOS
    ) {

      this.cargarPresupuestos();

    } else {

      this.presupuestos = [];

      this.presupuestoUsuario =
        undefined;
    }

    if (
      this.estaPendienteAsignacion &&
      this.puedeGestionarSector
    ) {

      this.cargarTecnicos();
    }
  }


  // ==========================================
  // APROBAR Y RECHAZAR SOLICITUD
  // ==========================================

  aprobarSolicitud(): void {

    if (
      !this.trabajo ||
      this.procesando ||
      !this.mostrarAccionesRevision
    ) {
      return;
    }

    if (
      !confirm(
        `¿Confirma aprobar la solicitud de trabajo #${this.trabajo.id}?`
      )
    ) {
      return;
    }

    this.procesando =
      true;

    this.trabajoService
      .decidirSolicitud(
        this.trabajo.id,
        true,
        null
      )
      .subscribe({

        next: response => {

          this.procesando =
            false;

          this.toastService.success(
            response?.mensaje ??
            'Solicitud aprobada correctamente.'
          );

          this.cargarTrabajo();
        },

        error: error => {

          this.procesando =
            false;

          console.error(
            'Error al aprobar solicitud',
            error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudo aprobar la solicitud.'
          );
        }

      });
  }


  habilitarRechazo(): void {

    if (!this.mostrarAccionesRevision) {
      return;
    }

    this.mostrarFormularioRechazo =
      true;

    this.rechazoForm.reset({
      motivoRechazo: ''
    });
  }


  cancelarRechazo(): void {

    this.mostrarFormularioRechazo =
      false;

    this.rechazoForm.reset({
      motivoRechazo: ''
    });
  }


  rechazarSolicitud(): void {

    if (
      !this.trabajo ||
      this.procesando ||
      !this.mostrarAccionesRevision
    ) {
      return;
    }

    if (this.rechazoForm.invalid) {

      this.rechazoForm
        .markAllAsTouched();

      this.toastService.warning(
        'Debe indicar el motivo del rechazo.'
      );

      return;
    }

    const motivoRechazo =
      this.rechazoForm.controls
        .motivoRechazo
        .value
        .trim();

    if (!motivoRechazo) {

      this.toastService.warning(
        'Debe indicar el motivo del rechazo.'
      );

      return;
    }

    if (
      !confirm(
        `¿Confirma rechazar la solicitud de trabajo #${this.trabajo.id}?`
      )
    ) {
      return;
    }

    this.procesando =
      true;

    this.trabajoService
      .decidirSolicitud(
        this.trabajo.id,
        false,
        motivoRechazo
      )
      .subscribe({

        next: response => {

          this.procesando =
            false;

          this.mostrarFormularioRechazo =
            false;

          this.toastService.success(
            response?.mensaje ??
            'Solicitud rechazada correctamente.'
          );

          this.cargarTrabajo();
        },

        error: error => {

          this.procesando =
            false;

          console.error(
            'Error al rechazar solicitud',
            error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudo rechazar la solicitud.'
          );
        }

      });
  }


  // ==========================================
  // TÉCNICOS
  // ==========================================

  cargarTecnicos(): void {

    if (!this.trabajo) {
      return;
    }

    this.cargandoTecnicos =
      true;

    this.usuarioService
      .obtenerTecnicos(
        this.trabajo.idCliente
      )
      .subscribe({

        next: data => {

          this.tecnicos =
            data ?? [];

          this.cargandoTecnicos =
            false;

          this.tecnicosForm.patchValue({

            idsTecnicos:
              this.trabajo?.idsTecnicos ?? []

          });
        },

        error: error => {

          this.cargandoTecnicos =
            false;

          this.tecnicos = [];

          console.error(
            'Error al cargar técnicos',
            error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudieron cargar los técnicos.'
          );
        }

      });
  }


  asignarTecnicos(): void {

    if (
      !this.trabajo ||
      !this.puedeAsignarTecnicos ||
      this.procesando
    ) {
      return;
    }

    const idsTecnicos =
      this.tecnicosForm.controls
        .idsTecnicos
        .value;

    if (idsTecnicos.length === 0) {

      this.tecnicosForm.controls
        .idsTecnicos
        .markAsTouched();

      this.toastService.warning(
        'Debe seleccionar al menos un técnico.'
      );

      return;
    }

    if (
      !confirm(
        `¿Confirma asignar ${idsTecnicos.length} técnico(s) al trabajo?`
      )
    ) {
      return;
    }

    this.procesando =
      true;

    this.trabajoService
      .asignarTecnicos(
        this.trabajo.id,
        idsTecnicos
      )
      .subscribe({

        next: response => {

          this.procesando =
            false;

          this.toastService.success(
            'Técnicos asignados correctamente.'
          );

          this.cargarTrabajo();
        },

        error: error => {

          this.procesando =
            false;

          console.error(
            'Error al asignar técnicos',
            error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudieron asignar los técnicos.'
          );
        }

      });
  }


  // ==========================================
  // PRESUPUESTOS
  // ==========================================

  cargarPresupuestos(): void {

    this.cargandoPresupuestos =
      true;

    this.presupuestoService
      .obtenerPorTrabajo(
        this.idTrabajo
      )
      .subscribe({

        next: data => {

          this.presupuestos =
            data ?? [];

          this.buscarPresupuestoUsuario();

          this.cargandoPresupuestos =
            false;
        },

        error: error => {

          this.cargandoPresupuestos =
            false;

          this.presupuestos = [];

          this.presupuestoUsuario =
            undefined;

          console.error(
            'Error al cargar presupuestos',
            error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudieron cargar los presupuestos.'
          );
        }

      });
  }


  private buscarPresupuestoUsuario(): void {

    if (this.usuarioIdActual == null) {

      this.presupuestoUsuario =
        undefined;

      return;
    }

    this.presupuestoUsuario =
      this.presupuestos.find(
        presupuesto =>
          Number(presupuesto.tecnicoId) ===
          Number(this.usuarioIdActual)
      );
  }


  abrirCargaPresupuesto(): void {

    if (!this.puedeCargarPresupuesto) {
      return;
    }

    this.mostrarFormularioPresupuesto =
      true;

    this.archivoPresupuesto =
      null;

    this.presupuestoForm.reset({
      descripcion: ''
    });
  }


  cancelarPresupuesto(): void {

    if (this.guardandoPresupuesto) {
      return;
    }

    this.mostrarFormularioPresupuesto =
      false;

    this.archivoPresupuesto =
      null;

    this.presupuestoForm.reset({
      descripcion: ''
    });
  }


  seleccionarArchivoPresupuesto(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    if (
      !input.files ||
      input.files.length === 0
    ) {

      this.archivoPresupuesto =
        null;

      return;
    }

    const archivo =
      input.files[0];

    const esPdf =
      archivo.type ===
      'application/pdf' ||
      archivo.name
        .toLowerCase()
        .endsWith('.pdf');

    if (!esPdf) {

      this.toastService.warning(
        'El presupuesto debe ser un archivo PDF.'
      );

      this.archivoPresupuesto =
        null;

      input.value = '';

      return;
    }

    this.archivoPresupuesto =
      archivo;
  }


  guardarPresupuesto(): void {

    if (
      !this.trabajo ||
      this.usuarioIdActual == null ||
      this.guardandoPresupuesto
    ) {
      return;
    }

    if (!this.puedeCargarPresupuesto) {

      this.toastService.warning(
        this.presupuestoUsuario
          ? 'Ya tiene un presupuesto cargado para este trabajo.'
          : 'La carga de presupuestos ya no está disponible.'
      );

      return;
    }

    if (this.presupuestoForm.invalid) {

      this.presupuestoForm
        .markAllAsTouched();

      return;
    }

    const descripcion =
  this.presupuestoForm.controls
    .descripcion
    .value
    .trim();

/*
 * Debe existir al menos:
 * - PDF
 * o
 * - Descripción
 */
if (
  !this.archivoPresupuesto &&
  !descripcion
) {

  this.toastService.warning(
    'Debe adjuntar un PDF o ingresar una descripción.'
  );

  return;
}

    this.guardandoPresupuesto =
      true;

    this.presupuestoService
      .crear(
        this.trabajo.id,
        this.usuarioIdActual,
        descripcion,
        this.archivoPresupuesto
      )
      .subscribe({

        next: response => {

          this.guardandoPresupuesto =
            false;

          this.mostrarFormularioPresupuesto =
            false;

          this.archivoPresupuesto =
            null;

          this.presupuestoForm.reset({
            descripcion: ''
          });

          this.toastService.success(
            response?.mensaje ??
            'Presupuesto cargado correctamente.'
          );

          this.cargarTrabajo();
        },

        error: error => {

          this.guardandoPresupuesto =
            false;

          console.error(
            'Error al cargar presupuesto',
            error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudo cargar el presupuesto.'
          );
        }

      });
  }


  aprobarPresupuesto(
    presupuesto: PresupuestoDetalle
  ): void {

    if (
      !this.puedeAprobarPresupuestos ||
      this.aprobandoPresupuestoId != null
    ) {
      return;
    }

    if (
      !confirm(
        `¿Confirma aprobar el presupuesto de ${presupuesto.tecnico}? Los demás presupuestos quedarán rechazados.`
      )
    ) {
      return;
    }

    if (this.usuarioIdActual == null) {

      this.toastService.error(
        'No se pudo identificar al usuario.'
      );

      return;
    }

    this.aprobandoPresupuestoId =
      presupuesto.id;

    this.presupuestoService
      .aprobar(
        presupuesto.id,
        this.usuarioIdActual
      )
      .subscribe({

        next: response => {

          this.aprobandoPresupuestoId =
            null;

          this.toastService.success(
            'Presupuesto aprobado correctamente.'
          );

          this.cargarTrabajo();
        },

        error: error => {

          this.aprobandoPresupuestoId =
            null;

          console.error(
            'Error al aprobar presupuesto',
            error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudo aprobar el presupuesto.'
          );
        }

      });
  }


  mostrarRechazoPresupuesto(
    presupuesto: PresupuestoDetalle
  ): void {

    this.presupuestoARechazar =
      presupuesto;

    this.mostrarFormularioRechazoPresupuesto =
      true;

    this.rechazoPresupuestoForm.reset({
      motivo: ''
    });
  }


  // ==========================================
  // MATERIALES
  // ==========================================

  guardarMateriales(): void {

    if (
      !this.trabajo ||
      !this.puedeCargarMateriales ||
      this.guardandoMateriales
    ) {
      return;
    }

    if (this.materialesForm.invalid) {

      this.materialesForm
        .markAllAsTouched();

      this.toastService.warning(
        'La lista de materiales no puede superar los 5000 caracteres.'
      );

      return;
    }

    const materiales =
      this.materialesForm.controls
        .materiales
        .value
        .trim();

    const mensaje =
      materiales
        ? '¿Confirma los materiales necesarios para este trabajo?'
        : 'No indicó materiales. ¿Confirma que el trabajo no requiere materiales?';

    if (!confirm(mensaje)) {
      return;
    }

    this.guardandoMateriales =
      true;

    this.trabajoService
      .cargarMateriales(
        this.trabajo.id,
        materiales || null
      )
      .subscribe({

        next: response => {

          this.guardandoMateriales =
            false;

          this.toastService.success(
            response?.mensaje ??
            (
              materiales
                ? 'Materiales registrados correctamente.'
                : 'Se registró que el trabajo no requiere materiales.'
            )
          );

          this.cargarTrabajo();
        },

        error: error => {

          this.guardandoMateriales =
            false;

          console.error(
            'Error al registrar materiales',
            error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudo registrar la información de materiales.'
          );
        }

      });
  }


  enviarMateriales(): void {

    if (
      !this.trabajo ||
      !this.puedeEnviarMateriales ||
      this.enviandoMateriales
    ) {
      return;
    }

    const mensaje =
      this.trabajo.materiales
        ? `¿Confirma que los materiales del trabajo #${this.trabajo.id} fueron enviados?`
        : `¿Confirma autorizar el inicio del trabajo #${this.trabajo.id} sin materiales?`;

    if (!confirm(mensaje)) {
      return;
    }

    this.enviandoMateriales =
      true;

    this.trabajoService.marcarMaterialesEnviados(this.trabajo.id)
      .subscribe({
        next: response => {
          this.enviandoMateriales =false;
          this.toastService.success(response?.mensaje ?? 'El trabajo fue autorizado para comenzar.'
          );
          this.cargarTrabajo();
        },

        error: error => {
          this.enviandoMateriales = false;
          console.error(
            'Error al autorizar el trabajo',
            error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudo autorizar el inicio del trabajo.'
          );
        }

      });
  }


  // ==========================================
  // ARCHIVOS
  // ==========================================

  obtenerUrlArchivo(
    rutaArchivo: string | null
  ): string {

    if (!rutaArchivo) {
      return '';
    }

    if (
      rutaArchivo.startsWith('http://') ||
      rutaArchivo.startsWith('https://')
    ) {
      return rutaArchivo;
    }

    const apiSinBarra =
      this.api.endsWith('/')
        ? this.api.slice(0, -1)
        : this.api;

    const rutaConBarra =
      rutaArchivo.startsWith('/')
        ? rutaArchivo
        : `/${rutaArchivo}`;

    return (
      apiSinBarra +
      rutaConBarra
    );
  }


  obtenerUrlImagen(
    rutaArchivo: string
  ): string {

    return this.obtenerUrlArchivo(
      rutaArchivo
    );
  }


  verPresupuesto(
    presupuesto: PresupuestoDetalle
  ): void {

    const url =
      this.obtenerUrlArchivo(
        presupuesto.rutaArchivo
      );

    if (!url) {

      this.toastService.warning(
        'El presupuesto no tiene un archivo asociado.'
      );

      return;
    }

    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    );
  }


  obtenerClaseEstadoPresupuesto(estadoId: number): string {
    switch (Number(estadoId)) {
      case this.PRESUPUESTO_ESTADO_APROBADO:
        return 'estado-aprobado';
      case this.PRESUPUESTO_RECHAZADO:
        return 'estado-rechazado';
      case this.PRESUPUESTO_APROBACION_REVOCADA:
        return 'estado-revocado';
      case this.PRESUPUESTO_RETIRADO:
        return 'estado-retirado';
      default:
        return 'estado-revision';
    }
  }

  volver(): void {
    this.router.navigate(['/trabajos-solicitud-list']);
  }

}