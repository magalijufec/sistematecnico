import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterModule
} from '@angular/router';

import {
  MatTableModule
} from '@angular/material/table';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatSelectModule
} from '@angular/material/select';

import {
  MatCardModule
} from '@angular/material/card';

import {
  ClienteService
} from '../../../core/services/cliente.service';

import {
  ProvinciaService
} from '../../../core/services/provincia.service';

import {
  CiudadService
} from '../../../core/services/ciudad.service';

import {
  Cliente
} from '../../../core/models/cliente';

import {
  Combo
} from '../../../core/models/combo';


@Component({
  selector: 'app-clientes-list',

  standalone: true,

  imports: [

    CommonModule,

    FormsModule,

    RouterModule,

    MatTableModule,

    MatButtonModule,

    MatIconModule,

    MatFormFieldModule,

    MatInputModule,

    MatSelectModule,

    MatCardModule

  ],

  templateUrl: './clientes-list.html',

  styleUrl: './clientes-list.scss'

})
export class ClientesListComponent
  implements OnInit {


  private clienteService =
    inject(ClienteService);

  private provinciaService =
    inject(ProvinciaService);

  private ciudadService =
    inject(CiudadService);


  // LISTA COMPLETA

  clientes: Cliente[] = [];

  // LISTA FILTRADA

  clientesFiltrados: Cliente[] = [];


  // COMBOS

  provincias: Combo[] = [];

  ciudades: Combo[] = [];


  // FILTROS

  filtroTexto = '';

  filtroProvincia: number | null = null;

  filtroCiudad: number | null = null;


  // COLUMNAS

  displayedColumns: string[] = [

    'nroCliente',

    'nombre',

    'provincia',

    'ciudad',

    'direccion',

    'acciones'

  ];


  ngOnInit(): void {

    this.cargarClientes();

    this.cargarProvincias();

  }


  // =====================================
  // CARGAR CLIENTES
  // =====================================

  cargarClientes(): void {

    this.clienteService
      .obtenerTodos()
      .subscribe({

        next: data => {

          this.clientes = data;

          this.clientesFiltrados = data;

        },

        error: error => {

          console.error(
            'Error al cargar clientes',
            error
          );

        }

      });

  }


  // =====================================
  // CARGAR PROVINCIAS
  // =====================================

  cargarProvincias(): void {

    this.provinciaService
      .obtenerCombo()
      .subscribe({

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


  // =====================================
  // CAMBIO PROVINCIA
  // =====================================

  cambioProvincia(): void {

    // Limpiamos ciudad

    this.filtroCiudad = null;

    this.ciudades = [];


    // Si no seleccionó provincia

    if (
      !this.filtroProvincia ||
      this.filtroProvincia === 0
    ) {

      this.aplicarFiltros();

      return;

    }


    // Cargar ciudades

    this.ciudadService
      .obtenerPorProvincia(
        this.filtroProvincia
      )
      .subscribe({

        next: data => {

          this.ciudades = data;

          this.aplicarFiltros();

        },

        error: error => {

          console.error(
            'Error al cargar ciudades',
            error
          );

        }

      });

  }


  // =====================================
  // CAMBIO CIUDAD
  // =====================================

  cambioCiudad(): void {

    this.aplicarFiltros();

  }


  // =====================================
  // CAMBIO TEXTO
  // =====================================

  cambioTexto(): void {

    this.aplicarFiltros();

  }


  // =====================================
  // APLICAR FILTROS
  // =====================================

  aplicarFiltros(): void {

    const texto =
      this.filtroTexto
        .trim()
        .toLowerCase();


    this.clientesFiltrados =
      this.clientes.filter(cliente => {


        // -----------------------------
        // FILTRO TEXTO
        // -----------------------------

        const coincideTexto =

          !texto ||

          cliente.nombre
            ?.toLowerCase()
            .includes(texto) ||

          cliente.nroCliente
            ?.toString()
            .includes(texto);


        // -----------------------------
        // FILTRO PROVINCIA
        // -----------------------------

        const coincideProvincia =

          !this.filtroProvincia ||

          cliente.provinciaId ===
          this.filtroProvincia;


        // -----------------------------
        // FILTRO CIUDAD
        // -----------------------------

        const coincideCiudad =

          !this.filtroCiudad ||

          cliente.ciudadId ===
          this.filtroCiudad;


        return (

          coincideTexto &&

          coincideProvincia &&

          coincideCiudad

        );

      });

  }


  // =====================================
  // LIMPIAR FILTROS
  // =====================================

  limpiarFiltros(): void {

    this.filtroTexto = '';

    this.filtroProvincia = null;

    this.filtroCiudad = null;

    this.ciudades = [];

    this.clientesFiltrados =
      [...this.clientes];

  }

}

