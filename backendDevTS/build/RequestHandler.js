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
exports.RequestHandler = void 0;
const EventList_1 = require("./Models/EventList");
const DBCommunication_1 = require("./DBCommunication/DBCommunication");
const SessionHandler_1 = require("./SessionHandler");
const evLst = EventList_1.EventList.getInstance();
const apiComms = require("./APICommunication/APICommunication");
const dbComms = new DBCommunication_1.DBCommunication();
const sessionHandler = SessionHandler_1.SessionHandler.getInstance();
const notifcationCenter = require("./NotificationCenter");
const DBclasses_1 = require("./DBCommunication/DBclasses");
class RequestHandler {
    constructor() {
        this.updateEvents = this.updateEvents.bind(this);
        this.updateResults = this.updateResults.bind(this);
    }
    dummyFunction(request, response) {
        response.status(200).send("Dummy here! But connection worked!");
    }
    /**
     * Function that deals with a http request to register an account in the database
     *
     */
    registerFunction(request, response) {
        let apostador = new DBclasses_1.Apostador(request.body);
        apostador.Balance = 0;
        dbComms.registerOnDb(apostador).then(() => {
            let token = sessionHandler.addUser(apostador.Email, 'apostador');
            response.status(200).send({ "Token": token });
        }).catch((message) => {
            response.status(400).send(message);
        });
    }
    /**
     * Function that deals with a http request to make a transaction
     */
    transactionFunction(request, response) {
        let transacao = new DBclasses_1.Transacao(request.body);
        let token = transacao.ApostadorID;
        let user = sessionHandler.verifyUser(transacao.ApostadorID);
        if (user[0] && user[1] == 'apostador') {
            transacao.ApostadorID = user[0];
            dbComms.transactionOnDb(transacao).then(() => {
                return dbComms.walletOnDb(user[0]);
            }).then((message) => {
                sessionHandler.sendNotification(token, { 'Balance': message });
                response.sendStatus(200);
            }).catch((message) => {
                response.status(400).send(message);
            });
        }
        else {
            response.status(400).send('Permission denied');
        }
    }
    /**
     * Function that deals with a http request to check if the given credentials are in the database
     */
    loginFunction(request, response) {
        let Email = request.body.Email;
        let PlvPasse = request.body.PlvPasse;
        dbComms.loginOnDb(Email, PlvPasse).then((message) => {
            message['Token'] = sessionHandler.addUser(Email, message.FRole);
            response.status(200).send(message);
        }).catch((message) => {
            response.status(400).send(message);
        });
    }
    /**
     * Function that deals with a http request to register a bet
     */
    registerBetFunction(request, response) {
        let list = [];
        let aposta = new DBclasses_1.Aposta(request.body.Aposta);
        let Eventos = request.body.Eventos;
        for (let i = 0; i < Eventos.length; i++) {
            list.push(new DBclasses_1.Evento(evLst.getEventDB(Eventos[i].Desporto, Eventos[i].EventoID)));
        }
        let user = sessionHandler.verifyUser(aposta.ApostadorID);
        let token = aposta.ApostadorID;
        if (user[0] && user[1] == 'apostador' && Eventos.length > 0) {
            aposta.ApostadorID = user[0];
            dbComms.usedCodOnDb(aposta.ApostadorID, aposta.Codigo).then((message) => {
                if (message.Res == "Sim") {
                    return Promise.reject({ "error": "Codigo promocional ja utilizado" });
                }
                return dbComms.registerEventOnDb(list);
            }).then(() => {
                return dbComms.registerBetOnDb(aposta, Eventos, aposta.Codigo);
            }).then(() => {
                return dbComms.walletOnDb(user[0]);
            }).then((balanco) => {
                for (let i = 0; i < Eventos.length; i++) {
                    evLst.updateOddBet(Eventos[i].Desporto, Eventos[i].EventoID, aposta.Montante, Eventos[i].Escolha);
                }
                sessionHandler.sendNotification(token, { "Balance": balanco });
                response.sendStatus(200);
            }).catch((e) => {
                response.status(400).send(e);
            });
        }
        else {
            response.status(400).send('Permission denied');
        }
    }
    /**
     * Function that deals with a http request to edit a profile of an account
     */
    editProfileFunction(request, response) {
        let list = "";
        let size = Object.keys(request.body).length - 1;
        if (request.body.Morada) {
            list += `Morada='${request.body.Morada}'`;
            size--;
            if (size > 0)
                list += ',';
        }
        if (request.body.Nome) {
            list += `Nome='${request.body.Nome}'`;
            size--;
            if (size > 0)
                list += ',';
        }
        if (request.body.Telemovel) {
            list += `Telemovel='${request.body.Telemovel}'`;
            size--;
            if (size > 0)
                list += ',';
        }
        let user = sessionHandler.verifyUser(request.body.ApostadorID);
        if (user[0] && user[1] == 'apostador') {
            dbComms.editProfileOnDb(list, user[0]).then((message) => {
                response.status(200).send(message);
            }).catch((message) => {
                response.status(400).send(message);
            });
        }
        else {
            response.status(400).send('Permission denied');
        }
    }
    /**
     * Function that deals with a http request to close an event
     */
    closeEventFunction(request, response) {
        let EventoID = request.body.Evento.EventoID;
        let Desporto = request.body.Evento.Desporto;
        let user = sessionHandler.verifyUser(request.body.Token);
        console.log(user);
        //mudar para admin
        if (user[0] && user[1] == 'Admin') {
            dbComms.closeEventOnDb(EventoID, Desporto).then((message) => __awaiter(this, void 0, void 0, function* () {
                evLst.closeEvent(Desporto, EventoID);
                for (let tuple of message.toNotify) {
                    console.log(`Email ${tuple[0]} e mensagem ${tuple[1]}`);
                    //Send email
                    //notifcationCenter.sendMail(tuple[0],'Finalizacao Aposta',tuple[1],null)
                    // Notify wallet
                    let token = sessionHandler.getToken(tuple[0]);
                    yield dbComms.walletOnDb(tuple[0]).then((info) => {
                        sessionHandler.sendNotification(token, { "Balance": info });
                    }).catch((e) => {
                        return Promise.reject(e);
                    });
                }
                response.status(200).send({ 'Res': message.Res });
            })).catch((message) => {
                response.status(400).send(message);
            });
        }
        else {
            response.status(400).send('Permission denied');
        }
    }
    /**
     * Function that deals with a http request to finalize an event
     */
    finEventFunction(request, response) {
        let EventoID = request.body.Evento.EventoID;
        let Desporto = request.body.Evento.Desporto;
        let Resultado = request.body.Evento.Resultado;
        let Descricao = 'nova descricao';
        let user = sessionHandler.verifyUser(request.body.Token);
        //mudar para admin
        if (user[0] && user[1] == 'Admin') {
            dbComms.finEventOnDb(EventoID, Desporto, Resultado, Descricao).then((message) => {
                for (let tuple of message.toNotify) {
                    console.log(`Email ${tuple[0]} e mensagem ${tuple[1]}`);
                    //notifcationCenter.sendMail(tuple[0],'Finalizacao Aposta',tuple[1],null)
                    // Notify wallet
                    let token = sessionHandler.getToken(tuple[0]);
                    dbComms.walletOnDb(tuple[0]).then((info) => { sessionHandler.sendNotification(token, { "Balance": info }); });
                }
                response.status(200).send({ 'Res': message.Res });
            }).catch((message) => {
                response.status(400).send(message);
            });
        }
        else {
            response.status(400).send('Permission denied');
        }
    }
    /**
     * Function that deals with a http request to add a promocional code to the database
     */
    addPromocaoFunction(request, response) {
        let user = sessionHandler.verifyUser(request.body.Token);
        let promocao = new DBclasses_1.Promocao(request.body.Promocao);
        if (user[0] && user[1] == 'Admin') {
            dbComms.addPromocaoOnDb(promocao).then((message) => {
                response.status(200).send(message);
            }).catch((message) => {
                response.status(400).send(message);
            });
        }
        else {
            response.status(400).send('Permission denied');
        }
    }
    /**
     * Function that deals with a http request to remove a promocional code from the database
     */
    remPromocaoFunction(request, response) {
        let user = sessionHandler.verifyUser(request.body.Token);
        if (user[0] && user[1] == 'Admin') {
            dbComms.remPromocaoOnDb(request.body.Codigo).then((message) => {
                response.status(200).send(message);
            }).catch((message) => {
                response.status(400).send(message);
            });
        }
        else {
            response.status(400).send('Permission denied');
        }
    }
    /**
     * Function that deals with a http request to get all existing promocional codes in the database
     */
    getpromocaoFunction(request, response) {
        let user = sessionHandler.verifyUser(request.query.Token);
        if (user[0] && user[1] == 'Admin') {
            dbComms.getPromocaoOnDb().then((message) => {
                response.status(200).send(message);
            }).catch((message) => {
                response.status(400).send(message);
            });
        }
        else {
            response.status(400).send('Permission denied');
        }
    }
    /**
     * Function that deals with a http request to check if a given better already used a given promocional code
     */
    usedCodFunction(request, response) {
        let user = sessionHandler.verifyUser(request.query.ApostadorID);
        if (user[0] && user[1] == 'apostador') {
            dbComms.usedCodOnDb(user[0], request.query.Codigo).then((message) => {
                response.status(200).send(message);
            }).catch((message) => {
                response.status(400).send(message);
            });
        }
        else {
            response.status(400).send('Permission denied');
        }
    }
    /**
     * Function that deals with a http request to get the profile of a given account
     */
    profileInfoFunction(request, response) {
        let user = sessionHandler.verifyUser(request.query.ApostadorID);
        if (user[0] && user[1] == 'apostador') {
            dbComms.profileInfoOnDb(user[0]).then((message) => {
                response.status(200).send(message);
            }).catch((message) => {
                response.status(400).send(message);
            });
        }
        else {
            response.status(400).send('Permission denied');
        }
    }
    /**
     * Function that deals with a http request to get the bet history of a given better
     */
    betHistoryFunction(request, response) {
        let user = sessionHandler.verifyUser(request.query.ApostadorID);
        if (user[0] && user[1] == 'apostador') {
            dbComms.betHistoryOnDb(user[0]).then((message) => __awaiter(this, void 0, void 0, function* () {
                response.status(200).send({ 'lista': message });
            })).catch((message) => {
                response.status(400).send(message);
            });
        }
        else {
            response.status(400).send('Permission denied');
        }
    }
    /**
     * Function that deals with a http request to get the transaction history of a given better
     */
    transHistFunction(request, response) {
        let user = sessionHandler.verifyUser(request.query.ApostadorID);
        if (user[0] && user[1] == 'apostador') {
            dbComms.transHistOnDb(user[0]).then((message) => {
                response.status(200).send({ 'lista': message });
            }).catch((message) => {
                response.status(400).send(message);
            });
        }
        else {
            response.status(400).send('Permission denied');
        }
    }
    /**
     *  Handler for the request of a event list. This event list changes based on the user thats requesting it and
     */
    returnEventList(request, response) {
        let user = sessionHandler.verifyUser(request.query.token);
        if (user[1] == 'Admin') {
            let lst = evLst.getBETEvents(request.query.sport).concat(evLst.getNODDEvents(request.query.sport));
            response.status(200).send({
                "EventList": lst,
                "Leagues": evLst.getLeagues(request.query.sport)
            });
        }
        else if (user[1] == 'apostador') {
            response.status(200).send({
                "EventList": evLst.getBETEvents(request.query.sport),
                "Leagues": evLst.getLeagues(request.query.sport)
            });
        }
        else if (user[1] == 'Special') { // Especialista
            response.status(200).send({
                "EventList": evLst.getNODDEvents(request.query.sport),
                "Leagues": evLst.getLeagues(request.query.sport)
            });
        }
        else
            response.status(404).send("Not found");
    }
    /**
     * Handler for the request to add odds to a event (needs to be a specialist)
     */
    addEventOdds(request, response) {
        let user = sessionHandler.verifyUser(request.body.token);
        if (user[1] == 'Special') {
            let flag = evLst.changeEventOdd(request.body.sport, request.body.EventoId, request.body.Odds);
            if (flag)
                response.status(200).send("Odds for event " + request.body.EventoId + "were added");
            else
                response.status(404).send("Event not found");
        }
        else {
            response.status(400).send('Permission denied');
        }
    }
    /**
     * Start-up of the event list
     */
    initEventLst() {
        dbComms.getEventsOnDb().then((result) => {
            for (let event of result) {
                evLst.addEventFromDB(event.Desporto, event.Liga, event.ID, event.Descricao, event.Resultado, event.Estado, event.DataEvent);
            }
            apiComms.initEventLst();
        }).catch((e) => {
            console.log(e);
        });
    }
    /**
     * Handler responsible for updating all the results of football events
     */
    updateFUTEvents() {
        return new Promise((resolve, reject) => {
            dbComms.startedEventOnDb("FUT").then((result) => {
                apiComms.updateFutResults(result).then(() => __awaiter(this, void 0, void 0, function* () {
                    for (let fixture of result) {
                        let event = evLst.getEventDB("FUT", fixture);
                        if (event["Estado"] == "FIN") {
                            yield dbComms.finEventOnDb(fixture, "FUT", event["Resultado"], event["Descricao"]).then((message) => {
                                for (let tuple of message.toNotify) {
                                    console.log(`Email ${tuple[0]} e mensagem ${tuple[1]}`);
                                    //notifcationCenter.sendMail(tuple[0],'Finalizacao Aposta',tuple[1],null)
                                    let token = sessionHandler.getToken(tuple[0]);
                                    dbComms.walletOnDb(tuple[0]).then((info) => { sessionHandler.sendNotification(token, { "Balance": info }); });
                                }
                            });
                        }
                    }
                    resolve();
                }));
            });
        });
    }
    /**
     * Handler responsible for updating all the results of F1 events
     */
    updateF1Events() {
        return new Promise((resolve, reject) => {
            dbComms.startedEventOnDb("F1").then((result) => {
                apiComms.updateF1Results(result).then(() => __awaiter(this, void 0, void 0, function* () {
                    for (let race of result) {
                        let event = evLst.getEventDB("F1", race);
                        if (event["Estado"] == "FIN")
                            yield dbComms.finEventOnDb(race, "F1", event["Resultado"], event["Descricao"]).then((message) => {
                                for (let tuple of message.toNotify) {
                                    console.log(`Email ${tuple[0]} e mensagem ${tuple[1]}`);
                                    //notifcationCenter.sendMail(tuple[0],'Finalizacao Aposta',tuple[1],null)
                                    let token = sessionHandler.getToken(tuple[0]);
                                    dbComms.walletOnDb(tuple[0]).then((info) => { sessionHandler.sendNotification(token, { "Balance": info }); });
                                }
                            });
                        // Here we should notify all the users afected by the end of that event
                    }
                    resolve();
                }));
            });
        });
    }
    /**
     * Handler responsible for updating all the results of basketball events
     */
    updateBSKEvents() {
        return new Promise((resolve, reject) => {
            dbComms.startedEventOnDb("BSK").then((result) => {
                apiComms.updateBSKResults(result).then(() => __awaiter(this, void 0, void 0, function* () {
                    for (let game of result) {
                        let event = evLst.getEventDB("BSK", game);
                        if (event["Estado"] == "FIN") {
                            yield dbComms.finEventOnDb(game, "BSK", event["Resultado"], event["Descricao"]).then((message) => {
                                for (let tuple of message.toNotify) {
                                    console.log(`Email ${tuple[0]} e mensagem ${tuple[1]}`);
                                    //notifcationCenter.sendMail(tuple[0],'Finalizacao Aposta',tuple[1],null)
                                    let token = sessionHandler.getToken(tuple[0]);
                                    dbComms.walletOnDb(tuple[0]).then((info) => { sessionHandler.sendNotification(token, { "Balance": info }); });
                                }
                            });
                            // Here we should notify all the users afected by the end of that event
                        }
                    }
                    resolve();
                }));
            });
        });
    }
    /**
     * Handler responsible for updating all the results of portuguese football events
     */
    updateFUTPTEvents() {
        return new Promise((resolve, reject) => {
            dbComms.startedEventOnDb("FUTPT").then((result) => {
                apiComms.updateFUTPTResults(result).then(() => __awaiter(this, void 0, void 0, function* () {
                    for (let game of result) {
                        let event = evLst.getEventDB("FUTPT", game);
                        if (event["Estado"] == "FIN") {
                            yield dbComms.finEventOnDb(game, "FUTPT", event["Resultado"], event["Descricao"]).then((message) => {
                                for (let tuple of message.toNotify) {
                                    console.log(`Email ${tuple[0]} e mensagem ${tuple[1]}`);
                                    //notifcationCenter.sendMail(tuple[0],'Finalizacao Aposta',tuple[1],null)
                                    let token = sessionHandler.getToken(tuple[0]);
                                    dbComms.walletOnDb(tuple[0]).then((info) => { sessionHandler.sendNotification(token, { "Balance": info }); });
                                }
                            });
                            // Here we should notify all the users afected by the end of that event
                        }
                    }
                    resolve();
                }));
            });
        });
    }
    /**
     *
     * Method responsible for updating the results of events
     */
    updateResults() {
        return new Promise((resolve, reject) => {
            this.updateFUTEvents().then(() => evLst.removePastEvents("FUT"));
            this.updateF1Events().then(() => evLst.removePastEvents("F1"));
            this.updateBSKEvents().then(() => evLst.removePastEvents("BSK"));
            this.updateFUTPTEvents().then(() => evLst.removePastEvents("FUTPT"));
            resolve();
        });
    }
    /**
     * Method responsible for updating the events in the backend
     */
    updateEvents(request, response) {
        let user = sessionHandler.verifyUser(request.query.token);
        if (user[1] == "Admin") {
            this.updateResults();
            apiComms.updateEventLst();
            response.sendStatus(200);
        }
        else {
            response.status(400).send('Permission denied');
        }
    }
    /**
     * Method responsible for activating super odds in a event
     */
    activateSuperOdds(request, response) {
        let user = sessionHandler.verifyUser(request.body.token);
        if (user[1] == "Admin") {
            let flag = evLst.superOdds(request.body.sport, request.body.EventoID, request.body.multiplier);
            if (flag)
                response.status(200).send("Super odds for event " + request.body.EventoID + " added");
            else
                response.status(404).send("Event not found");
        }
        else {
            response.status(400).send('Permission denied');
        }
    }
    /**
     * Method responsible for updating the odds of a certain event
     */
    getOdds(request, response) {
        response.status(200).send(evLst.getOdds(request.body.sport, request.body.EventoID));
    }
    /**
     * Handler responsible for establishing the SSE
     */
    eventHandler(request, response, next) {
        let token = request.query.token;
        let user = sessionHandler.verifyUser(token);
        if (user[1] == "apostador") {
            response.setHeader('Content-Type', 'text/event-stream');
            response.setHeader('Connection', 'keep-alive');
            response.setHeader('Cache-Control', 'no-cache');
            response.setHeader('X-Accel-Buffering', 'no');
            response.setHeader('Access-Control-Allow-Origin', "*");
            sessionHandler.addGate(token, response);
            dbComms.walletOnDb(user[0]).then((info) => { sessionHandler.sendNotification(token, { "Balance": info }); });
            request.on('close', () => {
                sessionHandler.closeConnection(token);
            });
        }
    }
}
exports.RequestHandler = RequestHandler;
