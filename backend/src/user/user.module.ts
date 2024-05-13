import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { CriptoService } from 'src/shared/services/cripto.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './auth/local.strategy';
import { segredo } from './auth/constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  controllers: [UserController],
  imports:[JwtModule.register({
    secret: segredo,
    signOptions: { expiresIn: '60s' },
  }),PassportModule],
  providers: [UserService, PrismaService, CriptoService, LocalStrategy,JwtStrategy],
})
export class UserModule {}
