import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HardwareComponentsService, HardwareComponent } from './hardware-components.service';

interface HWForm { assetId: string; type: string; brand: string; model: string; serialNumber: string; capacity: string; status: string; observations: string; }
interface ConfirmDialog { message: string; action: () => void; }

@Component({ selector: 'app-hardware-components', imports: [FormsModule], templateUrl: './hardware-components.html' })
export default class HardwareComponents implements OnInit {
  private _svc = inject(HardwareComponentsService);
  items = signal<HardwareComponent[]>([]);
  isLoading = signal(true); error = signal<string | null>(null); successMessage = signal<string | null>(null);
  searchTerm = signal('');
  confirmDialog = signal<ConfirmDialog | null>(null);
  showCreateModal = signal(false); editingItem = signal<HardwareComponent | null>(null);
  createForm = signal<HWForm>({ assetId: '', type: '', brand: '', model: '', serialNumber: '', capacity: '', status: '', observations: '' });
  editForm = signal<HWForm>({ assetId: '', type: '', brand: '', model: '', serialNumber: '', capacity: '', status: '', observations: '' });
  createLoading = signal(false); editLoading = signal(false);
  createError = signal<string | null>(null);

  readonly filtered = computed(() => {
    const t = this.searchTerm().toLowerCase();
    return this.items().filter(i => !t || i.type.toLowerCase().includes(t) || (i.brand?.toLowerCase().includes(t) ?? false) || (i.asset?.name.toLowerCase().includes(t) ?? false) || (i.asset?.inventoryCode.toLowerCase().includes(t) ?? false));
  });

  ngOnInit() { this.load(); }
  load() { this.isLoading.set(true); this._svc.getAll().subscribe({ next: d => { this.items.set(d); this.isLoading.set(false); }, error: () => { this.error.set('No se pudieron cargar los componentes.'); this.isLoading.set(false); } }); }
  openCreate() { this.createForm.set({ assetId: '', type: '', brand: '', model: '', serialNumber: '', capacity: '', status: '', observations: '' }); this.createError.set(null); this.showCreateModal.set(true); }
  submitCreate() {
    const f = this.createForm();
    if (!f.assetId || !f.type) { this.createError.set('Activo y tipo son obligatorios.'); return; }
    this.createLoading.set(true); this.createError.set(null);
    this._svc.create({ assetId: Number(f.assetId), type: f.type, brand: f.brand || undefined, model: f.model || undefined, serialNumber: f.serialNumber || undefined, capacity: f.capacity || undefined, status: f.status || undefined, observations: f.observations || undefined }).subscribe({
      next: created => { this.items.update(l => [created, ...l]); this.showCreateModal.set(false); this.createLoading.set(false); this.showSuccess('Componente registrado.'); },
      error: err => { this.createLoading.set(false); this.createError.set((err as any)?.error?.message ?? 'Error al crear.'); }
    });
  }
  openEdit(item: HardwareComponent) { this.editingItem.set(item); this.editForm.set({ assetId: String(item.assetId), type: item.type, brand: item.brand ?? '', model: item.model ?? '', serialNumber: item.serialNumber ?? '', capacity: item.capacity ?? '', status: item.status ?? '', observations: item.observations ?? '' }); }
  submitEdit() {
    const item = this.editingItem(); const f = this.editForm(); if (!item) return;
    this.editLoading.set(true);
    this._svc.update(item.id, { type: f.type, brand: f.brand || undefined, model: f.model || undefined, serialNumber: f.serialNumber || undefined, capacity: f.capacity || undefined, status: f.status || undefined, observations: f.observations || undefined }).subscribe({
      next: updated => { this.items.update(l => l.map(x => x.id === updated.id ? updated : x)); this.editingItem.set(null); this.editLoading.set(false); this.showSuccess('Componente actualizado.'); },
      error: () => { this.editLoading.set(false); }
    });
  }
  confirmRemove(item: HardwareComponent) { this.confirmDialog.set({ message: `¿Eliminar el componente "${item.type}" del activo "${item.asset?.name ?? 'ID:'+item.assetId}"?`, action: () => { this._svc.remove(item.id).subscribe({ next: () => { this.items.update(l => l.filter(x => x.id !== item.id)); this.showSuccess('Componente eliminado.'); }, error: () => {} }); } }); }
  runConfirm() { this.confirmDialog()?.action(); this.confirmDialog.set(null); }
  private showSuccess(msg: string) { this.successMessage.set(msg); setTimeout(() => this.successMessage.set(null), 3500); }
}
