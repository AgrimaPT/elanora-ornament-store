document.addEventListener("DOMContentLoaded", () => {

    loadFeaturedProducts();

});



async function loadFeaturedProducts() {
    const featuredProductsContainer =
        document.getElementById("featuredProducts");

    // This script may be loaded on pages without featured products.
    if (!featuredProductsContainer) {
        return;
    }

    // Show a message while the API request is in progress.
    featuredProductsContainer.innerHTML = `
        <div class="col-12">
            <p class="featured-products-message" role="status">
                Discovering our favourite pieces...
            </p>
        </div>
    `;

    try {
        const response = await fetch(
            "/api/products/?featured=true"
        );

        if (!response.ok) {
            throw new Error(
                "Failed to load featured products."
            );
        }

        const data = await response.json();

        // DRF pagination returns products inside data.results.
        const products = data.results;

        if (!Array.isArray(products) || products.length === 0) {
            featuredProductsContainer.innerHTML = `
                <div class="col-12">
                    <p class="featured-products-message">
                        Our featured collection is being curated.
                        <a href="/shop/">Explore all pieces</a>
                    </p>
                </div>
            `;

            return;
        }

        const formatPrice = (price) => {
            const amount = Number(price);

            if (!Number.isFinite(amount)) {
                return "Price unavailable";
            }

            return new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2,
            }).format(amount);
        };

        featuredProductsContainer.innerHTML = products
            .map((product) => {
                const image = product.image;
                const categoryName =
                    product.category?.name || "Collection";

                const productName =
                    product.name || "Jewellery piece";

                const imageMarkup = image
                    ? `
                        <img
                            src="${image}"
                            alt="${productName}"
                            class="product-image"
                            loading="lazy"
                            decoding="async"
                        >
                    `
                    : `
                        <div
                            class="product-image-placeholder"
                            role="img"
                            aria-label="Image unavailable for ${productName}"
                        >
                            <i class="bi bi-gem" aria-hidden="true"></i>
                        </div>
                    `;

                return `
                    <div class="col-6 col-lg-3">
                        <a
                            href="/product/${product.slug}/"
                            class="product-card"
                            aria-label="View ${productName}"
                        >
                            <div class="product-image-wrapper">
                                ${imageMarkup}
                            </div>

                            <div class="product-card-content">
                                <span class="product-category">
                                    ${categoryName}
                                </span>

                                <h3>${productName}</h3>

                                <p class="product-price">
                                    ${formatPrice(product.price)}
                                </p>
                            </div>
                        </a>
                    </div>
                `;
            })
            .join("");

        // Replace broken images with a simple fallback.
        featuredProductsContainer
            .querySelectorAll(".product-image")
            .forEach((imageElement) => {
                imageElement.addEventListener(
                    "error",
                    () => {
                        const placeholder =
                            document.createElement("div");

                        placeholder.className =
                            "product-image-placeholder";

                        placeholder.setAttribute("role", "img");
                        placeholder.setAttribute(
                            "aria-label",
                            "Product image unavailable"
                        );

                        placeholder.innerHTML =
                            '<i class="bi bi-gem" aria-hidden="true"></i>';

                        imageElement.replaceWith(placeholder);
                    },
                    { once: true }
                );
            });

    } catch (error) {
        console.error(
            "Error loading featured products:",
            error
        );

        featuredProductsContainer.innerHTML = `
            <div class="col-12">
                <p class="featured-products-message" role="status">
                    We're unable to display our featured collection
                    right now. Please try again later.
                </p>
            </div>
        `;
    }
}
