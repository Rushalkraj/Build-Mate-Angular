import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component'; 

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        HeaderComponent,
        NavigationComponent,
        MainContentComponent,
        ChatbotComponent
    ],
    template: `
    <div class="app-container">
      <app-header></app-header>
      <div class="app-body">
        <app-navigation></app-navigation>
        <app-main-content></app-main-content>
      </div>
      <app-chatbot></app-chatbot>
    </div>
  `,
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'Build Mate';
}