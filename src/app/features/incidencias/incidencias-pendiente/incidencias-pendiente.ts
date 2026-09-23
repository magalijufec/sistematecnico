import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { Router } from '@angular/router';

import { IncidenciasService } from '../../../core/services/incidencia.service';

import { IncidenciaPendiente } from '../../../core/models/incidencia-pendiente';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FinalizarIncidenciaDialogComponent } from '../finalizar-incidencia-dialog/finalizar-incidencia-dialog';

@Component({
  selector: 'app-incidencias-pendientes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './incidencias-pendiente.html',
  styleUrl: './incidencias-pendiente.scss'
})
export class IncidenciasPendientesComponent
  implements OnInit {

  incidencias: IncidenciaPendiente[] = [];

  displayedColumns = [
    'id',
    'fecha',
    'usuario',
    'cliente',
    'asistencia',
    'incidencia',
    'guardia',
    'accion'
  ];

  constructor(
    private incidenciasService: IncidenciasService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.cargar();

  }

  cargar() {

    this.incidenciasService
      .obtenerPendientes()
      .subscribe(x => {

        this.incidencias = x;

      });

  }

  nuevoPendiente() {

    this.router.navigate(
      ['/incidencias/nueva-incidencia'],
      {
        queryParams: {
          estado: 'pendiente'
        }
      });

  }

  finalizar(incidencia: IncidenciaPendiente): void {

    const dialogRef = this.dialog.open(
      FinalizarIncidenciaDialogComponent,
      {
        width: '700px',
        maxWidth: '95vw',
        disableClose: true,
        data: incidencia
      }
    );

    dialogRef.afterClosed()
      .subscribe(finalizada => {

        if (finalizada) {
          this.cargar();
        }

      });

  }
}