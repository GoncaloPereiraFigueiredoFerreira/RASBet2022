import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);
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