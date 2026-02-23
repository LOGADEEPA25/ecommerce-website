import React, { useState } from 'react';
import { Container, Row, Col, Card, Pagination } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const { user } = useAuth();
    const history = useHistory();

    const categories = [
        { id: 1, name: 'Electronics', icon: '💻', color: '#6366f1', description: 'Latest gadgets, smartphones, laptops' },
        { id: 2, name: 'Fashion', icon: '👕', color: '#ec4899', description: 'Trendy clothing, shoes, accessories' },
        { id: 3, name: 'Home', icon: '🏠', color: '#f59e0b', description: 'Furniture, appliances, kitchen' },
        { id: 4, name: 'Sports', icon: '⚽', color: '#10b981', description: 'Exercise equipment, sports gear' },
        { id: 5, name: 'Beauty', icon: '💄', color: '#8b5cf6', description: 'Skincare, makeup, haircare' },
        { id: 6, name: 'Books', icon: '📚', color: '#ef4444', description: 'Fiction, non-fiction, educational' },
        { id: 7, name: 'Toys', icon: '🎮', color: '#f97316', description: 'Toys, board games, puzzles' },
        { id: 8, name: 'Auto', icon: '🚗', color: '#06b6d4', description: 'Car accessories, tools, parts' },
        { id: 9, name: 'Health', icon: '💊', color: '#84cc16', description: 'Vitamins, supplements, wellness' },
        { id: 10, name: 'Jewelry', icon: '💎', color: '#a855f7', description: 'Watches, rings, necklaces' },
        { id: 11, name: 'Pets', icon: '🐾', color: '#f43f5e', description: 'Pet food, toys, accessories' },
        { id: 12, name: 'Office', icon: '📎', color: '#64748b', description: 'Supplies, stationery, furniture' },
    ];

    const ITEMS_PER_PAGE = 6;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentCategories = categories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleCategoryClick = (categoryId) => {
        history.push(`/category/${categoryId}`);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="homepage-modern py-5">
            <Container>
                {/* Welcome Message */}
                <div className="text-center mb-4">
                    <h2 className="fw-bold">Welcome back, {user?.first_name || user?.username}! 👋</h2>
                    <p className="text-muted">Select a category to start shopping</p>
                </div>

                {/* Categories Section */}
                <section>
                    <div className="text-center mb-4">
                        <h3 className="fw-bold">Shop by Category</h3>
                        <p className="text-muted">Click on any category to explore products</p>
                    </div>
                    
                    {/* Categories Grid - 2 rows x 3 columns */}
                    <Row className="g-3 mb-4">
                        {currentCategories.map((cat) => (
                            <Col key={cat.id} xs={6} md={4}>
                                <Card 
                                    className="category-modern h-100 border-0 shadow-sm text-center cursor-pointer hover-shadow"
                                    onClick={() => handleCategoryClick(cat.id)}
                                    style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                >
                                    <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
                                        <div 
                                            className="category-icon mb-3 d-flex align-items-center justify-content-center"
                                            style={{ 
                                                backgroundColor: cat.color + '20', 
                                                color: cat.color,
                                                width: '70px',
                                                height: '70px',
                                                borderRadius: '50%',
                                                fontSize: '28px'
                                            }}
                                        >
                                            {cat.icon}
                                        </div>
                                        <h6 className="fw-bold mb-2">{cat.name}</h6>
                                        <p className="text-muted small mb-0" style={{ fontSize: '0.85rem' }}>
                                            {cat.description}
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Pagination */}
                    <div className="d-flex justify-content-center">
                        <Pagination>
                            <Pagination.Prev 
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                            />
                            {Array.from({ length: totalPages }, (_, i) => (
                                <Pagination.Item
                                    key={i + 1}
                                    active={i + 1 === currentPage}
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next 
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                    </div>
                </section>
            </Container>
        </div>
    );
};

export default HomePage;
