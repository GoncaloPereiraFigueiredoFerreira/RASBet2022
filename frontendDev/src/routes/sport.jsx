import {useLoaderData} from 'react-router-dom';
import axios from "axios"	

import {getToken} from "../utils"

import Bet from "../templates/Bet"
import Bet_spec from "../templates/Bet_spec"

export async function loader({params}){
	const token = getToken();
	const ret = await axios({method:'GET',url:'http://localhost:8080/api/eventList/',params:{"token":token,"sport":params.sportid}}) 
	  .then(function (response) {
	    console.log(response);
	    const data = {sportid:params.sportid,sport:response.data};
	    return data;
	  })
	  .catch(function (error) {
	    console.log(error);
	    return null;
	  });
	return ret;
}

export default function Sport(props){
	const {sportid,sport} = useLoaderData();

	console.log(sportid,sport);

	if(props.role == "apostador")
		return(<div className="betpage">
					<Bet data={sport}/>
				</div>
				);

	if(props.role == "Special")
		return(<div className="betpage">
					<Bet_spec data={sport} tipo={sportid}/>
				</div>
				);

}