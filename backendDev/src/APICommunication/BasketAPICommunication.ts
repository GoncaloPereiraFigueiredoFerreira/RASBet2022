const cnf = require('config');
const API_AUTH_KEY = cnf.get("API_AUTH_KEY");
const STORE_RES = cnf.get("store_responses")
import {makeRequest} from "./APICommunicationTools"
import fs from 'fs';

export class BasketballAPICommunication implements SportAPICommunication{
    eventList:IUpdateEvents;
    filePath: string;
    

    public constructor(eventList:IUpdateEvents, path:string){
        this.eventList = eventList;
        this.filePath = path + "nba" + "Res.json";
    }

    fetchNewEvents(): void {
        let req = this.generateFetchRequest(API_AUTH_KEY,cnf.get("nba_league_id"),"2022-2023");
        makeRequest(req, (response:any)=>{
            this.parseFetchResponse(response);
            if (STORE_RES) fs.writeFile(this.filePath, JSON.stringify(response), { flag: 'w+' }, () =>{});
        }).catch((error)=>{console.warn("Error in nba events fetch. Trying to read cached files!"); this.fetchCachedEvents()});
    }

    fetchCachedEvents(): void {
        let existsFile = fs.existsSync(this.filePath);
        if (existsFile){
            let cachedResponse = JSON.parse(fs.readFileSync(this.filePath,"utf-8"));
            this.parseFetchResponse(cachedResponse);
        }else console.error("Error: Can't find cached file for Basketball events")
    }

    async updateEvents(events:string[]):Promise<void>{
        for (let game of events){
            let req = this.generateUpdateRequest(API_AUTH_KEY,game);
            await makeRequest(req,(response:any)=>{
                this.parseUpdateResponse(response);

            }
            ).catch(()=>
                console.error("Error in the basket update request")
            );
        }
        this.eventList.removePastEvents("BSK",events);
        this.fetchNewEvents();
       
    }


    generateFetchRequest(api_key:string,leagueID:number,season:string): any {
        return {
            method: 'get',
            url: 'https://v1.basketball.api-sports.io/games',
            params: {league: leagueID, season: season},
            headers: {  
              'x-rapidapi-key': api_key,
              'x-rapidapi-host': 'v1.basketball.api-sports.io'
            }
        };
    }

    generateUpdateRequest(api_key:string,match:string){
        return {
            method: 'get',
            url: 'https://v1.basketball.api-sports.io/games',
            params: {id:match},
            headers: {
                'x-rapidapi-key': api_key,
                'x-rapidapi-host': 'v1.basketball.api-sports.io'
            }
        };
    }


    parseFetchResponse(response:any): void {
        if (response.errors.length != 0) {
            console.error("Errors found in json response");
            console.log(response.errors)
        }
        else{
            for (let game of response.response){
                if (game.status.short == "NS"){
                   let id = game.id;
                   let date = game.date;
                   let league = "NBA";
                   let team1 = game.teams.home.name;
                   let team2 = game.teams.away.name;
                   let logo1 = game.teams.home.logo;
                   let logo2 = game.teams.away.logo;
                   this.eventList.addNoTieEventFromAPI("BSK",league,id,date,team1,team2,logo1,logo2,1,1)
                }
            }
        }
    }

        
    parseUpdateResponse(response:any): void {
        if (response.errors.length != 0) {
            console.error("Errors found in response response");
            console.log(response.errors)
        }
        else {
            let id = response.response[0].id;
            let result = -1;
            let scores =response.response[0].scores;
            let team1 = response.response[0].teams.home.name;
            let team2 = response.response[0].teams.away.name;
            if (scores.home.total != null &&  scores.away.total != null){
                if (scores.home.total > scores.away.total) result = 0;
                else if (scores.home.total < scores.away.total) result = 1;
            }
            if (result != -1) this.eventList.updateWinner("BSK",id,result,"("+scores.home.total+")" + " " + team1 + " - "+team2 + " "+ "("+scores.home.total+")");   
        }
    }
    



}