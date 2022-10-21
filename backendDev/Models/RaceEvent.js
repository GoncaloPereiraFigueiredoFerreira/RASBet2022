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

}

module.exports = RaceEvent;