const cnf = require('config');
const API_AUTH_KEY = cnf.get("API_AUTH_KEY");
const STORE_RES = cnf.get("store_responses")
import {makeRequest} from "./APICommunicationTools"
import fs from 'fs';

export class F1APICommunication implements SportAPICommunication{
    eventList:IUpdateEvents;
    filePath: string;
    

    public constructor(eventList:IUpdateEvents, path:string){
        this.eventList = eventList;
        this.filePath = path;
    }

    fetchNewEvents(): void {
        let req = this.genF1RacesRequest(API_AUTH_KEY);
        makeRequest(req,(json:any) =>{
            this.fetchNewEventsPt2(json);
            if (STORE_RES) fs.writeFile(this.filePath + "f1" + "Races" + "Res.json" , JSON.stringify(json), { flag: 'w+' }, () =>{});
        }).catch((error)=>{console.warn("Error in f1 events fetch. Trying to read cached files!"); this.fetchCachedEvents()});
    }

    fetchNewEventsPt2(races:any):void{
        let req = this.genF1DriversRequest(API_AUTH_KEY,2022);
        makeRequest(req,(pilots:any) =>{
            this.parseFetchResponse(races,pilots);
            if (STORE_RES) fs.writeFile(this.filePath + "f1"+ "Pilots" +"Res.json", JSON.stringify(pilots), { flag: 'w+' }, () =>{});
        }).catch((error)=>{console.warn("Error in f1 events fetch. Trying to read cached files!"); this.fetchCachedEvents()});
    }

    fetchCachedEvents(): void {
        let existsFile1 = fs.existsSync(this.filePath+ "f1" + "Races" + "Res.json");
        let existsFile2 = fs.existsSync(this.filePath+ "f1"+ "Pilots" +"Res.json");
        if (existsFile1 && existsFile2){
            let racesJson = JSON.parse(fs.readFileSync(this.filePath + "f1" + "Races" + "Res.json" ,"utf-8"));
            let pilotsJson = JSON.parse(fs.readFileSync(this.filePath + "f1"+ "Pilots" +"Res.json","utf-8"));
            this.parseFetchResponse(racesJson,pilotsJson);
        }else console.error("Unable to fetch the cached f1 files!")
    }


    async updateEvents(events:string[]):Promise<void>{

        for (let race of events){
            let req = this.genRaceRankingsRequest(API_AUTH_KEY,race);
            await makeRequest(req,(response:any)=>{
                this.parseUpdateResponse(response);
            }).catch(()=>
            console.error("Error in the formula one update request")
          );
        }
        this.eventList.removePastEvents("F1",events);
        this.fetchNewEvents();
    }

    /**
     * This functions generates a request that will cause a response to contain the next 10 formula one races
     * @param {String} api_key Api authentication token
     * @returns Returns a request object
     */
    genF1RacesRequest(api_key:string){
    return {
        method: 'get',
        url: 'https://v1.formula-1.api-sports.io/races',
        params: {type:"Race", next:10},
        headers: {
          'x-rapidapi-key': api_key,
          'x-rapidapi-host': 'v1.formula-1.api-sports.io'
        }
      };
    }

    /**
     * This functions generates a request that will cause a response to contain all the drivers in a given season
     * @param {String} api_key Api authentication token
     * @param {Number} season The season where the drivers participated in formula one championship
     * @returns Returns a request object
     */
    genF1DriversRequest(api_key:string,season:number){
    return {
        method: 'get',
        url: 'https://v1.formula-1.api-sports.io/rankings/drivers',
        params: {season: season},
        headers: {
          'x-rapidapi-key': api_key,
          'x-rapidapi-host': 'v1.formula-1.api-sports.io'
        }
      };
}
    /**
     * This functions generates a request that will cause a response to contain the rankings of a given race
     * @param {String} api_key Api authentication token
     * @param {String} race Id of a race
     * @returns Returns a request object
     */
    genRaceRankingsRequest(api_key:string,race:string){
        return {
            method: 'get',
            url: 'https://v1.formula-1.api-sports.io/rankings/races',
            params: {race:race},
            headers: {
            'x-rapidapi-key': api_key,
            'x-rapidapi-host': 'v1.formula-1.api-sports.io'
            }
        };
    }


    parseFetchResponse(races:any,pilots:any): void {
        let pilotsNames = [];
        let pilotsPhotos = [];
        if (races.errors.length != 0 || pilots.errors.length != 0) {
            console.error("Errors found in json response");
            console.log(races.errors)
            console.log(pilots.errors)
        }
        else{
            for (let pilot of pilots.response){
                pilotsNames.push(pilot.driver.name  + "-" +pilot.team.name);
                pilotsPhotos.push(pilot.driver.image);
            }
            for (let race of races.response){
               let id = race.id;
               let date = race.date;
               let circuit = race.competition.name;
               let circuitPhoto = race.circuit.image;
               let playerOdds = []; for (let i=0; i<pilotsNames.length; ++i) playerOdds.push(1);
               this.eventList.addRaceEventFromAPI("F1","World F1 Competition",id,date,pilotsNames,pilotsPhotos,circuit,circuitPhoto,playerOdds);
            }
    
        }
    }

        
    parseUpdateResponse(response:any): void {
        if (response.errors.length != 0) {
            console.error("Errors found in response");
            console.log(response.errors)
        }
        else{
            let id = response.response[0].race.id;
            let pilotList = this.eventList.getParticipants("F1",id);
            let winner =  response.response[0].driver.name;
            let index = pilotList.indexOf(winner);
            this.eventList.updateWinner("F1",id,index,"Vencedor: "+winner);
        }
    }
}