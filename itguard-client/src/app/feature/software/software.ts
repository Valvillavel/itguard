import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SoftwareService, SoftwareItem } from './software.service';

interface SWForm { name: string; manufacturer: string; category: string; currentVersion: string; requiresLicense: boolean; }
interface ConfirmDialog { message: string; action: () => void; }

@Component({ selector: 'app-software', imports: [FormsModule], templateUrl: './software.html' })
export default class Software implements OnInit {
  private _svc = inject(SoftwareService);
  items = signal<SoftwareItem[]>([]);
  isLoading = signal(true); error = signal<string | null>(null); successMessage = signal<string | null>(null);
  searchTerm = signal(''); activeFilter = signal<'all'|'active'|'inactive'>('all');
  confirmDialog = signal<ConfirmDialog | null>(null);
  showCreateModal = signal(false); editingItem = signal<SoftwareItem | null>(null);
  createForm = signal<SWForm>({ name: '', manufacturer: '', category: '', currentVersion: '', requiresLicense: false });
  editForm = signal<SWForm>({ name: '', manufacturer: '', category: '', currentVersion: '', requiresLicense: false });
  createLoading = signal(false); editLoading = signal(false);
  createError = signal<string | null>(null); editError = signal<string | null>(null);

  readonly filtered = computed(() => {
    const t = this.searchTerm().toLowerCase(); const f = this.activeFilter();
    return this.items().filter(i => {
      const m = !t || i.name.toLowerCase().includes(t) || (i.manufacturer?.toLowerCase().includes(t) ?? false) || (i.category?.toLowerCase().includes(t) ?? false);
      return m && (f === 'all' || (f === 'active' && i.active) || (f === 'inactive' && !i.active));
    });
  });

  ngOnInit() { this.load(); }
  load() { this.isLoading.set(true); this._svc.getAll().subscribe({ next: d => { this.items.set(d); this.isLoading.set(false); }, error: () => { this.error.set('No se pudo cargar el software.'); this.isLoading.set(false); } }); }
  openCreate() { this.createForm.set({ name: '', manufacturer: '', category: '', currentVersion: '', requiresLicense: false }); this.createError.set(null); this.showCreateModal.set(true); }
  submitCreate() {
    const f = this.createForm();
    if (!f.name.trim()) { this.createError.set('El nombre es obligatorio.'); return; }
    this.createLoading.set(true); this.createError.set(null);
    this._svc.create({ name: f.name.trim(), manufacturer: f.manufacturer || undefined, category: f.category || undefined, currentVersion: f.currentVersion || undefined, requiresLicense: f.requiresLicense }).subscribe({
      next: created => { this.items.update(l => [created, ...l]); this.showCreateModal.set(false); this.createLoading.set(false); this.showSuccess('Software creado.'); },
      error: err => { this.createLoading.set(false); this.createError.set((err as any)?.error?.message ?? 'Error al crear.'); }
    });
  }
  openEdit(item: SoftwareItem) { this.editingItem.set(item); this.editForm.set({ name: item.name, manufacturer: item.manufacturer ?? '', category: item.category ?? '', currentVersion: item.currentVersion ?? '', requiresLicense: item.requiresLicense }); this.editError.set(null); }
  submitEdit() {
    const item = this.editingItem(); const f = this.editForm();
    if (!item || !f.name.trim()) { this.editError.set('El nombre es obligatorio.'); return; }
    this.editLoading.set(true); this.editError.set(null);
    this._svc.update(item.id, { name: f.name.trim(), manufacturer: f.manufacturer || undefined, category: f.category || undefined, currentVersion: f.currentVersion || undefined, requiresLicense: f.requiresLicense }).subscribe({
      next: updated => { this.items.update(l => l.map(x => x.id === updated.id ? updated : x)); this.editingItem.set(null); this.editLoading.set(false); this.showSuccess('Software actualizado.'); },
      error: err => { this.editLoading.set(false); this.editError.set((err as any)?.error?.message ?? 'Error al actualizar.'); }
    });
  }
  toggleActive(item: SoftwareItem) {
    const action = item.active ? 'desactivar' : 'activar';
    this.confirmDialog.set({ message: `¿${action.charAt(0).toUpperCase() + action.slice(1)} "${item.name}"?`, action: () => {
      const req = item.active ? this._svc.deactivate(item.id) : this._svc.activate(item.id);
      req.subscribe({ next: updated => { this.items.update(l => l.map(x => x.id === updated.id ? updated : x)); this.showSuccess(`Software ${item.active ? 'desactivado' : 'activado'}.`); }, error: () => {} });
    }});
  }
  runConfirm() { this.confirmDialog()?.action(); this.confirmDialog.set(null); }
  private showSuccess(msg: string) { this.successMessage.set(msg); setTimeout(() => this.successMessage.set(null), 3500); }
}
