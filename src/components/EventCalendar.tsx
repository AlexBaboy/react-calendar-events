import React, {FC, useState} from 'react';
import {Calendar, Modal} from "antd";
import {IEvent} from "../models/IEvent";
import {Moment} from "moment";
import {formatDate} from "../utils/date";
import EventForm from "./EventForm";
import {useTypedSelector} from "../hooks/useTypedSelector";
import EventsListForm from "./EventsListForm/EventsListForm";
import {useActions} from "../hooks/useActions";
import {getEventDetailsFromLocalStorage} from "../utils/getEventDetails";

interface EventCalendarProps {
    events: IEvent[]
}

const EventCalendar: FC<EventCalendarProps> = (props) => {

    const [modalEventFormVisible, setModalEventFormVisible] = useState(false)
    const [modalEventFormListVisible, setModalEventFormListVisible] = useState(false)
    const [eventDetails, setEventDetails] = useState<IEvent | null>(null)
    const {guests} = useTypedSelector(state => state.eventReducer)
    const {createEvent, editEvent} = useActions()
    const [checkedEvents, setCheckedEvents] = useState([] as IEvent[])

    const {user} = useTypedSelector(state => state.authReducer)

    const dateCellRender = (value: Moment) => {

        const formattedDate = formatDate(value.toDate())
        const currentDayEvents = props.events.filter(event =>
            event.date === formattedDate
        )

        return (
            <div>
                {currentDayEvents.map( (event, index) =>
                    <div key={index}>
                        {event.description}
                    </div>
                )}
            </div>
        );
    };

    const addEvent = (event: IEvent) => {
        setModalEventFormVisible(false)
        eventDetails ? editEvent(event) : createEvent(event)
    }

    const getEventDetails = (id: number | null) => {
        const event = getEventDetailsFromLocalStorage(id || null)
        if (event) {
            setEventDetails(event)
        } else {
            throw new Error('incorrect event!')
        }
    }

    const onSelectDate = (date: Moment | null) => {

        if (date) {
            const events = localStorage.getItem('events') || '[]'
            const jsonEvents = JSON.parse(events) as IEvent[]
            const currentEvents = jsonEvents.filter(event =>
                event.date === formatDate(date.toDate()) &&
                (
                    event.author === user.username ||
                    event.guest === user.username
                )
            )

            if (currentEvents.length > 1) {
                setCheckedEvents(currentEvents)
                setModalEventFormListVisible(true)
            } else if (currentEvents.length === 1) {
                getEventDetails(currentEvents[0]?.id)
                setModalEventFormVisible(true)
            } else {
                setModalEventFormVisible(true)
            }
        }
    }

    const closeListForm = () => {
        setModalEventFormListVisible(false)
    }

    return (
        <>
            <Calendar
                dateCellRender={dateCellRender}
                onSelect={(date) => onSelectDate(date)}
            />

            <Modal
                title={'Add event'}
                visible={modalEventFormVisible}
                footer={null}
                onCancel={() => setModalEventFormVisible(false)}
                destroyOnClose={true}
            >
                <EventForm
                    guests={guests}
                    submit={addEvent}
                    details={eventDetails as IEvent}
                />
            </Modal>

            <Modal
                title={'List event'}
                visible={modalEventFormListVisible && checkedEvents.length > 0}
                footer={null}
                onCancel={() => setModalEventFormListVisible(false)}
                destroyOnClose={true}
            >
                <EventsListForm
                    events={checkedEvents}
                    closeListForm={closeListForm}
                />
            </Modal>

          </>
    );
};

export default EventCalendar;
