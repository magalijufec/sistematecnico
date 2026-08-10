import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TrabajoService } from '../../../core/services/trabajo.service';
import { TrabajoDetalle } from '../../../core/models/trabajo-detalle';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TrabajoImagenComparacion } from '../../../core/models/imagen';
import { TrabajoImagenComparacionService } from '../../../core/services/trabajo.imagen.comparacion.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

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
    MatInputModule
  ],
  templateUrl: './trabajo-detalle.html',
  styleUrl: './trabajo-detalle.scss'
})

export class TrabajoDetalleComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private trabajoService = inject(TrabajoService);
  private comparacionService = inject(TrabajoImagenComparacionService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  comparaciones: TrabajoImagenComparacion[] = [];
  trabajo?: TrabajoDetalle;
  factura?: string | null;
  rolUsuario: string | null = null;
  idTrabajo = 0;
  mostrarSolicitudMejora = false;
  comentarios = '';

  ngOnInit(): void {
    this.rolUsuario =
      this.authService.obtenerRol();

    this.idTrabajo =
      Number(
        this.route.snapshot
          .paramMap
          .get('id')
      );
    this.cargarTrabajo();
  }

  esRol(...roles: string[]): boolean {
    return this.authService.tieneRol(
      ...roles
    );
  }

  cargarComparaciones(): void {
    if (!this.trabajo) {
      return;
    }

    this.comparacionService
      .obtenerPorTrabajo(this.trabajo.id)
      .subscribe({

        next: data => {

          this.comparaciones = data;

        },

        error: error => {

          console.error(
            'Error al cargar comparaciones',
            error
          );

        }

      });
  }

  cargarTrabajo(): void {

    const id =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    this.trabajoService
      .obtenerDetalle(id)
      .subscribe({

        next: data => {

          this.trabajo = data;

          this.cargarComparaciones();

        },

        error: error => {

          console.error(
            'Error al cargar trabajo',
            error
          );

        }

      });
  }

  agregarComparacion(): void {

    if (!this.trabajo) {
      return;
    }

    this.comparacionService
      .crear(this.trabajo.id)
      .subscribe({

        next: comparacion => {

          this.comparaciones = [
            ...this.comparaciones,
            comparacion
          ];

        },

        error: error => {

          console.error(
            'Error al crear comparación',
            error
          );

          this.toastService.error(
            'No se pudo agregar la comparación'
          );

        }

      });
  }

  subirAntes(
    event: Event,
    comparacion: TrabajoImagenComparacion
  ): void {

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

          this.toastService.success(
            'Imagen Antes cargada correctamente'
          );

          this.cargarComparaciones();

        },

        error: error => {

          console.error(
            'Error al subir imagen Antes',
            error
          );
          this.toastService.error(
            'No se pudo cargar la imagen'
          );
        }

      });
  }

  subirDespues(event: Event, comparacion: TrabajoImagenComparacion): void {

    const input = event.target as HTMLInputElement;

    if (
      !input.files ||
      input.files.length === 0
    ) {
      return;
    }

    const archivo = input.files[0];

    this.comparacionService
      .subirDespues(
        comparacion.id,
        archivo
      )
      .subscribe({
        next: () => {
          this.toastService.success(
            'Imagen Después cargada correctamente'
          );
          this.cargarComparaciones();
        },

        error: error => {
          console.error(
            'Error al subir imagen Después',
            error
          );
          this.toastService.error(
            'No se pudo cargar la imagen'
          );
        }
      });
  }

  eliminarComparacion(comparacion: TrabajoImagenComparacion): void {
    if (
      !confirm(
        '¿Desea eliminar esta comparación?'
      )
    ) {
      return;
    }

    this.comparacionService
      .eliminar(comparacion.id)
      .subscribe({
        next: () => {
          this.comparaciones =
            this.comparaciones.filter(
              x => x.id !== comparacion.id
            );
        },

        error: error => {
          console.error('Error al eliminar comparación', error);
          this.toastService.error(
            'No se pudo eliminar la comparación'
          );
        }
      });
  }

  obtenerUrlImagen(ruta: string): string {
    return 'https://localhost:7122' + ruta;
  }

  cancelarSolicitudMejora(): void {

  this.mostrarSolicitudMejora = false;

  this.comentarios   = '';
}

  solicitarMejora(): void {

    if (!this.trabajo) {
      return;
    }

    const comentario =
      this.comentarios.trim();

    if (!comentario) {

      this.toastService.warning(
        'Debe indicar qué mejora debe realizar el técnico.'
      );

      return;
    }

    this.trabajoService
      .solicitarMejora(
        this.trabajo.id,
        comentario
      )
      .subscribe({

        next: response => {

          this.toastService.success(
            response?.mensaje ??
            'Se solicitó la mejora correctamente.'
          );

          this.mostrarSolicitudMejora = false;

          this.comentarios = '';

          this.cargarTrabajo();
        },

        error: error => {

          console.error(
            'Error al solicitar mejora:',
            error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudo solicitar la mejora.'
          );
        }

      });
  }

  subirFactura(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    if (!this.trabajo) {
      return;
    }
    const archivo = input.files[0];

    this.trabajoService
      .subirFactura(
        this.trabajo.id,
        archivo
      )
      .subscribe({
        next: () => {
          this.toastService.success(
            'Factura cargada correctamente'
          );
          this.cargarTrabajo();
        },
        error: err => {
          console.error(
            'Error al cargar factura',
            err
          );
          this.toastService.error(
            'No se pudo cargar la factura'
          );
        }
      });
  }

  iniciarTrabajo(): void {

    if (!confirm(
      '¿Desea iniciar este trabajo?'
    )) {
      return;
    }

    this.trabajoService
      .iniciarTrabajo(this.idTrabajo)
      .subscribe({

        next: () => {
          this.toastService.success(
            'Trabajo iniciado correctamente'
          );

          this.cargarTrabajo();

        },

        error: error => {

          console.error(
            'Error al iniciar trabajo',
            error
          );

          this.toastService.error(
            'No se pudo iniciar el trabajo'
          );

        }

      });

  }

  finalizarTrabajo(): void {

    if (!this.trabajo) {
      return;
    }

    const texto = this.trabajo.trabajoRealizado?.trim() ?? '';

    console.log('Trabajo realizado que se enviará:', texto);

    if (!texto) {

      this.toastService.warning(
        'Debe indicar el trabajo realizado.'
      );

      return;
    }

    this.trabajoService
      .finalizarTrabajo(
        this.trabajo.id,
        texto
      )
      .subscribe({

        next: response => {
          this.toastService.success(
            'Trabajo enviado a aprobación correctamente'
          );

          this.cargarTrabajo();

        },

        error: error => {

          console.error(
            'Error al finalizar trabajo',
            error
          );

          console.error(
            'Respuesta backend:',
            error.error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudo finalizar el trabajo'
          );

        }

      });
  }

  aprobarTrabajo(): void {

    if (!confirm(
      '¿Confirma que desea aprobar este trabajo?'
    )) {
      return;
    }

    this.trabajoService
      .aprobarTrabajo(this.idTrabajo)
      .subscribe({

        next: () => {
          this.toastService.success(
            'Trabajo aprobado correctamente.'
          );

          this.cargarTrabajo();

        },

        error: error => {

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

  registrarPago(): void {

    if (!confirm(
      '¿Confirma que desea registrar el pago?'
    )) {
      return;
    }

    this.trabajoService
      .registrarPago(this.idTrabajo)
      .subscribe({

        next: () => {

          this.toastService.success(
            'Pago registrado correctamente.'
          );

          this.cargarTrabajo();

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

}