/**
 * @file APICommunication.js
 * This module is responsible for coordenating the interaction with the external APIs
 * that suply the application with information about upcoming events and their respective results
 * 
 */

/// Required Modules
const axios       = require('axios');
const fs          = require('fs');
const cnf         = require('config');
const getRequests = require("./Requests");
const parser      = require("./ResponseParsing");


/// API authentication key
const API_AUTH_KEY = cnf.get("API_AUTH_KEY");

/// Path where the json response files will be stored
const rspPath = cnf.get("responsePath");


/**
 * Function responsible for sending a http request and writting the contents of the response to a file
 * 
 * @param {object} request object that specifies the configurations of a http request 
 * @param {String} path path where the response should be written
 * @param {Function} callback function that executes when the request is finnished
 */
function makeRequest(request,path,callback){
    axios(request)
    .then( (response) => {

          if (response == null ){
            console.error("Null response\n")
          }
          else{
            callback(response.data);
            if (path != undefined && response.data.errors.length != 0) fs.writeFileSync(path, JSON.stringify(response.data), { flag: 'w+' }, () =>{});
          }})

    .catch((error)=>{
      console.error(error);
    })
}


/**
 * Function responsible for sending a http request and writting the contents of the response to a file
 * 
 * @param {object} request object that specifies the configurations of a http request 
 * @param {String} path path where the response should be written
 * @param {Function} callback function that executes when the request is finnished
 */
 function makeRequestPT(request,path,callback){
  axios(request)
  .then( (response) => {

        if (response == null ){
          console.error("Null response\n")
        }
        else{
          callback(response.data);
          if (path != undefined) fs.writeFileSync(path, JSON.stringify(response.data), { flag: 'w+' }, () =>{});
        }})

  .catch((error)=>{
    console.error(error);
  })
}

/**
 * Initializes the futebol events that come from the SPORTS.API api
 */
function initExternalFUTEvents(){
  /// Futebol Events
  let configFlag = cnf.get("update_on_startup");
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
}

/**
 * Initializes the futebol events that come from the ucras API
 */
function initPTFUTEvents(){
    /// Portuguese futebol league alternative API
    futPTpath = rspPath + "futPTUseless.json";
    let req = getRequests.genUselessRequest();
    makeRequestPT(req,futPTpath,parser.parsePTFutResp);
}

/**
 * Initializes the formula one events begining by getting the races
 */
function initF1Events(){
      /// Formula 1 events
      let configFlag = cnf.get("update_on_startup");
      f1Racespath = rspPath + "f1" + "Races" + "Res.json"
      
      if (configFlag || !fs.existsSync(f1Racespath)){
  
        let req = getRequests.genF1RacesRequest(API_AUTH_KEY);
        makeRequest(req,f1Racespath,initF1Events2);

      }
      else {
        let jsonRaces = JSON.parse(fs.readFileSync(f1Racespath,"utf-8"));
        initF1Events2(jsonRaces);
      }
}

/**
 * Completes the initialization of the formula one events by fetching the name of the drivers for a current season
 * @param {JSON} jsonRaces json file that contains the races for a given season 
 */
function initF1Events2(jsonRaces){
  /// Formula 1 events part2
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


/**
 * Initializes the NBA events for the application
 */
function initNBAEvents(){
    /// NBA
    let configFlag = cnf.get("update_on_startup");
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

/**
 * Initializes all the possible sports in the application
 */
function initEventLst(){
    initExternalFUTEvents();
    initPTFUTEvents();
    initF1Events();
    initNBAEvents();
}


/**
 * Updates the status of a given list of futebol events
 * @param {List} fixtures list of ids for futebol events 
 */
function updateFutResults(fixtures){
  let fixturesLst = []
  let fixtureStr = ""
  let i =0;
  let l =0;
  while (i<fixtures){
    l=0;
    while(l<20 && i<fixture){
      fixtureStr += fixtures[i] + "-" 
      l++;
      i++;
    }
    fixtureStr.slice(0,-1);
    fixturesLst.push(fixtureStr);
  }
  for (let request of fixturesLst){
    let req = getRequests.genFutResultRequest(API_AUTH_KEY,request);
    makeRequest(req,undefined,parser.parseFutResp);

  }
}

function updateF1Results(races){
  for (let race of races){
    let req = getRequests.genRaceRankingsRequest(API_AUTH_KEY,race);
    makeRequest(req,undefined,parser.parseF1Resp);
  }
}

function updateBSKResults(games){
  for (let game of games){
    let req = getRequests.genBasketResultRequest(API_AUTH_KEY,game);
    makeRequest(req,undefined,parser.parseNBAResultResp);
  }
}

function updateFUTPTResults(games){
  let req = getRequests.genUselessRequest();
  axios(req)
  .then( (response) => {
    
        if (response == null ){
          console.error("Null response\n")
        }
        else{
          parser.parsePTFutResp(games,response.data)
          if (path != undefined) fs.writeFileSync(path, JSON.stringify(response.data), { flag: 'w+' }, () =>{});
        }})

  .catch((error)=>{
    console.error(error);
  })
}



module.exports = {initEventLst,updateFutResults,updateF1Results,updateBSKResults,updateFUTPTResults};