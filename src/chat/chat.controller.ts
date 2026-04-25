import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatService } from './chat.service.js';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Post()
  findall(@Body() body: { name: string }) {
    return this.chatService.findAll(body.name);
  }

  @Post('create')
  create(@Body() body: { name: string, creatorNick: string }) {
    return this.chatService.create(body);
  }

  @Post('find')
  findChatById(@Body() body: { id: string }) {
    return this.chatService.findChatById(body.id);
  }

  @Post('users_chat')
  userr(@Body() data: { room_id: string }) {
    return this.chatService.users_is_chat(data.room_id)
  }

  @Post('add_user_chat')
  add_user_chats(@Body() data: { room_id: string, id: string }) {
    return this.chatService.add_asers_chat(data.id, data.room_id)
  }

  @Post('delete_user_chat')
  delete_user_chats(@Body() data: { room_id: string, id: string }) {
    return this.chatService.delete_users_chat(data.id, data.room_id)
  }
}
