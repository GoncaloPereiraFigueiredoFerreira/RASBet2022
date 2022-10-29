import Race from "./race"
import Empate from "./empate"
import SemEmpate from "./sem_empate"

function aux(evento){
	if(evento.Tipo == 'RaceEvent') return(Race(evento));
	else if(evento.Tipo == 'TieEvent') return(Empate(evento));
	else if(evento.Tipo == 'NoTieEvent') return(SemEmpate(evento));
}

export default function Bet(props){
	console.log(props.data.map((evento)=>(aux(evento))));
	return (<>{props.data.map((evento)=>(aux(evento)))}</>);
}