
//sessionStorage.clear() 

export async function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

export function getToken(){
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  //const ret = userToken?.token;
  return userToken;
}

export async function setRole(userRole) {
  sessionStorage.setItem('role', JSON.stringify(userRole));
}

export function getRole(){
  const tokenString = sessionStorage.getItem('role');
  const userToken = JSON.parse(tokenString);
  //const ret = userToken?.token;
  return userToken;
}

export async function setWallet(userWallet) {
  sessionStorage.setItem('wallet', JSON.stringify(userWallet));
}

export function getWallet(){
  const tokenString = sessionStorage.getItem('wallet');
  const userToken = JSON.parse(tokenString);
  //const ret = userToken?.token;
  return userToken;
}

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


export function getDate(){
  const data = new Date();
  return  data.getFullYear().toString().padStart(4,'0') + "-" + data.getMonth().toString().padStart(2,'0') + "-" + data.getDay().toString().padStart(2,'0') + " " + data.getHours().toString().padStart(2,'0') + ":" + data.getMinutes().toString().padStart(2,'0') + ":" + data.getSeconds().toString().padStart(2,'0');

}

export function getDate_min(){
  const data = new Date();
  return  (data.getFullYear()-18).toString().padStart(4,'0') + "-" + data.getMonth().toString().padStart(2,'0') + "-" + data.getDay().toString().padStart(2,'0');
}


export function parseDate(data){
  return `${data.slice(0,10)} ${data.slice(11,19)}`
}