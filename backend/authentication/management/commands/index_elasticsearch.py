from django.core.management.base import BaseCommand
from authentication.documents import CategoryDocument, ProductDocument
from authentication.models import Category, Product


class Command(BaseCommand):
    help = 'Index all categories and products into Elasticsearch'

    def handle(self, *args, **options):
        self.stdout.write('Starting Elasticsearch indexing...')
        
        # Index Categories
        self.stdout.write('Indexing categories...')
        categories = Category.objects.all()
        for category in categories:
            CategoryDocument().update(category)
        self.stdout.write(self.style.SUCCESS(f'Indexed {categories.count()} categories'))
        
        # Index Products
        self.stdout.write('Indexing products...')
        products = Product.objects.all()
        for product in products:
            ProductDocument().update(product)
        self.stdout.write(self.style.SUCCESS(f'Indexed {products.count()} products'))
        
        self.stdout.write(self.style.SUCCESS('Elasticsearch indexing completed!'))
