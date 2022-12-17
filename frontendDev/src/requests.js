import axios from "axios"
import { getToken } from "./utils"

let URL = "http://localhost:8080/api"

export async function post_request(path, data){
	let ret = await axios({method:'POST',url: URL+path,data:data})
	    .then(function(response) {
	    	let data = {}
	    	data.error = false
	    	data.data = response.data
	    	return data
	    })
	    .catch(function(error) {
	    	let data = {}
	    	data.error = true
	    	data.data = error.response.data
	    	return data
	    })
	return ret
}

export async function get_request(path, params){
	let ret = await axios({method:'GET',url: URL+path,params:params})
	    .then(function(response) {
	    	let data = {}
	    	data.error = false
	    	data.data = response.data
	    	return data
	    })
	    .catch(function(error) {
	    	let data = {}
	    	data.error = true
	    	data.data = error.response.data
	    	return data
	    })
	return ret
}