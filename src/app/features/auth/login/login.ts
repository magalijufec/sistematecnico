import {
  Component,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  MatCardModule
} from '@angular/material/card';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  AuthService
} from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],

  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  private fb = inject(FormBuilder);

  private authService =
    inject(AuthService);

  private router =
    inject(Router);


  error = '';
  respuesta: any;

  form = this.fb.group({

    userName: [
      '',
      Validators.required
    ],

    password: [
      '',
      Validators.required
    ]

  });


  login(): void {

    if (this.form.invalid)
      return;


    this.error = '';


    this.authService
      .login({
        userName:
          this.form.value.userName!,

        password:
          this.form.value.password!
      })

      .subscribe({

        next: respuesta => {

          console.log('Respuesta login:', respuesta);

      localStorage.setItem(
        'token',
        respuesta.token
      );

          this.router.navigate([
            '/dashboard'
          ]);

        },

        error: error => {

          console.error(
            'Error login',
            error
          );

          this.error =
            'Usuario o contraseña incorrectos';

        }

      });

  }

}