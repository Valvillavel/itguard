import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Sidebar from './components/sidebar/sidebar';
import Topbar from './components/topbar/topbar';

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet, Sidebar, Topbar],
  templateUrl: './shell.html',
})
export default class Shell {
  sidebarOpen = signal(false);
  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }
}
