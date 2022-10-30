import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import {useState} from 'react'

import ErrorPage from './error-page.jsx'

import Index from './routes/index.jsx'
import Root from './routes/root.jsx'
import Sport, {loader as sportLoader}from './routes/sport.jsx'
import Specialist from './routes/spec.jsx'
import Perfil from './routes/perfil.jsx'
import Carteira from './routes/wallet.jsx'
import HistT from './routes/histT.jsx'
import HistA from './routes/histA.jsx'

import Login from './routes/login.jsx'
import Register,{action as registerAction} from './routes/register.jsx'

function App(){
	const t = useState("");
	const router = createBrowserRouter([
	  {
	    path: "/",
	    element: <Root />,
	    errorElement: <ErrorPage />,
	    children: [
	      { index: true, element: <Index /> },
	      {
	      	path: "sport/:sportid",
	      	loader: sportLoader,
	      	element: <Sport />,
	      }
	    ],
	  },
	  {
	    path: "/login",
	    element: <Login />,
	  },
	  {
        path: "/register",
        action: registerAction,
        element: <Register/>,   
	   },
	   {
        path: "/specialist",
        element: <Specialist/>,   
	   },
	   {
        path: "/perfil",
        element: <Perfil/>,   
	   },
	   {
        path: "/carteira",
        element: <Carteira/>,   
	   },
	   {
        path: "/histT",
        element: <HistT/>,   
	   },
	   {
        path: "/histA",
        element: <HistA/>,   
	   }

	]);

	return (<RouterProvider router={router} />);
}

export default App;