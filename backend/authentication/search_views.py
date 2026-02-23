import re
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from elasticsearch_dsl import Q
from .documents import CategoryDocument, ProductDocument

def parse_price_filter(query):
    min_price = None
    max_price = None
    
    # Pattern for "under/below/less than X"
    under_pattern = r'(?:under|below|less than)\s+(\d+(?:\.\d+)?)'
    under_match = re.search(under_pattern, query, re.IGNORECASE)
    if under_match:
        max_price = float(under_match.group(1))
        query = re.sub(under_pattern, '', query, flags=re.IGNORECASE).strip()
    
    # Pattern for "above/over/more than X"
    above_pattern = r'(?:above|over|more than)\s+(\d+(?:\.\d+)?)'
    above_match = re.search(above_pattern, query, re.IGNORECASE)
    if above_match:
        min_price = float(above_match.group(1))
        query = re.sub(above_pattern, '', query, flags=re.IGNORECASE).strip()
    
    # Pattern for range "X-Y" or "X to Y"
    range_pattern = r'(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)'
    range_match = re.search(range_pattern, query, re.IGNORECASE)
    if range_match:
        min_price = float(range_match.group(1))
        max_price = float(range_match.group(2))
        query = re.sub(range_pattern, '', query, flags=re.IGNORECASE).strip()
    
    return query.strip(), min_price, max_price


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search(request):
    
    raw_query = request.GET.get('q', '')
    search_type = request.GET.get('type', 'all')
    
    # Parse price filters from query
    query, parsed_min_price, parsed_max_price = parse_price_filter(raw_query)
    
    min_price = request.GET.get('min_price') or parsed_min_price
    max_price = request.GET.get('max_price') or parsed_max_price
    
    # If query is empty and no price filters, return empty results
    if not query and not (min_price or max_price):
        return Response({
            'categories': [],
            'products': [],
            'total': 0
        })
    
    results = {
        'categories': [],
        'products': [],
        'total': 0
    }
    
    # Search in Categories
    if search_type in ['all', 'categories']:
        # Multi-match query for category name and description
        category_query = Q(
            'multi_match',
            query=query,
            fields=['category_name^3', 'description'],
            type='best_fields',
            fuzziness='AUTO'
        )
        
        category_search = CategoryDocument.search().query(category_query)
        category_response = category_search.execute()
        
        for hit in category_response:
            results['categories'].append({
                'id': hit.category_id,
                'name': hit.category_name,
                'description': hit.description,
                'image': hit.image,
                'score': hit.meta.score
            })
        
        results['total'] += len(results['categories'])
    
    # Search in Products
    if search_type in ['all', 'products']:
        # If query is empty but price filters exist, match all products
        if query:
            # Multi-match query for product name, description, and category name
            product_query = Q(
                'multi_match',
                query=query,
                fields=['product_name^3', 'description^2', 'category_name'],
                type='best_fields',
                fuzziness='AUTO'
            )
            product_search = ProductDocument.search().query(product_query)
        else:
            # Match all products when only price filter is used
            product_search = ProductDocument.search()
        
        # Apply price filters if provided
        if min_price is not None:
            product_search = product_search.filter('range', price={'gte': float(min_price)})
        if max_price is not None:
            product_search = product_search.filter('range', price={'lte': float(max_price)})
        
        product_response = product_search.execute()
        
        for hit in product_response:
            results['products'].append({
                'id': hit.product_id,
                'name': hit.product_name,
                'description': hit.description,
                'price': float(hit.price),
                'image': hit.image,
                'category_id': hit.category_id,
                'category_name': hit.category_name,
                'score': hit.meta.score
            })
        
        results['total'] += len(results['products'])
    
    return Response(results)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_suggestions(request):
    query = request.GET.get('q', '')
    
    if not query or len(query) < 2:
        return Response({'suggestions': []})
    suggestions = []
    
    # Get category suggestions
    category_query = Q(
        'match_phrase_prefix',
        category_name=query
    )
    category_search = CategoryDocument.search().query(category_query)[:5]
    category_response = category_search.execute()
    
    for hit in category_response:
        suggestions.append({
            'type': 'category',
            'id': hit.category_id,
            'name': hit.category_name,
            'description': hit.description[:50] + '...' if len(hit.description) > 50 else hit.description
        })
    
    # Get product suggestions
    product_query = Q(
        'match_phrase_prefix',
        product_name=query
    )
    product_search = ProductDocument.search().query(product_query)[:5]
    product_response = product_search.execute()
    
    for hit in product_response:
        suggestions.append({
            'type': 'product',
            'id': hit.product_id,
            'name': hit.product_name,
            'category': hit.category_name,
            'price': float(hit.price)
        })
    
    return Response({'suggestions': suggestions})
