"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBCommunication = void 0;
const mysql = require('mysql');
const fs = require('fs');
const EventList = require('../Models/EventList');
const DBclasses_1 = require("./DBclasses");
const MessageGenerator_1 = require("../MessageGenerator");
const MsgGen = new MessageGenerator_1.MessageGenerator();
const bcrypt = require('bcrypt');
class DBCommunication {
    constructor() {
        this.db = mysql.createConnection({
            host: "localhost",
            user: "",
            password: ""
        });
        this.db.connect((err) => {
            if (err) {
                throw err;
            }
            console.log('MySql Connected...');
        });
        this.initDB("src/DBCommunication/bd.sql");
    }
    initDB(filename) {
        let sqlCode = fs.readFileSync(filename).toString();
        let processedSql = sqlCode.replace(/\n/gm, " ").replace(/\t/gm, " ").split(";").slice(0, -1).map((x) => x += ";");
        processedSql.map((x) => this.db.query(x, (err, res) => {
            if (err) {
                console.log("Error! " + err.message);
            }
            else {
                console.log("Init database sql query done!");
            }
        }));
    }
    ;
    getToday() {
        return `${(new Date().toJSON().slice(0, 10))} ${(new Date().toJSON().slice(11, 19))}`;
    }
    /**
     * @param {string} sql is a mysql query
     * @param {any} args list of arguments in the query
     * @returns error or result
     */
    mysqlQuery(sql, args) {
        return new Promise((resolve, reject) => {
            this.db.query(sql, args, (err, result) => {
                if (err) {
                    if (err.code == 'ER_DUP_ENTRY') {
                        reject({ 'error': 'Valor(es) inserido(s) não permitido(s)' });
                    }
                    else if (err.code == 'ER_BAD_NULL_ERROR') {
                        reject({ 'error': 'Certifique-se que os campos estão todos preenchidos' });
                    }
                    reject({ 'error': err.code });
                }
                else {
                    resolve(JSON.parse(JSON.stringify(result)));
                }
            });
        });
    }
    /**
     * this function registers a better with all its values in the table Apostador
     * @param {Apostador} apostador holds all values of an entry to the table Apostador
     * @returns error or success
     */
    registerOnDb(apostador) {
        return new Promise((resolve, reject) => {
            this.mysqlQuery('SELECT * FROM Funcionario WHERE Email=?', [apostador.Email]).then((message) => {
                if (message.length > 0) {
                    return Promise.reject({ 'error': "Email indisponivel" });
                }
                return this.mysqlQuery('INSERT INTO Apostador SET ?', apostador);
            }).then(() => {
                resolve({ "Res": "Sim" });
            }).catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * this function register a transaction made by a better, and updates its balance
     * @param {Transacao} transacao holds all values of an entry to the Transacao table
     * @returns error or success
     */
    transactionOnDb(transacao) {
        return new Promise((resolve, reject) => {
            if (transacao.Tipo == "Aposta_Ganha" || transacao.Tipo == "Deposito_Conta" || transacao.Tipo == "Refund") {
                this.mysqlQuery('UPDATE Apostador SET Balance= Balance + ? WHERE Email= ? ', [transacao.Valor, transacao.ApostadorID]).then(() => {
                    return this.mysqlQuery('INSERT INTO Transacao SET ?', transacao);
                }).then(() => {
                    resolve({ "Res": "Transação Efetuada" });
                }).catch((e) => {
                    reject(e);
                });
            }
            else {
                this.mysqlQuery('SELECT Balance From Apostador Where Email= ? ', transacao.ApostadorID).then((message) => {
                    if (message[0].Balance < transacao.Valor) {
                        return Promise.reject({ 'error': "Not enough balance" });
                    }
                    return this.mysqlQuery('UPDATE Apostador SET Balance= Balance - ? WHERE Email= ? ', [transacao.Valor, transacao.ApostadorID]);
                }).then(() => {
                    return this.mysqlQuery('INSERT INTO Transacao SET ?', transacao);
                }).then(() => {
                    resolve({ "Res": "Transação Efetuada" });
                }).catch((e) => {
                    reject(e);
                });
            }
        });
    }
    /**
     * this function checks if the given email and password match an entry in either the Funcionario or Apostador table
     * @param {String} email that was set in the register phase
     * @param {String} pass that was set in the register phase
     * @returns error or email not registed or wrong password or success
     */
    loginOnDb(email, pass) {
        return new Promise((resolve, reject) => {
            this.mysqlQuery('SELECT PlvPasse,FRole FROM Funcionario WHERE Email=?', email).then((func_message) => __awaiter(this, void 0, void 0, function* () {
                if (func_message.length == 0) {
                    this.mysqlQuery('SELECT PlvPasse FROM Apostador WHERE Email=?', email).then((apostador_message) => __awaiter(this, void 0, void 0, function* () {
                        if (apostador_message.length == 0) {
                            reject({ 'error': 'Email não registado' });
                        }
                        else {
                            if (yield bcrypt.compare(pass, apostador_message[0].PlvPasse)) {
                                resolve({ 'FRole': 'apostador' });
                            }
                            else
                                reject({ error: "Password errada" });
                        }
                    }));
                }
                else {
                    if (yield bcrypt.compare(pass, func_message[0].PlvPasse)) {
                        resolve({ 'FRole': func_message[0].FRole });
                    }
                    else
                        reject({ error: "Password errada" });
                }
            })).catch((e) => {
                reject(e);
            });
        });
    }
    logoutOnDb(refreshToken) {
        return new Promise((resolve, reject) => {
            let email = "";
            this.mysqlQuery('SELECT Email FROM RefreshTokens WHERE Token=?', [refreshToken]).then((result) => {
                email = result[0].Email;
                return this.mysqlQuery('DELETE FROM RefreshTokens WHERE Token=?', [refreshToken]);
            }).then(() => {
                resolve(email);
            }).catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * this function registers events in the database
     * @param {Evento[]} eventos Set of events
     * @returns error or success
     */
    registerEventOnDb(eventos) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < eventos.length; i++) {
                yield this.mysqlQuery('SELECT * FROM Evento WHERE Desporto=? AND ID=?', [eventos[i].Desporto, eventos[i].ID]).then((message) => {
                    if (message.length == 0) {
                        let today = `'${eventos[i].DataEvent.slice(0, 10)} ${eventos[i].DataEvent.slice(11, 19)}'`;
                        let eventosquery = `('${eventos[i].ID}','${eventos[i].Desporto}',${eventos[i].Resultado},'${eventos[i].Descricao}','BET','${eventos[i].Liga}',${today})`;
                        return this.mysqlQuery('INSERT INTO Evento VALUES' + eventosquery, []);
                    }
                    else
                        return Promise.resolve('ok');
                }).catch((e) => {
                    reject(e);
                    return;
                });
            }
            resolve('Eventos Adicionados');
        }));
    }
    /**
     * this function inserts an aposta to Aposta table and the corresponding entries to Aposta_Evento
     * @param {Aposta} aposta object that contains all atributes of an Aposta
     * @param {Evento} eventos set of object events
     * @returns success or error
     */
    insert_aposta(aposta, eventos) {
        return new Promise((resolve, reject) => {
            this.mysqlQuery('INSERT INTO Aposta SET ?', aposta).then(() => {
                return this.mysqlQuery('SELECT LAST_INSERT_ID() as LastID', []);
            }).then((message) => {
                let eventosquery = "";
                for (let i = 0; i < eventos.length; i++) {
                    eventosquery += `(${message[0].LastID},'${eventos[i].EventoID}','${eventos[i].Desporto}',${eventos[i].Escolha})`;
                    if (i < eventos.length - 1) {
                        eventosquery += ',';
                    }
                }
                return this.mysqlQuery('INSERT INTO Aposta_Evento VALUES ' + eventosquery, []);
            }).then(() => {
                resolve({ 'Res': 'Aposta adicionada' });
            }).catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * this function checks if all events are neither closed nor finalized, then registers a transaction, and if a promocional code
     * was submited then it raises the bet amount accordingly, registers the use of the promocional code and registers the bet
     * @param {object} aposta object that contains all values of an entry in Aposta table
     * @param {object} eventos set of objects that contain the ID,Sport and the predicted result of an Event
     * @param {String} codigo string corresponding to the key of an entry in Promocao table
     * @returns success or error
     */
    registerBetOnDb(aposta, eventos, codigo) {
        return new Promise((resolve, reject) => {
            let eventsquery = "(";
            for (let i = 0; i < eventos.length; i++) {
                eventsquery += `(ID= '${eventos[i].EventoID}' AND Desporto='${eventos[i].Desporto}')`;
                if (i < eventos.length - 1)
                    eventsquery += "OR";
            }
            eventsquery += ")";
            this.mysqlQuery('SELECT * FROM Evento WHERE (Estado="CLS" OR Estado="FIN") AND ' + eventsquery, []).then((message) => {
                if (message.length > 0) {
                    return Promise.reject({ 'error': 'eventos invalidos' });
                }
                return this.transactionOnDb(new DBclasses_1.Transacao({ "ApostadorID": aposta.ApostadorID, "Valor": aposta.Montante, "Tipo": "Aposta", "DataTr": aposta.DateAp }));
            }).then(() => __awaiter(this, void 0, void 0, function* () {
                if (codigo) {
                    try {
                        yield this.mysqlQuery('INSERT INTO Promocao_Apostador SET ?', { "Codigo": codigo, "ApostadorID": aposta.ApostadorID });
                        const message = yield this.mysqlQuery('SELECT Valor FROM Promocao WHERE Codigo = ?', codigo);
                        aposta.Montante += message[0].Valor;
                    }
                    catch (e) {
                        return yield Promise.reject(e);
                    }
                }
                else {
                    return Promise.resolve('ok');
                }
            })).then(() => {
                return this.insert_aposta(aposta, eventos);
            }).then((message) => {
                resolve(message);
            }).catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * function that updates an entry in the Apostador table
     * @param {string} list of tuples with the key:values pairs to change
     * @param {String} email corresponding to the key to an entry in Apostador table
     * @returns success or error
     */
    editProfileOnDb(list, email) {
        return new Promise((resolve, reject) => {
            this.mysqlQuery(`UPDATE Apostador SET ${list} Where Email=?`, email).then(() => {
                resolve({ "Res": "Sim" });
            }).catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * this function changes the state of an event
     * @param {String} estado new state of an event
     * @param {String} eventID event in which the state will change
     * @param {String} desporto sport of the event in which the state will change
     * @param {number} resultado result of the event in which the state will change
     * @param {String} descricao new description of the event in which the state will change
     * @returns list of ApostaID's in which the state of an event changed or error
     */
    setEstadoEvento(estado, eventID, desporto, resultado, descricao) {
        return new Promise((resolve, reject) => {
            let sql;
            let args;
            if (estado == 'FIN') {
                sql = 'UPDATE Evento SET Estado= ? , Resultado=? ,Descricao = ? WHERE ID = ? AND Desporto= ?';
                args = [estado, resultado, descricao, eventID, desporto];
            }
            else {
                sql = 'UPDATE Evento SET Estado= ? WHERE ID = ? AND Desporto= ?';
                args = [estado, eventID, desporto];
            }
            this.mysqlQuery(sql, args).then(() => {
                return this.mysqlQuery('SELECT ApostaID FROM Aposta_Evento WHERE EventoID = ? AND Desporto= ? ', [eventID, desporto]);
            }).then((message) => {
                if (message.length > 0) {
                    resolve(message);
                }
                else {
                    //TODO-Ver isto
                    resolve({ Res: `Nao ha apostas no evento ${eventID} do desporto ${desporto}` });
                }
            }).catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * function that sets the state of an event to CLS and refunds any better that made a bet regarding this event
     * @param {String} eventID of the event that will be closed
     * @param {String} desporto of the event that will be closed
     * @returns success or error
     */
    closeEventOnDb(eventID, desporto) {
        return new Promise((resolve, reject) => {
            let toNotify = [];
            this.setEstadoEvento("CLS", eventID, desporto).then((apostas_closed) => __awaiter(this, void 0, void 0, function* () {
                if (apostas_closed.Res)
                    return;
                else {
                    for (let i = 0; i < apostas_closed.length; i++) {
                        yield this.mysqlQuery('SELECT Estado FROM Aposta WHERE ID=?', apostas_closed[i].ApostaID).then((result) => {
                            if (result[0].Estado == 'PEN') {
                                return this.mysqlQuery('UPDATE Aposta SET Estado = "CLS" WHERE ID=?', apostas_closed[i].ApostaID).then(() => {
                                    return this.mysqlQuery('Select Montante,ApostadorID FROM Aposta WHERE ID=?', apostas_closed[i].ApostaID);
                                }).then((result) => {
                                    toNotify.push([result[0].ApostadorID, [eventID, desporto, apostas_closed[i].ApostaID], MsgGen.CLOSED_GAME_MESSAGE]);
                                    return this.transactionOnDb({ "ApostadorID": result[0].ApostadorID, "Valor": (result[0].Montante), "Tipo": "Refund", "DataTr": this.getToday() });
                                }).catch((e) => { return Promise.reject(e); });
                            }
                        }).catch((e) => { return Promise.reject(e); });
                    }
                }
            })).then(() => {
                resolve({ 'Res': 'evento closed', 'toNotify': toNotify });
            }).catch((message) => {
                reject(message);
            });
        });
    }
    /**
     * function that sets the state of an event to FIN, and gives money to anyone that got the results of all events in a bet
     * @param {String} eventID ID of the event that will be closed
     * @param {String} desporto Sport of the event that will be closed
     * @param {number} resultado Result of the event that will be closed
     * @param {String} descricao Description of the event that will be closed
     * @returns success or error
     */
    finEventOnDb(eventID, desporto, resultado, descricao) {
        return new Promise((resolve, reject) => {
            let toNotify = [];
            this.setEstadoEvento("FIN", eventID, desporto, resultado, descricao).then((apostas_fin) => __awaiter(this, void 0, void 0, function* () {
                if (apostas_fin.Res)
                    return;
                else {
                    for (let i = 0; i < apostas_fin.length; i++) {
                        yield this.mysqlQuery('SELECT Estado FROM Aposta WHERE ID=?', apostas_fin[i].ApostaID).then((estado_aposta) => {
                            if (estado_aposta[0].Estado == 'PEN') {
                                return this.mysqlQuery('SELECT Escolha FROM Aposta_Evento WHERE ApostaID=? AND EventoID = ? AND Desporto = ?', [apostas_fin[i].ApostaID, eventID, desporto]).then((message) => {
                                    if (message.length == 1 && message[0].Escolha == resultado) {
                                        return this.mysqlQuery('SELECT EventoID FROM Aposta_Evento INNER JOIN Evento ON Aposta_Evento.Desporto= Evento.Desporto AND Aposta_Evento.EventoID = Evento.ID WHERE Aposta_Evento.ApostaID=? AND Evento.Estado != "FIN"', apostas_fin[i].ApostaID).then((games_yet_to_end) => {
                                            if (games_yet_to_end.length == 0) {
                                                return this.mysqlQuery('UPDATE Aposta SET Estado = "WON" WHERE ID=?', apostas_fin[i].ApostaID).then(() => {
                                                    return this.mysqlQuery('Select Montante,ApostadorID,Odd FROM Aposta WHERE ID=?', apostas_fin[i].ApostaID);
                                                }).then((m) => {
                                                    toNotify.push([m[0].ApostadorID, apostas_fin[i].ApostaID, MsgGen.WON_GAME_MESSAGE]);
                                                    return this.transactionOnDb({ "ApostadorID": m[0].ApostadorID, "Valor": (m[0].Montante) * (m[0].Odd), "Tipo": "Aposta_Ganha", "DataTr": this.getToday() });
                                                }).catch((e) => {
                                                    return Promise.reject(e);
                                                });
                                            }
                                            else
                                                return Promise.resolve('ok');
                                        }).catch((e) => {
                                            return Promise.reject(e);
                                        });
                                    }
                                    else {
                                        return this.mysqlQuery('UPDATE Aposta SET Estado = "LOST" WHERE ID=?', apostas_fin[i].ApostaID).then(() => {
                                            return this.mysqlQuery('SELECT ApostadorID FROM Aposta WHERE ID=?', apostas_fin[i].ApostaID);
                                        }).then((message) => {
                                            toNotify.push([message[0].ApostadorID, apostas_fin[i].ApostaID, MsgGen.LOST_GAME_MESSAGE]);
                                        }).catch((e) => {
                                            return Promise.reject(e);
                                        });
                                    }
                                }).catch((e) => {
                                    return Promise.reject(e);
                                });
                            }
                        });
                    }
                }
            })).then(() => {
                resolve({ 'Res': 'Evento finalizado', 'toNotify': toNotify });
            }).catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * function that registers a promocional code in the database
     * @param {Promocao} promocao object with the values of an entry to the Promocao table
     * @returns success or error
     */
    addPromocaoOnDb(promocao) {
        return new Promise((resolve, reject) => {
            this.mysqlQuery('INSERT INTO Promocao SET ?', promocao).then(() => {
                resolve({ "Res": "Sim" });
            }).catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * function that removes a promocional code from the database
     * @param {String} codigo key of the promocional code set to removal
     * @returns success or error
     */
    remPromocaoOnDb(codigo) {
        return new Promise((resolve, reject) => {
            this.mysqlQuery('DELETE FROM Promocao_Apostador WHERE Codigo=?', codigo).then(() => {
                return this.mysqlQuery('DELETE FROM Promocao WHERE Codigo=?', codigo);
            }).then(() => {
                resolve({ "Res": "Sim" });
            }).catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * @returns existing promocional codes and their values or error
     */
    getPromocaoOnDb() {
        return new Promise((resolve, reject) => {
            this.mysqlQuery('SELECT * FROM Promocao', []).then((result) => {
                resolve(result);
            }).catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * function that checks if a given better has already used a promocional code
     * @param {String} email of the better
     * @param {String} codigo of the code to be checked
     * @returns whether the code was used or not or error
     */
    usedCodOnDb(email, codigo) {
        return new Promise((resolve, reject) => {
            if (codigo == null) {
                resolve({ "Res": "Codigo promocional nulo" });
                return;
            }
            let valor;
            this.mysqlQuery('SELECT * FROM Promocao WHERE Codigo=?', codigo).then((message) => {
                if (message.length == 0) {
                    return Promise.reject({ "error": "Codigo nao existe" });
                }
                valor = message[0].Valor;
                return this.mysqlQuery('SELECT * FROM Promocao_Apostador WHERE Codigo=? AND ApostadorID = ?', [codigo, email]);
            }).then((message) => {
                if (message.length == 0) {
                    resolve({ "Res": "Nao", "Valor": valor });
                }
                else {
                    resolve({ "Res": "Sim", "Valor": valor });
                }
            }).catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * @param {String} email key to an entry in the Apostador table
     * @returns values of an entry in the Apostador table or error
     */
    profileInfoOnDb(email) {
        return new Promise((resolve, reject) => {
            this.mysqlQuery('SELECT * FROM Apostador where Email=?', email).then((result) => {
                resolve(result[0]);
            }).catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * function that returns the history of bets of a given better
     * @param {String} email key to an entry in the Apostador table
     * @returns list of entries in the Aposta table with a few more values or error
     */
    betHistoryOnDb(email) {
        return new Promise((resolve, reject) => {
            this.mysqlQuery('SELECT * FROM Aposta WHERE ApostadorID=? ORDER BY DateAp DESC', email).then((message) => __awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < message.length; i++) {
                    yield this.mysqlQuery('SELECT Desporto,EventoID,Escolha FROM Aposta_Evento WHERE ApostaID=?', message[i].ID).then((data) => __awaiter(this, void 0, void 0, function* () {
                        let resposta = [];
                        for (let i = 0; i < data.length; i++) {
                            yield this.mysqlQuery('SELECT * FROM Evento WHERE Desporto=? AND ID=?', [data[i].Desporto, data[i].EventoID]).then((msg) => {
                                msg[0]['Escolha'] = data[i].Escolha;
                                resposta.push(msg[0]);
                            }).catch((e) => {
                                return Promise.reject(e);
                            });
                        }
                        return Promise.resolve(resposta);
                    })).then((dados_jogos) => {
                        message[i]['Jogos'] = dados_jogos;
                        if (dados_jogos.length > 1) {
                            message[i]['Aridade'] = "Múltipla";
                        }
                        else
                            message[i]['Aridade'] = "Simples";
                    }).catch((e) => {
                        return Promise.reject(e);
                    });
                }
                resolve(message);
            })).catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * @param {String} email key to an entry in the Transacao table
     * @returns list of entries in Transacao table or error
     */
    transHistOnDb(email) {
        return new Promise((resolve, reject) => {
            this.mysqlQuery('SELECT * FROM Transacao WHERE ApostadorID=? ORDER BY DataTr DESC', email).then((result) => {
                resolve(result);
            }).catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * function that returns the events that already started
     * @param {String} desporto key to the Evento table
     * @returns ids of events or error
     */
    startedEventOnDb(desporto) {
        let today = this.getToday();
        return new Promise((resolve, reject) => {
            let ids = [];
            this.mysqlQuery('SELECT ID FROM Evento WHERE Desporto=? AND DataEvent < ? AND Estado="BET"', [desporto, today]).then((result) => {
                for (let i = 0; i < result.length; i++) {
                    ids.push(result[i].ID);
                }
                resolve(ids);
            }).catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * @param {String} email key to an entry in the Apostador table
     * @returns balance of a better or error
     */
    walletOnDb(email) {
        return new Promise((resolve, reject) => {
            this.mysqlQuery('SELECT Balance FROM Apostador WHERE Email=?', email).then((result) => {
                if (result.length > 0) {
                    resolve(result[0].Balance);
                }
                else
                    resolve(0);
            }).catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * @returns all entries in the Evento table
     */
    getEventsOnDb() {
        return new Promise((resolve, reject) => {
            this.mysqlQuery("SELECT * FROM Evento", []).then((result) => {
                resolve(result);
            }).catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * Method that inserts a REFRESH_TOKEN in the DB
     */
    pushTokenOnDb(token, email, role) {
        return new Promise((resolve, reject) => {
            this.mysqlQuery("INSERT INTO RefreshTokens(Email,URole,Token) VALUES (?,?,?)", [email, role, token]).then((result) => {
                resolve(result);
            }).catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * Method that returns the role and email associated to a RefreshToken
     */
    getTokenOnDb(token) {
        return new Promise((resolve, reject) => {
            this.mysqlQuery("SELECT URole,Email FROM RefreshTokens WHERE Token=?", [token]).then((result) => {
                resolve(result[0]);
            }).catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * Method that deletes a RFRESH_TOKEN from the DB
     */
    deleteTokensOnDb(email) {
        return new Promise((resolve, reject) => {
            this.mysqlQuery("DELETE FROM RefreshTokens WHERE Email = ?", [email]).then((result) => {
                resolve(result);
            }).catch((e) => {
                reject(e);
            });
        });
    }
}
exports.DBCommunication = DBCommunication;
