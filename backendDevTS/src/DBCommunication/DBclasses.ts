export class Apostador{
    Email: string;
    NIF: string;
    Telemovel: string;
    Nome: string;
    Morada: string;
    DataNascimento: string;
    Balance: number;
    PlvPasse: string;
    CC: string;

    constructor(apostador:{Email: string, NIF: string , Telemovel: string , Nome : string, Morada: string, DataNascimento: string, Balance:0, PlvPasse: string, CC: string}){
        this.Email= apostador.Email;
        this.NIF = apostador.NIF;
        this.Telemovel = apostador.Telemovel;
        this.Nome = apostador.Nome;
        this.Morada = apostador.Morada;
        this.DataNascimento = apostador.DataNascimento;
        this.Balance = apostador.Balance;
        this.PlvPasse = apostador.PlvPasse;
        this.CC = apostador.CC;
    }
}


export class Promocao{
    Codigo: string;
    Valor: number;

    constructor(promocao:{Codigo: string, Valor: number}){
        this.Codigo= promocao.Codigo;
        this.Valor= promocao.Valor;
    }
}

export class Transacao{
    ApostadorID: string;
    Valor: number;
    Tipo: "Aposta_Ganha"| "Aposta"|"Levantamento_Conta"|"Deposito_Conta"|"Refund";
    DataTr: string;

    constructor(transacao:{ApostadorID: string, Valor: number, Tipo: "Aposta_Ganha"| "Aposta"|"Levantamento_Conta"|"Deposito_Conta"|"Refund", DataTr:string}){
       
        this.ApostadorID = transacao.ApostadorID;
        this.Valor = transacao.Valor;
        this.Tipo = transacao.Tipo;
        this.DataTr = transacao.DataTr;
    }
}

export class Aposta{
    ApostadorID: string;
    Odd: number;
    Montante: number;
    Estado: "PEN"|"WON"|"LOST"|"CLS";
    Codigo: string;
    DateAp: string;

    constructor(aposta:{ ApostadorID: string,Odd: number,Montante: number,Estado: "PEN"|"WON"|"LOST"|"CLS", Codigo: string, DateAp: string}){
        this.ApostadorID = aposta.ApostadorID
        this.Odd = aposta.Odd;
        this.Montante = aposta.Montante;
        this.Estado = aposta.Estado;
        this.Codigo = aposta.Codigo;
        this.DateAp = aposta.DateAp
    }
}

export class Evento{
    ID: string;
    Desporto: "FUT"|"FUTPT"|"BSK"|"F1";
    Resultado: number;
    Descricao: string;
    Estado: "BET"|"FIN"|"CLS";
    Liga: string;
    DataEvent: string;
    
    constructor(evento:{ID: string, Desporto: "FUT"|"FUTPT"|"BSK"|"F1", Resultado: number, Descricao: string,Estado: "BET"|"FIN"|"CLS",Liga: string, DataEvent: string}){
        this.ID = evento.ID
        this.Desporto = evento.Desporto;
        this.Resultado = evento.Resultado;
        this.Descricao = evento.Descricao;
        this.Estado = evento.Estado;
        this.Liga = evento.Liga;
        this.DataEvent = evento.DataEvent;
    }
}

