import { CommonModule } from '@angular/common';

import {
  Component,
  Inject
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  IncidenciaPendiente
} from '../../../core/models/incidencia-pendiente';

import {
  IncidenciasService
} from '../../../core/services/incidencia.service';

import {
  ToastService
} from '../../../core/services/toast.service';

@Component({
  selector: 'app-finalizar-incidencia-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './finalizar-incidencia-dialog.html',
  styleUrl: './finalizar-incidencia-dialog.scss'
})
export class FinalizarIncidenciaDialogComponent {

  formulario: FormGroup;

  guardando = false;

  constructor(
    private fb: FormBuilder,

    private incidenciasService:
      IncidenciasService,

    private toastService:
      ToastService,

    private dialogRef:
      MatDialogRef<FinalizarIncidenciaDialogComponent>,

    @Inject(MAT_DIALOG_DATA)
    public incidencia: IncidenciaPendiente
  ) {

    this.formulario = this.fb.group({
      trabajoRealizado: [
        '',
        [
          Validators.required,
          Validators.maxLength(4000)
        ]
      ]
    });

  }

  guardar(): void {

    if (this.formulario.invalid) {

      this.formulario.markAllAsTouched();

      this.toastService.warning(
        'Debe ingresar el trabajo realizado.'
      );

      return;
    }

    this.guardando = true;

    const trabajoRealizado =
      this.formulario
        .get('trabajoRealizado')
        ?.value
        ?.trim();

    this.incidenciasService
      .finalizar(
        this.incidencia.id,
        trabajoRealizado
      )
      .subscribe({

        next: () => {

          this.toastService.success(
            'Incidencia finalizada correctamente.'
          );

          this.dialogRef.close(true);

        },

        error: error => {

          this.guardando = false;

          this.toastService.error(
            error?.error
            ?? 'No se pudo finalizar la incidencia.'
          );

        }

      });

  }

}