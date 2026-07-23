import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/cliente';

@Component({
  selector: 'app-clientes-list',
  standalone: true,

  imports: [
    CommonModule,

    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule
  ],

  templateUrl: './clientes-list.html',
  styleUrl: './clientes-list.scss'
})
export class ClientesListComponent implements OnInit {

  private clienteService = inject(ClienteService);

  clientes: Cliente[] = [];

  displayedColumns = [
    'nroCliente',
    'nombre',
    'ciudad',
    'provincia',
    'acciones'
  ];


  ngOnInit(): void {

    this.cargarClientes();

  }


  cargarClientes(): void {

    this.clienteService
      .obtenerTodos()
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

}