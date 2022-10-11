const getRequests = require("./Requests");
const EventList = require("../Models/EventList");
const axios = require('axios');
const fs = require('fs');
const cnf = require('config');

const evntLst = EventList.getInstance();
const API_AUTH_KEY = cnf.get("API_AUTH_KEY");



function makeRequest(request,callback){
    axios(request)
    .then(function (response) {
      if (response == null || response.data.errors.length != 0){
        console.error("Errors found in response!\n")
        response.data.errors.map(x=> console.log(JSON.stringify(x)));
      }
      else{
        callback(response.data);
      }
    })
    .catch((error)=>{
      console.error(error);
    })
}