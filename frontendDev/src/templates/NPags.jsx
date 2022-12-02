    /**
     * Component that render the select page in pages 
     * @params properties of the component
     * @returns Returns HTML for the component 
     */

export default function NPags({paginas,func,atual}){
	let m = []
	paginas = Math.ceil(paginas);

	if(atual > paginas){func(0);}

	if(paginas > 1 && paginas <6){
		for(let i = 0;i < paginas;i++)
			m.push(i);
	}
	else if (paginas > 5){
		if(atual > 1) m.push(0);
		if(atual > 0)m.push(atual - 1);
		m.push(atual);
		if(atual < paginas - 2)m.push(atual + 1);
		if(atual < paginas - 1) m.push(paginas - 1);
	}

	return(
		<>
			<p>{m.map((e,ind)=>(<button style={{"backgroundColor":((e==atual)?"Red":"Grey")}} onClick={()=>(func(e))} key={e}>{e+1}</button>))}</p>
		</>
		);
}