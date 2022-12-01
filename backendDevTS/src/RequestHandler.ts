import {EventList} from "./Models/EventList";
import {DBCommunication} from "./DBCommunication/DBCommunication";
import {SessionHandler} from "./SessionHandler";
const evLst:IEventList = EventList.getInstance()
const apiComms = require("./APICommunication/APICommunication");
const dbComms = new DBCommunication();
const e = require("express");
const sessionHandler:SessionHandler = SessionHandler.getInstance();
const notifcationCenter = require("./NotificationCenter");


import {Apostador,Transacao,Promocao,Aposta,Evento} from './DBCommunication/DBclasses';

function dummyFunction(request:any,response:any){
    response.status(200).send("Dummy here! But connection worked!")
}

/**
 * Function that deals with a http request to register an account in the database
 * 
 */
function registerFunction(request:any,response:any){

    let apostador = new Apostador(request.body)
    apostador.Balance=0
    
    dbComms.registerOnDb(apostador).then(()=>{
        let token=sessionHandler.addUser(apostador.Email,'apostador')
        response.status(200).send({"Token":token})
    }).catch((message:any)=>{
        response.status(400).send(message)
    })

    
}

/**
 * Function that deals with a http request to make a transaction 
 */
function transactionFunction(request:any,response:any){

    let transacao = new Transacao(request.body)

    let token = transacao.ApostadorID;
    let user = sessionHandler.verifyUser(transacao.ApostadorID);

    if(user[0] && user[1]=='apostador'){
        transacao.ApostadorID = user[0]
        dbComms.transactionOnDb(transacao).then(()=>{
            return dbComms.walletOnDb(user[0])
        }).then((message:number)=>{
            sessionHandler.sendNotification(token,{'Balance':message});
            response.sendStatus(200);
        }).catch((message:any)=>{
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
function loginFunction(request:any,response:any){
    
    let Email= request.body.Email
    let PlvPasse= request.body.PlvPasse

    dbComms.loginOnDb(Email,PlvPasse).then((message:any)=>{
        
        message['Token']=sessionHandler.addUser(Email,message.FRole)
        response.status(200).send(message)

    }).catch((message:any)=>{
        response.status(400).send(message)
    })

}


/**
 * Function that deals with a http request to register a bet
 */
function registerBetFunction(request:any,response:any){

    let list:Evento[]=[]
    let aposta = new Aposta(request.body.Aposta)
    let Eventos = request.body.Eventos

    for(let i = 0 ; i< request.body.Eventos.length; i++){
        list.push(new Evento(evLst.getEventDB(request.body.Eventos[i].Desporto,request.body.Eventos[i].EventoID)))
    }
    
    let user = sessionHandler.verifyUser(aposta.ApostadorID)
    let token = aposta.ApostadorID;
    if(user[0] && user[1]=='apostador' && request.body.Eventos.length>0){
        
        aposta.ApostadorID= user[0]
        
        dbComms.usedCodOnDb(aposta.ApostadorID,aposta.Codigo).then((message:any)=>{
           
            if(message.Res=="Sim"){ 
              
                return Promise.reject({"error":"Codigo promocional ja utilizado"})
            }
            return dbComms.registerEventOnDb(list)
        }).then(()=>{
            
            return  dbComms.registerBetOnDb(aposta,Eventos,aposta.Codigo)
        }).then(()=>{
            return dbComms.walletOnDb(user[0])
        }).then((balanco:any)=>{
                 
            for(let i = 0 ; i< request.body.Eventos.length; i++){
                evLst.updateOddBet(request.body.Eventos[i].Desporto,request.body.Eventos[i].EventoID,aposta.Montante,request.body.Eventos[i].Escolha);
            }
            sessionHandler.sendNotification(token,{"Balance":balanco});
            response.sendStatus(200);

        }).catch((e:any)=>{
        
            response.status(400).send(e)
        })
        
    }
    else{
        response.status(400).send('Permission denied')
    }
}


/**
 * Function that deals with a http request to edit a profile of an account
 */
function editProfileFunction(request:any,response:any){
    let list:string=""
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
    
    if(user[0] && user[1]=='apostador'){
        dbComms.editProfileOnDb(list,user[0]).then((message:any)=>{
            
            response.status(200).send(message)
        }).catch((message:any)=>{
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
function closeEventFunction(request:any,response:any){

    let EventoID= request.body.Evento.EventoID
    let Desporto= request.body.Evento.Desporto

    let user = sessionHandler.verifyUser(request.body.Token)
    console.log(user)
    //mudar para admin
    if(user[0] && user[1]=='Admin'){
        dbComms.closeEventOnDb(EventoID,Desporto).then((message:any)=>{
           
            evLst.closeEvent(Desporto,EventoID);
            
            for(let tuple of message.toNotify){
                console.log(`Email ${tuple[0]} e mensagem ${tuple[1]}`)
                //Send email
                //notifcationCenter.sendMail(tuple[0],'Finalizacao Aposta',tuple[1],null)

                // Notify wallet
                let token = sessionHandler.getToken(tuple[0]);
             
                return dbComms.walletOnDb(tuple[0]).then((info:number)=>{
                   
                    sessionHandler.sendNotification(token,{"Balance":info});
                }).catch((e)=>{
                    
                    return Promise.reject(e)
                });
            }
            response.status(200).send({'Res':message.Res})
            
        }).catch((message:any)=>{
            
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
function finEventFunction(request:any,response:any){

    let EventoID = request.body.Evento.EventoID
    let Desporto = request.body.Evento.Desporto
    let Resultado = request.body.Evento.Resultado
    let Descricao = 'nova descricao'

    let user = sessionHandler.verifyUser(request.body.Token)
    //mudar para admin
    if(user[0] && user[1]=='Admin'){
        dbComms.finEventOnDb(EventoID,Desporto,Resultado,Descricao).then((message:any)=>{
            for(let tuple of message.toNotify){
                console.log(`Email ${tuple[0]} e mensagem ${tuple[1]}`)
                //notifcationCenter.sendMail(tuple[0],'Finalizacao Aposta',tuple[1],null)

                // Notify wallet
                let token = sessionHandler.getToken(tuple[0]);
                dbComms.walletOnDb(tuple[0]).then((info:any)=>{sessionHandler.sendNotification(token,{"Balance":info});});
                
            }
            
            response.status(200).send({'Res':message.Res})
        }).catch((message:any)=>{
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
function addPromocaoFunction(request:any,response:any){
    let user = sessionHandler.verifyUser(request.body.Token)
    let promocao = new Promocao(request.body.Promocao)
    if(user[0] && user[1]=='Admin'){
        dbComms.addPromocaoOnDb(promocao).then((message:any)=>{
            response.status(200).send(message)
        }).catch((message:any)=>{
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
function remPromocaoFunction(request:any,response:any){
    let user = sessionHandler.verifyUser(request.body.Token)
    
    if(user[0] && user[1]=='Admin'){
        dbComms.remPromocaoOnDb(request.body.Codigo).then((message:any)=>{
            response.status(200).send(message)
        }).catch((message:any)=>{
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
function getpromocaoFunction(request:any,response:any){
    let user = sessionHandler.verifyUser(request.query.Token)
    
    if(user[0] && user[1]=='Admin'){
        
        dbComms.getPromocaoOnDb().then((message:any)=>{
            response.status(200).send(message)
        }).catch((message:any)=>{
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
function usedCodFunction(request:any,response:any){
    let user = sessionHandler.verifyUser(request.query.ApostadorID)
   
    if(user[0] && user[1]=='apostador'){
        dbComms.usedCodOnDb(user[0],request.query.Codigo).then((message:any)=>{
            
            response.status(200).send(message)
        }).catch((message:any)=>{
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
function profileInfoFunction(request:any,response:any){
    let user = sessionHandler.verifyUser(request.query.ApostadorID)
    
    if(user[0] && user[1]=='apostador'){
        dbComms.profileInfoOnDb(user[0]).then((message:any)=>{
            
            response.status(200).send(message) 

        }).catch((message:any)=>{
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
function betHistoryFunction(request:any,response:any){
    let user = sessionHandler.verifyUser(request.query.ApostadorID)
    
    if(user[0] && user[1]=='apostador'){
        dbComms.betHistoryOnDb(user[0]).then(async(message:any)=>{
            
            response.status(200).send({'lista':message})
        }).catch((message:any)=>{
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
function transHistFunction(request:any,response:any){
    let user = sessionHandler.verifyUser(request.query.ApostadorID)
    if(user[0] && user[1]=='apostador'){
        
        dbComms.transHistOnDb(user[0]).then((message:any)=>{
            
            response.status(200).send({'lista':message})
        }).catch((message:any)=>{
            response.status(400).send(message)
        })
    }
    else{
        response.status(400).send('Permission denied')
    }
    
}


function returnEventList(request:any,response:any){
    let user = sessionHandler.verifyUser(request.query.token);
    if (user[1]== 'Admin'){
        let lst = evLst.getBETEvents(request.query.sport).concat( evLst.getNODDEvents(request.query.sport));
        response.status(200).send(
            {
                "EventList": lst,
                "Leagues": evLst.getLeagues(request.query.sport)
            });
    }
    else if (user[1] == 'apostador') {
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

function addEventOdds(request:any,response:any){
    let user = sessionHandler.verifyUser(request.body.token);
    if (user[1] == 'Special'){
        let flag = evLst.changeEventOdd(request.body.sport,request.body.EventoId,request.body.Odds);
        if (flag) response.status(200).send("Odds for event " + request.body.EventoId+ "were added");
        else response.status(404).send("Event not found");
    }    
    else{
        response.status(400).send('Permission denied')
    }
}


function initEventLst(){
    dbComms.getEventsOnDb().then((result:any)=>{
        for (let event of result){
            evLst.addEventFromDB(event.Desporto,event.Liga,event.ID,event.Descricao,event.Resultado,event.Estado,event.DataEvent);
        }
        apiComms.initEventLst();
    }).catch((e:any)=>{
        console.log(e)
    })
}



function updateFUTEvents(){
    return new Promise<void>((resolve,reject)=>{
    dbComms.startedEventOnDb("FUT").then((result:any)=>{
        apiComms.updateFutResults(result).then(async()=>{
            for (let fixture of result){
                let event = evLst.getEventDB("FUT",fixture);
                if (event["Estado"] == "FIN"){
                    await dbComms.finEventOnDb(fixture,"FUT",event["Resultado"],event["Descricao"]).then((message:any)=>{
                        for(let tuple of message.toNotify){
                            console.log(`Email ${tuple[0]} e mensagem ${tuple[1]}`)
                            //notifcationCenter.sendMail(tuple[0],'Finalizacao Aposta',tuple[1],null)
                            let token = sessionHandler.getToken(tuple[0]);
                            dbComms.walletOnDb(tuple[0]).then((info:any)=>{sessionHandler.sendNotification(token,{"Balance":info});});
                
                        }
                    });
                }
            }
            resolve();
        });
    });
});
}


function updateF1Events(){ 
    return new Promise<void>((resolve,reject)=>{
    dbComms.startedEventOnDb("F1").then((result:any)=>{

        apiComms.updateF1Results(result).then(async()=>{
            for (let race of result){
                let event = evLst.getEventDB("F1",race);
                if (event["Estado"]  == "FIN")
                    await dbComms.finEventOnDb(race,"F1",event["Resultado"],event["Descricao"]).then((message:any)=>{
                        for(let tuple of message.toNotify){
                            console.log(`Email ${tuple[0]} e mensagem ${tuple[1]}`)
                            //notifcationCenter.sendMail(tuple[0],'Finalizacao Aposta',tuple[1],null)
                            let token = sessionHandler.getToken(tuple[0]);
                            dbComms.walletOnDb(tuple[0]).then((info:any)=>{sessionHandler.sendNotification(token,{"Balance":info});});
                        }
                    });
                    // Here we should notify all the users afected by the end of that event
            }
            resolve();
        });
            

    });
});
}


function updateBSKEvents(){
    return new Promise<void>((resolve,reject)=>{
    dbComms.startedEventOnDb("BSK").then((result:any)=>{
        apiComms.updateBSKResults(result).then(async()=>{
            for (let game of result){
                let event = evLst.getEventDB("BSK",game);
                if (event["Estado"] == "FIN"){
                    await dbComms.finEventOnDb(game,"BSK",event["Resultado"],event["Descricao"]).then((message:any)=>{
                        for(let tuple of message.toNotify){
                            console.log(`Email ${tuple[0]} e mensagem ${tuple[1]}`)
                            //notifcationCenter.sendMail(tuple[0],'Finalizacao Aposta',tuple[1],null)
                            let token = sessionHandler.getToken(tuple[0]);
                            dbComms.walletOnDb(tuple[0]).then((info:any)=>{sessionHandler.sendNotification(token,{"Balance":info});});
                        }
                    });
                    // Here we should notify all the users afected by the end of that event
                }
            }
            resolve();
        });
    })
});
}

function updateFUTPTEvents(){
    return new Promise<void>((resolve,reject)=>{
        dbComms.startedEventOnDb("FUTPT").then((result:any)=>{
            apiComms.updateFUTPTResults(result).then(async()=>{
            for (let game of result){
                let event= evLst.getEventDB("FUTPT",game);
                if (event["Estado"] == "FIN"){
                    await dbComms.finEventOnDb(game,"FUTPT",event["Resultado"],event["Descricao"]).then((message:any)=>{
                        for(let tuple of message.toNotify){
                            console.log(`Email ${tuple[0]} e mensagem ${tuple[1]}`)
                            //notifcationCenter.sendMail(tuple[0],'Finalizacao Aposta',tuple[1],null)
                            let token = sessionHandler.getToken(tuple[0]);
                            dbComms.walletOnDb(tuple[0]).then((info:any)=>{sessionHandler.sendNotification(token,{"Balance":info});});
                        }
                    });
                    // Here we should notify all the users afected by the end of that event
                } 
            }
            resolve();
        })
    })
    })

}

function updateResults(){
    return new Promise<void>((resolve,reject)=>{
        updateFUTEvents().then(() => evLst.removePastEvents("FUT"))
        updateF1Events().then(() =>evLst.removePastEvents("F1"))
        updateBSKEvents().then(() =>evLst.removePastEvents("BSK"))
        updateFUTPTEvents().then(() =>evLst.removePastEvents("FUTPT"));
        resolve();
    });

}





function updateEvents(request:any,response:any){
    let user = sessionHandler.verifyUser(request.query.token);
    if (user[1] == "Admin" ){
        updateResults();    
        apiComms.updateEventLst();
        response.sendStatus(200);     
    }
    else{
        response.status(400).send('Permission denied')
    }
}


function activateSuperOdds(request:any,response:any){
    let user = sessionHandler.verifyUser(request.body.token);
    if (user[1] == "Admin"){
        let flag = evLst.superOdds(request.body.sport,request.body.EventoID,request.body.multiplier);
        if (flag) response.status(200).send("Super odds for event "+request.body.EventoID+ " added");
        else response.status(404).send("Event not found");
    }else{
        response.status(400).send('Permission denied')
    }
}

function getOdds(request:any,response:any){
    response.status(200).send(evLst.getOdds(request.body.sport,request.body.EventoID))
}



function eventHandler(request:any,response:any,next:any){
    let token = request.query.token;
    let user = sessionHandler.verifyUser(token);
    if (user[1] == "apostador"){
        response.setHeader('Content-Type', 'text/event-stream');
        response.setHeader('Connection', 'keep-alive');
        response.setHeader('Cache-Control', 'no-cache');
        response.setHeader('X-Accel-Buffering', 'no');
        response.setHeader('Access-Control-Allow-Origin', "*");
        sessionHandler.addGate(token,response);
        dbComms.walletOnDb(user[0]).then((info:any)=>{sessionHandler.sendNotification(token,{"Balance":info});});
        request.on('close', () => {
            sessionHandler.closeConnection(token);
        });
    }
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
    addEventOdds,
    eventHandler
    
}