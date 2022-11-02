const SportEvent = require("./SportEvent");

class RaceEvent extends SportEvent{

    constructor(sport,league,id,description,result,state, datetime, pilots,pilotsPhotos, circuit,circuitPhoto){
        
        super(sport,league,id,description,result,state,datetime);
        this.PlayerOdds = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
        this.Pilots = pilots;
        this.PilotsPht = pilotsPhotos;
        this.Circuit = circuit;
        this.CircuitPht = circuitPhoto;

    }
    changeOdds(playerOdds){
        this.PlayerOdds = playerOdds;
    }

    getOdds(){
        return this.PlayerOdds;
    }

    superOdds(multiplier){
        this.PlayerOdds.map(x=> x * multiplier);
        this.SuperOdds = true;
    }

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

    getParticipants(){
        return this.Pilots;
    }


}

module.exports = RaceEvent;