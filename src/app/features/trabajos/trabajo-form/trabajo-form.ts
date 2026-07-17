import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService } from '../../../core/services/cliente.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { TareaService } from '../../../core/services/tarea.service';
import { TrabajoService } from '../../../core/services/trabajo.service';
import { Combo } from '../../../core/models/combo';
import { TrabajoCreate } from '../../../core/models/trabajo-create';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@Component({
  selector: 'app-trabajo-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    NgxMatSelectSearchModule
  ],
  templateUrl: './trabajo-form.html',
  styleUrl: './trabajo-form.scss'
})
export class TrabajoFormComponent implements OnInit {

  private fb = inject(FormBuilder);

  private clienteService = inject(ClienteService);

  private usuarioService = inject(UsuarioService);

  private tareaService = inject(TareaService);

  private trabajoService = inject(TrabajoService);

  clienteFiltro = new FormControl('');

  clientesFiltrados: Combo[] = [];
  clientes: Combo[] = [];

  tecnicos: Combo[] = [];

  tareas: Combo[] = [];

  form = this.fb.nonNullable.group({

    idCliente: [0, Validators.required],

    idTecnico: [0, Validators.required],

    idTarea: [0, Validators.required],

    fechaTrabajo: ['', Validators.required],

    comentarios: ['']

  });

  ngOnInit(): void {

    this.cargarClientes();

    this.cargarTecnicos();

    this.cargarTareas();

  }

  cargarClientes(): void {

    this.clienteService.obtenerCombo().subscribe({

      next: data => {

        this.clientes = data;

        this.clientesFiltrados = data;

      }

    });

    this.clienteFiltro.valueChanges.subscribe(texto => {

      this.clientesFiltrados = this.clientes.filter(c =>
        c.nombre.toLowerCase().includes((texto ?? '').toLowerCase())
      );

    });

  }

  cargarTecnicos(): void {

    this.usuarioService.obtenerTecnicos().subscribe({

      next: data => this.tecnicos = data,

      error: err => console.error(err)

    });

  }

  cargarTareas(): void {

    this.tareaService.obtenerTodas().subscribe({

      next: data => this.tareas = data,

      error: err => console.error(err)

    });

  }

  guardar(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    const trabajo: TrabajoCreate = this.form.getRawValue();

    this.trabajoService.crear(trabajo).subscribe({

      next: () => {

        alert('Trabajo creado correctamente');

        this.form.reset({
          idCliente: 0,
          idTecnico: 0,
          idTarea: 0,
          fechaTrabajo: '',
          comentarios: ''
        });

      },

      error: err => {

        console.error(err);

      }

    });

  }

}