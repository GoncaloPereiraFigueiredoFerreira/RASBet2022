import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import "./index.css";
import Root,{ loader as rootLoader,action as rootAction} from './routes/root.jsx';
import ErrorPage from './error-page.jsx'
import Index from './routes/index.jsx'

import Root_login from './routes/root_login.jsx'
import Login from './routes/login.jsx'
import Register from './routes/register.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root_login />,
    children: [
      {index: true, element: <Login />},
      {
        path: "/register",
        element: <Register />,
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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);