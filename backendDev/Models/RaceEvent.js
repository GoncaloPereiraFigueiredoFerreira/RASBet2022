class RaceEvent extends SportEvent{

    constructor(sport,league,id,description,result,state, datetime, racers, circuit){
        
        super(sport,league,id,description,result,state,datetime);
        this.PlayerOdds = [];
        this.PlayerOdds.fill(1,0,20);
        this.Racers = racers;
        this.Circuit = circuit;

    }

}