import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    template: `
    <header class="header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo">
            <img src="assets/logo.png" alt="Company Logo" class="logo-image">
          </div>
        </div>
        
        <nav class="top-nav">
          <a href="#" class="nav-link active">SIGNOFF</a>
          <a href="#" class="nav-link">ØKONOMI</a>
          <a href="#" class="nav-link highlighted">ORDRE/FAKTURA</a>
          <a href="#" class="nav-link">BUTIKK</a>
          <a href="#" class="nav-link">LAGER/INNKJØP</a>
          <a href="#" class="nav-link">VAREADMINISTRASJON</a>
        </nav>
        
        <div class="header-actions">
          <button class="search-btn">
            <i class="fas fa-search"></i>
          </button>
          <div class="economics-info">
            <span class="economics-label">ØKONOMIRUTINER</span>
          </div>
        </div>
      </div>
    </header>
  `,
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent { }