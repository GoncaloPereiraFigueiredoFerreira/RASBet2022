
interface IControlEvents{

    
 
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
      * Closes an event
      * @param {string} sport Name of the sport
      * @param {string} id Identifier of the event
      * @returns Returns true if the event was closed, and false otherwise
      */
    closeEvent(sport: string ,id: string ):boolean;


    

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


    addGameFollower(sport:string, id:string,email:string):boolean;

    getGameFollowers(sport:string,id:string):string[];

    removeGameFollower(sport:string, id:string,email:string):boolean;

    getGamesFollowed(sport:string,userMail:string):string[];
}