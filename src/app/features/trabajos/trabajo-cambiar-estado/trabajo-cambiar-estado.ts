import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { EstadoService } from '../../../core/services/estado.service';
import { TrabajoService } from '../../../core/services/trabajo.service';

import { Combo } from '../../../core/models/combo';

@Component({
  selector: 'app-trabajo-cambiar-estado',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './trabajo-cambiar-estado.html',
  styleUrls: ['./trabajo-cambiar-estado.scss']
})
export class TrabajoCambiarEstadoComponent implements OnInit {

  private fb = inject(FormBuilder);

  private estadoService = inject(EstadoService);

  private trabajoService = inject(TrabajoService);

  estados: Combo[] = [];

  form = this.fb.nonNullable.group({

    idEstado: [0, Validators.required],

    comentario: ['']

});

  constructor(

    public dialogRef: MatDialogRef<TrabajoCambiarEstadoComponent>,

    @Inject(MAT_DIALOG_DATA)

    public data: any

  ) {}

  ngOnInit(): void {
    this.estadoService.obtenerEstadosSiguientes(this.data.idTrabajo)
    .subscribe({
        next: data => this.estados = data
    });
  }

  cerrar(): void {

    this.dialogRef.close();

  }

  guardar(): void {

    if (this.form.invalid) {

      return;

    }

    this.trabajoService.cambiarEstado(

      this.data.idTrabajo,

      this.form.getRawValue()

    ).subscribe({

      next: () => this.dialogRef.close(true),

      error: err => console.error(err)

    });

  }

}