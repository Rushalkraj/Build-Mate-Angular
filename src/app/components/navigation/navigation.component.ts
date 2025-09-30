import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-navigation',
    standalone: true,
    imports: [CommonModule],
    template: `
    <nav class="sidebar">
      <div class="sidebar-content">
        <div class="nav-section">
          <div class="nav-item active">
            <span class="nav-label">DAGLIG DRIFT</span>
          </div>
          <ul class="nav-submenu">
            <li><a href="#" class="submenu-item">PRISER - RABATT - BONUS</a></li>
            <li><a href="#" class="submenu-item">VAREMOTTAK - ETIKETTER - KJØREKONTOR</a></li>
            <li><a href="#" class="submenu-item">VEDLIKEHOLD</a></li>
            <li><a href="#" class="submenu-item">DIVERSE OPPGAVER</a></li>
            <li><a href="#" class="submenu-item">SALGSSTATISTIKK</a></li>
          </ul>
        </div>
      </div>
    </nav>
  `,
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent { }