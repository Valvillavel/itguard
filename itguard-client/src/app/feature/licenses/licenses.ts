import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { LicensesService, License, LicenseStatus } from './licenses.service';

interface LicForm {
  softwareId: string;
  licenseType: string;
  purchasedQuantity: string;
  reference: string;
  expirationDate: string;
  provider: string;
  cost: string;
  observations: string;
}
interface ConfirmDialog {
  message: string;
  action: () => void;
}

@Component({
  selector: 'app-licenses',
  imports: [FormsModule, NgClass],
  templateUrl: './licenses.html',
})
export default class Licenses implements OnInit {
  private _svc = inject(LicensesService);
  items = signal<License[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  searchTerm = signal('');
  statusFilter = signal<LicenseStatus | 'all'>('all');
  confirmDialog = signal<ConfirmDialog | null>(null);
  showCreateModal = signal(false);
  editingItem = signal<License | null>(null);
  createForm = signal<LicForm>({
    softwareId: '',
    licenseType: '',
    purchasedQuantity: '',
    reference: '',
    expirationDate: '',
    provider: '',
    cost: '',
    observations: '',
  });
  editForm = signal<LicForm>({
    softwareId: '',
    licenseType: '',
    purchasedQuantity: '',
    reference: '',
    expirationDate: '',
    provider: '',
    cost: '',
    observations: '',
  });
  createLoading = signal(false);
  editLoading = signal(false);
  createError = signal<string | null>(null);
  editError = signal<string | null>(null);

  readonly allStatuses: LicenseStatus[] = ['ACTIVA', 'VENCIDA', 'SUSPENDIDA', 'DISPONIBLE'];
  readonly statusLabels: Record<LicenseStatus, string> = {
    ACTIVA: 'Activa',
    VENCIDA: 'Vencida',
    SUSPENDIDA: 'Suspendida',
    DISPONIBLE: 'Disponible',
  };
  readonly statusColors: Record<LicenseStatus, string> = {
    ACTIVA: 'bg-green-50 text-green-700 border-green-100',
    VENCIDA: 'bg-red-50 text-red-700 border-red-100',
    SUSPENDIDA: 'bg-amber-50 text-amber-700 border-amber-100',
    DISPONIBLE: 'bg-blue-50 text-blue-700 border-blue-100',
  };

  readonly filtered = computed(() => {
    const t = this.searchTerm().toLowerCase();
    const f = this.statusFilter();
    return this.items().filter((i) => {
      const m =
        !t ||
        i.software?.name.toLowerCase().includes(t) ||
        i.licenseType.toLowerCase().includes(t) ||
        (i.reference?.toLowerCase().includes(t) ?? false) ||
        (i.provider?.toLowerCase().includes(t) ?? false);
      return m && (f === 'all' || i.status === f);
    });
  });

  ngOnInit() {
    this.load();
  }
  load() {
    this.isLoading.set(true);
    this._svc.getAll().subscribe({
      next: (d) => {
        this.items.set(d);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las licencias.');
        this.isLoading.set(false);
      },
    });
  }
  openCreate() {
    this.createForm.set({
      softwareId: '',
      licenseType: '',
      purchasedQuantity: '',
      reference: '',
      expirationDate: '',
      provider: '',
      cost: '',
      observations: '',
    });
    this.createError.set(null);
    this.showCreateModal.set(true);
  }
  submitCreate() {
    const f = this.createForm();
    if (!f.softwareId || !f.licenseType || !f.purchasedQuantity) {
      this.createError.set('Software, tipo y cantidad son obligatorios.');
      return;
    }
    const qty = Number(f.purchasedQuantity);
    if (isNaN(qty) || qty < 0) {
      this.createError.set('La cantidad debe ser un número positivo.');
      return;
    }
    this.createLoading.set(true);
    this.createError.set(null);
    this._svc
      .create({
        softwareId: Number(f.softwareId),
        licenseType: f.licenseType,
        purchasedQuantity: qty,
        reference: f.reference || undefined,
        expirationDate: f.expirationDate || undefined,
        provider: f.provider || undefined,
        cost: f.cost ? Number(f.cost) : undefined,
        observations: f.observations || undefined,
      })
      .subscribe({
        next: (created) => {
          this.items.update((l) => [created, ...l]);
          this.showCreateModal.set(false);
          this.createLoading.set(false);
          this.showSuccess('Licencia creada.');
        },
        error: (err) => {
          this.createLoading.set(false);
          this.createError.set((err as any)?.error?.message ?? 'Error al crear licencia.');
        },
      });
  }
  openEdit(item: License) {
    this.editingItem.set(item);
    this.editForm.set({
      softwareId: String(item.softwareId),
      licenseType: item.licenseType,
      purchasedQuantity: String(item.purchasedQuantity),
      reference: item.reference ?? '',
      expirationDate: item.expirationDate ? item.expirationDate.substring(0, 10) : '',
      provider: item.provider ?? '',
      cost: item.cost ?? '',
      observations: item.observations ?? '',
    });
    this.editError.set(null);
  }
  submitEdit() {
    const item = this.editingItem();
    const f = this.editForm();
    if (!item) return;
    this.editLoading.set(true);
    this.editError.set(null);
    this._svc
      .update(item.id, {
        licenseType: f.licenseType,
        purchasedQuantity: Number(f.purchasedQuantity),
        reference: f.reference || undefined,
        expirationDate: f.expirationDate || undefined,
        provider: f.provider || undefined,
        cost: f.cost ? Number(f.cost) : undefined,
        observations: f.observations || undefined,
      })
      .subscribe({
        next: (updated) => {
          this.items.update((l) => l.map((x) => (x.id === updated.id ? updated : x)));
          this.editingItem.set(null);
          this.editLoading.set(false);
          this.showSuccess('Licencia actualizada.');
        },
        error: (err) => {
          this.editLoading.set(false);
          this.editError.set((err as any)?.error?.message ?? 'Error al actualizar.');
        },
      });
  }
  confirmRemove(item: License) {
    this.confirmDialog.set({
      message: `¿Eliminar la licencia "${item.licenseType}" (${item.software?.name ?? 'ID:' + item.softwareId})?`,
      action: () => {
        this._svc.remove(item.id).subscribe({
          next: () => {
            this.items.update((l) => l.filter((x) => x.id !== item.id));
            this.showSuccess('Licencia eliminada.');
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
  private showSuccess(msg: string) {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 3500);
  }
}
