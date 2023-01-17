const cnf = require('config');
const API_AUTH_KEY = cnf.get("API_AUTH_KEY");
const STORE_RES = cnf.get("store_responses")
import {makeRequest} from "./APICommunicationTools"
import fs from 'fs';

export class FutebolAPICommunication implements SportAPICommunication{
    eventList:IUpdateEvents;
    filePath: string;
    

    public constructor(eventList:IUpdateEvents, path:string){
        this.eventList = eventList;
        this.filePath = path;
    }


    fetchNewEvents(): void {
        let futLeagueDic = cnf.get("futebol_league_id");
        for (let league in futLeagueDic){
            let req = this.generateFetchRequest(API_AUTH_KEY,futLeagueDic[league],2022);
            makeRequest(req,(json:any)=>{
                this.parseFetchResponse(json);
                if (STORE_RES) fs.writeFile(this.filePath + "fut" + futLeagueDic[league] + "res.json", JSON.stringify(json), { flag: 'w+' }, () =>{});
            }).catch((error)=>{console.warn("Error in futebol events fetch. Trying to read cached files!"); this.fetchCachedEvents()});
    
        }
    }
    
    fetchCachedEvents(): void {
        let futLeagueDic = cnf.get("futebol_league_id");
        for (let league in futLeagueDic){
            let file = this.filePath + "fut" + futLeagueDic[league] + "res.json"
            let existsFile = fs.existsSync(file);
            if (existsFile){
                let cachedResponse = JSON.parse(fs.readFileSync(file,"utf-8"));
                this.parseFetchResponse(cachedResponse);

            }else console.error("Unable to fetch the cached file for "+ futLeagueDic[league] +" futebol league")
        }
    }
    // TODO - FALta fazer o async
    updateEvents(events:string[]):void{
        let fixturesLst = []
        let fixtureStr = ""
        let i =0;
        let l =0;
        while (i<events.length){
          l=0;
          while(l<20 && i<events.length){
            fixtureStr += events[i] + "-" 
            l++;
            i++;
          }
      
          fixtureStr = fixtureStr.slice(0,-1);
          fixturesLst.push(fixtureStr);
        }
        for (let request of fixturesLst){
          let req = this.generateUpdateRequest(API_AUTH_KEY,request);
            makeRequest(req,(response:any)=>{
                this.parseUpdateResponse(response);
            }).catch(()=>
            console.error("Error in the futebol update request")
        );
        }
        this.eventList.removePastEvents("FUT",events);
        this.fetchNewEvents();
               
    }


    generateFetchRequest(api_key:string,leagueID:string,season:number){
        return {
            method: 'get',
            url: 'https://v3.football.api-sports.io/fixtures',
            params: {league: leagueID, season: season, status:"NS-LIVE" },
            headers: {
              'x-rapidapi-key': api_key,
              'x-rapidapi-host': 'v3.football.api-sports.io'
            }
          };
    }

    generateUpdateRequest(api_key:string,fixtures:string){
        return {
            method: 'get',
            url: 'https://v3.football.api-sports.io/fixtures',
            params: {ids:fixtures},
            headers: {
              'x-rapidapi-key': api_key,
              'x-rapidapi-host': 'v3.football.api-sports.io'
            }
          };
    }


    parseFetchResponse(response:any): void {
        if (response.errors.length != 0) {
            console.error("Errors found in response");
            console.log(response.errors)
        }
        else{
            for (let match of response.response){
               let id = match.fixture.id;
               let date = match.fixture.date;
               let league = match.league.name;
               let team1 = match.teams.home.name;
               let team2 = match.teams.away.name;
               let logo1 = match.teams.home.logo;
               let logo2 = match.teams.away.logo;
               this.eventList.addTieEventFromAPI("FUT",league,id,date,team1,team2,logo1,logo2,1,1,1);
   
            }
        }
    }

        
    parseUpdateResponse(response:any): void {
        if (response.errors.length != 0) {
            console.error("Errors found in response response");
            console.log(response.errors)
        }
        else{
            for (let match of response.response){
                let id = match.fixture.id;
                let result = -1;
                if (match.goals.home != null &&  match.goals.away != null){
                    if (match.goals.home > match.goals.away) result = 0;
                    else if (match.goals.home < match.goals.away) result = 1;
                    else if (match.goals.home == match.goals.away) result = 2;
                }
                if (result != -1)  this.eventList.updateWinner("FUT",id,result,"("+match.goals.home+")"+match.teams.home.name+ " - " + match.teams.away.name+"("+match.goals.away+")");    
            }
        }
    }



}