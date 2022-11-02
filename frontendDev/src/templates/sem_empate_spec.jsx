import { useState } from 'react'
import { Form } from 'react-router-dom'
import { getToken } from '../utils'
import axios from 'axios'

async function register_bet(data){
	console.log(data);
   axios({method:'POST',url:'http://localhost:8080/api/addEventOdd/',data:data}) 
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

export default function SemEmpate({evento,sportid}){
  let input = {sport:sportid,token:getToken(),Odds:[1,1],EventoId:evento.EventoId.toString()};

  function handleChange({target}){
    var aux = input;
    input.Odds[parseInt(target.name)] = target.value;
    input = input;
    console.log(input);
  } 

  async function handleSubmit(){
 	await register_bet(input);
  }

	return(
		 <div class="bet-element">
            <div class="drawmatch">
              <img src={evento.Logos[0]} style={{"padding":"10px"}}></img>
              <p>{evento.Participantes[0]} - {evento.Participantes[1]}</p>
              <img src={evento.Logos[1]} style={{"padding":"10px"}}></img>
            </div>
            <div class="drawmatchodds">
	            <Form onSubmit={handleSubmit}>
	              <input type="text" style={{"margin":"10px"}} name="0" placeholder={`home odd ${evento.Odds[0]}`} onChange={handleChange}/>
	              <input type="text" style={{"margin":"10px"}} name="1" placeholder={`away odd ${evento.Odds[1]}`} onChange={handleChange}/>
	              <button style={{"padding":"20px","justify-content":"center"}} type="submit">Submeter</button>  
	            </Form>
            </div>
          </div> 
	);
}