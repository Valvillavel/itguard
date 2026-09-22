import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { AssetsService } from './assets.service';
import type { Asset, AssetStatus } from '../shared/models';

const STATUS_LABELS: Record<AssetStatus, string> = {
  VIGENTE: 'Vigente',
  REQUIERE_ATENCION: 'Requiere atención',
  LIMITADO: 'Limitado',
  LEGACY: 'Legacy',
  BAJA: 'Baja',
  EN_REPARACION: 'En reparación',
  EN_ALMACEN: 'En almacén',
};

interface ConfirmDialog {
  message: string;
  action: () => void;
}
interface AssetForm {
  inventoryCode: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  serialNumber: string;
  location: string;
  operatingSystem: string;
  observations: string;
}

@Component({
  selector: 'app-assets',
  imports: [FormsModule, NgClass],
  templateUrl: './assets.html',
})
export default class Assets implements OnInit {
  private _service = inject(AssetsService);

  assets = signal<Asset[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  searchTerm = signal('');
  statusFilter = signal<AssetStatus | 'all'>('all');

  confirmDialog = signal<ConfirmDialog | null>(null);
  showCreateModal = signal(false);
  editingAsset = signal<Asset | null>(null);
  createForm = signal<AssetForm>({
    inventoryCode: '',
    name: '',
    type: '',
    brand: '',
    model: '',
    serialNumber: '',
    location: '',
    operatingSystem: '',
    observations: '',
  });
  editForm = signal<AssetForm>({
    inventoryCode: '',
    name: '',
    type: '',
    brand: '',
    model: '',
    serialNumber: '',
    location: '',
    operatingSystem: '',
    observations: '',
  });
  createLoading = signal(false);
  editLoading = signal(false);
  createError = signal<string | null>(null);
  editError = signal<string | null>(null);

  showStatusModal = signal<Asset | null>(null);
  newStatus = signal<AssetStatus>('VIGENTE');
  statusLoading = signal(false);

  readonly statusLabels = STATUS_LABELS;
  readonly allStatuses = Object.keys(STATUS_LABELS) as AssetStatus[];

  readonly filteredAssets = computed(() => {
    const t = this.searchTerm().toLowerCase();
    const s = this.statusFilter();
    return this.assets().filter((a) => {
      const m =
        !t ||
        a.name.toLowerCase().includes(t) ||
        a.inventoryCode.toLowerCase().includes(t) ||
        (a.type?.toLowerCase().includes(t) ?? false);
      return m && (s === 'all' || a.status === s);
    });
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading.set(true);
    this._service.getAll().subscribe({
      next: (d) => {
        this.assets.set(d);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los activos.');
        this.isLoading.set(false);
      },
    });
  }

  openCreate() {
    this.createForm.set({
      inventoryCode: '',
      name: '',
      type: '',
      brand: '',
      model: '',
      serialNumber: '',
      location: '',
      operatingSystem: '',
      observations: '',
    });
    this.createError.set(null);
    this.showCreateModal.set(true);
  }

  submitCreate() {
    const f = this.createForm();
    if (!f.inventoryCode.trim() || !f.name.trim() || !f.type.trim()) {
      this.createError.set('Código, nombre y tipo son obligatorios.');
      return;
    }
    this.createLoading.set(true);
    this.createError.set(null);
    this._service
      .create({
        inventoryCode: f.inventoryCode.trim(),
        name: f.name.trim(),
        type: f.type.trim(),
        brand: f.brand || undefined,
        model: f.model || undefined,
        serialNumber: f.serialNumber || undefined,
        location: f.location || undefined,
        operatingSystem: f.operatingSystem || undefined,
        observations: f.observations || undefined,
      })
      .subscribe({
        next: (created) => {
          this.assets.update((l) => [created, ...l]);
          this.showCreateModal.set(false);
          this.createLoading.set(false);
          this.showSuccess('Activo creado correctamente.');
        },
        error: (err) => {
          this.createLoading.set(false);
          this.createError.set((err as any)?.error?.message ?? 'Error al crear activo.');
        },
      });
  }

  openEdit(a: Asset) {
    this.editingAsset.set(a);
    this.editForm.set({
      inventoryCode: a.inventoryCode,
      name: a.name,
      type: a.type,
      brand: a.brand ?? '',
      model: a.model ?? '',
      serialNumber: a.serialNumber ?? '',
      location: (a as any).location ?? '',
      operatingSystem: (a as any).operatingSystem ?? '',
      observations: (a as any).observations ?? '',
    });
    this.editError.set(null);
  }

  submitEdit() {
    const a = this.editingAsset();
    const f = this.editForm();
    if (!a || !f.name.trim()) {
      this.editError.set('El nombre es obligatorio.');
      return;
    }
    this.editLoading.set(true);
    this.editError.set(null);
    this._service
      .update(a.id, {
        name: f.name.trim(),
        type: f.type.trim(),
        brand: f.brand || undefined,
        model: f.model || undefined,
        serialNumber: f.serialNumber || undefined,
        location: f.location || undefined,
        operatingSystem: f.operatingSystem || undefined,
        observations: f.observations || undefined,
      })
      .subscribe({
        next: (updated) => {
          this.assets.update((l) => l.map((x) => (x.id === updated.id ? updated : x)));
          this.editingAsset.set(null);
          this.editLoading.set(false);
          this.showSuccess('Activo actualizado.');
        },
        error: (err) => {
          this.editLoading.set(false);
          this.editError.set((err as any)?.error?.message ?? 'Error al actualizar activo.');
        },
      });
  }

  openStatusChange(a: Asset) {
    this.showStatusModal.set(a);
    this.newStatus.set(a.status);
  }

  submitStatusChange() {
    const a = this.showStatusModal();
    if (!a) return;
    this.statusLoading.set(true);
    this._service.changeStatus(a.id, this.newStatus()).subscribe({
      next: (updated) => {
        this.assets.update((l) => l.map((x) => (x.id === updated.id ? updated : x)));
        this.showStatusModal.set(null);
        this.statusLoading.set(false);
        this.showSuccess('Estado actualizado.');
      },
      error: () => {
        this.statusLoading.set(false);
      },
    });
  }

  confirmRemove(a: Asset) {
    this.confirmDialog.set({
      message: `¿Eliminar el activo "${a.name}" (${a.inventoryCode})?`,
      action: () => {
        this._service.remove(a.id).subscribe({
          next: () => {
            this.assets.update((l) => l.filter((x) => x.id !== a.id));
            this.showSuccess('Activo eliminado.');
          },
          error: () => {},
        });
      },
    });
  }

  runConfirm() {
    this.confirmDialog()?.action();
    this.confirmDialog.set(null);
  }

  statusBadgeClass(s: AssetStatus): string {
    const map: Record<AssetStatus, string> = {
      VIGENTE: 'bg-green-50 text-green-700 border-green-100',
      REQUIERE_ATENCION: 'bg-amber-50 text-amber-700 border-amber-100',
      LIMITADO: 'bg-orange-50 text-orange-700 border-orange-100',
      LEGACY: 'bg-purple-50 text-purple-700 border-purple-100',
      BAJA: 'bg-red-50 text-red-700 border-red-100',
      EN_REPARACION: 'bg-blue-50 text-blue-700 border-blue-100',
      EN_ALMACEN: 'bg-slate-100 text-slate-600 border-slate-200',
    };
    return map[s] ?? 'bg-slate-100 text-slate-600 border-slate-200';
  }

  private showSuccess(msg: string) {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 3500);
  }
}
