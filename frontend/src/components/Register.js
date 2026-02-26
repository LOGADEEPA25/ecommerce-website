import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = (props) => {
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        password2: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password2) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            // Use email as username for backend compatibility
            const registrationData = {
                ...formData,
                username: formData.email
            };
            const result = await register(registrationData);
            
            if (result.success) {
                props.history.push('/login');
            } else {
                const errorMsg = typeof result.error === 'object' 
                    ? Object.values(result.error).flat().join(', ')
                    : result.error;
                setError(errorMsg);
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2 className="text-center mb-4">Register</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Enter first name"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Enter last name"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password *</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Create a password"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Confirm Password *</Form.Label>
                    <Form.Control
                        type="password"
                        name="password2"
                        value={formData.password2}
                        onChange={handleChange}
                        required
                        placeholder="Confirm your password"
                    />
                </Form.Group>

                <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Spinner size="sm" className="me-2" />
                            Registering...
                        </>
                    ) : (
                        'Register'
                    )}
                </Button>
            </Form>

            <div className="text-center mt-3">
                <p>
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
