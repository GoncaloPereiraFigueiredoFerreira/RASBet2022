const eventList = require("./Models/EventList");
const evLst = eventList.getInstance();
const apiComms = require("./APICommunication/APICommunication")
const dbComms1 = require("./DBCommunication/DBcommunication");
const dbComms = new dbComms1();
const e = require("express");
const sessionHandler = require("./SessionHandler").getInstance();
const notifcationCenter = require("./NotificationCenter");


function dummyFunction(request,response){
    response.status(200).send("Dummy here! But connection worked!")
}

function transactionFunction(request,response){
    request.body.ApostadorID= sessionHandler.verifyUser(request.body.ApostadorID)[0]
    dbComms.transactionOnDb(request.body,function(result){
        if(result.error){
            response.status(400).send(result)
        }
        else response.status(200).send('Sim')

        
    })
}

function registerFunction(request,response){

    dbComms.registerOnDb(request.body,function(result){
        if (result=='fine'){
            response.status(200).send({"Token":sessionHandler.addUser(request.body.Email,'apostador')})
        }
        else response.status(400).send(result)
        
       
        
    })
}

function loginFunction(request,response){

    dbComms.loginOnDb(request.body.Email,request.body.PlvPasse,function(result){
        console.log(result)
        if (result.error){
            response.status(400).send(result)
        }
        else {
            result['Token']=sessionHandler.addUser(request.body.Email,result.FRole)
            response.status(200).send(result)
        }
    })
}


function registerBetFunction(request,response){
    request.body.Aposta.ApostadorID= sessionHandler.verifyUser(request.body.Aposta.ApostadorID)[0]
    console.log(request.body.Aposta.ApostadorID)
    dbComms.registerBetOnDb(request.body.Aposta,request.body.Evento,request.body.Codigo,function(result){
        response.status(200).send(result)
    })
}

function editProfileFunction(request,response){
    list=""
    i= 0
    for (const key in request.body){
        if(i>0){
            list+=`${key}="${request.body[key]}"`
            if(i<Object.keys(request.body).length-1){list+=","}
        }
        i++
    }
    console.log(list)
    dbComms.editProfileOnDb(list,request.body["Email"],function(result){
        response.status(200).send(result)
    })
}


function closeEventFunction(request,response){
    dbComms.closeEventOnDb(request.body.Id,function(result){
        response.status(200).send(result)
    })
    evLst.closeEvent(request.body.sport,request.body.Id);
}

function suspndEventFunction(request,response){
    dbComms.suspndEventOnDb(request.body.Id,function(result){
        response.status(200).send(result)
    })
}


function registerEventFunction(request,response){
    dbComms.registerEventOnDb(request.body,function(result){
        response.status(200).send(result)
    })
    //response.status(200).send(request.body)
}


function addPromocaoFunction(request,response){
    dbComms.addPromocaoOnDb(request.body,function(result){
        response.status(200).send(result)
    })
}

function addcodeUsedFunction(request,response){
    dbComms.addcodeUsedOnDb(request.body,function(result){
        response.status(200).send(result)
    })
    
}

function usedCodFunction(request,response){
    dbComms.usedCodOnDb(request.body.ApostadorID,request.body.Codigo,function(result){
        response.status(200).send(result)
    })
    
}

function profileInfoFunction(request,response){
    dbComms.profileInfoOnDb(request.body.Email,function(result){
        response.status(200).send(result)
    })

}

function betHistoryFunction(request,response){
    dbComms.betHistoryOnDb(request.body.Email,function(result){
        response.status(200).send(result)
    })

}

//ordenar cronologicamente
function transHistFunction(request,response){
    dbComms.transHistOnDb(request.body.Email,function(result){
        response.status(200).send(result)
    })
}



function returnEventList(request,response){
    let user = sessionHandler.verifyUser(request.body.token);
    console.log("new event list request");
    console.log(user);
    if (user[1] == 'apostador' || user[1] == 'Admin' ) {// Apostador e Administrador
        response.status(200).send(evLst.getBETEvents(request.body.sport));
    }
    else if (user[1] == 'Special' ){// Especialista
        response.status(200).send(evLst.getSOEvents(request.body.sport));
    }
}

function addEventOdds(request,response){
    let user = sessionHandler.verifyUser(request.body.token);
    if (user[1] == 'Special'){
        evLst.changeEventOdd(request.body.sport,request.body.EventoId,request.body.Odds);
        response.status(200).send();
    }
}


function initEventLst(){
    dbComms.getEventsOnDb((result)=>{
        for (let event of result){
            //////VAI dar erro por causa do estado
            evLst.addEventFromDB(event.Desporto,event.Liga,event.ID,event.Descricao,event.Resultado,event.Estado,event.DataEvent);
        }
        apiComms.initEventLst();
    });
    
}


function updateFUTEvents(){
    dbComms.getPastFUTEventsOnDb((result) => {
        let fixList =[]
        for (let event of result){
            fixList.push(event.ID);
        }
        for (let fixtures of fixList){
            apiComms.updateFutResults(fixtures);
            // This might not finnish in time for the db update
        }
        for (let fixture of fixList){
            let eventE = evLst.getEventDB("FUT",fixture);
            dbComms.addEvento(eventE, () => {});
        }
    });
}


function updateF1Events(){
    dbComms.getPastF1EventsOnDb((result)=> {
        let raceList= [];
        for(let race of result){
            raceList.push(race.ID);
        }
        for (let race of raceList){
            apiComms.updateF1Results(race);
            // This might not finnish in time for the db update
        }
        for (let race of raceList){
            let eventE = evLst.getEventDB("F1",race);
            dbComms.addEvento(eventE, () => {});
        }
    })
}


function updateBSKEvents(){
    dbComms.getPastBSKEventsOnDb((result)=> {
        let gameList= [];
        for(let game of result){
            gameList.push(game.ID);
        }
        for (let game of gameList){
            apiComms.updateBSKResults(game);
            // This might not finnish in time for the db update
        }
        for (let game of gameList){
            let eventE = evLst.getEventDB("BSK",game);
            dbComms.addEvento(eventE, () => {});
        }
    })
}


function updateEvents(){
    updateFUTEvents();
    updateF1Events();
    updateBSKEvents();
}


function activateSuperOdds(request,response){
    evLst.superOdds(request.body.sport,request.body.EventoID,request.body.multiplier);
    response.status(200).send();
}

function getOdds(request,response){
    response.status(200).send(evLst.getOdds(request.body.sport,request.body.EventoID))
}


module.exports = {
    initEventLst,
    dummyFunction,
    transactionFunction,
    registerBetFunction,
    loginFunction,
    registerFunction,
    editProfileFunction,
    closeEventFunction,
    suspndEventFunction,
    registerEventFunction,
    addPromocaoFunction,
    addcodeUsedFunction,
    usedCodFunction,
    profileInfoFunction,
    betHistoryFunction,
    transHistFunction,
    updateEvents,
    returnEventList,
    activateSuperOdds,
    getOdds,
    addEventOdds
    
}