
interface IEventList{

    
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
      * Adds an event from the DB
      * 
      * @param {string} sport Kind of sport
      * @param {string} league Name of the League
      * @param {string} id Identifier of event
      * @param {string} description Description for event
      * @param {number} result Result of the event
      * @param {string} state State of the game
      * @param {string} datetime Date of the event
      */
    addEventFromDB(sport: string,league: string,id: string,description:string,result: number,state:string,datetime:string):void;
     
    /**
      * Method that alters the odd for a specific event
      * @param {string} sport Name of the sport
      * @param {string} id Identifier of event
      * @param {number[]} odds List of odds to be assigned
      * @returns Returns true if the odds were added correctly
      */
    changeEventOdd(sport: string ,id: string ,odds: number[]):boolean;

    /**
      * Method that updates the odds of an event based on a bet
      * @param {string} sport Name of the sport
      * @param {string} id Identifier of event
      * @param {number} money Money used in the bet
      * @param {number} choice Team with bet
      * @returns Returns true if the odds were added correctly
      */
    updateOddBet(sport: string ,id: string ,money: number,choice: number):boolean;


    /**
      * Function responsible for returning the stored events withou odds from a sport
      * @param {string} sport Name of the sport  
      * @returns Returns a list of event without odds (JSON ready to be parsed by the frontend)
      */
    getNODDEvents(sport: string ):object[];

    /**
      * Returns a list of events ready for receiving bets
      * @param {string} sport Name of the sport
      * @returns A list of events ready for receiving bets (JSON ready to be parsed by the frontend)
      */
    getBETEvents(sport: string ):object[];

    /**
      * Returns a event object that the DB is ready to parse
      * @param {string} sport Name of the sport
      * @param {string} id Identifier of a sport
      * @returns Returns a JSON that the DB is ready to parse
      */
    getEventDB(sport: string ,id: string ):  {ID : string,DataEvent : string,Descricao : string,Resultado : number,Estado : "BET" | "CLS" | "FIN",Liga :string,Desporto: "FUT"|"FUTPT"|"BSK"|"F1"};


    /**
      * Activate super odds in a given event
      * @param {string} sport Name of the support
      * @param {string} id Identifier of the event
      * @param {number} multiplier Multiplier of the odd
      * @returns Returns true if the supper odd was activated in the specific event
      */ 
    superOdds(sport: string , id: string ,multiplier: any):boolean;

    /**
      * Updates the winner of a given event
      * @param {string} sport Name of the sport
      * @param {string} id Identifier of the event
      * @param {number} result The result of the event
      * @param {string} description Updated description
      */
    updateWinner(sport: string ,id: string ,result: number,description: string):void;


    /**
      * Closes an event
      * @param {string} sport Name of the sport
      * @param {string} id Identifier of the event
      * @returns Returns true if the event was closed, and false otherwise
      */
    closeEvent(sport: string ,id: string ):boolean;

    /**
      * Returns the participants of an event
      * @param {string} sport Name of the sport
      * @param {string} id Identifier of the event 
      * @returns Returns a list of participants in the event
      */
    getParticipants(sport: string ,id: string ):string[];
    

    /**
      * Returns the odds for the results of a given event
      * @param {string} sport 
      * @param {string} id 
      * @returns REturns a list of odds
      */
    getOdds(sport: string ,id: string ):number[];
    
    /**
      * Returns the state of a given sport event
      * @param {string} sport Name of the sport
      * @param {string} id Identifier of the event 
      * @returns Returns the state of the event (NODD, BET, CLS, FIN)
      */
    getState(sport: string ,id: string ):string;



    /**
      * Returns the of an event
      * @param {string} sport Name of the sport
      * @param {string} id Identifier of the event
      * @returns Returns a string containing the description of an event
      */
    getDescription(sport: string ,id: string ):string;


    /**
      * Returns the leagues with sport events
      * @param {string} sport 
      * @returns A list of strings representing the leagues
      */
    getLeagues(sport: string ):string[];


     /**
      * Removes the events that have past dates (already happened)
      * @param {string} sport Sport from which to delete all past event
      */
    removePastEvents(sport: string ):void;
}