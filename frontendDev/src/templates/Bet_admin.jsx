import {useState} from "react"

import axios from "axios"
import {getToken,parseDate} from "../utils"
import {Form} from "react-router-dom"
import NPags from "./NPags"

async function cancelar_aposta(evento,sport){
	var data = {Token:getToken(),Evento:{EventoID:evento.EventoId,Desporto:sport}};
   var resp = axios({method:'POST',url:'http://localhost:8080/api/closeEvent/',data:data}) 
  .then(function (response) {
    console.log("response",response);
    const data = response.data;
  })
  .catch(function (error) {
    console.log(error);
    return null;
  });
}

async function add_Super_Odds(data){
   var resp = axios({method:'POST',url:'http://localhost:8080/api/superOdds/',data:data}) 
  .then(function (response) {
    console.log("response",response);
    const data = response.data;
  })
  .catch(function (error) {
    console.log(error);
    return null;
  });
}


function Aux({evento,sport}){
	var desc = "";
	if(evento.Tipo == "RaceEvent") desc = `${evento.Liga}`;
	else desc = `${evento.Participantes[0]} - ${evento.Participantes[1]}`
	var input={token:getToken(),sport:sport,EventoID:evento.EventoId};

	function handleChange({target}){
		input[target.name] = target.value;
	}

	function handleSubmit(){
		console.log("input",input);
		add_Super_Odds(input);
	}

	const width = window.innerWidth;

	if(width>1000){
	return(
				<div className="bet-element">
		            <div className="drawmatch">


		            	{(evento.Tipo=="RaceEvent")?<>            
						<img src={evento.Logos[evento.Participantes.length]} style={{"padding":"10px",'height':'11vh'}}/>
            			<div>
                			<p style={{'font-weight':'bold'}}>{evento.Liga}</p>
                			<p style={{'font-weight':'bold'}}>{parseDate(evento.Data)}</p>
           			 	</div>
						</>:null}
		              	{(evento.Tipo!="RaceEvent")?<>
							<p style={{"margin":"0px",'font-weight':'bold'}}>{evento.Liga}</p>
							<div style={{"display":"flex",'flex-direction':'row','float':'left'}}>
								<img src={evento.Logos[0]} style={{"padding":"10px"}}></img>
								<p style={{}}>{evento.Participantes[0]} - {evento.Participantes[1]}</p>
								<img src={evento.Logos[1]} style={{"padding":"10px"}}></img>
							</div>
							<p style={{"margin":"0px",'font-weight':'bold'}}>{parseDate(evento.Data)}</p>
					  	</>:null}
		            </div>
		            <div className="drawmatchodds"style={{'width':'30%'}}>
		              <Form onSubmit={handleSubmit} style={{'dispaly':'flex','flex-direction':'column','justify-content':'space-between'}}>
						<input type="text" style={{"margin-bottom":"1vh","width":"100%"}} name="multiplier" placeholder="Super Odds" onChange={handleChange} pattern="\d*(.\d+|)"/>
						<button style={{"height":"fit-content","width":"45%",'background-color':'orange','margin-left':'auto','margin-right':'0'}}>Confirmar</button>
						<button style={{"height":"fit-content","width":"45%",'background-color':'orange','margin-left':'10%','margin-right':'0'}} onClick={()=>{if(window.confirm("Deseja cancelar?")){cancelar_aposta(evento,sport);window.location.reload(false);}}}>Remover</button>
		              </Form>
		            </div>
	          	</div>
	);
	}
	else{
		return(
			<div className="bet-element">
				<div className="drawmatch">


					{(evento.Tipo=="RaceEvent")?<>            
					<img src={evento.Logos[evento.Participantes.length]} style={{"padding":"10px",'height':'11vh'}}/>
					<div>
						<p style={{'font-weight':'bold'}}>{evento.Liga}</p>
						<p style={{'font-weight':'bold'}}>{parseDate(evento.Data)}</p>
						</div>
					</>:null}
					  {(evento.Tipo!="RaceEvent")?<>
						<p style={{"margin":"0px",'font-weight':'bold'}}>{evento.Liga}</p>
						<div style={{"display":"flex",'flex-direction':'row','float':'left'}}>
							<img src={evento.Logos[0]} style={{"padding":"10px"}}></img>
							<p style={{}}>{evento.Participantes[0]} - {evento.Participantes[1]}</p>
							<img src={evento.Logos[1]} style={{"padding":"10px"}}></img>
						</div>
						<p style={{"margin":"0px",'font-weight':'bold'}}>{parseDate(evento.Data)}</p>
					  </>:null}
				</div>
				<div className="drawmatchodds">
				  <Form onSubmit={handleSubmit} style={{'dispaly':'flex','flex-direction':'column','justify-content':'space-between'}}>
					<input type="text" style={{"margin-bottom":"1vh","width":"100%"}} name="multiplier" placeholder="Super Odds" onChange={handleChange} pattern="\d*(.\d+|)"/>
					<button style={{"height":"fit-content","width":"100%",'background-color':'orange','margin-left':'auto','margin-right':'0'}} type="submit">Confirmar</button>
					<button style={{"height":"fit-content","width":"100%",'background-color':'orange','margin-left':'auto','margin-right':'0','margin-top':'1vh'}} onClick={()=>{if(window.confirm("Deseja cancelar?")){cancelar_aposta(evento,sport);window.location.reload(false);}}}>Remover</button>
				  </Form>
				</div>
			  </div>
		);
	}
}

function check(filter,evento){
	let ret = true;
	if (filter.ligas.size > 0){
		ret = filter.ligas.has(evento.Liga); 
	}
	if(ret && filter.name != ""){
		let str = evento.Participantes.join();
		str = str + evento.Liga + evento.Data;
		ret = (str.search(filter.name) >= 0)? true:false;
	}
	return ret;
}


export default function Bet(props){
	const elem = 4;
	const [page,setPage] = useState(0);

	const filter = props.data.filter((evento)=>(check(props.filter,evento))); 
	const array = filter.slice(page * elem,(page+1) * (elem));

	return(
		<>
		{array.map((evento,ind)=>(<Aux evento={evento} sport={props.sport}key={ind.toString()}/>))}
		<NPags paginas={filter.length/elem} func={setPage} atual={page}/>
		</>);
}