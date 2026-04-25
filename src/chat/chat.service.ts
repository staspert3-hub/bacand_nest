import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class ChatService {
    constructor(private readonly prisma: PrismaService) { }
    async findAll(name: string) {
        try {
            const data = await this.prisma.chat.findUnique({
                where: { id: name },
                include: { messages: true }
            })
            return data
        } catch (e) {
            console.error(e)
            return { error: 'ошибка при получении данных из бд' }
        }
    }

    async create({ name, creatorNick }: { name: string; creatorNick: string }) {
        try {
            const data = await this.prisma.chat.create({
                data: {
                    name,
                    users: {
                        connect: { username: creatorNick.trim() }
                    }
                },
                select: { id: true, name: true }
            })
            return data
        } catch (e) {
            console.log(e)
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    return {
                        e: 'такого юзера не существует впишите пожайлуста существуещий юзернейм'
                    }
                }
                if (e.code === 'P2002') {
                    return { e: 'чат с таким именем уже существует' }
                }
            }
            return { e: 'неизвестная ошибка' }
        }
    }

    async findChatById(id: string) {
        try {
            const data = await this.prisma.chat.findUnique({
                where: { id },
                select: { id: true, name: true }
            })
            if (!data) throw new Error('такого чата не существует')
            return data
        } catch (e) {
            console.error(e)
            return { error: 'такого чата не существует' }
        }
    }

    async users_is_chat(room_id: string) {
        try {
            const r = await this.prisma.chat.findUnique({
                where: {
                    id: room_id
                },
                select: {
                    users: {
                        select: {
                            username: true,
                            id: true
                        }
                    },
                    id: true
                }
            })
            console.log(r)
            if (!r) throw ('ошибочка')
            return r
        } catch (e) {
            console.error(e)
            return { s: false }
        }
    }

    async add_asers_chat(id: string, room_id: string) {
        try {
            const existingRelation = await this.prisma.chat.findFirst({
                where: {
                    id: room_id,
                    users: {
                        some: {
                            username: id
                        }
                    }
                }
            });

            if (existingRelation) {
                throw new Error('Связь пользователя с чатом уже существует');
            }
            const data = await this.prisma.chat.update({
                where: {
                    id: room_id
                },
                data: {
                    users: {
                        connect: {
                            username: id
                        }
                    }
                }
            })
            const data1 = await this.prisma.users.findUnique({
                where: {
                    username: id
                }
            })
            console.log(data1)
            return data1
        } catch (e) {
            console.log(e)
            return { s: false }
        }
    }

    async delete_users_chat(id: string, room_id: string) {
        try {
            const data = await this.prisma.chat.update({
                where: { id: room_id },
                data: {
                    users: {
                        disconnect: {
                            id
                        }
                    }
                }
            })
            console.log(data)
            return {}
        } catch (e) {
            console.log(e)
            return { s: false }
        }
    }
}
