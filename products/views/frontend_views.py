from django.shortcuts import render


def product_detail(request, slug):

    return render(
        request,
        "products/product_detail.html",
        {
            "slug": slug,
        }
    )

def about(request):
    return render(request, "about.html")

def contact(request):
    return render(
        request,
        "contact.html",
    )