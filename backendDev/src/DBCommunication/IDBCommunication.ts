import {Apostador,Transacao,Promocao,Aposta,Evento} from './DBclasses';




export interface IDBCommunication {
    
    /**
     * this function registers a better with all its values in the table Apostador
     * @param {Apostador} apostador holds all values of an entry to the table Apostador
     * @returns error or success
     */
    registerOnDb : (apostador:Apostador) => Promise<any>;

    /**
     * this function register a transaction made by a better, and updates its balance
     * @param {Transacao} transacao holds all values of an entry to the Transacao table 
     * @returns error or success
     */
    transactionOnDb : (transacao: Transacao) => Promise<any>;
    
    /**
     * this function checks if the given email and password correspond to an entry in either the Funcionario or Apostador table  
     * @param {String} email that was set in the register phase
     * @param {String} pass that was set in the register phase
     * @returns error or email not registed or wrong password or success
     */
    loginOnDb : (email: string, pass: string) => Promise<any>;

    /**
     * this function registers events in the database
     * @param {Evento[]} eventos Set of events 
     * @returns error or success
     */
    registerEventOnDb : (eventos: Evento[]) => Promise<any>;

     /**
     * this function checks if all events are neither closed nor finalized, then registers a transaction, and if a promocional code
     * was submited then it raises the bet amount accordingly, registers the use of the promocional code and registers the bet
     * @param {object} aposta object that contains all values of an entry in Aposta table
     * @param {object} eventos set of objects that contain the ID,Sport and the predicted result of an Event
     * @param {String} codigo string corresponding to the key of an entry in Promocao table
     * @returns success or error
     */
    registerBetOnDb : (aposta: Aposta, eventos: {EventoID: string, Desporto: string, Escolha: number}[],codigo:string) => Promise<any>;

    /**
     * function that updates an entry in the Apostador table
     * @param {string} list of tuples with the key:values pairs to change
     * @param {String} email corresponding to the key to an entry in Apostador table
     * @returns success or error
     */
    editProfileOnDb : (list: string, email: string) => Promise<any>;
    
    /**
     * function that sets the state of an event to CLS and refunds any better that made a bet regarding this event
     * @param {String} eventID of the event that will be closed
     * @param {String} desporto of the event that will be closed
     * @returns success or error
     */
    closeEventOnDb: (eventID:string, desporto:string) => Promise<any>;

    /**
     * function that sets the state of an event to FIN, and gives money to anyone that got the results of all events in a bet
     * @param {String} eventID ID of the event that will be closed
     * @param {String} desporto Sport of the event that will be closed
     * @param {number} resultado Result of the event that will be closed
     * @param {String} descricao Description of the event that will be closed
     * @returns success or error
     */
    finEventOnDb: (eventID: string, desporto: string, resultado: number, descricao: string) => Promise<any>;

    /**
     * function that registers a promocional code in the database
     * @param {Promocao} promocao object with the values of an entry to the Promocao table
     * @returns success or error
     */
    addPromocaoOnDb: (promocao:Promocao) => Promise<any>;

    /**
     * function that removes a promocional code from the database
     * @param {String} codigo key of the promocional code set to removal
     * @returns success or error
     */
    remPromocaoOnDb: (codigo: string) => Promise<any>;

    /**
     * @returns existing promocional codes and their values or error
     */
    getPromocaoOnDb: () => Promise<any>;

    /**
     * function that checks if a given better has already used a promocional code
     * @param {String} email of the better
     * @param {String} codigo of the code to be checked
     * @returns whether the code was used or not or error
     */
    usedCodOnDb: (email:string, codigo: string | null) => Promise<any>;

    /**
     * @param {String} email key to an entry in the Apostador table  
     * @returns values of an entry in the Apostador table or error
     */
    profileInfoOnDb: (email:string) => Promise<any>;

    /**
     * function that returns the history of bets of a given better
     * @param {String} email key to an entry in the Apostador table
     * @returns list of entries in the Aposta table with a few more values or error
     */
    betHistoryOnDb: (email: string) => Promise<any>;

    /**
     * @param {String} email key to an entry in the Transacao table
     * @returns list of entries in Transacao table or error
     */
    transHistOnDb: (email: string) => Promise<any>;

    /**
     * function that returns the events that already started
     * @param {String} desporto key to the Evento table
     * @returns ids of events or error
     */
    startedEventOnDb: (desporto: string) => Promise<any>;

    /**
     * @param {String} email key to an entry in the Apostador table
     * @returns balance of a better or error
     */
    walletOnDb: (email:string) => Promise<number>;

    /**
     * @returns all entries in the Evento table
     */
    getEventsOnDb: () => Promise<any>;

}