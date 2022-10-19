import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import {useState} from 'react'

import ErrorPage from './error-page.jsx'

import Index from './routes/index.jsx'
import Root from './routes/root.jsx'

import Root_login from './routes/root_login.jsx'
import Login from './routes/login.jsx'
import Register from './routes/register.jsx'

function App(){
	const t = useState("");
	const router = createBrowserRouter([
	  {
	    path: "/",
	    element: <Root_login />,
	    children: [
	      {index: true, element: <Login />},
	      {
	        path: "/register",
	        element: <Register test={"ola"} />,
	      }
	    ]
	  },
	  {
	    path: "/home",
	    element: <Root />,
	    errorElement: <ErrorPage />,
	    children: [
	      { index: true, element: <Index /> },
	    ],
	  },
	]);

	return (<RouterProvider router={router} />);
}

export default App;