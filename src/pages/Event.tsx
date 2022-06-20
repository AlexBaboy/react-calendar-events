import React, {useEffect, useState} from 'react';
import EventCalendar from "../components/EventCalendar";
import {Button, Layout, Modal, Row} from "antd";
import EventForm from "../components/EventForm";
import {useActions} from "../hooks/useActions";
import {useTypedSelector} from "../hooks/useTypedSelector";
import {IEvent} from "../models/IEvent";

const Event = () => {

    const [modalVisible, setModalVisible] = useState(false)
    const { fetchGuests, createEvent, fetchEvents } = useActions()
    const {guests, events} = useTypedSelector(state => state.eventReducer)
    const {user} = useTypedSelector(state => state.authReducer)

    useEffect(()=> {
        fetchGuests()
        fetchEvents(user.username)
    },[])

    const addEvent = (event: IEvent) => {
        setModalVisible(false)
        createEvent(event)
    }

    return (
        <Layout>
            <EventCalendar events={events} />
            <Row justify={'center'}>
                <Button
                    onClick={() => setModalVisible(true)}
                >Add event</Button>
            </Row>
            <Modal
                title={'Add event'}
                visible={modalVisible}
                footer={null}
                onCancel={() => setModalVisible(false)}
                destroyOnClose={true}
            >
                <EventForm
                    guests={guests}
                    submit={addEvent}
                />
            </Modal>
        </Layout>
    );
};

export default Event;
