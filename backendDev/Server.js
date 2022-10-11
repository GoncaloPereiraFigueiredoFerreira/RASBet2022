//Basic Imports for the server

const express = require("express");
const bodyParser = require("body-parser");
const reqHandler = require("./RequestHandler")

class Server{
    port = 8080;

    constructor(){
        const app = express();
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({extended:false}));

        ///Routing
        // POST Methods
        let api = "/api/";
        app.post(api + "transaction",reqHandler.dummyFunction);
        app.post(api + "registerBet",reqHandler.dummyFunction);
        app.post(api + "login"      ,reqHandler.dummyFunction);
        app.post(api + "register"   ,reqHandler.dummyFunction);
        app.post(api + "editProfile",reqHandler.dummyFunction);
        app.post(api + "addEventOdd",reqHandler.dummyFunction);
        app.post(api + "closeEvent" ,reqHandler.dummyFunction);
        app.post(api + "suspndEvent",reqHandler.dummyFunction);

        // GET Methods
        app.get(api + "profileInfo" ,reqHandler.dummyFunction);
        app.get(api + "betHistory"  ,reqHandler.dummyFunction);
        app.get(api + "transHist"   ,reqHandler.dummyFunction);
        app.get(api + "eventList"   ,reqHandler.dummyFunction);
        app.get(api + "updateOdds"  ,reqHandler.dummyFunction);

        // Start Server
        app.listen(this.port, () => {
            console.log("Server started at local host");
        })

    }

}

const server = new Server();