import { Logger, Module } from '@nestjs/common';
import { AlimentadorService, } from './alimentador.service';
import { AlimentadorController } from './alimentador.controller';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { FormatarService } from 'src/shared/services/formatar/formatar.service';

@Module({
  controllers: [AlimentadorController],
  providers: [AlimentadorService, PrismaService, ConfigService, Logger, FormatarService],
})
export class AlimentadorModule {}
