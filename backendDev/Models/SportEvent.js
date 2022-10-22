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

    updateWinner(result){
        this.Result = result;
        this.State = "FN";
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

    readyEvent(){
        if (this.State == "SO"){
            this.State = "NO";
        }
    }

    closeEvent(){
        this.state = "FN";
    }

    toDB(){
        return {
            "EventoId" : this.Id,
            "Data" : this.DateTime,
            "Descricao" : this.Description,
            "Resultado" : this.Result,
            "Estado" : this.State,
            "Liga" : this.League
        }
    }




}

module.exports = SportEvent;