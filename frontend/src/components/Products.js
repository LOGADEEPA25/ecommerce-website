import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const API_URL = 'http://localhost:8000/api/';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch products and categories from Django backend
            const token = localStorage.getItem('access_token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            
            // For now, we'll use the data from the database
            // You need to create these API endpoints in Django
            const productsResponse = await axios.get(`${API_URL}products/`, { headers });
            const categoriesResponse = await axios.get(`${API_URL}categories/`, { headers });
            
            setProducts(productsResponse.data);
            setCategories(categoriesResponse.data);
        } catch (err) {
            console.error('Error fetching data:', err);
            
            // Fallback: Use sample data if API is not available
            setSampleData();
        } finally {
            setLoading(false);
        }
    };

    const setSampleData = () => {
        // Sample categories
        const sampleCategories = [
            { category_id: 1, category_name: 'Electronics' },
            { category_id: 2, category_name: 'Fashion' },
            { category_id: 3, category_name: 'Home & Kitchen' },
            { category_id: 4, category_name: 'Books' },
            { category_id: 5, category_name: 'Sports & Fitness' },
            { category_id: 6, category_name: 'Beauty & Personal Care' },
            { category_id: 7, category_name: 'Toys & Games' },
            { category_id: 8, category_name: 'Automotive' },
            { category_id: 9, category_name: 'Health & Wellness' },
            { category_id: 10, category_name: 'Jewelry & Watches' },
            { category_id: 11, category_name: 'Pet Supplies' },
            { category_id: 12, category_name: 'Office & Stationery' },
            { category_id: 13, category_name: 'Garden & Outdoor' },
            { category_id: 14, category_name: 'Music & Instruments' },
            { category_id: 15, category_name: 'Baby & Kids' },
        ];

        // Sample products (first 30)
        const sampleProducts = [
            { product_id: 1, product_name: 'Wireless Bluetooth Headphones Pro', category_id: 1, price: 149.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', description: 'Premium noise-cancelling headphones' },
            { product_id: 2, product_name: 'Smart Watch Series 7', category_id: 1, price: 399.99, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400', description: 'Advanced fitness tracking' },
            { product_id: 3, product_name: '4K Ultra HD Smart TV 55 inch', category_id: 1, price: 599.99, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', description: 'Crystal clear display with HDR' },
            { product_id: 4, product_name: 'Gaming Laptop RTX 4070', category_id: 1, price: 1299.99, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400', description: 'High-performance gaming' },
            { product_id: 5, product_name: 'Wireless Earbuds with ANC', category_id: 1, price: 199.99, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', description: 'Active noise cancellation' },
            { product_id: 6, product_name: 'Portable Power Bank 20000mAh', category_id: 1, price: 49.99, image: 'https://images.unsplash.com/photo-1609592424308-64643a5c66c8?w=400', description: 'Fast charging power bank' },
            { product_id: 7, product_name: 'Mechanical Gaming Keyboard', category_id: 1, price: 129.99, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400', description: 'RGB backlit keyboard' },
            { product_id: 8, product_name: 'Wireless Gaming Mouse', category_id: 1, price: 79.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', description: '16000 DPI sensor' },
            { product_id: 9, product_name: 'USB-C Docking Station', category_id: 1, price: 89.99, image: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400', description: '10-in-1 hub' },
            { product_id: 10, product_name: 'Smart Home Security Camera', category_id: 1, price: 59.99, image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=400', description: '1080p WiFi camera' },
            { product_id: 11, product_name: "Men's Classic Denim Jacket", category_id: 2, price: 79.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', description: 'Vintage style denim jacket' },
            { product_id: 12, product_name: "Women's Summer Floral Dress", category_id: 2, price: 49.99, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', description: 'Light and breezy dress' },
            { product_id: 13, product_name: 'Running Shoes Ultra Boost', category_id: 2, price: 129.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', description: 'High-performance running shoes' },
            { product_id: 14, product_name: 'Leather Crossbody Bag', category_id: 2, price: 89.99, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', description: 'Genuine leather bag' },
            { product_id: 15, product_name: 'Aviator Sunglasses Polarized', category_id: 2, price: 59.99, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', description: 'UV400 protection' },
            { product_id: 16, product_name: "Men's Slim Fit Chinos", category_id: 2, price: 44.99, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400', description: 'Comfortable cotton chinos' },
            { product_id: 17, product_name: "Women's Wool Coat", category_id: 2, price: 149.99, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400', description: 'Elegant wool blend coat' },
            { product_id: 18, product_name: 'Canvas Backpack', category_id: 2, price: 54.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', description: 'Durable canvas backpack' },
            { product_id: 19, product_name: 'Silk Necktie Set', category_id: 2, price: 34.99, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400', description: 'Premium silk ties' },
            { product_id: 20, product_name: "Women's Ankle Boots", category_id: 2, price: 99.99, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400', description: 'Stylish leather ankle boots' },
            { product_id: 21, product_name: 'Smart Coffee Maker', category_id: 3, price: 129.99, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400', description: 'Programmable coffee maker' },
            { product_id: 22, product_name: 'Air Fryer 5.8 Quart', category_id: 3, price: 89.99, image: 'https://images.unsplash.com/photo-1626147116986-4601771470a6?w=400', description: 'Digital air fryer' },
            { product_id: 23, product_name: 'Robot Vacuum Cleaner', category_id: 3, price: 399.99, image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400', description: 'Smart mapping robot vacuum' },
            { product_id: 24, product_name: 'Non-Stick Cookware Set', category_id: 3, price: 149.99, image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400', description: '10-piece ceramic cookware' },
            { product_id: 25, product_name: 'Memory Foam Mattress Queen', category_id: 3, price: 499.99, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400', description: 'Cooling gel memory foam' },
            { product_id: 26, product_name: 'LED Desk Lamp with Wireless Charger', category_id: 3, price: 49.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', description: 'Adjustable desk lamp' },
            { product_id: 27, product_name: 'Bamboo Cutting Board Set', category_id: 3, price: 29.99, image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400', description: '3-piece organic bamboo boards' },
            { product_id: 28, product_name: 'Smart Thermostat', category_id: 3, price: 179.99, image: 'https://images.unsplash.com/photo-1563461660947-507ef49e9c47?w=400', description: 'WiFi enabled thermostat' },
            { product_id: 29, product_name: 'Throw Blanket Soft Fleece', category_id: 3, price: 24.99, image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400', description: 'Ultra-soft fleece blanket' },
            { product_id: 30, product_name: 'Stainless Steel Water Bottle', category_id: 3, price: 19.99, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', description: 'Insulated bottle' },
        ];

        setCategories(sampleCategories);
        setProducts(sampleProducts);
    };

    // Filter products based on category and search
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.category_id === parseInt(selectedCategory);
        const matchesSearch = product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.category_id === categoryId);
        return category ? category.category_name : 'Unknown';
    };

    const renderStars = () => {
        return (
            <span className="text-warning">
                {'★★★★☆'}
            </span>
        );
    };

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading products...</p>
            </Container>
        );
    }

    return (
        <div className="products-page py-4">
            <Container>
                {/* Header */}
                <div className="text-center mb-5">
                    <h1 className="fw-bold">All Products</h1>
                    <p className="text-muted">Browse our complete collection of {products.length}+ products</p>
                </div>

                {/* Filters */}
                <Row className="mb-4">
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Filter by Category</Form.Label>
                            <Form.Select 
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.category_id} value={cat.category_id}>
                                        {cat.category_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Search Products</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Search by name or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Results Count */}
                <p className="text-muted mb-4">
                    Showing {filteredProducts.length} of {products.length} products
                </p>

                {/* Products Grid */}
                <Row>
                    {filteredProducts.map((product) => (
                        <Col key={product.product_id} sm={6} lg={3} className="mb-4">
                            <Card className="product-modern h-100 border-0 shadow-sm">
                                <div className="product-image-wrapper position-relative">
                                    <Card.Img 
                                        variant="top" 
                                        src={product.image} 
                                        className="product-image"
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <Badge 
                                        bg="primary"
                                        className="position-absolute top-0 start-0 m-3 rounded-pill"
                                    >
                                        {getCategoryName(product.category_id)}
                                    </Badge>
                                </div>
                                <Card.Body>
                                    <div className="mb-2">
                                        {renderStars()}
                                    </div>
                                    <Card.Title className="h6 mb-2 product-title">{product.product_name}</Card.Title>
                                    <Card.Text className="text-muted small">
                                        {product.description}
                                    </Card.Text>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <span className="h5 mb-0 text-primary fw-bold">${product.price}</span>
                                        <Button 
                                            variant="primary" 
                                            size="sm" 
                                            className="rounded-pill px-3"
                                        >
                                            Add to Cart
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-5">
                        <h4 className="text-muted">No products found</h4>
                        <p>Try adjusting your filters or search query</p>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default Products;
