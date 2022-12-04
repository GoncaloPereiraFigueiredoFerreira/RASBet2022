import { useRouteError } from "react-router-dom";

    /**
     * Component that render the error-page
     * @params properties of the component
     * @returns Returns HTML for the component 
     */

export default function ErrorPage() {
  const error = useRouteError();
  //sessionStorage.clear()

  return (
    <>
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <button onClick={()=>(sessionStorage.clear())}> <a href='/'>Regressar ao login</a> </button>  
    </div>
    </>
  );
}