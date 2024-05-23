import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CriptoService } from 'src/shared/services/cripto.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private crypt: CriptoService,
    private jwtService: JwtService
  ) {}
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

 async findUsers():Promise<User[]>{
  return this.prisma.user.findMany()
 }

  async findOne(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return await this.prisma.user.findUnique({
      where,
    });
  }

  async updateUser(
    id: string,
    data: Prisma.UserUpdateInput
  ): Promise<User> {
      return this.prisma.user.update({
      where:{
        id
      },
      data,
    });
  }
  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
  async createUserPadrao(): Promise<User> {
    const user: Prisma.UserCreateInput = {
      documento: '00000000000',
      nome: 'admin',
      senha: await this.crypt.generateHash('receita123'),
      email: 'admin@admin',
    };
    return this.prisma.user.create({
      data: user,
    });
  }
  async signIn(user: any): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        documento: user.documento,
      },
    });
  }
  async validateUser(documento: string, pass: string): Promise<any> {
    console.log(pass)
    const user = await this.findOne({
      documento,
    });
    
   const senha =  await this.crypt.compareHash(user.senha, pass)
   console.log(user.senha, senha)
    if (user && senha) {
      const { senha, ...result } = user;
      return result;
    }
    throw new BadRequestException("Credenciais inválidas");
  }
  async login(user: Prisma.UserCreateInput) {
    const payload = { nome: user.nome, documento: user.documento, id:user.id };
    await this.checkCompetencia()
    return {
      token: this.jwtService.sign(payload),
      nome: user.nome, documento: user.documento, id:user.id,email:user.email, 
    };
  }

  async checkCompetencia(){
    const mesAtual = (new Date().getMonth()+1).toString().padStart(2, '0')
    const anoAtual = (new Date().getFullYear())
    const competenciaAtual = (`${mesAtual}-${anoAtual}`)
    console.log(competenciaAtual)
    const existCompetencia  = await this.prisma.competencia.findUnique({
      where:{
        competencia:competenciaAtual
      }
    })
    console.log(existCompetencia)
    if(!existCompetencia){
      console.log("CRiouuuuuu")
     return await this.prisma.competencia.create({
        data:{
          competencia:competenciaAtual
        }
      })

    }else{ console.log('não criou')}
    
  }
}
