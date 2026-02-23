import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Tabs, Tab } from 'react-bootstrap';
import { useLocation, useHistory, Link } from 'react-router-dom';
import api from '../services/api';

const SearchResults = () => {
    const location = useLocation();
    const history = useHistory();
    const [results, setResults] = useState({ categories: [], products: [], total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    
    // Get search query from URL
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || '';

    useEffect(() => {
        if (query) {
            performSearch();
        }
    }, [query, activeTab]);

    const performSearch = async () => {
        setLoading(true);
        setError('');
        
        try {
            const searchType = activeTab === 'all' ? 'all' : activeTab;
            
            const response = await api.get(
                `search/?q=${encodeURIComponent(query)}&type=${searchType}`
            );
            
            setResults(response.data);
        } catch (err) {
            console.error('Search error:', err);
            setError('Failed to perform search. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (categoryId) => {
        history.push(`/category/${categoryId}`);
    };

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Searching...</p>
            </Container>
        );
    }

    return (
        <div className="search-results-page py-4">
            <Container>
                {/* Header */}
                <div className="mb-4">
                    <h2 className="fw-bold">Search Results</h2>
                    <p className="text-muted">
                        {results.total} results found for "<strong>{query}</strong>"
                    </p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                {/* Tabs */}
                <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k)}
                    className="mb-4"
                >
                    <Tab 
                        eventKey="all" 
                        title={`All (${results.total})`}
                    />
                    <Tab 
                        eventKey="categories" 
                        title={`Categories (${results.categories.length})`}
                    />
                    <Tab 
                        eventKey="products" 
                        title={`Products (${results.products.length})`}
                    />
                </Tabs>

                {/* Results */}
                {results.total === 0 ? (
                    <div className="text-center py-5">
                        <h4 className="text-muted">No results found</h4>
                        <p>Try searching with different keywords</p>
                        <Button as={Link} to="/home" variant="primary">
                            Back to Home
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Categories Section */}
                        {(activeTab === 'all' || activeTab === 'categories') && results.categories.length > 0 && (
                            <section className="mb-5">
                                <h4 className="mb-3">Categories</h4>
                                <Row className="g-3">
                                    {results.categories.map((category) => (
                                        <Col key={category.id} xs={12} sm={6} md={4} lg={3}>
                                            <Card 
                                                className="h-100 border-0 shadow-sm cursor-pointer hover-shadow"
                                                onClick={() => handleCategoryClick(category.id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <Card.Body>
                                                    <div className="d-flex align-items-center">
                                                        <span className="fs-2 me-3">📁</span>
                                                        <div>
                                                            <h6 className="fw-bold mb-1">{category.name}</h6>
                                                            <small className="text-muted">
                                                                {category.description?.substring(0, 60)}...
                                                            </small>
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </section>
                        )}

                        {/* Products Section */}
                        {(activeTab === 'all' || activeTab === 'products') && results.products.length > 0 && (
                            <section>
                                <h4 className="mb-3">Products</h4>
                                <Row className="g-3">
                                    {results.products.map((product) => (
                                        <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                                            <Card className="h-100 border-0 shadow-sm product-modern">
                                                <div style={{ height: '180px', overflow: 'hidden' }}>
                                                    <Card.Img 
                                                        variant="top" 
                                                        src={product.image || 'https://via.placeholder.com/300'} 
                                                        style={{ height: '100%', objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <Card.Body>
                                                    <Badge bg="info" className="mb-2">
                                                        {product.category_name}
                                                    </Badge>
                                                    <h6 className="fw-bold mb-1">{product.name}</h6>
                                                    <p className="text-muted small mb-2">
                                                        {product.description?.substring(0, 80)}...
                                                    </p>
                                                    <h5 className="text-primary fw-bold mb-0">
                                                        ${product.price}
                                                    </h5>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </section>
                        )}
                    </>
                )}
            </Container>
        </div>
    );
};

export default SearchResults;
