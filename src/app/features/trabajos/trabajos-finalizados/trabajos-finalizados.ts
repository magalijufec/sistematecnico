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
  Router,
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

import {
  TrabajoFinalizado
} from '../../../core/models/trabajo-finalizado';

@Component({
  selector: 'app-trabajos-finalizados',
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

  templateUrl: './trabajos-finalizados.html',

  styleUrl: './trabajos-finalizados.scss'
})
export class TrabajosFinalizadosComponent
  implements OnInit {

  private trabajoService = inject(TrabajoService);
  private router = inject(Router);
  trabajos: TrabajoFinalizado[] = [];
  trabajosFiltrados: TrabajoFinalizado[] = [];
  buscar = '';

  displayedColumns = [
    'id',
    'fechaSolicitud',
    'fechaInicio',
    'fechaFinalizado',
    'cliente',
    'provincia',
    'ciudad',
    'tecnico',
    'tarea',
    'fechaPagado',
    'acciones'
  ];

  ngOnInit(): void {
    this.cargarTrabajos();
  }


  cargarTrabajos(): void {
    this.trabajoService
      .obtenerFinalizados()
      .subscribe({

        next: data => {
          this.trabajos = data;

          this.trabajosFiltrados = data;

        },

        error: error => {

          console.error(
            'Error al cargar trabajos finalizados',
            error
          );

        }

      });

  }

  verTrabajo(id: number): void {
    this.router.navigate([
        '/trabajos',
        id
    ]);

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