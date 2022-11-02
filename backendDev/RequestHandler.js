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



function registerBetFunction(request,response){
    let list=[]
    for(let i = 0 ; i< request.body.Eventos.length; i++){
        list.push(evLst.toDb(request.body.Eventos[i].Desporto,request.body.Eventos[i].EventoID))
    }
    let answer
    let user = sessionHandler.verifyUser(request.body.Aposta.ApostadorID)
    if(user[0] && user[1]=='apostador' && request.body.Eventos.length>0){
        request.body.Aposta.ApostadorID= user[0]
        
        dbComms.usedCodOnDb(request.body.Aposta.ApostadorID,request.body.Codigo).then((message)=>{
            if(message.Res=="Sim"){ 
                console.log("aqui")
                throw new Error("Codigo promocional ja utilizado")
            }
            console.log('test 1')
            return dbComms.registerEventOnDb(list)
        }).then((message)=>{
            
            return  dbComms.registerBetOnDb(request.body.Aposta,request.body.Eventos,request.body.Codigo)
        }).then((message)=>{
            
            answer=message
            return dbComms.walletOnDb(user[0])
        }).then((balanco)=>{
            answer['Balance']=balanco
            response.status(200).send(answer)
        }).catch((e)=>{
            console.log('catch')
            if(e.message){
                
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

    console.log(list)
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
    if(user[0] && user[1]=='Admin'){
        dbComms.closeEventOnDb(request.body.Evento.EventoID,request.body.Evento.Desporto).then((message)=>{
            console.log(message)
            evLst.closeEvent(request.body.Desporto,request.body.EventoID);
            response.status(200).send(message)
            
        }).catch((message)=>{
            response.status(400).send(message)
        }) 
    }
    else{
        response.status(400).send('Permission denied')
    }
}

function finEventFunction(request,response){

    let user = sessionHandler.verifyUser(request.body.Token)
    //mudar para admin
    if(user[0] && user[1]=='Admin'){
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


function betHistoryFunction(request,response){
    let user = sessionHandler.verifyUser(request.query.ApostadorID)
    let answer
   
    if(user[0] && user[1]=='apostador'){

        dbComms.betHistoryOnDb(user[0]).then((message)=>{
           
            for(let i =0 ; i<message.length;i++){
                let array = message[i].Descricao.split("#")
                message[i]['Codigo']=array[0]
                message[i]['Aridade']=array[1]
                message[i]['Jogos']=[]
                for(let j = 2; j<array.length ; j++){
                    let jogo = array[j].split(">")
                    
                    let dic={"Desporto":jogo[0],"Liga":jogo[1],"Descricao":jogo[2]}
                    message[i]['Jogos'].push(dic)
                }
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
    dbComms.startedEventOnDb("FUT").then((result)=>{
        apiComms.updateFutResults(result).then(()=>{
            for (let fixture of result){
                let event = evLst.getEventDB("FUT",fixture);
                if (event["Estado"] == "FIN"){
                    dbComms.finEventOnDb(fixture,"FUT",event["Resultado"]);
                }
            }
        });
    });
}


function updateF1Events(){ 
    dbComms.startedEventOnDb("F1").then((result)=>{

        apiComms.updateF1Results(result).then(()=>{
            for (let race of result){
                let event = evLst.getEventDB("F1",race);
                if (event["Estado"]  == "FIN")
                    dbComms.finEventOnDb(race,"F1",event["Resultado"]);
            }
        });
            

    });
}


function updateBSKEvents(){
    dbComms.startedEventOnDb("BSK").then((result)=>{
        apiComms.updateBSKResults(result).then(()=>{
            for (let game of result){
                let event = evLst.getEventDB("BSK",game);
                if (event["Estado"] == "FIN"){
                    dbComms.finEventOnDb(game,"BSK",event["Resultado"]);
                }
            }

        });
    })
}

function updateFUTPTEvents(){
    dbComms.startedEventOnDb("FUTPT").then((result)=>{
        apiComms.updateFUTPTResults(result).then(()=>{
        for (let game of result){
            let event= evLst.getEventDB("FUTPT",game);
            if (event["Estado"] == "FIN"){
                dbComms.finEventOnDb(game,"FUTPT",event["Resultado"]);
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
    suspndEventFunction,
    registerEventFunction,
    startedEventsFunction,
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