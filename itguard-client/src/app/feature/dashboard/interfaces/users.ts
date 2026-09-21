// Re-export shared models for backward compatibility
export type { User, Asset, Incident, Maintenance } from '../../shared/models';

export interface DashboardStats {
  totalUsers: number;
  totalAssets: number;
  openIncidents: number;
  pendingMaintenance: number;
}
