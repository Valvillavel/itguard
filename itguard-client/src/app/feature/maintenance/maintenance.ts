import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import {
  MaintenanceService,
  MaintenanceRecord,
  MaintenanceStatus,
  MaintenanceType,
} from './maintenance.service';

interface MaintForm {
  assetId: string;
  type: MaintenanceType;
  date: string;
  description: string;
  technician: string;
}
interface EditMaintForm {
  type: MaintenanceType;
  status: MaintenanceStatus;
  date: string;
  description: string;
  diagnosis: string;
  workDone: string;
  technician: string;
  result: string;
  observations: string;
}
interface ConfirmDialog {
  message: string;
  action: () => void;
}

@Component({
  selector: 'app-maintenance',
  imports: [FormsModule, NgClass],
  templateUrl: './maintenance.html',
})
export default class Maintenance implements OnInit {
  private _svc = inject(MaintenanceService);
  items = signal<MaintenanceRecord[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  searchTerm = signal('');
  statusFilter = signal<MaintenanceStatus | 'all'>('all');
  typeFilter = signal<MaintenanceType | 'all'>('all');
  confirmDialog = signal<ConfirmDialog | null>(null);
  showCreateModal = signal(false);
  editingItem = signal<MaintenanceRecord | null>(null);
  createForm = signal<MaintForm>({
    assetId: '',
    type: 'PREVENTIVO',
    date: '',
    description: '',
    technician: '',
  });
  editForm = signal<EditMaintForm>({
    type: 'PREVENTIVO',
    status: 'PENDIENTE',
    date: '',
    description: '',
    diagnosis: '',
    workDone: '',
    technician: '',
    result: '',
    observations: '',
  });
  createLoading = signal(false);
  editLoading = signal(false);
  createError = signal<string | null>(null);

  readonly allTypes: MaintenanceType[] = [
    'PREVENTIVO',
    'CORRECTIVO',
    'ACTUALIZACION',
    'REEMPLAZO',
    'LIMPIEZA',
    'DIAGNOSTICO',
  ];
  readonly allStatuses: MaintenanceStatus[] = [
    'PENDIENTE',
    'EN_PROCESO',
    'COMPLETADO',
    'CANCELADO',
  ];
  readonly typeLabels: Record<MaintenanceType, string> = {
    PREVENTIVO: 'Preventivo',
    CORRECTIVO: 'Correctivo',
    ACTUALIZACION: 'Actualización',
    REEMPLAZO: 'Reemplazo',
    LIMPIEZA: 'Limpieza',
    DIAGNOSTICO: 'Diagnóstico',
  };
  readonly statusLabels: Record<MaintenanceStatus, string> = {
    PENDIENTE: 'Pendiente',
    EN_PROCESO: 'En proceso',
    COMPLETADO: 'Completado',
    CANCELADO: 'Cancelado',
  };
  readonly statusColors: Record<MaintenanceStatus, string> = {
    PENDIENTE: 'bg-amber-50 text-amber-700 border-amber-100',
    EN_PROCESO: 'bg-blue-50 text-blue-700 border-blue-100',
    COMPLETADO: 'bg-green-50 text-green-700 border-green-100',
    CANCELADO: 'bg-slate-100 text-slate-500 border-slate-200',
  };

  readonly filtered = computed(() => {
    const t = this.searchTerm().toLowerCase();
    const sf = this.statusFilter();
    const tf = this.typeFilter();
    return this.items().filter((i) => {
      const m =
        !t ||
        (i.asset?.name.toLowerCase().includes(t) ?? false) ||
        (i.asset?.inventoryCode.toLowerCase().includes(t) ?? false) ||
        (i.technician?.toLowerCase().includes(t) ?? false);
      return m && (sf === 'all' || i.status === sf) && (tf === 'all' || i.type === tf);
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
        this.error.set('No se pudieron cargar los mantenimientos.');
        this.isLoading.set(false);
      },
    });
  }
  openCreate() {
    const today = new Date().toISOString().substring(0, 10);
    this.createForm.set({
      assetId: '',
      type: 'PREVENTIVO',
      date: today,
      description: '',
      technician: '',
    });
    this.createError.set(null);
    this.showCreateModal.set(true);
  }
  submitCreate() {
    const f = this.createForm();
    if (!f.assetId || !f.date) {
      this.createError.set('Activo y fecha son obligatorios.');
      return;
    }
    this.createLoading.set(true);
    this.createError.set(null);
    this._svc
      .create({
        assetId: Number(f.assetId),
        type: f.type,
        date: f.date,
        description: f.description || undefined,
        technician: f.technician || undefined,
      })
      .subscribe({
        next: (created) => {
          this.items.update((l) => [created, ...l]);
          this.showCreateModal.set(false);
          this.createLoading.set(false);
          this.showSuccess('Mantenimiento registrado.');
        },
        error: (err) => {
          this.createLoading.set(false);
          this.createError.set((err as any)?.error?.message ?? 'Error al crear.');
        },
      });
  }
  openEdit(item: MaintenanceRecord) {
    this.editingItem.set(item);
    this.editForm.set({
      type: item.type,
      status: item.status,
      date: item.date.substring(0, 10),
      description: item.description ?? '',
      diagnosis: item.diagnosis ?? '',
      workDone: item.workDone ?? '',
      technician: item.technician ?? '',
      result: item.result ?? '',
      observations: item.observations ?? '',
    });
  }
  submitEdit() {
    const item = this.editingItem();
    const f = this.editForm();
    if (!item) return;
    this.editLoading.set(true);
    this._svc
      .update(item.id, {
        type: f.type,
        status: f.status,
        date: f.date,
        description: f.description || undefined,
        diagnosis: f.diagnosis || undefined,
        workDone: f.workDone || undefined,
        technician: f.technician || undefined,
        result: f.result || undefined,
        observations: f.observations || undefined,
      })
      .subscribe({
        next: (updated) => {
          this.items.update((l) => l.map((x) => (x.id === updated.id ? updated : x)));
          this.editingItem.set(null);
          this.editLoading.set(false);
          this.showSuccess('Mantenimiento actualizado.');
        },
        error: () => {
          this.editLoading.set(false);
        },
      });
  }
  confirmRemove(item: MaintenanceRecord) {
    this.confirmDialog.set({
      message: `¿Eliminar este mantenimiento del activo "${item.asset?.name ?? 'ID:' + item.assetId}"?`,
      action: () => {
        this._svc.remove(item.id).subscribe({
          next: () => {
            this.items.update((l) => l.filter((x) => x.id !== item.id));
            this.showSuccess('Eliminado.');
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
