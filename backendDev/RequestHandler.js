const eventList = require("./Models/EventList");
const evLst = eventList.getInstance();
const apiComms = require("./APICommunication/APICommunication")
const dbComms1 = require("./DBCommunication/DBcommunication2");
const dbComms = new dbComms1();
const e = require("express");
const sessionHandler = require("./SessionHandler").getInstance();
const notifcationCenter = require("./NotificationCenter");


function dummyFunction(request,response){
    response.status(200).send("Dummy here! But connection worked!")
}


function registerFunction(request,response){

    dbComms.registerOnDb(request.body).then((message)=>{
        return dbComms.walletOnDb(request.body.Email)
    }).then((message)=>{
        response.status(200).send({"Token":sessionHandler.addUser(request.body.Email,'apostador'),"Balance":message})
    }).catch((message)=>{
        response.status(400).send(message)
    })

    
}


function transactionFunction(request,response){
    
    let user =  sessionHandler.verifyUser(request.body.ApostadorID)
    if(user[0] && user[1]=='apostador'){
        request.body.ApostadorID= user[0]
        dbComms.transactionOnDb(request.body).then((message)=>{
            console.log(message)
            return dbComms.walletOnDb(user[0])
        }).then((message)=>{
            response.status(200).send({'Balance':message})
        }).catch((message)=>{
            response.status(400).send(message)
        })
    }
    else{
        response.status(400).send('Permission denied')
    }
}



function loginFunction(request,response){
    let answer
    dbComms.loginOnDb(request.body.Email,request.body.PlvPasse).then((message)=>{
        answer=message
        answer['Token']=sessionHandler.addUser(request.body.Email,message.FRole)
        return dbComms.walletOnDb(request.body.Email)
    }).then((balanco)=>{
        answer['Balance']=balanco
        response.status(200).send(answer)
    }).catch((message3)=>{
        response.status(400).send(message3)
    })

}



function registerBetFunction(request,response){
    let answer
    let user = sessionHandler.verifyUser(request.body.Aposta.ApostadorID)
    if(user[0] && user[1]=='apostador'){
        request.body.Aposta.ApostadorID= user[0]
        dbComms.registerBetOnDb(request.body.Aposta,request.body.Eventos,request.body.Codigo).then((message)=>{
            answer=message
            return dbComms.walletOnDb(user[0])
        }).then((balanco)=>{
            answer['Balance']=balanco
            response.status(200).send(answer)
        }).catch((message)=>{
            response.status(400).send(message)
        })
        
    }
    else{
        response.status(400).send('Permission denied')
    }
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
    let user = sessionHandler.verifyUser(request.body.ApostadorID)
    let answer
    if(user[0] && user[1]=='apostador'){
        dbComms.editProfileOnDb(list,user[0]).then((message)=>{
            answer=message
            return dbComms.walletOnDb(user[0])
        }).then((balance)=>{
            answer['Balance']=balance
            response.status(200).send(answer)
        }).catch((message)=>{
            response.status(400).send(message)
        })
    }
    else{
        response.status(400).send('Permission denied')
    }
}




function closeEventFunction(request,response){
    
    let user = sessionHandler.verifyUser(request.body.Token)
    //mudar para admin
    if(user[0] && user[1]=='apostador'){
        dbComms.closeEventOnDb(request.body.Evento.EventoID,request.body.Evento.Desporto).then((message)=>{
            response.status(200).send(message)
        }).catch((message)=>{
            response.status(400).send(message)
        }) 
    }
    else{
        response.status(400).send('Permission denied')
    }
    //evLst.closeEvent(request.body.sport,request.body.Id);
}

function finEventFunction(request,response){

    let user = sessionHandler.verifyUser(request.body.Token)
    //mudar para admin
    if(user[0] && user[1]=='apostador'){
        dbComms.finEventOnDb(request.body.Evento.EventoID,request.body.Evento.Desporto,request.body.Evento.Resultado).then((message)=>{
            response.status(200).send(message)
        }).catch((message)=>{
            response.status(400).send(message)
        }) 
    }
    else{
        response.status(400).send('Permission denied')
    }
}

// Removed
function suspndEventFunction(request,response){
    dbComms.suspndEventOnDb(request.body.Id,function(result){
        response.status(200).send(result)
    })
}

// Removed
function registerEventFunction(request,response){
    dbComms.registerEventOnDb(request.body,function(result){
        response.status(200).send(result)
    })
    //response.status(200).send(request.body)
}


