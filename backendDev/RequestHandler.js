const eventList = require("./Models/EventList");
const apiComms = require("./APICommunication/APICommunication")
const dbComms1 = require("./DBCommunication/DBcommunication");
const dbComms = new dbComms1();
const e = require("express");
const sessionHandler = require("./SessionHandler").getInstance();


function dummyFunction(request,response){
    response.status(200).send("Dummy here! But connection worked!")
}

function transactionFunction(request,response){
    dbComms.transactionOnDb(request.body,function(result){
        response.status(200).send(result)
    })
    
}

function registerFunction(request,response){
    dbComms.registerOnDb(request.body)
    response.status(200).send(request.body)
}

function loginFunction(request,response){
    dbComms.loginOnDb(request.body.Email,request.body.PlvPasse,function(result){
        console.log(result)
        let hash = sessionHandler.addUser(request.body.Email)
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
    dbComms.closeEventOnDb(request.body.Id)
    response.status(200).send(request.body)
}

function suspndEventFunction(request,response){
    dbComms.suspndEventOnDb(request.body.Id)
    response.status(200).send(request.body)
}

function registerBetFunction(request,response){
    dbComms.registerBetOnDb(request.body.Aposta,request.body.Evento)
    response.status(200).send(request.body)
}

function registerEventFunction(request,response){
    dbComms.registerEventOnDb(request.body)
    response.status(200).send(request.body)
}


function addPromocaoFunction(request,response){
    dbComms.addPromocaoOnDb(request.body)
    response.status(200).send(request.body)
}

function addcodeUsedFunction(request,response){
    dbComms.addcodeUsedOnDb(request.body)
    response.status(200).send(request.body)
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
    //initEventLst
}