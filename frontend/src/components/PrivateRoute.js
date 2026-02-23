import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from 'react-bootstrap';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated, loading } = useAuth();

    return (
        <Route
            {...rest}
            render={props => {
                if (loading) {
                    return (
                        <div className="text-center mt-5">
                            <Spinner animation="border" />
                        </div>
                    );
                }
                
                return isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                );
            }}
        />
    );
};

export default PrivateRoute;
