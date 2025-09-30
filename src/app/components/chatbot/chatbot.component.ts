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

    <!-- Chatbot panel -->
    <div class="chatbot-panel" [class.open]="isPanelOpen">
      <div class="panel-header">
        <div class="header-content">
          <i class="fas fa-robot"></i>
          <h3>ERP Assistant</h3>
        </div>
        <button class="close-btn" (click)="togglePanel()">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="messages-container" #messagesContainer>
        <div class="message" 
             *ngFor="let message of messages" 
             [class.user-message]="message.isUser"
             [class.bot-message]="!message.isUser">
          <div class="message-avatar">
            <i [class]="message.isUser ? 'fas fa-user' : 'fas fa-robot'"></i>
          </div>
          <div class="message-content">
            <div class="message-text">{{ message.text }}</div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>

        <!-- Typing indicator -->
        <div class="message bot-message" *ngIf="isTyping">
          <div class="message-avatar">
            <i class="fas fa-robot"></i>
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="input-container">
        <div class="input-wrapper">
          <input 
            type="text" 
            [(ngModel)]="currentMessage" 
            (keyup.enter)="handleEnterKey()"
            placeholder="Type your message..."
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
          <button class="action-btn" (click)="clearChat()" title="Clear conversation">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay -->
    <div class="chatbot-overlay" 
         [class.visible]="isPanelOpen" 
         (click)="togglePanel()"></div>
  `,
    styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, OnDestroy, AfterViewChecked {
    @ViewChild('messagesContainer') messagesContainer!: ElementRef;
    @ViewChild('messageInput') messageInput!: ElementRef;

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
    }

    togglePanel(): void {
        this.isPanelOpen = !this.isPanelOpen;

        if (this.isPanelOpen) {
            this.hasNewMessages = false;
            setTimeout(() => {
                this.messageInput?.nativeElement?.focus();
            }, 300);
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
}