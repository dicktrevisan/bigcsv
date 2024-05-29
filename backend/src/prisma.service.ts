import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaClient as DoublePrisma} from '@prisma/@prisma-double/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
} 
@Injectable()
export class PrismaDoubleService extends DoublePrisma implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}