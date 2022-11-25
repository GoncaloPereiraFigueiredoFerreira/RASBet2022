import Race from "./race_spec"
import Empate from "./empate_spec"
import SemEmpate from "./sem_empate_spec"

function aux(evento,tipo){
	if(evento.Tipo == 'RaceEvent') return(<Race evento={evento} sportid={tipo} key={evento.EventoId.toString() + evento.Liga}/>);
	else if(evento.Tipo == 'TieEvent') return(<Empate evento={evento} sportid={tipo} key={evento.EventoId.toString() + evento.Liga}/>);
	else if(evento.Tipo == "NoTieEvent") return (<SemEmpate evento={evento} sportid={tipo} key={evento.EventoId.toString() + evento.Liga}/>);
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
	return (<>{props.data.map((evento,ind)=>((check(props.filter,evento))?aux(evento,props.tipo):null))}</>);
}