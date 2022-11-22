const SportEvent = require("./SportEvent");

class RaceEvent extends SportEvent{

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
    constructor(sport,league,id,description,result,state, datetime, pilots,pilotsPhotos, circuit,circuitPhoto,playerOdds){
        
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
    changeOdds(playerOdds){
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
    superOdds(multiplier){
        this.PlayerOdds.map(x=> x * multiplier);
        this.SuperOdds = true;
    }

    /**
     * 
     * @returns Returns a JSON object of the RaceEvent class
     */
    toJson(){
        // Puts the circuit photo in the last of the logos
        let photos = [];
        this.PilotsPht.map(x=>{photos.push(x)});
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

module.exports = RaceEvent;