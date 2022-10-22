const eventList = require("./Models/EventList");
const apiComms = require("./APICommunication/APICommunication")
const dbComms1 = require("./DBCommunication/DBcommunication");
const dbComms = new dbComms1();
const e = require("express");
const SessionHandler = require("./SessionHandler");
const sessionHandler = require("./SessionHandler").getInstance();


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
            response.status(200).send(sessionHandler.addUser(request.body.Email,'apostador'))
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
            result['Token']=sessionHandler.vu(request.body.Email)
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


function initEventLst(){
    apiComms.initEventLst();
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
    transHistFunction
}