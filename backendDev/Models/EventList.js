
// For this class we will be using the Singleton pattern since we are only interested in having one instance of the event list

let instance = undefined

class EventList{

    constructor(){
        this.eventList = {};
        this.eventList["Futebol"] = {}
    }

    static getInstance(){
        if (instance == undefined){
            instance = new EventList();
        }
        return instance;
    }

    addEvent(event){
        this.eventList[event.getSport()][event.getID()] = event;
    }

    changeEventOdd(sport,id){
        
    }

    printList(){
        console.log(this.eventList)
    }

}

module.exports = EventList;