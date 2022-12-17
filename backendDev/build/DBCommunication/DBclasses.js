"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Evento = exports.Aposta = exports.Transacao = exports.Promocao = exports.Apostador = void 0;
class Apostador {
    constructor(apostador) {
        this.Email = apostador.Email;
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
exports.Apostador = Apostador;
class Promocao {
    constructor(promocao) {
        this.Codigo = promocao.Codigo;
        this.Valor = promocao.Valor;
    }
}
exports.Promocao = Promocao;
class Transacao {
    constructor(transacao) {
        this.ApostadorID = transacao.ApostadorID;
        this.Valor = transacao.Valor;
        this.Tipo = transacao.Tipo;
        this.DataTr = `${(new Date().toJSON().slice(0, 10))} ${(new Date().toJSON().slice(11, 19))}`;
    }
}
exports.Transacao = Transacao;
class Aposta {
    constructor(aposta) {
        this.ApostadorID = aposta.ApostadorID;
        this.Odd = aposta.Odd;
        this.Montante = aposta.Montante;
        this.Estado = 'PEN';
        this.Codigo = aposta.Codigo;
        this.DateAp = `${(new Date().toJSON().slice(0, 10))} ${(new Date().toJSON().slice(11, 19))}`;
    }
}
exports.Aposta = Aposta;
class Evento {
    constructor(evento) {
        this.ID = evento.ID;
        this.Desporto = evento.Desporto;
        this.Resultado = evento.Resultado;
        this.Descricao = evento.Descricao;
        this.Estado = evento.Estado;
        this.Liga = evento.Liga;
        this.DataEvent = evento.DataEvent;
    }
}
exports.Evento = Evento;
