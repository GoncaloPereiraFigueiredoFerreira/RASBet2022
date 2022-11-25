import Race from "./race"
import Empate from "./empate"
import SemEmpate from "./sem_empate"

function aux(evento,addAposta,ind){
	if(evento.Tipo == 'RaceEvent') return(<Race evento={evento} addAposta={addAposta} key={evento.EventoId.toString()}/>);
	else if(evento.Tipo == 'TieEvent') return(<Empate evento={evento} addAposta={addAposta} key={evento.EventoId.toString()}/>);
	else if(evento.Tipo == 'NoTieEvent') return(<SemEmpate evento={evento} addAposta={addAposta} key={evento.EventoId.toString()}/>);
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
	return (<>{props.data.map((evento,ind)=>((check(props.filter,evento))?aux(evento,props.addBet,ind):null))}</>);
}