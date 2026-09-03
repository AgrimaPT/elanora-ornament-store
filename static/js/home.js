document.addEventListener("DOMContentLoaded", () => {

    loadFeaturedProducts();

});


async function loadFeaturedProducts() {

    const featuredProductsContainer =
        document.getElementById("featuredProducts");


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


        console.log(
            "Featured products:",
            data
        );


        const products = data.results;


        if (!products || products.length === 0) {

            featuredProductsContainer.innerHTML = `
                <div class="col-12">
                    <p class="text-center">
                        Featured products will be available soon.
                    </p>
                </div>
            `;

            return;
        }


        featuredProductsContainer.innerHTML = products
            .map((product) => {

                const image = product.image;


                return `

                    <div class="col-6 col-lg-3">

                        <a
                            href="/product/${product.slug}/"
                            class="product-card"
                        >

                            <div class="product-image-wrapper">

                                ${
                                    image
                                        ? `
                                            <img
                                                src="${image}"
                                                alt="${product.name}"
                                                class="product-image"
                                            >
                                        `
                                        : `
                                            <div class="product-image-placeholder">
                                                No Image
                                            </div>
                                        `
                                }

                            </div>


                            <div class="product-card-content">

                                <span class="product-category">
                                    ${product.category.name}
                                </span>

                                <h3>
                                    ${product.name}
                                </h3>

                                <p class="product-price">
                                    ₹${Number(
                                        product.price
                                    ).toLocaleString("en-IN")}
                                </p>

                            </div>

                        </a>

                    </div>

                `;

            })
            .join("");


    } catch (error) {

        console.error(
            "Error loading featured products:",
            error
        );


        featuredProductsContainer.innerHTML = `

            <div class="col-12">

                <p class="text-center">
                    Unable to load featured products right now.
                </p>

            </div>

        `;

    }

}

