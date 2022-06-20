import {IEvent} from "../models/IEvent";

export const getEventDetailsFromLocalStorage = (id: number | null) => {
    const events = localStorage.getItem('events') || '[]'
    const jsonEvents = JSON.parse(events) as IEvent[]
    return jsonEvents.find(event => event.id === id);
}
