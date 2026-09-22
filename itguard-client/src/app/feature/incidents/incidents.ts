import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { IncidentsService, Incident, IncidentStatus, IncidentPriority } from './incidents.service';

interface IncForm {
  ticketNumber: string;
  type: string;
  description: string;
  priority: IncidentPriority;
}
interface UpdateForm {
  type: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  description: string;
  diagnosis: string;
  solution: string;
}
interface ConfirmDialog {
  message: string;
  action: () => void;
}

@Component({
  selector: 'app-incidents',
  imports: [FormsModule, NgClass],
  templateUrl: './incidents.html',
})
export default class Incidents implements OnInit {
  private _svc = inject(IncidentsService);
  items = signal<Incident[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  searchTerm = signal('');
  statusFilter = signal<IncidentStatus | 'all'>('all');
  priorityFilter = signal<IncidentPriority | 'all'>('all');
  confirmDialog = signal<ConfirmDialog | null>(null);
  showCreateModal = signal(false);
  editingItem = signal<Incident | null>(null);
  createForm = signal<IncForm>({ ticketNumber: '', type: '', description: '', priority: 'MEDIA' });
  editForm = signal<UpdateForm>({
    type: '',
    priority: 'MEDIA',
    status: 'ABIERTO',
    description: '',
    diagnosis: '',
    solution: '',
  });
  createLoading = signal(false);
  editLoading = signal(false);
  closeLoading = signal(false);
  createError = signal<string | null>(null);

  readonly allStatuses: IncidentStatus[] = [
    'ABIERTO',
    'EN_REVISION',
    'EN_ESPERA',
    'RESUELTO',
    'CERRADO',
  ];
  readonly allPriorities: IncidentPriority[] = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'];
  readonly statusLabels: Record<IncidentStatus, string> = {
    ABIERTO: 'Abierto',
    EN_REVISION: 'En revisión',
    EN_ESPERA: 'En espera',
    RESUELTO: 'Resuelto',
    CERRADO: 'Cerrado',
  };
  readonly priorityLabels: Record<IncidentPriority, string> = {
    BAJA: 'Baja',
    MEDIA: 'Media',
    ALTA: 'Alta',
    CRITICA: 'Crítica',
  };
  readonly statusColors: Record<IncidentStatus, string> = {
    ABIERTO: 'bg-red-50 text-red-700 border-red-100',
    EN_REVISION: 'bg-amber-50 text-amber-700 border-amber-100',
    EN_ESPERA: 'bg-orange-50 text-orange-700 border-orange-100',
    RESUELTO: 'bg-blue-50 text-blue-700 border-blue-100',
    CERRADO: 'bg-slate-100 text-slate-500 border-slate-200',
  };
  readonly priorityColors: Record<IncidentPriority, string> = {
    BAJA: 'bg-slate-100 text-slate-500',
    MEDIA: 'bg-amber-50 text-amber-700',
    ALTA: 'bg-orange-50 text-orange-700',
    CRITICA: 'bg-red-50 text-red-700 font-semibold',
  };

  readonly filtered = computed(() => {
    const t = this.searchTerm().toLowerCase();
    const sf = this.statusFilter();
    const pf = this.priorityFilter();
    return this.items().filter((i) => {
      const m =
        !t ||
        i.ticketNumber.toLowerCase().includes(t) ||
        i.type.toLowerCase().includes(t) ||
        i.description.toLowerCase().includes(t);
      return m && (sf === 'all' || i.status === sf) && (pf === 'all' || i.priority === pf);
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
        this.error.set('No se pudieron cargar los incidentes.');
        this.isLoading.set(false);
      },
    });
  }
  openCreate() {
    this.createForm.set({
      ticketNumber: `TKT-${Date.now()}`,
      type: '',
      description: '',
      priority: 'MEDIA',
    });
    this.createError.set(null);
    this.showCreateModal.set(true);
  }
  submitCreate() {
    const f = this.createForm();
    if (!f.ticketNumber || !f.type || !f.description) {
      this.createError.set('Ticket, tipo y descripción son obligatorios.');
      return;
    }
    this.createLoading.set(true);
    this.createError.set(null);
    this._svc
      .create({
        ticketNumber: f.ticketNumber,
        type: f.type,
        description: f.description,
        priority: f.priority,
      })
      .subscribe({
        next: (created) => {
          this.items.update((l) => [created, ...l]);
          this.showCreateModal.set(false);
          this.createLoading.set(false);
          this.showSuccess('Incidente creado.');
        },
        error: (err) => {
          this.createLoading.set(false);
          this.createError.set((err as any)?.error?.message ?? 'Error al crear incidente.');
        },
      });
  }
  openEdit(item: Incident) {
    this.editingItem.set(item);
    this.editForm.set({
      type: item.type,
      priority: item.priority,
      status: item.status,
      description: item.description,
      diagnosis: item.diagnosis ?? '',
      solution: item.solution ?? '',
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
        priority: f.priority,
        status: f.status,
        description: f.description,
        diagnosis: f.diagnosis || undefined,
        solution: f.solution || undefined,
      })
      .subscribe({
        next: (updated) => {
          this.items.update((l) => l.map((x) => (x.id === updated.id ? updated : x)));
          this.editingItem.set(null);
          this.editLoading.set(false);
          this.showSuccess('Incidente actualizado.');
        },
        error: () => {
          this.editLoading.set(false);
        },
      });
  }
  closeIncident(item: Incident) {
    this.confirmDialog.set({
      message: `¿Cerrar el incidente ${item.ticketNumber}? Se registrará la fecha de cierre.`,
      action: () => {
        this._svc.close(item.id).subscribe({
          next: (updated) => {
            this.items.update((l) => l.map((x) => (x.id === updated.id ? updated : x)));
            this.showSuccess('Incidente cerrado.');
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
