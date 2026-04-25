import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module.js';
import { SocetchatModule } from './socetchat/socetchat.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [ChatModule, SocetchatModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
