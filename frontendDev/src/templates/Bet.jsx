import {useState} from "react"

import Race from "./race"
import Empate from "./empate"
import SemEmpate from "./sem_empate"
import NPags from "./NPags"

  /**
   * auxiliar function that separate events by type to ther components
   * @param event to be treated
   * @param funtion to add event to bet
   * @param position of that event in the list of events
   * @param array that contain selected bets
   */

function aux(evento,addAposta,ind,escolhas,follow,clickFollow){
	if(evento.Tipo == 'RaceEvent') return(<Race evento={evento} addAposta={addAposta} escolhas={escolhas} follow={follow} clickFollow={clickFollow} key={evento.EventoId.toString() + evento.Tipo}/>);
	else if(evento.Tipo == 'TieEvent') return(<Empate evento={evento} addAposta={addAposta} escolhas={escolhas} follow={follow} clickFollow={clickFollow} key={evento.EventoId.toString() + evento.Tipo}/>);
	else if(evento.Tipo == 'NoTieEvent') return(<SemEmpate evento={evento} addAposta={addAposta} escolhas={escolhas} follow={follow} clickFollow={clickFollow} key={evento.EventoId.toString() + evento.Tipo}/>);
}

  /**
   * funtion that checks if event pass the filters applied
   * @param filters applied
   * @param event
   * @returns a boolean if the event pass the filters applied
   */

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

    /**
     * Component that render a bet
     * @params properties of the component
     * @returns Returns HTML for the component 
     */

export default function Bet(props){

  /**
   * funtion that verifies if evnt is selected in the current bet
   * @param event
   * @returns a boolean that represents id an event is selected or not
   */

	function selecionados(evento){
		let ret;

		if(props.state){
			ret = (props.apostas.simples && evento.EventoId.toString() == props.apostas.simples.Evento.EventoID)?[props.apostas.simples.Evento.Escolha]:[]; 
		}
		else{
			ret = props.apostas.mult.map((e)=>{if(e.Evento.EventoID == evento.EventoId.toString()) return e.Evento.Escolha});
		}

		return ret
	}

	const elem = 20;
	const [page,setPage] = useState(0);


	const filter = props.data.filter((evento)=>(check(props.filter,evento))); 
	const array = filter.slice(page * elem,(page+1) * (elem));

	return (
		<>
			{array.map((evento,ind)=>(aux(evento,props.addBet,ind,selecionados(evento),props.follow.includes(evento.EventoId),props.clickFollow)))}
			<NPags paginas={filter.length/elem} func={setPage} atual={page}/>
		</>);
}