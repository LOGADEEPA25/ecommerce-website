from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from .models import Category, Product


@registry.register_document
class CategoryDocument(Document):
    class Index:
        name = 'categories'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0,
            'analysis': {
                'analyzer': {
                    'standard_custom': {
                        'type': 'standard',
                        'stopwords': '_english_'
                    }
                }
            }
        }

    class Django:
        model = Category
        fields = [
            'category_id',
            'category_name',
            'description',
            'image',
            'inserted_date',
        ]


@registry.register_document
class ProductDocument(Document):
    category_name = fields.TextField(attr='category.category_name')
    category_id = fields.IntegerField(attr='category.category_id')
    
    class Index:
        name = 'products'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0,
            'analysis': {
                'analyzer': {
                    'standard_custom': {
                        'type': 'standard',
                        'stopwords': '_english_'
                    }
                }
            }
        }

    class Django:
        model = Product
        fields = [
            'product_id',
            'product_name',
            'description',
            'image',
            'price',
            'inserted_date',
        ]
