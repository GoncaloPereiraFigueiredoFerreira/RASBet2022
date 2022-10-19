import {useState} from 'react'
import {Outlet} from 'react-router-dom'

export default function Root_login() {
	return(
		<div>
		<Outlet/>
		</div>
	);
}