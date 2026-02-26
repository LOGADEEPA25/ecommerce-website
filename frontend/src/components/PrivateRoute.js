import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from 'react-bootstrap';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated, loading } = useAuth();
    
    // Debug logging
    console.log('PrivateRoute - isAuthenticated:', isAuthenticated, 'loading:', loading);

    if (loading) {
        return (
            <div className="text-center mt-5" style={{ paddingTop: '100px', minHeight: '100vh' }}>
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading authentication...</p>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        console.log('Redirecting to login');
        return <Redirect to="/login" />;
    }
    
    return (
        <Route
            {...rest}
            render={props => {
                console.log('Rendering protected component');
                return <Component {...props} />;
            }}
        />
    );
};

export default PrivateRoute;
