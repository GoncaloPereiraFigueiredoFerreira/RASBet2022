const axios       = require('axios');
const fs          = require('fs');
const cnf         = require('config');
const getRequests = require("./Requests");
const parser      = require("./ResponseParsing");

//const PRIMEIRA_LIGA_FUT= 94;

const API_AUTH_KEY = cnf.get("API_AUTH_KEY");
const rspPath = cnf.get("responsePath");


function makeRequest(request,path,callback){
    axios(request)
    .then(function (response) {
      if (response == null || response.data.errors.length != 0){
        console.error("Errors found in response!\n")
        response.data.errors.map(x=> console.log(JSON.stringify(x)));
      }
      else{
        callback(response.data);
        fs.writeFileSync(path, JSON.stringify(response.data), { flag: 'w+' }, () =>{});
      }
    })
    .catch((error)=>{
      console.error(error);
    })
}

function makeRequestV2(request,path,callback){
  axios(request)
  .then(function (response) {
    if (response == null){
      console.error("Errors found in response!\n")
      response.data.errors.map(x=> console.log(JSON.stringify(x)));
    }
    else{
      callback(response.data);
      fs.writeFileSync(path, JSON.stringify(response.data), { flag: 'w+' }, () =>{});
    }
  })
  .catch((error)=>{
    console.error(error);
  })
}


function initEventLst(){
    let configFlag = cnf.get("update_on_startup");

    /// Futebol Events
    let futLeagueDic = cnf.get("futebol_league_id");
    let futpath = "";
    for (let league in futLeagueDic){

      futpath = rspPath + "fut" + futLeagueDic[league] + "res.json";
      if (configFlag || !fs.existsSync(futpath)){
        let req = getRequests.genFutRequest(API_AUTH_KEY,futLeagueDic[league],2022);
        makeRequest(req,futpath,parser.parseFutResp);
      }
      else {
        let json = JSON.parse(fs.readFileSync(futpath,"utf-8"));
        parser.parseFutResp(json);
      }
    }

    /// Portuguese futebol league alternative API
    futPTpath = rspPath + "futPTUseless.json";
    let req = getRequests.genUselessRequest();
    makeRequestV2(req,futPTpath,parser.parsePTFutResp);


    /// Formula 1 events
    f1Racespath = rspPath + "f1" + "Races" + "Res.json"
    if (configFlag || !fs.existsSync(f1Racespath)){

      let req = getRequests.genF1RacesRequest(API_AUTH_KEY);
      makeRequest(req,f1Racespath,auxF1);
    }
    else {
      let jsonRaces = JSON.parse(fs.readFileSync(f1Racespath,"utf-8"));
      auxF1(jsonRaces);
    }

    /// NBA
    nbapath = rspPath + "nba" + "Res.json";
    if (configFlag || !fs.existsSync(nbapath)){

      let req = getRequests.genBasketRequest(API_AUTH_KEY,cnf.get("nba_league_id"),"2022-2023");
      makeRequest(req,nbapath,parser.parseNBAResp);
    }
    else {
      let jsonNBA = JSON.parse(fs.readFileSync(nbapath,"utf-8"));
      parser.parseNBAResp(jsonNBA)
    }




}


function auxF1(jsonRaces){
  let configFlag = cnf.get("update_on_startup");
  f1Pilotspath = rspPath + "f1"+ "Pilots" +"Res.json";
  if (configFlag || !fs.existsSync(f1Pilotspath)){

    let req = getRequests.genF1DriversRequest(API_AUTH_KEY,2022);
    makeRequest(req,f1Pilotspath,(jsonPilots) =>{
        parser.parseF1Resp(jsonRaces,jsonPilots);
    });
  }
  else{
    let jsonPilots = JSON.parse(fs.readFileSync(f1Pilotspath,"utf-8"));
    parser.parseF1Resp(jsonRaces,jsonPilots);
  }


}


module.exports = {initEventLst};