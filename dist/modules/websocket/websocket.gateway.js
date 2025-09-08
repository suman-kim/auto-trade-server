"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradingWebSocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let TradingWebSocketGateway = class TradingWebSocketGateway {
    jwtService;
    server;
    logger = new common_1.Logger(websockets_1.WebSocketGateway.name);
    connectedClients = new Map();
    clientSubscriptions = new Map();
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    afterInit(server) {
        this.logger.log('WebSocket Gateway 초기화 완료');
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                this.logger.warn('토큰이 없는 클라이언트 연결 시도');
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            const userId = payload.sub;
            this.connectedClients.set(userId, client);
            this.clientSubscriptions.set(userId, new Set());
            client.data.userId = userId;
            this.logger.log(`클라이언트 연결: ${userId} (${client.id})`);
            client.emit('connected', {
                message: 'WebSocket 연결 성공',
                userId,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            this.logger.error('클라이언트 연결 처리 오류:', error);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const userId = client.data.userId;
        if (userId) {
            this.connectedClients.delete(userId);
            this.clientSubscriptions.delete(userId);
            this.logger.log(`클라이언트 연결 해제: ${userId} (${client.id})`);
        }
    }
    handleSubscribeTrade(client, data) {
        const userId = client.data.userId;
        if (!userId)
            return;
        const subscriptions = this.clientSubscriptions.get(userId) || new Set();
        subscriptions.add(`trade:${data.symbol}`);
        this.clientSubscriptions.set(userId, subscriptions);
        this.logger.log(`사용자 ${userId}가 ${data.symbol} 체결 데이터 구독`);
        client.emit('subscribed', {
            channel: 'trade',
            symbol: data.symbol,
            timestamp: new Date().toISOString(),
        });
    }
    handleSubscribeOrderBook(client, data) {
        const userId = client.data.userId;
        if (!userId)
            return;
        const subscriptions = this.clientSubscriptions.get(userId) || new Set();
        subscriptions.add(`orderbook:${data.symbol}`);
        this.clientSubscriptions.set(userId, subscriptions);
        this.logger.log(`사용자 ${userId}가 ${data.symbol} 호가 데이터 구독`);
        client.emit('subscribed', {
            channel: 'orderbook',
            symbol: data.symbol,
            timestamp: new Date().toISOString(),
        });
    }
    handleSubscribeOrderExecution(client) {
        const userId = client.data.userId;
        if (!userId)
            return;
        const subscriptions = this.clientSubscriptions.get(userId) || new Set();
        subscriptions.add('orderExecution');
        this.clientSubscriptions.set(userId, subscriptions);
        this.logger.log(`사용자 ${userId}가 주문 체결 데이터 구독`);
        client.emit('subscribed', {
            channel: 'orderExecution',
            timestamp: new Date().toISOString(),
        });
    }
    handleSubscribeBalance(client) {
        const userId = client.data.userId;
        if (!userId)
            return;
        const subscriptions = this.clientSubscriptions.get(userId) || new Set();
        subscriptions.add('balance');
        this.clientSubscriptions.set(userId, subscriptions);
        this.logger.log(`사용자 ${userId}가 잔고 데이터 구독`);
        client.emit('subscribed', {
            channel: 'balance',
            timestamp: new Date().toISOString(),
        });
    }
    handleUnsubscribe(client, data) {
        const userId = client.data.userId;
        if (!userId)
            return;
        const subscriptions = this.clientSubscriptions.get(userId);
        if (subscriptions) {
            const subscriptionKey = data.symbol ? `${data.channel}:${data.symbol}` : data.channel;
            subscriptions.delete(subscriptionKey);
            this.logger.log(`사용자 ${userId}가 ${subscriptionKey} 구독 해제`);
            client.emit('unsubscribed', {
                channel: data.channel,
                symbol: data.symbol,
                timestamp: new Date().toISOString(),
            });
        }
    }
    handleSendOrder(client, order) {
        const userId = client.data.userId;
        if (!userId)
            return;
        try {
        }
        catch (error) {
            this.logger.error('주문 전송 오류:', error);
            client.emit('orderError', {
                message: '주문 전송 중 오류가 발생했습니다.',
                timestamp: new Date().toISOString(),
            });
        }
    }
    handleCancelOrder(client, data) {
        const userId = client.data.userId;
        if (!userId)
            return;
        try {
        }
        catch (error) {
            this.logger.error('주문 취소 오류:', error);
            client.emit('orderError', {
                message: '주문 취소 중 오류가 발생했습니다.',
                timestamp: new Date().toISOString(),
            });
        }
    }
    handlePing(client) {
        client.emit('pong', {
            timestamp: new Date().toISOString(),
        });
    }
    broadcastToSubscribers(event, data) {
        const subscriptionKey = this.getSubscriptionKey(event, data);
        this.clientSubscriptions.forEach((subscriptions, userId) => {
            if (subscriptions.has(subscriptionKey)) {
                const client = this.connectedClients.get(userId);
                if (client) {
                    client.emit(event, data);
                }
            }
        });
    }
    broadcastToAll(event, data) {
        this.server.emit(event, data);
    }
    getSubscriptionKey(event, data) {
        switch (event) {
            case 'trade':
            case 'orderbook':
                return `${event}:${data.symbol}`;
            case 'orderExecution':
            case 'balance':
                return event;
            default:
                return event;
        }
    }
    sendToUser(userId, event, data) {
        const client = this.connectedClients.get(userId);
        if (client) {
            client.emit(event, data);
            this.logger.debug(`사용자 ${userId}에게 ${event} 이벤트 전송`);
        }
        else {
            this.logger.debug(`사용자 ${userId}가 연결되어 있지 않음`);
        }
    }
    sendNotification(userId, notification) {
        this.sendToUser(userId, 'notification', {
            id: notification.id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            data: notification.data,
            createdAt: notification.createdAt,
            isRead: notification.isRead,
        });
    }
    broadcastNotification(userIds, notification) {
        userIds.forEach(userId => {
            this.sendNotification(userId, notification);
        });
    }
    getConnectedClientsCount() {
        return this.connectedClients.size;
    }
    getUserSubscriptions(userId) {
        const subscriptions = this.clientSubscriptions.get(userId);
        return subscriptions ? Array.from(subscriptions) : [];
    }
};
exports.TradingWebSocketGateway = TradingWebSocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TradingWebSocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribeTrade'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], TradingWebSocketGateway.prototype, "handleSubscribeTrade", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribeOrderBook'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], TradingWebSocketGateway.prototype, "handleSubscribeOrderBook", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribeOrderExecution'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], TradingWebSocketGateway.prototype, "handleSubscribeOrderExecution", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribeBalance'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], TradingWebSocketGateway.prototype, "handleSubscribeBalance", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsubscribe'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], TradingWebSocketGateway.prototype, "handleUnsubscribe", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendOrder'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], TradingWebSocketGateway.prototype, "handleSendOrder", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('cancelOrder'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], TradingWebSocketGateway.prototype, "handleCancelOrder", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], TradingWebSocketGateway.prototype, "handlePing", null);
exports.TradingWebSocketGateway = TradingWebSocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
        },
        namespace: '/trading',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], TradingWebSocketGateway);
//# sourceMappingURL=websocket.gateway.js.map