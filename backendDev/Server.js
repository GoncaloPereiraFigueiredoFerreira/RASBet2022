
const express = require("express");
const bodyParser = require("body-parser");
const reqHandler = require("./RequestHandler")

class Server{
    port = 8080;

    constructor(){
        const app = express();
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({extended:false}));

        /// Init the event list
        //reqHandler.initEventLst();
        
        ///Routing
        // POST Methods
        let api = "/api/";
        app.post(api + "transaction",reqHandler.transactionFunction);
        app.post(api + "registerBet",reqHandler.registerBetFunction);
        app.post(api + "login"      ,reqHandler.loginFunction);
        app.post(api + "register"   ,reqHandler.registerFunction);
        app.post(api + "editProfile",reqHandler.editProfileFunction);
        app.post(api + "addEventOdd",reqHandler.dummyFunction);
        app.post(api + "closeEvent" ,reqHandler.closeEventFunction);
        app.post(api + "suspndEvent",reqHandler.suspndEventFunction);
        app.post(api + "addPromocao",reqHandler.addPromocaoFunction);
        app.post(api + "addcodeUsed",reqHandler.addcodeUsedFunction);
        

        app.post(api+"registerEvent",reqHandler.registerEventFunction);

        // GET Methods
        app.get(api + "usedCod"     ,reqHandler.usedCodFunction);
        app.get(api + "profileInfo" ,reqHandler.profileInfoFunction);
        app.get(api + "betHistory"  ,reqHandler.betHistoryFunction);
        app.get(api + "transHist"   ,reqHandler.transHistFunction);
        app.get(api + "eventList"   ,reqHandler.dummyFunction);
        app.get(api + "updateOdds"  ,reqHandler.dummyFunction);

        // Start Server
        app.listen(this.port, () => {
            console.log("Server started at local host");
        })

    }

}

const server = new Server();