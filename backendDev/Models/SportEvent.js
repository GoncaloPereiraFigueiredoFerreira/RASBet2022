class SportEvent{
    constructor(sport,league,id,description,result,state,datetime){
        this.Sport=sport;
        this.League = league;
        this.Id = id;
        this.Description = description;
        this.Result = result;
        this.State = state;
        this.DateTime =datetime;
    }

    getSport(){
        return this.Sport;
    }

    getID(){
        return this.Id;
    }

}

module.exports = SportEvent;