
const SportEvent = require('./SportEvent');


export class NoTieEvent extends SportEvent{
    Team1: string;
    Team2: string;
    Odds1: number;
    Odds2: number;
    Logo1: string;
    Logo2: string;

    /**
     * Constructor of the NoTieEvent Class
     * @param {string} sport Name of the sport
     * @param {string} league Name of the league
     * @param {string} id Identifier of the event
     * @param {string} description Description of the event
     * @param {number} result Result of the event (0 if home won and 1 if away won)
     * @param {string} state State of the event
     * @param {string} datetime Starting datetime of the event
     * @param {string} team1 Name of the home team
     * @param {string} team2 Name of the away team
     * @param {string} logo1 Url to the logo of the home team
     * @param {string} logo2 URL to the logo of the away team
     * @param {string} odds1 Odds of the home team winning
     * @param {string} odds1 Odds of the away team winning
     */
    constructor(sport: string,league: string,id: string,description: string,result: number,state: string,datetime: string, team1: string, team2: string,logo1: string, logo2: string,odds1:number,odds2:number){
        
        super(sport,league,id,description,result,state,datetime);
        this.Team1 = team1;
        this.Team2 = team2;
        this.Odds1 = odds1;
        this.Odds2 = odds2;
        this.Logo1 = logo1;
        this.Logo2 = logo2;
    }

    /**
     * Change the odds for the different outcomes 
     * @param {List} Odds List of odds 
     */
    
    changeOdds(Odds: number[]){
        this.Odds1 = Odds[0];
        this.Odds2 = Odds[1];
    }
    /**
     * Activates super odds in this event
     * @param {number} multiplier 
     */
    superOdds(multiplier: number){
        this.Odds1 = this.Odds1 * multiplier;
        this.Odds2 = this.Odds2 * multiplier;
        this.SuperOdds = true;
    }
    /**
     * Returns the odds of the event
     * @returns Returns 2 numbers representing the odds of the event
     */
    getOdds(){
        return [this.Odds1,this.Odds2];
    }

    /**
     * Returns the JSON format of the class
     * @returns Returns a JSON object that expresses the information of the class
     */
    toJson(){
        return{
            "Tipo": "NoTieEvent",
            "EventoId" : this.Id,
            "Liga" : this.League,
            "Participantes" : [this.Team1,this.Team2],
            "Odds" : [this.Odds1,this.Odds2],
            "Logos": [this.Logo1,this.Logo2],
            "Data" : this.DateTime,
            "SuperOdds" : this.SuperOdds
        }
    }
    /**
     * Returns the paticipants for this event
     * @returns Returns the paticipants for this event
     */
    getParticipants(){
        return [this.Team1,this.Team2];
    }
}

