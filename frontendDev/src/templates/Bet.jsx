import Race from "./race"
import Empate from "./empate"
import SemEmpate from "./sem_empate"

function aux(evento,addAposta,ind){
	if(evento.Tipo == 'RaceEvent') return(<Race evento={evento} addAposta={addAposta} key={evento.EventoId.toString()}/>);
	else if(evento.Tipo == 'TieEvent') return(<Empate evento={evento} addAposta={addAposta} key={evento.EventoId.toString()}/>);
	else if(evento.Tipo == 'NoTieEvent') return(<SemEmpate evento={evento} addAposta={addAposta} key={evento.EventoId.toString()}/>);
}

export default function Bet(props){
	return (<>{props.data.map((evento,ind)=>(aux(evento,props.addBet,ind)))}</>);
}