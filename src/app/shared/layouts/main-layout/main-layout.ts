import { Component, OnInit, ViewChild, inject } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { MENU } from '../../../core/constants/menu';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,

    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss']
})
export class MainLayoutComponent implements OnInit {

  protected menu = MENU;

  @ViewChild('drawer')
  drawer!: MatSidenav;

  private breakpointObserver = inject(BreakpointObserver);

  esMovil = false;

  ngOnInit(): void {

    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe(result => {

        this.esMovil = result.matches;

      });

  }

  toggleMenu(): void {

    this.drawer.toggle();

  }

  navegar(): void {

    // En celular cerramos el menú
    if (this.esMovil) {

      this.drawer.close();

    }

  }

}