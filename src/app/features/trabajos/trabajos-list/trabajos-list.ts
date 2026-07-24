import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TrabajoService } from '../../../core/services/trabajo.service';
import { Trabajo } from '../../../core/models/trabajo';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EstadoService } from '../../../core/services/estado.service';

@Component({
  selector: 'app-trabajos-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './trabajos-list.html',
  styleUrl: './trabajos-list.scss'
})
export class TrabajosListComponent implements OnInit {

  private trabajoService = inject(TrabajoService);
  private estadoService = inject(EstadoService);
  trabajos: Trabajo[] = [];
  trabajosFiltrados: Trabajo[] = [];

  estados: any[] = [];
  buscar = '';
  estadoSeleccionado: number | null = null;
  dataSource = new MatTableDataSource<Trabajo>();

  displayedColumns = [
    'id',
    'cliente',
    'provincia',
    'ciudad',
    'tecnico',
    'tarea',
    'estado',
    'acciones'
  ];

  constructor() {
  }

  ngOnInit() {
    this.cargarTrabajos();
    this.cargarEstados();
  }

  private router = inject(Router);

  nuevo() {
    this.router.navigate(['/trabajos/nuevo']);
  }

  cargarEstados(): void {
    this.estadoService.obtenerCombo().subscribe({
      next: data => {
        this.estados = data;
      },
      error: error => {
        console.error('Error al cargar estados', error);
      }
    });
  }

  cargarTrabajos() {
    this.trabajoService.obtenerNoFinalizados().subscribe({
      next: (data) => {
        console.log(data);

        this.trabajos = data;

        this.filtrar();
      },
      error: (err) => console.error(err)
    });
  }

  filtrar(): void {

    const texto = this.buscar.toLowerCase().trim();

    this.trabajosFiltrados = this.trabajos.filter(trabajo => {

      const coincideTexto =
        !texto ||
        trabajo.cliente.toLowerCase().includes(texto) ||
        trabajo.tecnico.toLowerCase().includes(texto) ||
        trabajo.tarea.toLowerCase().includes(texto);

      const coincideEstado =
        this.estadoSeleccionado === null ||
        trabajo.idEstado === this.estadoSeleccionado;

      return coincideTexto && coincideEstado;

    });

  }

  limpiarFiltros(): void {
    this.buscar = '';
    this.estadoSeleccionado = null;
    this.filtrar();
  }

}