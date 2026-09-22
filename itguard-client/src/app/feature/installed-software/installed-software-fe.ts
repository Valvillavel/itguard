import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InstalledSoftwareFeService, InstalledSoftwareItem } from './installed-software-fe.service';
import { SoftwareService } from '../software/software.service';

interface InstallForm { assetId: string; softwareId: string; version: string; }
interface ConfirmDialog { message: string; action: () => void; }

@Component({
  selector: 'app-installed-software-fe',
  imports: [FormsModule],
  templateUrl: './installed-software-fe.html',
})
export default class InstalledSoftwareFe implements OnInit {
  private _svc = inject(InstalledSoftwareFeService);
  private _swSvc = inject(SoftwareService);
  items = signal<InstalledSoftwareItem[]>([]);
  softwareList = signal<{ id: number; name: string }[]>([]);
  isLoading = signal(true); error = signal<string | null>(null); successMessage = signal<string | null>(null);
  searchTerm = signal('');
  showInstallModal = signal(false); editingItem = signal<InstalledSoftwareItem | null>(null);
  installForm = signal<InstallForm>({ assetId: '', softwareId: '', version: '' });
  editVersion = signal(''); editStatus = signal(''); editLastCheck = signal('');
  installLoading = signal(false); editLoading = signal(false);
  installError = signal<string | null>(null);
  confirmDialog = signal<ConfirmDialog | null>(null);

  readonly filtered = computed(() => {
    const t = this.searchTerm().toLowerCase();
    return this.items().filter(i =>
      !t ||
      (i.software?.name.toLowerCase().includes(t) ?? false) ||
      (i.asset?.name.toLowerCase().includes(t) ?? false) ||
      (i.asset?.inventoryCode.toLowerCase().includes(t) ?? false)
    );
  });

  ngOnInit() { this.load(); this.loadSoftware(); }

  load() {
    this.isLoading.set(true);
    this._svc.getAll().subscribe({
      next: d => { this.items.set(d); this.isLoading.set(false); },
      error: () => { this.error.set('No se pudo cargar el software instalado.'); this.isLoading.set(false); }
    });
  }

  loadSoftware() {
    this._swSvc.getAll().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : (res.data ?? []);
        this.softwareList.set(data.map((s: any) => ({ id: s.id, name: s.name })));
      }
    });
  }

  openInstall() { this.installForm.set({ assetId: '', softwareId: '', version: '' }); this.installError.set(null); this.showInstallModal.set(true); }

  submitInstall() {
    const f = this.installForm();
    if (!f.assetId || !f.softwareId) { this.installError.set('Activo y software son obligatorios.'); return; }
    this.installLoading.set(true); this.installError.set(null);
    this._svc.create({ assetId: Number(f.assetId), softwareId: Number(f.softwareId), version: f.version || undefined }).subscribe({
      next: created => { this.items.update(l => [created, ...l]); this.showInstallModal.set(false); this.installLoading.set(false); this.showSuccess('Software instalado correctamente.'); },
      error: err => { this.installLoading.set(false); this.installError.set((err as any)?.error?.message ?? 'Error al instalar software.'); }
    });
  }

  openEdit(item: InstalledSoftwareItem) { this.editingItem.set(item); this.editVersion.set(item.version ?? ''); this.editStatus.set(item.status ?? ''); this.editLastCheck.set(item.lastCheck ? item.lastCheck.substring(0, 10) : ''); }

  submitEdit() {
    const item = this.editingItem(); if (!item) return;
    this.editLoading.set(true);
    this._svc.update(item.id, { version: this.editVersion() || undefined, status: this.editStatus() || undefined, lastCheck: this.editLastCheck() || undefined }).subscribe({
      next: updated => { this.items.update(l => l.map(x => x.id === updated.id ? updated : x)); this.editingItem.set(null); this.editLoading.set(false); this.showSuccess('Software actualizado.'); },
      error: () => { this.editLoading.set(false); }
    });
  }

  confirmUninstall(item: InstalledSoftwareItem) {
    this.confirmDialog.set({ message: `¿Desinstalar "${item.software?.name}" del activo "${item.asset?.name}"?`, action: () => {
      this._svc.remove(item.id).subscribe({ next: () => { this.items.update(l => l.filter(x => x.id !== item.id)); this.showSuccess('Software desinstalado.'); }, error: () => {} });
    }});
  }
  runConfirm() { this.confirmDialog()?.action(); this.confirmDialog.set(null); }
  private showSuccess(msg: string) { this.successMessage.set(msg); setTimeout(() => this.successMessage.set(null), 3500); }
}
