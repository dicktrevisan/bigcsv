import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { FormatarService } from './shared/services/formatar/formatar.service';
import { PrismaDoubleService, PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AlimentadorService } from './alimentador/alimentador.service';
import { AlimentadorModule } from './alimentador/alimentador.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { segredo } from './user/auth/constants';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'client/browser'),
    serveRoot:('')
  }),HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
  }), AlimentadorModule, UserModule,ConfigModule.forRoot({
    isGlobal: true,
  }),
],
  controllers: [AppController],
  providers: [AppService, Logger, FormatarService, PrismaService, AlimentadorService, PrismaDoubleService],
})
export class AppModule {}
