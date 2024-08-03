import { Context as TelegrafContext } from 'telegraf'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface MyContext extends TelegrafContext {
  prisma: PrismaClient
}

export function createContext(): PrismaClient {
  return prisma
}
