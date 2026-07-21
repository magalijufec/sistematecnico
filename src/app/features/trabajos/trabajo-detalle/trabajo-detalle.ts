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
import { Imagen } from '../../../core/models/imagen';

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

  trabajo?: TrabajoDetalle;
  private imagenService = inject(ImagenService);

  imagenes: Imagen[] = [];

  imagenesAntes: Imagen[] = [];

  imagenesDespues: Imagen[] = [];

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

  cargarImagenes() {
    if (!this.trabajo)
      return;

    this.imagenService
      .obtenerPorTrabajo(this.trabajo.id)
      .subscribe({
        next: data => {
          this.imagenes = data;
          this.imagenesAntes =
            data.filter(x => x.esAntes);
          this.imagenesDespues =
            data.filter(x => !x.esAntes);
        }
      });
  }

  cargarTrabajo() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.trabajoService.obtenerDetalle(id).subscribe({
      next: data => {
        this.trabajo = data;
        this.cargarImagenes();
      }
    });
  }

  subirImagenes(event: any,antes: boolean
  ) {
    const archivos: File[] =
      Array.from(event.target.files);

    if (!this.trabajo)
      return;

    this.imagenService
      .subir(
        this.trabajo.id,
        antes,
        archivos
      )
      .subscribe({
        next: () => {
          alert('Imágenes cargadas');
          this.cargarImagenes();
        }
      });
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

}