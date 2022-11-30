/**
 * @file EventList,js
 * 
 */
import {RaceEvent} from "./RaceEvent"
import {NoTieEvent} from "./NoTieEvent"
import { TieEvent } from "./TieEvent";
import { SportEvent } from "./SportEvent";

 
const BETODDREL = 0.001;
 
 
let instance:any = undefined
 
class EventList{
     eventList: { [sport: string]: {[id: string]: SportEvent | NoTieEvent | RaceEvent | TieEvent }; };
     leagues: { [sport: string] : string[]};
 
     constructor(){
         this.eventList = {};
         this.leagues ={};
     }
 
     /**
      * Creates an instance of the EventList class if it does not exist, 
      * else returns the existing one
      * @returns Returns the singleton instance of this class
      */
     static getInstance(){
         if (instance == undefined){
             instance = new EventList();
         }
         return instance;
     }
 
 
     /** 
      * Adds a event to the event list where a draw is not a possible outcome
     * @param {string} sport Name of the sport
     * @param {string} league Name of the league
     * @param {string} id Identifier of the event
     * @param {string} description Description of the event
     * @param {number} result Result of the event (0 if home won and 1 if away won)
     * @param {string} state State of the event
     * @param {string} datetime Starting datetime of the event
     * @param {string} team1 Name of the home team
     * @param {string} team2 Name of the away team
     * @param {string} logo1 Url to the logo of the home team
     * @param {string} logo2 URL to the logo of the away team
     * @param {string} odds1 Odds of the home team winning
     * @param {string} odds1 Odds of the away team winning
     */
     addNoTieEventFromAPI(sport: string,league: string,id: string,description: string,result: number,state: string,datetime: string,team1: string, team2: string,logo1: string, logo2: string,odds1: number,odds2: number){
         if (this.eventList[sport] == undefined) {
             this.eventList[sport] = {};
             this.leagues[sport] = [];
         }
         this.eventList[sport][id] = new NoTieEvent(sport,league,id,description,result,state,datetime,team1,team2,logo1,logo2,odds1,odds2);
         if (!this.leagues[sport].includes(league))this.leagues[sport].push(league);
     }
 
     /**
      * Adds a event to the event list where a draw is a possible outcome
      * @param {string} sport Name of the sport
      * @param {string} league Name of the league
      * @param {string} id Identifier of the event
      * @param {string} description Description of the event
      * @param {number} result Winner of the event
      * @param {string} state Current state of the event
      * @param {string} datetime Date and time of the event
      * @param {string} team1 Name of the home team
      * @param {string} team2 Name of the away team
      * @param {string} logo1 URL with the logo of the home team
      * @param {string} logo2 URL with the logo of the away team
      * @param {string} odds1 Initial Odds of winning for home team for event
      * @param {string} odds2 Initial Odds of winning for away team for event
      * @param {string} oddsDraw Initial Odds of a draw for event
      */
     addTieEventFromAPI(sport: string,league: string,id: string,description:string,result: number,state: string,datetime:string, team1: string, team2: string,logo1: string, logo2: string,odds1:number,odds2:number,oddsDraw:number){
         if (this.eventList[sport] == undefined) {
             this.eventList[sport] = {};
             this.leagues[sport] = [];
         }
         this.eventList[sport][id] = new TieEvent(sport,league,id,description,result,state,datetime,team1,team2,logo1,logo2,odds1,odds2,oddsDraw);
         if (!this.leagues[sport].includes(league))this.leagues[sport].push(league);
     }
 
     /**
      * Adds a race event to the event list
      * @param {string} sport Name of the sport
      * @param {string} league Name of the league
      * @param {string} id Identifier of the event
      * @param {string} description String that contains the description of the event
      * @param {number} result Result of the event (-1 if it hasnt finished or the index of the winner pilot)
      * @param {string} state State of the event
      * @param {string} datetime Date and time of the event
      * @param {string[]} pilots List of names of the pilots participating in the race
      * @param {string[]} pilotsPhotos List of urls for each pilots face
      * @param {string} circuit Name of the circuit
      * @param {string} circuitPhoto Url for the circuit photo
      * @param {number[]} playerOdds List of odds for each contestant
      */
     addRaceEventFromAPI(sport: string,league: string,id: string,description: string,result: number,state: string, datetime: string, pilots: string[],pilotsPhotos: string[], circuit: string,circuitPhoto: string,playerOdds:number[]){
         if (this.eventList[sport] == undefined) {
             this.eventList[sport] = {};
             this.leagues[sport] = [];
         }
         this.eventList[sport][id] = new RaceEvent(sport,league,id,description,result,state, datetime, pilots,pilotsPhotos, circuit,circuitPhoto,playerOdds);
         if (!this.leagues[sport].includes(league))this.leagues[sport].push(league);
     }
 
 
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
     addEventFromDB(sport: string,league: string,id: string,description:string,result: number,state:string,datetime:string){
         if (this.eventList[sport] == undefined) {
             this.eventList[sport] = {};
             this.leagues[sport] = [];
         }
         this.eventList[sport][id] = new SportEvent(sport,league,id,description,result,state,datetime);
         if (!this.leagues[sport].includes(league))  this.leagues[sport].push(league);
         
     }
 
