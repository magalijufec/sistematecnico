import { Component, inject, OnInit } from '@angular/core';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models/usuario';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Combo } from '../../../core/models/combo';
import { PerfilService } from '../../../core/services/perfil.service';
import { ProvinciaService } from '../../../core/services/provincia.service';
import { CiudadService } from '../../../core/services/ciudad.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.scss'
})
export class UsuariosListComponent implements OnInit {

  private usuarioService = inject(UsuarioService);
  private perfilService = inject(PerfilService);
  private provinciaService = inject(ProvinciaService);
  private ciudadService = inject(CiudadService);
  private clienteService = inject(ClienteService);

  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  perfiles: Combo[] = [];
  provincias: Combo[] = [];
  ciudades: Combo[] = [];
  clientes: Combo[] = [];
  filtroTexto = '';
  filtroPerfil: number | null = null;
  filtroProvincia: number | null = null;
  filtroCiudad: number | null = null;
  filtroCliente: number | null = null;

  displayedColumns = [
    'userName',
    'nombreApellido',
    'perfil',
    'provincia',
    'ciudad',
    'cliente',
    'activo',
    'acciones'
  ];

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarPerfiles();
    this.cargarProvincias();
  }

  cargarUsuarios() {
    this.usuarioService.obtenerTodos().subscribe({
      next: data => {
        this.usuarios = data;
        this.usuariosFiltrados = data;
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
          console.error('Error al cargar perfiles', error);
        }
      });
  }


  cargarProvincias(): void {
    this.provinciaService
      .obtenerCombo()
      .subscribe({
        next: data => {
          this.provincias = data;
        },
        error: error => {
          console.error('Error al cargar provincias', error);
        }
      });
  }

  cambioProvincia(): void {
    this.filtroCiudad = null;
    this.filtroCliente = null;
    this.ciudades = [];
    this.clientes = [];


    if (!this.filtroProvincia) {
      this.aplicarFiltros();
      return;
    }

    // Cargar ciudades de esa provincia

    this.ciudadService
      .obtenerPorProvincia(
        this.filtroProvincia
      )
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


    this.aplicarFiltros();

  }


  // =========================
  // CAMBIO CIUDAD
  // =========================

  cambioCiudad(): void {

    this.filtroCliente = null;

    this.clientes = [];


    if (
      !this.filtroProvincia ||
      !this.filtroCiudad
    ) {

      this.aplicarFiltros();

      return;

    }


    // Cargar clientes de provincia + ciudad

    this.clienteService
      .obtenerPorProvinciaCiudad(
        this.filtroProvincia,
        this.filtroCiudad
      )
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
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    const texto =
      this.filtroTexto
        .trim()
        .toLowerCase();

    this.usuariosFiltrados =
      this.usuarios.filter(usuario => {
        const coincideTexto = !texto ||
          usuario.userName
            ?.toLowerCase()
            .includes(texto) ||

          usuario.nombreApellido
            ?.toLowerCase()
            .includes(texto);

        const coincidePerfil = !this.filtroPerfil || usuario.perfilId === this.filtroPerfil;

        const coincideProvincia = !this.filtroProvincia || usuario.provinciaId === this.filtroProvincia;

        const coincideCiudad = !this.filtroCiudad || usuario.ciudadId === this.filtroCiudad;

        const coincideCliente = !this.filtroCliente || usuario.clienteId === this.filtroCliente;
        return (
          coincideTexto &&
          coincidePerfil &&
          coincideProvincia &&
          coincideCiudad &&
          coincideCliente
        );
      });
  }

  limpiarFiltros(): void {
    this.filtroTexto = '';
    this.filtroPerfil = null;
    this.filtroProvincia = null;
    this.filtroCiudad = null;
    this.filtroCliente = null;
    this.ciudades = [];
    this.clientes = [];
    this.usuariosFiltrados = this.usuarios;
  }

}