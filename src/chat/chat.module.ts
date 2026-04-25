import { Module } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { ChatController } from './chat.controller.js';
import { PrismaService } from '../prisma.js';

@Module({
  controllers: [ChatController],
  providers: [ChatService,PrismaService],
})
export class ChatModule {}
