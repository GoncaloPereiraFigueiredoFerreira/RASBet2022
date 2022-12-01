/**
 * @file ResponseParsing.js
 * 
 * This module contains the functions that will parse the results from the API requests
 * 
 */
const EventList = require("../Models/EventList");
const TieEvent = require("../Models/TieEvent");
const RaceEvent = require("../Models/RaceEvent");
const NoTieEvent = require("../Models/NoTieEvent");

const evLst = EventList.getInstance();


/**
 * Function responsible for retrieving the information from the API response of a Football request 
 * @param {JSON} json Json that contains the response from the API
 */

function parseFutResp(json){
    if (json.errors.length != 0) {
        console.error("Errors found in json response");
        console.log(json.errors)
        //json.errors.map(x=> console.error(JSON.stringify(x)));
        return false;
    }
    else{
        for (let match of json.response){
            let id = match.fixture.id;
            let date = match.fixture.date;
            let league = match.league.name;
            let team1 = match.teams.home.name;
            let team2 = match.teams.away.name;
            let logo1 = match.teams.home.logo;
            let logo2 = match.teams.away.logo;
            
            let event = evLst.getEvent("FUT",id);
            if (event != undefined && !(event instanceof RaceEvent)&& !(event instanceof NoTieEvent)&& !(event instanceof TieEvent)){
                evLst.addTieEventFromAPI("FUT",league,id,event.getDescription(),event.getResult(),event.getState(),date,team1,team2,logo1,logo2,1,1,1);
            }
            else{
                evLst.addTieEventFromAPI("FUT",league,id,team1+"-"+team2,-1,"NODD",date,team1,team2,logo1,logo2,1,1,1);
            }
        }
        return true;
    }
}

/**
 * Function responsible for retrieving the information from the API response of a Football request 
 * @param {JSON} json Json that contains the response from the API
 */
function parseFutResultResp(json){
    if (json.errors.length != 0) {
        console.error("Errors found in json response");
        console.log(json.errors)
        //json.errors.map(x=> console.error(JSON.stringify(x)));
        return false;
    }
    else{
        for (let match of json.response){
            let id = match.fixture.id;
            let result = -1;
            if (match.goals.home != null &&  match.goals.away != null){
                if (match.goals.home > match.goals.away) result = 0;
                else if (match.goals.home < match.goals.away) result = 1;
                else if (match.goals.home == match.goals.away) result = 2;
            }
            if (result != -1)  evLst.updateWinner("FUT",id,result,"("+match.goals.home+")"+match.teams.home.name+ " - " + match.teams.away.name+"("+match.goals.away+")");    
        }
        return true;
    }
}


/**
 * This function is responsible for parsing and creating an instance of a new Football event as a TieEvent
 * @param {JSON} json The json response that comes from  the API
 */
function parsePTFutResp(json){
    for (let match of json){
        let id = match.id;
        let date = match.commenceTime;
        //if (Date.parse(date) > Date.now()){ 
            let league = "Primeira Liga";
            let team1 = match.homeTeam;
            let team2 = match.awayTeam;
            let sOdds1 = undefined;
            let sOdds2 = undefined;
            let sOddsTie = undefined;

            for (let outcomes of match.bookmakers[0].markets[0].outcomes){
                if (outcomes.name == team1) sOdds1 = outcomes.price;
                else if(outcomes.name == team2) sOdds2 = outcomes.price;
                else if(outcomes.name == "Draw") sOddsTie = outcomes.price;
            }

            let event = evLst.getEvent("FUTPT",id);
            if (event != undefined && !(event instanceof RaceEvent)&& !(event instanceof NoTieEvent)&& !(event instanceof TieEvent)){
                evLst.addTieEventFromAPI("FUTPT",league,id,event.getDescription(),event.getResult(),event.getState(),date,team1,undefined,undefined,sOdds1,sOdds2,sOddsTie);
            }
            else{
                evLst.addTieEventFromAPI("FUTPT",league,id,team1+"-"+team2,-1,"NODD",date,team1,team2,undefined,undefined,sOdds1,sOdds2,sOddsTie);
            }
        //}
    }
    return true;
}
/**
 * This function parses a json API response, and given a list of games, it updates the results on those games
 * 
 * @param {JSON} json Json containing the API response 
 * @param {List} games The list of ids from the games that were finnished
 */
function parsePTFutResultResp(json,games){

    for (let game of games){
        for (let match of json){
            let id = match.id;
            if (id == game && match.completed){       
                const re = /(\d)x(\d)/;
                let lst = match.scores.match(re);
                let home = match.homeTeam;
                let away = match.awayTeam;
                let result =-1;
                if (lst[1] > lst[2]) result = 0;
                else if (lst[1] < lst[2]) result = 1;
                if (lst[1] == lst[2]) result = 2;
                evLst.updateWinner("FUTPT",game,result,"(" + lst[1]+")" + home +" - "+away +"(" + lst[2]+")" );
                break;
            }
        }
    }
}







