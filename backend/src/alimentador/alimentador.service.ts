import { Injectable, Logger, NotAcceptableException } from '@nestjs/common';
import * as fs from 'node:fs';
import * as csv from 'csv-split-stream';
import * as csvtoJson from 'csvtojson';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { FormatarService } from 'src/shared/services/formatar/formatar.service';
import { PrismaService } from 'src/prisma.service';
import { AlimentadorInterface } from 'src/models/dimp.interface';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';
@Injectable()
export class AlimentadorService {
  constructor(
    private logger: Logger,
    // private readonly httpService: HttpService,
    private formatService: FormatarService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}
 async convertLocal(){
    let mes = 1
    for (let ano = 0; ano < 5; ano++) {

      for (mes; mes < 13; mes++) {
        const mescheio = mes.toString().padStart(2, '0')
        const competencia = `${mescheio}-202${ano}`
        console.log(competencia)
        const file = `../arquivos/files/DIMP_PORTAL_7927_202${ano}${mescheio}.csv`
        console.log(file)
       await this.convertFiles(file,100000, competencia)
       await this.updateCompetencia(competencia)
        if(competencia=='05-2024'){
          ano = 80
          mes = 40
          
        }
      }
      mes = 1
    }
    
  }
  
  async convertFiles(file: string, size: number, competencia: string) {
    this.logger.warn("INICIANDO")
    let pedacos = 0;
    fs.rmSync('csv', { recursive: true, force: true });
    fs.mkdir('csv', { recursive: true }, () => {});
    fs.rmSync('json', { recursive: true, force: true });
    fs.mkdir('json', { recursive: true }, () => {});
    await csv
      .split(
        fs.createReadStream(file),
        {
          lineLimit: size,
        },
        (index: number) => {
          const file: fs.WriteStream = fs.createWriteStream(
            `../arquivos/csv/part${index}.csv`,
          );
          this.logger.log(`created part ${index}`, 'CRIADO');

          return file;
        },
      )
      .then(async (sucessMsg: any) => {
        console.log('csvSplitStream succeeded.', sucessMsg);
        pedacos = sucessMsg.totalChunks;
        
        this.logger.warn(pedacos, 'Pedaços');
      })
      .catch((csvSplitError: string) => {
        console.log('csvSplitStream failed!', csvSplitError);
      });
    let errorLog = [];
    let errorNumber = 0;
    let count = 0;
    for (let i = 0; i < pedacos; i++) {
      await csvtoJson({
        delimiter: ['|'],
        includeColumns: this.formatService.includeColumns,
        ignoreEmpty: true,
      })
        .fromFile(`../arquivos/csv/part${i}.csv`)
        .then(async (jsonObj) => {
          const data = jsonObj;
          this.logger.warn('CRIADO', `JSON parte ${i}`);
          fs.writeFileSync(`../arquivos/json/part${i}.json`, JSON.stringify(data));
          //const file: fs.WriteStream = fs.createWriteStream(`json/part${i}.json`)
          //const {dados} =  await  firstValueFrom (  this.getLocal(data[3].CD_MUN_IBGE_CLIENTE))
          const inputDados = [];
          jsonObj.map((index) => {
            count++;
            let valid = true;
            let cnpjCpfCliente: string = this.formatService.formatarDocumento(
              index.NU_CNPJ_CPF_CLIENTE.toString(),
            );
            let nomeFantasiaCliente = this.formatService.checknull(index.NM_FANT)
            let dados: AlimentadorInterface = {
              cnpjDeclarante: index.CD_CNPJ_CPF_DECLAR,
              nomeDeclarante: index.NM_DECLAR,
              arquivoReferencia: competencia, 
              competenciaDeclaracao: index.DT_OPER.subst(0,7),
              cnpjCpfCliente: cnpjCpfCliente,
              nomeFantasiaCliente,
              codigoMunicipioCliente: index.CD_MUN_IBGE_CLIENTE,

              dataOperacao: index.DT_OPER,
              operacaoSplit: index.IN_OPER_SPLIT,

              horaTransacao: index.HR_TRANS,
              valorOperacao: parseFloat(index.VL_OPER),
              meioPagamento: index.DS_MEIO_PAGTO,
              codTrans: index.CD_TRANS,
            };
            for (let key in dados) {
              if (dados[key] == undefined || dados[key].length < 1) {
                let errorObj = {
                  key: key,
                  value: dados[key],
                  codTrans: dados.codTrans,
                };
                errorLog.push(errorObj);
                this.logger.debug(errorObj, ['MISSING FIELDS']);
                errorNumber++;
                valid = false;
                return false;
              }
            }
            if (valid) {
              (dados.nomeResponsavelCliente = index.NM_RESP_CLIENTE),
                (dados.cnpjAdquirente = index.NU_CNPJ_ADQUI),
                (dados.bandeiraCartao = index.DS_BAND_CARTAO),
                //preparação do CPF/CNPJ do cliente

                inputDados.push(dados);
            }
          });
          if (inputDados.length > 1) {

            await this.createManyDimp(inputDados);
          }
        });
        if(errorLog.length>0){

          fs.writeFileSync('../arquivos/logs/' + Date.now().toString(), errorLog.toString());
        }
    }
    console.log(count);
    this.logger.log("Finalizando", competencia)
    
    return {
      totalFiles: pedacos * count,
      errors: errorLog.length,
    }
  }


  // async getLocal(codCidade: string | number): Promise<any> {
  //   const { data } = await firstValueFrom(
  //     this.httpService
  //       .get<
  //         any[]
  //       >(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${codCidade}`)
  //       .pipe(),
  //   );
  //   return data;
  // }

