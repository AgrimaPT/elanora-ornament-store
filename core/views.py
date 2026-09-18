from django.shortcuts import render


def home(request):
    return render(request, "home.html")

def shop(request):
    return render(request, "products/shop.html")


def checkout(request):

    return render(
        request,
        "checkout.html",
    )