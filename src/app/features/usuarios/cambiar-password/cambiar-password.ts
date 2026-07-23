import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './cambiar-password.html',
  styleUrl: './cambiar-password.scss'
})
export class CambiarPasswordComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  mostrarActual = false;
  mostrarNueva = false;
  mostrarConfirmacion = false;

  mensaje = '';
  error = '';

  form = this.fb.group({

    passwordActual: [
      '',
      Validators.required
    ],

    passwordNueva: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ],

    confirmarPassword: [
      '',
      Validators.required
    ]

  });

  guardar(): void {

    this.mensaje = '';
    this.error = '';

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    const datos = this.form.getRawValue();

    if (
      datos.passwordNueva !==
      datos.confirmarPassword
    ) {

      this.error =
        'Las nuevas contraseñas no coinciden.';

      return;
    }

    this.authService
      .cambiarPassword({
        passwordActual:
          datos.passwordActual!,
        passwordNueva:
          datos.passwordNueva!,
        confirmarPassword:
          datos.confirmarPassword!
      })
      .subscribe({

        next: () => {

          this.mensaje =
            'Contraseña cambiada correctamente.';

          this.form.reset();

        },

        error: error => {

          console.error(
            'Error al cambiar contraseña',
            error
          );

          this.error =
            error.error?.mensaje ??
            'No se pudo cambiar la contraseña.';

        }

      });

  }

}