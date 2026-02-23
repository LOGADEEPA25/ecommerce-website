import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container, Form, Button, NavDropdown, ListGroup, Spinner } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const EcommerceNav = (props) => {
    const { user, logout, isAuthenticated } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch search suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                const response = await api.get(`search/suggestions/?q=${searchQuery}`);
                setSuggestions(response.data.suggestions);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleLogout = async () => {
        await logout();
        props.history.push('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowSuggestions(false);
            props.history.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setShowSuggestions(false);
        setSearchQuery(suggestion.name);
        if (suggestion.type === 'category') {
            props.history.push(`/category/${suggestion.id}`);
        } else {
            // For products, you might want to go to product detail page
            props.history.push(`/search?q=${encodeURIComponent(suggestion.name)}`);
        }
    };

    return (
        <Navbar bg="white" expand="lg" className="modern-nav py-3 shadow-sm sticky-top">
            <Container>
                {/* Logo */}
                <Navbar.Brand as={Link} to="/home" className="fw-bold fs-3 text-primary">
                    ShopZone
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-nav" />

                <Navbar.Collapse id="main-nav">
                    {/* Search Bar with Suggestions */}
                    <div ref={searchRef} className="position-relative mx-auto my-2 my-lg-0" style={{ maxWidth: '400px', width: '100%' }}>
                        <Form className="d-flex" onSubmit={handleSearch}>
                            <Form.Control
                                type="search"
                                placeholder="Search products & categories..."
                                className="rounded-start-pill border-end-0"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                            />
                            <Button variant="primary" type="submit" className="rounded-end-pill px-4">
                                {loading ? <Spinner size="sm" animation="border" /> : '🔍'}
                            </Button>
                        </Form>
                        
                        {/* Search Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <ListGroup className="position-absolute w-100 shadow-lg" style={{ zIndex: 1050, top: '100%', marginTop: '5px' }}>
                                {suggestions.map((suggestion, index) => (
                                    <ListGroup.Item
                                        key={index}
                                        action
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="d-flex align-items-center"
                                    >
                                        <span className="me-2">
                                            {suggestion.type === 'category' ? '📁' : '📦'}
                                        </span>
                                        <div className="flex-grow-1">
                                            <div className="fw-bold">{suggestion.name}</div>
                                            <small className="text-muted">
                                                {suggestion.type === 'category' 
                                                    ? suggestion.description 
                                                    : `${suggestion.category} • $${suggestion.price}`
                                                }
                                            </small>
                                        </div>
                                        <span className="badge bg-secondary ms-2">
                                            {suggestion.type === 'category' ? 'Category' : 'Product'}
                                        </span>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={Link} to="/products" className="fw-medium">Products</Nav.Link>
                        
                        {isAuthenticated ? (
                            <>
                                {/* User Dropdown - Only Profile with Logout inside */}
                                <NavDropdown 
                                    title={
                                        <span className="d-flex align-items-center">
                                            <span className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                                                {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                                            </span>
                                            <span className="fw-medium">{user?.first_name || user?.username}</span>
                                        </span>
                                    } 
                                    id="user-dropdown"
                                    align="end"
                                    className="ms-2"
                                >
                                    <NavDropdown.Item as={Link} to="/dashboard">👤 Profile</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout} className="text-danger">🚪 Logout</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <div className="d-flex gap-2 ms-3">
                                <Button as={Link} to="/login" variant="outline-primary" className="rounded-pill px-4">
                                    Sign In
                                </Button>
                                <Button as={Link} to="/register" variant="primary" className="rounded-pill px-4">
                                    Sign Up
                                </Button>
                            </div>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default withRouter(EcommerceNav);
