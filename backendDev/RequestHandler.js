
const eventList = require("./Models/EventList");

function dummyFunction(request,response){
    response.status(200).send("Dummy here! But connection worked!")
}

module.exports = {
    dummyFunction
}