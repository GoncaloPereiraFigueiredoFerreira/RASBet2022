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
     * @param {string} odds1 Initial Odds of winning for home team for event
     * @param {string} odds2 Initial Odds of winning for away team for event
     * @param {string} oddsDraw Initial Odds of a draw for event
     */
    constructor(sport,league,id,description,result,state,datetime, team1, team2,logo1, logo2,odds1,odds2,oddsDraw){  
        super(sport,league,id,description,result,state,datetime);
        this.Team1 = team1;
        this.Team2 = team2;
        this.Odds1 = odds1;
        this.Odds2 = odds2;
        this.OddsDraw = oddsDraw;
        this.Logo1 = logo1;
        this.Logo2 = logo2;
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

    /**
     * Apply the super odds promotion to the event
     * @param {number} multiplier Multiplier for the odds
     */
    superOdds(multiplier){
        this.Odds1 = this.Odds1 * multiplier;
        this.Odds2 = this.Odds2 * multiplier;
        this.OddsDraw = this.OddsDraw * multiplier;
        this.SuperOdds = true;
    }

    /**
     * 
     * @returns Returns a list with 3 odds, home win, away win and draw, respectively
     */
    getOdds(){
        return [this.Odds1,this.Odds2,this.OddsDraw];
    }

    /**
     * 
     * @returns Returns a json object containing info about this instance of the class tie event
     */
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
    /**
     * 
     * @returns Returns a list of participants, first the home team and then the away team
     */
    getParticipants(){
        return  [this.Team1,this.Team2];
    }

}

module.exports = TieEvent;