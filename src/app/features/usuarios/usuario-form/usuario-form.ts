import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ClienteService } from '../../../core/services/cliente.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Combo } from '../../../core/models/combo';
import { PerfilService } from '../../../core/services/perfil.service';
import { CiudadService } from '../../../core/services/ciudad.service';
import { ProvinciaService } from '../../../core/services/provincia.service';
@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.scss'
})
export class UsuarioFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clienteService = inject(ClienteService);
  private perfilService = inject(PerfilService);
  private usuarioService = inject(UsuarioService);
  private provinciaService = inject(ProvinciaService);
  private ciudadService = inject(CiudadService);

  perfiles: Combo[] = [];
  clientes: Combo[] = [];
  provincias: Combo[] = [];
  ciudades: Combo[] = [];
  mostrarCliente = false;

  form = this.fb.group({
    userName: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],
    nombreApellido: [
      '',
      [
        Validators.required
      ]
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ],
    idPerfil: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],
    provinciaId: [0, Validators.required],
    ciudadId: [0, Validators.required],
    clienteId: [ null as number | null],
    activo: [ true]
  });

  ngOnInit(): void {
    this.cargarPerfiles();
    this.cargarClientes();
    this.detectarCambioPerfil();
    this.cargarProvincias();  
  }

  cargarProvincias(): void {
    this.provinciaService.obtenerCombo().subscribe({
      next: data => {
        this.provincias = data;
      },
      error: error => {
        console.error(
          'Error al cargar provincias',
          error
        );
      }
    });
  }

  cambioProvincia(): void {
    const provinciaId = this.form.get('provinciaId')?.value;
    this.ciudades = [];
    this.form.patchValue({ ciudadId: 0 });

    if (!provinciaId) { return; }

    this.ciudadService
      .obtenerPorProvincia(provinciaId)
      .subscribe({
        next: data => {
          this.ciudades = data;
        },
        error: error => {
          console.error(
            'Error al cargar ciudades',
            error
          );
        }
      });
  }

  cargarPerfiles(): void {
    this.perfilService
      .obtenerPerfiles()
      .subscribe({
        next: data => {
          this.perfiles = data;
        },

        error: error => {
          console.error(
            'Error al cargar perfiles',
            error
          );
        }
      });
  }

  cargarClientes(): void {
    this.clienteService
      .obtenerCombo()
      .subscribe({
        next: data => {
          this.clientes = data;
        },
        error: error => {
          console.error(
            'Error al cargar clientes',
            error
          );
        }
      });
  }

  detectarCambioPerfil(): void {
    this.form.controls.idPerfil
      .valueChanges
      .subscribe(idPerfil => {
        const perfil =
          this.perfiles.find(
            x => x.id === idPerfil
          );
        // Si todavía no cargaron los perfiles
        if (!perfil) {
          this.mostrarCliente = false;
          this.form.controls.clienteId
            .setValue(null);
          return;
        }

        if (
          perfil.nombre
            .trim()
            .toLowerCase() === 'farmacia'
        ) {
          this.mostrarCliente = true;
          this.form.controls.clienteId
            .setValidators([
              Validators.required
            ]);
        }
        // CUALQUIER OTRO PERFIL
        else {
          this.mostrarCliente = false;
          this.form.controls.clienteId.setValue(null);
          this.form.controls.clienteId.clearValidators();
        }
        this.form.controls.clienteId.updateValueAndValidity();
      });
  }

  guardar(): void {
    // Validamos formulario
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // Obtenemos valores
    const valores =
      this.form.getRawValue();
    // VALIDACIÓN EXTRA PARA FARMACIA
    if (
      this.mostrarCliente &&
      !valores.clienteId
    ) {
      this.form.controls.clienteId
        .markAsTouched();
      alert(
        'Debe seleccionar una farmacia.'
      );
      return;
    }
    // OBJETO QUE SE ENVÍA AL BACKEND
    const usuario = {
      userName: valores.userName ?? '',
      nombreApellido: valores.nombreApellido ?? '',
      email: valores.email ?? '',
      password: valores.password ?? '',
      idPerfil: valores.idPerfil ?? 0,
      clienteId:
        this.mostrarCliente
          ? valores.clienteId
          : null,
      activo: valores.activo ?? true
    };

    console.log('Usuario a guardar:',  usuario);

    this.usuarioService
      .crear(usuario)
      .subscribe({
        next: () => {
          alert('Usuario creado correctamente');
          this.router.navigate([
            '/usuarios'
          ]);
        },
        error: error => {
          console.error(
            'Error al crear usuario',
            error
          );
          if (
            error.status === 400
          ) {
            alert(
              'Los datos enviados no son válidos.'
            );
          }
          else if (
            error.status === 401
          ) {
            alert(
              'No tiene autorización para crear usuarios.'
            );
          }

          else if (
            error.status === 403
          ) {
            alert(
              'No tiene permisos para realizar esta acción.'
            );
          }
          else {
            alert(
              'Ocurrió un error al crear el usuario.'
            );
          }
        }
      });
  }

  cancelar(): void {
    this.router.navigate(['/usuarios']);
  }

  campoInvalido(nombreCampo: string): boolean {
    const campo = this.form.get(nombreCampo);
    return !!(
      campo &&
      campo.invalid &&
      campo.touched
    );
  }

}