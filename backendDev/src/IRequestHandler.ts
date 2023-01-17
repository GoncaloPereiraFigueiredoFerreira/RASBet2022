interface IRequestHandler{
    /**
     * Function that deals with a request to register an account in the database
     * 
     */
    registerFunction(request:any,response:any):void;

    /**
     * Function that deals with a http request to make a transaction to the wallet of a user
     */
     transactionFunction(request:any,response:any):void;

    /**
     * function that deals with a http request to check if the given credentials are in the database
     */
    loginFunction(request:any,response:any):void;

    /**
    * Function that deals with a http request to register a bet
    */
     registerBetFunction(request:any,response:any):void;

    /**
     * Function that deals with a http request to edit a profile of an account
     */
     editProfileFunction(request:any,response:any):void;

     /**
     * Function that deals with a http request to close an event
     */
      closeEventFunction(request:any,response:any):void;

    /**
     * Function that deals with a http request to add a promocional code to the database
     */
     addPromocaoFunction(request:any,response:any):void;

    /**
     * Function that deals with a http request to remove a promocional code from the database
     */
     remPromocaoFunction(request:any,response:any):void;


    /**
     * Function that deals with a http request to get all existing promocional codes in the database
     */
     getpromocaoFunction(request:any,response:any):void;

     /**
     * Function that deals with a http request to check if a given better already used a given promocional code
     */
     usedCodFunction(request:any,response:any):void;


    /**
     * Function that deals with a http request to get the profile of a given account
     */
     profileInfoFunction(request:any,response:any):void;


     /**
     * Function that deals with a http request to get the bet history of a given better
     */
     betHistoryFunction(request:any,response:any):void;

     /**
     * Function that deals with a http request to get the transaction history of a given better
     */
      transHistFunction(request:any,response:any):void;


    /**
     *  Handler for the request of a event list. This event list changes based on the user thats requesting it and 
     */
     returnEventList(request:any,response:any):void;

    /**
     * Handler for the request to add odds to a event (needs to be a specialist)
     */
     addEventOdds(request:any,response:any):void;


    /**
     * Start-up of the event list
     */
     initEventLst():void;

     /**
     * Method responsible for updating the events in the backend 
     */
     updateEvents(request:any,response:any):void;


     /**
     * Method responsible for activating super odds in a event
     */
     activateSuperOdds(request:any,response:any):void;
    
     /**
     * Method responsible for updating the odds of a certain event
     */
     getOdds(request:any,response:any):void;

     /**
     * Handler responsible for establishing the SSE
     */
      eventHandler(request:any,response:any,next:any):void;
      /**
       * Method that generates a new accessToken only if the refreshToken given is valid
       */
      refreshTokenFunction(request:any,response:any):void;


      /**
       * Method that add a follower to an event
       */
      addGameFollower(request:any,response:any):void;

      /**
       * Method that removes a follower from an event
       */
      removeGameFollower(request:any,response:any):void;

      /**
       * Method that updates the state of the events periodically
       */
      periodicUpdate(time:number):void;

      /**
       * Function that logouts a user
       */
      logoutFunction(request:any,response:any):void;
    }