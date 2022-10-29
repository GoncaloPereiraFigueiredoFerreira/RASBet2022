import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import {useState} from 'react'

import ErrorPage from './error-page.jsx'

import Index from './routes/index.jsx'
import Root from './routes/root.jsx'
import Sport, {loader as sportLoader}from './routes/sport.jsx'
import Perfil, {loader as perfilLoader} from './routes/perfil.jsx'

import Login,{action as loginAction} from './routes/login.jsx'
import Register,{action as registerAction} from './routes/register.jsx'

function App(){
	const [wallet,setWallet] = useState(0);
	const [role,setRole] = useState(0);
	const router = createBrowserRouter([
	  {
	    path: "/",
	    element: <Root wallet={wallet}/>,
	    errorElement: <ErrorPage />,
	    children: [
	      { index: true, element: <Index /> },
	      {
	      	path: "sport/:sportid",
	      	loader: sportLoader,
	      	element: <Sport role={role}/>,
	      },
	      {
	      	path: "perfil/:perfilid",
	      	loader: perfilLoader,
	      	element: <Perfil setWallet={setWallet}/>,
	      }
	    ],
	  },
	  {
	    path: "/login",
	    element: <Login setRole={setRole}/>,
	  },
	  {
        path: "/register",
        action: registerAction,
        element: <Register setRole={setRole}/>,   
	   }
	]);

	return (<RouterProvider router={router} />);
}

export default App;