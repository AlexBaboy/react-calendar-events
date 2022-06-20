import React, {FC, useState} from 'react';
import {Button, DatePicker, Form, Input, Row, Select} from "antd";
import {rules} from "../utils/rules";
import {IUser} from "../models/IUser";
import {IEvent} from "../models/IEvent";
import moment, {Moment} from "moment";
import {formatDate} from "../utils/date";
import {useTypedSelector} from "../hooks/useTypedSelector";

interface EventFormProps {
    guests: IUser[],
    submit: (event: IEvent) => void,
    details?: IEvent
}

const EventForm: FC<EventFormProps> = (props) => {

    const {details} = props

    const [event, setEvent] = useState<IEvent>({
        author: '',
        date:  '',
        description: '',
        guest: '',
        id: null
    } as IEvent)

    const initialValues = {
        author: details?.author || '',
        date: details?.date ? moment(details?.date, 'DD.MM.YYYY') : null,
        description: details?.description || '',
        guests: details?.guest || '',
        id: details?.id || null
    }

    const { user } = useTypedSelector(state => state.authReducer)

    const selectDate = (date: Moment | null) => {
        if (date) {
            setEvent({
                ...event,
                date: formatDate(date.toDate())
            })
        }
    }

    const submitForm = () => {
        props.submit({
            ...event,
            author: details?.author || user.username,
            id: details?.id || Date.now(),
            description: event.description || details?.description || '',
            date: event.date || details?.date || '',
            guest: event.guest || details?.guest || ''
        })
    }

    return <Form onFinish={submitForm} initialValues={initialValues}>
        <Form.Item
            label={'Event description'}
            name={'description'}
            rules={[rules.required()]}
        >
            <Input
                onChange={e => setEvent({
                            ...event,
                            description: e.target.value
                })}
                disabled={details && user.username !== details.author}
            />
        </Form.Item>
        <Form.Item
            label={'Event date'}
            name={'date'}
            rules={[
                rules.required(),
                rules.isDateAfter()
            ]}
        >
            <DatePicker
                onChange={(date) => selectDate(date)}
                disabled={details && user.username !== details.author}
            />
        </Form.Item>

        <Form.Item
            label={'Event guests'}
            name={'guests'}
            rules={[rules.required()]}
        >
            <Select
                onChange={(guest: string) => setEvent({...event, guest})}
                disabled={details && user.username !== details.author}
            >
                {props.guests.map(guest =>
                    <Select.Option key={guest.username}
                                   value={guest.username}>
                        {guest.username}
                    </Select.Option>
                )}
            </Select>
        </Form.Item>

        {(details && user.username !== details.author) ? null : (
            <Row justify={'end'}>
                <Form.Item>
                    <Button type={'primary'} htmlType={'submit'}>
                        Save
                    </Button>
                </Form.Item>
            </Row>
        )}
    </Form>;
};

export default EventForm;
