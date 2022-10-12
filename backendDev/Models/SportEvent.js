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
}

module.exports = SportEvent;