  async createManyDimp(
    data: Prisma.DimpCreateManyInput | Prisma.DimpCreateManyInput[] | any,
  ): Promise<any> {
    return await this.prisma.dimp.createMany({ data });
  }

  async removerCompetência(competência: string) {
    return await this.prisma.dimp.deleteMany({
      where: {
        competenciaDeclaracao: competência,
      },
    });
  }
  async resetEmCasoDeMerda(segredo: string) {
    if (segredo == this.configService.get<string>('POWER')) {
      const quantidade = await this.prisma.dimp.count();
      this.logger.log(quantidade, 'ITEMS A REMOVER');
      const param = Math.ceil(quantidade / 1000);
      for (let index = 0; index < quantidade; index = index + param) {
        const dataToRemove = await this.prisma.dimp.findMany({
          take: param,
        });
        const idVetor = dataToRemove.map((item) => item.id);
        await this.prisma.dimp.deleteMany({
          where: {
            id: {
              in: idVetor,
            },
          },
        });
        console.log(index);
        const quantidade = await this.prisma.dimp.count();
        this.logger.log(quantidade, 'ITEMS A REMOVER');
      }
      this.logger.log(quantidade, 'ITEMS A REMOVER');

      const rest = await this.prisma.dimp.count();
      return {
        itemsRestantes: rest,
        itemsRemovidos: quantidade,
      };
    } else throw new NotAcceptableException('You have no power here');
  }
 async removeData() {
    const url = this.configService.get<string>('DATABASE_URL');
    const client = new MongoClient('mongodb://localhost:27017/test');
    const dbName = 'test';

    async function main() {
      console.log('chico mendes')
      // Use connect method to connect to the server
       client.connect();
      console.log('Connected successfully to server');
      const db = client.db(dbName);
      const collection = await db.dropCollection('Dimp');
      // the following code examples can be pasted here...
console.log(collection)
      return 'done.';
    }

    main()
      .then(data=>console.log( "logsimples"), )
      .catch(err=>console.error("erro, ",))
      .finally(() => client.close());
  }
  
  async gerarCompetencias(anoInicial:number, anoFinal: number) {
    const competencias = [];
  
    for (let ano = anoInicial; ano <= anoFinal; ano++) {
      for (let mes = 1; mes <= 12; mes++) {
        const competenciaFormatada = `${mes.toString().padStart(2, '0')}-${ano}`;
        const competenciaObjeto = { competencia: competenciaFormatada };
        competencias.push(competenciaObjeto);
      }
    }
    await this.prisma.competencia.createMany({data: competencias})
    return competencias;
  }
  async encontrar(cnpj:string, ano:string):Promise<any>{
    this.logger.log("iniciado")
    const data = await this.prisma.dimp.findMany({
      where: {
        cnpjCpfCliente: cnpj,
        competenciaDeclaracao: {
          contains: ano
        }
      },
      orderBy:{
        valorOperacao: 'desc'
      },
      select:{  
        cnpjCpfCliente:true, valorOperacao:true, competenciaDeclaracao:true
      },
      
    })
    let soma = 0
      data.map(item=>{
        soma = soma+ item.valorOperacao
      })
      console.log(soma.toFixed(2), "valor total das notas")
      console.log("quantidade de registros", data.length, cnpj, ano)
     
      this.logger.log("finalizado")

      return data
  }
  async findBig(cnpj:string, competencia:string){
    this.logger.log("iniciado")

    const data = await this.prisma.dimp.findMany({
      where: {
        cnpjCpfCliente: cnpj,
        competenciaDeclaracao: {
          contains: competencia
        },
       
      },
      orderBy:{
        horaTransacao: 'desc'
      },
      
    })
    let soma = 0
    data.map(item=>{
      soma = soma+ item.valorOperacao
    })
    console.log("quantidade de registros", data.length, cnpj,soma , competencia)
     
      this.logger.log("finalizado")

      return data
  }
  
  async updateCompetencia(competencia:string){
    return await this.prisma.competencia.update({
      where:{
        competencia
      },
      data:{
        recebida:true
      }
    })
  }
  async checkCompetencia(){
    const mesAtual = (new Date().getMonth()+1).toString().padStart(2, '0')
    const anoAtual = (new Date().getFullYear())
    const competenciaAtual = (`${mesAtual}-${anoAtual}`)
    const existCompetencia  = await this.getOneCompetencia(competenciaAtual)
    if(!existCompetencia){
     return await this.prisma.competencia.create({
        data:{
          competencia:competenciaAtual
        }
      })
    }
    
  }
  async getCompetencias(){
    const mesAtual = (new Date().getMonth()+1).toString().padStart(2, '0')
    const anoAtual = (new Date().getFullYear())
    const competenciaAtual = (`${mesAtual}-${anoAtual}`)
    const existCompetencia  = await this.getOneCompetencia(competenciaAtual)
    if(!existCompetencia){
      this.prisma.competencia.create({
        data:{
          competencia:competenciaAtual
        }
      })
    }
    const competencias = await this.prisma.competencia.findMany({
      
    })
    
    return competencias.filter(index=>!index.recebida)
  }
  async getCompetenciasPendentes(){
    const competenciaAtual = new Date()
    console.log(competenciaAtual)
   return await this.prisma.competencia.findMany({
      where:{
        recebida: false
      }
    })
  }
  async getOneCompetencia(competencia:string){
    return await this.prisma.competencia.findUnique({
      where:{
        competencia
      }
    })
  }
}
  