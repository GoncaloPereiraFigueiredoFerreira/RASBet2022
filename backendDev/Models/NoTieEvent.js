const SportEvent = require("./SportEvent");
class NoTieEvent extends SportEvent{
    constructor(sport,league,id,description,result,state,datetime, team1, team2,logo1, logo2){
        
        super(sport,league,id,description,result,state,datetime);
        this.Team1 = team1;
        this.Team2 = team2;
        this.Odds1 = 1;
        this.Odds2 = 1;
        this.Logo1 = logo1;
        this.Logo2 = logo2;
    }
    changeOdds(Odds1,Odds2){
        this.Odds1 = Odds1;
        this.Odds2 = Odds2;
    }
    superOdds(multiplier){
        this.Odds1 = Odds1 * multiplier;
        this.Odds2 = Odds2 * multiplier;
    }
    getOdds(){
        return [this.Odds1,this.Odds2];
    }

    toJson(){
        return{
            "Tipo": "NoTieEvent",
            "EventoId" : this.Id,
            "Liga" : this.League,
            "Participantes" : [this.Team1,this.Team2],
            "Odds" : [this.Odds1,this.Odds2],
            "Logos": [this.Logo1,this.Logo2],
            "Data" : this.DateTime
        }
    }

    getParticipants(){
        return [this.Team1,this.Team2];
    }



}
module.exports = NoTieEvent;