import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

const Dashboard = () => {
    const { user, logout, updateUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await authService.getProfile();
            setProfile(response.data);
        } catch (err) {
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
            </div>
        );
    }

    const displayUser = profile || user;

    return (
        <div className="dashboard-container">
            <Card className="profile-card">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Welcome, {displayUser?.first_name || displayUser?.username}!</h2>
                        <Button variant="danger" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Row>
                        <Col md={6}>
                            <p><strong>Username:</strong> {displayUser?.username}</p>
                            <p><strong>Email:</strong> {displayUser?.email}</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>First Name:</strong> {displayUser?.first_name || 'Not set'}</p>
                            <p><strong>Last Name:</strong> {displayUser?.last_name || 'Not set'}</p>
                        </Col>
                    </Row>

                    <hr />

                    <Row className="mt-3">
                        <Col>
                            <p><strong>Member Since:</strong> {new Date(displayUser?.date_joined).toLocaleDateString()}</p>
                        </Col>
                    </Row>

                    <div className="mt-4">
                        <h5>Account Status</h5>
                        <Alert variant="success">
                            ✅ Your account is active and verified!
                        </Alert>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Dashboard;
