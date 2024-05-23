import { Injectable } from '@nestjs/common';

@Injectable()
export class FormatarService {

    formatarDocumento(documento:string|number){
        let cnpj = documento.toString()
            while(cnpj.length<14){
              cnpj = "0"+cnpj
            }
           const validCNPJ = this.checkCNPJ(cnpj);
           if(validCNPJ){
            return cnpj
           }
           else{
            let cpf = documento.toString()
            while(cpf.length<11){
              cpf = "0"+cpf
              
            }
            //const formatCpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            return cpf

           }
    }
    checkCNPJ(cnpj: string) {
        let soma = 0;
        let peso = 5;
        for (let i = 0; i < 12; i++) {
          soma += parseInt(cnpj.charAt(i)) * peso;
          peso = peso === 2 ? 9 : peso - 1;
        }
        let digitoVerificador1 = soma % 11;
        digitoVerificador1 = digitoVerificador1 < 2 ? 0 : 11 - digitoVerificador1;
    
        if (parseInt(cnpj.charAt(12)) !== digitoVerificador1) {
          return false;
        }
        soma = 0;
        peso = 6;
        for (let i = 0; i < 13; i++) {
          soma += parseInt(cnpj.charAt(i)) * peso;
          peso = peso === 2 ? 9 : peso - 1;
        }
        let digitoVerificador2 = soma % 11;
        digitoVerificador2 = digitoVerificador2 < 2 ? 0 : 11 - digitoVerificador2;
        if (parseInt(cnpj.charAt(13)) !== digitoVerificador2) {
          return false;
        }
    
        return true;
      }
      formatCaracteres(doc:string){
        if(doc.length>12){
            return doc.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
        }
        else{
            return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        }
      }
       colunasDesejadas = [
        "CD_CNPJ_CPF_DECLAR",
        "NM_DECLAR",
        "DT_INI_DECL",
        "NU_CNPJ_CPF_CLIENTE",
        "NM_FANT",
        "CD_MUN_IBGE_CLIENTE",
        "NM_RESP_CLIENTE",
        "NU_CNPJ_ADQUI",
        "DT_OPER",
        "IN_OPER_SPLIT",
        "DS_BAND_CARTAO",
        "HR_TRANS",
        "VL_OPER",
        "DS_MEIO_PAGTO",
        "CD_TRANS"
      ];
      includeColumns= new RegExp(`^(${this.colunasDesejadas.join('|')})$`)

      checknull(dado:string|undefined){
        if(!dado||dado==undefined){
          return 'DADO NAO INFORMADO'
        }
        else{
          return dado
        } 
      }
}
