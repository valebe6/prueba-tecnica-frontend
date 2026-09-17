import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { DashboardMetrics, DashboardService } from '../core/services/dashboard.service';
import { NavbarComponent } from '../layout/navbar/navbar';

@Component({
  imports: [NavbarComponent],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  metrics: DashboardMetrics | null = null;

  error = '';

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadMetrics();
    this.cdr.markForCheck();
  }

  loadMetrics(): void {
    this.dashboardService.getMetrics().subscribe({
      next: (metrics) => {
        console.log('MÉTRICAS RECIBIDAS:', metrics);

        this.metrics = metrics;
        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('ERROR DASHBOARD:', error);

        this.error = 'No se pudieron cargar las métricas.';
      },
    });
  }
}
