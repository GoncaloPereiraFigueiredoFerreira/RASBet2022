import {Apostador,Transacao,Promocao,Aposta,Evento} from './DBclasses';




export interface IDBCommunication {
    
    registerOnDb : (apostador:Apostador) => Promise<any>;

    transactionOnDb : (transacao: Transacao) => Promise<any>;

    loginOnDb : (email: string, pass: string) => Promise<any>;

    registerEventOnDb : (eventos: Evento[]) => Promise<any>;

    registerBetOnDb : (aposta: Aposta, eventos: {EventoID: string, Desporto: string, Escolha: number}[],codigo:string) => Promise<any>;

    editProfileOnDb : (list: string, email: string) => Promise<any>;
    
    closeEventOnDb: (eventID:string, desporto:string) => Promise<any>;

    finEventOnDb: (eventID: string, desporto: string, resultado: number, descricao: string) => Promise<any>;

    addPromocaoOnDb: (promocao:Promocao) => Promise<any>;

    remPromocaoOnDb: (codigo: string) => Promise<any>;

    getPromocaoOnDb: () => Promise<any>;

    usedCodOnDb: (email:string, codigo: string | null) => Promise<any>;

    profileInfoOnDb: (email:string) => Promise<any>;

    betHistoryOnDb: (email: string) => Promise<any>;

    transHistOnDb: (email: string) => Promise<any>;

    startedEventOnDb: (desporto: string) => Promise<any>;

    walletOnDb: (email:string) => Promise<number>;

    getEventsOnDb: () => Promise<any>;

}