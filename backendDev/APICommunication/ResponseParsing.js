const EventList = require("../Models/EventList");
const TieEvent = require("../Models/TieEvent");
const evLst = EventList.getInstance();


function parseFutResp(json){
    for (let match of json.response){
          let id = match.fixture.id;
          let date = match.fixture.timestamp;
          let league = match.league.name;
          let team1 = match.teams.home.name;
          let team2 = match.teams.away.name;
          let logo1 = match.teams.home.logo;
          let logo2 = match.teams.away.logo;
          let e = new TieEvent("Futebol",league,id,"",-1,"SO",date,team1,team2,logo1,logo2);
          evLst.addEvent(e);
          
        }

}

module.exports = {
    parseFutResp
}