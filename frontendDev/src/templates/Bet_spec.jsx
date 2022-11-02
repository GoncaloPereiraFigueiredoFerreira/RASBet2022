import Race from "./race_spec"
import Empate from "./empate_spec"
import SemEmpate from "./sem_empate_spec"

function aux(evento,tipo){
	if(evento.Tipo == 'RaceEvent') return(<Race evento={evento} sportid={tipo} key={evento.EventoId.toString()}/>);
	else if(evento.Tipo == 'TieEvent') return(<Empate evento={evento} sportid={tipo} key={evento.EventoId.toString()}/>);
	else if(evento.Tipo == "NoTieEvent") return (<SemEmpate evento={evento} sportid={tipo} key={evento.EventoId.toString()}/>);
}

export default function Bet(props){
	return (<>{props.data.map((evento,ind)=>(aux(evento,props.tipo)))}</>);
}