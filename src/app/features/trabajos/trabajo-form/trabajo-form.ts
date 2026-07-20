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
import { ActivatedRoute } from '@angular/router';

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
  private route = inject(ActivatedRoute);

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

  idTrabajo = 0;

  esEdicion = false;

  ngOnInit(): void {

    this.cargarClientes();

    this.cargarTecnicos();

    this.cargarTareas();

    this.idTrabajo = Number(this.route.snapshot.paramMap.get('id'));

    this.esEdicion = this.idTrabajo > 0;

    if (this.esEdicion) {
      this.cargarTrabajo();
    }

  }

  cargarTrabajo() {

    this.trabajoService.obtenerPorId(this.idTrabajo).subscribe({

      next: trabajo => {

        this.form.patchValue({

          idCliente: trabajo.idCliente,
          idTecnico: trabajo.idTecnico,
          idTarea: trabajo.idTarea,
          fechaTrabajo: trabajo.fechaTrabajo.substring(0, 10),
          comentarios: trabajo.comentarios

        });

      }

    });

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

    if (this.idTrabajo === 0) {

      this.trabajoService.crear(trabajo).subscribe({

        next: () => {

          alert('Trabajo creado correctamente');

        },

        error: err => console.error(err)

      });

    } else {

      this.trabajoService.actualizar(this.idTrabajo, trabajo).subscribe({

        next: () => {

          alert('Trabajo actualizado correctamente');

        },

        error: err => console.error(err)

      });

    }

  }



}