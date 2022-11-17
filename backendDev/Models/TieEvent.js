const SportEvent = require("./SportEvent");

class TieEvent extends SportEvent{

    /**
     * 
     * @param {string} sport Name of the sport
     * @param {string} league Name of the league
     * @param {string} id Identifier of the event
     * @param {string} description Description of the event
     * @param {number} result Winner of the event
     * @param {string} state Current state of the event
     * @param {string} datetime Date and time of the event
     * @param {string} team1 Name of the home team
     * @param {string} team2 Name of the away team
     * @param {string} logo1 URL with the logo of the home team
     * @param {string} logo2 URL with the logo of the away team
     * @param {number} suggestOdds1 Suggested inital odds for home team
     * @param {number} suggestOdds2 Suggested inital odds for away team
     * @param {number} sugestOddsTie Suggested inital odds for a draw
     */
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

    /**
     * Change the odds for the different outcomes 
     * @param {List} Odds List of odds 
     */
    changeOdds(Odds){
        this.Odds1 = Odds[0];
        this.Odds2 = Odds[1];
        this.OddsDraw = Odds[2];
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