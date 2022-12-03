import {useState} from "react"

import Race from "./race_spec"
import Empate from "./empate_spec"
import SemEmpate from "./sem_empate_spec"
import NPags from "./NPags"

  /**
   * auxiliar function that separate events by type to their components
   * @param event to be treated
   * @param type of event
   */

function aux(evento,tipo,update,ind){
	if(evento.Tipo == 'RaceEvent') return(<Race evento={evento} sportid={tipo} update={update} ind={ind} key={evento.EventoId.toString() + evento.Liga}/>);
	else if(evento.Tipo == 'TieEvent') return(<Empate evento={evento} sportid={tipo} update={update} ind={ind} key={evento.EventoId.toString() + evento.Liga}/>);
	else if(evento.Tipo == "NoTieEvent") return (<SemEmpate evento={evento} sportid={tipo} update={update} ind={ind} key={evento.EventoId.toString() + evento.Liga}/>);
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
	const elem = 20;
	const [page,setPage] = useState(0);

	const filter = props.data.filter((evento)=>(check(props.filter,evento))); 
	const array = filter.slice(page * elem,(page+1) * (elem));
	return (
		<>
			{array.map((evento,ind)=>(aux(evento,props.tipo,props.update,ind)))}
			<NPags paginas={filter.length/elem} func={setPage} atual={page}/>
		</>);
}