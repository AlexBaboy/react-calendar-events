import React from 'react';
import {Layout, Menu, Row} from "antd";
import {useNavigate} from "react-router-dom";
import {RouteNames} from "../routes";
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useActions} from "../hooks/useActions";

const Navbar = () => {

    const router = useNavigate()
    const {isAuth, user} = useTypedSelector(state => state.authReducer)
    const {logout} = useActions()

    return (
        <Layout.Header>
            <Row justify={'end'}>
                {isAuth ? (
                    <>
                        <div style={{color: 'white', marginTop: '-0.5rem'}}>
                            {user.username}
                        </div>
                        <Menu style={{display: 'flex'}} theme='dark' mode='vertical' selectable={false}>
                            <Menu.Item onClick={logout}
                                       key={1}>
                                Logout
                            </Menu.Item>
                        </Menu>
                    </>
                ) : (
                    <Menu theme='dark' mode='inline' selectable={false}>
                        <Menu.Item onClick={() => router(RouteNames.LOGIN)}
                                   key={1}>
                            Login
                        </Menu.Item>
                    </Menu>
                )}

            </Row>
        </Layout.Header>
    );
};

export default Navbar;