/**
 *  This function is responsible for parsing an API response and create a new instance of a RaceEvent
 * @param {JSON} racesJson Json that contains the API response for a races request
 * @param {JSON} pilotsJson Json that contains the API response for a pilots request
 */
function parseF1Resp(racesJson, pilotsJson){
    let pilotsNames = [];
    let pilotsPhotos = [];
    if (racesJson.errors.length != 0 || pilotsJson.errors.length != 0) {
        console.error("Errors found in json response");
        console.log(racesJson.errors)
        console.log(pilotsJson.errors)
        //json.errors.map(x=> console.error(JSON.stringify(x)));
    }
    else{
        for (let pilot of pilotsJson.response){
            pilotsNames.push(pilot.team.name + "-" +  pilot.driver.name);
            pilotsPhotos.push(pilot.driver.image);
        }
        for (let race of racesJson.response){
            let id = race.id;
            let date = race.date;
            let circuit = race.competition.name;
            let circuitPhoto = race.circuit.image;
            let playerOdds = []; for (let i=0; i<pilotsNames.length; ++i) playerOdds.push(1);

            let event = evLst.getEvent("F1",id);
            if (event != undefined && !(event instanceof RaceEvent)&& !(event instanceof NoTieEvent)&& !(event instanceof TieEvent)){
                evLst.addRaceEventFromAPI("F1","World F1 Competition",id,event.getDescription(),event.getResult(),event.getState(),date,pilotsNames,pilotsPhotos,circuit,circuitPhoto,playerOdds);
            }
            else{
                evLst.addRaceEventFromAPI("F1","World F1 Competition",id,circuit,-1,"NODD",date,pilotsNames,pilotsPhotos,circuit,circuitPhoto,playerOdds);
            }
        }

    }
}

/**
 * Function responsible for parsing a API response of a request for a single race 
 * @param {JSON} json Json response that contains the results for a certain race event 
 */
function parseF1ResultResp(json){
    if (json.errors.length != 0) {
        console.error("Errors found in json response");
        console.log(json.errors)
        //json.errors.map(x=> console.error(JSON.stringify(x)));
    }
    else{
        let id = json.response[0].race.id;
        let pilotList = evLst.getParticipants("F1",id);
        let winner =  json.response[0].driver.name;
        let index = pilotList.indexOf(winner);
        evLst.updateWinner("F1",id,index,evLst.getDescription("F1",id) + " Vencedor: "+winner);
    }
}


/**
 * Function that is responsible for parsing the API response to a NBA request
 * @param {JSON} nbaJson Json that contains the NS NBA events
 */
function parseNBAResp(nbaJson){
    if (nbaJson.errors.length != 0) {
        console.error("Errors found in json response");
        console.log(nbaJson.errors)
        //json.errors.map(x=> console.error(JSON.stringify(x)));
    }
    else{
        for (let game of nbaJson.response){
            if (game.status.short == "NS"){
                let id = game.id;
                let date = game.date;
                let league = "NBA";
                let team1 = game.teams.home.name;
                let team2 = game.teams.away.name;
                let logo1 = game.teams.home.logo;
                let logo2 = game.teams.away.logo;


                let event = evLst.getEvent("BSK",id);
                if (event != undefined && !(event instanceof RaceEvent)&& !(event instanceof NoTieEvent)&& !(event instanceof TieEvent)){
                    evLst.addNoTieEventFromAPI("BSK",league,id,event.getDescription(),event.getResult(),event.getState(),date,team1,team2,logo1,logo2,1,1);
                }
                else{
                    evLst.addNoTieEventFromAPI("BSK",league,id,team1+"-"+team2,-1,"NODD",date,team1,team2,logo1,logo2,1,1);
                }


            }
        }
    }
}

/**
 * Function responsible for parsing and updating the result of a single game
 * @param {JSON} json Json containing the requested NBA game 
 */
function parseNBAResultResp(json){
    if (json.errors.length != 0) {
        console.error("Errors found in json response");
        console.log(json.errors)
        //json.errors.map(x=> console.error(JSON.stringify(x)));
    }
    else{
        let id = json.response[0].id;
        let result = -1;
        let scores =json.response[0].scores;
        let team1 = json.response[0].teams.home.name;
        let team2 = json.response[0].teams.away.name;
        if (scores.home.total != null &&  scores.away.total != null){
            if (scores.home.total > scores.away.total) result = 0;
            else if (scores.home.total < scores.away.total) result = 1;
        }
        if (result != -1)  evLst.updateWinner("BSK",id,result,"("+scores.home.total+")" + " " + team1 + " - "+team2 + " "+ "("+scores.home.total+")");   
    }
}



module.exports = {
    parseFutResp,
    parseFutResultResp,
    parseF1Resp,
    parseF1ResultResp,
    parsePTFutResp,
    parsePTFutResultResp,
    parseNBAResp,
    parseNBAResultResp


}