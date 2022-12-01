
const SportEvent = require('./SportEvent');


export class TieEvent extends SportEvent{
    private Team1: string;
    private Team2: string;
    private Odds1: number;
    private Odds2: number;
    private OddsDraw: number;
    private Logo1: string;
    private Logo2: string;

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
     * @param {number} odds1 Initial Odds of winning for home team for event
     * @param {number} odds2 Initial Odds of winning for away team for event
     * @param {number} oddsDraw Initial Odds of a draw for event
     */
    constructor(sport:string,league:string,id:string,description:string,result:number,state:string,datetime:string, team1:string, team2:string,logo1:string, logo2:string,odds1:number,odds2:number,oddsDraw:number){  
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
     public changeOdds(Odds:number[]){
        this.Odds1 = Odds[0];
        this.Odds2 = Odds[1];
        this.OddsDraw = Odds[2];
    }

    /**
     * Apply the super odds promotion to the event
     * @param {number} multiplier Multiplier for the odds
     */
    superOdds(multiplier:number){
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
            "Estado": this.State,
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

