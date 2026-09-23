import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CatalogosIncidencia } from '../../../core/models/catalogos-incidencia';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { IncidenciasService } from '../../../core/services/incidencia.service';
import { CrearIncidenciaDto } from '../../../core/models/crear-incidencia';
import { ClienteService } from '../../../core/services/cliente.service';
import { ClienteCombo } from '../../../core/models/cliente-combo';
import { ToastService } from '../../../core/services/toast.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { inject } from '@angular/core';

@Component({
  selector: 'app-nueva-incidencia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    NgxMatSelectSearchModule
  ],
  templateUrl: './nueva-incidencia.html',
  styleUrl: './nueva-incidencia.scss'
})
export class NuevaIncidenciaComponent implements OnInit {

  catalogos!: CatalogosIncidencia;
  clientes: ClienteCombo[] = [];
  estadoIncidenciaId = 2;
  formulario!: FormGroup;
  clienteFiltro = new FormControl<string>('');
  clientesFiltrados: ClienteCombo[] = [];
  origen = 'finalizado';
  private router = inject(Router);

  get esPendiente(): boolean {
    return this.estadoIncidenciaId === 1;
  }

  get esFinalizada(): boolean {
    return this.estadoIncidenciaId === 2;
  }

  get mostrarOtro(): boolean {

    if (!this.catalogos?.tareas) {
      return false;
    }

    const tareaSeleccionada =
      this.catalogos.tareas.find(
        x => x.id === this.formulario.get('tareaId')?.value
      );

    return tareaSeleccionada?.nombre === 'Otros';
  }

  constructor(
    private fb: FormBuilder,
    private incidenciasService: IncidenciasService,
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {

    const estado = this.route.snapshot.queryParamMap.get('estado');

    if (estado === 'pendiente') {
      this.estadoIncidenciaId = 1;
      this.origen = 'pendiente';
    }
    else {
      this.estadoIncidenciaId = 2;
      this.origen = 'finalizado';
    }

    this.formulario = this.fb.group({
      clienteId: [null, Validators.required],
      destinoId: [null, Validators.required],
      asistenciaId: [1, Validators.required],
      tareaId: [null, Validators.required],
      otro: [''],
      comentario: [''],
      trabajoRealizado: [''],
      guardia: [false]
    });

    this.cargarCatalogos();
    this.cargarClientes();
  }

  cargarClientes(): void {

    this.clienteService
      .obtenerCombo()
      .subscribe(clientes => {

        this.clientes = clientes;
        this.clientesFiltrados = clientes;

        this.clienteFiltro.valueChanges.subscribe(
          (texto: string | null) => {

            const filtro =
              this.normalizarTexto(texto ?? '');

            this.clientesFiltrados =
              this.clientes.filter(cliente =>

                this.normalizarTexto(
                  cliente.nombre
                ).includes(filtro)

              );

          });

      });
  }

  cargarCatalogos() {

    this.incidenciasService
      .obtenerCatalogos()
      .subscribe({
        next: x => this.catalogos = x
      });
  }

  guardar() {

    if (this.formulario.invalid) {

      this.toastService.warning(
        'Complete los campos obligatorios.'
      );

      this.formulario.markAllAsTouched();

      return;
    }

    const dto: CrearIncidenciaDto = {
      ...this.formulario.value,
      estadoIncidenciaId: this.estadoIncidenciaId
    };

    this.incidenciasService
      .crear(dto)
      .subscribe({

        next: () => {

          this.toastService.success(
            'Incidencia registrada correctamente.'
          );

          this.formulario.reset();

          this.formulario.patchValue({
            asistenciaId: 1,
            guardia: false
          });

          this.toastService.success(
            'Incidencia registrada correctamente.'
          );

          if (this.origen === 'pendiente') {

            this.router.navigate(
              ['/incidencias/pendientes']
            );

          }
          else {

            this.router.navigate(
              ['/incidencias/finalizadas']
            );

          }

        },

        error: (error) => {

          this.toastService.error(
            error?.error ?? 'Ocurrió un error.'
          );

        }
      });
  }

  private configurarFiltros(): void {

    this.clienteFiltro.valueChanges
      .subscribe((texto: string | null) => {

        const filtro =
          this.normalizarTexto(texto ?? '');

        this.clientesFiltrados =
          this.clientes.filter(cliente =>

            this.normalizarTexto(
              cliente.nombre
            ).includes(filtro)

          );

      });

  }

  private normalizarTexto(texto: string): string {

    return (texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
