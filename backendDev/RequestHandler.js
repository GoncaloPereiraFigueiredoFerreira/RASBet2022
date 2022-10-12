
const eventList = require("./Models/EventList");
const apiComms = require("./APICommunication/APICommunication")

function dummyFunction(request,response){
    response.status(200).send("Dummy here! But connection worked!")
}

function initEventLst(){
    apiComms.initEventLst();
}


module.exports = {
    dummyFunction,
    initEventLst
}