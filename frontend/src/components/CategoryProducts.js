import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Pagination, Spinner, Alert } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

const CategoryProducts = () => {
    const { categoryId } = useParams();
    const history = useHistory();
    
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    const ITEMS_PER_PAGE = 6;
    const API_URL = 'http://localhost:8000/api/';

    // Sample category data with descriptions
    const categoriesData = {
        1: { name: 'Electronics', icon: '💻', color: '#6366f1', description: 'Latest gadgets, smartphones, laptops, and electronic accessories' },
        2: { name: 'Fashion', icon: '👕', color: '#ec4899', description: 'Trendy clothing, shoes, and accessories for men and women' },
        3: { name: 'Home', icon: '🏠', color: '#f59e0b', description: 'Furniture, appliances, and kitchen essentials for your home' },
        4: { name: 'Sports', icon: '⚽', color: '#10b981', description: 'Exercise equipment, sports gear, and fitness accessories' },
        5: { name: 'Beauty', icon: '💄', color: '#8b5cf6', description: 'Skincare, makeup, haircare, and personal grooming products' },
        6: { name: 'Books', icon: '📚', color: '#ef4444', description: 'Fiction, non-fiction, educational books and e-books' },
        7: { name: 'Toys', icon: '🎮', color: '#f97316', description: 'Toys, board games, puzzles, and gaming accessories for all ages' },
        8: { name: 'Auto', icon: '🚗', color: '#06b6d4', description: 'Car accessories, tools, parts, and maintenance products' },
        9: { name: 'Health', icon: '💊', color: '#84cc16', description: 'Vitamins, supplements, medical supplies, and wellness products' },
        10: { name: 'Jewelry', icon: '💎', color: '#a855f7', description: 'Elegant watches, rings, necklaces, and fine jewelry' },
        11: { name: 'Pets', icon: '🐾', color: '#f43f5e', description: 'Pet food, toys, accessories, and care products' },
        12: { name: 'Office', icon: '📎', color: '#64748b', description: 'Office supplies, stationery, furniture, and equipment' },
    };

    useEffect(() => {
        fetchCategoryData();
    }, [categoryId]);

    const fetchCategoryData = async () => {
        try {
            setLoading(true);
            setCategory(categoriesData[categoryId]);
            
            // Try to fetch from API
            const token = localStorage.getItem('access_token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            
            try {
                const response = await axios.get(`${API_URL}products/?category=${categoryId}`, { headers });
                setProducts(response.data);
            } catch (apiError) {
                // Fallback to sample data
                setSampleProducts();
            }
        } catch (err) {
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const setSampleProducts = () => {
        // Different products for each category
        const categoryProducts = {
            1: [ // Electronics
                { product_id: 1, product_name: 'Wireless Bluetooth Headphones Pro', price: 149.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', description: 'Premium noise-cancelling headphones' },
                { product_id: 2, product_name: 'Smart Watch Series 7', price: 399.99, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400', description: 'Advanced fitness tracking' },
                { product_id: 3, product_name: '4K Ultra HD Smart TV 55 inch', price: 599.99, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', description: 'Crystal clear display with HDR' },
                { product_id: 4, product_name: 'Gaming Laptop RTX 4070', price: 1299.99, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400', description: 'High-performance gaming' },
                { product_id: 5, product_name: 'Wireless Earbuds with ANC', price: 199.99, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', description: 'Active noise cancellation' },
                { product_id: 6, product_name: 'Portable Power Bank 20000mAh', price: 49.99, image: 'https://images.unsplash.com/photo-1609592424308-64643a5c66c8?w=400', description: 'Fast charging power bank' },
                { product_id: 7, product_name: 'Mechanical Gaming Keyboard', price: 129.99, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400', description: 'RGB backlit keyboard' },
                { product_id: 8, product_name: 'Wireless Gaming Mouse', price: 79.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', description: '16000 DPI sensor' },
                { product_id: 9, product_name: 'USB-C Docking Station', price: 89.99, image: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400', description: '10-in-1 hub' },
                { product_id: 10, product_name: 'Smart Home Security Camera', price: 59.99, image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=400', description: '1080p WiFi camera' },
                { product_id: 11, product_name: 'Bluetooth Speaker Waterproof', price: 69.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', description: 'Portable outdoor speaker' },
                { product_id: 12, product_name: 'Wireless Charger Pad', price: 29.99, image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=400', description: 'Fast wireless charging' },
            ],
            2: [ // Fashion
                { product_id: 13, product_name: "Men's Classic Denim Jacket", price: 79.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', description: 'Vintage style denim jacket' },
                { product_id: 14, product_name: "Women's Summer Floral Dress", price: 49.99, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', description: 'Light and breezy dress' },
                { product_id: 15, product_name: 'Running Shoes Ultra Boost', price: 129.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', description: 'High-performance running shoes' },
                { product_id: 16, product_name: 'Leather Crossbody Bag', price: 89.99, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', description: 'Genuine leather bag' },
                { product_id: 17, product_name: 'Aviator Sunglasses Polarized', price: 59.99, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', description: 'UV400 protection' },
                { product_id: 18, product_name: "Men's Slim Fit Chinos", price: 44.99, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400', description: 'Comfortable cotton chinos' },
                { product_id: 19, product_name: "Women's Wool Coat", price: 149.99, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400', description: 'Elegant wool blend coat' },
                { product_id: 20, product_name: 'Canvas Backpack', price: 54.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', description: 'Durable canvas backpack' },
                { product_id: 21, product_name: 'Silk Necktie Set', price: 34.99, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400', description: 'Premium silk ties' },
                { product_id: 22, product_name: "Women's Ankle Boots", price: 99.99, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400', description: 'Stylish leather ankle boots' },
                { product_id: 23, product_name: 'Baseball Cap Classic', price: 24.99, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400', description: 'Adjustable cotton cap' },
                { product_id: 24, product_name: 'Leather Wallet Bifold', price: 39.99, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400', description: 'Genuine leather wallet' },
            ],
            3: [ // Home
                { product_id: 25, product_name: 'Smart Coffee Maker', price: 129.99, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400', description: 'Programmable coffee maker' },
                { product_id: 26, product_name: 'Air Fryer 5.8 Quart', price: 89.99, image: 'https://images.unsplash.com/photo-1626147116986-4601771470a6?w=400', description: 'Digital air fryer' },
                { product_id: 27, product_name: 'Robot Vacuum Cleaner', price: 399.99, image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400', description: 'Smart mapping robot vacuum' },
                { product_id: 28, product_name: 'Non-Stick Cookware Set', price: 149.99, image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400', description: '10-piece ceramic cookware' },
                { product_id: 29, product_name: 'Memory Foam Mattress Queen', price: 499.99, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400', description: 'Cooling gel memory foam' },
                { product_id: 30, product_name: 'LED Desk Lamp with Wireless Charger', price: 49.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', description: 'Adjustable desk lamp' },
                { product_id: 31, product_name: 'Bamboo Cutting Board Set', price: 29.99, image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400', description: '3-piece organic bamboo boards' },
                { product_id: 32, product_name: 'Smart Thermostat', price: 179.99, image: 'https://images.unsplash.com/photo-1563461660947-507ef49e9c47?w=400', description: 'WiFi enabled thermostat' },
                { product_id: 33, product_name: 'Throw Blanket Soft Fleece', price: 24.99, image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400', description: 'Ultra-soft fleece blanket' },
                { product_id: 34, product_name: 'Stainless Steel Water Bottle', price: 19.99, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', description: 'Insulated bottle' },
                { product_id: 35, product_name: 'Electric Kettle Glass', price: 34.99, image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400', description: '1.7L borosilicate glass kettle' },
                { product_id: 36, product_name: 'Bed Sheet Set Cotton', price: 59.99, image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400', description: '100% cotton 4-piece set' },
            ],
            4: [ // Sports
                { product_id: 37, product_name: 'Yoga Mat Premium', price: 39.99, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', description: 'Non-slip exercise mat' },
                { product_id: 38, product_name: 'Dumbbells Set 20kg', price: 89.99, image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=400', description: 'Adjustable weight set' },
                { product_id: 39, product_name: 'Tennis Racket Pro', price: 129.99, image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400', description: 'Carbon fiber racket' },
                { product_id: 40, product_name: 'Basketball Official Size', price: 29.99, image: 'https://images.unsplash.com/photo-1519861531473-920026393112?w=400', description: 'Indoor/outdoor basketball' },
                { product_id: 41, product_name: 'Fitness Tracker Band', price: 49.99, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400', description: 'Heart rate monitor' },
                { product_id: 42, product_name: 'Resistance Bands Set', price: 19.99, image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400', description: '5 levels of resistance' },
                { product_id: 43, product_name: 'Soccer Ball Size 5', price: 24.99, image: 'https://images.unsplash.com/photo-1614632537423-26d03c1cafc1?w=400', description: 'Professional match ball' },
                { product_id: 44, product_name: 'Jump Rope Adjustable', price: 14.99, image: 'https://images.unsplash.com/photo-1591741535018-71c6c7e2f7b7?w=400', description: 'Speed rope with counter' },
                { product_id: 45, product_name: 'Gym Bag Waterproof', price: 44.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', description: 'Large capacity sports bag' },
                { product_id: 46, product_name: 'Foam Roller', price: 22.99, image: 'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=400', description: 'Deep tissue massage roller' },
                { product_id: 47, product_name: 'Cycling Helmet', price: 59.99, image: 'https://images.unsplash.com/photo-1558538336-d0e405035d8a?w=400', description: 'Lightweight safety helmet' },
                { product_id: 48, product_name: 'Protein Shaker Bottle', price: 12.99, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', description: 'Leak-proof mixer bottle' },
            ],
            5: [ // Beauty
                { product_id: 49, product_name: 'Vitamin C Serum 20%', price: 29.99, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400', description: 'Anti-aging serum with hyaluronic acid' },
                { product_id: 50, product_name: 'Electric Toothbrush Smart', price: 79.99, image: 'https://images.unsplash.com/photo-1559671088-795c793c5eb4?w=400', description: 'Sonic toothbrush with pressure sensor' },
                { product_id: 51, product_name: 'Hair Dryer Ionic Pro', price: 59.99, image: 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400', description: 'Professional ionic hair dryer' },
                { product_id: 52, product_name: 'Perfume Eau de Parfum', price: 89.99, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', description: 'Long-lasting luxury fragrance 100ml' },
                { product_id: 53, product_name: 'Beard Grooming Kit', price: 34.99, image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=400', description: 'Complete beard care set' },
                { product_id: 54, product_name: 'Makeup Brush Set 15pcs', price: 24.99, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400', description: 'Professional makeup brushes' },
                { product_id: 55, product_name: 'Organic Shampoo & Conditioner', price: 32.99, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', description: 'Sulfate-free hair care set' },
                { product_id: 56, product_name: 'Face Moisturizer SPF 30', price: 22.99, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400', description: 'Daily moisturizer with sun protection' },
                { product_id: 57, product_name: 'Nail Dryer Lamp LED', price: 19.99, image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400', description: 'Professional UV LED lamp' },
                { product_id: 58, product_name: 'Body Lotion Shea Butter', price: 12.99, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400', description: 'Deep moisturizing body lotion' },
                { product_id: 59, product_name: 'Anti-Aging Eye Cream', price: 39.99, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400', description: 'Reduces dark circles' },
                { product_id: 60, product_name: 'Hair Straightener Ceramic', price: 49.99, image: 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400', description: 'Tourmaline ionic flat iron' },
            ],
            6: [ // Books
                { product_id: 61, product_name: 'The Great Gatsby - Hardcover', price: 18.99, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', description: 'Classic American novel' },
                { product_id: 62, product_name: 'Python Programming Guide', price: 44.99, image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', description: 'Complete programming course' },
                { product_id: 63, product_name: 'Cookbook: Healthy Recipes', price: 29.99, image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400', description: '500+ nutritious recipes' },
                { product_id: 64, product_name: 'World History Encyclopedia', price: 59.99, image: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=400', description: 'Comprehensive history guide' },
                { product_id: 65, product_name: 'Mystery Thriller Collection', price: 24.99, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', description: 'Bestselling crime novels' },
                { product_id: 66, product_name: 'Science for Kids', price: 19.99, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400', description: 'Educational activity book' },
                { product_id: 67, product_name: 'Business Strategy Book', price: 34.99, image: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400', description: 'MBA essentials guide' },
                { product_id: 68, product_name: 'Fantasy Novel Series', price: 49.99, image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400', description: 'Epic fantasy trilogy' },
                { product_id: 69, product_name: 'Meditation Guide', price: 16.99, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', description: 'Mindfulness techniques' },
                { product_id: 70, product_name: 'Art History Book', price: 54.99, image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400', description: 'Renaissance to modern art' },
                { product_id: 71, product_name: 'Travel Guide Europe', price: 27.99, image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400', description: '2024 edition with maps' },
                { product_id: 72, product_name: 'Self-Help Bestseller', price: 21.99, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', description: 'Personal development guide' },
            ],
            7: [ // Toys
                { product_id: 73, product_name: 'LEGO City Police Station', price: 79.99, image: 'https://images.unsplash.com/photo-1585366119957-f973043d4561?w=400', description: '743-piece building set' },
                { product_id: 74, product_name: 'Board Game Strategy', price: 44.99, image: 'https://images.unsplash.com/photo-1610890716171-6b1c9eae1f72?w=400', description: 'Award-winning strategy game' },
                { product_id: 75, product_name: 'Remote Control Car 4WD', price: 69.99, image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400', description: 'High-speed off-road RC car' },
                { product_id: 76, product_name: 'Jigsaw Puzzle 1000 Pieces', price: 19.99, image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400', description: 'Beautiful landscape puzzle' },
                { product_id: 77, product_name: 'Dollhouse Wooden', price: 129.99, image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400', description: 'Furnished dollhouse with LED' },
                { product_id: 78, product_name: 'Video Game Controller', price: 59.99, image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400', description: 'Wireless controller for PC' },
                { product_id: 79, product_name: 'Science Experiment Kit', price: 34.99, image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400', description: '50+ experiments for kids' },
                { product_id: 80, product_name: 'Stuffed Animal Giant', price: 49.99, image: 'https://images.unsplash.com/photo-1556012018-50c5c0da73bf?w=400', description: '3-foot tall plush teddy bear' },
                { product_id: 81, product_name: 'Chess Set Premium', price: 39.99, image: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=400', description: 'Wooden chess set with storage' },
                { product_id: 82, product_name: 'Art Supplies Set 150pcs', price: 29.99, image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400', description: 'Complete art kit' },
                { product_id: 83, product_name: 'Drone with Camera', price: 99.99, image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400', description: 'HD camera quadcopter' },
                { product_id: 84, product_name: 'Building Blocks 1000pcs', price: 54.99, image: 'https://images.unsplash.com/photo-1585366119957-f973043d4561?w=400', description: 'Compatible with major brands' },
            ],
            8: [ // Auto
                { product_id: 85, product_name: 'Car Vacuum Cleaner', price: 34.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', description: '12V portable vacuum' },
                { product_id: 86, product_name: 'Dash Cam 4K', price: 119.99, image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400', description: 'Dual camera with GPS' },
                { product_id: 87, product_name: 'Tire Inflator Portable', price: 49.99, image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400', description: 'Digital air compressor' },
                { product_id: 88, product_name: 'Car Cover Waterproof', price: 59.99, image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400', description: 'All-weather protection' },
                { product_id: 89, product_name: 'Jump Starter Power Bank', price: 89.99, image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400', description: '20000mAh jump starter' },
                { product_id: 90, product_name: 'Seat Covers Leather', price: 79.99, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400', description: 'Universal fit leather covers' },
                { product_id: 91, product_name: 'Bluetooth FM Transmitter', price: 24.99, image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=400', description: 'Car kit with QC3.0 charger' },
                { product_id: 92, product_name: 'Windshield Sun Shade', price: 14.99, image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400', description: 'Foldable reflective protector' },
                { product_id: 93, product_name: 'Car Phone Mount', price: 19.99, image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400', description: 'Dashboard mount with suction' },
                { product_id: 94, product_name: 'Tool Set 200 Pieces', price: 149.99, image: 'https://images.unsplash.com/photo-1581147036324-c17ac41dd161?w=400', description: 'Complete mechanic tool set' },
                { product_id: 95, product_name: 'Car Air Purifier', price: 39.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', description: 'HEPA filter ionizer' },
                { product_id: 96, product_name: 'Floor Mats All-Weather', price: 44.99, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400', description: 'Custom fit rubber mats' },
            ],
            9: [ // Health
                { product_id: 97, product_name: 'Multivitamin Daily', price: 24.99, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', description: 'Complete daily vitamin 180 tablets' },
                { product_id: 98, product_name: 'Protein Powder Whey', price: 54.99, image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400', description: '25g protein per serving 5lbs' },
                { product_id: 99, product_name: 'Blood Pressure Monitor', price: 39.99, image: 'https://images.unsplash.com/photo-1631549916768-4119b2c5f926?w=400', description: 'Digital upper arm monitor' },
                { product_id: 100, product_name: 'First Aid Kit 300pcs', price: 29.99, image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400', description: 'Comprehensive emergency kit' },
                { product_id: 101, product_name: 'Essential Oils Set', price: 34.99, image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400', description: 'Top 8 pure essential oils' },
                { product_id: 102, product_name: 'Heating Pad Electric', price: 27.99, image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400', description: 'Large heating pad auto shut-off' },
                { product_id: 103, product_name: 'Sleep Aid Supplement', price: 19.99, image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400', description: 'Natural melatonin 60 capsules' },
                { product_id: 104, product_name: 'Digital Thermometer', price: 29.99, image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=400', description: 'Non-contact infrared thermometer' },
                { product_id: 105, product_name: 'Massage Gun Deep Tissue', price: 99.99, image: 'https://images.unsplash.com/photo-1615461066842-32561977e3d8?w=400', description: 'Percussion massager 6 attachments' },
                { product_id: 106, product_name: 'Omega-3 Fish Oil', price: 22.99, image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400', description: 'High potency EPA DHA 120 softgels' },
                { product_id: 107, product_name: 'Vitamin D3 5000IU', price: 15.99, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', description: 'Bone health support' },
                { product_id: 108, product_name: 'Probiotics 50 Billion', price: 28.99, image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400', description: 'Digestive health supplement' },
            ],
            10: [ // Jewelry
                { product_id: 109, product_name: 'Gold Necklace 18K', price: 299.99, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', description: 'Elegant chain with pendant' },
                { product_id: 110, product_name: 'Diamond Stud Earrings', price: 499.99, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', description: '0.5 carat 14K white gold' },
                { product_id: 111, product_name: 'Luxury Watch Automatic', price: 899.99, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400', description: 'Swiss made mechanical watch' },
                { product_id: 112, product_name: 'Silver Bracelet Cuff', price: 79.99, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400', description: 'Sterling silver adjustable cuff' },
                { product_id: 113, product_name: 'Engagement Ring Solitaire', price: 2499.99, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', description: '1 carat diamond platinum' },
                { product_id: 114, product_name: 'Pearl Necklace Set', price: 149.99, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', description: 'Freshwater pearls with earrings' },
                { product_id: 115, product_name: 'Smart Watch Rose Gold', price: 199.99, image: 'https://images.unsplash.com/photo-1434056886845-dbe89f8f5d0e?w=400', description: 'Fitness tracker heart rate' },
                { product_id: 116, product_name: 'Mens Wedding Band', price: 89.99, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', description: 'Tungsten carbide brushed finish' },
                { product_id: 117, product_name: 'Charm Bracelet Silver', price: 59.99, image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400', description: 'Build your own with charms' },
                { product_id: 118, product_name: 'Anklet Beach Style', price: 19.99, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400', description: 'Boho beaded with shells' },
                { product_id: 119, product_name: 'Gold Hoop Earrings', price: 129.99, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', description: '14K gold classic hoops' },
                { product_id: 120, product_name: 'Leather Watch Band', price: 34.99, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400', description: 'Genuine leather replacement' },
            ],
            11: [ // Pets
                { product_id: 121, product_name: 'Dog Food Premium', price: 49.99, image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400', description: 'Grain-free natural 25lbs' },
                { product_id: 122, product_name: 'Cat Tree Tower', price: 79.99, image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400', description: 'Multi-level with scratching posts' },
                { product_id: 123, product_name: 'Dog Bed Orthopedic', price: 44.99, image: 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=400', description: 'Memory foam removable cover' },
                { product_id: 124, product_name: 'Pet Grooming Kit', price: 34.99, image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400', description: 'Complete grooming set' },
                { product_id: 125, product_name: 'Automatic Pet Feeder', price: 59.99, image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400', description: 'Programmable with portion control' },
                { product_id: 126, product_name: 'Bird Cage Large', price: 89.99, image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400', description: 'Spacious with perches' },
                { product_id: 127, product_name: 'Fish Tank 20 Gallon', price: 129.99, image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400', description: 'Complete kit with filter LED' },
                { product_id: 128, product_name: 'Pet Carrier Soft', price: 39.99, image: 'https://images.unsplash.com/photo-1541781777621-af13454aa802?w=400', description: 'Airline approved travel carrier' },
                { product_id: 129, product_name: 'Dog Leash Retractable', price: 24.99, image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400', description: '16ft with LED light' },
                { product_id: 130, product_name: 'Cat Litter Box Self-Cleaning', price: 149.99, image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400', description: 'Automatic with odor control' },
                { product_id: 131, product_name: 'Dog Toys Chew Set', price: 19.99, image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400', description: 'Durable rubber toys 5 pack' },
                { product_id: 132, product_name: 'Pet Water Fountain', price: 32.99, image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400', description: 'Automatic filtered water' },
            ],
            12: [ // Office
                { product_id: 133, product_name: 'Ergonomic Office Chair', price: 249.99, image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=400', description: 'Adjustable lumbar support' },
                { product_id: 134, product_name: 'Standing Desk Converter', price: 179.99, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400', description: 'Height adjustable 37 inch' },
                { product_id: 135, product_name: 'Printer All-in-One', price: 149.99, image: 'https://images.unsplash.com/photo-1612815154858-60aa4c43e64e?w=400', description: 'Wireless color with scanner' },
                { product_id: 136, product_name: 'Notebook Set 5 Pack', price: 19.99, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400', description: 'Hardcover lined journals' },
                { product_id: 137, product_name: 'Desk Organizer Bamboo', price: 29.99, image: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=400', description: 'Multi-compartment organizer' },
                { product_id: 138, product_name: 'Whiteboard Magnetic', price: 44.99, image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=400', description: '48x36 inch with markers' },
                { product_id: 139, product_name: 'Stapler Heavy Duty', price: 24.99, image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400', description: 'Commercial 100 sheets' },
                { product_id: 140, product_name: 'Pen Set Luxury', price: 34.99, image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400', description: 'Executive ballpoint gift set' },
                { product_id: 141, product_name: 'Filing Cabinet 2 Drawer', price: 99.99, image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=400', description: 'Steel with lock and wheels' },
                { product_id: 142, product_name: 'Document Shredder', price: 54.99, image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400', description: 'Cross-cut 12 sheets' },
                { product_id: 143, product_name: 'Monitor Stand Riser', price: 29.99, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', description: 'Wood with storage drawer' },
                { product_id: 144, product_name: 'Cable Management Kit', price: 14.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', description: 'Organize cords and cables' },
            ],
        };
        
        // Get products for the current category, or default to empty array
        const productsForCategory = categoryProducts[parseInt(categoryId)] || categoryProducts[1];
        setProducts(productsForCategory);
    };

    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToCategories = () => {
        history.push('/home');
    };

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading products...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <div className="category-products-page py-4">
            <Container>
                {/* Header */}
                <div className="mb-4">
                    <button 
                        className="btn btn-outline-secondary btn-sm mb-3"
                        onClick={handleBackToCategories}
                    >
                        ← Back to Categories
                    </button>
                    <div className="d-flex align-items-center gap-3 mb-2">
                        <div 
                            className="d-flex align-items-center justify-content-center rounded-circle"
                            style={{ 
                                backgroundColor: category?.color + '20', 
                                color: category?.color,
                                width: '60px',
                                height: '60px',
                                fontSize: '28px'
                            }}
                        >
                            {category?.icon}
                        </div>
                        <div>
                            <h2 className="fw-bold mb-0">{category?.name} Products</h2>
                            <p className="text-muted mb-0">{products.length} products available</p>
                        </div>
                    </div>
                    <p className="text-muted mt-2" style={{ fontSize: '1rem' }}>
                        {category?.description}
                    </p>
                </div>

                {/* Products Grid - 2 rows x 3 columns */}
                <Row className="g-3 mb-4">
                    {currentProducts.map((product) => (
                        <Col key={product.product_id} xs={6} md={4}>
                            <Card className="product-modern h-100 border-0 shadow-sm">
                                <div className="product-image-wrapper position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                                    <Card.Img 
                                        variant="top" 
                                        src={product.image} 
                                        style={{ height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title className="h6 mb-2" style={{ fontSize: '0.95rem' }}>
                                        {product.product_name}
                                    </Card.Title>
                                    <Card.Text className="text-muted small flex-grow-1" style={{ fontSize: '0.85rem' }}>
                                        {product.description}
                                    </Card.Text>
                                    <div className="mt-auto">
                                        <span className="h5 mb-0 text-primary fw-bold">${product.price}</span>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Pagination */}
                {totalPages > 1 && (
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
                )}
            </Container>
        </div>
    );
};

export default CategoryProducts;
