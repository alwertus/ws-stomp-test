import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.socket = null;
        this.stompClient = null;
    }

    connect(onConnected, onError, cookie) {
        this.socket = new SockJS('http://localhost:8101/tr-archive-notification-service/ws');
        // this.socket = new SockJS('http://192.168.34.26:8101/tr-archive-notification-service/ws');
        let headers = {
            'Cookie': cookie
        };
        this.stompClient = new Client({
            webSocketFactory: () => this.socket,
            debug: (str) => {
                console.log(new Date(), str);
            },
            connectHeaders: headers,
            onConnect: onConnected,
            onStompError: onError,
        });

        this.stompClient.activate();
    }

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.deactivate();
        }
    }

    subscribe(topic, callback) {
        if (this.stompClient && this.stompClient.connected) {
            return this.stompClient.subscribe(topic, (message) => {
                callback(JSON.parse(message.body));
            });
        }
    }

    sendMessage(destination, body) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.publish({ destination: destination, body: JSON.stringify(body) });
        }
    }
}

const webSocketService = new WebSocketService();
export default webSocketService;