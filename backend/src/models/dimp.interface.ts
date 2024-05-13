export interface AlimentadorInterface {
    id?:string
    cnpjDeclarante: string;
    nomeDeclarante: string;
    competenciaDeclaracao:string;
    cnpjCpfCliente: string;
    nomeFantasiaCliente: string;
    codigoMunicipioCliente: string;
    nomeResponsavelCliente?: string;
    cnpjAdquirente?: string;
    dataOperacao: string;
    operacaoSplit: string;
    bandeiraCartao?: string;
    horaTransacao: string;
    valorOperacao: number;
    meioPagamento: string;
    codTrans:string
}
