
//sessionStorage.clear() 

    /**
     * Save Token of the user in localStorage
     * @params token of the user 
     */

export async function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

    /**
     * get Token of the user in localStorage
     * @returns user token
     */

export function getToken(){
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  //const ret = userToken?.token;
  return userToken;
}

    /**
     * Save Role of the user in localStorage
     * @params token of the user 
     */

export async function setRole(userRole) {
  sessionStorage.setItem('role', JSON.stringify(userRole));
}

    /**
     * get Role of the user in localStorage
     * @returns user Role
     */

export function getRole(){
  const tokenString = sessionStorage.getItem('role');
  const userToken = JSON.parse(tokenString);
  //const ret = userToken?.token;
  return userToken;
}

    /**
     * save wallet of the user in localStorage
     * @params user wallet
     */

export async function setWallet(userWallet) {
  sessionStorage.setItem('wallet', JSON.stringify(userWallet));
}

    /**
     * get wallet of the user in localStorage
     * @returns user wallet
     */

export function getWallet(){
  const tokenString = sessionStorage.getItem('wallet');
  const userToken = JSON.parse(tokenString);
  //const ret = userToken?.token;
  return userToken;
}

    /**
     * Funtion that parses the frontend bet so the bacak end can read it
     * @params event
     * @params number that represents the side that the user bet in
     * @returns Parsed bet
     */

export function parseBet(evento,escolha){
  var Nome;
  if(evento.Tipo == "TieEvent") Nome = `${evento.Participantes[0]} - ${evento.Participantes[1]}`;
  else if(evento.Tipo == 'NoTieEvent') Nome = `${evento.Participantes[0]} - ${evento.Participantes[1]}`;
  else if(evento.Tipo == 'RaceEvent') Nome = evento.Liga;

  var desc_aposta;
  if(evento.Tipo == "TieEvent") desc_aposta = (escolha == 2)?"Empate":evento.Participantes[escolha];
  else desc_aposta = evento.Participantes[escolha];

  var ret = {Aposta:{ApostadorID:getToken(),Odd:evento.Odds[escolha],Montante:0,Codigo:""}
            ,Evento:{EventoID:evento.EventoId.toString(),Desporto:"",Escolha:escolha}
            ,Desc:{Evento:Nome,Aposta:desc_aposta}};

  console.log(ret);

  return ret;

}

    /**
     * Funtion that gives current date
     * @returns string with current date from years to seconds
     */

export function getDate(){
  const data = new Date();
  return  data.getFullYear().toString().padStart(4,'0') + "-" + (data.getMonth()+1).toString().padStart(2,'0') + "-" + data.getDate().toString().padStart(2,'0') + " " + data.getHours().toString().padStart(2,'0') + ":" + data.getMinutes().toString().padStart(2,'0') + ":" + data.getSeconds().toString().padStart(2,'0');

}

    /**
     * Funtion that gives current date minus 18 years
     * @returns string with current date minus 18 years from years to seconds
     */

export function getDate_min(){
  const data = new Date();
  return  (data.getFullYear()-18).toString().padStart(4,'0') + "-" + (data.getMonth()+1).toString().padStart(2,'0') + "-" + data.getDate().toString().padStart(2,'0');
}

    /**
     * Funtion that parses a date to a more appealing format
     * @params date 
     * @returns Parsed date
     */

export function parseDate(data){
  return `${data.slice(0,10)} ${data.slice(11,19)}`
}