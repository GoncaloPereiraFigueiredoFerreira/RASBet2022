const SportEvent = require('./SportEvent');

export class RaceEvent extends SportEvent{
    PlayerOdds: number[];
    Pilots: string[];
    PilotsPht: string[];
    Circuit: string;
    CircuitPht: string;

    /**
     * 
     * @param {string} sport Name of the sport
     * @param {string} league Name of the league
     * @param {string} id Identifier of the event
     * @param {string} description String that contains the description of the event
     * @param {number} result Result of the event (-1 if it hasnt finished or the index of the winner pilot)
     * @param {string} state State of the event
     * @param {string} datetime Date and time of the event
     * @param {List} pilots List of names of the pilots participating in the race
     * @param {List} pilotsPhotos List of urls for each pilots face
     * @param {string} circuit Name of the circuit
     * @param {string} circuitPhoto Url for the circuit photo
     * @param {List} playerOdds List of odds for each contestant
     */
    constructor(sport: string,league: string,id: string,description: string,result: number,state: string, datetime: string, pilots: string[],pilotsPhotos: string[], circuit: string,circuitPhoto: string,playerOdds: number[]){
        
        super(sport,league,id,description,result,state,datetime);
        this.PlayerOdds = playerOdds;
        this.Pilots = pilots;
        this.PilotsPht = pilotsPhotos;
        this.Circuit = circuit;
        this.CircuitPht = circuitPhoto;

    }

    /**
     * Updates the odds of each pilot
     * @param {List} playerOdds List of the players odds 
     */
    public changeOdds(playerOdds: any[]){
        this.PlayerOdds = playerOdds.slice();
    }

    /**
     * 
     * @returns Returns the list of odds of each player
     */
    getOdds(){
        return this.PlayerOdds.slice();
    }

    /**
     * Applies the multiplier of the super odds to all pilots
     * @param {number} multiplier 
     */
    superOdds(multiplier: number){
        this.PlayerOdds.map((x: number)=> x * multiplier);
        this.SuperOdds = true;
    }

    /**
     * 
     * @returns Returns a JSON object of the RaceEvent class
     */
    toJson(){
        // Puts the circuit photo in the last of the logos
        let photos = [];
        this.PilotsPht.map((x: any)=>{photos.push(x)});
        photos.push(this.CircuitPht)
        return{
            "Tipo": "RaceEvent",
            "EventoId" : this.Id,
            "Liga" : this.Circuit,
            "Participantes" : this.Pilots, 
            "Odds" : this.PlayerOdds,
            "Logos": photos,
            "Data" : this.DateTime,
            "SuperOdds" : this.SuperOdds
        }
    }

    /**
     * 
     * @returns Returns the pilots participating in the race
     */
    getParticipants(){
        return this.Pilots.slice();
    }


}
