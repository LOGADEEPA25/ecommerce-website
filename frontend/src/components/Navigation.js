import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = (props) => {
    const { user, logout, isAuthenticated } = useAuth();

    const handleLogout = async () => {
        await logout();
        props.history.push('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/">Auth App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {isAuthenticated ? (
                            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {isAuthenticated && (
                            <>
                                <Navbar.Text className="me-3">
                                    Signed in as: <strong>{user?.username}</strong>
                                </Navbar.Text>
                                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default withRouter(Navigation);
