import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthStateService } from '../../auth/shared/auth-state.service';
import { DepartmentsService } from './departments.service';
import type { Department } from '../shared/models';

interface ConfirmDialog {
  message: string;
  action: () => void;
}

interface DeptForm {
  name: string;
  description: string;
}

@Component({
  selector: 'app-departments',
  imports: [FormsModule],
  templateUrl: './departments.html',
})
export default class Departments implements OnInit {
  private _departmentsService = inject(DepartmentsService);
  private _authState = inject(AuthStateService);

  readonly userRole = computed(() => this._authState.currentUser()?.role?.name ?? null);

  departments = signal<Department[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  searchTerm = signal('');
  statusFilter = signal<'all' | 'active' | 'inactive'>('all');

  confirmDialog = signal<ConfirmDialog | null>(null);

  showCreateModal = signal(false);
  createForm = signal<DeptForm>({ name: '', description: '' });
  createLoading = signal(false);
  createError = signal<string | null>(null);

  editingDept = signal<Department | null>(null);
  editForm = signal<DeptForm>({ name: '', description: '' });
  editLoading = signal(false);
  editError = signal<string | null>(null);

  readonly filteredDepartments = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const statusF = this.statusFilter();
    return this.departments().filter((d) => {
      const matchesSearch =
        !term ||
        d.name.toLowerCase().includes(term) ||
        (d.description?.toLowerCase().includes(term) ?? false);
      const matchesStatus =
        statusF === 'all' ||
        (statusF === 'active' && d.active) ||
        (statusF === 'inactive' && !d.active);
      return matchesSearch && matchesStatus;
    });
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this._departmentsService.getAll().subscribe({
      next: (data) => {
        this.departments.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los departamentos.');
        this.isLoading.set(false);
      },
    });
  }

  // ── Crear ──────────────────────────────────────────────────────────────────

  openCreate(): void {
    this.createForm.set({ name: '', description: '' });
    this.createError.set(null);
    this.showCreateModal.set(true);
  }

  submitCreate(): void {
    const form = this.createForm();
    if (!form.name.trim()) {
      this.createError.set('El nombre es obligatorio.');
      return;
    }
    if (form.name.trim().length < 2) {
      this.createError.set('El nombre debe tener al menos 2 caracteres.');
      return;
    }
    this.createLoading.set(true);
    this.createError.set(null);
    this._departmentsService
      .create({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
      })
      .subscribe({
        next: (created) => {
          this.departments.update((list) => [created, ...list]);
          this.showCreateModal.set(false);
          this.createLoading.set(false);
          this.showSuccess('Departamento creado correctamente.');
        },
        error: (err) => {
          this.createLoading.set(false);
          const msg = (err as { error?: { message?: string } })?.error?.message;
          this.createError.set(msg ?? 'Error al crear departamento.');
        },
      });
  }

  // ── Editar ─────────────────────────────────────────────────────────────────

  openEdit(dept: Department): void {
    this.editingDept.set(dept);
    this.editForm.set({ name: dept.name, description: dept.description ?? '' });
    this.editError.set(null);
  }

  submitEdit(): void {
    const dept = this.editingDept();
    const form = this.editForm();
    if (!dept) return;
    if (!form.name.trim()) {
      this.editError.set('El nombre es obligatorio.');
      return;
    }
    this.editLoading.set(true);
    this.editError.set(null);
    this._departmentsService
      .update(dept.id, {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
      })
      .subscribe({
        next: (updated) => {
          this.departments.update((list) => list.map((d) => (d.id === updated.id ? updated : d)));
          this.editingDept.set(null);
          this.editLoading.set(false);
          this.showSuccess('Departamento actualizado correctamente.');
        },
        error: (err) => {
          this.editLoading.set(false);
          const msg = (err as { error?: { message?: string } })?.error?.message;
          this.editError.set(msg ?? 'Error al actualizar departamento.');
        },
      });
  }

  // ── Activar / Desactivar ───────────────────────────────────────────────────

  toggleActive(dept: Department): void {
    const action = dept.active ? 'desactivar' : 'activar';
    this.confirmDialog.set({
      message: `¿Está seguro de ${action} el departamento "${dept.name}"?`,
      action: () => {
        const req = dept.active
          ? this._departmentsService.deactivate(dept.id)
          : this._departmentsService.activate(dept.id);
        req.subscribe({
          next: (updated) => {
            this.departments.update((list) => list.map((d) => (d.id === updated.id ? updated : d)));
            this.showSuccess(
              `Departamento ${dept.active ? 'desactivado' : 'activado'} correctamente.`,
            );
          },
          error: () => {
            this.showSuccess('Error al cambiar el estado del departamento.');
          },
        });
      },
    });
  }

  runConfirm(): void {
    this.confirmDialog()?.action();
    this.confirmDialog.set(null);
  }

  // ── Utilidades ─────────────────────────────────────────────────────────────

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  private showSuccess(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 3500);
  }
}
