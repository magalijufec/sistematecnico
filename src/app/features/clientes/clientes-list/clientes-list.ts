import { Component, inject, OnInit } from '@angular/core';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/cliente';

@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.html',
  styleUrl: './clientes-list.scss'
})
export class ClientesListComponent implements OnInit {

    private clienteService = inject(ClienteService);

    clientes:Cliente[]=[];

    ngOnInit(): void {

        // this.clienteService.obtenerTodos().subscribe({

        //     next:(data)=>{

        //         this.clientes=data;

        //     }

        // });

    }

}