     /**
      * Returns an event given a sport and an ID
      * @param {string} sport 
      * @param {string} id 
      * @returns An Event (not a copy)
      */
     getEvent(sport: string ,id: string ){
         if (this.eventList[sport] != undefined && this.eventList[sport][id]){
             return this.eventList[sport][id];
         }
         else return undefined;
     }
 
     /**
      * Method that alters the odd for a specific event
      * @param {string} sport Name of the sport
      * @param {string} id Identifier of event
      * @param {number[]} odds List of odds to be assigned
      * @returns Returns true if the odds were added correctly
      */
     changeEventOdd(sport: string ,id: string ,odds: number[]){
 
         if (this.eventList[sport][id] != undefined && this.eventList[sport][id].getState() == "NODD"){
                 if (this.eventList[sport][id] instanceof RaceEvent || this.eventList[sport][id] instanceof NoTieEvent || this.eventList[sport][id] instanceof TieEvent){
                     (this.eventList[sport][id] as RaceEvent | NoTieEvent | TieEvent).changeOdds(odds);
                     this.eventList[sport][id].readyEvent();
                     return true;
                 }
         }
         return false;
     }
 
 
     /**
      * Method that updates the odds of an event based on a bet
      * @param {string} sport Name of the sport
      * @param {string} id Identifier of event
      * @param {number} money Money used in the bet
      * @param {number} choice Team with bet
      * @returns Returns true if the odds were added correctly
      */
      updateOddBet(sport: string ,id: string ,money: number,choice: number){
         let odds = [];
         if (this.eventList[sport][id] != undefined && this.eventList[sport][id].getState() == "BET"){
                 if (this.eventList[sport][id] instanceof RaceEvent || this.eventList[sport][id] instanceof NoTieEvent || this.eventList[sport][id] instanceof TieEvent){
                     odds = (this.eventList[sport][id] as RaceEvent | NoTieEvent | TieEvent).getOdds();
                     for (let i=0; i<odds.length;i++){
                         if (i != choice) odds[i]+=money*BETODDREL;
                         else if (odds[i]>1) odds[i]-=money*BETODDREL;
                     }
                     (this.eventList[sport][id] as RaceEvent | NoTieEvent | TieEvent).changeOdds(odds);
                     return true;
                 }
         }
         return false;
     }
 
 
 
 
 
 
     /**
      * Function responsible for returning the stored events withou odds from a sport
      * @param {string} sport Name of the sport  
      * @returns Returns a list of event without odds
      */
     getNODDEvents(sport: string ){
         let lst = [];
         for(let match in this.eventList[sport]){
             if (this.eventList[sport][match].getState() == "NODD") {
                 lst.push(((this.eventList[sport][match]) as RaceEvent | NoTieEvent | TieEvent).toJson()); 
             
             }
         }
         return lst.sort((a,b)=>{
             return (new Date(a["Data"]) as any) - (new Date(b["Data"]) as any)
 
         });
     }
 
     /**
      * Returns a list of events ready for receiving bets
      * @param {string} sport Name of the sport
      * @returns A list of events ready for receiving bets
      */
     getBETEvents(sport: string ){
         let lst = [];
         for(let match in this.eventList[sport]){
             if (this.eventList[sport][match].getState() == "BET") lst.push((this.eventList[sport][match] as RaceEvent | NoTieEvent | TieEvent).toJson());
         }
         return lst.sort((a,b)=>{
            return (new Date(a["Data"]) as any) - (new Date(b["Data"]) as any)
 
         });
     }
 
     /**
      * Returns an event to the front end
      * @param {string} sport Name of the sport
      * @param {string} id Identifier of a sport
      * @returns Returns a JSON that the front end is ready to parse
      */
     getEventFE(sport: string ,id: string ){
         if (this.eventList[sport][id] != undefined)
             return (this.eventList[sport][id] as RaceEvent | NoTieEvent | TieEvent).toJson();
 
         else return null;
     }
 
