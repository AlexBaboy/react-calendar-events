import {IUser} from "../../../models/IUser";
import {EventActionEnum, SetEventAction, SetGuestsAction} from "./types";
import {IEvent} from "../../../models/IEvent";
import {AppDispatch} from "../../index";
import UserService from "../../../api/UserService";

export const EventActionCreators = {
    setGuests: (payload: IUser[]): SetGuestsAction => ({
        type: EventActionEnum.SET_GUESTS,
        payload
    }),
    setEvents: (payload: IEvent[]): SetEventAction => ({
        type: EventActionEnum.SET_EVENTS,
        payload
    }),
    fetchGuests: () => async (dispatch: AppDispatch) => {
        try {
            const responseUsers = await UserService.getUsers()
            dispatch(EventActionCreators.setGuests(responseUsers.data))
        } catch (e) {
            console.log(e)
        }
    },
    createEvent: (event: IEvent) => async (dispatch: AppDispatch) => {
        try {
            const events = localStorage.getItem('events') || '[]'
            const jsonEvents = JSON.parse(events) as IEvent[]
            jsonEvents.push(event)
            dispatch(EventActionCreators.setEvents(jsonEvents))
            localStorage.setItem('events', JSON.stringify(jsonEvents))
        } catch (e) {
            console.log(e)
        }
    },
    editEvent: (event: IEvent) => async (dispatch: AppDispatch) => {
        try {
            const events = localStorage.getItem('events') || '[]'
            const jsonEvents = JSON.parse(events) as IEvent[]
            const editedEventIndex = jsonEvents.findIndex(jsonEvent => jsonEvent.id === event.id)
            jsonEvents[editedEventIndex] = event
            dispatch(EventActionCreators.setEvents(jsonEvents))
            localStorage.setItem('events', JSON.stringify(jsonEvents))

            console.log('44 event', event)

        } catch (e) {
            console.log(e)
        }
    },
    fetchEvents: (username: string) => async (dispatch: AppDispatch) => {
        try {
            const events = localStorage.getItem('events') || '[]'
            const jsonEvents = JSON.parse(events) as IEvent[]
            const currentUserEvents = jsonEvents.filter(event =>
                event.author === username ||
                event.guest === username
            )
            dispatch(EventActionCreators.setEvents(currentUserEvents))

        } catch (e) {
            console.log(e)
        }
    }
}
