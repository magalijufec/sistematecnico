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

@Component({
  selector: 'app-trabajo-detalle',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './trabajo-detalle.html',
  styleUrl: './trabajo-detalle.scss'
})

export class TrabajoDetalleComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private trabajoService = inject(TrabajoService);

  trabajo?: TrabajoDetalle;

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

  cargarTrabajo() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.trabajoService.obtenerDetalle(id).subscribe({
      next: data => {
        this.trabajo = data;
      }
    });
  }

}