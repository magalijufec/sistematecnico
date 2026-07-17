import { Component, inject, OnInit } from '@angular/core';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models/usuario';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.scss'
})
export class UsuariosListComponent implements OnInit {

  private usuarioService = inject(UsuarioService);

  usuarios: Usuario[] = [];

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.obtenerTodos().subscribe({
      next: data => this.usuarios = data
    });
  }

}