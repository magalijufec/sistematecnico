import { Component, Input } from '@angular/core';
import { DashboardCard } from '../../../core/models/dashboard-card';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss'
})
export class StatCardComponent {

  @Input() card!: DashboardCard;

}