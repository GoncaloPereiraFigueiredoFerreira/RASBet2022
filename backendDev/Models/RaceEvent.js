const SportEvent = require("./SportEvent");

class RaceEvent extends SportEvent{

    constructor(sport,league,id,description,result,state, datetime, pilots,pilotsPhotos, circuit,circuitPhoto){
        
        super(sport,league,id,description,result,state,datetime);
        this.PlayerOdds = [];
        this.PlayerOdds.fill(1,0,20);
        this.Pilots = pilots;
        this.PilotsPht = pilotsPhotos;
        this.Circuit = circuit;
        this.CircuitPht = circuitPhoto;

    }
    changeOdds(playerOdds){
        this.PlayerOdds = playerOdds;
    }

    superOdds(multiplier){
        this.PlayerOdds.map(x=> x * multiplier);
    }

    toJson(){
        return{
            "Tipo": "RaceEvent",
            "EventoId" : super.Id,
            "Liga" : this.Circuit,
            "Participantes" : this.Pilots.push(circuitPhoto), //Foto no fim
            "Odds" : this.PlayerOdds,
            "Logos": this.PilotsPht,
            "Data" : super.DateTime
        }
    }

    getParticipants(){
        return this.Pilots;
    }


}

module.exports = RaceEvent;