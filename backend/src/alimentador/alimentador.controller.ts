import { Body, Controller, Delete, Param, Post, UploadedFile, UseInterceptors, Logger, UseGuards, BadRequestException, Get, ConflictException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import multerConfig from 'src/shared/configuration/multer';
import { AlimentadorService } from './alimentador.service';
import { JwtAuthGuard } from 'src/user/auth/jwt-auth.guard';

@Controller('alimentador')
export class AlimentadorController {
  constructor(private readonly alimentadorService: AlimentadorService) {}

  @Post('')
  async createOne(){
    await this.alimentadorService
  }
@UseGuards(JwtAuthGuard)
@Post('/:competencia')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async  uploadFile(@UploadedFile() file: Express.Multer.File, @Param('competencia') competencia:string) {
    console.log(competencia)
    if(competencia[2]=='-'&&competencia.length==7){
      const atual = await this.alimentadorService.getOneCompetencia(competencia)
      if (!atual.recebida){

        const dados = await this.alimentadorService.convertFiles(join(process.cwd(), 'chegada/file.csv'), 100000, competencia)
        return ({
          dados,
          competencia: await this.alimentadorService.updateCompetencia(competencia)
        })
      }
      return new ConflictException("Competencia já registrada.")
    }
    return new BadRequestException("BURRO")
  }
@UseGuards(JwtAuthGuard)
@Delete('notenteissoaqui')
async deleteCompetência(@Body() data:any){
  
  if(data){
   return await this.alimentadorService.removeData()
  }  
}
@UseGuards(JwtAuthGuard)
@Delete('/delete/:competencia')
async deleteEmCasoDeReset(@Param('competencia') competencia:string){
  await this.alimentadorService.removeData()
  return ("The data was deleted")
}
@Get('/busca/:cnpj')
 async gettudo(@Param('cnpj') cnpj:string){
   return await this.alimentadorService.gerarCompetencias(2020, 2024)
  }
@Get('/lista')
async getCompetencias(){
  return await this.alimentadorService.getCompetencias()
}
}
