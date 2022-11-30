import {useState} from "react"

import Race from "./race_spec"
import Empate from "./empate_spec"
import SemEmpate from "./sem_empate_spec"
import NPags from "./NPags"

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
	const elem = 4;
	const [page,setPage] = useState(0);

	const filter = props.data.filter((evento)=>(check(props.filter,evento))); 
	const array = filter.slice(page * elem,(page+1) * (elem));
	return (
		<>
			{array.map((evento,ind)=>(aux(evento,props.tipo)))}
			<NPags paginas={filter.length/elem} func={setPage} atual={page}/>
		</>);
}