import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { AuthStateService } from '../../../../auth/shared/auth-state.service';
import { DashboardService } from '../../services/dashboard.service';
import type { DashboardStats } from '../../interfaces/users';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
})
export default class Dashboard implements OnInit {
  private _authState = inject(AuthStateService);
  private _dashboardService = inject(DashboardService);

  readonly user = computed(() => this._authState.currentUser());
  readonly greeting = computed(() => {
    const name = this.user()?.firstName ?? 'Usuario';
    const hour = new Date().getHours();
    if (hour < 12) return `Buenos días, ${name}`;
    if (hour < 18) return `Buenas tardes, ${name}`;
    return `Buenas noches, ${name}`;
  });

  stats = signal<DashboardStats | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this._dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las estadísticas.');
        this.isLoading.set(false);
      },
    });
  }
}
