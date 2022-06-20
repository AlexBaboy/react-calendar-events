import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import {privateRoutes, publicRoutes, RouteNames} from "../routes";
import {useTypedSelector} from "../hooks/useTypedSelector";

const AppRouter = () => {
    const {isAuth} = useTypedSelector(state => state.authReducer)

    const calculatedRoutes = isAuth ? privateRoutes : publicRoutes

    return (
        <>
            <Routes>
                {calculatedRoutes.map(route =>
                    <Route path={route.path}
                           element={<route.component/>}
                           key={route.path}
                    />
                )}
                <Route path='*'
                       element={ <Navigate to={isAuth ? RouteNames.EVENT : RouteNames.LOGIN} /> } />
            </Routes>
        </>
    );
};

export default AppRouter;
