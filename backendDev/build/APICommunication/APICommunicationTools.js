"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRequest = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * Function responsible for sending a http request
 *
 * @param {object} request object that specifies the configurations of a http request
 * @param {function} callback function that executes when the request is finished
 */
function makeRequest(request, callback) {
    return new Promise((resolve, reject) => {
        (0, axios_1.default)(request, { timeout: 90 })
            .then((response) => {
            if (response == null && response.status != 200) {
                console.error("Error found in the request response.\n");
                reject();
            }
            else {
                callback(response.data);
                resolve();
            }
        })
            .catch((error) => {
            reject(error);
        });
    });
}
exports.makeRequest = makeRequest;
module.exports = { makeRequest };
