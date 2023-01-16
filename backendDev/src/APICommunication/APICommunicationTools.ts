
import axios from 'axios';


/**
 * Function responsible for sending a http request
 * 
 * @param {object} request object that specifies the configurations of a http request 
 * @param {function} callback function that executes when the request is finished
 */
 export function makeRequest(request:any,callback:Function){
    return new Promise<void>((resolve,reject)=>{
      axios(request, {timeout: 90})
      .then( (response:any) => {
          if (response == null && response.status!=200){
            console.error("Error found in the request response.\n")
            reject();
          }
          else{      
            callback(response.data);
            resolve();
          }})
    .catch((error:any)=>{
      reject(error);
    })})
}


module.exports = {makeRequest}