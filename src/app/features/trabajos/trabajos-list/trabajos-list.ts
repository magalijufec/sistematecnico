import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

import { TrabajoService } from '../../../core/services/trabajo.service';
import { Trabajo } from '../../../core/models/trabajo';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-trabajos-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './trabajos-list.html',
  styleUrl: './trabajos-list.scss'
})
export class TrabajosListComponent implements OnInit {

  private trabajoService = inject(TrabajoService);

  trabajos: Trabajo[] = [];

  displayedColumns = [
    'id',
    'cliente',
    'tecnico',
    'tarea',
    'estado',
    'acciones'
  ];

  constructor() {
  }

  ngOnInit() {
    this.cargarTrabajos();
  }

  private router = inject(Router);

  nuevo() {
    this.router.navigate(['/trabajos/nuevo']);
  }

  cargarTrabajos() {
    this.trabajoService.obtenerTodos().subscribe({
      next: (data) => {
        console.log(data);
        this.trabajos = data;
      },
      error: (err) => console.error(err)
    });
  }
}