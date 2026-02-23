#!/usr/bin/env python3
"""
Script to import e-commerce data from JSON to MySQL
"""

import json
import os
import django

# Setup Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'auth_project.settings')
django.setup()

from django.db import connection


def create_tables():
    """Create categories and products tables"""
    with connection.cursor() as cursor:
        # Create categories table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS categories (
                category_id INT PRIMARY KEY AUTO_INCREMENT,
                category_name VARCHAR(100) NOT NULL,
                description TEXT,
                image VARCHAR(500),
                inserted_date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create products table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS products (
                product_id INT PRIMARY KEY AUTO_INCREMENT,
                product_name VARCHAR(200) NOT NULL,
                category_id INT NOT NULL,
                description TEXT,
                image VARCHAR(500),
                price DECIMAL(10, 2) NOT NULL,
                inserted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(category_id)
            )
        """)
        
        print("✅ Tables created successfully!")


def import_data():
    """Import data from JSON file"""
    # Load JSON data
    with open('ecommerce_data.json', 'r') as f:
        data = json.load(f)
    
    with connection.cursor() as cursor:
        # Clear existing data
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
        cursor.execute("TRUNCATE TABLE products")
        cursor.execute("TRUNCATE TABLE categories")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
        
        # Insert categories
        categories_sql = """
            INSERT INTO categories (category_id, category_name, description, image, inserted_date)
            VALUES (%s, %s, %s, %s, %s)
        """
        
        categories_data = [
            (
                cat['category_id'],
                cat['category_name'],
                cat['description'],
                cat['image'],
                cat['inserted_date']
            )
            for cat in data['categories']
        ]
        
        cursor.executemany(categories_sql, categories_data)
        print(f"✅ Inserted {len(categories_data)} categories")
        
        # Insert products
        products_sql = """
            INSERT INTO products (product_id, product_name, category_id, description, image, price, inserted_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        
        products_data = [
            (
                prod['product_id'],
                prod['product_name'],
                prod['category_id'],
                prod['description'],
                prod['image'],
                prod['price'],
                prod['inserted_date']
            )
            for prod in data['products']
        ]
        
        cursor.executemany(products_sql, products_data)
        print(f"✅ Inserted {len(products_data)} products")
        
        # Commit changes
        connection.commit()
        print("\n🎉 Data import completed successfully!")


def verify_data():
    """Verify imported data"""
    with connection.cursor() as cursor:
        # Count categories
        cursor.execute("SELECT COUNT(*) FROM categories")
        cat_count = cursor.fetchone()[0]
        
        # Count products
        cursor.execute("SELECT COUNT(*) FROM products")
        prod_count = cursor.fetchone()[0]
        
        print(f"\n📊 Database Summary:")
        print(f"   - Categories: {cat_count}")
        print(f"   - Products: {prod_count}")
        
        # Show sample data
        print("\n📋 Sample Categories:")
        cursor.execute("SELECT category_id, category_name FROM categories LIMIT 5")
        for row in cursor.fetchall():
            print(f"   {row[0]}. {row[1]}")
        
        print("\n📋 Sample Products:")
        cursor.execute("""
            SELECT p.product_id, p.product_name, c.category_name, p.price 
            FROM products p 
            JOIN categories c ON p.category_id = c.category_id 
            LIMIT 5
        """)
        for row in cursor.fetchall():
            print(f"   {row[0]}. {row[1]} ({row[2]}) - ${row[3]}")


if __name__ == '__main__':
    try:
        print("🚀 Starting data import...\n")
        create_tables()
        import_data()
        verify_data()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
