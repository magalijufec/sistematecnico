import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  IncidenciaFinalizada
} from '../../../core/models/incidencia-finalizada';

@Component({
  selector: 'app-ver-trabajo-realizado-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './ver-trabajo-realizado-dialog.html',
  styleUrl: './ver-trabajo-realizado-dialog.scss'
})
export class VerTrabajoRealizadoDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public incidencia: IncidenciaFinalizada
  ) { }

}
