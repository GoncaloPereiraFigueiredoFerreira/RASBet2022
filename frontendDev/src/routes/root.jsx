import { Outlet,Link,useLoaderData,Form,redirect,NavLink,useNavigation} from "react-router-dom";
import Login from "./login";

function getToken(){
  const tokenString = sessionStorage.getItem('token');
  console.log(tokenString);
  const userToken = JSON.parse(tokenString);
  console.log(userToken);
  return userToken?.token;
}

export default function Root() {
  const navigation = useNavigation();
  const token = getToken();

  if(!token){console.log(token);return <Login />;}

  return (
    <>
      <Outlet />
    </>
  );
}