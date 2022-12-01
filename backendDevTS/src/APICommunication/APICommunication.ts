/**
 * @file APICommunication.js
 * This module is responsible for coordenating the interaction with the external APIs
 * that suply the application with information about upcoming events and their respective results
 * 
 */

/// Required Modules
import axios from 'axios';
import fs from 'fs';
const cnf          = require('config');
import getRequests = require("./Requests");
import parser      = require("./ResponseParsing");


/// API authentication key
const API_AUTH_KEY = cnf.get("API_AUTH_KEY");

/// Path where the json response files will be stored
const rspPath = cnf.get("responsePath");

/**
 * Function responsible for sending a http request
 * 
 * @param {object} request object that specifies the configurations of a http request 
 * @param {function} callback function that executes when the request is finished
 */
 function makeRequest(request:any,callback:Function){
    return new Promise<void>((resolve,reject)=>{
      axios(request)
      .then( (response:any) => {
          if (response == null && response.status!=200){
            console.error("Error found in the request response.\n")
            reject();
          }
          else{      
            callback(response.data);
            resolve();
          }})
    .catch((error:any)=>{
      //console.error(error);
      reject(error);
    })})
}


/**
 * Fetches the football events from SportsAPI
 * @param {boolean} startUp Flag that indicates if it is the start up of the program
 */
 function fetchFootballEvents(startUp:boolean){
    let configFlag = cnf.get("update_on_startup");
    let futLeagueDic = cnf.get("futebol_league_id");
    for (let league in futLeagueDic){
        let futpath = rspPath + "fut" + futLeagueDic[league] + "res.json";
        let existsFile = fs.existsSync(futpath);
        if (!existsFile || (configFlag && startUp)  || !startUp){
            let req = getRequests.genFutRequest(API_AUTH_KEY,futLeagueDic[league],2022);
            makeRequest(req,(json:any)=>{
                let noErrors = parser.parseFutResp(json);
                if (!existsFile && noErrors) fs.writeFile(futpath, JSON.stringify(json.data), { flag: 'w+' }, () =>{});
            }).catch((error)=>console.log("Error in footbal events fetch. Startup: ", startUp, "\nErrors:",error));
        }
        else
        { 
            let json = JSON.parse(fs.readFileSync(futpath,"utf-8"));
            parser.parseFutResp(json);
        }
    }
}

/**
 * Fills the event list with Footbal events from the portuguese league
 * @param {boolean} startUp Boolean value that defines if this fetch is made at start up
 */
function fetchPTFootballEvents(){  
    let futPTpath = rspPath + "futPT.json";
    let req = getRequests.genFUTPTRequest();
    makeRequest(req,(json:any) => {
      let noErrors =parser.parsePTFutResp(json);
      if (noErrors) fs.writeFile(futPTpath, JSON.stringify(json.data), { flag: 'w+' }, () =>{});
    })
    .catch((error)=>{
        if (fs.existsSync(futPTpath)){
            console.warn("Cant acess API! Reading cached file")
            let futptJson = JSON.parse(fs.readFileSync(futPTpath,"utf-8"));
            parser.parsePTFutResp(futptJson);
        }
        else {
            console.error("Cant find file or contact API FUTPT")
        }
    });
}

/**
 * Fills the event list with F1 events
 * @param {boolean} startUp Boolean value that defines if this fetch is made at start up
 */
function fetchF1Events(startUp:boolean){
    let configFlag = cnf.get("update_on_startup");
    let f1Racespath = rspPath + "f1" + "Races" + "Res.json"  
    let existsFile = fs.existsSync(f1Racespath);
    if ( !existsFile || (configFlag && startUp)  || !startUp){
        let req = getRequests.genF1RacesRequest(API_AUTH_KEY);
        makeRequest(req,(json:any) =>{
          fetchF1Events2(startUp,json);
          if (!existsFile) fs.writeFile(f1Racespath, JSON.stringify(json), { flag: 'w+' }, () =>{});
        }).catch((error)=>console.log("Error in f1 events fetch. Startup: ", startUp));
    }
    else{
        let json = JSON.parse(fs.readFileSync(f1Racespath,"utf-8"));
        fetchF1Events2(startUp,json);
    }
}

/**
 * Fills the event list with F1 events
 * @param {boolean} startUp Boolean value that defines if this fetch is made at start up
 */
