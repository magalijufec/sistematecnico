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
  TrabajoService
} from '../../../core/services/trabajo.service';
import { TrabajoFinalizado } from '../../../core/models/trabajo-finalizado';

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
    MatInputModule
  ],

  templateUrl: './trabajos-pendiente-pago.html',

  styleUrl: './trabajos-pendiente-pago.scss'
})
export class TrabajosPendientePagoComponent implements OnInit {

  private trabajoService = inject(TrabajoService);
  trabajos: TrabajoFinalizado[] = [];
  trabajosFiltrados: TrabajoFinalizado[] = [];
  buscar = '';

  displayedColumns = [
    'fechaSolicitud',
    'fechaFinalizado',
    'cliente',
    'provincia',
    'ciudad',
    'tecnico',
    'tarea',
    'trabajoRealizado',
    'acciones'
  ];

  ngOnInit(): void {
    this.cargarTrabajos();
  }


  cargarTrabajos(): void {
    this.trabajoService
      .obtenerPendientePago()
      .subscribe({

        next: data => {

          console.log(
            'Trabajos pendientes de pago:',
            data
          );

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