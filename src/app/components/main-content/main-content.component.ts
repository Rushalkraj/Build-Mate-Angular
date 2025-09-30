import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="main-content">
      <div class="content-grid">
        <div class="module-section">
          <h2 class="section-title">ORDREOPPGAVER</h2>
          <ul class="module-list">
            <li><a href="#" class="module-link">Reg./vedlikehold tilbud/ordre</a></li>
            <li><a href="#" class="module-link">Eksterne ordre</a></li>
            <li><a href="#" class="module-link">Tilbudsoppfølging</a></li>
            <li><a href="#" class="module-link">Ordreoppfølging</a></li>
            <li><a href="#" class="module-link">Utskrift av kontroll</a></li>
            <li><a href="#" class="module-link">Utskrift Ordreinngang</a></li>
            <li><a href="#" class="module-link">Utskrift Tilbudsstatistikk</a></li>
            <li><a href="#" class="module-link">Utskrift av leveranseplaneggingsliste</a></li>
          </ul>
        </div>

        <div class="module-section">
          <h2 class="section-title">FAKTURAOPPGAVER</h2>
          <ul class="module-list">
            <li><a href="#" class="module-link">Omkjøring av faktura-bunt</a></li>
            <li><a href="#" class="module-link">Utskrift av faktura-journal</a></li>
            <li><a href="#" class="module-link">Utskrift av faktura-kopi</a></li>
            <li><a href="#" class="module-link">Behandle kort fakturaer</a></li>
            <li><a href="#" class="module-link">Betalle kort bonger</a></li>
            <li><a href="#" class="module-link">Generere utgående fakturfiler</a></li>
            <li><a href="#" class="module-link">Overføring til økonomi</a></li>
          </ul>
        </div>

        <div class="module-section">
          <h2 class="section-title">SPØRRING</h2>
          <ul class="module-list">
            <li><a href="#" class="module-link">Fakturaregister</a></li>
            <li><a href="#" class="module-link">Vare/pris</a></li>
            <li><a href="#" class="module-link">Statistikk</a></li>
            <li><a href="#" class="module-link">Ikke-bekreftede bestillinger</a></li>
            <li><a href="#" class="module-link">Restede ordre til levering</a></li>
          </ul>
        </div>

        <div class="module-section">
          <h2 class="section-title">VEDLIKEHOLD</h2>
          <ul class="module-list">
            <li><a href="#" class="module-link">Kunder</a></li>
            <li><a href="#" class="module-link">Kundeprosjekt</a></li>
            <li><a href="#" class="module-link">Leverandører</a></li>
            <li><a href="#" class="module-link">Varer</a></li>
          </ul>
        </div>
      </div>



      <div class="logo-section">
        <div class="company-logo">
          <img src="assets/logo.png" alt="Company Logo" class="logo-image">
        </div>
        <div class="slogan">
          <h3>Let's go further</h3>
        </div>
        <div class="action-buttons">
          <button class="btn btn-warning">Tilbake</button>
          <button class="btn btn-success">OK</button>
        </div>
      </div>
    </main>
  `,
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent { }