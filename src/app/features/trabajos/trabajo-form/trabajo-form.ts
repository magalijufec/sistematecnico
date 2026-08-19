import {
  Component,
  OnInit,
  inject
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  CommonModule
} from '@angular/common';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  ClienteService
} from '../../../core/services/cliente.service';
import {
  UsuarioService
} from '../../../core/services/usuario.service';
import {
  TareaService
} from '../../../core/services/tarea.service';
import {
  TrabajoService
} from '../../../core/services/trabajo.service';
import {
  Combo
} from '../../../core/models/combo';
import {
  TrabajoCreate
} from '../../../core/models/trabajo-create';
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
  MatButtonModule
} from '@angular/material/button';
import {
  MatCardModule
} from '@angular/material/card';
import {
  NgxMatSelectSearchModule
} from 'ngx-mat-select-search';
import {
  TecnicoCombo
} from '../../../core/models/tecnico-combo';
import { ClienteCombo } from '../../../core/models/cliente-combo';
import { ToastService } from '../../../core/services/toast.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-trabajo-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    NgxMatSelectSearchModule,
    MatIconModule
  ],

  templateUrl: './trabajo-form.html',

  styleUrl: './trabajo-form.scss'

})
export class TrabajoFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clienteService = inject(ClienteService);
  private usuarioService = inject(UsuarioService);
  private tareaService = inject(TareaService);
  private trabajoService = inject(TrabajoService);
  private toastService = inject(ToastService);

  clienteFiltro = new FormControl('');
  archivos: File[] = [];
  clientesFiltrados: ClienteCombo[] = [];
  clientes: ClienteCombo[] = [];
  tecnicos: TecnicoCombo[] = [];
  tecnicosFiltrados: TecnicoCombo[] = [];
  tareas: Combo[] = [];

  // Guardamos los IDs para la edición
  private clienteSeleccionadoId: number = 0;
  private tecnicoSeleccionadoId: number = 0;

  form = this.fb.nonNullable.group({

    idCliente: [

      0,

      Validators.required

    ],


    idTecnico: [

      0,

      Validators.required

    ],


    idTarea: [

      0,

      Validators.required

    ],


    comentarios: [

      ''

    ]

  });


  idTrabajo = 0;

  esEdicion = false;


  ngOnInit(): void {

    this.idTrabajo = Number(

      this.route.snapshot
        .paramMap
        .get('id')

    );


    this.esEdicion =
      this.idTrabajo > 0;


    // Cargar datos iniciales

    this.cargarClientes();

    this.cargarTecnicos();

    this.cargarTareas();


    // Si estamos editando
    // cargamos el trabajo

    if (this.esEdicion) {

      this.cargarTrabajo();

    }


    // Filtro de clientes

    this.clienteFiltro
      .valueChanges
      .subscribe(texto => {

        const filtro =
          (texto ?? '')
            .toLowerCase();


        this.clientesFiltrados =
          this.clientes.filter(

            cliente =>

              cliente.nombre
                .toLowerCase()
                .includes(filtro)

          );

      });

  }

  cargarTrabajo(): void {

    this.trabajoService

      .obtenerPorId(this.idTrabajo)

      .subscribe({

        next: trabajo => {

          console.log(
            'Trabajo a editar:',
            trabajo
          );


          this.clienteSeleccionadoId =
            trabajo.idCliente;


          this.tecnicoSeleccionadoId =
            trabajo.idTecnico;


          this.form.patchValue({

            idCliente:
              trabajo.idCliente,

            idTecnico:
              trabajo.idTecnico,

            idTarea:
              trabajo.idTarea,

            comentarios:
              trabajo.comentarios + ''

          });


          // Intentamos filtrar técnicos
          // por el cliente

          this.filtrarTecnicosPorCliente(

            trabajo.idCliente,

            trabajo.idTecnico

          );

        },


        error: error => {

          console.error(

            'Error al cargar el trabajo',

            error

          );

        }

      });

  }

  cargarClientes(): void {

    this.clienteService

      .obtenerCombo()

      .subscribe({

        next: data => {

          this.clientes = data;

          this.clientesFiltrados =
            data;


          // Si estamos editando
          // y ya tenemos cliente seleccionado
          // filtramos técnicos

          if (
            this.clienteSeleccionadoId
          ) {

            this.filtrarTecnicosPorCliente(

              this.clienteSeleccionadoId,

              this.tecnicoSeleccionadoId

            );

          }

        },


        error: error => {

          console.error(

            'Error al cargar clientes',

            error

          );

        }

      });

  }

  cargarTecnicos(): void {

    this.usuarioService

      .obtenerTecnicos()

      .subscribe({

        next: data => {

          this.tecnicos = data;


          // Inicialmente no mostramos técnicos

          this.tecnicosFiltrados = [];


          // Si estamos editando
          // y ya conocemos el cliente

          if (
            this.clienteSeleccionadoId
          ) {

            this.filtrarTecnicosPorCliente(

              this.clienteSeleccionadoId,

              this.tecnicoSeleccionadoId

            );

          }

        },


        error: error => {

          console.error(

            'Error al cargar técnicos',

            error

          );

        }

      });

  }

  filtrarTecnicosPorCliente(

    clienteId: number,

    tecnicoId: number = 0

  ): void {


    // Si todavía no cargaron los clientes

    if (
      this.clientes.length === 0
    ) {

      return;

    }


    // Si todavía no cargaron los técnicos

    if (
      this.tecnicos.length === 0
    ) {

      return;

    }


    const cliente =
      this.clientes.find(

        x =>
          x.id === clienteId

      );


    if (!cliente) {

      this.tecnicosFiltrados = [];

      return;

    }


    const provinciaId =
      cliente.provinciaId;


    console.log(

      'Provincia del cliente:',

      provinciaId

    );


    // Filtramos técnicos

    this.tecnicosFiltrados =

      this.tecnicos.filter(

        tecnico =>

          tecnico.provinciaId ===
          provinciaId

      );


    console.log(

      'Técnicos filtrados:',

      this.tecnicosFiltrados

    );


    // En edición mantenemos
    // el técnico seleccionado

    if (tecnicoId) {

      const tecnicoExiste =

        this.tecnicosFiltrados.some(

          tecnico =>

            tecnico.id === tecnicoId

        );


      if (tecnicoExiste) {

        this.form.patchValue({

          idTecnico: tecnicoId

        });

      }

    }

  }

  cambioCliente(): void {


    const clienteId =

      this.form
        .get('idCliente')
        ?.value;


    // Limpiamos técnico seleccionado

    this.form.patchValue({

      idTecnico: 0

    });


    this.tecnicosFiltrados = [];


    if (

      !clienteId ||

      clienteId === 0

    ) {

      return;

    }


    this.clienteSeleccionadoId =
      clienteId;


    this.tecnicoSeleccionadoId =
      0;


    this.filtrarTecnicosPorCliente(

      clienteId

    );

  }

  cargarTareas(): void {

    this.tareaService

      .obtenerTodas()

      .subscribe({

        next: data => {

          this.tareas = data;

        },


        error: error => {

          console.error(

            'Error al cargar tareas',

            error

          );

        }

      });

  }

  seleccionarArchivos(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files) {
      return;
    }

    this.archivos = Array.from(input.files);

    console.log('Archivos seleccionados:', this.archivos);
  }

  guardar(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();

    const trabajo: TrabajoCreate = {
      idCliente: valores.idCliente,
      idTecnico: valores.idTecnico,
      idTarea: valores.idTarea,
      comentarios: valores.comentarios,
      archivos: this.archivos
    };

    if (!this.esEdicion) {

      this.trabajoService
        .crear(trabajo)
        .subscribe({

          next: () => {

            this.toastService.success(
              'Trabajo creado correctamente'
            );

            this.router.navigate(
              ['/trabajos']
            );

          },

          error: error => {

            console.error(
              'Error al crear trabajo',
              error
            );

            console.error(
              'Respuesta backend:',
              error.error
            );

            this.toastService.error(
              error.error?.mensaje ??
              'No se pudo crear el trabajo'
            );

          }

        });

      return;
    }


    // ==========================================
    // EDITAR
    // ==========================================

    this.trabajoService
      .actualizar(
        this.idTrabajo,
        trabajo
      )
      .subscribe({

        next: () => {

          this.toastService.success(
            'Trabajo actualizado correctamente'
          );

          this.router.navigate(
            ['/trabajos']
          );

        },

        error: error => {

          console.error(
            'Error al actualizar trabajo',
            error
          );

          console.error(
            'Respuesta backend:',
            error.error
          );

          this.toastService.error(
            error.error?.mensaje ??
            'No se pudo actualizar el trabajo'
          );

        }

      });

  }

  cancelar(): void {

    this.router.navigate(

      ['/trabajos']

    );

  }

}