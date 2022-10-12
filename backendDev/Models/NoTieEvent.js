class NoTieEvent extends SportEvent{
    constructor(sport,league,id,description,result,state,datetime, team1, team2,logo1, logo2){
        
        super(sport,league,id,description,result,state,datetime);
        this.Team1 = team1;
        this.Team2 = team2;
        this.Odds1 = 1;
        this.Odds2 = 1;
        this.Logo1 = logo1;
        this.Logo2 = logo2;
    }
}