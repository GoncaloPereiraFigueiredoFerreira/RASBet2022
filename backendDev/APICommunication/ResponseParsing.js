const EventList = require("../Models/EventList");
const TieEvent = require("../Models/TieEvent");
const RaceEvent = require("../Models/RaceEvent");
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
          let e = new TieEvent("Futebol",league,id,"",-1,"SO",date,team1,team2,logo1,logo2);
          evLst.addEvent(e);
          
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

module.exports = {
    parseFutResp,
    parseF1Resp
}