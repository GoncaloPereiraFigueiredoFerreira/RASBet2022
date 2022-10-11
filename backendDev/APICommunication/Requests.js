
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

function genF1RacesRequest(api_key,season){
    return {
        method: 'get',
        url: 'https://api-formula-1.p.rapidapi.com/races',
        params: {season: season, type:"Race"},
        headers: {
          'x-rapidapi-key': api_key,
          'x-rapidapi-host': 'api-formula-1.p.rapidapi.com'
        }
      };
}

function genF1DriversRequest(api_key,season){
    return {
        method: 'get',
        url: 'https://api-formula-1.p.rapidapi.com/rankings/drivers',
        params: {season: season},
        headers: {
          'x-rapidapi-key': api_key,
          'x-rapidapi-host': 'api-formula-1.p.rapidapi.com'
        }
      };
}

function genRaceRankingsRequest(api_key,race){
    return {
        method: 'get',
        url: 'https://api-formula-1.p.rapidapi.com/rankings/races',
        params: {race:race},
        headers: {
          'x-rapidapi-key': api_key,
          'x-rapidapi-host': 'api-formula-1.p.rapidapi.com'
        }
      };
}



module.exports = {
    genBasketRequest,
    genFutRequest,
    genF1RacesRequest,
    genF1DriversRequest,
    genRaceRankingsRequest
}