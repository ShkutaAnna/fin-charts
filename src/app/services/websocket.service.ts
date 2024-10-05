import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {
    private socket: WebSocket | null = null;
    private messageSubject: Subject<any> = new Subject<any>();

    constructor() {}

    public connect(url: string, token: string | null, messageOnOpen: any): void {
        if (!token) return;

        const fullUrl = `${url}?token=${token}`;
        this.socket = new WebSocket(fullUrl);

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.messageSubject.next(data);
        };

        this.socket.onopen = () => {
            console.log('WebSocket connection established.');
            this.sendMessage(messageOnOpen);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.socket.onclose = (event) => {
            console.log('WebSocket connection closed. ', event);
        };
    }

    public sendMessage(message: any): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not open. Message not sent.');
        }
    }

    public close(): void {
        this.socket?.close();
    }

    public get messages$() {
        return this.messageSubject.asObservable();
    }
}
