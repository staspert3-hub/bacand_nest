import { Module } from '@nestjs/common';
import { SocetchatService } from './socetchat.service.js';
import { SocetchatGateway } from './socetchat.gateway.js';
import { PrismaService } from '../prisma.js';

@Module({
  providers: [SocetchatGateway, SocetchatService, PrismaService],
})
export class SocetchatModule {}
