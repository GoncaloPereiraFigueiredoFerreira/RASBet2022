interface SportAPICommunication{
    fetchNewEvents(): void 
    fetchCachedEvents(): void
    updateEvents(events:string[]):void
}