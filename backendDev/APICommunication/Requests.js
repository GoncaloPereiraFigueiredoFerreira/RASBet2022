
function genFutRequest(api_key,leagueID,season){
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

function genBasketRequest(api_key,leagueID,season){
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

function genF1RacesRequest(api_key){
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


function genF1DriversRequest(api_key,season){
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

function genRaceRankingsRequest(api_key,race){
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

function genUselessRequest(){
    return {
        method: 'get',
        url: 'http://ucras.di.uminho.pt/v1/games/'
      }
}



module.exports = {
    genBasketRequest,
    genFutRequest,
    genF1RacesRequest,
    genF1DriversRequest,
    genUselessRequest,
    genRaceRankingsRequest
    
}