     /**
      * Returns a event object that the DB is ready to parse
      * @param {string} sport Name of the sport
      * @param {string} id Identifier of a sport
      * @returns Returns a JSON that the DB is ready to parse
      */
     getEventDB(sport: string ,id: string ){
         if (this.eventList[sport][id] != undefined)
             return this.eventList[sport][id].toDB();
 
         else return null;
     }
 
 
     /**
      * Updates the winner of a given event
      * @param {string} sport Name of the sport
      * @param {string} id Identifier of the event
      * @param {number} result The result of the event
      * @param {string} description Updated description
      */
     updateWinner(sport: string ,id: string ,result: number,description: string){
         this.eventList[sport][id].updateWinner(result,description);
     }
 
     /**
      * Activate super odds in a given event
      * @param {string} sport Name of the support
      * @param {string} id Identifier of the event
      * @param {number} multiplier Multiplier of the odd
      * @returns Returns true if the supper odd was activated in the specific event
      */ 
     superOdds(sport: string , id: string ,multiplier: any){
         if (this.eventList[sport][id] != undefined && !this.eventList[sport][id].isSuperOddsOn()){
             (this.eventList[sport][id] as RaceEvent | NoTieEvent | TieEvent).superOdds(multiplier);
             return true;
         }
         else return false;
     }
 
     /**
      * Closes an event
      * @param {string} sport Name of the sport
      * @param {string} id Identifier of the event
      * @returns Returns true if the event was closed, and false otherwise
      */
     closeEvent(sport: string ,id: string ){
         if (this.eventList[sport][id] != undefined){
             this.eventList[sport][id].closeEvent();
             return true;
         }
         else return false;
     }
     /**
      * Returns the participants of an event
      * @param {string} sport Name of the sport
      * @param {string} id Identifier of the event 
      * @returns Returns a list of participants in the event
      */
     getParticipants(sport: string ,id: string ){
         if (this.eventList[sport][id] != undefined){
             return (this.eventList[sport][id] as RaceEvent | NoTieEvent | TieEvent).getParticipants();
 
         }
         else return null;
     }
     /**
      * Returns the odds for the results of a given event
      * @param {string} sport 
      * @param {string} id 
      * @returns REturns a list of odds
      */
     getOdds(sport: string ,id: string ){
         if (this.eventList[sport][id] != undefined){  
             return (this.eventList[sport][id] as RaceEvent | NoTieEvent | TieEvent).getOdds();
         }
         else return null;
     }
 
     /**
      * Returns the state of a given sport event
      * @param {string} sport Name of the sport
      * @param {string} id Identifier of the event 
      * @returns Returns the state of the event
      */
     getState(sport: string ,id: string ){
         if (this.eventList[sport][id] != undefined){
             return this.eventList[sport][id].getState();
         }
         else return null;
     }
 
     /**
      * Returns a event object that the DB is ready to parse
      * @param {string} sport Name of the sport
      * @param {string} id Identifier of a sport
      * @returns Returns a JSON that the DB is ready to parse
      */
     toDb(sport: string ,id: string ){
         if (this.eventList[sport][id] != undefined){
             return this.eventList[sport][id].toDB();
         }
         else return null;
     }
     /**
      * Returns the description for an event
      * @param {string} sport Name of the sport
      * @param {string} id Identifier of the event
      * @returns Returns a string containing the description of an event
      */
     getDescription(sport: string ,id: string ){
         if (this.eventList[sport][id] != undefined){
             return this.eventList[sport][id].getDescription();
         }
         else return null;
     }
     
     /**
      * Returns the leagues with sport events
      * @param {string} sport 
      * @returns A list of strings representing the leagues
      */
     getLeagues(sport: string ){
         if (this.leagues[sport] != undefined){
             return this.leagues[sport];
         }
         else return [];
     }
     
     /**
      * Removes the PastEvents from the backend
      * @param {string} sport Sport from which to delete all past event
      */
     removePastEvents(sport: string ){
         let lst = [];
         for (let event of Object.values(this.eventList[sport])){
             let date = event.getDate();
             if (Date.parse(date) < Date.now()){
                 lst.push(event.getID());
             }
         }
         for (let id of lst){
             delete this.eventList[sport][id];
         }
         
     }
 
 }
 
module.exports = EventList;