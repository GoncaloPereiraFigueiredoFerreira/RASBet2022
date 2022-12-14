import {Form} from "react-router-dom"
import {useState} from "react"
import axios from "axios"
import {getDate,getToken} from "../utils"
import {post_request} from "../requests"

    /**
     * Component that render the wallet page
     * @returns Returns HTML for the component 
     */

export default function Wallet() {
    const [input,setInput] = useState({Valor:0});

    /**
     * Post request to add more funds to the user account
     * @returns Returns True if Post sucessed or error data
     */

    function Levantar(){
      var data={Valor:input.Valor,Tipo:"Levantamento_Conta",ApostadorID:getToken(),DataTr:getDate()};
      var resp = post_request('/transaction/',data)
      if (!resp.error) resp = resp.data

    }

    /**
     * Post request to remove funds from the user account
     * @returns Returns True if Post sucessed or error data
     */

    function Depositar(){
      var data={Valor:input.Valor,Tipo:"Deposito_Conta",ApostadorID:getToken(),DataTr:getDate()};
      var resp = post_request('/transaction/',data)
      if (!resp.error) resp = resp.data
    }

  /**
   * Handle changes in the input fields 
   * @param input field that changed
   */

    function handleChange({target}){
      input[target.name] = target.value;
      setInput(input);
    }

  /**
   * Handle submit of a form, send deposit request
   */

    function handleSubmit_DP(){
      const ret = Depositar();
    }

  /**
   * Handle submit of a form, send withdraw request
   */

    function handleSubmit_LV(){
      const ret = Levantar();
    }

    function on() {
      document.getElementById("modo").style.display = "flex";
      }
      
    function off() {
      document.getElementById("modo").style.display = "none";
    }

    function onMBW() {
      document.getElementById("mbway").style.display = "flex";
      offMB();
    }
      
    function offMBW() {
      document.getElementById("mbway").style.display = "none";
    }

    function onMB() {
      document.getElementById("multibanco").style.display = "flex";
      offMBW();
    }
      
    function offMB() {
      document.getElementById("multibanco").style.display = "none";
    }

    function onDep() {
      document.getElementById("depositar").style.display = "flex";
      offRet();
    }
      
    function offDep() {
      document.getElementById("depositar").style.display = "none";
    }

    function onRet() {
      document.getElementById("retirar").style.display = "flex";
      offDep();
    }
      
    function offRet() {
      document.getElementById("retirar").style.display = "none";
    }

    function onS() {
      document.getElementById("selected").style.display = "flex";
    }
      
    function offS() {
      document.getElementById("selected").style.display = "none";
    }

  return (
    <>

      <div className = "box" style={{"marginTop":"20px","paddingTop":"20px"}}>
        <div className = "loginbox" >
          <div className='bemvindo'>
            <p>Wallet</p>
          </div>
          
          <div style={{"display":"flex","flexDirection":"column"}}>
            <button className = "button" style={{"borderRadius":"10px","margin-right":"auto","marginLeft":"auto","width":"fit-content"}} onClick={()=>{on();onRet()}}>Levantar</button>
            <button className = "button" style={{"borderRadius":"10px","margin-right":"auto","marginLeft":"auto","marginTop":"10px","width":"fit-content"}} onClick={()=>{on();onDep()}}>Depositar</button>
          </div>
          <div id="modo" style={{"display":"none","justifyContent":"center","flexDirection":"column","marginTop":"20px"}}>
            <p>Selecionar modo:</p>
            <div style={{"justifyContent":"center","flexDirection":"row"}}>
              <img alt="" src="/MBway.png" style={{"margin":"auto"}} onClick={()=>{onS();onMBW()}}></img>
              <img alt="" src="/multibanco.png" style={{"borderRadius":"20px","margin":"auto"}} onClick={()=>{onS();onMB()}}></img>              
            </div>
          </div>

          <div id="selected" style={{"display":"none","justifyContent":"center","marginTop":"20px"}}>
            <Form id="selected" style={{"justifyContent":"center","marginTop":"20px"}}>
              <input style={{"width":"100%"}} type="text" name="Valor" placeholder='Montante ???' pattern="\d*(\.\d{1,2}|)" onChange={handleChange}/>
              <div id="mbway" style={{"display":"none"}}>
                <input style={{"display":"flex","width":"100%"}} type="text" name="Valor" placeholder='N?? de telemovel' pattern="\d*(\.\d{1,2}|)"/>
              </div>
              <div id="multibanco" style={{"display":"none"}}>
                <input style={{"display":"flex","width":"100%"}} type="text" name="Valor" placeholder='IBAN' pattern="\d*(\.\d{1,2}|)"/>
              </div>
              <button id="depositar"  style={{"display":"none","backgroundColor":"red","width":"fit-content","margin":"auto","textAlign":"center"}} onClick={()=>handleSubmit_DP()}>Depositar</button>
              <button id="retirar"    style={{"display":"none","backgroundColor":"red","width":"fit-content","margin":"auto","textAlign":"center"}} onClick={()=>handleSubmit_LV()}>Levantar</button>
            </Form>
          </div>

        </div>
      </div>
    </>
  );
}