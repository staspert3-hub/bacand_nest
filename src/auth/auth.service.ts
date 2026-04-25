import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) { }
    // auth.service.ts
    async register_nick(data: { name: string, username: string, email: string, password: string }) {
        console.log('reg_nick', data)
        try {
            const res = await this.prisma.users.create({
                data
            })
            console.log('bd_create', res)
            return {
                s: true
            }
        } catch (er) {
            console.log(er)
            if (er instanceof PrismaClientKnownRequestError) {
                if (er.code === 'P2002') {
                    return {
                        s: false,
                        m: 'такой никнейм или емаил существует'
                    }
                }
            }
            return {
                s: false,
                m: 'неизвестная ошибка'
            }
        }
    }

    async delete() {
        const s = await this.prisma.users.deleteMany({})
        console.log(s.count)
        return {
            s: true
        }
    }

    async find_user({ room_id, name_user }: { room_id: string, name_user: string }) {
        try {
            const data = await this.prisma.chat.findUnique({
                where: {
                    id: room_id,
                    users: {
                        some: {
                            username: name_user
                        }
                    }
                }
            })
            console.log(data)
            if (!data) return { s: false }
            return { s: true }
        } catch (e) {
            return { s: false }
        }
    }

    async sec_password({ user_username, password }: { user_username: string, password: string }) {
        try {
            const data = await this.prisma.users.findUnique({
                where: { username: user_username }
            })
            if (!data) return { s: false }
            console.log(data)
            if (data.password === password) return { s: true }
            return { s: false }
        } catch (e) {
            return { s: false }
        }
    }
}
