import { Form } from 'react-router-dom'
import { getToken,parseDate} from '../utils'
import axios from 'axios'
import {post_request} from "../requests"

		/**
     * Post request to specialist register an odds to an event
     * @param JSON data to send in the Post request
     * @returns Returns the data if request sucessed or false
     */

async function register_bet(data){
  let ret = await post_request('/addEventOdd/',data)
  if(ret.error) ret = false
  else ret = ret.data

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
    input.Odds[parseInt(target.name)] = parseFloat(target.value);
  } 

  /**
   * Handle submit of a form, send login request
   */

  async function handleSubmit(){
 		let ret = await register_bet(input);
  	if(ret){update(ind);}
  }

	return(
		  <div className="bet-element">
		    <div className="drawmatch">
					<p className="betinfo">{evento.Liga}</p>
		      <div style={{"display":"flex",'flexDirection':'row','float':'left'}}>
						<img alt="" src={evento.Logos[0]} style={{"padding":"10px"}}></img>
		        <p >{evento.Participantes[0]} - {evento.Participantes[1]}</p>
						<img alt="" src={evento.Logos[1]} style={{"padding":"10px"}}></img>
		      </div>
					<p className="betinfo">{parseDate(evento.Data)}</p>
		    </div>
        <div className="drawmatchodds">
	        <Form onSubmit={handleSubmit} style={{'display':'flex','flexDirection':'row'}}>
            <div style={{'display':'flex','flexDirection':'column'}}>
	          <input type="text" style={{"margin":"10px"}} name="0" placeholder={`home odd ${evento.Odds[0]}`} pattern="\d*[1-9](\.\d{1,}|)" title="Intruduza valor superior a 1" onChange={handleChange}/>
	          <input type="text" style={{"margin":"10px"}} name="2" placeholder={`draw odd ${evento.Odds[2]}`} pattern="\d*[1-9](\.\d{1,}|)" title="Intruduza valor superior a 1" onChange={handleChange}/>
	          <input type="text" style={{"margin":"10px"}} name="1" placeholder={`away odd ${evento.Odds[1]}`} pattern="\d*[1-9](\.\d{1,}|)" title="Intruduza valor superior a 1" onChange={handleChange}/>

            </div>
 	          <button style={{"height":"fitContent",'backgroundColor':'orange','marginTop':'auto','marginBottom':'0'}} type="submit">Submeter</button> 
	        </Form>
        </div>
      </div> 
	);
}