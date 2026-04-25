import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SocetchatService } from './socetchat.service.js';
import { PrismaService } from '../prisma.js';
import { Server, Socket } from 'socket.io';


@WebSocketGateway()
export class SocetchatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly socetchatService: SocetchatService, private readonly prisma: PrismaService) { }
  @WebSocketServer() server!: Server;

  private onlineUsers: Map<string, Set<string>> = new Map();

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected ', client);
  }

  handleDisconnect(client: Socket) {
    this.onlineUsers.forEach((usersSet, chatId) => {
      if (usersSet.has(client.id)) {
        usersSet.delete(client.id);

        // Если пользователей в чате не осталось, удаляем ключ из Map, чтобы не засорять память
        if (usersSet.size === 0) {
          this.onlineUsers.delete(chatId);
        } else {
          // Оповещаем остальных, что человек вышел
          this.server.to(chatId).emit('onlineCount', usersSet.size);
        }
      }
    });
    console.log('Client disconnected');
  }

  @SubscribeMessage('joinChat')
  async handleMessage(client: Socket, payload: { ChatId: string }) {
    console.log('Message received:', payload);
    client.join(payload.ChatId);
    client.emit('joinedChat', { ChatId: payload.ChatId, securoti: true });
    const usersInChat = this.onlineUsers.get(payload.ChatId) || new Set();
    // 2. Добавляем текущего пользователя в Set
    usersInChat.add(client.id);
    // 3. Сохраняем обратно в Map
    this.onlineUsers.set(payload.ChatId, usersInChat);
    this.server.to(payload.ChatId).emit('onlineCount', usersInChat.size);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: { message: string, name: string, chatId: string }) {
    console.log('Message received:', payload);
    try {
      const data = await this.prisma.message.create({
        data: {
          content: payload.message,
          chatId: payload.chatId,
          name: payload.name
        }
      })
      this.server.to(payload.chatId).emit('newMessage', data);
    } catch (error) {
      console.error('Error creating message:', error);
    }
  }
}
