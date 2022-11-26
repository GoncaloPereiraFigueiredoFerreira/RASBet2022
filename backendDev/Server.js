const express = require("express");
const bodyParser = require("body-parser");
const reqHandler = require("./RequestHandler")

class Server{
    port = 8080;

    constructor(){
        const app = express();
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({extended:false}));
        app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.header(
                "Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept"
            );
            next();
        });

        /// Init the event list
        reqHandler.initEventLst();
        
        ///Routing
        // POST Methods
        let api = "/api/";
        app.post(api + "transaction",reqHandler.transactionFunction);
        app.post(api + "registerBet",reqHandler.registerBetFunction);
        app.post(api + "login"      ,reqHandler.loginFunction);
        app.post(api + "register"   ,reqHandler.registerFunction);
        app.post(api + "editProfile",reqHandler.editProfileFunction);
        app.post(api + "addEventOdd",reqHandler.addEventOdds);
        app.post(api + "closeEvent" ,reqHandler.closeEventFunction);
        //app.post(api + "finEvent"   ,reqHandler.finEventFunction);
        app.post(api + "addPromocao",reqHandler.addPromocaoFunction);
        app.post(api + "remPromocao",reqHandler.remPromocaoFunction);
        app.post(api + "superOdds"  ,reqHandler.activateSuperOdds);    
        // GET Methods
        app.get(api + "usedCod"     ,reqHandler.usedCodFunction);
        app.get(api + "profileInfo" ,reqHandler.profileInfoFunction);
        app.get(api + "betHistory"  ,reqHandler.betHistoryFunction);
        app.get(api + "transHist"   ,reqHandler.transHistFunction);
        app.get(api + "eventList"   ,reqHandler.returnEventList);
        app.get(api + "updateOdds"  ,reqHandler.getOdds);
        app.get(api + "update"      ,reqHandler.updateEvents);
        app.get(api + "getpromocoes",reqHandler.getpromocaoFunction);
        app.get(api + "events", reqHandler.eventHandler);

        // Start Server
        app.listen(this.port, () => {
            console.log("Server started at local host");
        })
    }

}

const server = new Server();