const EventList = require("../Models/EventList");
const TieEvent = require("../Models/TieEvent");
const RaceEvent = require("../Models/RaceEvent");
const NoTieEvent = require("../Models/NoTieEvent");

const evLst = EventList.getInstance();


function parseFutResp(json){
    if (json.errors.length != 0) {
        console.error("Errors found in json response");
        json.errors.map(x=> console.error(JSON.stringify(x)));
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
            if (event != undefined){
                evLst.addEventFromAPI(new TieEvent("FUT",league,id,event.getDescription(),event.getResult(),event.getState(),date,team1,team2,logo1,logo2,-1,-1,-1));
            }
            else{
                let e = new TieEvent("FUT",league,id,"",-1,"NODD",date,team1,team2,logo1,logo2,-1,-1,-1);
                evLst.addEventFromAPI(e);
            }
        }
    }
}

function parseFutResultResp(json){
    if (json.errors.length != 0) {
        console.error("Errors found in json response");
        json.errors.map(x=> console.error(JSON.stringify(x)));
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
            if (result != -1)  evLst.updateWinner("FUT",id,result);    
        }
    }
}

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
            if (event != undefined){
                evLst.addEventFromAPI(new TieEvent("FUTPT",league,id,event.getDescription(),event.getResult(),event.getState(),date,team1,undefined,undefined,sOdds1,sOdds2,sOddsTie));
            }
            else{
                let e = new TieEvent("FUTPT",league,id,"",-1,"NODD",date,team1,team2,undefined,undefined,sOdds1,sOdds2,sOddsTie);
                evLst.addEventFromAPI(e);
            }
        //}
    }
}

function parsePTFutResultResp(json,games){

    for (let game of games){
        for (let match of json){
            let id = match.id;
            if (id == game && match.completed){       
                const re = /(\d)x(\d)/;
                let lst = match.scores.match(re);
                let result =-1;
                if (lst[1] > lst[2]) result = 0;
                else if (lst[1] < lst[2]) result = 1;
                if (lst[1] == lst[2]) result = 2;
                evLst.updateWinner("FUTPT",game,result);
                break;
            }
        }
    }
}








function parseF1Resp(racesJson, pilotsJson){
    let pilotsNames = [];
    let pilotsPhotos = [];
    if (racesJson.errors.length != 0 || pilotsJson.errors.length != 0) {
        console.error("Errors found in json response");
        json.errors.map(x=> console.error(JSON.stringify(x)));
    }
    else{
        for (let pilot of pilotsJson.response){
            pilotsNames.push(pilot.driver.name);
            pilotsPhotos.push(pilot.driver.image);
        }
        for (let race of racesJson.response){
            let id = race.id;
            let date = race.date;
            let circuit = race.circuit.name;
            let circuitPhoto = race.circuit.image;


            let event = evLst.getEvent("F1",id);
            if (event != undefined){
                evLst.addEventFromAPI(new RaceEvent("F1","World F1 Competition",id,event.getDescription(),event.getResult(),event.getState(),date,pilotsNames,pilotsPhotos,circuit,circuitPhoto));
            }
            else{
                let e = new RaceEvent("F1","World F1 Competition",id,"",-1,"NODD",date,pilotsNames,pilotsPhotos,circuit,circuitPhoto);
                evLst.addEventFromAPI(e);
            }
        }

    }
}

function parseF1ResultResp(json){
    if (json.errors.length != 0) {
        console.error("Errors found in json response");
        json.errors.map(x=> console.error(JSON.stringify(x)));
    }
    else{
        let id = json.response[0].race.id;
        let pilotList = evLst.getParticipants("F1",id);
        let winner =  json.response[0].driver.name;
        let index = pilotList.indexOf(winner);
        evLst.updateWinner("F1",id,index);
    }
}



function parseNBAResp(nbaJson){
    if (nbaJson.errors.length != 0) {
        console.error("Errors found in json response");
        json.errors.map(x=> console.error(JSON.stringify(x)));
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
                if (event != undefined){
                    evLst.addEventFromAPI(new NoTieEvent("BSK",league,id,event.getDescription(),event.getResult(),event.getState(),date,team1,team2,logo1,logo2));
                }
                else{
                    let e = new NoTieEvent("BSK",league,id,"",-1,"NODD",date,team1,team2,logo1,logo2);
                    evLst.addEventFromAPI(e);
                }


            }
        }
    }
}


function parseNBAResultResp(json){
    if (json.errors.length != 0) {
        console.error("Errors found in json response");
        json.errors.map(x=> console.error(JSON.stringify(x)));
    }
    else{
        let id = json.response[0].id;
        let result = -1;
        let scores =json.response[0].scores;
        if (scores.home.total != null &&  scores.away.total != null){
            if (scores.home.total > scores.away.total) result = 0;
            else if (scores.home.total < scores.away.total) result = 1;
        }
        if (result != -1)  evLst.updateWinner("BSK",id,result);   
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