function fetchF1Events2(startUp:boolean,jsonRaces:any){
    let configFlag = cnf.get("update_on_startup");
    let f1Pilotspath = rspPath + "f1"+ "Pilots" +"Res.json";
    let existsFile =fs.existsSync(f1Pilotspath);
    if (!existsFile  || (configFlag && startUp)  || !startUp){
        let req = getRequests.genF1DriversRequest(API_AUTH_KEY,2022);
        makeRequest(req,(jsonPilots:any) =>{
            let noErrors = parser.parseF1Resp(jsonRaces,jsonPilots);
            if (!existsFile && noErrors)fs.writeFile(f1Pilotspath, JSON.stringify(jsonPilots), { flag: 'w+' }, () =>{});
        }).catch((error)=>console.log("Error in f1 pilots fetch. Startup: ", startUp));
    }
    else{
        let jsonPilots = JSON.parse(fs.readFileSync(f1Pilotspath,"utf-8"));
        parser.parseF1Resp(jsonRaces,jsonPilots);
    }
}

/**
 * Fills the event list with new NBA events
 * @param {boolean} startUp Boolean value that defines if this fetch is made at start up
 */
function fetchNBAEvents(startUp:boolean){
    let configFlag = cnf.get("update_on_startup");
    let nbapath = rspPath + "nba" + "Res.json";
    let existsFile =fs.existsSync(nbapath);
    if (!existsFile || (configFlag && startUp)  || !startUp){
        let req = getRequests.genBasketRequest(API_AUTH_KEY,cnf.get("nba_league_id"),"2022-2023");
        makeRequest(req,(json:any)=>{
            let noErrors = parser.parseNBAResp(json);
            if (!existsFile && noErrors)fs.writeFile(nbapath, JSON.stringify(json), { flag: 'w+' }, () =>{});
        }).catch((error)=>console.log("Error in nba events fetch. Startup: ", startUp));;
    }
    else 
    {
        let jsonNBA = JSON.parse(fs.readFileSync(nbapath,"utf-8"));
        parser.parseNBAResp(jsonNBA)
    }
}

/**
 * Function responsible for initializing the event list
 */
function initEventLst(){
    fetchF1Events(true);
    fetchFootballEvents(true);
    fetchNBAEvents(true);
    fetchPTFootballEvents();
}

/**
 * Function responsible for fetching new events for the event list
 */
function updateEventLst(){
    fetchF1Events(false);
    fetchFootballEvents(false);
    fetchNBAEvents(false);
    fetchPTFootballEvents();
}



/**
 * Updates the status of a given list of futebol events
 * @param {List} fixtures list of ids for futebol events 
 */
 function updateFutResults(fixtures:string[]){
    return new Promise<void>(async (resolve)=>{
      let fixturesLst = []
      let fixtureStr = ""
      let i =0;
      let l =0;
      while (i<fixtures.length){
        l=0;
        while(l<20 && i<fixtures.length){
          fixtureStr += fixtures[i] + "-" 
          l++;
          i++;
        }
    
        fixtureStr = fixtureStr.slice(0,-1);
        fixturesLst.push(fixtureStr);
      }
      for (let request of fixturesLst){
        let req = getRequests.genFutResultRequest(API_AUTH_KEY,request);
        await makeRequest(req,parser.parseFutResultResp).catch(()=>
        console.error("Error in the futebol update request")
      );
      }
      resolve();
    })
}


  /**
 * Updates the results of a given list of formula 1 races
 * @param {List} races The list of ids for the races that will be updated 
 * 
 */
function updateF1Results(races:string[]){
    return new Promise<void>(async (resolve)=>{
      for (let race of races){
        let req = getRequests.genRaceRankingsRequest(API_AUTH_KEY,race);
        await makeRequest(req,parser.parseF1ResultResp).catch(()=>
        console.error("Error in the formula one update request")
      );
      }
      resolve();
    })
}


/**
  * Updates the results of a given list of basketball events
  * @param {List} games The list of ids for the games that will be updated
  * 
  */

 function updateBSKResults(games:string[]){
    return new Promise<void>(async (resolve)=>{ 
    for (let game of games){
      let req = getRequests.genBasketResultRequest(API_AUTH_KEY,game);
      await makeRequest(req,parser.parseNBAResultResp).catch(()=>
        console.error("Error in the basket update request")
      );
    }
    resolve();
  });
}



/**
 * Updates the results of a given list of futebol games from the portuguese league
 * @param {List} games List of ids of the games to be updated
 */
function updateFUTPTResults(games:string[]){
    return new Promise<void>(async (resolve)=>{
      let req = getRequests.genFUTPTRequest();
      makeRequest(req, (json:any)=>{
        parser.parsePTFutResultResp(json,games)
        resolve();
      }).catch(()=>
      console.error("Can't acess FUTPT API for updates")
    );
    });
}


  
  
  
  module.exports = {initEventLst,updateFutResults,updateF1Results,updateBSKResults,updateFUTPTResults,updateEventLst};
