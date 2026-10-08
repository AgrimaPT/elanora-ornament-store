from decimal import Decimal

from django.db.models import Q

from products.models import Product

CATEGORY_ALIASES = {
    "earring": "earrings",
    "earrings": "earrings",
    "necklace": "necklace",
    "necklaces": "necklace",
    "bracelet": "bracelet",
    "bracelets": "bracelet",
    "ring": "rings",
    "rings": "rings",
}

def get_effective_price(product, variant=None):
    """
    Return the price that the customer should pay.
    """

    if variant and variant.price is not None:
        return variant.price

    return product.price


def get_available_variants(product):
    """
    Return active variants that are currently in stock.
    """

    return [
        variant
        for variant in product.variants.all()
        if variant.is_active and variant.stock > 0
    ]


def search_products(
    search=None,
    category=None,
    min_price=None,
    max_price=None,
    available_only=True,
):
    """
    Search the real product catalogue using controlled filters.
    """

    products = (
        Product.objects
        .filter(is_active=True)
        .prefetch_related("variants", "images")
    )

    # --------------------------------
    # Search name and description
    # --------------------------------

    if search:
        search_terms = search.lower().split()

        search_query = Q()

        for term in search_terms:
            # Handle common jewellery wording differences.
            if term == "gold":
                search_query |= Q(name__icontains="gold")
                search_query |= Q(name__icontains="golden")
            else:
                search_query |= Q(name__icontains=term)
                search_query |= Q(description__icontains=term)

        products = products.filter(search_query)

    # --------------------------------
    # Category
    # --------------------------------

    if category:
        category = category.lower().strip()

        category = CATEGORY_ALIASES.get(
            category,
            category,
        )

        products = products.filter(
            category__slug=category
        )

    # --------------------------------
    # Get products
    # --------------------------------

    results = []

    for product in products:

        first_image = product.images.first()

        image_url = None

        if first_image:
            image_url = first_image.image.url

        variants = get_available_variants(product)

        # --------------------------------
        # Product without variants
        # --------------------------------

        if not variants:

            if available_only and product.stock <= 0:
                continue

            price = get_effective_price(product)

            if min_price is not None:
                if price < Decimal(str(min_price)):
                    continue

            if max_price is not None:
                if price > Decimal(str(max_price)):
                    continue

            results.append({
                "id": product.id,
                "name": product.name,
                "slug": product.slug,
                "description": product.description,
                "category": product.category.name,
                "price": float(price),
                "stock": product.stock,
                "image": image_url,
                "variant": None,
            })

            continue

        # --------------------------------
        # Product with variants
        # --------------------------------

        matching_variants = []

        for variant in variants:

            price = get_effective_price(
                product,
                variant,
            )

            if min_price is not None:
                if price < Decimal(str(min_price)):
                    continue

            if max_price is not None:
                if price > Decimal(str(max_price)):
                    continue

            matching_variants.append({
                "id": variant.id,
                "name": variant.name,
                "price": float(price),
                "stock": variant.stock,
            })

        # No variant matched the price filters
        if not matching_variants:
            continue

        results.append({
            "id": product.id,
            "name": product.name,
            "slug": product.slug,
            "description": product.description,
            "category": product.category.name,
            "price": None,
            "stock": None,
            "image": image_url,
            "variants": matching_variants,
        })

    return results

def get_product_details(slug):
    """
    Return detailed information about one product.
    """

    product = (
        Product.objects
        .filter(
            slug=slug,
            is_active=True,
        )
        .prefetch_related(
            "variants",
            "images",
        )
        .first()
    )

    if not product:
        return None

    first_image = product.images.first()

    image_url = None

    if first_image:
        image_url = first_image.image.url

    variants = []

    for variant in product.variants.all():

        if not variant.is_active:
            continue

        price = get_effective_price(
            product,
            variant,
        )

        variants.append({
            "id": variant.id,
            "name": variant.name,
            "price": float(price),
            "stock": variant.stock,
        })

    price = get_effective_price(product)

    return {
        "id": product.id,
        "name": product.name,
        "slug": product.slug,
        "description": product.description,
        "category": product.category.name,
        "price": float(price),
        "stock": product.stock,
        "image": image_url,
        "variants": variants,
    }