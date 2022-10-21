import {useLoaderData} from 'react-router-dom';
	
export async function loader({params}){
	return params.sportid;
}

export default function Sport(){
	const sport = useLoaderData();

	return(
	<>
		<h1>{sport}</h1>
	</>
	);
}