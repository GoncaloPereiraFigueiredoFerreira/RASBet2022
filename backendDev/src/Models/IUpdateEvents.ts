interface IUpdateEvents{
     /** 
      * Adds a event to the event list where a draw is not a possible outcome
     * @param {string} sport Name of the sport
     * @param {string} league Name of the league
     * @param {string} id Identifier of the event
     * @param {string} datetime Starting datetime of the event
     * @param {string} team1 Name of the home team
     * @param {string} team2 Name of the away team
     * @param {string} logo1 Url to the logo of the home team
     * @param {string} logo2 URL to the logo of the away team
     * @param {string} odds1 Odds of the home team winning
     * @param {string} odds2 Odds of the away team winning
     */
   addNoTieEventFromAPI(sport: string,league: string,id:string,datetime: string,team1: string, team2: string,logo1: string, logo2: string,odds1: number,odds2: number):void;
   

   /**
     * Adds a event to the event list where a draw is a possible outcome
     * @param {string} sport Name of the sport
     * @param {string} league Name of the league
     * @param {string} id Identifier of the event
     * @param {string} datetime Date and time of the event
     * @param {string} team1 Name of the home team
     * @param {string} team2 Name of the away team
     * @param {string} logo1 URL with the logo of the home team
     * @param {string} logo2 URL with the logo of the away team
     * @param {number} oddsHome Initial Odds of winning for home team for event
     * @param {number} oddsAway Initial Odds of winning for away team for event
     * @param {number} oddsDraw Initial Odds of a draw for event
     */
   addTieEventFromAPI(sport: string,league: string,id: string,datetime:string, team1: string, team2: string,logo1: string, logo2: string,oddsHome:number,oddsAway:number,oddsDraw:number):void;

   
/**
     * Adds a race event to the event list
     * @param {string} sport Name of the sport
     * @param {string} league Name of the league
     * @param {string} id Identifier of the event
     * @param {string} datetime Date and time of the event
     * @param {string[]} pilots List of names of the pilots participating in the race
     * @param {string[]} pilotsPhotos List of urls for each pilots face
     * @param {string} circuit Name of the circuit
     * @param {string} circuitPhoto Url for the circuit photo
     * @param {number[]} playerOdds List of odds for each contestant
     */
     addRaceEventFromAPI(sport: string,league: string,id: string, datetime: string, pilots: string[],pilotsPhotos: string[], circuit: string,circuitPhoto: string,playerOdds:number[]):void;



    /**
      * Updates the winner of a given event
      * @param {string} sport Name of the sport
      * @param {string} id Identifier of the event
      * @param {number} result The result of the event
      * @param {string} description Updated description
      */
    updateWinner(sport: string ,id: string ,result: number,description: string):void;


    /**
    * Returns the participants of an event
    * @param {string} sport Name of the sport
    * @param {string} id Identifier of the event 
    * @returns Returns a list of participants in the event
    */
    getParticipants(sport: string ,id: string ):string[];



    removePastEvents(sport:string,except:string[]):void;
}