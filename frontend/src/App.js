import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import EcommerceNav from './components/EcommerceNav';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import Products from './components/Products';
import CategoryProducts from './components/CategoryProducts';
import SearchResults from './components/SearchResults';
import PrivateRoute from './components/PrivateRoute';

// Wrap components with withRouter to get history prop
const LoginWithRouter = withRouter(Login);
const RegisterWithRouter = withRouter(Register);

function App() {
    return (
        <AuthProvider>
            <Router>
                <Switch>
                    {/* Auth pages with simple navigation */}
                    <Route exact path="/login" render={(props) => (
                        <>
                            <Navigation />
                            <LoginWithRouter {...props} />
                        </>
                    )} />
                    <Route exact path="/register" render={(props) => (
                        <>
                            <Navigation />
                            <RegisterWithRouter {...props} />
                        </>
                    )} />
                    
                    {/* E-commerce pages with full navigation */}
                    <PrivateRoute exact path="/home" component={() => (
                        <>
                            <EcommerceNav />
                            <HomePage />
                        </>
                    )} />
                    <PrivateRoute exact path="/products" component={() => (
                        <>
                            <EcommerceNav />
                            <Products />
                        </>
                    )} />
                    <PrivateRoute exact path="/category/:categoryId" component={() => (
                        <>
                            <EcommerceNav />
                            <CategoryProducts />
                        </>
                    )} />
                    <PrivateRoute exact path="/search" component={() => (
                        <>
                            <EcommerceNav />
                            <SearchResults />
                        </>
                    )} />
                    <PrivateRoute exact path="/dashboard" component={() => (
                        <>
                            <EcommerceNav />
                            <Dashboard />
                        </>
                    )} />
                    
                    {/* Default redirect */}
                    <Route exact path="/" render={() => <Redirect to="/home" />} />
                </Switch>
            </Router>
        </AuthProvider>
    );
}

export default App;
