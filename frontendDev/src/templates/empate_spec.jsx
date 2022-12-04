import { useState } from 'react'
import { Form } from 'react-router-dom'
import { getToken,parseDate} from '../utils'
import axios from 'axios'

		/**
     * Post request to specialist register an odds to an event
     * @param JSON data to send in the Post request
     * @returns Returns the data if request sucessed or false
     */

async function register_bet(data){
	console.log(data);
  let ret = await axios({method:'POST',url:'http://localhost:8080/api/addEventOdd/',data:data}) 
  .then(function (response) {
  	console.log(response)
    return response;
  })
  .catch(function (error) {
  	console.log(error);
    return false;
  });
  return ret
}

    /**
     * Component that render a Draw event to a specialist
     * @params properties of the component
     * @returns Returns HTML for the component 
     */

export default function Empate({evento,sportid,update,ind}){
  let input = {sport:sportid,token:getToken(),Odds:[evento.Odds[0],evento.Odds[1],evento.Odds[2]],EventoId:evento.EventoId.toString()};

  /**
   * Handle changes in the input fields 
   * @param input field that changed
   */

  function handleChange({target}){
    var aux = input;
    input.Odds[parseInt(target.name)] = parseFloat(target.value);
    input = input;
    console.log(input);
  } 

  /**
   * Handle submit of a form, send login request
   */

  async function handleSubmit(){
 		let ret = await register_bet(input);
 		console.log(ret);
  	if(ret){update(ind);console.log(update,ind)}
  }

	return(
		  <div class="bet-element">
		    <div className="drawmatch">
					<p style={{"margin":"0px",'font-weight':'bold'}}>{evento.Liga}</p>
		      <div style={{"display":"flex",'flex-direction':'row','float':'left'}}>
						<img src={evento.Logos[0]} style={{"padding":"10px"}}></img>
		        <p >{evento.Participantes[0]} - {evento.Participantes[1]}</p>
						<img src={evento.Logos[1]} style={{"padding":"10px"}}></img>
		      </div>
					<p style={{"margin":"0px",'font-weight':'bold'}}>{parseDate(evento.Data)}</p>
		    </div>
        <div class="drawmatchodds">
	        <Form onSubmit={handleSubmit} style={{'display':'flex','flex-direction':'row'}}>
            <div style={{'display':'flex','flex-direction':'column'}}>
	          <input type="text" style={{"margin":"10px"}} name="0" placeholder={`home odd ${evento.Odds[0]}`} pattern="\d*[1-9](\.\d{1,}|)" title="Intruduza valor superior a 1" onChange={handleChange}/>
	          <input type="text" style={{"margin":"10px"}} name="2" placeholder={`draw odd ${evento.Odds[2]}`} pattern="\d*[1-9](\.\d{1,}|)" title="Intruduza valor superior a 1" onChange={handleChange}/>
	          <input type="text" style={{"margin":"10px"}} name="1" placeholder={`away odd ${evento.Odds[1]}`} pattern="\d*[1-9](\.\d{1,}|)" title="Intruduza valor superior a 1" onChange={handleChange}/>

            </div>
 	          <button style={{"height":"fit-content",'background-color':'orange','margin-top':'auto','margin-bottom':'0'}} type="submit">Submeter</button> 
	        </Form>
        </div>
      </div> 
	);
}