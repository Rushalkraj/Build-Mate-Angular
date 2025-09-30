import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ChatMessage {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
    public messages$ = this.messagesSubject.asObservable();

    private isTypingSubject = new BehaviorSubject<boolean>(false);
    public isTyping$ = this.isTypingSubject.asObservable();

    constructor(private http: HttpClient) {
        // Add initial welcome message
        this.addMessage("Hello! I'm here to help you with your ERP system. How can I assist you today?", false);
    }

    sendMessage(text: string): Observable<any> {
        // Add user message
        this.addMessage(text, true);

        // Set typing indicator
        this.isTypingSubject.next(true);

        // Make actual API call to the backend
        const apiCall = this.http.post<any>('http://localhost:3000/api/chat', { message: text });

        // Handle the real API response
        apiCall.subscribe({
            next: (response) => {
                this.isTypingSubject.next(false);
                if (response.success) {
                    this.addMessage(response.response, false);
                } else {
                    this.addMessage("Sorry, I encountered an error. Please try again.", false);
                }
            },
            error: (error) => {
                this.isTypingSubject.next(false);
                console.error('Chat API error:', error);
                // Fallback to mock response if API fails
                this.addMessage(this.generateMockResponse(text), false);
            }
        });

        return apiCall;
    }

    private addMessage(text: string, isUser: boolean): void {
        const message: ChatMessage = {
            id: this.generateId(),
            text,
            isUser,
            timestamp: new Date()
        };

        const currentMessages = this.messagesSubject.value;
        this.messagesSubject.next([...currentMessages, message]);
    }

    private generateMockResponse(userMessage: string): string {
        const responses = [
            "I understand you're asking about " + userMessage.toLowerCase() + ". Let me help you with that.",
            "That's a great question about the ERP system. Here's what I can tell you...",
            "I see you need assistance with " + userMessage.toLowerCase() + ". I'll provide some guidance.",
            "Based on your query, I can help you navigate the system more efficiently.",
            "Thank you for your question. Here's the information you need about " + userMessage.toLowerCase(),
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    clearMessages(): void {
        this.messagesSubject.next([]);
        this.addMessage("Conversation cleared. How can I help you?", false);
    }

    getMessages(): ChatMessage[] {
        return this.messagesSubject.value;
    }
}