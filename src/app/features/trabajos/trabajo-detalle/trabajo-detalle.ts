import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { TrabajoCambiarEstadoComponent } from '../trabajo-cambiar-estado/trabajo-cambiar-estado';
import { TrabajoService } from '../../../core/services/trabajo.service';
import { TrabajoDetalle } from '../../../core/models/trabajo-detalle';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ImagenService } from '../../../core/services/imagen.service';
import { Imagen, TrabajoImagenComparacion } from '../../../core/models/imagen';
import { TrabajoImagenComparacionService } from '../../../core/services/trabajo.imagen.comparacion.service';

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
  private dialog = inject(MatDialog);
  private trabajoService = inject(TrabajoService);
  private comparacionService = inject(TrabajoImagenComparacionService);

  comparaciones: TrabajoImagenComparacion[] = [];
  trabajo?: TrabajoDetalle;
  factura?: string | null;
  ngOnInit(): void {
    this.cargarTrabajo();
  }

  cambiarEstado() {
    const dialogRef = this.dialog.open(
      TrabajoCambiarEstadoComponent,
      {
        width: '500px',
        data: {
          idTrabajo: this.trabajo?.id
        }
      });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.cargarTrabajo();
      }
    });
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

          alert(
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

          alert(
            'Imagen Antes cargada correctamente'
          );

          this.cargarComparaciones();

        },

        error: error => {

          console.error(
            'Error al subir imagen Antes',
            error
          );
          alert('No se pudo cargar la imagen');
        }

      });
  }

  subirDespues(event: Event,comparacion: TrabajoImagenComparacion): void {

    const input =event.target as HTMLInputElement;

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
          alert('Imagen Después cargada correctamente');
          this.cargarComparaciones();
        },

        error: error => {
          console.error(
            'Error al subir imagen Después',
            error
          );
          alert(
            'No se pudo cargar la imagen');
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
          alert('No se pudo eliminar la comparación');
        }
      });
  }

  obtenerUrlImagen(ruta: string): string {
    return 'https://localhost:7122' + ruta;
  }

  guardarTrabajoRealizado() {
    this.trabajoService
      .guardarTrabajoRealizado(
        this.trabajo!.id,
        this.trabajo!.trabajoRealizado
      )
      .subscribe(() => {
        alert('Trabajo actualizado');
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
          alert(
            'Factura cargada correctamente'
          );
          this.cargarTrabajo();
        },
        error: err => {
          console.error(
            'Error al cargar factura',
            err
          );
          alert(
            'No se pudo cargar la factura'
          );
        }
      });
  }

  registrarPago(): void {

    if (!this.trabajo) {
      return;
    }

    if (!confirm('¿Confirmar que el trabajo fue pagado?')) {
      return;
    }

    this.trabajoService
      .registrarPago(this.trabajo.id)
      .subscribe({

        next: () => {

          alert('Pago registrado correctamente');

          this.cargarTrabajo();

        },

        error: error => {

          console.error(
            'Error al registrar el pago',
            error
          );

          alert(
            'No se pudo registrar el pago'
          );

        }

      });
  }

}