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
@Post('/:mes/:ano')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async  uploadFile(@UploadedFile() file: Express.Multer.File, @Param('ano') ano:string, @Param('mes') mes:string) {
    const competencia = mes+'-'+ano
    console.log(competencia)
    if(competencia[2]=='-'&&competencia.length==7){
      const atual = await this.alimentadorService.getOneCompetencia(competencia)
      if (!atual.recebida){

        const dados = await this.alimentadorService.convertFiles(join(process.cwd(), '../../arquivos/chegada/file.csv'), 10000, competencia, ano)
        return ({
          dados,
          competencia: await this.alimentadorService.updateCompetencia(competencia)
        })
      }
      return new ConflictException("Competencia já registrada.")
    }
    return new BadRequestException("BURRO")
  }



@Get('cria-ano/:ano')
async criaAno(@Param('ano') ano:string){
  console.log('batey')
  return await this.alimentadorService.createAno(ano)
}
@Get('rola')
gerar(){
  this.alimentadorService.gerarCompetencias(2020,2024)
}
@Get('/busca/resumido/:ano/:cnpj')
 async gettudo(@Param('cnpj') cnpj:string, @Param('ano')ano:string){
   return await this.alimentadorService.encontrar(cnpj, ano)
  }
@Get('/busca/cheio/:ano/:cnpj')
 async big(@Param('cnpj') cnpj:string, @Param('ano')ano:string){
   return await this.alimentadorService.findBig(cnpj, ano)
  }
@Get('/maior') 
 async maiores(){
   return await this.alimentadorService.find100()
  }
@Get('/lista')
async getCompetencias(){
    return await this.alimentadorService.getCompetencias()
}
@Get('sobetudo')
async sobeTudo(){
  this.alimentadorService.convertLocal()

}
@Get('/busca/anual/:ano/:cnpj/:competencia')
 async anual( @Param('ano')ano:string, @Param('cnpj') cnpj:string,@Param('competencia')competencia:string){
   return await this.alimentadorService.findAnual(ano, cnpj, competencia)
  }
@Get("agrupar")
async agrupar(){
  await this.alimentadorService.agrupar()
}
}
