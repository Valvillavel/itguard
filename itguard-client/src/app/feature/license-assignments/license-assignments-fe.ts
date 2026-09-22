import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LicenseAssignmentsFeService, LicenseAssignmentItem } from './license-assignments-fe.service';
import { LicensesService } from '../licenses/licenses.service';
import { AuthStateService } from '../../auth/shared/auth-state.service';

interface AssignForm { licenseId: string; userId: string; assetId: string; observations: string; }
interface ConfirmDialog { message: string; action: () => void; }

@Component({ selector: 'app-license-assignments-fe', imports: [FormsModule], templateUrl: './license-assignments-fe.html' })
export default class LicenseAssignmentsFe implements OnInit {
  private _svc = inject(LicenseAssignmentsFeService);
  private _licSvc = inject(LicensesService);
  private _authState = inject(AuthStateService);
  items = signal<LicenseAssignmentItem[]>([]);
  licenses = signal<{ id: number; licenseType: string; software?: { name: string } | null; usedQuantity: number; purchasedQuantity: number }[]>([]);
  isLoading = signal(true); error = signal<string | null>(null); successMessage = signal<string | null>(null);
  searchTerm = signal(''); showActiveOnly = signal(false);
  confirmDialog = signal<ConfirmDialog | null>(null);
  showAssignModal = signal(false);
  assignForm = signal<AssignForm>({ licenseId: '', userId: '', assetId: '', observations: '' });
  assignLoading = signal(false); assignError = signal<string | null>(null);

  readonly filtered = computed(() => {
    const t = this.searchTerm().toLowerCase(); const ao = this.showActiveOnly();
    return this.items().filter(i => {
      const m = !t || (i.license?.software?.name.toLowerCase().includes(t) ?? false) || (i.license?.licenseType.toLowerCase().includes(t) ?? false) || (i.user ? `${i.user.firstName} ${i.user.lastName}`.toLowerCase().includes(t) : false);
      const active = !ao || !i.unassignedAt;
      return m && active;
    });
  });

  ngOnInit() { this.load(); this.loadLicenses(); }

  load() {
    this.isLoading.set(true);
    this._svc.getAll().subscribe({ next: d => { this.items.set(d); this.isLoading.set(false); }, error: () => { this.error.set('No se pudieron cargar las asignaciones.'); this.isLoading.set(false); } });
  }

  loadLicenses() {
    this._licSvc.getAll().subscribe({ next: (res: any) => { const data = Array.isArray(res) ? res : (res.data ?? []); this.licenses.set(data); } });
  }

  openAssign() {
    const me = this._authState.currentUser();
    this.assignForm.set({ licenseId: '', userId: '', assetId: '', observations: '' });
    this.assignError.set(null); this.showAssignModal.set(true);
  }

  submitAssign() {
    const f = this.assignForm();
    if (!f.licenseId) { this.assignError.set('Selecciona una licencia.'); return; }
    if (!f.userId && !f.assetId) { this.assignError.set('Especifica un usuario o activo a asignar.'); return; }
    this.assignLoading.set(true); this.assignError.set(null);
    const me = this._authState.currentUser();
    this._svc.create({
      licenseId: Number(f.licenseId),
      userId: f.userId || undefined,
      assetId: f.assetId ? Number(f.assetId) : undefined,
      assignedById: me?.id,
      observations: f.observations || undefined,
    }).subscribe({
      next: created => { this.items.update(l => [created, ...l]); this.showAssignModal.set(false); this.assignLoading.set(false); this.showSuccess('Licencia asignada correctamente.'); },
      error: err => { this.assignLoading.set(false); this.assignError.set((err as any)?.error?.message ?? 'Error al asignar licencia.'); }
    });
  }

  confirmUnassign(item: LicenseAssignmentItem) {
    if (item.unassignedAt) return;
    this.confirmDialog.set({ message: `¿Desasignar esta licencia? Se reducirá el contador de uso.`, action: () => {
      this._svc.unassign(item.id).subscribe({ next: updated => { this.items.update(l => l.map(x => x.id === updated.id ? updated : x)); this.showSuccess('Licencia desasignada correctamente.'); }, error: () => {} });
    }});
  }
  runConfirm() { this.confirmDialog()?.action(); this.confirmDialog.set(null); }
  private showSuccess(msg: string) { this.successMessage.set(msg); setTimeout(() => this.successMessage.set(null), 3500); }
}
