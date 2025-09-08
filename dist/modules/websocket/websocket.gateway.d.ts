import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
export declare class TradingWebSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    server: Server;
    private readonly logger;
    private connectedClients;
    private clientSubscriptions;
    constructor(jwtService: JwtService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleSubscribeTrade(client: Socket, data: {
        symbol: string;
    }): void;
    handleSubscribeOrderBook(client: Socket, data: {
        symbol: string;
    }): void;
    handleSubscribeOrderExecution(client: Socket): void;
    handleSubscribeBalance(client: Socket): void;
    handleUnsubscribe(client: Socket, data: {
        channel: string;
        symbol?: string;
    }): void;
    handleSendOrder(client: Socket, order: any): void;
    handleCancelOrder(client: Socket, data: {
        orderId: string;
    }): void;
    handlePing(client: Socket): void;
    private broadcastToSubscribers;
    private broadcastToAll;
    private getSubscriptionKey;
    sendToUser(userId: string, event: string, data: any): void;
    sendNotification(userId: string, notification: any): void;
    broadcastNotification(userIds: string[], notification: any): void;
    getConnectedClientsCount(): number;
    getUserSubscriptions(userId: string): string[];
}
