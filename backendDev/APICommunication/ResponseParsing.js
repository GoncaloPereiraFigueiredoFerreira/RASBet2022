const EventList = require("../Models/EventList");
const TieEvent = require("../Models/TieEvent");
const RaceEvent = require("../Models/RaceEvent");
const NoTieEvent = require("../Models/NoTieEvent");
const evLst = EventList.getInstance();


function parseFutResp(json){
    for (let match of json.response){
          let id = match.fixture.id;
          let date = match.fixture.date;
          let league = match.league.name;
          let team1 = match.teams.home.name;
          let team2 = match.teams.away.name;
          let logo1 = match.teams.home.logo;
          let logo2 = match.teams.away.logo;
          let e = new TieEvent("FUT",league,id,"",-1,"SO",date,team1,team2,logo1,logo2,-1,-1,-1);
          evLst.addEvent(e);
          
        }

}

function parsePTFutResp(json){
    for (let match of json){
        let id = match.id;
        let date = match.commenceTime;
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
        let e = new TieEvent("FUTPT",league,id,"",-1,"SO",date,team1,team2,undefined,undefined,sOdds1,sOdds2,sOddsTie);
        evLst.addEvent(e);
        console.log(e);

    }
}


function parseF1Resp(racesJson, pilotsJson){
    let pilotsNames = [];
    let pilotsPhotos = [];
    for (let pilot of pilotsJson.response){
        pilotsNames.push(pilot.driver.name);
        pilotsPhotos.push(pilot.driver.image);
    }
    for (let race of racesJson.response){
        let id = race.id;
        let date = race.date;
        let circuit = race.circuit.name;
        let circuitPhoto = race.circuit.image;
        let e = new RaceEvent("F1","World F1 Competition",id,"",-1,"SO",date,pilotsNames,pilotsPhotos,circuit,circuitPhoto);
        evLst.addEvent(e);
    }

}



function parseNBAResp(nbaJson){
    for (let game of nbaJson.response){
        if (game.status.short == "NS"){
            let id = game.id;
            let date = game.date;
            let league = "NBA";
            let team1 = game.teams.home.name;
            let team2 = game.teams.away.name;
            let logo1 = game.teams.home.logo;
            let logo2 = game.teams.home.logo;
            let e = new NoTieEvent("BSK",league,id,"",-1,"SO",date,team1,team2,logo1,logo2);
            evLst.addEvent(e);
        }
    }
}


module.exports = {
    parseFutResp,
    parseF1Resp,
    parsePTFutResp,
    parseNBAResp
}