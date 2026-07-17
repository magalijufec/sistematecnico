import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrabajoService } from '../../../core/services/trabajo.service';
import { Trabajo } from '../../../core/models/trabajo';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-trabajos-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './trabajos-list.html',
  styleUrl: './trabajos-list.scss'
})
export class TrabajosListComponent implements OnInit {

  private trabajoService = inject(TrabajoService);

  trabajos: Trabajo[] = [];

  constructor() {
  console.log('Constructor Trabajos');
}

ngOnInit() {
  console.log('OnInit Trabajos');
  this.cargarTrabajos();
}

ngOnDestroy() {
  console.log('Destroy Trabajos');
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