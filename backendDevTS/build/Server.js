"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const RequestHandler_1 = require("./RequestHandler");
const Security_1 = require("./Security");
class Server {
    constructor() {
        this.port = 8080;
        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        const reqHandler = new RequestHandler_1.RequestHandler();
        const authHandler = new Security_1.AuthenticationHandler();
        /// Init the event list
        reqHandler.initEventLst();
        ///Routing
        // POST Methods
        let api = "/api/";
        //app.post(api + "transaction",reqHandler.transactionFunction);
        app.post(api + "transaction", authHandler.authenticateToken, authHandler.verifyRoles('apostador'), reqHandler.transactionFunction);
        app.post(api + "registerBet", authHandler.authenticateToken, authHandler.verifyRoles('apostador'), reqHandler.registerBetFunction);
        app.post(api + "login", reqHandler.loginFunction);
        app.post(api + "register", reqHandler.registerFunction);
        app.post(api + "editProfile", authHandler.authenticateToken, authHandler.verifyRoles('apostador'), reqHandler.editProfileFunction);
        app.post(api + "addEventOdd", authHandler.authenticateToken, authHandler.verifyRoles('Special'), reqHandler.addEventOdds);
        app.post(api + "closeEvent", authHandler.authenticateToken, authHandler.verifyRoles('Admin'), reqHandler.closeEventFunction);
        app.post(api + "addPromocao", authHandler.authenticateToken, authHandler.verifyRoles('Admin'), reqHandler.addPromocaoFunction);
        app.post(api + "remPromocao", authHandler.authenticateToken, authHandler.verifyRoles('Admin'), reqHandler.remPromocaoFunction);
        app.post(api + "superOdds", authHandler.authenticateToken, authHandler.verifyRoles('Admin'), reqHandler.activateSuperOdds);
        app.post(api + "token", reqHandler.refreshTokenFunction);
        // GET Methods
        app.get(api + "usedCod", authHandler.authenticateToken, authHandler.verifyRoles('apostador'), reqHandler.usedCodFunction);
        app.get(api + "profileInfo", authHandler.authenticateToken, authHandler.verifyRoles('apostador'), reqHandler.profileInfoFunction);
        app.get(api + "betHistory", authHandler.authenticateToken, authHandler.verifyRoles('apostador'), reqHandler.betHistoryFunction);
        app.get(api + "transHist", authHandler.authenticateToken, authHandler.verifyRoles('apostador'), reqHandler.transHistFunction);
        //app.get(api + "eventList"   ,reqHandler.returnEventList);
        app.get(api + "eventList", authHandler.authenticateToken, authHandler.verifyRoles('apostador', 'Special', 'Admin'), reqHandler.returnEventList);
        app.get(api + "updateOdds", reqHandler.getOdds);
        app.get(api + "update", authHandler.authenticateToken, authHandler.verifyRoles('Admin'), reqHandler.updateEvents);
        app.get(api + "getpromocoes", authHandler.authenticateToken, authHandler.verifyRoles('Admin'), reqHandler.getpromocaoFunction);
        //app.get(api + "events", reqHandler.eventHandler);
        app.get(api + "events", authHandler.authenticateToken, authHandler.verifyRoles('apostador'), reqHandler.eventHandler);
        // Start Server
        app.listen(this.port, () => {
            console.log("Server started at local host");
        });
    }
}
const server = new Server();
