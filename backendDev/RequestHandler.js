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

/**
 * Function that deals with a http request to register an account in the database
 * 
 */
function registerFunction(request,response){

    dbComms.registerOnDb(request.body).then((message)=>{
        return dbComms.walletOnDb(request.body.Email)
    }).then((message)=>{
        response.status(200).send({"Token":sessionHandler.addUser(request.body.Email,'apostador'),"Balance":message})
    }).catch((message)=>{
        response.status(400).send(message)
    })

    
}

/**
 * Function that deals with a http request to make a transaction 
 */
function transactionFunction(request,response){
    
    let user =  sessionHandler.verifyUser(request.body.ApostadorID)
    if(user[0] && user[1]=='apostador'){
        request.body.ApostadorID= user[0]
        dbComms.transactionOnDb(request.body).then((message)=>{
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


/**
 * function that deals with a http request to check if the given credentials are in the database
 */
function loginFunction(request,response){
    
    let answer
    dbComms.loginOnDb(request.body.Email,request.body.PlvPasse).then((message)=>{
        answer=message
        answer['Token']=sessionHandler.addUser(request.body.Email,message.FRole)
        if(message.FRole=='apostador'){
            return dbComms.walletOnDb(request.body.Email)
        }
        else return 0
        
    }).then((balanco)=>{
        answer['Balance']=balanco
        response.status(200).send(answer)
    }).catch((message3)=>{
        response.status(400).send(message3)
    })

}


/**
 * Function that deals with a http request to register a bet
 */
function registerBetFunction(request,response){
    let list=[]
    for(let i = 0 ; i< request.body.Eventos.length; i++){
        list.push(evLst.toDb(request.body.Eventos[i].Desporto,request.body.Eventos[i].EventoID))
    }
    let answer
    let user = sessionHandler.verifyUser(request.body.Aposta.ApostadorID)
    if(user[0] && user[1]=='apostador' && request.body.Eventos.length>0){
        
        request.body.Aposta.ApostadorID= user[0]
        
        dbComms.usedCodOnDb(request.body.Aposta.ApostadorID,request.body.Aposta.Codigo).then((message)=>{
           
            if(message.Res=="Sim"){ 
              
                throw new Error("Codigo promocional ja utilizado")
            }
            return dbComms.registerEventOnDb(list)
        }).then((message)=>{
            
            return  dbComms.registerBetOnDb(request.body.Aposta,request.body.Eventos,request.body.Aposta.Codigo)
        }).then((message)=>{
            
            return dbComms.walletOnDb(user[0])
        }).then((balanco)=>{
            answer['Balance']=balanco
            
          for(let i = 0 ; i< request.body.Eventos.length; i++){
              evLst.updateOddBet(request.body.Eventos[i].Desporto,request.body.Eventos[i].EventoID,request.body.Aposta.Montante,request.body.Eventos[i].Escolha);
         }
            response.status(200).send(answer)

           

        }).catch((e)=>{
           
            if(e.message){
                console.error(e);
                response.status(400).send({'error':e.message})
            }
            else{
                response.status(400).send(e)
            }
        })
        
    }
    else{
        response.status(400).send('Permission denied')
    }
}


/**
 * Function that deals with a http request to edit a profile of an account
 */
function editProfileFunction(request,response){
    list=""
    let size = Object.keys(request.body).length-1
    if(request.body.Morada){
        list+=`Morada='${request.body.Morada}'`
        size--
        if(size>0)list+=','
    }
    if(request.body.Nome){
        list+=`Nome='${request.body.Nome}'`
        size--
        if(size>0)list+=','
    }
    if(request.body.Telemovel){
        list+=`Telemovel='${request.body.Telemovel}'`
        size--
        if(size>0)list+=','
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



/**
 * Function that deals with a http request to close an event
 */
function closeEventFunction(request,response){
    
    let user = sessionHandler.verifyUser(request.body.Token)
    //mudar para admin
    if(user[0] && user[1]=='Admin'){
        dbComms.closeEventOnDb(request.body.Evento.EventoID,request.body.Evento.Desporto).then((message)=>{
          
            evLst.closeEvent(request.body.Evento.Desporto,request.body.Evento.EventoID);
            response.status(200).send(message)
            
        }).catch((message)=>{
            response.status(400).send(message)
        }) 
    }
    else{
        response.status(400).send('Permission denied')
    }
}

/**
 * Function that deals with a http request to finalize an event
 */
function finEventFunction(request,response){

    let user = sessionHandler.verifyUser(request.body.Token)
    //mudar para admin
    if(user[0] && user[1]=='Admin'){
        dbComms.finEventOnDb(request.body.Evento.EventoID,request.body.Evento.Desporto,request.body.Evento.Resultado,"descricao mudada").then((message)=>{
            response.status(200).send(message)
        }).catch((message)=>{
            response.status(400).send(message)
        }) 
    }
    else{
        response.status(400).send('Permission denied')
    }
}

/**
 * Function that deals with a http request to add a promocional code to the database
 */
function addPromocaoFunction(request,response){
    let user = sessionHandler.verifyUser(request.body.Token)
    
    if(user[0] && user[1]=='Admin'){
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

/**
 * Function that deals with a http request to remove a promocional code from the database
 */
function remPromocaoFunction(request,response){
    let user = sessionHandler.verifyUser(request.body.Token)
    
    if(user[0] && user[1]=='Admin'){
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

/**
 * Function that deals with a http request to get all existing promocional codes in the database
 */
function getpromocaoFunction(request,response){
    let user = sessionHandler.verifyUser(request.query.Token)
    
    if(user[0] && user[1]=='Admin'){
        
        dbComms.getpromocaoOnDb().then((message)=>{
            response.status(200).send(message)
        }).catch((message)=>{
            response.status(400).send(message)
        })
    }
    else{
        response.status(400).send('Permission denied')
    }
}

/**
 * Function that deals with a http request to check if a given better already used a given promocional code
 */
function usedCodFunction(request,response){
    let user = sessionHandler.verifyUser(request.query.ApostadorID)
    let answer
    if(user[0] && user[1]=='apostador'){
        dbComms.usedCodOnDb(user[0],request.query.Codigo).then((message)=>{
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

/**
 * Function that deals with a http request to get the profile of a given account
 */
function profileInfoFunction(request,response){
    let user = sessionHandler.verifyUser(request.query.ApostadorID)
    
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

/**
 * Function that deals with a http request to get the bet history of a given better
 */
// function betHistoryFunction(request,response){
//     let user = sessionHandler.verifyUser(request.query.ApostadorID)
//     let answer

//     if(user[0] && user[1]=='apostador'){

//         dbComms.betHistoryOnDb(user[0]).then(async(message)=>{
//             answer=message

//             return dbComms.walletOnDb(user[0])
//         }).then((balance)=>{
//             response.status(200).send({'lista':answer,'Balance':balance})
//         }).catch((message)=>{
//             response.status(400).send(message)
//         })
//     }
//     else{
//         response.status(400).send('Permission denied')
//     }
// }


function betHistoryFunction(request,response){
    let user = sessionHandler.verifyUser(request.query.ApostadorID)
    let answer

    if(user[0] && user[1]=='apostador'){
        
        dbComms.betHistoryOnDb(user[0]).then(async(message)=>{
         
            for(let i =0 ; i<message.length;i++){
            
                await dbComms.betHistoryOnDb2(message[i].ID).then((dados_jogos)=>{
                    message[i]['Jogos']=dados_jogos
                    if(dados_jogos.length>1){
                        message[i]['Aridade']="Multipla"
                    }
                    else message[i]['Aridade']="Simples"
                })
            }
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


/**
 * Function that deals with a http request to get the transaction history of a given better
 */
function transHistFunction(request,response){
    let user = sessionHandler.verifyUser(request.query.ApostadorID)
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


function returnEventList(request,response){
    let user = sessionHandler.verifyUser(request.query.token);
    if (user[1] == 'apostador' || user[1] == 'Admin' ) {// Apostador e Administrador
        response.status(200).send(
            {
                "EventList": evLst.getBETEvents(request.query.sport),
                "Leagues": evLst.getLeagues(request.query.sport)
            });
    }
    else if (user[1] == 'Special' ){// Especialista
        response.status(200).send(
            {
                "EventList": evLst.getNODDEvents(request.query.sport),
                "Leagues": evLst.getLeagues(request.query.sport)
            });
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
    dbComms.startedEventOnDb("FUT").then((result)=>{
        apiComms.updateFutResults(result).then(async()=>{
            for (let fixture of result){
                let event = evLst.getEventDB("FUT",fixture);
                if (event["Estado"] == "FIN"){
                    await dbComms.finEventOnDb(fixture,"FUT",event["Resultado"],event["Descricao"]);
                    // Here we should notify all the users afected by the end of that event
                }
            }
        });
    });
}


function updateF1Events(){ 
    dbComms.startedEventOnDb("F1").then((result)=>{

        apiComms.updateF1Results(result).then(async()=>{
            for (let race of result){
                let event = evLst.getEventDB("F1",race);
                if (event["Estado"]  == "FIN")
                    await dbComms.finEventOnDb(race,"F1",event["Resultado"],event["Descricao"]);
                    // Here we should notify all the users afected by the end of that event
            }
        });
            

    });
}


function updateBSKEvents(){
    dbComms.startedEventOnDb("BSK").then((result)=>{
        apiComms.updateBSKResults(result).then(async()=>{
            for (let game of result){
                let event = evLst.getEventDB("BSK",game);
                if (event["Estado"] == "FIN"){
                    await dbComms.finEventOnDb(game,"BSK",event["Resultado"],event["Descricao"]);
                    // Here we should notify all the users afected by the end of that event
                }
            }

        });
    })
}

function updateFUTPTEvents(){
    dbComms.startedEventOnDb("FUTPT").then((result)=>{
        apiComms.updateFUTPTResults(result).then(async()=>{
        for (let game of result){
            let event= evLst.getEventDB("FUTPT",game);
            if (event["Estado"] == "FIN"){
                await dbComms.finEventOnDb(game,"FUTPT",event["Resultado"],event["Descricao"]);
                // Here we should notify all the users afected by the end of that event
            } 
        }
    
    })
})
}




function updateEvents(request,response){
    updateFUTEvents();
    updateF1Events();
    updateBSKEvents();
    updateFUTPTEvents();
    response.sendStatus(200)
}


function activateSuperOdds(request,response){
    let user = sessionHandler.verifyUser(request.body.token);
    if (user[1] == "Admin"){
        let flag = evLst.superOdds(request.body.sport,request.body.EventoID,request.body.multiplier);
        if (flag) response.status(200).send("Super odds for event "+request.body.EventoID+ " added");
        else response.status(404).send("Event not found");
    }
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
    addPromocaoFunction,
    remPromocaoFunction,
    getpromocaoFunction,
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