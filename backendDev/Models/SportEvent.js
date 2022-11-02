class SportEvent{
    constructor(sport,league,id,description,result,state,datetime){
        this.Sport=sport;
        this.League = league;
        this.Id = id;
        this.Description = description;
        this.Result = result;
        this.State = state;
        this.DateTime =datetime;
        this.SuperOdds=false;
    }

    updateWinner(result){
        this.Result = result;
        this.State = "FIN";
    }

    getSport(){
        return this.Sport;
    }

    getID(){
        return this.Id;
    }

    getState(){
        return this.State;
    }

    getLeague(){
        return this.League;
    }
    getDescription(){
        return this.Description;
    }

    getResult(){
        return this.Result;
    }

    readyEvent(){
        if (this.State == "NODD"){
            this.State = "BET";
        }
    }

    closeEvent(){
        this.state = "CLS";
    }

    toDB(){
        return {
            "ID" : this.Id,
            "DataEvent" : this.DateTime,
            "Descricao" : this.Description,
            "Resultado" : this.Result,
            "Estado" : this.State,
            "Liga" : this.League,
            "Desporto":this.Sport
        }
    }

    isSuperOddsOn(){
        return this.SuperOdds;
    }


}

module.exports = SportEvent;