function addPromocaoFunction(request,response){
    let user = sessionHandler.verifyUser(request.body.Token)
    //mudar para admin
    if(user[0] && user[1]=='apostador'){
        dbComms.addPromocaoOnDb(request.body.Promocao).then((message)=>{
            response.status(200).send(message)
        }).catch((message)=>{
            response.status(400).send(message)
        })
    }
    else{
        response.status(400).send('Permission denied')
    }
}

function remPromocaoFunction(request,response){
    let user = sessionHandler.verifyUser(request.body.Token)
    //mudar para admin
    if(user[0] && user[1]=='apostador'){
        dbComms.remPromocaoOnDb(request.body.Codigo).then((message)=>{
            response.status(200).send(message)
        }).catch((message)=>{
            response.status(400).send(message)
        })
    }
    else{
        response.status(400).send('Permission denied')
    }
}

function usedCodFunction(request,response){
    let user = sessionHandler.verifyUser(request.body.ApostadorID)
    let answer
    if(user[0] && user[1]=='apostador'){
        dbComms.usedCodOnDb(user[0],request.body.Codigo).then((message)=>{
            answer=message
            return dbComms.walletOnDb(user[0])
        }).then((balance)=>{
            answer['Balance']=balance
            response.status(200).send(answer)
        }).catch((message)=>{
            response.status(400).send(message)
        })
    }
    else{
        response.status(400).send('Permission denied')
    }
}


function profileInfoFunction(request,response){
    let user = sessionHandler.verifyUser(request.body.ApostadorID)
    
    if(user[0] && user[1]=='apostador'){
        dbComms.profileInfoOnDb(user[0]).then((message)=>{
            
            response.status(200).send(message) 

        }).catch((message)=>{
            response.status(400).send(message)
        })
    }
    else{
        response.status(400).send('Permission denied')
    }

}


function betHistoryFunction(request,response){
    let user = sessionHandler.verifyUser(request.body.ApostadorID)
    let answer
    if(user[0] && user[1]=='apostador'){

        dbComms.betHistoryOnDb(user[0]).then((message)=>{
            answer=message
            return dbComms.walletOnDb(user[0])
        }).then((balance)=>{
            response.status(200).send({'lista':answer,'Balance':balance})
        }).catch((message)=>{
            response.status(400).send(message)
        })
    }
    else{
        response.status(400).send('Permission denied')
    }
}



function transHistFunction(request,response){
    let user = sessionHandler.verifyUser(request.body.ApostadorID)
    let answer
    if(user[0] && user[1]=='apostador'){
        
        dbComms.transHistOnDb(user[0]).then((message)=>{
            answer=message
            return dbComms.walletOnDb(user[0])
        }).then((balance)=>{
            response.status(200).send({'lista':answer,'Balance':balance})
        }).catch((message)=>{
            response.status(400).send(message)
        })
    }
    else{
        response.status(400).send('Permission denied')
    }
    
}

function startedEventsFunction(request,response){

    
    dbComms.startedEventOnDb(request.body.Desporto).then((message)=>{
        response.status(200).send(message)
    }).catch((message)=>{
        response.status(400).send(message)
    })
}



function returnEventList(request,response){
    let user = sessionHandler.verifyUser(request.query.token);
    if (user[1] == 'apostador' || user[1] == 'Admin' ) {// Apostador e Administrador
        response.status(200).send(evLst.getBETEvents(request.query.sport));
    }
    else if (user[1] == 'Special' ){// Especialista
        response.status(200).send(evLst.getNODDEvents(request.query.sport));
    }
    else  response.status(404).send("Not found");
    
}

function addEventOdds(request,response){
    let user = sessionHandler.verifyUser(request.body.token);
    if (user[1] == 'Special'){
        let flag = evLst.changeEventOdd(request.body.sport,request.body.EventoId,request.body.Odds);
        if (flag) response.status(200).send("Odds for event " + request.body.EventoId+ "were added");
        else response.status(404).send("Event not found");
    }
}


function initEventLst(){
    dbComms.getEventsOnDb((result)=>{
        for (let event of result){
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
    let flag = evLst.superOdds(request.body.sport,request.body.EventoID,request.body.multiplier);
    if (flag) response.status(200).send("Super odds for event "+request.body.EventoID+ " added");
    else response.status(404).send("Event not found");
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
    finEventFunction,
    suspndEventFunction,
    registerEventFunction,
    startedEventsFunction,
    addPromocaoFunction,
    remPromocaoFunction,
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