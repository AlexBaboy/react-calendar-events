import React, {useState} from 'react';
import {IEvent} from "../../models/IEvent";
import styles from './EventsListForm.module.css'
import EventForm from "../EventForm";
import {Modal} from "antd";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {useActions} from "../../hooks/useActions";
import {getEventDetailsFromLocalStorage} from "../../utils/getEventDetails";

const EventsListForm = ({ events, closeListForm }: {events: IEvent[], closeListForm: () => void}) => {

    const [modalEventFormVisible, setModalEventFormVisible] = useState(false)
    const [eventDetails, setEventDetails] = useState<IEvent | null>(null)
    const {guests} = useTypedSelector(state => state.eventReducer)
    const {editEvent} = useActions()

    const openDetails = (id: number | null) => {

        const event = getEventDetailsFromLocalStorage(id || null)
        if (event) {
            setEventDetails(event)
            setModalEventFormVisible(true)
        } else {
            throw new Error('incorrect event!')
        }
    }

    const editEventDetails = (event: IEvent) => {
        setModalEventFormVisible(false)
        editEvent(event)
        closeListForm()
    }

    return (
        <div>
            <div className={`${styles.flexContainer} ${styles.header}`}>
                <div>Description</div>
                <div>Author</div>
            </div>
            {events.map(event =>
                <div key={event.id}
                    className={`${styles.flexContainer} ${styles.row}`}
                    title={'details'}
                    onClick={() => openDetails(event.id)}
                >
                    <div>{event.description}</div>
                    <div>{event.author}</div>
                </div>
            )}

            <Modal
                title={'Event details'}
                visible={modalEventFormVisible}
                footer={null}
                onCancel={() => setModalEventFormVisible(false)}
                destroyOnClose={true}
            >
                {eventDetails && (
                    <EventForm
                        guests={guests}
                        submit={editEventDetails}
                        details={eventDetails as IEvent}
                    />
                )}
            </Modal>
        </div>
    );
};



export default EventsListForm;
