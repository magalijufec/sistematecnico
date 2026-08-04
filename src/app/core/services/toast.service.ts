import {
    Injectable,
    inject
} from '@angular/core';

import {
    MatSnackBar
} from '@angular/material/snack-bar';


@Injectable({
    providedIn: 'root'
})
export class ToastService {

    private snackBar = inject(MatSnackBar);

    success(
        mensaje: string
    ): void {

        this.snackBar.open(
            mensaje,
            'Cerrar',
            {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: [
                    'toast-success'
                ]
            }
        );
    }

    error(
        mensaje: string
    ): void {

        this.snackBar.open(
            mensaje,
            'Cerrar',
            {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: [
                    'toast-error'
                ]
            }
        );

    }

    warning(
        mensaje: string
    ): void {

        this.snackBar.open(
            mensaje,
            'Cerrar',
            {
                duration: 4000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: [
                    'toast-warning'
                ]
            }
        );

    }

    info(
        mensaje: string
    ): void {

        this.snackBar.open(
            mensaje,
            'Cerrar',
            {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: [
                    'toast-info'
                ]
            }
        );

    }

}
