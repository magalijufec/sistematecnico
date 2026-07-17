import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { Dashboard } from '../../../core/models/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {

  private dashboardService = inject(DashboardService);

  dashboard?: Dashboard;

  ngOnInit(): void {

    this.dashboardService.obtenerDashboard().subscribe({

      next: data => {

        this.dashboard = data;

      }

    });

  }

}