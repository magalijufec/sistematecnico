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
    MatTooltipModule
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
  apiUrl = environment.apiUrl;
  api = environment.api;

  displayedColumns = [
    'id',
    'fechaSolicitud',
    'fechaFinalizado',
    'cliente',
    'provincia',
    'ciudad',
    'tecnico',
    'tarea',
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

          this.trabajos = data;

          this.trabajosFiltrados = data;

        },

        error: error => {

          console.error(
            'Error al cargar trabajos pendientes de pago',
            error
          );

        }

      });

  }


  filtrar(): void {

    const texto =
      this.buscar
        .toLowerCase()
        .trim();


    if (!texto) {

      this.trabajosFiltrados =
        [...this.trabajos];

      return;

    }


    this.trabajosFiltrados =
      this.trabajos.filter(trabajo => {

        return (

          trabajo.cliente
            .toLowerCase()
            .includes(texto)

          ||

          trabajo.tecnico
            .toLowerCase()
            .includes(texto)

          ||

          trabajo.tarea
            .toLowerCase()
            .includes(texto)

          ||

          trabajo.provincia
            .toLowerCase()
            .includes(texto)

          ||

          trabajo.ciudad
            .toLowerCase()
            .includes(texto)

        );

      });

  }


  limpiarFiltros(): void {

    this.buscar = '';

    this.trabajosFiltrados =
      [...this.trabajos];

  }

}