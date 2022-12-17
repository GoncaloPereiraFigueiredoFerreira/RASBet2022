import axios from "axios"
import { getToken,getRToken,setToken } from "./utils"

let URL = "http://localhost:8080/api"

export async function post_request(path, params, token = null){
	token = (token)?token:getToken() 
	console.log(`Estou do post ${path}`)
	let ret = await axios({method:'POST',url: URL+path,data:params,headers:{"accesstoken":token}})
	    .then(function(response) {
	    	let data = {}
	    	data.error = false
	    	data.data = response.data
	    	return data
	    })
	    .catch(async function(error) {
	    	let data = {}
	    	console.log(error)
	    	if (error.response.status == 403){
				
	    		let ret = await post_request('/token/',{'refreshtoken': getRToken()})
	    		setToken(ret.data.AccessToken)
				
	    		data = post_request(path,params,ret.data.AccessToken)
	    		}
	    	else{
	    		data.error = true
	    		data.data = error.response.data
	    	}
	    	return data
	    })
	return ret
}

export async function get_request(path, params, token = null){
	token = (token)?token:getToken() 
	console.log(`Estou do get ${path}`)
	let ret = await axios({method:'GET',url: URL+path,params:params,headers:{"accesstoken":token}})
	    .then(function(response) {
	    	let data = {}
	    	data.error = false
	    	data.data = response.data
	    	return data
	    })
	    .catch(async function(error) {
	    	console.log(error)
	    	let data = {}
	    	if (error.response.status == 403){
				
	    		let ret = await post_request('/token/',{'refreshtoken': getRToken()})
	    		setToken(ret.data.AccessToken)
				
	    		data = get_request(path,params,ret.data.AccessToken)
	    		}
	    	else{
	    		data.error = true
	    		data.data = error.response.data
	    	}
	    	return data
	    })
	return ret
}