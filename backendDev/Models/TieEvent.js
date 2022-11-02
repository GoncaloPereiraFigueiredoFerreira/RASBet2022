const SportEvent = require("./SportEvent");

class TieEvent extends SportEvent{

    constructor(sport,league,id,description,result,state,datetime, team1, team2,logo1, logo2,suggestOdds1,suggestOdds2,sugestOddsTie){  
        super(sport,league,id,description,result,state,datetime);
        this.Team1 = team1;
        this.Team2 = team2;
        this.Odds1 = 1;
        this.Odds2 = 1;
        this.OddsDraw = 1;
        this.Logo1 = logo1;
        this.Logo2 = logo2;
        this.SugestedOdds1 = suggestOdds1;
        this.SugestedOdds2 = suggestOdds2;
        this.SugestedOddsTie = sugestOddsTie;
    }


    changeOdds(Odds1,Odds2,OddsDraw){
        this.Odds1 = Odds1;
        this.Odds2 = Odds2;
        this.OddsDraw = OddsDraw;
    }

    superOdds(multiplier){
        this.Odds1 = this.Odds1 * multiplier;
        this.Odds2 = this.Odds2 * multiplier;
        this.OddsDraw = this.OddsDraw * multiplier;
        this.SuperOdds = true;
    }

    getOdds(){
        return [this.Odds1,this.Odds2,this.OddsDraw];
    }

    toJson(){
        
        return{
            "Tipo": "TieEvent",
            "EventoId" : this.Id,
            "Liga" : this.League,
            "Participantes" : [this.Team1,this.Team2],
            "Odds" : [this.Odds1,this.Odds2,this.OddsDraw],
            "Logos": [this.Logo1,this.Logo2],
            "Data" : this.DateTime,
            "SuperOdds" : this.SuperOdds
        }
    }
    toJsonV2(){
        return{
            "Tipo": "TieEvent",
            "EventoId" : this.Id,
            "Liga" : this.League,
            "Participantes" : [this.Team1,this.Team2],
            "Odds" : [this.SugestedOdds1,this.SugestedOdds2,this.SugestedOddsTie],
            "Logos": [this.Logo1,this.Logo2],
            "Data" : this.DateTime,
            "SuperOdds" : this.SuperOdds
        }
    }
    getParticipants(){
        return  [this.Team1,this.Team2];
    }

}

module.exports = TieEvent;