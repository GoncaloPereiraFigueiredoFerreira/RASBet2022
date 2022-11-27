import Race from "./race"
import Empate from "./empate"
import SemEmpate from "./sem_empate"

function aux(evento,addAposta,ind,escolhas){
	if(evento.Tipo == 'RaceEvent') return(<Race evento={evento} addAposta={addAposta} escolhas={escolhas} key={evento.EventoId.toString()}/>);
	else if(evento.Tipo == 'TieEvent') return(<Empate evento={evento} addAposta={addAposta} escolhas={escolhas} key={evento.EventoId.toString()}/>);
	else if(evento.Tipo == 'NoTieEvent') return(<SemEmpate evento={evento} addAposta={addAposta} escolhas={escolhas} key={evento.EventoId.toString()}/>);
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

	return (<>{props.data.map((evento,ind)=>((check(props.filter,evento))?aux(evento,props.addBet,ind,selecionados(evento)):null))}</>);
}