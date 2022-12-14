"use strict";
/**
 * @file Requests.js
 *
 * This module is responsible for defining the types of requests to be used in the API communication
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.genFUTPTRequest = exports.genRaceRankingsRequest = exports.genF1DriversRequest = exports.genF1RacesRequest = exports.genBasketResultRequest = exports.genBasketRequest = exports.genFutResultRequest = exports.genFutRequest = void 0;
/**
 * This function is responsible for creating a football request that will cause a response to contain the future fixtures in a given football league
 *
 * @param {String} api_key Api authentication token
 * @param {String} leagueID Id of the football league
 * @param {Number} season Number of the season (such as 2022)
 * @returns {object} returns a request object
 */
function genFutRequest(api_key, leagueID, season) {
    return {
        method: 'get',
        url: 'https://v3.football.api-sports.io/fixtures',
        params: { league: leagueID, season: season, status: "NS-LIVE" },
        headers: {
            'x-rapidapi-key': api_key,
            'x-rapidapi-host': 'v3.football.api-sports.io'
        }
    };
}
exports.genFutRequest = genFutRequest;
/**
 * This function generates a request object that will cause a response containing the information about given football fixtures
 * @param {String} api_key Api authentication token
 * @param {string} fixtures List of fixture ids
 * @returns returns a request object
 */
function genFutResultRequest(api_key, fixtures) {
    return {
        method: 'get',
        url: 'https://v3.football.api-sports.io/fixtures',
        params: { ids: fixtures },
        headers: {
            'x-rapidapi-key': api_key,
            'x-rapidapi-host': 'v3.football.api-sports.io'
        }
    };
}
exports.genFutResultRequest = genFutResultRequest;
/**
 *  This function generates a request object that will cause a response containing the information about all the basket fixtures
 * @param {String} api_key Api authentication token
 * @param {Number} leagueID The id of the league
 * @param {String} season Season of the fixtures given in the format yyyy-yyyy (such as 2022-2023)
 * @returns Returns a request object
 */
function genBasketRequest(api_key, leagueID, season) {
    return {
        method: 'get',
        url: 'https://v1.basketball.api-sports.io/games',
        params: { league: leagueID, season: season },
        headers: {
            'x-rapidapi-key': api_key,
            'x-rapidapi-host': 'v1.basketball.api-sports.io'
        }
    };
}
exports.genBasketRequest = genBasketRequest;
/**
 * This function is responsible for creating a request object that will cause a response to contain the information about a given match
 * @param {String} api_key Api authentication token
 * @param {String} match Id of a match
 * @returns Returns a request object
 */
function genBasketResultRequest(api_key, match) {
    return {
        method: 'get',
        url: 'https://v1.basketball.api-sports.io/games',
        params: { id: match },
        headers: {
            'x-rapidapi-key': api_key,
            'x-rapidapi-host': 'v1.basketball.api-sports.io'
        }
    };
}
exports.genBasketResultRequest = genBasketResultRequest;
/**
 * This functions generates a request that will cause a response to contain the next 10 formula one races
 * @param {String} api_key Api authentication token
 * @returns Returns a request object
 */
function genF1RacesRequest(api_key) {
    return {
        method: 'get',
        url: 'https://v1.formula-1.api-sports.io/races',
        params: { type: "Race", next: 10 },
        headers: {
            'x-rapidapi-key': api_key,
            'x-rapidapi-host': 'v1.formula-1.api-sports.io'
        }
    };
}
exports.genF1RacesRequest = genF1RacesRequest;
/**
 * This functions generates a request that will cause a response to contain all the drivers in a given season
 * @param {String} api_key Api authentication token
 * @param {Number} season The season where the drivers participated in formula one championship
 * @returns Returns a request object
 */
function genF1DriversRequest(api_key, season) {
    return {
        method: 'get',
        url: 'https://v1.formula-1.api-sports.io/rankings/drivers',
        params: { season: season },
        headers: {
            'x-rapidapi-key': api_key,
            'x-rapidapi-host': 'v1.formula-1.api-sports.io'
        }
    };
}
exports.genF1DriversRequest = genF1DriversRequest;
/**
 * This functions generates a request that will cause a response to contain the rankings of a given race
 * @param {String} api_key Api authentication token
 * @param {String} race Id of a race
 * @returns Returns a request object
 */
function genRaceRankingsRequest(api_key, race) {
    return {
        method: 'get',
        url: 'https://v1.formula-1.api-sports.io/rankings/races',
        params: { race: race },
        headers: {
            'x-rapidapi-key': api_key,
            'x-rapidapi-host': 'v1.formula-1.api-sports.io'
        }
    };
}
exports.genRaceRankingsRequest = genRaceRankingsRequest;
function genFUTPTRequest() {
    return {
        method: 'get',
        url: 'http://ucras.di.uminho.pt/v1/games/'
    };
}
exports.genFUTPTRequest = genFUTPTRequest;
module.exports = {
    genBasketRequest,
    genFutRequest,
    genF1RacesRequest,
    genF1DriversRequest,
    genFUTPTRequest,
    genRaceRankingsRequest,
    genFutResultRequest,
    genBasketResultRequest
};
