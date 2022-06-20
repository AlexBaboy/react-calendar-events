import React, {FC, useState} from 'react';
import {Button, Form, Input} from "antd";
import {rules} from "../utils/rules";
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useActions} from "../hooks/useActions";

const LoginForm: FC = () => {

    const {error, isLoading} = useTypedSelector(state => state.authReducer)
    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const {login} = useActions()

    const submit = () => {
        login(username, password)
    }

    return (
        <Form
            onFinish={submit}
        >
            {error && <div style={{color: 'red'}}>
                {error}
            </div>}
            <Form.Item
                label={'username'}
                name={'username'}
                rules={[rules.required('input your username')]}
            >
                <Input value={username}
                       onChange={e => setUserName(e.target.value)}
                />
            </Form.Item>
            <Form.Item
                label={'password'}
                name={'password'}
                rules={[rules.required('input your password')]}
            >
                <Input type={"password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    Enter
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LoginForm;
