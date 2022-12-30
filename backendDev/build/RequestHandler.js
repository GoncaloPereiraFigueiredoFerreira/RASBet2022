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
const NotificationHandler_1 = require("./SessionControl/NotificationHandler");
const Security_1 = require("./SessionControl/Security");
const evLst = EventList_1.EventList.getInstance();
const apiComms = require("./APICommunication/APICommunication");
const dbComms = new DBCommunication_1.DBCommunication();
const notificationHandler = NotificationHandler_1.NotificationHandler.getInstance();
const authHandler = new Security_1.AuthenticationHandler();
const bcrypt = require('bcrypt');
require("dotenv").config();
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
        return __awaiter(this, void 0, void 0, function* () {
            let apostador = new DBclasses_1.Apostador(request.body);
            apostador.PlvPasse = yield bcrypt.hash(apostador.PlvPasse, 10);
            apostador.Balance = 0;
            const userInfo = {
                userInfo: {
                    email: apostador.Email,
                    role: 'apostador'
                }
            };
            dbComms.registerOnDb(apostador).then(() => {
                const token = authHandler.generateAccessToken(userInfo);
                const refreshToken = authHandler.generateRefreshToken(userInfo, dbComms);
                //response.status(200).send({"AccessToken":token,"RefreshToken":refreshToken})
                response.status(200).send({ "Token": token, "RefreshToken": refreshToken });
            }).catch((message) => {
                response.status(400).send(message);
            });
        });
    }
    /**
     * Function that deals with a http request to make a transaction
     */
    transactionFunction(request, response) {
        let transacao = new DBclasses_1.Transacao(request.body);
        let userEmail = request.email;
        transacao.ApostadorID = userEmail;
        dbComms.transactionOnDb(transacao).then(() => {
            return dbComms.walletOnDb(userEmail);
        }).then((message) => {
            notificationHandler.addWalletNotification(userEmail, message);
            response.sendStatus(200);
        }).catch((message) => {
            response.status(400).send(message);
        });
    }
    /**
     * Function that deals with a http request to check if the given credentials are in the database
     */
    loginFunction(request, response) {
        let Email = request.body.Email;
        let PlvPasse = request.body.PlvPasse;
        dbComms.loginOnDb(Email, PlvPasse).then((message) => {
            const userInfo = {
                userInfo: {
                    email: Email,
                    role: message.FRole
                }
            };
            //message['AccessToken'] = authHandler.generateAccessToken(userInfo)
            message['Token'] = authHandler.generateAccessToken(userInfo);
            return authHandler.generateRefreshToken(userInfo, dbComms).then((refreshToken) => {
                message['RefreshToken'] = refreshToken;
                response.status(200).send(message);
            }).catch((e) => {
                return Promise.reject(e);
            });
        }).catch((message) => {
            response.status(400).send(message);
        });
    }
    logoutFunction(request, response) {
        const refreshToken = request.body.refreshToken;
        dbComms.logoutOnDb(refreshToken).catch((e) => {
            response.status(400).send(e);
        });
    }
    refreshTokenFunction(request, response) {
        //const accessToken = authHandler.refreshAccessToken(request.headers.refreshtoken)
        authHandler.refreshAccessToken(request.body.refreshtoken, dbComms).then((accessToken) => {
            if (accessToken == null)
                response.sendStatus(400);
            else
                response.status(200).send({ 'AccessToken': accessToken });
        }).catch((e) => {
            response.status(400).send(e);
        });
    }
    /**
     * Function that deals with a http request to register a bet
     */
    registerBetFunction(request, response) {
        let list = [];
        let userEmail = request.email;
        let aposta = new DBclasses_1.Aposta(userEmail, request.body.Aposta);
        let Eventos = request.body.Eventos;
        for (let i = 0; i < Eventos.length; i++) {
            list.push(new DBclasses_1.Evento(evLst.getEventDB(Eventos[i].Desporto, Eventos[i].EventoID)));
        }
        dbComms.usedCodOnDb(aposta.ApostadorID, aposta.Codigo).then((message) => {
            if (message.Res == "Sim") {
                return Promise.reject({ "error": "Codigo promocional ja utilizado" });
            }
            return dbComms.registerEventOnDb(list);
        }).then(() => {
            return dbComms.registerBetOnDb(aposta, Eventos, aposta.Codigo);
        }).then(() => {
            return dbComms.walletOnDb(userEmail);
        }).then((balanco) => {
            for (let i = 0; i < Eventos.length; i++) {
                evLst.updateOddBet(Eventos[i].Desporto, Eventos[i].EventoID, aposta.Montante, Eventos[i].Escolha);
                let odds = evLst.getOdds(Eventos[i].Desporto, Eventos[i].EventoID);
                let message = `O evento de ${Eventos[i].Desporto} com id ${Eventos[i].EventoID} mudou as suas odds para ${odds}`;
                let followers = evLst.getGameFollowers(Eventos[i].Desporto, Eventos[i].EventoID);
                if (followers.length > 0)
                    notificationHandler.addBetNotification(followers, message);
            }
            notificationHandler.addWalletNotification(userEmail, balanco);
            response.sendStatus(200);
        }).catch((e) => {
            response.status(400).send(e);
        });
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
        let userEmail = request.email;
        dbComms.editProfileOnDb(list, userEmail).then((message) => {
            response.status(200).send(message);
        }).catch((message) => {
            response.status(400).send(message);
        });
    }
    /**
     * Function that deals with a http request to close an event
     */
    closeEventFunction(request, response) {
        let EventoID = request.body.Evento.EventoID;
        let Desporto = request.body.Evento.Desporto;
        dbComms.closeEventOnDb(EventoID, Desporto).then((message) => __awaiter(this, void 0, void 0, function* () {
            evLst.closeEvent(Desporto, EventoID);
            for (let tuple of message.toNotify) {
                console.log(`Email ${tuple[0]} e mensagem ${tuple[1]}`);
                //Send email and notification
                notificationHandler.addBetNotification([tuple[0]], tuple[1]);
                // Notify wallet
                yield dbComms.walletOnDb(tuple[0]).then((info) => {
                    notificationHandler.addWalletNotification(tuple[0], info);
                }).catch((e) => {
                    return Promise.reject(e);
                });
            }
            response.status(200).send({ 'Res': message.Res });
        })).catch((message) => {
            response.status(400).send(message);
        });
    }
    /**
     * Function that deals with a http request to add a promocional code to the database
     */
    addPromocaoFunction(request, response) {
        let promocao = new DBclasses_1.Promocao(request.body.Promocao);
        dbComms.addPromocaoOnDb(promocao).then((message) => {
            response.status(200).send(message);
        }).catch((message) => {
            response.status(400).send(message);
        });
    }
    /**
     * Function that deals with a http request to remove a promocional code from the database
     */
    remPromocaoFunction(request, response) {
        dbComms.remPromocaoOnDb(request.body.Codigo).then((message) => {
            response.status(200).send(message);
        }).catch((message) => {
            response.status(400).send(message);
        });
    }
    /**
     * Function that deals with a http request to get all existing promocional codes in the database
     */
    getpromocaoFunction(request, response) {
        dbComms.getPromocaoOnDb().then((message) => {
            response.status(200).send(message);
        }).catch((message) => {
            response.status(400).send(message);
        });
    }
    /**
     * Function that deals with a http request to check if a given better already used a given promocional code
     */
    usedCodFunction(request, response) {
        let userEmail = request.email;
        dbComms.usedCodOnDb(userEmail, request.query.Codigo).then((message) => {
            response.status(200).send(message);
        }).catch((message) => {
            response.status(400).send(message);
        });
    }
    /**
     * Function that deals with a http request to get the profile of a given account
     */
    profileInfoFunction(request, response) {
        let userEmail = request.email;
        console.log(`ProfileInfoFunction: ${userEmail}`);
        dbComms.profileInfoOnDb(userEmail).then((message) => {
            response.status(200).send(message);
        }).catch((message) => {
            response.status(400).send(message);
        });
    }
    /**
     * Function that deals with a http request to get the bet history of a given better
     */
    betHistoryFunction(request, response) {
        let userEmail = request.email;
        dbComms.betHistoryOnDb(userEmail).then((message) => __awaiter(this, void 0, void 0, function* () {
            response.status(200).send({ 'lista': message });
        })).catch((message) => {
            response.status(400).send(message);
        });
    }
    /**
     * Function that deals with a http request to get the transaction history of a given better
     */
    transHistFunction(request, response) {
        let userEmail = request.email;
        dbComms.transHistOnDb(userEmail).then((message) => {
            response.status(200).send({ 'lista': message });
        }).catch((message) => {
            response.status(400).send(message);
        });
    }
    /**
     *  Handler for the request of a event list. This event list changes based on the user thats requesting it and
     */
    returnEventList(request, response) {
        let userRole = request.role;
        if (userRole == 'Admin') {
            let lst = evLst.getBETEvents(request.query.sport).concat(evLst.getNODDEvents(request.query.sport));
            response.status(200).send({
                "EventList": lst,
                "Leagues": evLst.getLeagues(request.query.sport)
            });
        }
        else if (userRole == 'apostador') {
            response.status(200).send({
                "EventList": evLst.getBETEvents(request.query.sport),
                "Leagues": evLst.getLeagues(request.query.sport),
                "Followed": evLst.getGamesFollowed(request.query.sport, request.email)
            });
        }
        else if (userRole == 'Special') { // Especialista
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
        let flag = evLst.changeEventOdd(request.body.sport, request.body.EventoId, request.body.Odds);
        if (flag)
            response.status(200).send("Odds for event " + request.body.EventoId + "were added");
        else
            response.status(404).send("Event not found");
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
                                    notificationHandler.addBetNotification([tuple[0]], tuple[1]);
                                    dbComms.walletOnDb(tuple[0]).then((info) => { notificationHandler.addWalletNotification(tuple[0], info); });
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
                                    notificationHandler.addBetNotification([tuple[0]], tuple[1]);
                                    dbComms.walletOnDb(tuple[0]).then((info) => { notificationHandler.addWalletNotification(tuple[0], info); });
                                }
                            });
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
                                    notificationHandler.addBetNotification([tuple[0]], tuple[1]);
                                    dbComms.walletOnDb(tuple[0]).then((info) => { notificationHandler.addWalletNotification(tuple[0], info); });
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
                                    notificationHandler.addBetNotification([tuple[0]], tuple[1]);
                                    dbComms.walletOnDb(tuple[0]).then((info) => { notificationHandler.addWalletNotification(tuple[0], info); });
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
    periodicUpdate(time) {
        return __awaiter(this, void 0, void 0, function* () {
            if (time > 0) {
                setTimeout(() => {
                    console.log('Update Time!');
                    this.updateEvents(undefined, undefined);
                    this.periodicUpdate(time);
                }, time * 1000);
            }
        });
    }
    /**
     * Method responsible for updating the events in the backend
     */
    updateEvents(request, response) {
        this.updateResults();
        apiComms.updateEventLst();
        if (request != undefined)
            response.sendStatus(200);
    }
    /**
     * Method responsible for activating super odds in a event
     */
    activateSuperOdds(request, response) {
        let flag = evLst.superOdds(request.body.sport, request.body.EventoID, request.body.multiplier);
        if (flag) {
            let followers = evLst.getGameFollowers(request.body.sport, request.body.EventoID);
            let message = `A promocao SuperOdds foi aplicada ao evento de ${request.body.sport} com id ${request.body.EventoID}`;
            notificationHandler.addBetNotification(followers, message);
            response.status(200).send("Super odds for event " + request.body.EventoID + " added");
        }
        else
            response.status(404).send("Event not found");
    }
    /**
     * Method responsible for updating the odds of a certain event
     */
    getOdds(request, response) {
        response.status(200).send(evLst.getOdds(request.body.sport, request.body.EventoID));
    }
    addGameFollower(request, response) {
        let userEmail = request.email;
        let sport = request.body.sport;
        let id = request.body.id;
        let flag = evLst.addGameFollower(sport, id, userEmail);
        if (flag)
            response.status(200).send("Follow adicionado");
        else
            response.status(200).send("Follow Não adicionado");
    }
    removeGameFollower(request, response) {
        let userEmail = request.email;
        let sport = request.body.sport;
        let id = request.body.id;
        let flag = evLst.removeGameFollower(sport, id, userEmail);
        if (flag)
            response.status(200).send("Follow removido");
        else
            response.status(200).send("Follow Não removido");
    }
    /**
     * Handler responsible for establishing the SSE
     */
    eventHandler(request, response, next) {
        let userEmail = request.email;
        response.setHeader('Content-Type', 'text/event-stream');
        response.setHeader('Connection', 'keep-alive');
        response.setHeader('Cache-Control', 'no-cache');
        response.setHeader('X-Accel-Buffering', 'no');
        response.setHeader('Access-Control-Allow-Origin', "*");
        notificationHandler.addGate(userEmail, response);
        dbComms.walletOnDb(userEmail).then((info) => { notificationHandler.addWalletNotification(userEmail, info); });
        request.on('close', () => {
            console.log('DEU close');
            authHandler.delete(userEmail, dbComms);
            notificationHandler.closeConnection(userEmail);
        });
    }
}
exports.RequestHandler = RequestHandler;
