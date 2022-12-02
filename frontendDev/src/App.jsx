import {createBrowserRouter,RouterProvider,Navigate} from 'react-router-dom'
import {useState} from 'react'

import ErrorPage from './error-page.jsx'

import Index from './routes/index.jsx'
import Root from './routes/root.jsx'
import Sport, {loader as sportLoader}from './routes/sport.jsx'
import Perfil, {loader as perfilLoader} from './routes/perfil.jsx'
import Edit, {loader as editLoader} from './routes/edit.jsx'
import HistA, {loader as histALoader} from './routes/histA.jsx'
import HistT, {loader as histTLoader} from './routes/histT.jsx'
import Wallet from './routes/wallet.jsx'

import Login,{action as loginAction} from './routes/login.jsx'
import Register from './routes/register.jsx'

import {getRole} from "./utils"

  /**
   * First funtion called in frontend
   * Creates the routing tree for the application
   */

function App(){
	const [flag,setFlag] = useState(false);
	const defaultPage = ((getRole())?<Navigate to="sport/FUTPT"/>:<Navigate to="login"/>);
	const router = createBrowserRouter([
	  {
	    path: "/",
	    element: <Root/>,
	    errorElement: <ErrorPage />,
	    children: [
	      { index: true, element: defaultPage},
	      {
	      	path: "sport/:sportid",
	      	loader: sportLoader,
	      	element: <Sport />,
	      },
	      {
	      	path: "perfil/:perfilid",
	      	loader: perfilLoader,
	      	element: <Perfil/>,
	      },
	      {
	      	path: "edit/:perfilid",
	      	loader: editLoader,
	      	element: <Edit/>,
	      },
	      {
	      	path: "histT/:perfilid",
	      	loader: histTLoader,
	      	element: <HistT/>,
	      },
	      {
	      	path: "histA/:perfilid",
	      	loader: histALoader,
	      	element: <HistA/>,
	      },
	      {
	      	path: "wallet/:perfilid",
	      	element: <Wallet />,
	      }
	    ],
	  },
	  {
	    path: "/login",
	    element: <Login set={setFlag} flag={flag}/>,
	  },
	  {
        path: "/register",
        element: <Register set={setFlag} flag={flag}/>,   
	   }
	]);

	return (<RouterProvider router={router} />);
}

export default App;