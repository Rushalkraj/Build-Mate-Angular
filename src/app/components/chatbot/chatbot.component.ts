import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating chatbot button -->
    <div class="chatbot-button" [class.hidden]="isPanelOpen" (click)="togglePanel()">
      <i class="fas fa-comments"></i>
      <div class="notification-badge" *ngIf="hasNewMessages && !isPanelOpen">1</div>
    </div>

    <!-- Dimmed/blurred background overlay -->
    <div class="chatbot-overlay" [class.visible]="isPanelOpen" (click)="togglePanel()"></div>

    <!-- Chatbot floating panel -->
    <div class="chatbot-panel"
         [class.open]="isPanelOpen"
         [class.fullscreen]="isFullScreen"
         [ngStyle]="{width: isFullScreen ? '100vw' : panelWidth + 'px', height: isFullScreen ? '100vh' : 'auto'}"
         [style.bottom]="isPanelOpen && !isFullScreen ? '2rem' : '0'"
         [style.right]="isPanelOpen && !isFullScreen ? '2rem' : '0'">
      <div class="panel-header">
        <div class="header-content">
          <img src="assets/logo.png" alt="Bot Avatar" class="bot-avatar" />
          <h3>Build Mate</h3>
        </div>
        <div class="header-actions">
          <!-- <button class="menu-btn" aria-label="Menu">
            <i class="fas fa-ellipsis-v"></i>
          </button> -->
          <button class="fullscreen-btn" (click)="toggleFullScreen()" [attr.aria-label]="isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'">
            <i class="fas" [ngClass]="isFullScreen ? 'fa-compress' : 'fa-expand'"></i>
          </button>
           <button class="action-btn" (click)="clearChat()" title="Clear conversation">
            <i class="fas fa-sync"></i>
          </button>
          <button class="close-btn" (click)="togglePanel()" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="messages-container" #messagesContainer>
        <div class="message"
             *ngFor="let message of messages; let i = index"
             [class.user-message]="message.isUser"
             [class.bot-message]="!message.isUser">
          <div class="message-avatar">
            <i [class]="message.isUser ? 'fas fa-user' : 'fas fa-robot'"></i>
          </div>
          <div class="message-content">
            <div class="message-text">
              <ng-container *ngIf="expandedMessages.has(i); else previewBlock">
                {{ message.text }}
                <a class="see-link" (click)="toggleExpand(i)">See Less</a>
              </ng-container>
              <ng-template #previewBlock>
                {{ getPreviewLines(message.text) }}
                <ng-container *ngIf="isExpandable(message.text)">
                  ... <a class="see-link" (click)="toggleExpand(i)">See More</a>
                </ng-container>
              </ng-template>
            </div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>

        <!-- Typing indicator -->
        <div class="typing-indicator-row" *ngIf="isTyping">
          <div class="message bot-message">
            <div class="message-avatar">
              <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="typing-label">Build Mate is typing…</div>
            </div>
          </div>
        </div>
        <!-- Quick Actions -->
        <div class="quick-actions">
          <button class="quick-action-btn" (click)="sendQuickAction('View Orders')">
            <i class="fas fa-list"></i> View Orders
          </button>
          <button class="quick-action-btn" (click)="sendQuickAction('Check Status')">
            <i class="fas fa-tasks"></i> Check Status
          </button>
          <button class="quick-action-btn" (click)="sendQuickAction('Get Help')">
            <i class="fas fa-question-circle"></i> Get Help
          </button>
        </div>
      </div>

      <div class="input-container">
        <div class="input-wrapper">
          <input
            type="text"
            [(ngModel)]="currentMessage"
            (keyup.enter)="handleEnterKey()"
            placeholder="Type your message…"
            class="message-input"
            [disabled]="isTyping"
            #messageInput>
          <button
            class="send-button"
            (click)="sendMessage()"
            [disabled]="!currentMessage.trim() || isTyping">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        <div class="input-actions">
          <!-- <button class="action-btn" (click)="clearChat()" title="Clear conversation">
            <i class="fas fa-trash"></i>
          </button> -->
        </div>
      </div>
      <!-- Resize handle -->
      <div class="resize-handle" *ngIf="!isFullScreen" (mousedown)="startResizing($event)" (touchstart)="startResizing($event)"></div>
    </div>
  `,
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, OnDestroy, AfterViewChecked {
  expandedMessages: Set<number> = new Set();

  getPreviewLines(text: string, maxLines: number = 4): string {
    const lines = text.split(/\r?\n/);
    return lines.slice(0, maxLines).join('\n');
  }

  isExpandable(text: string, maxLines: number = 4): boolean {
    return text.split(/\r?\n/).length > maxLines;
  }

  toggleExpand(idx: number): void {
    if (this.expandedMessages.has(idx)) {
      this.expandedMessages.delete(idx);
    } else {
      this.expandedMessages.add(idx);
    }
  }
  sendQuickAction(prompt: string): void {
    if (!this.isTyping) {
      this.chatService.sendMessage(prompt);
    }
  }
  isFullScreen = false;
  toggleFullScreen(): void {
    this.isFullScreen = !this.isFullScreen;
  }
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  panelWidth = 400;
  resizing = false;
  lastX = 0;

  // Responsive UI variables
  fontSize = 14;
  bubblePadding = '0.75rem 1rem';
  bubbleSpacing = '1rem';

  isPanelOpen = false;
  currentMessage = '';
  messages: ChatMessage[] = [];
  isTyping = false;
  hasNewMessages = false;

  private messagesSubscription?: Subscription;
  private typingSubscription?: Subscription;
  private shouldScrollToBottom = false;

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    window.addEventListener('mousemove', this.onResizing.bind(this));
    window.addEventListener('mouseup', this.stopResizing.bind(this));
    window.addEventListener('touchmove', this.onResizing.bind(this));
    window.addEventListener('touchend', this.stopResizing.bind(this));

    this.updateResponsiveStyles();

    this.messagesSubscription = this.chatService.messages$.subscribe(messages => {
      const hadMessages = this.messages.length > 0;
      this.messages = messages;
      if (hadMessages && messages.length > this.messages.length && !this.isPanelOpen) {
        this.hasNewMessages = true;
      }
      this.shouldScrollToBottom = true;
    });

    this.typingSubscription = this.chatService.isTyping$.subscribe(typing => {
      this.isTyping = typing;
      if (typing) {
        this.shouldScrollToBottom = true;
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }


  ngOnDestroy(): void {
    this.messagesSubscription?.unsubscribe();
    this.typingSubscription?.unsubscribe();
    window.removeEventListener('mousemove', this.onResizing.bind(this));
    window.removeEventListener('mouseup', this.stopResizing.bind(this));
    window.removeEventListener('touchmove', this.onResizing.bind(this));
    window.removeEventListener('touchend', this.stopResizing.bind(this));
  }

  startResizing(event: MouseEvent | TouchEvent): void {
    this.resizing = true;
    if (event instanceof MouseEvent) {
      this.lastX = event.clientX;
    } else if (event.touches && event.touches.length > 0) {
      this.lastX = event.touches[0].clientX;
    }
    event.preventDefault();
    event.stopPropagation();
  }

  onResizing(event: MouseEvent | TouchEvent): void {
    if (!this.resizing) return;
    let clientX = 0;
    if (event instanceof MouseEvent) {
      clientX = event.clientX;
    } else if (event.touches && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
    }
    const deltaX = this.lastX - clientX;
    this.lastX = clientX;
    this.panelWidth = Math.max(300, Math.min(2000, this.panelWidth + deltaX));
    this.updateResponsiveStyles();
  }

  stopResizing(): void {
    this.resizing = false;
  }

  togglePanel(): void {
    this.isPanelOpen = !this.isPanelOpen;
    if (this.isPanelOpen) {
      this.hasNewMessages = false;
      setTimeout(() => {
        this.messageInput?.nativeElement?.focus();
      }, 300);
      this.updateResponsiveStyles();
    }
  }

  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isTyping) {
      return;
    }

    this.chatService.sendMessage(this.currentMessage);
    this.currentMessage = '';
  }

  handleEnterKey(): void {
    this.sendMessage();
  }

  clearChat(): void {
    this.chatService.clearMessages();
  }

  formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  updateResponsiveStyles(): void {
    // Responsive logic: adjust font, padding, spacing based on panelWidth
    if (this.panelWidth < 350) {
      this.fontSize = 12;
      this.bubblePadding = '0.5rem 0.75rem';
      this.bubbleSpacing = '0.5rem';
    } else if (this.panelWidth < 500) {
      this.fontSize = 14;
      this.bubblePadding = '0.75rem 1rem';
      this.bubbleSpacing = '1rem';
    } else if (this.panelWidth < 700) {
      this.fontSize = 16;
      this.bubblePadding = '1rem 1.25rem';
      this.bubbleSpacing = '1.25rem';
    } else {
      this.fontSize = 18;
      this.bubblePadding = '1.25rem 1.5rem';
      this.bubbleSpacing = '1.5rem';
    }
    // Update CSS variables for SCSS
    const panel = document.querySelector('.chatbot-panel') as HTMLElement;
    if (panel) {
      panel.style.setProperty('--chatbot-font-size', `${this.fontSize}px`);
      panel.style.setProperty('--chatbot-bubble-padding', this.bubblePadding);
      panel.style.setProperty('--chatbot-bubble-spacing', this.bubbleSpacing);
    }
  }
}

